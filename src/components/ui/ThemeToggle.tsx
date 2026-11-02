"use client";

import { useSyncExternalStore } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

type Theme = "light" | "dark";

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

const read = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

type ViewTransitionDoc = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

export function ThemeToggle() {
  // null on the server so the icon only renders once we know the real theme.
  const theme = useSyncExternalStore<Theme | null>(subscribe, read, () => null);

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const root = document.documentElement;
    const next: Theme = read() === "dark" ? "light" : "dark";
    const apply = () => {
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {
        /* storage blocked — still switch for this visit */
      }
    };

    const doc = document as ViewTransitionDoc;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!doc.startViewTransition || reduce) {
      root.classList.add("theme-fade");
      apply();
      window.setTimeout(() => root.classList.remove("theme-fade"), 450);
      return;
    }

    // Circular reveal that grows out of the toggle itself.
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    doc.startViewTransition(apply).ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 600, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  };

  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="btn group relative inline-flex h-8 w-8 items-center justify-center !p-0"
    >
      <span className="relative h-4 w-4">
        <FiSun
          aria-hidden
          className={`absolute inset-0 h-4 w-4 transition-all duration-500 ${
            theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"
          }`}
        />
        <FiMoon
          aria-hidden
          className={`absolute inset-0 h-4 w-4 transition-all duration-500 ${
            theme === "light" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-50 opacity-0"
          }`}
        />
      </span>
    </button>
  );
}
