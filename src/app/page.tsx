import Image from "next/image";
import { FiArrowRight, FiArrowUpRight, FiFileText, FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { portfolioConfig, yearsOfExperience } from "@/config/portfolio";
import Link from "next/link";
import { scenarios } from "@/lib/scenarios";
import { SiteHeader } from "@/components/SiteHeader";

const icons = { github: FiGithub, linkedin: FiLinkedin, resume: FiFileText, email: FiMail };

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
      <SiteHeader current="home" />

      <main id="main" className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Hero */}
        <section id="top" className="grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center">
          <div>
            <p className="font-mono text-[12px] text-dim">
              {personal.name} · {personal.title} · {personal.location}
            </p>
            <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
              {personal.headline}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              I&apos;m {personal.shortName}, a Tech Lead with {years}+ years designing distributed Go services, tuning
              databases and leading small teams that ship production-grade software — currently real-time claim
              processing for a U.S. pharmacy-benefits platform.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#work" className="btn btn-primary !px-4 !py-2 !text-sm">
                See my work
              </a>
              <Link href="/lab" className="btn inline-flex items-center gap-2 !px-4 !py-2 !text-sm">
                How I think: the lab <FiArrowRight aria-hidden />
              </Link>
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

        {/* Lab teaser — the deep dive is opt-in */}
        <section aria-labelledby="lab-teaser-title" className="border-t border-line py-14">
          <div className="grid grid-cols-1 gap-8 rounded-2xl border border-line bg-panel p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
            <div className="flex flex-col">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">The lab · how I think</p>
              <h2 id="lab-teaser-title" className="mt-2 text-3xl font-semibold tracking-tight text-ink">
                See how I think about failure
              </h2>
              <p className="mt-3 leading-relaxed text-ink-soft">
                Rather than list buzzwords, I built a live model of a backend you can push into failure — then walk
                through why it fails, and how timeouts, retries, circuit breakers and load shedding keep it up.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-dim">About five minutes. Best on a laptop.</p>
              <div className="mt-6 lg:mt-auto">
                <Link href="/lab" className="btn btn-primary inline-flex items-center gap-2 !px-4 !py-2 !text-sm">
                  Open the lab <FiArrowRight aria-hidden />
                </Link>
              </div>
            </div>
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-dim">or jump straight into an incident</p>
              <ol className="divide-y divide-line rounded-xl border border-line">
                {scenarios.map((sc, i) => (
                  <li key={sc.id}>
                    <Link
                      href={`/lab?incident=${sc.id}#incidents`}
                      className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-subtle"
                    >
                      <span className="font-mono text-[11px] text-dim">0{i + 1}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-medium text-ink">{sc.title}</span>
                        <span className="block truncate text-[13px] text-dim">{sc.tagline}</span>
                      </span>
                      <FiArrowRight
                        aria-hidden
                        className="h-4 w-4 shrink-0 text-dim transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                      />
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>
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
        <section id="projects" aria-labelledby="projects-title" className="scroll-mt-16 border-t border-line py-14">
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
        <section id="skills" aria-labelledby="skills-title" className="scroll-mt-16 border-t border-line py-14">
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
              Let&apos;s talk
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
            © {new Date().getFullYear()} {personal.name} · {personal.location}
          </p>
          <a href="#top" className="shrink-0 hover:text-ink">
            Back to top ↑
          </a>
        </div>
      </footer>
    </>
  );
}
