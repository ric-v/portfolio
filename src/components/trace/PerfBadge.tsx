"use client";

import { useEffect, useState } from "react";

/** Shows how fast *this* page actually loaded for the visitor — real numbers, not decoration. */
export function PerfBadge() {
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => {
    const read = () => {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      if (nav && nav.domContentLoadedEventEnd > 0) {
        setMs(Math.round(nav.domContentLoadedEventEnd - nav.startTime));
      }
    };
    if (document.readyState === "complete") read();
    else window.addEventListener("load", read, { once: true });
    return () => window.removeEventListener("load", read);
  }, []);

  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted"
      title="Time until this page was interactive in your browser"
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--ok)]" />
      {ms === null ? "measuring…" : `served in ${ms}ms`}
    </span>
  );
}
