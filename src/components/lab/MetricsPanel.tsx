"use client";

import { LATENCY_BUCKETS } from "@/lib/chaos";
import { HISTORY, useSim } from "./SimProvider";
import { Panel, Sparkline, fmtMs } from "./bits";

const BUCKET_LABELS = ["<10ms", "25", "50", "100", "250", "500", "1s", "2.5s", "5s", "5s+"];

export function MetricsPanel() {
  const { metrics: m, history, focus } = useSim();
  const avail = m ? m.availability * 100 : 100;
  const availTone = avail >= 99 ? "var(--ok)" : avail >= 90 ? "var(--warn)" : "var(--bad)";
  const p99Tone = !m ? "var(--ink)" : m.p99 > 1000 ? "var(--bad)" : m.p99 > 300 ? "var(--warn)" : "var(--ink)";
  const ampTone = !m ? "var(--ink)" : m.amplification > 1.5 ? "var(--bad)" : m.amplification > 1.1 ? "var(--warn)" : "var(--ink)";

  const tiles = [
    {
      key: "availability",
      label: "availability",
      hint: "good = succeeded in under 1s",
      value: `${avail.toFixed(avail >= 99.95 || avail < 0.05 ? 0 : 1)}%`,
      color: availTone,
      spark: <Sparkline values={history.map((h) => h.availability)} min={0} max={1} color={availTone} length={HISTORY} threshold={0.99} />,
    },
    {
      key: "p99",
      label: "p99 latency",
      hint: m ? `p50 ${fmtMs(m.p50)} · p95 ${fmtMs(m.p95)}` : "",
      value: m ? fmtMs(m.p99) : "—",
      color: p99Tone,
      spark: (
        <Sparkline values={history.map((h) => Math.log10(Math.max(1, h.p99)))} min={0} max={4} color={p99Tone} length={HISTORY} threshold={3} />
      ),
    },
    {
      key: "goodput",
      label: "good req/s",
      hint: m ? `of ${Math.round(m.incoming)} arriving` : "",
      value: m ? `${Math.round(m.goodput)}` : "—",
      color: "var(--ink)",
      spark: (
        <Sparkline
          values={history.map((h) => h.goodput)}
          min={0}
          max={Math.max(400, ...history.map((h) => h.incoming))}
          length={HISTORY}
        />
      ),
    },
    {
      key: "amplification",
      label: "load amplification",
      hint: "(arrivals + retries) ÷ arrivals",
      value: m ? `${m.amplification.toFixed(2)}×` : "—",
      color: ampTone,
      spark: <Sparkline values={history.map((h) => h.amplification)} min={1} max={3} color={ampTone} length={HISTORY} />,
    },
  ];

  const outcomes = m
    ? [
        { key: "ok", label: "ok", v: m.ok, color: "var(--ok)" },
        { key: "fallback", label: "fallback", v: m.fallback, color: "var(--accent)" },
        { key: "shed", label: "shed 429", v: m.shed, color: "var(--warn)" },
        { key: "error", label: "failed / too slow", v: m.errors, color: "var(--bad)" },
      ]
    : [];

  const maxBucket = m ? Math.max(1, ...m.histogram.map((b) => b.good + b.fallback + b.bad)) : 1;

  return (
    <Panel title="live metrics" right={<span className="font-mono text-[10px] text-dim">last 18s</span>}>
      <dl className="grid grid-cols-2 gap-px bg-line">
        {tiles.map((t) => (
          <div
            key={t.key}
            className={`bg-panel p-3 ${focus.includes(t.key as never) ? "ring-2 ring-inset ring-accent" : ""}`}
          >
            <dt className="text-[11px] text-dim">{t.label}</dt>
            <dd>
              <span className="block font-mono text-xl font-semibold tabular-nums" style={{ color: t.color }}>
                {t.value}
              </span>
              <span className="block truncate font-mono text-[10px] text-dim">{t.hint}</span>
              <div className="mt-1">{t.spark}</div>
            </dd>
          </div>
        ))}
      </dl>

      <div className={`border-t border-line p-3 ${focus.includes("outcomes") ? "ring-2 ring-inset ring-accent" : ""}`}>
        <p className="mb-2 text-[11px] text-dim">request outcomes</p>
        <div className="flex h-2.5 overflow-hidden rounded-full bg-line" aria-hidden>
          {outcomes.map((o) => (
            <div key={o.key} style={{ width: `${o.v * 100}%`, background: o.color }} className="transition-[width] duration-200" />
          ))}
        </div>
        <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[10.5px]">
          {outcomes.map((o) => (
            <li key={o.key} className="flex items-center gap-1.5 text-dim">
              <span aria-hidden className="h-2 w-2 rounded-sm" style={{ background: o.color }} />
              {o.label}
              <span className="ml-auto tabular-nums text-ink">{Math.round(o.v * 100)}%</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={`border-t border-line p-3 ${focus.includes("histogram") ? "ring-2 ring-inset ring-accent" : ""}`}>
        <p className="mb-2 text-[11px] text-dim">latency distribution (this tick, 400 requests)</p>
        <div className="flex h-16 items-end gap-[3px]" aria-hidden>
          {(m?.histogram ?? LATENCY_BUCKETS.map(() => ({ good: 0, fallback: 0, bad: 0 }))).map((b, i) => {
            const total = b.good + b.fallback + b.bad;
            return (
              <div key={i} className="flex h-full flex-1 flex-col justify-end">
                <div className="flex flex-col overflow-hidden rounded-t-sm" style={{ height: `${(total / maxBucket) * 100}%` }}>
                  <div style={{ flex: b.bad, background: "var(--bad)" }} />
                  <div style={{ flex: b.fallback, background: "var(--accent)" }} />
                  <div style={{ flex: b.good, background: "var(--ok)" }} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-1 flex gap-[3px] font-mono text-[8.5px] text-dim">
          {BUCKET_LABELS.map((l, i) => (
            <span key={i} className="flex-1 text-center">
              {l}
            </span>
          ))}
        </div>
      </div>
    </Panel>
  );
}
