/**
 * A tiny discrete-time simulation of a typical backend:
 *
 *   clients → load balancer → api-1..3 (Go) → redis (cache)
 *                                          ↘ postgres
 *
 * Each tick we sample a few hundred virtual requests through the system and
 * derive availability and latency percentiles. The model is deliberately
 * simple but behaves like the real thing: queues build under overload,
 * slow dependencies eat worker capacity, retries amplify load, breakers
 * shed it, and timeouts bound the damage.
 */

export const API_NODES = ["api-1", "api-2", "api-3"] as const;
export type ApiNode = (typeof API_NODES)[number];

export interface Faults {
  killed: Record<ApiNode, boolean>;
  cacheDown: boolean;
  dbDown: boolean;
  dbSlow: boolean;
  spike: boolean;
}

export interface Defences {
  healthChecks: boolean;
  timeouts: boolean;
  retries: boolean;
  breaker: boolean;
  shedding: boolean;
}

export type BreakerState = "closed" | "open" | "half-open";

export interface NodeState {
  backlog: number; // queued requests
  deadSince: number | null;
  inPool: boolean;
}

export interface Metrics {
  t: number;
  incoming: number; // rps
  availability: number; // 0..1  (ok + degraded) / all
  ok: number; // fractions
  degraded: number;
  errors: number;
  shed: number;
  p50: number; // ms
  p99: number; // ms
  goodput: number; // rps
  nodes: Record<ApiNode, { util: number; inPool: boolean; dead: boolean; queueMs: number }>;
  dbUtil: number;
  dbLatency: number;
  breaker: BreakerState;
}

export interface SimEvent {
  t: number;
  level: "info" | "warn" | "bad" | "good";
  msg: string;
}

export interface SimState {
  t: number;
  nodes: Record<ApiNode, NodeState>;
  dbBacklog: number;
  dbRho: number;
  /** Smoothed signals — real systems react to moving averages, not single samples. */
  dbLatEma: number;
  capEma: number;
  breaker: BreakerState;
  breakerSince: number;
  retryLoad: number;
  flags: { saturated: boolean; shedding: boolean; sloBreach: boolean; dbHot: boolean };
}

/* ---------- tunables ---------- */
const BASE_RPS = 300;
const SPIKE_FACTOR = 3;
const API_WORKERS = 6;
const API_BASE_MS = 20;
const CACHE_HIT = 0.85;
const CACHE_MS = 1;
const DB_BASE_MS = 8;
const DB_SLOW_MS = 400;
const DB_CAP = 260; // qps
const DB_TIMEOUT_MS = 250;
const DEADLINE_MS = 1000;
const GIVE_UP_MS = 10_000;
const HEALTHCHECK_S = 1.5;
const BREAKER_OPEN_S = 4;
const RETRY_BACKOFF_MS = 40;
const SAMPLES = 400;

export const DEFAULT_FAULTS: Faults = {
  killed: { "api-1": false, "api-2": false, "api-3": false },
  cacheDown: false,
  dbDown: false,
  dbSlow: false,
  spike: false,
};

export const ALL_DEFENCES: Defences = {
  healthChecks: true,
  timeouts: true,
  retries: true,
  breaker: true,
  shedding: true,
};

export function initialState(): SimState {
  const nodes = {} as Record<ApiNode, NodeState>;
  API_NODES.forEach((id) => (nodes[id] = { backlog: 0, deadSince: null, inPool: true }));
  return {
    t: 0,
    nodes,
    dbBacklog: 0,
    dbRho: 0.15,
    dbLatEma: 10,
    capEma: 264,
    breaker: "closed",
    breakerSince: 0,
    retryLoad: 0,
    flags: { saturated: false, shedding: false, sloBreach: false, dbHot: false },
  };
}

/** Log-normal-ish jitter around 1.0 */
function jitter(sigma = 0.35) {
  // Box–Muller
  const u = 1 - Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return Math.exp(sigma * z - (sigma * sigma) / 2);
}

function percentile(sorted: number[], p: number) {
  if (sorted.length === 0) return 0;
  const i = Math.min(sorted.length - 1, Math.floor(p * sorted.length));
  return sorted[i];
}

export function step(
  prev: SimState,
  faults: Faults,
  def: Defences,
  dt: number,
): { state: SimState; metrics: Metrics; events: SimEvent[] } {
  const t = prev.t + dt;
  const events: SimEvent[] = [];
  const emit = (level: SimEvent["level"], msg: string) => events.push({ t, level, msg });

  /* 1. Traffic */
  const incoming =
    BASE_RPS * (faults.spike ? SPIKE_FACTOR : 1) * (1 + 0.05 * Math.sin(t * 1.3) + 0.04 * (Math.random() - 0.5));

  /* 2. Node pool (health checks remove dead nodes after a delay) */
  const nodes = {} as Record<ApiNode, NodeState>;
  for (const id of API_NODES) {
    const p = prev.nodes[id];
    const dead = faults.killed[id];
    const deadSince = dead ? (p.deadSince ?? t) : null;
    const inPool = !dead || !(def.healthChecks && t - (deadSince ?? t) >= HEALTHCHECK_S);
    if (p.inPool && !inPool) emit("info", `lb: ${id} failed health checks — removed from pool`);
    if (!p.inPool && inPool && !dead) emit("good", `lb: ${id} healthy — back in pool`);
    nodes[id] = { backlog: dead ? 0 : p.backlog, deadSince, inPool };
  }
  const alive = API_NODES.filter((id) => !faults.killed[id]);
  const pool = API_NODES.filter((id) => nodes[id].inPool);
  const deadInPool = pool.filter((id) => faults.killed[id]);

  /* 3. Dependencies (state carried from previous tick) */
  const hitRate = faults.cacheDown ? 0 : CACHE_HIT;
  const dbLatRaw =
    (DB_BASE_MS + (faults.dbSlow ? DB_SLOW_MS : 0)) / (1 - Math.min(prev.dbRho, 0.9)) +
    (prev.dbBacklog / DB_CAP) * 1000;
  const dbLatency = prev.dbLatEma * 0.6 + dbLatRaw * 0.4;

  let breaker = def.breaker ? prev.breaker : "closed";
  let breakerSince = prev.breakerSince;
  const dbPassFrac = breaker === "open" ? 0 : breaker === "half-open" ? 0.1 : 1;

  // Expected downstream time per request — slow dependencies hold API workers.
  const dbCallMs = faults.dbDown ? 3 : def.timeouts ? Math.min(dbLatency, DB_TIMEOUT_MS) : dbLatency;
  const missMs = dbPassFrac * dbCallMs + (1 - dbPassFrac) * 2;
  const downstreamMs = hitRate * CACHE_MS + (1 - hitRate) * missMs;
  const nodeCapRaw = API_WORKERS / ((API_BASE_MS + downstreamMs) / 1000);
  const nodeCap = prev.capEma * 0.6 + nodeCapRaw * 0.4;

  /* 4. Routing, retries, shedding */
  const shareDead = pool.length === 0 ? 1 : deadInPool.length / pool.length;
  const toDead = incoming * shareDead;
  const canRetry = def.retries && alive.length > 0;
  const retriedDead = canRetry ? toDead : 0;
  const offered = alive.length === 0 ? 0 : incoming - toDead + retriedDead + prev.retryLoad;
  const totalCap = alive.length * nodeCap;

  let shed = 0;
  if (def.shedding && offered > totalCap * 0.9) shed = offered - totalCap * 0.9;
  const admitted = offered - shed;

  if (shed > 1 && !prev.flags.shedding) emit("warn", "lb: over capacity — shedding excess load (429)");
  if (shed <= 1 && prev.flags.shedding) emit("good", "lb: load back under capacity — shedding stopped");

  /* 5. Queues on API nodes */
  const perNode = alive.length ? admitted / alive.length : 0;
  let queueMs = 0;
  const nodeMetrics = {} as Metrics["nodes"];
  for (const id of API_NODES) {
    const n = nodes[id];
    if (faults.killed[id]) {
      nodeMetrics[id] = { util: 0, inPool: n.inPool, dead: true, queueMs: 0 };
      continue;
    }
    n.backlog = Math.max(0, n.backlog + (perNode - nodeCap) * dt);
    // Timeouts cancel requests that have waited past the deadline, bounding the queue.
    if (def.timeouts) n.backlog = Math.min(n.backlog, nodeCap * (DEADLINE_MS / 1000));
    const rho = Math.min(perNode / nodeCap, 0.95);
    const q = (n.backlog / nodeCap) * 1000 + API_BASE_MS * (rho / (1 - rho)) * 0.5;
    queueMs = Math.max(queueMs, q);
    nodeMetrics[id] = { util: perNode / nodeCap, inPool: n.inPool, dead: false, queueMs: q };
  }

  const saturated = queueMs > 250;
  if (saturated && !prev.flags.saturated) emit("bad", "api: workers saturated — request queues growing");
  if (!saturated && prev.flags.saturated) emit("good", "api: queues drained");

  /* 6. Database load */
  const dbLoad = faults.dbDown ? 0 : admitted * (1 - hitRate) * dbPassFrac;
  let dbBacklog = Math.max(0, prev.dbBacklog + (dbLoad - DB_CAP) * dt);
  if (def.timeouts) dbBacklog = Math.min(dbBacklog, DB_CAP * (DB_TIMEOUT_MS / 1000));
  const dbRho = prev.dbRho * 0.5 + (dbLoad / DB_CAP) * 0.5;
  const dbHot = !faults.dbDown && (dbRho > 0.9 || dbLatency > 150);
  if (dbHot && !prev.flags.dbHot) emit("warn", `postgres: latency climbing (${Math.round(dbLatency)}ms)`);
  if (!dbHot && prev.flags.dbHot && !faults.dbDown) emit("good", "postgres: latency back to normal");

  /* 7. Sample virtual requests */
  const all = incoming + prev.retryLoad;
  const shedFrac = all > 0 ? shed / all : 0;
  const deadFailFrac = all > 0 && !canRetry ? toDead / all : alive.length === 0 ? 1 : 0;
  const retriedFrac = admitted > 0 ? retriedDead / admitted : 0;

  const lat: number[] = [];
  let ok = 0,
    degraded = 0,
    errors = 0,
    shedN = 0,
    dbCalls = 0,
    dbFails = 0,
    timeouts504 = 0;

  for (let i = 0; i < SAMPLES; i++) {
    const r = Math.random();
    if (r < shedFrac) {
      shedN++;
      lat.push(2 * jitter());
      continue;
    }
    if (r < shedFrac + deadFailFrac) {
      errors++;
      lat.push(alive.length === 0 ? 5 : 1 * jitter());
      continue;
    }
    let ms = API_BASE_MS * jitter(0.25) + queueMs * jitter(0.2);
    if (Math.random() < retriedFrac) ms += RETRY_BACKOFF_MS * jitter();

    let outcome: "ok" | "degraded" | "error" = "ok";
    if (Math.random() < hitRate) {
      ms += CACHE_MS * jitter();
    } else if (Math.random() >= dbPassFrac) {
      outcome = "degraded"; // breaker open: serve a cached/stale fallback
      ms += 2 * jitter();
    } else {
      dbCalls++;
      if (faults.dbDown) {
        outcome = "error";
        dbFails++;
        ms += 3 * jitter();
      } else {
        const d = dbLatency * jitter(0.45);
        if (def.timeouts && d > DB_TIMEOUT_MS) {
          outcome = "error";
          dbFails++;
          timeouts504++;
          ms += DB_TIMEOUT_MS;
        } else {
          ms += d;
        }
      }
    }

    if (def.timeouts && ms > DEADLINE_MS) {
      outcome = "error";
      timeouts504++;
      ms = DEADLINE_MS;
    } else if (!def.timeouts && ms > GIVE_UP_MS) {
      outcome = "error";
      ms = GIVE_UP_MS;
    }

    lat.push(ms);
    // SLI: a request only counts as good if it succeeded *and* was fast enough to be useful.
    if (outcome !== "error" && ms > DEADLINE_MS) outcome = "error";
    if (outcome === "ok") ok++;
    else if (outcome === "degraded") degraded++;
    else errors++;
  }

  /* 8. Circuit breaker */
  const dbFailRate = dbCalls > 0 ? dbFails / dbCalls : 0;
  if (def.breaker) {
    if (breaker === "closed" && dbCalls >= 5 && dbFailRate > 0.5) {
      breaker = "open";
      breakerSince = t;
      emit("warn", `breaker: postgres failing (${Math.round(dbFailRate * 100)}%) — circuit OPEN, serving fallbacks`);
    } else if (breaker === "open" && t - breakerSince >= BREAKER_OPEN_S) {
      breaker = "half-open";
      breakerSince = t;
      emit("info", "breaker: half-open — sending probe traffic to postgres");
    } else if (breaker === "half-open" && dbCalls >= 2) {
      if (dbFailRate < 0.2) {
        breaker = "closed";
        emit("good", "breaker: probes succeeded — circuit CLOSED");
      } else {
        breaker = "open";
        breakerSince = t;
        emit("warn", "breaker: probes failed — circuit re-OPENED");
      }
    }
  }

  /* 9. Retry storm: failed/timeouts get retried once next tick */
  const retryLoad = def.retries ? (timeouts504 / SAMPLES) * all * 0.9 : 0;

  lat.sort((a, b) => a - b);
  const total = SAMPLES;
  const availability = (ok + degraded) / total;
  const sloBreach = availability < 0.99;
  if (sloBreach && !prev.flags.sloBreach)
    emit("bad", `slo: availability dropped to ${(availability * 100).toFixed(1)}% (target 99%)`);
  if (!sloBreach && prev.flags.sloBreach) emit("good", "slo: availability restored above 99%");

  const metrics: Metrics = {
    t,
    incoming,
    availability,
    ok: ok / total,
    degraded: degraded / total,
    errors: errors / total,
    shed: shedN / total,
    p50: percentile(lat, 0.5),
    p99: percentile(lat, 0.99),
    goodput: availability * incoming,
    nodes: nodeMetrics,
    dbUtil: faults.dbDown ? 0 : dbRho,
    dbLatency: faults.dbDown ? 0 : dbLatency,
    breaker,
  };

  return {
    state: {
      t,
      nodes,
      dbBacklog,
      dbRho,
      dbLatEma: dbLatency,
      capEma: nodeCap,
      breaker,
      breakerSince,
      retryLoad,
      flags: { saturated, shedding: shed > 1, sloBreach, dbHot },
    },
    metrics,
    events,
  };
}
