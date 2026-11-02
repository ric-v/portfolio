"use client";

import { API_NODES, PARAMS, type ApiNode, type ComponentId, type Metrics } from "@/lib/chaos";
import type { Focus } from "@/lib/scenarios";
import { useSim } from "./SimProvider";

type Health = "ok" | "warn" | "bad" | "dead";
type Rect = { x: number; y: number; w: number; h: number };

interface Layout {
  dir: "h" | "v";
  viewBox: string;
  boxes: Record<ComponentId, Rect>;
  breakerAt: { x: number; y: number };
}

const H: Layout = {
  dir: "h",
  viewBox: "0 0 720 300",
  boxes: {
    clients: { x: 6, y: 125, w: 92, h: 50 },
    lb: { x: 140, y: 125, w: 104, h: 50 },
    "api-1": { x: 292, y: 6, w: 156, h: 86 },
    "api-2": { x: 292, y: 107, w: 156, h: 86 },
    "api-3": { x: 292, y: 208, w: 156, h: 86 },
    redis: { x: 560, y: 34, w: 152, h: 58 },
    postgres: { x: 560, y: 186, w: 152, h: 78 },
  },
  breakerAt: { x: 505, y: 232 },
};

const V: Layout = {
  dir: "v",
  viewBox: "0 0 360 500",
  boxes: {
    clients: { x: 125, y: 6, w: 110, h: 50 },
    lb: { x: 125, y: 96, w: 110, h: 50 },
    "api-1": { x: 4, y: 196, w: 114, h: 92 },
    "api-2": { x: 123, y: 196, w: 114, h: 92 },
    "api-3": { x: 242, y: 196, w: 114, h: 92 },
    redis: { x: 10, y: 392, w: 150, h: 58 },
    postgres: { x: 200, y: 384, w: 150, h: 78 },
  },
  breakerAt: { x: 300, y: 350 },
};

function fmtMs(ms: number) {
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.round(ms)}ms`;
}

export function Diagram() {
  const { metrics: m, faults, defences, selected, select, focus } = useSim();
  const rps = m?.incoming ?? PARAMS.baseRps;

  const health = (id: ComponentId): Health => {
    if (id === "clients") return "ok";
    if (id === "lb") return m && m.shed > 0.01 ? "warn" : "ok";
    if (id === "redis") return faults.cacheDown ? "dead" : "ok";
    if (id === "postgres") {
      if (faults.dbDown) return "dead";
      if (!m) return "ok";
      return m.dbLatency > 150 || m.dbUtil > 1 ? "bad" : m.dbUtil > 0.8 || faults.dbSlow ? "warn" : "ok";
    }
    if (faults.killed[id]) return "dead";
    const n = m?.nodes[id];
    if (!n) return "ok";
    return n.util >= 1 || n.queueMs > 250 ? "bad" : n.util > 0.8 ? "warn" : "ok";
  };

  const ui: UI = { selected, select, focus };
  const speed = (load: number) => `${Math.max(0.25, 1.6 - Math.min(load, 1200) / 900)}s`;

  const render = (L: Layout, className: string) => {
    const b = L.boxes;
    const out = (r: Rect) => (L.dir === "h" ? { x: r.x + r.w, y: r.y + r.h / 2 } : { x: r.x + r.w / 2, y: r.y + r.h });
    const into = (r: Rect) => (L.dir === "h" ? { x: r.x, y: r.y + r.h / 2 } : { x: r.x + r.w / 2, y: r.y });
    const edge = (a: Rect, c: Rect) => {
      const p = out(a);
      const q = into(c);
      return { x1: p.x, y1: p.y, x2: q.x, y2: q.y };
    };
    const breakerOpen = m?.breaker === "open";

    return (
      <svg
        viewBox={L.viewBox}
        className={className}
        role="group"
        aria-label="System diagram. Select a component to inspect it."
      >
        <Edge {...edge(b.clients, b.lb)} dur={speed(rps)} active />
        {API_NODES.map((id) => {
          const dead = faults.killed[id];
          const routed = m?.nodes[id]?.inPool ?? true;
          return (
            <g key={id}>
              <Edge {...edge(b.lb, b[id])} dur={speed(rps / 3)} active={routed} broken={dead && routed} />
              <Edge {...edge(b[id], b.redis)} dur={speed(rps / 3)} active={!dead} broken={!dead && faults.cacheDown} />
              <Edge
                {...edge(b[id], b.postgres)}
                dur={speed(rps / 8)}
                active={!dead && !breakerOpen}
                broken={!dead && !breakerOpen && faults.dbDown}
              />
            </g>
          );
        })}

        <Node id="clients" r={b.clients} health="ok" sub={`${Math.round(rps)} req/s`} ui={ui} />
        <Node
          id="lb"
          ui={ui}
          r={b.lb}
          health={health("lb")}
          sub={
            m && m.shed > 0.01
              ? `shedding ${Math.round(m.shed * 100)}%`
              : `${API_NODES.filter((n) => m?.nodes[n]?.inPool ?? true).length} in pool`
          }
        />
        {API_NODES.map((id) => (
          <ApiBox key={id} id={id} r={b[id]} health={health(id)} m={m} compact={L.dir === "v"} ui={ui} />
        ))}
        <Node
          id="redis"
          ui={ui}
          r={b.redis}
          health={health("redis")}
          sub={faults.cacheDown ? "down — every read misses" : `${Math.round((m?.cacheHitRate ?? 0.85) * 100)}% hit rate`}
        />
        <DbBox r={b.postgres} health={health("postgres")} m={m} down={faults.dbDown} ui={ui} />

        {defences.breaker && (
          <g transform={`translate(${L.breakerAt.x},${L.breakerAt.y})`} className={focus.includes("breaker") ? "focus-pulse" : ""}>
            <rect
              x={-46}
              y={-11}
              width={92}
              height={22}
              rx={11}
              fill="var(--panel)"
              stroke={m?.breaker === "open" ? "var(--bad)" : m?.breaker === "half-open" ? "var(--warn)" : "var(--line-strong)"}
              strokeWidth={focus.includes("breaker") ? 2 : 1}
            />
            <text
              textAnchor="middle"
              y={4}
              className="font-mono text-[10px]"
              fill={m?.breaker === "open" ? "var(--bad)" : m?.breaker === "half-open" ? "var(--warn)" : "var(--dim)"}
            >
              breaker {m?.breaker ?? "closed"}
            </text>
          </g>
        )}
      </svg>
    );
  };

  return (
    <div>
      {render(H, "hidden h-auto w-full sm:block")}
      {render(V, "block h-auto w-full sm:hidden")}
    </div>
  );
}

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
      stroke={broken ? "var(--bad)" : active ? "var(--ink-soft)" : "var(--line)"}
      strokeWidth={active ? 1.3 : 1}
      strokeDasharray={active ? "3 5" : "2 5"}
      className={active ? "flow" : undefined}
      style={{ animationDuration: dur }}
    />
  );
}

type UI = { selected: ComponentId | null; select: (id: ComponentId | null) => void; focus: Focus[] };

function Frame({ id, r, health: h, ui, children }: { id: ComponentId; r: Rect; health: Health; ui: UI; children: React.ReactNode }) {
  const { selected, select, focus } = ui;
  const isSel = selected === id;
  const isFocus = focus.includes(id);
  const stroke = h === "dead" || h === "bad" ? "var(--bad)" : h === "warn" ? "var(--warn)" : "var(--line-strong)";
  return (
    <g
      transform={`translate(${r.x},${r.y})`}
      role="button"
      tabIndex={0}
      aria-pressed={isSel}
      aria-label={`Inspect ${id}`}
      onClick={() => select(isSel ? null : id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          select(isSel ? null : id);
        }
      }}
      className="cursor-pointer outline-none [&:focus-visible>rect:first-of-type]:stroke-[var(--accent)]"
    >
      {(isFocus || isSel) && (
        <rect
          x={-5}
          y={-5}
          width={r.w + 10}
          height={r.h + 10}
          rx={10}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={isSel ? 2 : 1.5}
          className={isFocus && !isSel ? "focus-pulse" : ""}
        />
      )}
      <rect
        width={r.w}
        height={r.h}
        rx={7}
        fill={h === "dead" ? "var(--bad-soft)" : "var(--panel)"}
        stroke={stroke}
        strokeWidth={h === "ok" ? 1 : 1.6}
        strokeDasharray={h === "dead" ? "4 3" : undefined}
      />
      {children}
    </g>
  );
}

function Node({ id, r, health: h, sub, ui }: { id: ComponentId; r: Rect; health: Health; sub: string; ui: UI }) {
  return (
    <Frame id={id} r={r} health={h} ui={ui}>
      <text x={10} y={20} className="text-[12px] font-semibold" fill="var(--ink)">
        {h === "dead" ? "✕ " : ""}
        {id}
      </text>
      <text x={10} y={37} className="font-mono text-[10px]" fill={h === "ok" ? "var(--dim)" : h === "warn" ? "var(--warn)" : "var(--bad)"}>
        {sub}
      </text>
    </Frame>
  );
}

function ApiBox({
  id,
  r,
  health: h,
  m,
  compact,
  ui,
}: {
  id: ApiNode;
  r: Rect;
  health: Health;
  m: Metrics | null;
  compact: boolean;
  ui: UI;
}) {
  const n = m?.nodes[id];
  const busy = n?.busyWorkers ?? 0;
  const queueFrac = n && n.capacity > 0 ? Math.min(1, n.queueLen / (n.capacity * 1)) : 0;
  const slot = compact ? 13 : 16;
  const gap = compact ? 3 : 4;
  const color = h === "bad" ? "var(--bad)" : h === "warn" ? "var(--warn)" : "var(--ok)";
  const workersFocused = ui.focus.includes("workers");
  return (
    <Frame id={id} r={r} health={h} ui={ui}>
      <text x={10} y={19} className="text-[12px] font-semibold" fill="var(--ink)">
        {h === "dead" ? "✕ " : ""}
        {id}
      </text>
      <text x={r.w - 10} y={19} textAnchor="end" className="font-mono text-[10px]" fill={h === "ok" ? "var(--dim)" : color}>
        {h === "dead" ? (n?.inPool ? "dead · in pool!" : "dead") : n ? `${Math.round(Math.min(n.util, 9.99) * 100)}%` : ""}
      </text>
      {h !== "dead" && (
        <>
          <g transform={`translate(10, ${compact ? 30 : 30})`} className={workersFocused ? "focus-pulse" : ""}>
            {Array.from({ length: PARAMS.apiWorkers }).map((_, i) => {
              const fill = Math.max(0, Math.min(1, busy - i));
              return (
                <g key={i} transform={`translate(${i * (slot + gap)},0)`}>
                  <rect width={slot} height={slot} rx={3} fill="none" stroke="var(--line-strong)" />
                  {fill > 0 && <rect width={slot * fill} height={slot} rx={3} fill={color} opacity={0.85} />}
                </g>
              );
            })}
          </g>
          <g transform={`translate(10, ${compact ? 56 : 58})`}>
            <rect width={r.w - 20} height={6} rx={3} fill="var(--line)" />
            {queueFrac > 0.002 && <rect width={(r.w - 20) * queueFrac} height={6} rx={3} fill="var(--bad)" />}
            <text y={compact ? 20 : 18} className="font-mono text-[9.5px]" fill={queueFrac > 0.02 ? "var(--bad)" : "var(--dim)"}>
              queue {Math.round(n?.queueLen ?? 0)}
              {n && n.queueMs > 5 ? ` · +${fmtMs(n.queueMs)}` : ""}
            </text>
          </g>
        </>
      )}
    </Frame>
  );
}

function DbBox({ r, health: h, m, down, ui }: { r: Rect; health: Health; m: Metrics | null; down: boolean; ui: UI }) {
  const util = Math.min(1.5, m?.dbUtil ?? 0);
  const color = h === "bad" || util > 1 ? "var(--bad)" : h === "warn" ? "var(--warn)" : "var(--ok)";
  return (
    <Frame id="postgres" r={r} health={h} ui={ui}>
      <text x={10} y={20} className="text-[12px] font-semibold" fill="var(--ink)">
        {down ? "✕ " : ""}postgres
      </text>
      <text x={10} y={37} className="font-mono text-[10px]" fill={h === "ok" ? "var(--dim)" : color}>
        {down ? "down" : m ? `${Math.round(m.dbQps)} q/s · ${fmtMs(m.dbLatency)}` : "—"}
      </text>
      {!down && (
        <g transform="translate(10, 50)">
          <rect width={r.w - 20} height={6} rx={3} fill="var(--line)" />
          <rect width={(r.w - 20) * Math.min(1, util)} height={6} rx={3} fill={color} />
          <text y={19} className="font-mono text-[9.5px]" fill="var(--dim)">
            {Math.round(util * 100)}% of {PARAMS.dbCapacity} q/s
          </text>
        </g>
      )}
    </Frame>
  );
}
