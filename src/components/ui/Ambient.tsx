"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Page-wide polish that needs JS:
 *  - a cursor-following spotlight on `.lift`, `.surface`, and wireframe areas (writes --mx / --my),
 *  - global cursor tracking (--mouse-x, --mouse-y) for ambient wireframe backdrops,
 *  - velocity detection for dynamic motion indications,
 *  - scroll reveals for `[data-reveal]` elements,
 *  - a hello for anyone who opens devtools.
 */
export function Ambient() {
  const pathname = usePathname();

  useEffect(() => {
    let frame = 0;
    let lastTime = 0;
    let lastX = 0;
    let lastY = 0;
    let stopTimer: ReturnType<typeof setTimeout>;

    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const root = document.documentElement;

        // Global mouse coordinates for viewport-wide wireframe backdrops
        root.style.setProperty("--mouse-x", `${e.clientX}px`);
        root.style.setProperty("--mouse-y", `${e.clientY}px`);

        // Compute speed / motion velocity to indicate activity
        const now = performance.now();
        const dt = Math.max(1, now - lastTime);
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const speed = Math.min((Math.hypot(dx, dy) / dt) * 8, 30);
        lastTime = now;
        lastX = e.clientX;
        lastY = e.clientY;

        root.style.setProperty("--motion-speed", speed.toFixed(2));
        root.classList.add("is-pointer-moving");

        clearTimeout(stopTimer);
        stopTimer = setTimeout(() => {
          root.classList.remove("is-pointer-moving");
          root.style.setProperty("--motion-speed", "0");
        }, 180);

        // Card / surface relative coordinates
        const card = (e.target as Element | null)?.closest?.<HTMLElement>(
          ".lift, .surface, [data-wireframe], .interactive-surface"
        );
        if (card) {
          const r = card.getBoundingClientRect();
          card.style.setProperty("--mx", `${(e.clientX - r.left).toFixed(1)}px`);
          card.style.setProperty("--my", `${(e.clientY - r.top).toFixed(1)}px`);
        }
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
      clearTimeout(stopTimer);
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
