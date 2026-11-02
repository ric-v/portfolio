"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  depthOf,
  formatDuration,
  formatMonth,
  monthIndex,
  nowMonthIndex,
  orderedSpans,
  services,
  spanMonths,
  type Span,
} from "@/config/trace";
import { cn } from "@/lib/utils";
import { SpanPanel } from "./SpanPanel";

const ROWS = orderedSpans();
const DEFAULT_SPAN = "worklife";

export function TraceView() {
  const now = nowMonthIndex();
  const rangeStart = monthIndex("2014-01");
  const rangeEnd = now + 4;
  const total = rangeEnd - rangeStart;

  const [selectedId, setSelectedId] = useState(DEFAULT_SPAN);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [hover, setHover] = useState<{ left: number; month: number } | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Grow the bars in once after first paint.
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    ROWS.forEach((s) => s.tags?.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, []);

  const select = useCallback((id: string, opts?: { reveal?: boolean }) => {
    setSelectedId(id);
    rowRefs.current[id]?.focus({ preventScroll: true });
    // On narrow screens the panel sits below the waterfall — bring it into view.
    if (opts?.reveal && window.matchMedia("(max-width: 1023px)").matches) {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // j/k or arrow keys move through spans; Esc clears the tag filter.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, [contenteditable]")) return;
      const idx = ROWS.findIndex((s) => s.id === selectedId);
      const inWaterfall = target.closest("[data-waterfall]") !== null;
      if (e.key === "j" || (inWaterfall && e.key === "ArrowDown")) {
        e.preventDefault();
        select(ROWS[Math.min(ROWS.length - 1, idx + 1)].id);
      } else if (e.key === "k" || (inWaterfall && e.key === "ArrowUp")) {
        e.preventDefault();
        select(ROWS[Math.max(0, idx - 1)].id);
      } else if (e.key === "Escape") {
        setActiveTag(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, select]);

  const onTrackMove = (e: React.MouseEvent) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < 0 || x > rect.width) return setHover(null);
    setHover({ left: track.offsetLeft + x, month: Math.round(rangeStart + (x / rect.width) * total) });
  };

  const pct = (m: number) => ((m - rangeStart) / total) * 100;
  const years: number[] = [];
  for (let y = Math.ceil(rangeStart / 12); y * 12 <= rangeEnd; y++) years.push(y);

  const selected = ROWS.find((s) => s.id === selectedId) ?? ROWS[0];
  const matches = (s: Span) => !activeTag || s.tags?.includes(activeTag);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="min-w-0">
        {/* Tag filter */}
        <div className="mb-4 flex flex-wrap items-center gap-1.5" aria-label="Filter spans by technology">
          <span className="mr-1 font-mono text-[11px] uppercase tracking-wider text-faint">filter</span>
          {tagCounts.map(([tag, count], i) => (
            <button
              key={tag}
              type="button"
              aria-pressed={activeTag === tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={cn(
                "rounded border px-2 py-0.5 font-mono text-[11px] transition-colors",
                i >= 8 && activeTag !== tag && "hidden sm:inline-block",
                activeTag === tag
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line text-muted hover:border-line-strong hover:text-fg",
              )}
            >
              {tag} <span className="text-faint">×{count}</span>
            </button>
          ))}
          {activeTag && (
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className="ml-1 font-mono text-[11px] text-faint underline underline-offset-2 hover:text-fg"
            >
              clear
            </button>
          )}
        </div>

        <div
          data-waterfall
          className="relative overflow-hidden rounded-lg border border-line bg-elevated"
          onMouseMove={onTrackMove}
          onMouseLeave={() => setHover(null)}
        >
          {/* Axis */}
          <div className="grid grid-cols-1 border-b border-line md:grid-cols-[290px_minmax(0,1fr)]">
            <div className="hidden px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-faint md:block">
              service · operation
            </div>
            <div ref={trackRef} className="relative h-8 mx-3 md:mx-0 md:mr-4">
              {years.map((y) => (
                <span
                  key={y}
                  className={cn(
                    "absolute top-2 -translate-x-1/2 font-mono text-[10px] text-faint",
                    y % 2 === 1 && "hidden sm:block",
                  )}
                  style={{ left: `${pct(y * 12)}%` }}
                >
                  {String(y).slice(2).padStart(2, "0")}
                  <span className="hidden sm:inline">′</span>
                </span>
              ))}
            </div>
          </div>

          {/* Rows */}
          <ol aria-label="Career trace spans">
            {ROWS.map((span) => {
              const depth = depthOf(span);
              const svc = services[span.service];
              const start = monthIndex(span.start);
              const end = span.end ? monthIndex(span.end) + 1 : now + 1;
              const left = pct(start);
              const width = Math.max(pct(end) - left, 0.8);
              const isSelected = span.id === selectedId;
              const dim = !matches(span);

              return (
                <li key={span.id}>
                  <button
                    ref={(el) => {
                      rowRefs.current[span.id] = el;
                    }}
                    type="button"
                    aria-current={isSelected ? "true" : undefined}
                    onClick={() => select(span.id, { reveal: true })}
                    className={cn(
                      "group grid w-full grid-cols-1 items-center border-b border-line/60 text-left transition-[background-color,opacity] last:border-b-0 md:grid-cols-[290px_minmax(0,1fr)]",
                      isSelected ? "bg-accent-soft" : "hover:bg-subtle",
                      dim && "opacity-30",
                    )}
                  >
                    <span
                      className="flex min-w-0 items-center gap-2 px-3 pt-2.5 md:py-2.5"
                      style={{ paddingLeft: `${12 + depth * 14}px` }}
                    >
                      <span
                        aria-hidden
                        className="h-2 w-2 shrink-0 rounded-sm"
                        style={{ background: svc.color }}
                      />
                      <span className="shrink-0 font-mono text-[11px]" style={{ color: svc.color }}>
                        {svc.label}
                      </span>
                      <span
                        className={cn(
                          "truncate text-[13px]",
                          isSelected ? "text-fg" : "text-muted group-hover:text-fg",
                        )}
                      >
                        {span.operation}
                      </span>
                    </span>

                    <span className="relative mx-3 my-2.5 block h-5 md:mx-0 md:mr-4">
                      <span
                        className="absolute inset-y-0 rounded-[3px] transition-[width] duration-700 ease-out motion-reduce:transition-none"
                        style={{
                          left: `${left}%`,
                          width: mounted ? `${width}%` : "0%",
                          background: svc.color,
                          opacity: isSelected ? 1 : 0.78,
                          transitionDelay: `${ROWS.indexOf(span) * 45}ms`,
                        }}
                      >
                        {!span.end && (
                          <span
                            aria-hidden
                            className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-fg motion-safe:animate-pulse"
                          />
                        )}
                      </span>
                      <span
                        className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap pl-2 font-mono text-[11px] text-muted"
                        style={
                          left + width <= 78
                            ? { left: `${left + width}%` }
                            : left >= 22
                              ? { right: `${100 - left}%`, paddingRight: 8, paddingLeft: 0 }
                              : { right: `${100 - left - width}%`, paddingRight: 14, color: "var(--bg)" }
                        }
                      >
                        {formatDuration(spanMonths(span, now))}
                        {!span.end && left >= 22 && <span className="text-accent"> · running</span>}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Hover crosshair (desktop) */}
          {hover && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 hidden w-px bg-fg/30 md:block"
              style={{ left: hover.left }}
            >
              <span className="absolute top-1.5 left-1.5 whitespace-nowrap rounded bg-fg px-1.5 py-0.5 font-mono text-[10px] text-bg">
                {formatMonth(hover.month)}
              </span>
            </div>
          )}
        </div>

        <p className="mt-3 hidden font-mono text-[11px] text-faint sm:block">
          click a span · <kbd className="text-muted">j</kbd>/<kbd className="text-muted">k</kbd> to step through ·
          hover the timeline for dates
        </p>
      </div>

      <div ref={panelRef} className="scroll-mt-20 lg:sticky lg:top-20 lg:self-start">
        <SpanPanel span={selected} onSelect={(id) => select(id)} />
      </div>
    </div>
  );
}
