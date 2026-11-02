"use client";

import { useEffect, useState } from "react";

/** "Rendered in 84ms" — measured in the visitor's own browser. */
export function PerfNote() {
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => {
    const read = () => {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      if (nav && nav.domContentLoadedEventEnd > 0) setMs(Math.round(nav.domContentLoadedEventEnd - nav.startTime));
    };
    if (document.readyState === "complete") read();
    else window.addEventListener("load", read, { once: true });
    return () => window.removeEventListener("load", read);
  }, []);

  if (ms === null) return null;
  return (
    <span className="inline-flex items-center gap-1.5 font-mono" title="Measured in your browser">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ok" />
      this page was interactive in {ms}ms — practising what I preach
    </span>
  );
}
