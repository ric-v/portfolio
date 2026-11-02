"use client";

import { API_NODES, ALL_DEFENCES, NO_DEFENCES, type Faults } from "@/lib/chaos";
import { defenceInfo } from "@/lib/explain";
import { useSim } from "./SimProvider";
import { Panel } from "./bits";

function Segmented<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string; bad?: boolean }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <span className="w-16 shrink-0 font-mono text-[11px] text-dim">{label}</span>
      <div role="radiogroup" aria-label={label} className="inline-flex overflow-hidden rounded-lg border border-line">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={String(o.value)}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.value)}
              className={`border-r border-line px-2.5 py-1 text-[12px] last:border-r-0 transition-colors ${
                active ? (o.bad ? "bg-bad text-paper" : "bg-ink text-paper") : "text-dim hover:bg-subtle hover:text-ink"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Controls() {
  const { faults, defences, apply, toggleNode, log } = useSim();

  const dbState = faults.dbDown ? "down" : faults.dbSlow ? "slow" : "ok";
  const setDb = (v: string) => {
    apply({ faults: { dbDown: v === "down", dbSlow: v === "slow" } });
    log(v === "ok" ? "good" : "bad", `you: postgres → ${v === "ok" ? "healthy" : v === "slow" ? "slow (+400ms)" : "down"}`);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="break things">
        <div className="space-y-3 p-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="w-16 shrink-0 font-mono text-[11px] text-dim">api nodes</span>
            <div className="flex flex-wrap gap-1.5">
              {API_NODES.map((id) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={faults.killed[id]}
                  onClick={() => toggleNode(id)}
                  className={`rounded-lg border px-2.5 py-1 font-mono text-[12px] transition-colors ${
                    faults.killed[id]
                      ? "border-bad bg-bad text-paper"
                      : "border-line text-ink hover:border-bad hover:text-bad"
                  }`}
                  title={faults.killed[id] ? `Restart ${id}` : `Kill ${id}`}
                >
                  {faults.killed[id] ? `✕ ${id}` : `kill ${id}`}
                </button>
              ))}
            </div>
          </div>
          <Segmented
            label="traffic"
            value={faults.load}
            options={[
              { value: 1, label: "normal" },
              { value: 2, label: "busy ×2" },
              { value: 3, label: "spike ×3", bad: true },
            ]}
            onChange={(v) => {
              apply({ faults: { load: v as Faults["load"] } });
              log(v === 1 ? "good" : "bad", `you: traffic → ${v === 1 ? "normal" : v === 2 ? "busy ×2" : "spike ×3"}`);
            }}
          />
          <Segmented
            label="postgres"
            value={dbState}
            options={[
              { value: "ok", label: "healthy" },
              { value: "slow", label: "slow +400ms", bad: true },
              { value: "down", label: "down", bad: true },
            ]}
            onChange={setDb}
          />
          <Segmented
            label="redis"
            value={faults.cacheDown ? "down" : "up"}
            options={[
              { value: "up", label: "healthy" },
              { value: "down", label: "down", bad: true },
            ]}
            onChange={(v) => {
              apply({ faults: { cacheDown: v === "down" } });
              log(v === "down" ? "bad" : "good", `you: redis → ${v === "down" ? "down" : "healthy"}`);
            }}
          />
        </div>
      </Panel>

      <Panel
        title="defences"
        right={
          <span className="flex gap-3 font-mono text-[10.5px]">
            <button
              type="button"
              className="text-dim hover:text-ok"
              onClick={() => {
                apply({ defences: ALL_DEFENCES });
                log("good", "you: enabled every defence");
              }}
            >
              all on
            </button>
            <button
              type="button"
              className="text-dim hover:text-bad"
              onClick={() => {
                apply({ defences: NO_DEFENCES });
                log("warn", "you: disabled every defence");
              }}
            >
              all off
            </button>
          </span>
        }
      >
        <ul className="divide-y divide-line">
          {defenceInfo.map(({ key, label, short }) => (
            <li key={key}>
              <label className="flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-subtle">
                <span className="relative inline-flex h-[18px] w-8 shrink-0 items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={defences[key]}
                    onChange={() => {
                      const on = !defences[key];
                      apply({ defences: { [key]: on } });
                      log(on ? "good" : "warn", `you: ${on ? "enabled" : "disabled"} ${label.toLowerCase()}`);
                    }}
                  />
                  <span className="absolute inset-0 rounded-full bg-line transition-colors peer-checked:bg-ok peer-focus-visible:ring-2 peer-focus-visible:ring-accent" />
                  <span className="absolute left-[3px] h-3 w-3 rounded-full bg-paper shadow transition-transform peer-checked:translate-x-[14px]" />
                </span>
                <span className="min-w-0">
                  <span className={`block text-[13px] ${defences[key] ? "text-ink" : "text-dim"}`}>{label}</span>
                  <span className="block truncate font-mono text-[10.5px] text-dim">{short}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
