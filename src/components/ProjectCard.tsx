import { FiArrowUpRight, FiGithub } from "react-icons/fi";
import type { Project } from "@/config/portfolio";

/** A project card. The whole card links to the live site (or source); inner links stay clickable. */
export function ProjectCard({ project: p, compact = false }: { project: Project; compact?: boolean }) {
  const href = p.live ?? p.github;
  return (
    <article
      className={`surface lift group relative flex h-full flex-col rounded-xl border border-line ${compact ? "p-4" : "p-5"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {p.kind && <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-dim">{p.kind}</p>}
          <h3 className="mt-1 font-semibold leading-snug text-ink">
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0 after:rounded-xl">
                {p.title}
              </a>
            ) : (
              p.title
            )}
          </h3>
        </div>
        <FiArrowUpRight
          aria-hidden
          className="mt-0.5 h-4 w-4 shrink-0 text-dim transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
        />
      </div>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{p.description}</p>
      {p.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tech">
          {p.tags.map((t) => (
            <li key={t} className="rounded-md border border-line px-2 py-0.5 font-mono text-[10.5px] text-dim">
              {t}
            </li>
          ))}
        </ul>
      )}
      {(p.github || p.live) && (
        <div className="relative z-10 mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px]">
          {p.github && (
            <a
              href={p.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-dim transition-colors hover:text-ink"
            >
              <FiGithub aria-hidden className="h-3.5 w-3.5" />
              source
              <span className="sr-only"> for {p.title}</span>
            </a>
          )}
          {p.live && (
            <a
              href={p.live}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-dim transition-colors hover:text-ink"
            >
              {p.liveLabel ?? "live"} ↗<span className="sr-only"> ({p.title})</span>
            </a>
          )}
        </div>
      )}
    </article>
  );
}
