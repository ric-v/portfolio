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
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 font-mono text-[13px]">
          <Link href="/" className="truncate font-semibold text-ink">
            {personal.name.toLowerCase()}
          </Link>
          {current === "lab" && (
            <>
              <span className="text-dim">/</span>
              <span className="text-accent">lab</span>
            </>
          )}
        </div>

        <nav aria-label="Primary" className="flex items-center gap-1 text-[13px]">
          {NAV[current].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="hidden rounded-md px-2.5 py-1 text-ink-soft transition-colors hover:bg-subtle hover:text-ink md:inline-block"
            >
              {label}
            </a>
          ))}
          {current === "home" ? (
            <Link
              href="/lab"
              className="ml-1 inline-flex items-center gap-1.5 rounded-md border border-accent px-2.5 py-1 font-medium text-accent transition-colors hover:bg-accent-soft"
            >
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent motion-safe:animate-pulse" />
              The lab
            </Link>
          ) : (
            <Link
              href="/"
              className="ml-1 rounded-md border border-line-strong px-2.5 py-1 text-ink transition-colors hover:bg-subtle"
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
            className="ml-1 hidden rounded-md bg-ink px-3 py-1 font-medium text-paper transition-opacity hover:opacity-85 sm:inline-block"
          >
            Resume
          </a>
        </nav>
      </div>
    </header>
  );
}
