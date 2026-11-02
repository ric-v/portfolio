import { portfolioConfig } from "@/config/portfolio";
import { Section, Tag } from "@/components/ui";

export function Experience() {
  const { experience } = portfolioConfig;

  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="Where I've worked"
      intro="Two companies, steady growth: from early-stage startup engineer to leading a team on a production healthcare platform."
      className="border-t border-line"
    >
      <ol className="space-y-16">
        {experience.map((job) => (
          <li key={job.company} className="grid gap-6 md:grid-cols-[220px_1fr] md:gap-10" data-reveal>
            {/* Left rail: company + role progression */}
            <div>
              <p className="font-mono text-xs text-faint">{job.period}</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-fg">{job.company}</h3>
              {job.companyNote && <p className="mt-0.5 text-sm text-faint">{job.companyNote}</p>}
              <p className="mt-1 text-sm text-muted">{job.location}</p>

              <ol className="relative mt-5 space-y-3 border-l border-line pl-4" aria-label="Roles">
                {job.roles.map((role, i) => (
                  <li key={role.title} className="relative">
                    <span
                      aria-hidden
                      className={
                        "absolute -left-[21px] top-1.5 h-2 w-2 rounded-full " +
                        (i === 0 ? "bg-accent ring-4 ring-accent-soft" : "bg-line-strong")
                      }
                    />
                    <p className={i === 0 ? "text-sm font-medium text-fg" : "text-sm text-muted"}>
                      {role.title}
                    </p>
                    <p className="font-mono text-[11px] text-faint">{role.period}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Right: impact */}
            <div className="rounded-2xl border border-line bg-elevated p-6 sm:p-7">
              <p className="text-sm font-medium text-accent">{job.domain}</p>
              <ul className="mt-4 space-y-3">
                {job.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-[15px] leading-relaxed text-muted">
                    <span aria-hidden className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-faint" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
                {job.technologies.map((t) => (
                  <li key={t}>
                    <Tag>{t}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
