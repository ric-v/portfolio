import { portfolioConfig } from "@/config/portfolio";
import { Section, revealDelay } from "@/components/ui";

export function About() {
  const { about } = portfolioConfig;

  return (
    <Section id="about" eyebrow="About" title="Engineer first, lead by example.">
      <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr]">
        <div className="space-y-5 text-base leading-relaxed text-muted sm:text-[17px]">
          {about.paragraphs.map((p, i) => (
            <p key={i} data-reveal style={revealDelay(i)}>
              {p}
            </p>
          ))}
        </div>

        <div>
          <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-faint" data-reveal>
            What I focus on
          </h3>
          <ul className="space-y-3">
            {about.focusAreas.map((area, i) => (
              <li
                key={area.title}
                className="rounded-xl border border-line bg-elevated p-4"
                data-reveal
                style={revealDelay(i)}
              >
                <p className="font-medium text-fg">{area.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{area.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
