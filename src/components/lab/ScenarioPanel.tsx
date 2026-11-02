"use client";

import { useState } from "react";
import { scenarios, type Scenario } from "@/lib/scenarios";
import { useSim } from "./SimProvider";

export function ScenarioPanel({ initialScenarioId }: { initialScenarioId?: string }) {
  const { apply, setFocus, log } = useSim();
  const [active, setActive] = useState<Scenario | null>(
    () => scenarios.find((s) => s.id === initialScenarioId) ?? null,
  );
  const [stepIdx, setStepIdx] = useState(0);

  const goTo = (sc: Scenario, i: number) => {
    const st = sc.steps[i];
    if (st.apply) apply(st.apply);
    setFocus(st.focus ?? []);
    setStepIdx(i);
  };

  const start = (sc: Scenario) => {
    setActive(sc);
    // Bring the walkthrough and the system into view together.
    requestAnimationFrame(() =>
      document.getElementById("incident")?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
    log("info", `incident: “${sc.title}” started`);
    goTo(sc, 0);
  };

  const exit = () => {
    setActive(null);
    setFocus([]);
  };

  // Going back replays every step up to the target so the system state matches the story.
  const back = () => {
    if (!active || stepIdx === 0) return;
    const target = stepIdx - 1;
    for (let i = 0; i <= target; i++) {
      const st = active.steps[i];
      if (st.apply) apply(st.apply);
    }
    setFocus(active.steps[target].focus ?? []);
    setStepIdx(target);
  };

  if (!active) {
    return (
      <div className="surface rounded-xl border border-line p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-base font-semibold text-ink">Walk through an incident</h3>
          <p className="text-[12px] text-dim">or inject faults yourself below ↓</p>
        </div>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {scenarios.map((sc, i) => (
            <li key={sc.id}>
              <button
                type="button"
                onClick={() => start(sc)}
                className="surface lift group flex h-full w-full flex-col rounded-lg border border-line p-3 text-left hover:!border-accent"
              >
                <span className="font-mono text-[10px] text-dim">incident 0{i + 1}</span>
                <span className="mt-1 text-[14px] font-semibold leading-snug text-ink">{sc.title}</span>
                <span className="mt-1 text-[12px] leading-snug text-dim">{sc.tagline}</span>
                <span className="mt-auto pt-2 font-mono text-[11px] text-accent opacity-70 group-hover:opacity-100">
                  start →
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const st = active.steps[stepIdx];
  const last = stepIdx === active.steps.length - 1;

  return (
    <div id="incident" className="surface scroll-mt-20 rounded-xl border border-accent" aria-live="polite">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2.5">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
          incident · {active.title}
        </p>
        <div className="flex items-center gap-3">
          <ol className="flex gap-1" aria-label={`Step ${stepIdx + 1} of ${active.steps.length}`}>
            {active.steps.map((_, i) => (
              <li
                key={i}
                className={`h-1.5 w-5 rounded-full ${i <= stepIdx ? "bg-accent" : "bg-line"}`}
              />
            ))}
          </ol>
          <button type="button" onClick={exit} className="font-mono text-[10.5px] text-dim hover:text-ink">
            exit ✕
          </button>
        </div>
      </header>

      <div className="grid gap-5 p-4 sm:p-5 md:grid-cols-[minmax(0,1fr)_240px]">
        <div>
          <h3 className="text-lg font-semibold leading-snug text-ink">
            <span className="mr-2 font-mono text-sm text-dim">
              {stepIdx + 1}/{active.steps.length}
            </span>
            {st.title}
          </h3>
          <div className="mt-2 space-y-2 text-[14.5px] leading-relaxed text-ink-soft">
            {st.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {st.watch && (
            <p className="mt-3 inline-flex items-start gap-2 rounded-lg bg-accent-soft px-3 py-1.5 text-[12.5px] text-ink">
              <span aria-hidden className="text-accent">◉</span>
              <span>
                <span className="font-semibold">Watch:</span> {st.watch}
              </span>
            </p>
          )}
        </div>

        <div className="flex flex-col justify-between gap-4">
          {last ? (
            <div className="space-y-3">
              <p className="text-[13px] leading-relaxed text-ink">
                <span className="font-semibold">Takeaway: </span>
                {active.takeaway}
              </p>
              <p className="border-l-2 border-accent pl-3 text-[12.5px] leading-relaxed text-dim">
                <span className="font-semibold text-ink">For real — {active.realWorld.where}: </span>
                {active.realWorld.text}
              </p>
            </div>
          ) : (
            <p className="text-[12px] leading-relaxed text-dim">
              Each step changes the live system. Take your time — the simulation keeps running.
            </p>
          )}
          <div className="flex gap-2">
            <button type="button" onClick={back} disabled={stepIdx === 0} className="btn disabled:opacity-40">
              ← back
            </button>
            {last ? (
              <button type="button" onClick={exit} className="btn btn-primary flex-1">
                done — explore freely
              </button>
            ) : (
              <button type="button" onClick={() => goTo(active, stepIdx + 1)} className="btn btn-primary flex-1">
                next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
