"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ALL_DEFENCES,
  API_NODES,
  DEFAULT_FAULTS,
  initialState,
  step,
  type ApiNode,
  type Defences,
  type Faults,
  type Metrics,
  type SimEvent,
} from "@/lib/chaos";

const TICK_MS = 200;
const HISTORY = 75; // 15s of history

const DEFENCE_INFO: { key: keyof Defences; label: string; note: string }[] = [
  { key: "healthChecks", label: "health checks", note: "LB stops routing to dead nodes" },
  { key: "timeouts", label: "timeouts", note: "bound how long anything can wait" },
  { key: "retries", label: "retries + backoff", note: "recover from transient failures" },
  { key: "breaker", label: "circuit breaker", note: "stop calling a failing dependency" },
  { key: "shedding", label: "load shedding", note: "reject excess fast, keep the rest fast" },
];

type FaultToggle = Exclude<keyof Faults, "killed">;

const FAULT_INFO: { key: FaultToggle; label: string }[] = [
  { key: "spike", label: "traffic spike ×3" },
  { key: "dbSlow", label: "slow postgres +400ms" },
  { key: "dbDown", label: "postgres down" },
  { key: "cacheDown", label: "redis down" },
];

function fmtMs(ms: number) {
  if (ms >= 1000) return `${(ms / 1000).toFixed(ms >= 9950 ? 0 : 1)}s`;
  return `${Math.round(ms)}ms`;
}

function fmtT(t: number) {
  const s = Math.floor(t);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function Lab() {
  const [faults, setFaults] = useState<Faults>(DEFAULT_FAULTS);
  const [defences, setDefences] = useState<Defences>(ALL_DEFENCES);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [history, setHistory] = useState<Metrics[]>([]);
  const [events, setEvents] = useState<SimEvent[]>([]);

  const sim = useRef(initialState());
  const faultsRef = useRef(faults);
  const defRef = useRef(defences);

  useEffect(() => {
    faultsRef.current = faults;
    defRef.current = defences;
  }, [faults, defences]);

  const log = useCallback((level: SimEvent["level"], msg: string) => {
    setEvents((e) => [{ t: sim.current.t, level, msg }, ...e].slice(0, 40));
  }, []);

  // Simulation loop — pauses when the tab is hidden.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.hidden) return;
      const r = step(sim.current, faultsRef.current, defRef.current, TICK_MS / 1000);
      sim.current = r.state;
      setMetrics(r.metrics);
      setHistory((h) => [...h, r.metrics].slice(-HISTORY));
      if (r.events.length) setEvents((e) => [...[...r.events].reverse(), ...e].slice(0, 40));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  const toggleNode = (id: ApiNode) => {
    const dead = !faults.killed[id];
    setFaults((f) => ({ ...f, killed: { ...f.killed, [id]: dead } }));
    log(dead ? "bad" : "good", dead ? `you: killed ${id}` : `you: restarted ${id}`);
  };

  const killRandom = () => {
    const alive = API_NODES.filter((id) => !faults.killed[id]);
    if (alive.length === 0) return;
    toggleNode(alive[Math.floor(Math.random() * alive.length)]);
  };

  const toggleFault = (key: FaultToggle, label: string) => {
    const on = !faults[key];
    setFaults((f) => ({ ...f, [key]: on }));
    log(on ? "bad" : "good", `you: ${on ? "injected" : "cleared"} ${label}`);
  };

  const toggleDefence = (key: keyof Defences, label: string) => {
    const on = !defences[key];
    setDefences((d) => ({ ...d, [key]: on }));
    log(on ? "good" : "warn", `you: ${on ? "enabled" : "disabled"} ${label}`);
  };

  const reset = () => {
    setFaults(DEFAULT_FAULTS);
    setDefences(ALL_DEFENCES);
    log("info", "you: reset — all faults cleared, all defences on");
  };

  const defencesOff = () => {
    setDefences({ healthChecks: false, timeouts: false, retries: false, breaker: false, shedding: false });
    log("warn", "you: disabled every defence");
  };

  const m = metrics;
  const availPct = m ? m.availability * 100 : 100;
  const status = !m ? "ok" : availPct >= 99 ? "ok" : availPct >= 90 ? "warn" : "bad";
  const holding = status === "ok" && m !== null && (m.degraded > 0.02 || m.shed > 0.01);

  return (
    <div className="space-y-6">
      {/* Status line */}
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-y border-ink py-3 text-sm">
        <span
          className={`font-bold ${holding ? "text-warn" : status === "ok" ? "text-ok" : status === "warn" ? "text-warn" : "text-bad"}`}
        >
          {holding
            ? "● degraded mode — but holding"
            : status === "ok"
              ? "● all systems operational"
              : status === "warn"
                ? "● partial outage"
                : "● major outage"}
        </span>
        <span className="text-dim">t+{fmtT(m?.t ?? 0)}</span>
        <span className="text-dim">
          breaker <span className={m?.breaker === "closed" ? "" : "text-warn"}>{m?.breaker ?? "closed"}</span>
        </span>
      </div>

      {/* Metrics */}
      <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
        <Stat
          label="availability"
          value={`${availPct.toFixed(availPct >= 99.95 ? 0 : 1)}%`}
          tone={status}
          series={history.map((h) => h.availability)}
          min={0}
          max={1}
        />
        <Stat label="p50 latency" value={m ? fmtMs(m.p50) : "—"} series={history.map((h) => Math.log10(Math.max(1, h.p50)))} min={0} max={4} />
        <Stat
          label="p99 latency"
          value={m ? fmtMs(m.p99) : "—"}
          tone={m && m.p99 > 1000 ? "bad" : m && m.p99 > 300 ? "warn" : "ok"}
          series={history.map((h) => Math.log10(Math.max(1, h.p99)))}
          min={0}
          max={4}
        />
        <Stat label="good req/s" value={m ? `${Math.round(m.goodput)}` : "—"} sub={m ? `of ${Math.round(m.incoming)}` : ""} series={history.map((h) => h.goodput)} min={0} max={Math.max(400, ...history.map((h) => h.incoming))} />
      </dl>

      {m && (m.degraded > 0.005 || m.shed > 0.005 || m.errors > 0.005) && (
        <p className="text-xs text-dim">
          {m.degraded > 0.005 && <>served from fallback {Math.round(m.degraded * 100)}% · </>}
          {m.shed > 0.005 && <>shed (429) {Math.round(m.shed * 100)}% · </>}
          failed or too slow {Math.round(m.errors * 100)}%
        </p>
      )}

      {/* Diagram */}
      <Diagram metrics={m} faults={faults} defences={defences} onNode={toggleNode} onFault={toggleFault} />

      {/* Controls */}
      <div className="grid gap-8 md:grid-cols-2">
        <fieldset>
          <legend className="mb-3 text-xs uppercase tracking-widest text-dim">break things</legend>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={killRandom} className="btn btn-bad">
              kill a node
            </button>
            {FAULT_INFO.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                aria-pressed={faults[key]}
                onClick={() => toggleFault(key, label)}
                className={`btn ${faults[key] ? "btn-on-bad" : ""}`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-dim">tip: click nodes in the diagram to kill / restart them.</p>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-xs uppercase tracking-widest text-dim">defences</legend>
          <ul className="space-y-1.5">
            {DEFENCE_INFO.map(({ key, label, note }) => (
              <li key={key}>
                <label className="flex cursor-pointer items-baseline gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={defences[key]}
                    onChange={() => toggleDefence(key, label)}
                    className="translate-y-[1px] accent-[var(--ink)]"
                  />
                  <span className={defences[key] ? "" : "text-dim line-through"}>{label}</span>
                  <span className="hidden text-xs text-dim sm:inline">— {note}</span>
                </label>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-4 text-xs">
            <button type="button" onClick={defencesOff} className="underline underline-offset-2 hover:text-bad">
              turn off all defences
            </button>
            <button type="button" onClick={reset} className="underline underline-offset-2 hover:text-ok">
              reset everything
            </button>
          </div>
        </fieldset>
      </div>

      {/* Event log */}
      <section aria-label="Event log">
        <h3 className="mb-2 text-xs uppercase tracking-widest text-dim">event log</h3>
        <ol className="h-44 overflow-y-auto border border-line p-3 text-xs leading-6" aria-live="polite">
          {events.length === 0 && <li className="text-dim">nothing has broken yet. go on.</li>}
          {events.map((e, i) => (
            <li key={`${e.t}-${i}`} className="flex gap-3">
              <span className="shrink-0 text-dim">{fmtT(e.t)}</span>
              <span
                className={
                  e.level === "bad" ? "text-bad" : e.level === "warn" ? "text-warn" : e.level === "good" ? "text-ok" : ""
                }
              >
                {e.msg}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

/* ---------- small pieces ---------- */

function Stat({
  label,
  value,
  sub,
  tone,
  series,
  min,
  max,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "ok" | "warn" | "bad";
  series: number[];
  min: number;
  max: number;
}) {
  const color = tone === "bad" ? "var(--bad)" : tone === "warn" ? "var(--warn)" : "var(--ink)";
  const pts = series
    .map((v, i) => {
      const x = (i / (HISTORY - 1)) * 100;
      const y = 24 - ((Math.min(max, Math.max(min, v)) - min) / (max - min || 1)) * 22 - 1;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <div>
      <dt className="text-xs text-dim">{label}</dt>
      <dd>
        <span className="block text-2xl font-bold tabular-nums" style={{ color }}>
          {value}
          {sub && <span className="ml-1 text-xs font-normal text-dim">{sub}</span>}
        </span>
        <svg viewBox="0 0 100 24" preserveAspectRatio="none" className="mt-1 h-6 w-full" aria-hidden>
          <polyline points={pts} fill="none" stroke={color} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        </svg>
      </dd>
    </div>
  );
}

type Health = "ok" | "warn" | "bad" | "dead";

function Diagram({
  metrics,
  faults,
  defences,
  onNode,
  onFault,
}: {
  metrics: Metrics | null;
  faults: Faults;
  defences: Defences;
  onNode: (id: ApiNode) => void;
  onFault: (key: FaultToggle, label: string) => void;
}) {
  const rps = metrics?.incoming ?? 300;

  const nodeHealth = (id: ApiNode): Health => {
    if (faults.killed[id]) return "dead";
    const n = metrics?.nodes[id];
    if (!n) return "ok";
    return n.util >= 1 || n.queueMs > 250 ? "bad" : n.util > 0.8 ? "warn" : "ok";
  };
  const dbHealth: Health = faults.dbDown
    ? "dead"
    : metrics && (metrics.dbLatency > 150 || metrics.dbUtil > 1)
      ? "bad"
      : metrics && metrics.dbUtil > 0.8
        ? "warn"
        : "ok";
  const cacheHealth: Health = faults.cacheDown ? "dead" : "ok";
  const lbHealth: Health = metrics && metrics.shed > 0.01 ? "warn" : "ok";

  // Dash animation speed scales with traffic.
  const speed = (load: number) => `${Math.max(0.25, 1.6 - Math.min(load, 1200) / 900)}s`;

  const renderSvg = (L: Layout, className: string) => {
    const out = (b: Rect) => (L.dir === "h" ? { x: b.x + b.w, y: b.y + 20 } : { x: b.x + b.w / 2, y: b.y + 40 });
    const into = (b: Rect) => (L.dir === "h" ? { x: b.x, y: b.y + 20 } : { x: b.x + b.w / 2, y: b.y });
    const edge = (a: Rect, b: Rect) => {
      const p = out(a);
      const q = into(b);
      return { x1: p.x, y1: p.y, x2: q.x, y2: q.y };
    };

    return (
      <svg
        viewBox={L.viewBox}
        className={className}
        role="img"
        aria-label="System diagram: clients, load balancer, three API nodes, Redis and Postgres"
      >
        <Edge {...edge(L.clients, L.lb)} dur={speed(rps)} active />
        {API_NODES.map((id) => {
          const dead = faults.killed[id];
          const routed = metrics?.nodes[id]?.inPool ?? true;
          return (
            <g key={id}>
              <Edge {...edge(L.lb, L.api[id])} dur={speed(rps / 3)} active={routed} broken={dead && routed} />
              <Edge {...edge(L.api[id], L.redis)} dur={speed(rps / 3)} active={!dead && !faults.cacheDown} />
              <Edge
                {...edge(L.api[id], L.postgres)}
                dur={speed(rps / 10)}
                active={!dead && metrics?.breaker !== "open"}
                broken={!dead && faults.dbDown && metrics?.breaker !== "open"}
              />
            </g>
          );
        })}

        <Box {...L.clients} label="clients" sub={`${Math.round(rps)} rps`} health="ok" />
        <Box
          {...L.lb}
          label="lb"
          sub={
            metrics && metrics.shed > 0.01
              ? `shed ${Math.round(metrics.shed * 100)}%`
              : defences.shedding
                ? "shed: armed"
                : "no shedding"
          }
          health={lbHealth}
        />
        {API_NODES.map((id) => {
          const n = metrics?.nodes[id];
          const h = nodeHealth(id);
          return (
            <Box
              key={id}
              {...L.api[id]}
              label={id}
              sub={
                h === "dead"
                  ? n?.inPool
                    ? "dead · in pool!"
                    : "dead"
                  : n
                    ? `${Math.round(Math.min(n.util, 9.99) * 100)}% busy`
                    : "—"
              }
              health={h}
              onClick={() => onNode(id)}
              title={faults.killed[id] ? `Restart ${id}` : `Kill ${id}`}
            />
          );
        })}
        <Box
          {...L.redis}
          label="redis"
          sub={faults.cacheDown ? "down" : "85% hit rate"}
          health={cacheHealth}
          onClick={() => onFault("cacheDown", "redis down")}
          title={faults.cacheDown ? "Restore redis" : "Take redis down"}
        />
        <Box
          {...L.postgres}
          label="postgres"
          sub={
            faults.dbDown ? "down" : metrics ? `${fmtMs(metrics.dbLatency)} · ${Math.round(metrics.dbUtil * 100)}%` : "—"
          }
          health={dbHealth}
          onClick={() => onFault("dbDown", "postgres down")}
          title={faults.dbDown ? "Restore postgres" : "Take postgres down"}
        />
        {metrics && metrics.breaker !== "closed" && (
          <text x={L.breakerAt.x} y={L.breakerAt.y} textAnchor="middle" className="fill-[var(--warn)] text-[9.5px]">
            ⚡ breaker {metrics.breaker}
          </text>
        )}
      </svg>
    );
  };

  return (
    <figure className="border border-line">
      {renderSvg(HORIZONTAL, "hidden h-auto w-full sm:block")}
      {renderSvg(VERTICAL, "block h-auto w-full sm:hidden")}
    </figure>
  );
}

type Rect = { x: number; y: number; w: number };
interface Layout {
  dir: "h" | "v";
  viewBox: string;
  clients: Rect;
  lb: Rect;
  api: Record<ApiNode, Rect>;
  redis: Rect;
  postgres: Rect;
  breakerAt: { x: number; y: number };
}

const HORIZONTAL: Layout = {
  dir: "h",
  viewBox: "0 0 640 260",
  clients: { x: 8, y: 110, w: 70 },
  lb: { x: 160, y: 110, w: 80 },
  api: { "api-1": { x: 300, y: 30, w: 100 }, "api-2": { x: 300, y: 110, w: 100 }, "api-3": { x: 300, y: 190, w: 100 } },
  redis: { x: 480, y: 50, w: 110 },
  postgres: { x: 480, y: 170, w: 110 },
  breakerAt: { x: 440, y: 150 },
};

const VERTICAL: Layout = {
  dir: "v",
  viewBox: "0 0 340 372",
  clients: { x: 125, y: 8, w: 90 },
  lb: { x: 125, y: 92, w: 90 },
  api: { "api-1": { x: 6, y: 196, w: 104 }, "api-2": { x: 118, y: 196, w: 104 }, "api-3": { x: 230, y: 196, w: 104 } },
  redis: { x: 20, y: 324, w: 120 },
  postgres: { x: 200, y: 324, w: 120 },
  breakerAt: { x: 260, y: 300 },
};

function Edge({
  x1,
  y1,
  x2,
  y2,
  dur,
  active,
  broken,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dur: string;
  active?: boolean;
  broken?: boolean;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={broken ? "var(--bad)" : active ? "var(--ink)" : "var(--line)"}
      strokeWidth={active ? 1.2 : 1}
      strokeDasharray={active ? "3 5" : "2 4"}
      className={active ? "flow" : undefined}
      style={{ animationDuration: dur }}
    />
  );
}

function Box({
  x,
  y,
  w,
  label,
  sub,
  health,
  onClick,
  title,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  sub: string;
  health: Health;
  onClick?: () => void;
  title?: string;
}) {
  const stroke =
    health === "dead" ? "var(--bad)" : health === "bad" ? "var(--bad)" : health === "warn" ? "var(--warn)" : "var(--ink)";
  const interactive = Boolean(onClick);
  return (
    <g
      transform={`translate(${x},${y})`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={title}
      className={interactive ? "cursor-pointer outline-none [&:focus-visible>rect]:stroke-[3]" : undefined}
    >
      {title && <title>{title}</title>}
      <rect
        width={w}
        height={40}
        fill={health === "dead" ? "var(--bad-soft)" : "var(--paper)"}
        stroke={stroke}
        strokeWidth={health === "ok" ? 1 : 2}
        strokeDasharray={health === "dead" ? "4 3" : undefined}
      />
      <text x={8} y={16} className="fill-[var(--ink)] text-[11px] font-bold">
        {health === "dead" ? "✕ " : ""}
        {label}
      </text>
      <text x={8} y={31} className="text-[9.5px]" style={{ fill: health === "ok" ? "var(--dim)" : stroke }}>
        {sub}
      </text>
    </g>
  );
}
