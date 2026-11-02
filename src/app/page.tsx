import Image from "next/image";
import { FiArrowDown, FiArrowUpRight, FiFileText, FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { portfolioConfig, yearsOfExperience } from "@/config/portfolio";
import { SimProvider } from "@/components/lab/SimProvider";
import { Console } from "@/components/lab/Console";
import { Explainers } from "@/components/lab/Explainers";

const icons = { github: FiGithub, linkedin: FiLinkedin, resume: FiFileText, email: FiMail };

const REAL_WORLD = [
  {
    lever: "Latency budgets",
    proof: "Kept real-time pharmacy-claim processing under 100ms at high request volume.",
    where: "Worklife Tech",
  },
  {
    lever: "Slow database",
    proof: "Re-engineered PostgreSQL functions, cutting 50–500ms off individual queries.",
    where: "Worklife Tech",
  },
  {
    lever: "Observability",
    proof: "Containerisation, telemetry and real-time monitoring on Azure — a 60% efficiency gain.",
    where: "Worklife Tech",
  },
  {
    lever: "Write overload",
    proof: "A Java ASM-based Cassandra writer: 10× faster inserts, with no slow-query build-up under sustained load.",
    where: "Algomox",
  },
  {
    lever: "Throughput",
    proof: "Go telemetry collectors load-tested past 10,000 metrics per second.",
    where: "Algomox",
  },
];

function SectionHead({ id, kicker, title, intro }: { id: string; kicker: string; title: string; intro?: string }) {
  return (
    <div className="mb-8 max-w-2xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">{kicker}</p>
      <h2 id={id} className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {intro && <p className="mt-3 text-base leading-relaxed text-ink-soft sm:text-lg">{intro}</p>}
    </div>
  );
}

export default function Home() {
  const { personal, metrics, experience, projects, skills, education, certifications, contact } = portfolioConfig;
  const years = yearsOfExperience();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#top" className="font-mono text-[13px] font-semibold text-ink">
            {personal.name.toLowerCase()}
            <span className="text-dim"> / break-it</span>
          </a>
          <nav aria-label="Primary" className="flex items-center gap-1 text-[13px]">
            {[
              ["#lab", "Lab"],
              ["#how", "How it works"],
              ["#work", "Work"],
              ["#contact", "Contact"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="hidden rounded-md px-2.5 py-1 text-ink-soft hover:bg-subtle hover:text-ink md:inline-block"
              >
                {label}
              </a>
            ))}
            <a
              href={personal.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 rounded-md bg-ink px-3 py-1 font-medium text-paper hover:opacity-85"
            >
              Resume
            </a>
          </nav>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Hero */}
        <section id="top" className="grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center">
          <div>
            <p className="font-mono text-[12px] text-dim">
              {personal.name} · {personal.title} · {personal.location}
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
              If it ain&apos;t broke, break it.
              <span className="block text-dim">Then make it better.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              I&apos;m {personal.shortName} — a Tech Lead with {years}+ years building backend systems that stay fast
              under real-world load. Most recently: real-time claim processing for a U.S. pharmacy-benefits platform.
            </p>
            <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
              Rather than tell you how I think about reliability, I built you a system to break. It&apos;s a live model
              of a request-processing backend, with the same failure modes as the real thing — and the defences I&apos;d
              put in front of them.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#lab" className="btn btn-primary inline-flex items-center gap-2 !px-4 !py-2 !text-sm">
                Start breaking things <FiArrowDown aria-hidden />
              </a>
              <a href="#work" className="btn !px-4 !py-2 !text-sm">
                Skip to my work
              </a>
              <span className="ml-1 flex gap-1">
                {personal.socials.map((s) => {
                  const Icon = icons[s.icon];
                  return (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      title={s.label}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-dim hover:bg-subtle hover:text-ink"
                    >
                      <Icon className="h-[18px] w-[18px]" aria-hidden />
                    </a>
                  );
                })}
              </span>
            </div>
          </div>

          <aside className="rounded-2xl border border-line bg-panel p-5">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-line">
                <Image src={personal.portrait.src} alt={personal.portrait.alt} fill sizes="64px" className="object-cover" priority />
              </div>
              <div>
                <p className="font-semibold text-ink">{personal.name}</p>
                <p className="text-sm text-dim">{personal.title}</p>
              </div>
            </div>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-dim">in production</p>
            <dl className="mt-2 divide-y divide-line">
              {metrics.map((mt) => (
                <div key={mt.value} className="flex items-baseline gap-4 py-2.5">
                  <dt className="w-20 shrink-0 font-mono text-xl font-semibold text-ink">{mt.value}</dt>
                  <dd className="text-[13px] leading-snug text-ink-soft">{mt.label}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </section>

        <SimProvider>
          {/* Lab */}
          <section id="lab" aria-labelledby="lab-title" className="scroll-mt-16 border-t border-line py-14">
            <SectionHead
              id="lab-title"
              kicker="The lab"
              title="A system you're allowed to break"
              intro="Three Go API nodes behind a load balancer, with Redis as a cache and Postgres as the source of truth. Pick an incident for a guided walkthrough, or inject faults yourself and toggle the defences to see what each one is really doing."
            />
            <Console />
          </section>

          {/* How it works */}
          <section id="how" aria-labelledby="how-title" className="scroll-mt-16 border-t border-line py-14">
            <SectionHead
              id="how-title"
              kicker="How it works"
              title="Four ideas behind every outage"
              intro="The lab isn't scripted — these four rules produce everything you saw. The charts below are reading from the same live simulation."
            />
            <Explainers />
          </section>
        </SimProvider>

        {/* Real world */}
        <section aria-labelledby="real-title" className="border-t border-line py-14">
          <SectionHead id="real-title" kicker="For real" title="Where I've done this in production" />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {REAL_WORLD.map((r) => (
              <li key={r.lever} className="rounded-xl border border-line bg-panel p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">{r.lever}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink">{r.proof}</p>
                <p className="mt-3 text-sm text-dim">{r.where}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Work */}
        <section id="work" aria-labelledby="work-title" className="scroll-mt-16 border-t border-line py-14">
          <SectionHead
            id="work-title"
            kicker="Work"
            title="Experience"
            intro={`${years}+ years across two companies — from a founding engineer at an AIOps startup to leading a team on a production healthcare platform.`}
          />
          <ol className="space-y-5">
            {experience.map((job) => (
              <li key={job.company} className="grid gap-6 rounded-2xl border border-line bg-panel p-5 sm:p-7 md:grid-cols-[230px_minmax(0,1fr)]">
                <div>
                  <p className="font-mono text-[11px] text-dim">{job.period}</p>
                  <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-ink">{job.company}</h3>
                  {job.companyNote && <p className="text-sm text-dim">{job.companyNote}</p>}
                  <p className="mt-1 text-sm text-ink-soft">{job.location}</p>
                  <ol className="mt-4 space-y-2.5 border-l border-line pl-4" aria-label="Roles">
                    {job.roles.map((role, i) => (
                      <li key={role.title} className="relative">
                        <span
                          aria-hidden
                          className={`absolute -left-[21px] top-1.5 h-2 w-2 rounded-full ${i === 0 ? "bg-accent" : "bg-line-strong"}`}
                        />
                        <p className={`text-sm ${i === 0 ? "font-medium text-ink" : "text-ink-soft"}`}>{role.title}</p>
                        <p className="font-mono text-[10.5px] text-dim">{role.period}</p>
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <p className="text-sm font-medium text-accent">{job.domain}</p>
                  <ul className="mt-3 space-y-2.5">
                    {job.highlights.map((h) => (
                      <li key={h} className="flex gap-3 text-[15px] leading-relaxed text-ink-soft">
                        <span aria-hidden className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-dim" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                  <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
                    {job.technologies.map((t) => (
                      <li key={t} className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-ink-soft">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Projects */}
        <section aria-labelledby="projects-title" className="border-t border-line py-14">
          <SectionHead
            id="projects-title"
            kicker="Side projects"
            title="Things I build for fun"
            intro="Open-source developer tools and libraries — mostly Go, mostly scratching my own itch."
          />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => {
              const href = p.live ?? p.github;
              return (
                <li key={p.title} className="group relative flex flex-col rounded-xl border border-line bg-panel p-5 transition-colors hover:border-line-strong">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-ink">
                      {href ? (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0">
                          {p.title}
                        </a>
                      ) : (
                        p.title
                      )}
                    </h3>
                    {p.featured ? (
                      <span className="rounded-full bg-accent-soft px-2 py-0.5 font-mono text-[10px] text-accent">featured</span>
                    ) : (
                      <FiArrowUpRight aria-hidden className="h-4 w-4 text-dim transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                    )}
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{p.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded-md border border-line px-2 py-0.5 font-mono text-[10.5px] text-dim">
                        {t}
                      </span>
                    ))}
                  </div>
                  {p.live && p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-10 mt-3 self-start font-mono text-[11px] text-dim hover:text-ink"
                    >
                      source ↗
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* Skills & education */}
        <section aria-labelledby="skills-title" className="border-t border-line py-14">
          <SectionHead id="skills-title" kicker="Toolbox" title="Skills & education" />
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {skills.map((g) => (
                <div key={g.label}>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">{g.label}</dt>
                  <dd className="mt-2 flex flex-wrap gap-1.5">
                    {g.items.map((it) => (
                      <span key={it} className="rounded-md border border-line bg-panel px-2 py-0.5 text-[13px] text-ink">
                        {it}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="space-y-6">
              {education.map((e) => (
                <div key={e.school}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <p className="font-medium text-ink">{e.degree}</p>
                    <p className="font-mono text-[11px] text-dim">{e.period}</p>
                  </div>
                  <p className="text-sm text-ink-soft">{e.school}</p>
                  {e.notes && (
                    <ul className="mt-2 space-y-1">
                      {e.notes.map((n) => (
                        <li key={n} className="text-[13px] leading-relaxed text-dim">
                          — {n}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">Certifications</p>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{certifications.join(" · ")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" aria-labelledby="contact-title" className="scroll-mt-16 border-t border-line py-14">
          <div className="rounded-2xl border border-line bg-panel p-6 sm:p-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">Contact</p>
            <h2 id="contact-title" className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Got a system that needs breaking?
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">{contact.message}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href={`mailto:${personal.email}`} className="btn btn-primary inline-flex items-center gap-2 !px-4 !py-2 !text-sm">
                <FiMail aria-hidden /> {personal.email}
              </a>
              {personal.socials.map((s) => {
                const Icon = icons[s.icon];
                return (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn inline-flex items-center gap-2 !px-4 !py-2 !text-sm"
                  >
                    <Icon aria-hidden /> {s.label}
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-[12px] leading-relaxed text-dim sm:flex-row sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {personal.name}. The lab is a simplified model — worker pools, queues and 400
            sampled requests per tick — not a benchmark. The behaviours are real; the numbers are illustrative.
          </p>
          <a href="#top" className="shrink-0 hover:text-ink">
            Back to top ↑
          </a>
        </div>
      </footer>
    </>
  );
}
