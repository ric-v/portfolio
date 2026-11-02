/**
 * A small discrete-time simulation of a real-time request-processing backend:
 *
 *   clients → load balancer → api-1..3 (Go) → redis (cache)
 *                                          ↘ postgres
 *
 * Every tick (200ms) we
 *   1. compute how much traffic arrives and where the LB sends it,
 *   2. size each API node's worker pool from Little's law (capacity = workers / service time),
 *   3. grow or drain queues on API nodes and Postgres,
 *   4. push a few hundred virtual requests through the system to get real latency
 *      distributions and outcomes,
 *   5. run the circuit-breaker state machine and schedule retries for the next tick.
 *
 * It's a toy model, but the dynamics are the real ones: queueing delay explodes near
 * 100% utilisation, slow dependencies eat worker capacity, retries amplify load,
 * breakers shed it, and timeouts bound how bad things can get.
 */

export const API_NODES = ["api-1", "api-2", "api-3"] as const;
export type ApiNode = (typeof API_NODES)[number];
export type ComponentId = "clients" | "lb" | ApiNode | "redis" | "postgres";

export interface Faults {
  killed: Record<ApiNode, boolean>;
  cacheDown: boolean;
  dbDown: boolean;
  dbSlow: boolean;
  /** Traffic multiplier: 1 = normal, 2 = busy, 3 = spike */
  load: 1 | 2 | 3;
}

export interface Defences {
  healthChecks: boolean;
  timeouts: boolean;
  retries: boolean;
  breaker: boolean;
  shedding: boolean;
}

export type BreakerState = "closed" | "open" | "half-open";
export type Outcome = "ok" | "fallback" | "shed" | "error";

export interface NodeState {
  backlog: number;
  deadSince: number | null;
  inPool: boolean;
}

export interface NodeMetrics {
  dead: boolean;
  inPool: boolean;
  util: number; // offered / capacity
  capacity: number; // rps this node can serve right now
  rps: number;
  busyWorkers: number; // 0..WORKERS
  queueLen: number; // waiting requests
  queueMs: number;
}

export interface RequestSpan {
  name: string;
  start: number;
  dur: number;
  status: "ok" | "error" | "fallback";
  note?: string;
}

export interface SampleRequest {
  id: string;
  outcome: Outcome;
  total: number;
  reason: string;
  spans: RequestSpan[];
}

export const LATENCY_BUCKETS = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, Infinity];

export interface Metrics {
  t: number;
  incoming: number;
  offered: number; // incoming + retries
  amplification: number; // offered / incoming
  availability: number; // good (ok+fallback, under deadline) / all
  ok: number;
  fallback: number;
  errors: number;
  shed: number;
  p50: number;
  p95: number;
  p99: number;
  goodput: number;
  histogram: { good: number; fallback: number; bad: number }[]; // per LATENCY_BUCKETS
  nodes: Record<ApiNode, NodeMetrics>;
  downstreamMs: number; // avg time a request spends in dependencies
  cacheHitRate: number;
  dbQps: number;
  dbUtil: number;
  dbLatency: number;
  dbFailRate: number;
  breaker: BreakerState;
  breakerFor: number; // seconds in current state
  samples: SampleRequest[];
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
  reqSeq: number;
  flags: { saturated: boolean; shedding: boolean; sloBreach: boolean; dbHot: boolean; storm: boolean };
}

/* ---------- model parameters (shown in the UI, so keep them honest) ---------- */
export const PARAMS = {
  baseRps: 300,
  apiWorkers: 6,
  apiBaseMs: 20,
  cacheHit: 0.85,
  cacheMs: 1,
  dbBaseMs: 8,
  dbSlowMs: 400,
  dbCapacity: 260,
  dbTimeoutMs: 250,
  deadlineMs: 1000,
  giveUpMs: 10_000,
  healthCheckS: 1.5,
  breakerOpenS: 4,
  breakerTripRate: 0.5,
  retryBackoffMs: 40,
  shedAt: 0.9,
};

const P = PARAMS;
const SAMPLES = 400;
const KEEP_SAMPLES = 16;

export const DEFAULT_FAULTS: Faults = {
  killed: { "api-1": false, "api-2": false, "api-3": false },
  cacheDown: false,
  dbDown: false,
  dbSlow: false,
  load: 1,
};

export const ALL_DEFENCES: Defences = {
  healthChecks: true,
  timeouts: true,
  retries: true,
  breaker: true,
  shedding: true,
};

export const NO_DEFENCES: Defences = {
  healthChecks: false,
  timeouts: false,
  retries: false,
  breaker: false,
  shedding: false,
};

/** Capacity of one API node at a given downstream time (Little's law). */
export function nodeCapacity(downstreamMs: number) {
  return P.apiWorkers / ((P.apiBaseMs + downstreamMs) / 1000);
}

export function initialState(): SimState {
  const nodes = {} as Record<ApiNode, NodeState>;
  API_NODES.forEach((id) => (nodes[id] = { backlog: 0, deadSince: null, inPool: true }));
  return {
    t: 0,
    nodes,
    dbBacklog: 0,
    dbRho: 0.15,
    dbLatEma: 10,
    capEma: nodeCapacity(P.cacheHit * P.cacheMs + (1 - P.cacheHit) * 10),
    breaker: "closed",
    breakerSince: 0,
    retryLoad: 0,
    reqSeq: 1000,
    flags: { saturated: false, shedding: false, sloBreach: false, dbHot: false, storm: false },
  };
}

/** Log-normal jitter around 1.0 (Box–Muller). */
function jitter(sigma = 0.35) {
  const u = 1 - Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return Math.exp(sigma * z - (sigma * sigma) / 2);
}

function percentile(sorted: number[], p: number) {
  if (sorted.length === 0) return 0;
  return sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))];
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
    P.baseRps * faults.load * (1 + 0.05 * Math.sin(t * 1.3) + 0.04 * (Math.random() - 0.5));

  /* 2. Node pool — health checks evict dead nodes after a detection delay */
  const nodes = {} as Record<ApiNode, NodeState>;
  for (const id of API_NODES) {
    const p = prev.nodes[id];
    const dead = faults.killed[id];
    const deadSince = dead ? (p.deadSince ?? t) : null;
    const inPool = !dead || !(def.healthChecks && t - (deadSince ?? t) >= P.healthCheckS);
    if (p.inPool && !inPool) emit("info", `lb: ${id} failed 3 health checks — removed from pool`);
    if (!p.inPool && inPool && !dead) emit("good", `lb: ${id} passing health checks — back in pool`);
    nodes[id] = { backlog: dead ? 0 : p.backlog, deadSince, inPool };
  }
  const alive = API_NODES.filter((id) => !faults.killed[id]);
  const pool = API_NODES.filter((id) => nodes[id].inPool);
  const deadInPool = pool.filter((id) => faults.killed[id]);

  /* 3. Dependencies (latency carried over from the previous tick's queues) */
  const hitRate = faults.cacheDown ? 0 : P.cacheHit;
  const dbLatRaw =
    (P.dbBaseMs + (faults.dbSlow ? P.dbSlowMs : 0)) / (1 - Math.min(prev.dbRho, 0.9)) +
    (prev.dbBacklog / P.dbCapacity) * 1000;
  const dbLatency = prev.dbLatEma * 0.6 + dbLatRaw * 0.4;

  let breaker: BreakerState = def.breaker ? prev.breaker : "closed";
  let breakerSince = def.breaker ? prev.breakerSince : t;
  const dbPassFrac = breaker === "open" ? 0 : breaker === "half-open" ? 0.1 : 1;

  // Average time a request spends waiting on dependencies — this is what eats worker capacity.
  const dbCallMs = faults.dbDown ? 3 : def.timeouts ? Math.min(dbLatency, P.dbTimeoutMs) : dbLatency;
  const missMs = dbPassFrac * dbCallMs + (1 - dbPassFrac) * 2;
  const downstreamMs = hitRate * P.cacheMs + (1 - hitRate) * missMs;
  const nodeCap = prev.capEma * 0.6 + nodeCapacity(downstreamMs) * 0.4;

  /* 4. Routing, retries, shedding */
  const shareDead = pool.length === 0 ? 1 : deadInPool.length / pool.length;
  const toDead = incoming * shareDead;
  const canRetry = def.retries && alive.length > 0;
  const retriedDead = canRetry ? toDead : 0;
  const offered = alive.length === 0 ? 0 : incoming - toDead + retriedDead + prev.retryLoad;
  const totalCap = alive.length * nodeCap;

  let shed = 0;
  if (def.shedding && offered > totalCap * P.shedAt) shed = offered - totalCap * P.shedAt;
  const admitted = offered - shed;

  if (shed > 1 && !prev.flags.shedding) emit("warn", "lb: over capacity — rejecting excess with fast 429s");
  if (shed <= 1 && prev.flags.shedding) emit("good", "lb: back under capacity — shedding stopped");

  /* 5. Worker pools and queues on API nodes */
  const perNode = alive.length ? admitted / alive.length : 0;
  const serviceS = (P.apiBaseMs + downstreamMs) / 1000;
  let queueMs = 0;
  const nodeMetrics = {} as Record<ApiNode, NodeMetrics>;
  for (const id of API_NODES) {
    const n = nodes[id];
    if (faults.killed[id]) {
      nodeMetrics[id] = {
        dead: true,
        inPool: n.inPool,
        util: 0,
        capacity: 0,
        rps: n.inPool ? incoming / Math.max(1, pool.length) : 0,
        busyWorkers: 0,
        queueLen: 0,
        queueMs: 0,
      };
      continue;
    }
    n.backlog = Math.max(0, n.backlog + (perNode - nodeCap) * dt);
    // Timeouts cancel requests that have waited past the deadline, which bounds the queue.
    if (def.timeouts) n.backlog = Math.min(n.backlog, nodeCap * (P.deadlineMs / 1000));
    const rho = Math.min(perNode / nodeCap, 0.95);
    const q = (n.backlog / nodeCap) * 1000 + P.apiBaseMs * (rho / (1 - rho)) * 0.5;
    queueMs = Math.max(queueMs, q);
    nodeMetrics[id] = {
      dead: false,
      inPool: n.inPool,
      util: perNode / nodeCap,
      capacity: nodeCap,
      rps: perNode,
      busyWorkers: Math.min(P.apiWorkers, perNode * serviceS),
      queueLen: n.backlog,
      queueMs: q,
    };
  }

  const saturated = queueMs > 250;
  if (saturated && !prev.flags.saturated) emit("bad", "api: every worker busy — queues growing, latency climbing");
  if (!saturated && prev.flags.saturated) emit("good", "api: queues drained");

  /* 6. Postgres load */
  const dbLoad = faults.dbDown ? 0 : admitted * (1 - hitRate) * dbPassFrac;
  let dbBacklog = Math.max(0, prev.dbBacklog + (dbLoad - P.dbCapacity) * dt);
  if (def.timeouts) dbBacklog = Math.min(dbBacklog, P.dbCapacity * (P.dbTimeoutMs / 1000));
  const dbRho = prev.dbRho * 0.5 + (dbLoad / P.dbCapacity) * 0.5;
  const dbHot = !faults.dbDown && (dbRho > 0.9 || dbLatency > 150);
  if (dbHot && !prev.flags.dbHot) emit("warn", `postgres: query latency climbing (${Math.round(dbLatency)}ms)`);
  if (!dbHot && prev.flags.dbHot && !faults.dbDown) emit("good", "postgres: latency back to normal");

  /* 7. Push virtual requests through the system */
  const all = incoming + prev.retryLoad;
  const shedFrac = all > 0 ? shed / all : 0;
  const deadFailFrac = alive.length === 0 ? 1 : all > 0 && !canRetry ? toDead / all : 0;
  const retriedFrac = admitted > 0 ? retriedDead / admitted : 0;

  const lat: number[] = [];
  const histogram = LATENCY_BUCKETS.map(() => ({ good: 0, fallback: 0, bad: 0 }));
  const bucket = (ms: number) => LATENCY_BUCKETS.findIndex((b) => ms < b);
  const samples: SampleRequest[] = [];
  let reqSeq = prev.reqSeq;
  let ok = 0,
    fallback = 0,
    errors = 0,
    shedN = 0,
    dbCalls = 0,
    dbFails = 0,
    timeouts504 = 0;

  const pick = () => alive[Math.floor(Math.random() * alive.length)] ?? "api-1";

  for (let i = 0; i < SAMPLES; i++) {
    const keep = i < KEEP_SAMPLES;
    const spans: RequestSpan[] = [];
    const span = (name: string, dur: number, status: RequestSpan["status"] = "ok", note?: string) => {
      if (!keep) return;
      const start = spans.length ? spans[spans.length - 1].start + spans[spans.length - 1].dur : 0;
      spans.push({ name, start, dur, status, note });
    };
    const record = (outcome: Outcome, total: number, reason: string) => {
      lat.push(total);
      const b = histogram[bucket(total)];
      if (outcome === "ok") b.good++;
      else if (outcome === "fallback") b.fallback++;
      else b.bad++;
      if (keep) samples.push({ id: `req-${(reqSeq++).toString(16)}`, outcome, total, reason, spans });
    };

    const r = Math.random();
    if (r < shedFrac) {
      shedN++;
      const ms = 2 * jitter();
      span("lb", ms, "error", "rejected: over capacity (429)");
      record("shed", ms, "Load shedding: rejected fast so admitted requests stay fast");
      continue;
    }
    if (r < shedFrac + deadFailFrac) {
      errors++;
      const ms = alive.length === 0 ? 5 : jitter();
      const target = deadInPool[Math.floor(Math.random() * deadInPool.length)] ?? "api-?";
      span("lb", 0.3);
      span(target, ms, "error", "connection refused");
      record("error", ms, `Routed to ${target}, which is dead. No retry configured.`);
      continue;
    }

    const node = pick();
    let ms = 0;
    span("lb", 0.3);
    ms += 0.3;
    if (Math.random() < retriedFrac) {
      const deadOne = deadInPool[0] ?? "api-?";
      span(deadOne, 1, "error", "connection refused");
      const b = P.retryBackoffMs * jitter();
      span("retry backoff", b, "ok", "retried on a healthy node");
      ms += 1 + b;
    }
    const wait = queueMs * jitter(0.2);
    if (wait > 1) span(`${node} queue`, wait, "ok", "waiting for a free worker");
    const work = P.apiBaseMs * jitter(0.25);
    span(`${node} handler`, work);
    ms += wait + work;

    let outcome: Outcome = "ok";
    let reason = "Cache hit — served from Redis.";
    if (Math.random() < hitRate) {
      const c = P.cacheMs * jitter();
      span("redis GET", c, "ok", "hit");
      ms += c;
    } else {
      if (!faults.cacheDown) span("redis GET", P.cacheMs * jitter(), "ok", "miss");
      if (Math.random() >= dbPassFrac) {
        const f = 2 * jitter();
        if (faults.cacheDown) {
          // Fallbacks are served from (stale) cache entries — with Redis down there's nothing to serve.
          outcome = "error";
          reason = "Breaker open and Redis down — no stale copy to fall back to. Failed fast.";
          span("fallback", f, "error", "no cached copy");
        } else {
          outcome = "fallback";
          reason = "Circuit breaker open — served a stale cached copy instead of calling Postgres.";
          span("fallback", f, "fallback", "breaker open");
        }
        ms += f;
      } else {
        dbCalls++;
        if (faults.dbDown) {
          outcome = "error";
          reason = "Postgres is down; the query failed.";
          dbFails++;
          span("postgres query", 3 * jitter(), "error", "connection refused");
          ms += 3;
        } else {
          const d = dbLatency * jitter(0.45);
          if (def.timeouts && d > P.dbTimeoutMs) {
            outcome = "error";
            reason = `Postgres took longer than the ${P.dbTimeoutMs}ms timeout; gave up.`;
            dbFails++;
            timeouts504++;
            span("postgres query", P.dbTimeoutMs, "error", "timeout");
            ms += P.dbTimeoutMs;
          } else {
            reason = "Cache miss — read from Postgres, then cached.";
            span("postgres query", d, "ok");
            ms += d;
          }
        }
      }
    }

    if (def.timeouts && ms > P.deadlineMs) {
      outcome = "error";
      timeouts504++;
      reason = `Exceeded the ${P.deadlineMs}ms request deadline — cancelled (504).`;
      ms = P.deadlineMs;
    } else if (!def.timeouts && ms > P.giveUpMs) {
      outcome = "error";
      reason = "No timeout anywhere — the client gave up after 10s.";
      ms = P.giveUpMs;
    } else if (outcome !== "error" && ms > P.deadlineMs) {
      // SLI: a request only counts as good if it succeeded *and* was fast enough to be useful.
      outcome = "error";
      reason = `Succeeded, but took ${(ms / 1000).toFixed(1)}s — too slow to count as good.`;
    }

    if (outcome === "ok") ok++;
    else if (outcome === "fallback") fallback++;
    else errors++;
    record(outcome, ms, reason);
  }

  /* 8. Circuit breaker state machine */
  const dbFailRate = dbCalls > 0 ? dbFails / dbCalls : 0;
  if (def.breaker) {
    if (breaker === "closed" && dbCalls >= 5 && dbFailRate > P.breakerTripRate) {
      breaker = "open";
      breakerSince = t;
      emit("warn", `breaker: ${Math.round(dbFailRate * 100)}% of postgres calls failing — circuit OPEN`);
    } else if (breaker === "open" && t - breakerSince >= P.breakerOpenS) {
      breaker = "half-open";
      breakerSince = t;
      emit("info", "breaker: half-open — letting 10% of traffic probe postgres");
    } else if (breaker === "half-open" && dbCalls >= 2) {
      if (dbFailRate < 0.2) {
        breaker = "closed";
        breakerSince = t;
        emit("good", "breaker: probes succeeded — circuit CLOSED");
      } else {
        breaker = "open";
        breakerSince = t;
        emit("warn", "breaker: probes failed — circuit re-OPENED");
      }
    }
  }

  /* 9. Retries: timed-out requests are retried on the next tick (without a budget!) */
  // Clients make at most 3 attempts, so retry traffic is capped at 2× the original load.
  const retryLoad = def.retries ? Math.min((timeouts504 / SAMPLES) * all, 2 * incoming) : 0;
  const amplification = incoming > 0 ? (incoming + prev.retryLoad + retriedDead) / incoming : 1;
  const storm = incoming > 0 && prev.retryLoad / incoming > 0.15;
  if (storm && !prev.flags.storm)
    emit("bad", `retries: timed-out requests retried — load amplified ${amplification.toFixed(2)}×`);
  if (!storm && prev.flags.storm) emit("good", "retries: amplification back to normal");

  lat.sort((a, b) => a - b);
  const availability = (ok + fallback) / SAMPLES;
  const sloBreach = availability < 0.99;
  if (sloBreach && !prev.flags.sloBreach)
    emit("bad", `slo: availability dropped to ${(availability * 100).toFixed(1)}% (target 99%)`);
  if (!sloBreach && prev.flags.sloBreach) emit("good", "slo: availability restored above 99%");

  const metrics: Metrics = {
    t,
    incoming,
    offered,
    amplification,
    availability,
    ok: ok / SAMPLES,
    fallback: fallback / SAMPLES,
    errors: errors / SAMPLES,
    shed: shedN / SAMPLES,
    p50: percentile(lat, 0.5),
    p95: percentile(lat, 0.95),
    p99: percentile(lat, 0.99),
    goodput: availability * incoming,
    histogram,
    nodes: nodeMetrics,
    downstreamMs,
    cacheHitRate: hitRate,
    dbQps: dbLoad,
    dbUtil: faults.dbDown ? 0 : dbRho,
    dbLatency: faults.dbDown ? 0 : dbLatency,
    dbFailRate,
    breaker,
    breakerFor: t - breakerSince,
    samples,
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
      reqSeq,
      flags: { saturated, shedding: shed > 1, sloBreach, dbHot, storm },
    },
    metrics,
    events,
  };
}
