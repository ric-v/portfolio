import { FiArrowUpRight, FiFileText, FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { portfolioConfig } from "@/config/portfolio";
import {
  formatDuration,
  monthIndex,
  nowMonthIndex,
  services,
  spans,
} from "@/config/trace";
import { TraceView } from "@/components/trace/TraceView";
import { PerfBadge } from "@/components/trace/PerfBadge";
import { CopyEmailButton } from "@/components/CopyEmailButton";

// Durations are computed from "now", so refresh the static page hourly.
export const revalidate = 3600;

const icons = { github: FiGithub, linkedin: FiLinkedin, resume: FiFileText, email: FiMail };

const metricNames = [
  "claims.response_time",
  "cassandra.insert.speedup",
  "telemetry.ingest_rate",
  "delivery.efficiency_gain",
];

/** Deterministic FNV-1a hash → 16 hex chars, so the "trace id" is stable. */
function hashHex(input: string) {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < input.length; i++) {
    h1 = Math.imul(h1 ^ input.charCodeAt(i), 16777619);
    h2 = Math.imul(h2 ^ input.charCodeAt(input.length - 1 - i), 16777619);
  }
  return ((h1 >>> 0).toString(16).padStart(8, "0") + (h2 >>> 0).toString(16).padStart(8, "0")).slice(0, 16);
}

function SectionTitle({ id, label, title }: { id: string; label: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="font-mono text-[11px] uppercase tracking-wider text-accent">{label}</p>
      <h2 id={id} className="mt-1 text-2xl font-semibold tracking-tight text-fg">
        {title}
      </h2>
    </div>
  );
}

export default function Home() {
  const { personal, metrics, projects, skills } = portfolioConfig;
  const root = spans.find((s) => s.id === "root")!;
  const careerMonths = nowMonthIndex() - monthIndex("2018-06") + 1;
  const traceId = hashHex(personal.name);

  return (
    <>
      {/* Top bar — reads like an APM trace header */}
      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <a href="#top" className="flex min-w-0 items-center gap-2 font-mono text-[13px]">
            <span className="rounded bg-[var(--ok-soft)] px-1.5 py-0.5 text-[11px] font-medium text-[var(--ok)]">
              GET
            </span>
            <span className="truncate text-fg">/richie-varghese</span>
            <span className="hidden text-[var(--ok)] sm:inline">200</span>
          </a>
          <nav aria-label="Primary" className="ml-auto flex items-center gap-1">
            <div className="mr-3 hidden md:block">
              <PerfBadge />
            </div>
            {[
              ["#trace", "trace"],
              ["#projects", "linked"],
              ["#contact", "contact"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="hidden rounded px-2.5 py-1 font-mono text-[12px] text-muted hover:bg-subtle hover:text-fg sm:inline-block"
              >
                {label}
              </a>
            ))}
            <a
              href={personal.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 rounded bg-fg px-3 py-1 font-mono text-[12px] font-medium text-bg hover:opacity-85"
            >
              resume ↗
            </a>
          </nav>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Intro */}
        <section id="top" className="grid gap-8 pt-12 pb-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:pt-16">
          <div>
            <p className="font-mono text-xs text-muted">
              {personal.name} · {personal.title} · {personal.location}
            </p>
            <h1 className="mt-4 max-w-3xl text-balance text-3xl font-semibold leading-tight tracking-tight text-fg sm:text-5xl">
              {personal.headline}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              Below is my career rendered as a distributed trace — every bar is a real span of time.
              Click any span to inspect what happened inside it.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 rounded-lg border border-line bg-elevated p-4 font-mono text-[12px] sm:grid-cols-4 md:grid-cols-2">
            {[
              ["trace_id", traceId],
              ["duration", formatDuration(careerMonths) + " in industry"],
              ["spans", String(spans.length)],
              ["services", String(Object.keys(services).length)],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-faint">{k}</dt>
                <dd className="mt-0.5 text-fg">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Trace */}
        <section id="trace" aria-label="Career trace" className="scroll-mt-20 pb-16">
          <TraceView />
        </section>

        {/* Metrics */}
        <section aria-labelledby="metrics-title" className="border-t border-line py-16">
          <SectionTitle id="metrics-title" label="metrics" title="Numbers from production" />
          <dl className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((m, i) => (
              <div key={m.value} className="bg-elevated p-5">
                <dt className="font-mono text-[11px] text-faint">{metricNames[i]}</dt>
                <dd>
                  <span className="mt-2 block font-mono text-3xl font-semibold tracking-tight text-fg">
                    {m.value}
                  </span>
                  <span className="mt-2 block text-sm leading-snug text-muted">{m.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Projects as linked traces */}
        <section id="projects" aria-labelledby="projects-title" className="scroll-mt-20 border-t border-line py-16">
          <SectionTitle id="projects-title" label="linked traces" title="Side projects & open source" />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => {
              const href = p.live ?? p.github;
              return (
                <li
                  key={p.title}
                  className="group relative flex flex-col rounded-lg border border-line bg-elevated p-5 transition-colors hover:border-line-strong"
                >
                  <p className="font-mono text-[11px] text-faint">
                    trace · {p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}
                    {p.featured && <span className="ml-2 text-accent">★ featured</span>}
                  </p>
                  <h3 className="mt-1.5 font-semibold text-fg">
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="after:absolute after:inset-0"
                      >
                        {p.title}
                      </a>
                    ) : (
                      p.title
                    )}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.description}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded border border-line px-2 py-0.5 font-mono text-[11px] text-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="relative z-10 mt-4 flex gap-4 font-mono text-[12px]">
                    {p.github && (
                      <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-fg">
                        source ↗
                      </a>
                    )}
                    {p.live && (
                      <a href={p.live} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-fg">
                        {(p.liveLabel ?? "live").toLowerCase()} ↗
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Skills as dependencies */}
        <section aria-labelledby="deps-title" className="border-t border-line py-16">
          <SectionTitle id="deps-title" label="dependencies" title="What the system is built with" />
          <dl className="grid gap-6 font-mono text-[13px] sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((g) => (
              <div key={g.label}>
                <dt className="text-[11px] uppercase tracking-wider text-faint">{g.label}</dt>
                <dd className="mt-2 leading-7 text-muted">{g.items.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Contact */}
        <section id="contact" aria-labelledby="contact-title" className="scroll-mt-20 border-t border-line py-16">
          <SectionTitle id="contact-title" label="send a request" title="Let's talk" />
          <div className="max-w-2xl rounded-lg border border-line bg-elevated">
            <div className="border-b border-line px-4 py-3 font-mono text-[13px] text-muted">
              <span className="text-faint">$ </span>mail <span className="text-fg">{personal.email}</span>
            </div>
            <div className="p-5">
              <p className="text-[15px] leading-relaxed text-muted">{portfolioConfig.contact.message}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${personal.email}`}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg hover:opacity-90"
                >
                  <FiMail className="h-4 w-4" aria-hidden />
                  Email me
                </a>
                <CopyEmailButton email={personal.email} />
              </div>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                {personal.socials.map((s) => {
                  const Icon = icons[s.icon];
                  return (
                    <li key={s.label}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg"
                      >
                        <Icon className="h-4 w-4" aria-hidden />
                        {s.label}
                        <FiArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-6 font-mono text-[11px] text-faint sm:px-6">
          <span>
            span {root.operation} · status <span className="text-[var(--ok)]">ok</span> · still running
          </span>
          <span>© {new Date().getFullYear()} {personal.name}</span>
        </div>
      </footer>
    </>
  );
}
