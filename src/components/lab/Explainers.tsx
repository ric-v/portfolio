"use client";

import { API_NODES, PARAMS, type BreakerState } from "@/lib/chaos";
import { useSim } from "./SimProvider";
import { fmtMs } from "./bits";

function Card({ n, title, children, formula }: { n: string; title: string; formula: string; children: React.ReactNode }) {
  return (
    <article className="surface lift flex flex-col rounded-xl border border-line p-5" data-reveal>
      <p className="font-mono text-[10.5px] text-dim">{n}</p>
      <h3 className="mt-1 text-lg font-semibold tracking-tight text-ink">{title}</h3>
      <p className="mt-2 inline-block self-start rounded-md bg-subtle px-2 py-1 font-mono text-[12px] text-ink">{formula}</p>
      <div className="mt-3 flex flex-1 flex-col gap-3 text-[14px] leading-relaxed text-ink-soft">{children}</div>
    </article>
  );
}

function avgUtil(m: ReturnType<typeof useSim>["metrics"]) {
  if (!m) return 0.38;
  const live = API_NODES.map((id) => m.nodes[id]).filter((n) => !n.dead);
  if (!live.length) return 0;
  return live.reduce((a, n) => a + n.util, 0) / live.length;
}

export function Explainers() {
  const { metrics: m } = useSim();
  const perReq = PARAMS.apiBaseMs + (m?.downstreamMs ?? 2.35);
  const cap = PARAMS.apiWorkers / (perReq / 1000);
  const util = avgUtil(m);
  const liveNodes = m ? API_NODES.map((id) => m.nodes[id]).filter((n) => !n.dead) : [];
  const perNodeRps = liveNodes.length ? liveNodes.reduce((a, n) => a + n.rps, 0) / liveNodes.length : 100;
  const inFlight = perNodeRps * (perReq / 1000);
  const rho = Math.min(util, 0.97);
  const mult = rho / (1 - rho);

  // Queueing curve: wait ∝ ρ / (1 − ρ)
  const W = 440;
  const Hh = 170;
  const maxY = 30;
  const px = (r: number) => 28 + r * (W - 44);
  const py = (y: number) => Hh - 18 - (Math.min(y, maxY) / maxY) * (Hh - 30);
  const curve = Array.from({ length: 60 }, (_, i) => {
    const r = (i / 59) * 0.97;
    return `${px(r).toFixed(1)},${py(r / (1 - r)).toFixed(1)}`;
  }).join(" ");

  const breaker: BreakerState = m?.breaker ?? "closed";
  const amp = m?.amplification ?? 1;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card n="01" title="Little's law: slow is expensive" formula="capacity = workers ÷ time per request">
        <p>
          Each API node has {PARAMS.apiWorkers} workers. A request holds one for its own {PARAMS.apiBaseMs}ms of work{" "}
          <em>plus</em> every millisecond it waits on Redis or Postgres. That&apos;s why a slow dependency is so
          dangerous: it doesn&apos;t fail anything, it just quietly shrinks capacity.
        </p>
        <p>
          Flip it around and you get the number of requests in flight: <span className="font-mono text-[13px]">arrival rate × time</span>.
          Once that exceeds the worker count, the rest wait in a queue.
        </p>
        <div className="mt-auto rounded-lg border border-line p-3 font-mono text-[12px]">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex gap-1" aria-hidden>
              {Array.from({ length: PARAMS.apiWorkers }).map((_, i) => {
                const fill = Math.max(0, Math.min(1, inFlight - i));
                return (
                  <span key={i} className="relative h-5 w-5 overflow-hidden rounded border border-line-strong">
                    <span
                      className="absolute inset-y-0 left-0 transition-[width]"
                      style={{ width: `${fill * 100}%`, background: inFlight > PARAMS.apiWorkers * 0.9 ? "var(--bad)" : "var(--ok)" }}
                    />
                  </span>
                );
              })}
            </div>
            <span className="text-dim">
              {Math.round(perNodeRps)} req/s × {fmtMs(perReq)} ={" "}
              <span className={inFlight > PARAMS.apiWorkers ? "text-bad" : "text-ink"}>{inFlight.toFixed(1)} in flight</span>
              {inFlight > PARAMS.apiWorkers ? " — queueing" : ""}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-dim">time per request now</span>
            <span className="text-ink">{fmtMs(perReq)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dim">capacity per node now</span>
            <span className={cap < 150 ? "text-bad" : "text-ink"}>{Math.round(cap)} req/s</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-ok transition-[width]" style={{ width: `${Math.min(100, (cap / 280) * 100)}%` }} />
          </div>
        </div>
      </Card>

      <Card n="02" title="Queueing: there is no “a bit slower”" formula="waiting ∝ ρ ÷ (1 − ρ)">
        <p>
          ρ is utilisation. At 50% busy, requests wait 1 unit; at 90%, 9; at 99%, 99. Latency stays flat for a long time,
          then hits a cliff. That&apos;s why you shed load at 90%, not 100%.
        </p>
        <svg viewBox={`0 0 ${W} ${Hh}`} className="mt-auto w-full max-w-lg" role="img" aria-label={`Queueing curve. Current utilisation ${Math.round(util * 100)}%.`}>
          <line x1={28} x2={W - 8} y1={Hh - 18} y2={Hh - 18} stroke="var(--line-strong)" />
          <line x1={28} x2={28} y1={8} y2={Hh - 18} stroke="var(--line-strong)" />
          <line x1={px(0.9)} x2={px(0.9)} y1={8} y2={Hh - 18} stroke="var(--warn)" strokeDasharray="3 3" />
          <text x={px(0.9) - 4} y={18} textAnchor="end" className="font-mono text-[11px]" fill="var(--warn)">
            shed at 90%
          </text>
          <polyline points={curve} fill="none" stroke="var(--ink)" strokeWidth={1.5} />
          <circle cx={px(rho)} cy={py(mult)} r={5} fill={util >= 0.9 ? "var(--bad)" : "var(--accent)"} />
          <text x={px(rho) + (rho > 0.6 ? -10 : 10)} y={py(mult) - 10} textAnchor={rho > 0.6 ? "end" : "start"} className="font-mono text-[11px]" fill="var(--ink)">
            now {Math.round(util * 100)}%{util > 0.97 ? "+" : ""}
          </text>
          {[0, 0.5, 1].map((r) => (
            <text key={r} x={px(r)} y={Hh - 3} textAnchor="middle" className="font-mono text-[11px]" fill="var(--dim)">
              {r * 100}%
            </text>
          ))}
        </svg>
      </Card>

      <Card n="03" title="Circuit breakers: fail fast, recover safely" formula="closed → open → half-open → closed">
        <p>
          When more than {PARAMS.breakerTripRate * 100}% of Postgres calls fail, the breaker opens and stops calling it
          entirely — serving stale cached copies instead. After {PARAMS.breakerOpenS}s it goes half-open and lets 10% of
          traffic probe. Healthy probes close it; failing ones re-open it.
        </p>
        <svg viewBox="0 0 260 96" className="mt-auto w-full max-w-md self-center" role="img" aria-label={`Breaker state machine. Current state: ${breaker}.`}>
          <defs>
            <marker id="arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill="var(--dim)" />
            </marker>
          </defs>
          <path d="M70,30 L106,30" stroke="var(--dim)" markerEnd="url(#arr)" />
          <text x={88} y={22} textAnchor="middle" className="font-mono text-[8px]" fill="var(--dim)">&gt;50% fail</text>
          <path d="M170,40 Q190,74 156,78" stroke="var(--dim)" fill="none" markerEnd="url(#arr)" />
          <text x={204} y={66} className="font-mono text-[8px]" fill="var(--dim)">after {PARAMS.breakerOpenS}s</text>
          <path d="M96,78 Q40,80 40,46" stroke="var(--dim)" fill="none" markerEnd="url(#arr)" />
          <text x={18} y={86} className="font-mono text-[8px]" fill="var(--dim)">probes ok</text>
          <path d="M128,66 L136,46" stroke="var(--dim)" markerEnd="url(#arr)" />
          {(
            [
              ["closed", 40, 30],
              ["open", 140, 30],
              ["half-open", 126, 78],
            ] as const
          ).map(([s, x, y]) => {
            const on = breaker === s;
            const color = s === "closed" ? "var(--ok)" : s === "open" ? "var(--bad)" : "var(--warn)";
            return (
              <g key={s} transform={`translate(${x},${y})`}>
                <rect x={-30} y={-11} width={60} height={22} rx={11} fill={on ? color : "var(--panel)"} stroke={color} />
                <text textAnchor="middle" y={4} className="font-mono text-[9.5px]" fill={on ? "var(--paper)" : color}>
                  {s}
                </text>
              </g>
            );
          })}
        </svg>
      </Card>

      <Card n="04" title="Retries: helpful, until they aren't" formula="load = arrivals × (1 + retry rate), up to 3×">
        <p>
          A retry turns a transient failure into a success — great when one node blips. But when failures come from
          overload, every retry is extra load on an already overloaded system. With 3 attempts, a struggling system can
          see 3× its normal traffic. Retry budgets, backoff with jitter, and load shedding stop that spiral.
        </p>
        <div className="mt-auto rounded-lg border border-line p-3">
          <div className="flex items-baseline justify-between font-mono text-[12px]">
            <span className="text-dim">load amplification now</span>
            <span className={amp > 1.5 ? "text-bad" : amp > 1.1 ? "text-warn" : "text-ink"}>{amp.toFixed(2)}×</span>
          </div>
          <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-line">
            <div className="bg-ink-soft" style={{ width: `${(1 / 3) * 100}%` }} />
            <div className="bg-bad transition-[width]" style={{ width: `${((Math.min(amp, 3) - 1) / 3) * 100}%` }} />
          </div>
          <div className="mt-1 flex justify-between font-mono text-[9.5px] text-dim">
            <span>1× arrivals</span>
            <span>3× max</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
