"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ALL_DEFENCES,
  DEFAULT_FAULTS,
  initialState,
  step,
  type ApiNode,
  type ComponentId,
  type Defences,
  type Faults,
  type Metrics,
  type SimEvent,
} from "@/lib/chaos";
import type { Change, Focus } from "@/lib/scenarios";

const TICK_MS = 200;
export const HISTORY = 90; // 18s

interface SimContextValue {
  metrics: Metrics | null;
  history: Metrics[];
  events: SimEvent[];
  faults: Faults;
  defences: Defences;
  apply: (change: Change, message?: string) => void;
  toggleNode: (id: ApiNode) => void;
  log: (level: SimEvent["level"], msg: string) => void;
  selected: ComponentId | null;
  select: (id: ComponentId | null) => void;
  focus: Focus[];
  setFocus: (f: Focus[]) => void;
  paused: boolean;
  setPaused: (p: boolean) => void;
}

const SimContext = createContext<SimContextValue | null>(null);

export function useSim() {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error("useSim must be used inside <SimProvider>");
  return ctx;
}

export function SimProvider({ children }: { children: ReactNode }) {
  const [faults, setFaults] = useState<Faults>(DEFAULT_FAULTS);
  const [defences, setDefences] = useState<Defences>(ALL_DEFENCES);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [history, setHistory] = useState<Metrics[]>([]);
  const [events, setEvents] = useState<SimEvent[]>([]);
  const [selected, select] = useState<ComponentId | null>(null);
  const [focus, setFocus] = useState<Focus[]>([]);
  const [paused, setPaused] = useState(false);

  const sim = useRef(initialState());
  const faultsRef = useRef(faults);
  const defRef = useRef(defences);
  const pausedRef = useRef(paused);

  useEffect(() => {
    faultsRef.current = faults;
    defRef.current = defences;
    pausedRef.current = paused;
  }, [faults, defences, paused]);

  const log = useCallback((level: SimEvent["level"], msg: string) => {
    setEvents((e) => [{ t: sim.current.t, level, msg }, ...e].slice(0, 60));
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.hidden || pausedRef.current) return;
      const r = step(sim.current, faultsRef.current, defRef.current, TICK_MS / 1000);
      sim.current = r.state;
      setMetrics(r.metrics);
      setHistory((h) => [...h, r.metrics].slice(-HISTORY));
      if (r.events.length) setEvents((e) => [...[...r.events].reverse(), ...e].slice(0, 60));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  const apply = useCallback(
    (change: Change, message?: string) => {
      if (change.reset) {
        // Fresh queues and breaker, but keep the clock running.
        const t = sim.current.t;
        sim.current = { ...initialState(), t };
      }
      const baseF = change.reset ? DEFAULT_FAULTS : faultsRef.current;
      const baseD = change.reset ? ALL_DEFENCES : defRef.current;
      const nextF: Faults = {
        ...baseF,
        ...change.faults,
        killed: { ...baseF.killed, ...(change.faults?.killed ?? {}) },
      };
      const nextD: Defences = { ...baseD, ...change.defences };
      // Update refs immediately so the very next tick sees the change.
      faultsRef.current = nextF;
      defRef.current = nextD;
      setFaults(nextF);
      setDefences(nextD);
      if (message) log("info", message);
    },
    [log],
  );

  const toggleNode = useCallback(
    (id: ApiNode) => {
      const dead = !faultsRef.current.killed[id];
      apply({ faults: { killed: { [id]: dead } } });
      log(dead ? "bad" : "good", dead ? `you: killed ${id}` : `you: restarted ${id}`);
    },
    [apply, log],
  );

  const value = useMemo(
    () => ({
      metrics,
      history,
      events,
      faults,
      defences,
      apply,
      toggleNode,
      log,
      selected,
      select,
      focus,
      setFocus,
      paused,
      setPaused,
    }),
    [metrics, history, events, faults, defences, apply, toggleNode, log, selected, focus, paused],
  );

  return <SimContext.Provider value={value}>{children}</SimContext.Provider>;
}
