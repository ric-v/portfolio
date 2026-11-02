import Image from "next/image";
import { FiArrowRight, FiArrowUpRight, FiDownload, FiFileText, FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { portfolioConfig, yearsOfExperience } from "@/config/portfolio";
import Link from "next/link";
import { scenarios } from "@/lib/scenarios";
import { ExperienceCard } from "@/components/ExperienceCard";
import { SiteHeader } from "@/components/SiteHeader";
import { PerfNote } from "@/components/ui/PerfNote";

const icons = { github: FiGithub, linkedin: FiLinkedin, resume: FiFileText, email: FiMail };

function SectionHead({ id, kicker, title, intro }: { id: string; kicker: string; title: string; intro?: string }) {
  return (
    <div className="mb-8 max-w-2xl" data-reveal>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">{kicker}</p>
      <h2 id={id} className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {intro && <p className="mt-3 text-base leading-relaxed text-ink-soft sm:text-lg">{intro}</p>}
    </div>
  );
}

export default function Home() {
  const { personal, metrics, about, experience, products, skills, education, certifications, contact } = portfolioConfig;
  const years = yearsOfExperience();

  return (
    <>
      <SiteHeader current="home" />

      <main id="main" className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Hero */}
        <section id="top" className="relative isolate grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center">
          <div aria-hidden className="dot-grid pointer-events-none absolute inset-y-0 inset-x-0 -z-10 sm:-inset-x-6" />
          <div>
            <p
              className="surface inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-[11.5px] text-ink-soft"
              data-reveal
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ok" />
              </span>
              Currently Associate Manager, Software Development at Worklife Tech
            </p>
            <h1
              className="mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl"
              data-reveal
              style={{ ["--reveal-delay" as string]: "80ms" }}
            >
              {(() => {
                // Hand-drawn underline on the phrase that matters most.
                const key = "stay fast";
                const i = personal.headline.indexOf(key);
                if (i < 0) return personal.headline;
                return (
                  <>
                    {personal.headline.slice(0, i)}
                    <span className="draw-underline">{key}</span>
                    {personal.headline.slice(i + key.length)}
                  </>
                );
              })()}
            </h1>
            <p
              className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft"
              data-reveal
              style={{ ["--reveal-delay" as string]: "160ms" }}
            >
              I&apos;m {personal.shortName}, an engineering leader with {years}+ years designing distributed Go services, tuning
              databases and leading teams that ship production-grade software — currently real-time claim
              processing for a U.S. pharmacy-benefits platform.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3" data-reveal style={{ ["--reveal-delay" as string]: "240ms" }}>
              <a
                href={personal.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary inline-flex items-center gap-2 !px-4 !py-2 !text-sm"
              >
                <FiDownload aria-hidden /> View resume
              </a>
              <a href={`mailto:${personal.email}`} className="btn inline-flex items-center gap-2 !px-4 !py-2 !text-sm">
                <FiMail aria-hidden /> Get in touch
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
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-dim transition-all hover:-translate-y-0.5 hover:bg-subtle hover:text-ink"
                    >
                      <Icon className="h-[18px] w-[18px]" aria-hidden />
                    </a>
                  );
                })}
              </span>
            </div>
          </div>

          <aside className="surface lift rounded-2xl border border-line p-5" data-reveal style={{ ["--reveal-delay" as string]: "200ms" }}>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-line shadow-[3px_4px_10px_-4px_var(--shadow-far)]">
                <Image
                  src={personal.portrait.lightSrc ?? personal.portrait.src}
                  alt={personal.portrait.alt}
                  fill
                  sizes="64px"
                  className="show-light object-cover"
                  priority
                />
                <Image
                  src={personal.portrait.darkSrc ?? personal.portrait.src}
                  alt={personal.portrait.alt}
                  fill
                  sizes="64px"
                  className="show-dark object-cover"
                  priority
                />
              </div>
              <div>
                <p className="font-semibold text-ink">{personal.name}</p>
                <p className="text-sm text-dim">{personal.title}</p>
              </div>
            </div>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-dim">selected results</p>
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

        {/* Strengths */}
        <section aria-label="Core strengths" className="border-t border-line py-10">
          <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {about.focusAreas.map((f, i) => (
              <li key={f.title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}>
                <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">{f.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.description}</p>
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
            intro={`${years}+ years of experience — from a founding engineer at an AIOps startup, to leading a team on a production healthcare platform, to building and shipping NexQL as a self-developed product.`}
          />
          <ol className="space-y-5">
            {experience.map((job) => (
              <ExperienceCard key={job.company} job={job} />
            ))}
          </ol>
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
                      <span key={it} className="rounded-md border border-line bg-panel px-2 py-0.5 text-[13px] text-ink transition-colors hover:border-accent hover:text-accent">
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

        {/* Products & open source — summary only; the showcase lives on astrx.dev */}
        <section id="projects" aria-labelledby="projects-title" className="scroll-mt-16 border-t border-line py-14">
          <SectionHead id="projects-title" kicker="Side projects" title={products.heading} intro={products.intro} />
          <ul className="divide-y divide-line rounded-2xl border border-line surface" data-reveal>
            {products.items.map((p) => (
              <li
                key={p.title}
                className="grid gap-x-6 gap-y-1.5 px-5 py-4 sm:grid-cols-[210px_minmax(0,1fr)_auto] sm:items-baseline"
              >
                <div>
                  <h3 className="font-semibold text-ink">{p.title}</h3>
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-dim">{p.kind}</p>
                </div>
                <div>
                  <p className="text-sm leading-relaxed text-ink-soft">{p.summary}</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Tech">
                    {p.tags.map((t) => (
                      <li key={t} className="rounded-md border border-line px-2 py-0.5 font-mono text-[10.5px] text-dim">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] sm:justify-end">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-ink-soft transition-colors hover:text-accent"
                  >
                    {p.urlLabel} <FiArrowUpRight aria-hidden className="h-3.5 w-3.5" />
                    <span className="sr-only"> ({p.title})</span>
                  </a>
                  {p.github && p.github !== p.url && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-dim transition-colors hover:text-ink"
                    >
                      <FiGithub aria-hidden className="h-3.5 w-3.5" /> source
                      <span className="sr-only"> for {p.title}</span>
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-5" data-reveal>
            <a
              href={products.showcase.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary inline-flex items-center gap-2 !px-4 !py-2 !text-sm"
            >
              {products.showcase.label} <FiArrowUpRight aria-hidden />
            </a>
          </div>
        </section>

        {/* Lab teaser — the deep dive is opt-in */}
        <section aria-labelledby="lab-teaser-title" className="scroll-mt-16 border-t border-line py-14">
          <div data-reveal className="surface grid grid-cols-1 gap-8 rounded-2xl border border-line p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
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
                      className="group flex items-center gap-4 px-4 py-3 transition-[background-color,padding] duration-300 hover:bg-subtle hover:pl-5"
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

        {/* Contact */}
        <section id="contact" aria-labelledby="contact-title" className="scroll-mt-16 border-t border-line py-14">
          <div className="surface rounded-2xl border border-line p-6 sm:p-10" data-reveal>
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
          <PerfNote />
          <a href="#top" className="shrink-0 hover:text-ink">
            Back to top ↑
          </a>
        </div>
      </footer>
    </>
  );
}
