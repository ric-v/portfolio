import type { ReactNode } from "react";

export function fmtMs(ms: number) {
  if (ms >= 1000) return `${(ms / 1000).toFixed(ms >= 9950 ? 0 : 1)}s`;
  if (ms < 10) return `${ms.toFixed(1)}ms`;
  return `${Math.round(ms)}ms`;
}

export function fmtT(t: number) {
  const s = Math.floor(t);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function Panel({
  title,
  right,
  children,
  className = "",
  focused,
  id,
}: {
  title?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  focused?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`rounded-xl border bg-panel transition-shadow ${
        focused ? "border-accent shadow-[0_0_0_3px_var(--accent-soft)]" : "border-line"
      } ${className}`}
    >
      {(title || right) && (
        <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">{title}</h3>
          {right}
        </header>
      )}
      {children}
    </section>
  );
}

export function Sparkline({
  values,
  min,
  max,
  color = "var(--ink)",
  length,
  threshold,
}: {
  values: number[];
  min: number;
  max: number;
  color?: string;
  length: number;
  threshold?: number;
}) {
  const y = (v: number) => 23 - ((Math.min(max, Math.max(min, v)) - min) / (max - min || 1)) * 22;
  const pts = values.map((v, i) => `${((i / (length - 1)) * 100).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  return (
    <svg viewBox="0 0 100 24" preserveAspectRatio="none" className="h-6 w-full" aria-hidden>
      {threshold !== undefined && (
        <line x1={0} x2={100} y1={y(threshold)} y2={y(threshold)} stroke="var(--line-strong)" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
      )}
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
