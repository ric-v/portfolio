"use client";

import { useSim } from "./SimProvider";
import { Diagram } from "./Diagram";
import { MetricsPanel } from "./MetricsPanel";
import { Inspector } from "./Inspector";
import { Controls } from "./Controls";
import { ScenarioPanel } from "./ScenarioPanel";
import { Panel, fmtT } from "./bits";

function StatusBar() {
  const { metrics: m, faults, paused, setPaused } = useSim();
  const avail = m ? m.availability * 100 : 100;
  const holding = avail >= 99 && m !== null && (m.fallback > 0.02 || m.shed > 0.01);
  const [label, tone] =
    avail >= 99
      ? holding
        ? ["degraded mode — but holding", "var(--warn)"]
        : ["all systems operational", "var(--ok)"]
      : avail >= 90
        ? ["partial outage", "var(--warn)"]
        : ["major outage", "var(--bad)"];

  const active = [
    ...Object.entries(faults.killed)
      .filter(([, v]) => v)
      .map(([k]) => `${k} down`),
    faults.load > 1 ? `traffic ×${faults.load}` : null,
    faults.dbSlow ? "postgres slow" : null,
    faults.dbDown ? "postgres down" : null,
    faults.cacheDown ? "redis down" : null,
  ].filter(Boolean);

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 surface rounded-xl border border-line px-4 py-2.5">
      <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: tone }}>
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-50 motion-reduce:hidden" style={{ background: tone }} />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: tone }} />
        </span>
        {label}
      </span>
      <span className="font-mono text-[11px] text-dim">
        faults: {active.length ? <span className="text-bad">{active.join(", ")}</span> : "none"}
      </span>
      <span className="ml-auto flex items-center gap-3 font-mono text-[11px] text-dim">
        t+{fmtT(m?.t ?? 0)}
        <button type="button" onClick={() => setPaused(!paused)} className="rounded border border-line px-2 py-0.5 hover:text-ink">
          {paused ? "▶ resume" : "❚❚ pause"}
        </button>
      </span>
    </div>
  );
}

function EventLog() {
  const { events } = useSim();
  return (
    <Panel title="event log">
      <ol className="h-48 overflow-y-auto px-4 py-2 font-mono text-[11px] leading-6" aria-live="polite">
        {events.length === 0 && <li className="text-dim">Nothing has broken yet. Go on.</li>}
        {events.map((e, i) => (
          <li key={`${e.t}-${i}`} className="flex gap-3">
            <span className="shrink-0 text-dim">{fmtT(e.t)}</span>
            <span
              style={{
                color:
                  e.level === "bad" ? "var(--bad)" : e.level === "warn" ? "var(--warn)" : e.level === "good" ? "var(--ok)" : "var(--ink)",
              }}
            >
              {e.msg}
            </span>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

export function Console({ initialScenarioId }: { initialScenarioId?: string }) {
  return (
    <div className="space-y-4">
      <ScenarioPanel initialScenarioId={initialScenarioId} />
      <StatusBar />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-4">
          <Panel
            title="system"
            right={<span className="font-mono text-[10px] text-dim">click any component to inspect it</span>}
          >
            <div className="p-2 sm:p-4">
              <Diagram />
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-line px-4 py-2 font-mono text-[10px] text-dim">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-ok" /> busy worker
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm border border-line-strong" /> idle worker
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-4 rounded-full bg-bad" /> queue
              </span>
              <span>dashes = traffic · red = failing link</span>
            </div>
          </Panel>
          <Controls />
        </div>
        <div className="min-w-0 space-y-4">
          <MetricsPanel />
          <Inspector />
          <EventLog />
        </div>
      </div>
    </div>
  );
}
