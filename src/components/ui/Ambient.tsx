"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Page-wide polish that needs JS:
 *  - a cursor-following spotlight on `.lift` cards (writes --mx / --my),
 *  - scroll reveals for `[data-reveal]` elements,
 *  - a hello for anyone who opens devtools.
 */
export function Ambient() {
  const pathname = usePathname();

  useEffect(() => {
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.<HTMLElement>(".lift");
      if (!card) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Re-run on route change so newly rendered sections get observed.
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            io.unobserve(en.target);
          }
        }),
      { rootMargin: "0px 0px -6% 0px", threshold: 0.04 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    console.log(
      "%cHey, fellow engineer 👋%c\nYou found the console. The lab's simulation lives in src/lib/chaos.ts — github.com/ric-v/portfolio",
      "font: 600 14px system-ui; color: #4f46e5",
      "font: 12px ui-monospace, monospace; color: inherit",
    );
  }, []);

  return null;
}
