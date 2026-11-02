import Image from "next/image";
import { FiArrowRight, FiArrowUpRight, FiDownload, FiFileText, FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { portfolioConfig, yearsOfExperience } from "@/config/portfolio";
import Link from "next/link";
import { scenarios } from "@/lib/scenarios";
import { ExperienceCard } from "@/components/ExperienceCard";
import { SiteHeader } from "@/components/SiteHeader";
import { PerfNote } from "@/components/ui/PerfNote";
import { WireframeSurface } from "@/components/ui/WireframeSurface";

const icons = { github: FiGithub, linkedin: FiLinkedin, resume: FiFileText, email: FiMail };

function SectionHead({ id, kicker, title, intro }: { id: string; kicker: string; title: string; intro?: string }) {
  return (
    <div className="mb-8 max-w-2xl" data-reveal>
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_6px_var(--accent)]" />
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">{kicker}</p>
      </div>
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
          {/* Static dot pattern + dynamic wireframe backdrop that reveals around the mouse */}
          <div aria-hidden className="dot-grid pointer-events-none absolute inset-y-0 inset-x-0 -z-10 sm:-inset-x-6" />
          <WireframeSurface variant="hero" className="pointer-events-none absolute inset-y-0 -inset-x-4 sm:-inset-x-8 -z-10 opacity-75" />

          <div>
            <p
              className="surface lift group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-line px-3.5 py-1.5 font-mono text-[11.5px] text-ink-soft transition-all duration-500 hover:border-accent/40 hover:shadow-md"
              data-reveal
            >
              <WireframeSurface showMotion={false} className="opacity-0 group-hover:opacity-100" />
              <span className="relative z-10 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ok" />
              </span>
              <span className="relative z-10">Currently Associate Manager, Software Development at Worklife Tech</span>
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
              I&apos;m {personal.shortName}, an engineering leader with {years}+ years designing{" "}
              <span className="keyword-interactive">distributed Go services</span>, tuning{" "}
              <span className="keyword-interactive">databases</span> and leading teams that ship production-grade software — currently{" "}
              <span className="keyword-interactive">real-time claim processing</span> for a U.S.{" "}
              <span className="keyword-interactive">pharmacy-benefits platform</span>.
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
                      className="group inline-flex h-9 w-9 items-center justify-center rounded-md text-dim transition-all duration-300 hover:-translate-y-1 hover:bg-subtle hover:text-accent hover:shadow-md active:translate-y-0"
                    >
                      <Icon className="h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110" aria-hidden />
                    </a>
                  );
                })}
              </span>
            </div>
          </div>

          <aside
            className="surface lift group relative overflow-hidden rounded-2xl border border-line p-5"
            data-reveal
            style={{ ["--reveal-delay" as string]: "200ms" }}
          >
            {/* Top light wash */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[var(--sheen-soft)] to-transparent opacity-30 transition-opacity duration-700 group-hover:opacity-100" />
            <WireframeSurface />
            <div className="relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-line shadow-[2px_4px_12px_-3px_var(--shadow-far)] transition-transform duration-500 group-hover:scale-105">
                  <Image
                    src={personal.portrait.lightSrc ?? personal.portrait.src}
                    alt={personal.portrait.alt}
                    fill
                    sizes="64px"
                    className="show-light object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <Image
                    src={personal.portrait.darkSrc ?? personal.portrait.src}
                    alt={personal.portrait.alt}
                    fill
                    sizes="64px"
                    className="show-dark object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                </div>
                <div>
                  <p className="font-semibold text-ink transition-colors duration-300 group-hover:text-accent">{personal.name}</p>
                  <p className="text-sm text-dim">{personal.title}</p>
                </div>
              </div>
              <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-dim">selected results</p>
              <dl className="mt-2 divide-y divide-line">
                {metrics.map((mt) => (
                  <div
                    key={mt.value}
                    className="group/metric -mx-2 flex items-baseline gap-4 rounded-lg px-2 py-2.5 transition-all duration-300 hover:bg-subtle/70 hover:shadow-sm"
                  >
                    <dt className="w-20 shrink-0 font-mono text-xl font-semibold text-ink transition-all duration-300 group-hover/metric:scale-105 group-hover/metric:text-accent">
                      {mt.value}
                    </dt>
                    <dd className="text-[13px] leading-snug text-ink-soft transition-colors duration-300 group-hover/metric:text-ink">
                      {mt.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </section>

        {/* Strengths — purposeful interactive cards with light wash */}
        <section aria-label="Core strengths" className="border-t border-line py-12">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {about.focusAreas.map((f, i) => (
              <li
                key={f.title}
                data-reveal
                style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}
                className="surface lift group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line p-5 transition-all duration-500"
              >
                {/* Top directional light wash */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[var(--sheen-soft)] to-transparent opacity-30 transition-opacity duration-700 group-hover:opacity-100" />
                <WireframeSurface />
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="h-1 w-6 rounded-full bg-accent/40 transition-all duration-700 ease-out group-hover:w-12 group-hover:bg-accent group-hover:shadow-[0_0_8px_var(--accent)]" />
                    <span className="font-mono text-[11px] font-semibold text-dim/60 transition-colors duration-500 group-hover:text-accent">
                      0{i + 1}
                    </span>
                  </div>
                  <h2 className="mt-4 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors duration-300 group-hover:text-accent">
                    {f.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft transition-colors duration-300 group-hover:text-ink">
                    {f.description}
                  </p>
                </div>
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
                      <span key={it} className="skill-chip">
                        {it}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="space-y-6">
              {education.map((e) => (
                <div
                  key={e.school}
                  className="group -mx-3 rounded-xl border border-transparent p-3 transition-all duration-300 hover:border-line hover:bg-subtle/60 hover:shadow-sm"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <p className="font-medium text-ink transition-colors duration-300 group-hover:text-accent">{e.degree}</p>
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
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {certifications.map((c) => (
                    <span key={c} className="tech-chip">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products & open source — summary only; the showcase lives on astrx.dev */}
        <section id="projects" aria-labelledby="projects-title" className="scroll-mt-16 border-t border-line py-14">
          <SectionHead id="projects-title" kicker="Side projects" title={products.heading} intro={products.intro} />
          <ul className="surface divide-y divide-line overflow-hidden rounded-2xl border border-line" data-reveal>
            {products.items.map((p) => (
              <li
                key={p.title}
                className="group relative grid gap-x-6 gap-y-2 p-5 transition-all duration-500 hover:bg-subtle/70 sm:grid-cols-[210px_minmax(0,1fr)_auto] sm:items-baseline"
              >
                {/* Light wash */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[var(--sheen-soft)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-80" />
                <WireframeSurface />
                <div className="relative z-10">
                  <h3 className="font-semibold text-ink transition-colors duration-300 group-hover:text-accent">{p.title}</h3>
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-dim">{p.kind}</p>
                </div>
                <div className="relative z-10">
                  <p className="text-sm leading-relaxed text-ink-soft">{p.summary}</p>
                  <ul className="mt-2.5 flex flex-wrap gap-1.5" aria-label="Tech">
                    {p.tags.map((t) => (
                      <li key={t} className="tech-chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative z-10 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] sm:justify-end">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link inline-flex items-center gap-1 font-medium text-ink-soft transition-colors duration-300 hover:text-accent"
                  >
                    {p.urlLabel}{" "}
                    <FiArrowUpRight
                      aria-hidden
                      className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                    />
                    <span className="sr-only"> ({p.title})</span>
                  </a>
                  {p.github && p.github !== p.url && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/gh inline-flex items-center gap-1 text-dim transition-colors duration-300 hover:text-ink"
                    >
                      <FiGithub aria-hidden className="h-3.5 w-3.5 transition-transform duration-300 group-hover/gh:scale-110" /> source
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
          <div
            data-reveal
            className="surface lift group relative grid grid-cols-1 gap-8 overflow-hidden rounded-2xl border border-line p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12"
          >
            {/* Top light wash */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[var(--sheen-soft)] to-transparent opacity-30 transition-opacity duration-700 group-hover:opacity-100" />
            <WireframeSurface />
            <div className="relative z-10 flex flex-col">
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
            <div className="relative z-10">
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-dim">or jump straight into an incident</p>
              <ol className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-panel/60 shadow-inner">
                {scenarios.map((sc, i) => (
                  <li key={sc.id}>
                    <Link
                      href={`/lab?incident=${sc.id}#incidents`}
                      className="group relative flex items-center gap-4 px-4 py-3.5 transition-all duration-300 hover:bg-subtle hover:pl-5 hover:shadow-sm"
                    >
                      <span className="font-mono text-[11px] font-semibold text-dim transition-colors duration-300 group-hover:text-accent">
                        0{i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-medium text-ink transition-colors duration-300 group-hover:text-accent">
                          {sc.title}
                        </span>
                        <span className="block truncate text-[13px] text-dim">{sc.tagline}</span>
                      </span>
                      <FiArrowRight
                        aria-hidden
                        className="h-4 w-4 shrink-0 text-dim transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:text-accent"
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
          <div className="surface lift group relative overflow-hidden rounded-2xl border border-line p-6 sm:p-10" data-reveal>
            {/* Top light wash */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[var(--sheen-soft)] to-transparent opacity-30 transition-opacity duration-700 group-hover:opacity-100" />
            <WireframeSurface />
            <div className="relative z-10">
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
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-[12px] leading-relaxed text-dim sm:flex-row sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {personal.name} · {personal.location}
          </p>
          <PerfNote />
          <a href="#top" className="shrink-0 transition-colors duration-300 hover:text-ink">
            Back to top ↑
          </a>
        </div>
      </footer>
    </>
  );
}
