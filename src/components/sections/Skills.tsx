import { portfolioConfig } from "@/config/portfolio";
import { Section, revealDelay } from "@/components/ui";

export function Skills() {
  const { skills, education, certifications } = portfolioConfig;

  return (
    <Section
      id="skills"
      eyebrow="Skills & Education"
      title="Toolbox"
      className="border-t border-line"
    >
      <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group, i) => (
          <div key={group.label} data-reveal style={revealDelay(i % 3)}>
            <dt className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-faint">
              {group.label}
            </dt>
            <dd>
              <ul className="flex flex-wrap gap-x-1.5 gap-y-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-line bg-elevated px-2.5 py-1 text-sm text-fg"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-20 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div data-reveal>
          <h3 className="mb-6 text-xl font-semibold tracking-tight text-fg">Education</h3>
          <ul className="space-y-8">
            {education.map((ed) => (
              <li key={ed.school}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="font-medium text-fg">{ed.degree}</p>
                  <p className="font-mono text-xs text-faint">{ed.period}</p>
                </div>
                <p className="mt-0.5 text-sm text-muted">{ed.school}</p>
                {ed.notes && (
                  <ul className="mt-3 space-y-1.5">
                    {ed.notes.map((n) => (
                      <li key={n} className="flex gap-3 text-sm leading-relaxed text-muted">
                        <span aria-hidden className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-faint" />
                        <span>{n}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal style={revealDelay(1)}>
          <h3 className="mb-6 text-xl font-semibold tracking-tight text-fg">Certifications</h3>
          <ul className="divide-y divide-line rounded-2xl border border-line bg-elevated">
            {certifications.map((c) => (
              <li key={c} className="px-5 py-3.5 text-sm text-fg">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
