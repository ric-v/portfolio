"use client";

import { useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import type { Experience } from "@/config/portfolio";

/** Year label for a role: explicit `year`, else the first 4-digit year in `period`. */
function yearOf(period: string, year?: string) {
  return year ?? period.match(/\d{4}/)?.[0];
}

/**
 * One employer. The role timeline on the left is clickable: the newest role (default) shows the
 * whole journey at the company; any earlier role shows what was done there and what earned the next step.
 */
export function ExperienceCard({ job }: { job: Experience }) {
  const [selected, setSelected] = useState(0);
  const role = job.roles[selected];
  const next = selected > 0 ? job.roles[selected - 1] : undefined;
  const isLatest = selected === 0;

  return (
    <li
      className="surface grid gap-6 rounded-2xl border border-line p-5 sm:p-7 md:grid-cols-[230px_minmax(0,1fr)]"
      data-reveal
    >
      <div>
        <p className="font-mono text-[11px] text-dim">{job.period}</p>
        <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-ink">
          {job.url ? (
            <a href={job.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
              {job.company} <FiArrowUpRight aria-hidden className="inline h-4 w-4 align-[-2px]" />
            </a>
          ) : (
            job.company
          )}
        </h3>
        {job.companyNote && <p className="text-sm text-dim">{job.companyNote}</p>}
        <p className="mt-1 text-sm text-ink-soft">{job.location}</p>

        <ol className="mt-4 space-y-1 border-l border-line pl-3" aria-label={`Roles at ${job.company}`}>
          {job.roles.map((r, i) => {
            const active = i === selected;
            return (
              <li key={r.title} className="relative">
                <span
                  aria-hidden
                  className={`absolute -left-[17px] top-3.5 h-2 w-2 rounded-full transition-colors ${active ? "bg-accent" : "bg-line-strong"}`}
                />
                <button
                  type="button"
                  onClick={() => setSelected(i)}
                  aria-pressed={active}
                  className={`w-full rounded-md px-2.5 py-1.5 text-left transition-colors hover:bg-subtle ${active ? "bg-accent-soft" : ""}`}
                >
                  <span className={`block text-sm ${active ? "font-medium text-ink" : "text-ink-soft"}`}>{r.title}</span>
                  <span className="block font-mono text-[10.5px] text-dim">
                    {yearOf(r.period, r.year) ? (
                      <>
                        <span className={active ? "text-accent" : ""}>{yearOf(r.period, r.year)}</span> · {r.period}
                      </>
                    ) : (
                      r.period
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        {job.roles.length > 1 && (
          <p className="mt-3 text-[11px] text-dim">Select a role to see how I got to the next one.</p>
        )}
      </div>

      <div aria-live="polite">
        <p className="text-sm font-medium text-accent">{job.domain}</p>

        {isLatest ? (
          <>
            {job.journey && (
              <>
                <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.12em] text-dim">My journey here</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{job.journey}</p>
              </>
            )}
            <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.12em] text-dim">
              {role.title} · {role.period}
            </p>
            <ul className="mt-2 space-y-2.5">
              {[...(role.did ?? []), ...job.highlights].map((h) => (
                <Bullet key={h}>{h}</Bullet>
              ))}
            </ul>
          </>
        ) : (
          <>
            <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.12em] text-dim">
              {role.title} · {role.period}
            </p>
            {role.did && role.did.length > 0 && (
              <ul className="mt-2 space-y-2.5">
                {role.did.map((h) => (
                  <Bullet key={h}>{h}</Bullet>
                ))}
              </ul>
            )}
            {next && (
              <div className="mt-5 rounded-xl border border-line bg-subtle p-4">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-accent">
                  Promoted to {next.title} · {next.period.split("—")[0].trim()}
                </p>
                {role.promotion && role.promotion.length > 0 && (
                  <ul className="mt-2 space-y-2">
                    {role.promotion.map((h) => (
                      <Bullet key={h}>{h}</Bullet>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </>
        )}

        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
          {job.technologies.map((t) => (
            <li key={t} className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-ink-soft">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-[15px] leading-relaxed text-ink-soft">
      <span aria-hidden className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-dim" />
      <span>{children}</span>
    </li>
  );
}
