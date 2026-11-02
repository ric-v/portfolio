"use client";

import {
  formatDuration,
  formatMonth,
  monthIndex,
  services,
  spanMonths,
  spans,
  type Span,
} from "@/config/trace";

export function SpanPanel({ span, onSelect }: { span: Span; onSelect: (id: string) => void }) {
  const svc = services[span.service];
  const parent = spans.find((s) => s.id === span.parentId);
  const children = spans.filter((s) => s.parentId === span.id);
  const startLabel = formatMonth(monthIndex(span.start));
  const endLabel = span.end ? formatMonth(monthIndex(span.end)) : "now";

  return (
    <article
      aria-live="polite"
      className="max-h-none overflow-hidden rounded-lg border border-line bg-elevated lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto"
    >
      <header className="border-b border-line p-5">
        <p className="flex items-center gap-2 font-mono text-[11px]" style={{ color: svc.color }}>
          <span aria-hidden className="h-2 w-2 rounded-sm" style={{ background: svc.color }} />
          {svc.label}
          {parent && (
            <button
              type="button"
              onClick={() => onSelect(parent.id)}
              className="ml-auto text-faint hover:text-fg"
              title="Go to parent span"
            >
              ↑ parent
            </button>
          )}
        </p>
        <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-fg">{span.operation}</h3>
        <p className="mt-1 font-mono text-xs text-muted">
          {startLabel} → {endLabel} · {formatDuration(spanMonths(span))}
          {!span.end && <span className="text-accent"> · running</span>}
        </p>
      </header>

      {span.summary && (
        <div className="space-y-3 border-b border-line p-5 text-[14px] leading-relaxed text-muted">
          {span.summary.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      <section className="border-b border-line p-5">
        <h4 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-faint">attributes</h4>
        <dl className="space-y-1.5 font-mono text-[12px]">
          {Object.entries(span.attributes)
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k} className="grid grid-cols-[120px_1fr] gap-3">
                <dt className="truncate text-faint" title={k}>
                  {k}
                </dt>
                <dd className="text-fg">{v}</dd>
              </div>
            ))}
        </dl>
      </section>

      {span.events && span.events.length > 0 && (
        <section className="border-b border-line p-5">
          <h4 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-faint">
            events <span className="text-faint/70">({span.events.length})</span>
          </h4>
          <ol className="relative space-y-3 border-l border-line pl-4">
            {span.events.map((ev, i) => (
              <li key={i} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[20.5px] top-[7px] h-[7px] w-[7px] rounded-full border border-line-strong bg-elevated"
                />
                <p className="font-mono text-[11px] text-faint">{ev.name}</p>
                {ev.detail && <p className="text-[14px] leading-relaxed text-muted">{ev.detail}</p>}
              </li>
            ))}
          </ol>
        </section>
      )}

      {span.tags && span.tags.length > 0 && (
        <section className="border-b border-line p-5">
          <h4 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-faint">tags</h4>
          <ul className="flex flex-wrap gap-1.5">
            {span.tags.map((t) => (
              <li key={t} className="rounded border border-line px-2 py-0.5 font-mono text-[11px] text-muted">
                {t}
              </li>
            ))}
          </ul>
        </section>
      )}

      {children.length > 0 && (
        <section className="p-5">
          <h4 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-faint">
            child spans <span className="text-faint/70">({children.length})</span>
          </h4>
          <ul className="space-y-1">
            {children.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => onSelect(c.id)}
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[13px] text-muted hover:bg-subtle hover:text-fg"
                >
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 shrink-0 rounded-sm"
                    style={{ background: services[c.service].color }}
                  />
                  <span className="truncate">{c.operation}</span>
                  <span className="ml-auto shrink-0 font-mono text-[11px] text-faint">
                    {formatDuration(spanMonths(c))}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
