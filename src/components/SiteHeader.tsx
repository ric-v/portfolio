import Link from "next/link";
import { portfolioConfig } from "@/config/portfolio";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const NAV = {
  home: [
    ["#work", "Experience"],
    ["#skills", "Skills"],
    ["#projects", "Side projects"],
    ["#contact", "Contact"],
  ],
  lab: [
    ["#incidents", "Incidents"],
    ["#how", "How it works"],
    ["#real", "For real"],
  ],
} as const;

export function SiteHeader({ current }: { current: "home" | "lab" }) {
  const { personal } = portfolioConfig;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 font-mono text-[13px]">
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 font-semibold text-ink transition-colors hover:text-accent"
          >
            <span
              aria-hidden
              className="h-2 w-2 rounded-full bg-accent/40 transition-all duration-300 group-hover:scale-125 group-hover:bg-accent"
            />
            <span className="truncate">{personal.name.toLowerCase()}</span>
          </Link>
          {current === "lab" && (
            <>
              <span className="text-dim">/</span>
              <span className="font-semibold text-accent">lab</span>
            </>
          )}
        </div>

        <nav aria-label="Primary" className="flex items-center gap-1 text-[13px]">
          {NAV[current].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="hidden rounded-md px-2.5 py-1 text-ink-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-subtle hover:text-ink active:translate-y-0 md:inline-block"
            >
              {label}
            </a>
          ))}
          {current === "home" ? (
            <Link
              href="/lab"
              className="group ml-1 inline-flex items-center gap-1.5 rounded-md border border-accent/80 bg-accent-soft/30 px-2.5 py-1 font-medium text-accent transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent hover:text-accent-on hover:shadow-[0_2px_12px_-2px_var(--accent)] active:translate-y-0"
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-accent transition-colors group-hover:bg-accent-on motion-safe:animate-pulse"
              />
              The lab
            </Link>
          ) : (
            <Link
              href="/"
              className="ml-1 rounded-md border border-line-strong px-2.5 py-1 text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-subtle active:translate-y-0"
            >
              ← Portfolio
            </Link>
          )}
          <span className="ml-1">
            <ThemeToggle />
          </span>
          <a
            href={personal.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary ml-1 hidden !px-3 !py-1 !text-[13px] sm:inline-block"
          >
            Resume
          </a>
        </nav>
      </div>
    </header>
  );
}
