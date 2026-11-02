import { portfolioConfig, yearsOfExperience } from "@/config/portfolio";
import { Lab } from "@/components/chaos/Lab";

const REAL_WORLD = [
  {
    lever: "latency budgets & timeouts",
    proof: "Kept real-time pharmacy-claim processing under 100ms at high request volume.",
    where: "Worklife Tech",
  },
  {
    lever: "slow database",
    proof: "Re-engineered PostgreSQL functions, cutting 50–500ms off individual queries.",
    where: "Worklife Tech",
  },
  {
    lever: "write overload",
    proof: "Built a Java ASM Cassandra writer: 10× faster inserts, no slow-query build-up under sustained load.",
    where: "Algomox",
  },
  {
    lever: "throughput",
    proof: "Go telemetry collectors load-tested past 10,000 metrics per second.",
    where: "Algomox",
  },
  {
    lever: "observability",
    proof: "Containerisation, telemetry and real-time monitoring on Azure — a 60% efficiency gain.",
    where: "Worklife Tech",
  },
];

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mb-5 scroll-mt-6 text-xs uppercase tracking-widest text-dim">
      {children}
    </h2>
  );
}

export default function Home() {
  const { personal, experience, projects, skills, education, contact } = portfolioConfig;

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <header className="mb-14 flex flex-wrap items-baseline justify-between gap-3 text-sm">
        <span className="font-bold">{personal.name.toLowerCase()}</span>
        <nav aria-label="Primary" className="flex flex-wrap gap-x-4 gap-y-1 text-dim">
          <a href="#lab">lab</a>
          <a href="#real">real world</a>
          <a href="#work">work</a>
          <a href="#contact">contact</a>
          <a href={personal.resumeUrl} target="_blank" rel="noopener noreferrer">
            resume ↗
          </a>
        </nav>
      </header>

      <main id="main">
        <section className="mb-12">
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            If it ain&apos;t broke, break it.
            <span className="block text-dim">Then make it better.</span>
          </h1>
          <p className="mt-6 max-w-2xl leading-relaxed">
            I&apos;m {personal.shortName}, a Tech Lead in {personal.location.split(",")[0]} with{" "}
            {yearsOfExperience()}+ years building backend systems that stay fast under real-world load.
          </p>
          <p className="mt-4 max-w-2xl leading-relaxed text-dim">
            Below is a live simulation of a small system, built the way I&apos;d build it — and defended the way
            I&apos;d defend it. Try to take it down. Then switch the defences off and try again.
          </p>
        </section>

        <section id="lab" aria-label="Chaos lab" className="mb-20 scroll-mt-6">
          <Lab />
        </section>

        <section id="real" aria-labelledby="real-title" className="mb-20">
          <H2 id="real-title">where I&apos;ve done this for real</H2>
          <ul className="divide-y divide-line border-y border-line">
            {REAL_WORLD.map((r) => (
              <li key={r.lever} className="grid gap-1 py-3 sm:grid-cols-[200px_1fr] sm:gap-6">
                <span className="text-sm text-dim">{r.lever}</span>
                <span className="text-sm leading-relaxed">
                  {r.proof} <span className="text-dim">— {r.where}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section id="work" aria-labelledby="work-title" className="mb-20 scroll-mt-6">
          <H2 id="work-title">work</H2>
          <ol className="space-y-10">
            {experience.map((job) => (
              <li key={job.company}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-bold">{job.company}</h3>
                  <span className="text-sm text-dim">{job.period}</span>
                </div>
                <p className="text-sm text-dim">{job.domain}</p>
                <p className="mt-2 text-sm">
                  {job.roles.map((r, i) => (
                    <span key={r.title}>
                      {i > 0 && <span className="text-dim"> ← </span>}
                      <span className={i === 0 ? "" : "text-dim"}>{r.title.split(" — ")[0]}</span>
                    </span>
                  ))}
                </p>
                <ul className="mt-3 space-y-1.5 text-sm leading-relaxed">
                  {job.highlights.map((h) => (
                    <li key={h} className="flex gap-2">
                      <span aria-hidden className="text-dim">
                        –
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-dim">{job.technologies.join(" · ")}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="projects-title" className="mb-20">
          <H2 id="projects-title">side projects</H2>
          <ul className="space-y-4">
            {projects.map((p) => (
              <li key={p.title} className="text-sm leading-relaxed">
                <a href={p.live ?? p.github} target="_blank" rel="noopener noreferrer" className="font-bold">
                  {p.title}
                </a>{" "}
                <span className="text-dim">— {p.description}</span>
                {p.live && p.github && (
                  <>
                    {" "}
                    <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-dim">
                      source
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="skills-title" className="mb-20">
          <H2 id="skills-title">tools</H2>
          <dl className="space-y-2 text-sm">
            {skills.map((g) => (
              <div key={g.label} className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-6">
                <dt className="text-dim">{g.label.toLowerCase()}</dt>
                <dd>{g.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
          <dl className="mt-8 space-y-2 text-sm">
            {education.map((e) => (
              <div key={e.school} className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-6">
                <dt className="text-dim">{e.period}</dt>
                <dd>
                  {e.degree} <span className="text-dim">— {e.school}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="contact" aria-labelledby="contact-title" className="mb-16 scroll-mt-6">
          <H2 id="contact-title">contact</H2>
          <p className="max-w-2xl text-sm leading-relaxed">{contact.message}</p>
          <p className="mt-4 text-lg font-bold">
            <a href={`mailto:${personal.email}`}>{personal.email}</a>
          </p>
          <p className="mt-3 flex flex-wrap gap-x-4 text-sm">
            {personal.socials.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer">
                {s.label.toLowerCase()} ↗
              </a>
            ))}
          </p>
        </section>
      </main>

      <footer className="border-t border-line pt-4 text-xs leading-relaxed text-dim">
        The lab is a deliberately simple model — queues, worker pools and a few hundred sampled requests per tick —
        not a benchmark. The behaviours are real; the numbers are illustrative.
      </footer>
    </div>
  );
}
