"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { API_NODES, type ApiNode, type ComponentId, type SampleRequest } from "@/lib/chaos";
import { componentInfo } from "@/lib/explain";
import { useSim } from "./SimProvider";
import { Panel, fmtMs } from "./bits";

const OUTCOME_STYLE: Record<SampleRequest["outcome"], { label: string; color: string }> = {
  ok: { label: "200 ok", color: "var(--ok)" },
  fallback: { label: "200 fallback", color: "var(--accent)" },
  shed: { label: "429 shed", color: "var(--warn)" },
  error: { label: "failed", color: "var(--bad)" },
};

export function Inspector() {
  const { selected, select, focus } = useSim();
  const tab = selected ? "component" : "request";

  return (
    <Panel
      title={
        <span className="flex gap-3">
          <button
            type="button"
            onClick={() => select(null)}
            className={tab === "request" ? "text-ink" : "hover:text-ink"}
            aria-pressed={tab === "request"}
          >
            request inspector
          </button>
          {selected && <span className="text-ink">· {selected}</span>}
        </span>
      }
      right={
        selected ? (
          <button type="button" onClick={() => select(null)} className="font-mono text-[10px] text-dim hover:text-ink">
            close ✕
          </button>
        ) : null
      }
      focused={focus.includes("inspector")}
    >
      {selected ? <ComponentView id={selected} /> : <RequestView />}
    </Panel>
  );
}

function RequestView() {
  const { metrics } = useSim();
  const [sample, setSample] = useState<SampleRequest | null>(null);
  const [follow, setFollow] = useState(true);
  const metricsRef = useRef(metrics);

  useEffect(() => {
    metricsRef.current = metrics;
  }, [metrics]);

  // Prefer showing "interesting" requests (failures, fallbacks, retries) when they exist.
  const pick = useCallback(() => {
    const pool = metricsRef.current?.samples ?? [];
    if (!pool.length) return;
    const interesting = pool.filter((s) => s.outcome !== "ok" || s.spans.some((sp) => sp.status === "error"));
    const from = interesting.length && Math.random() < 0.6 ? interesting : pool;
    setSample(from[Math.floor(Math.random() * from.length)]);
  }, []);

  useEffect(() => {
    if (!follow) return;
    const first = window.setTimeout(pick, 400);
    const id = window.setInterval(pick, 2400);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [follow, pick]);

  if (!sample) {
    return <p className="p-4 text-sm text-dim">Waiting for traffic…</p>;
  }

  const style = OUTCOME_STYLE[sample.outcome];
  const total = Math.max(sample.total, ...sample.spans.map((s) => s.start + s.dur), 1);

  return (
    <div className="p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-mono text-[11px] text-dim">
          GET /claims/adjudicate · {sample.id}
        </p>
        <p className="font-mono text-[11px] font-semibold" style={{ color: style.color }}>
          {style.label} · {fmtMs(sample.total)}
        </p>
      </div>

      <ol className="mt-3 space-y-1.5">
        {sample.spans.map((sp, i) => (
          <li key={i} className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-2">
            <span className="truncate font-mono text-[10.5px] text-ink" title={sp.name}>
              {sp.name}
            </span>
            <span className="relative block h-4 overflow-hidden sm:overflow-visible">
              <span
                className="absolute inset-y-0 rounded-sm"
                style={{
                  left: `${(sp.start / total) * 100}%`,
                  width: `max(2px, ${(sp.dur / total) * 100}%)`,
                  background: sp.status === "error" ? "var(--bad)" : sp.status === "fallback" ? "var(--accent)" : "var(--ink-soft)",
                  opacity: sp.status === "ok" ? 0.55 : 0.9,
                }}
              />
              <span
                className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap pl-1 font-mono text-[9.5px] text-dim"
                style={
                  (sp.start + sp.dur) / total > 0.62
                    ? { right: `${100 - (sp.start / total) * 100}%`, paddingRight: 4 }
                    : { left: `${((sp.start + sp.dur) / total) * 100}%` }
                }
              >
                {fmtMs(sp.dur)}
                {sp.note && <span className="hidden sm:inline"> · {sp.note}</span>}
              </span>
            </span>
          </li>
        ))}
      </ol>

      <p className="mt-3 text-[13px] leading-relaxed text-ink">{sample.reason}</p>

      <div className="mt-3 flex items-center gap-4 font-mono text-[10.5px] text-dim">
        <button type="button" onClick={pick} className="hover:text-ink">
          ↻ another request
        </button>
        <label className="flex cursor-pointer items-center gap-1.5">
          <input type="checkbox" checked={follow} onChange={(e) => setFollow(e.target.checked)} className="accent-[var(--accent)]" />
          auto-refresh
        </label>
      </div>
    </div>
  );
}

function ComponentView({ id }: { id: ComponentId }) {
  const { metrics: m, faults, apply, toggleNode, log } = useSim();
  const info = componentInfo[id];
  const isApi = (API_NODES as readonly string[]).includes(id);

  const live: [string, string][] = [];
  if (m) {
    if (id === "clients") {
      live.push(["arriving", `${Math.round(m.incoming)} req/s`], ["incl. retries", `${Math.round(m.offered)} req/s`]);
    } else if (id === "lb") {
      live.push(
        ["in pool", `${API_NODES.filter((n) => m.nodes[n].inPool).length} of 3`],
        ["shedding", `${Math.round(m.shed * 100)}%`],
      );
    } else if (isApi) {
      const n = m.nodes[id as ApiNode];
      live.push(
        ["status", n.dead ? (n.inPool ? "dead, still in pool" : "dead, evicted") : "running"],
        ["load", `${Math.round(n.rps)} req/s`],
        ["capacity now", `${Math.round(n.capacity)} req/s`],
        ["workers busy", `${n.busyWorkers.toFixed(1)} / 6`],
        ["queued", `${Math.round(n.queueLen)} (+${fmtMs(n.queueMs)})`],
      );
    } else if (id === "redis") {
      live.push(["status", faults.cacheDown ? "down" : "up"], ["hit rate", `${Math.round(m.cacheHitRate * 100)}%`]);
    } else if (id === "postgres") {
      live.push(
        ["status", faults.dbDown ? "down" : faults.dbSlow ? "slow (+400ms)" : "up"],
        ["load", `${Math.round(m.dbQps)} q/s`],
        ["latency", fmtMs(m.dbLatency)],
        ["failing calls", `${Math.round(m.dbFailRate * 100)}%`],
      );
    }
  }

  const actions: { label: string; danger?: boolean; run: () => void }[] = [];
  if (isApi) {
    const dead = faults.killed[id as ApiNode];
    actions.push({ label: dead ? `restart ${id}` : `kill ${id}`, danger: !dead, run: () => toggleNode(id as ApiNode) });
  } else if (id === "redis") {
    actions.push({
      label: faults.cacheDown ? "bring redis back" : "take redis down",
      danger: !faults.cacheDown,
      run: () => {
        apply({ faults: { cacheDown: !faults.cacheDown } });
        log(faults.cacheDown ? "good" : "bad", `you: redis ${faults.cacheDown ? "restored" : "taken down"}`);
      },
    });
  } else if (id === "postgres") {
    actions.push(
      {
        label: faults.dbSlow ? "remove slowness" : "make it slow",
        danger: !faults.dbSlow,
        run: () => {
          apply({ faults: { dbSlow: !faults.dbSlow } });
          log(faults.dbSlow ? "good" : "bad", `you: postgres ${faults.dbSlow ? "back to normal speed" : "slowed by 400ms"}`);
        },
      },
      {
        label: faults.dbDown ? "bring it back" : "take it down",
        danger: !faults.dbDown,
        run: () => {
          apply({ faults: { dbDown: !faults.dbDown } });
          log(faults.dbDown ? "good" : "bad", `you: postgres ${faults.dbDown ? "restored" : "taken down"}`);
        },
      },
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div>
        <p className="font-mono text-[10.5px] uppercase tracking-wider text-accent">{info.kind}</p>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink">{info.description}</p>
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[11px]">
        {[...live, ...info.params].map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-dim">{k}</dt>
            <dd className="text-right text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="text-[12.5px] leading-relaxed text-dim">
        <span className="font-semibold text-ink">How it fails: </span>
        {info.failure}
      </p>
      {actions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {actions.map((a) => (
            <button key={a.label} type="button" onClick={a.run} className={`btn ${a.danger ? "btn-danger" : ""}`}>
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
