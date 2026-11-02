import type { Metadata } from "next";
import Link from "next/link";
import { portfolioConfig } from "@/config/portfolio";
import { scenarios } from "@/lib/scenarios";
import { SiteHeader } from "@/components/SiteHeader";
import { SimProvider } from "@/components/lab/SimProvider";
import { Console } from "@/components/lab/Console";
import { Explainers } from "@/components/lab/Explainers";
import { WireframeSurface } from "@/components/ui/WireframeSurface";

export const metadata: Metadata = {
  title: `The Lab — how ${portfolioConfig.personal.shortName} thinks about reliability`,
  description:
    "A live, breakable model of a request-processing backend. Walk through five real incident patterns — node failure, slow database, traffic spike, cache outage and a retry storm — and see what each defence actually does.",
  alternates: { canonical: "/lab" },
};

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

export default async function LabPage({ searchParams }: { searchParams: Promise<{ incident?: string }> }) {
  const { incident } = await searchParams;
  const scenario = scenarios.find((s) => s.id === incident);
  const first = scenario?.steps[0];
  const { personal } = portfolioConfig;

  return (
    <>
      <SiteHeader current="lab" />

      <main id="main" className="mx-auto max-w-7xl px-4 sm:px-6">
        <section className="relative isolate py-10 sm:py-14">
          <WireframeSurface variant="hero" className="pointer-events-none absolute inset-y-0 -inset-x-4 sm:-inset-x-8 -z-10 opacity-70" />
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">The lab · how I think</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            If it ain&apos;t broke, break it.
            <span className="block text-dim">Then make it better.</span>
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-soft">
            This is a live model of a request-processing backend: a load balancer, three Go API nodes, Redis as a cache
            and Postgres as the source of truth. It fails the way real systems fail — and it&apos;s defended the way
            I&apos;d defend one in production.
          </p>
          <p className="mt-3 max-w-3xl leading-relaxed text-ink-soft">
            Pick an incident for a guided walkthrough, or inject faults yourself and switch defences off to see what
            each one is really doing. Nothing here is scripted: everything you see comes from a few simple rules,
            explained further down.
          </p>
        </section>

        <SimProvider initialChange={first?.apply} initialFocus={first?.focus}>
          <section id="incidents" aria-label="Chaos lab" className="scroll-mt-16 pb-14">
            <Console initialScenarioId={scenario?.id} />
          </section>

          <section id="how" aria-labelledby="how-title" className="scroll-mt-16 border-t border-line py-14">
            <SectionHead
              id="how-title"
              kicker="How it works"
              title="Four ideas behind every outage"
              intro="These four rules produce everything the lab does. The charts read from the same live simulation running above."
            />
            <Explainers />
          </section>
        </SimProvider>

        <section id="real" aria-labelledby="real-title" className="scroll-mt-16 border-t border-line py-14">
          <SectionHead
            id="real-title"
            kicker="For real"
            title="Where I've done this in production"
            intro="The lab is a toy. These weren't."
          />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {REAL_WORLD.map((r) => (
              <li
                key={r.lever}
                className="surface lift group relative overflow-hidden rounded-xl border border-line p-5 transition-all duration-500"
                data-reveal
              >
                {/* Top light wash */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[var(--sheen-soft)] to-transparent opacity-30 transition-opacity duration-700 group-hover:opacity-100" />
                <WireframeSurface />
                <div className="relative z-10">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">{r.lever}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink transition-colors duration-300 group-hover:text-accent">
                    {r.proof}
                  </p>
                  <p className="mt-3 text-sm text-dim">{r.where}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="surface lift group relative mt-10 flex flex-col items-start gap-4 overflow-hidden rounded-2xl border border-line p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            {/* Top light wash */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[var(--sheen-soft)] to-transparent opacity-30 transition-opacity duration-700 group-hover:opacity-100" />
            <WireframeSurface />
            <div className="relative z-10">
              <p className="text-xl font-semibold tracking-tight text-ink">Like how this thinks?</p>
              <p className="mt-1 text-ink-soft">See the work behind it, or get in touch.</p>
            </div>
            <div className="relative z-10 flex flex-wrap gap-3">
              <Link href="/#work" className="btn !px-4 !py-2 !text-sm">
                ← Back to my work
              </Link>
              <a href={`mailto:${personal.email}`} className="btn btn-primary !px-4 !py-2 !text-sm">
                Email me
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-7xl px-4 py-6 text-[12px] leading-relaxed text-dim sm:px-6">
          The lab is a simplified model — worker pools, queues and 400 sampled requests per tick — not a benchmark. The
          behaviours are real; the numbers are illustrative.
        </div>
      </footer>
    </>
  );
}
