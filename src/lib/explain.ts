import { PARAMS, nodeCapacity, type ComponentId, type Defences } from "./chaos";

export interface ComponentInfo {
  title: string;
  kind: string;
  description: string;
  params: [string, string][];
  failure: string;
}

const apiInfo = (id: string): ComponentInfo => ({
  title: id,
  kind: "Go API node",
  description:
    "Stateless request handler. Each request takes a worker for its own compute time plus however long it waits on Redis or Postgres — which is why slow dependencies shrink capacity.",
  params: [
    ["workers", String(PARAMS.apiWorkers)],
    ["own compute / req", `${PARAMS.apiBaseMs}ms`],
    ["capacity (healthy)", `≈${Math.round(nodeCapacity(PARAMS.cacheHit * PARAMS.cacheMs + (1 - PARAMS.cacheHit) * 10))} req/s`],
  ],
  failure:
    "Crashes (fails fast, connection refused) or saturates (every worker busy; requests queue and latency climbs).",
});

export const componentInfo: Record<ComponentId, ComponentInfo> = {
  clients: {
    title: "clients",
    kind: "Traffic source",
    description:
      "Pharmacies, apps and partner systems sending requests. They wait up to 10s before giving up, and — if retries are on — try up to 3 times.",
    params: [
      ["normal load", `${PARAMS.baseRps} req/s`],
      ["busy / spike", `${PARAMS.baseRps * 2} / ${PARAMS.baseRps * 3} req/s`],
      ["max attempts", "3"],
    ],
    failure: "Can't fail — but clients can amplify failures by retrying aggressively.",
  },
  lb: {
    title: "load balancer",
    kind: "Edge / L7 load balancer",
    description:
      "Spreads requests across healthy API nodes. With health checks it evicts dead nodes; with load shedding it rejects work beyond 90% of capacity with an instant 429.",
    params: [
      ["health-check eviction", `${PARAMS.healthCheckS}s`],
      ["shed above", `${Math.round(PARAMS.shedAt * 100)}% of capacity`],
      ["routing", "round-robin"],
    ],
    failure: "Without health checks it keeps routing to dead nodes; without shedding it admits more than the system can serve.",
  },
  "api-1": apiInfo("api-1"),
  "api-2": apiInfo("api-2"),
  "api-3": apiInfo("api-3"),
  redis: {
    title: "redis",
    kind: "Cache",
    description:
      "Absorbs most reads in about 1ms. Also holds the stale copies that the circuit breaker serves as fallbacks when Postgres is unhealthy.",
    params: [
      ["hit rate", `${Math.round(PARAMS.cacheHit * 100)}%`],
      ["latency", `${PARAMS.cacheMs}ms`],
    ],
    failure: "When it's down every read goes to Postgres — and there's nothing left to fall back to.",
  },
  postgres: {
    title: "postgres",
    kind: "Primary database",
    description:
      "The source of truth. Has a hard throughput ceiling: past it, queries queue and latency grows without bound.",
    params: [
      ["capacity", `${PARAMS.dbCapacity} queries/s`],
      ["base latency", `${PARAMS.dbBaseMs}ms`],
      ["query timeout", `${PARAMS.dbTimeoutMs}ms`],
    ],
    failure: "Down (fails fast), slow (holds API workers), or overloaded (queues build and latency explodes).",
  },
};

export interface DefenceInfo {
  key: keyof Defences;
  label: string;
  short: string;
}

export const defenceInfo: DefenceInfo[] = [
  { key: "healthChecks", label: "Health checks", short: "Evict dead nodes from the load balancer" },
  { key: "timeouts", label: "Timeouts", short: `${PARAMS.dbTimeoutMs}ms per query, ${PARAMS.deadlineMs}ms per request` },
  { key: "retries", label: "Retries + backoff", short: "Up to 3 attempts — but no retry budget" },
  { key: "breaker", label: "Circuit breaker", short: "Stop calling Postgres when it's failing" },
  { key: "shedding", label: "Load shedding", short: "Fast 429s beyond 90% of capacity" },
];
