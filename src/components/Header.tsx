"use client";

import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { ThemeToggle } from "./ThemeToggle";
import { portfolioConfig } from "@/config/portfolio";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

export function Header() {
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Scroll-spy: highlight the section currently in view.
  useEffect(() => {
    const sections = NAV_ITEMS.map(({ id }) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    sections.forEach((s) => observer.observe(s));

    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      if (window.scrollY < 200) setActive("");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        open
          ? "border-b border-line bg-bg"
          : scrolled
            ? "border-b border-line bg-bg/80 backdrop-blur-md"
            : "border-b border-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8"
      >
        <a
          href="#top"
          className="font-mono text-sm font-medium tracking-tight text-fg"
          onClick={() => setOpen(false)}
        >
          {portfolioConfig.personal.name.toLowerCase().replace(" ", ".")}
        </a>

        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? "location" : undefined}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm transition-colors",
                    active === id ? "bg-subtle text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={portfolioConfig.personal.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 hidden rounded-full bg-fg px-4 py-1.5 text-sm font-medium text-bg transition-opacity hover:opacity-85 sm:inline-flex"
          >
            Resume
          </a>

          <ThemeToggle />

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted hover:text-fg md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <FiX className="h-4 w-4" aria-hidden /> : <FiMenu className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-line md:hidden">
          <ul className="mx-auto flex max-w-5xl flex-col px-5 py-3">
            {NAV_ITEMS.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-lg px-3 py-3 text-base",
                    active === id ? "text-fg" : "text-muted",
                  )}
                >
                  {label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={portfolioConfig.personal.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-3 text-base font-medium text-accent"
              >
                Resume ↗
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
