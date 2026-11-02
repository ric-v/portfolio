import type { ApiNode, ComponentId, Defences, Faults } from "./chaos";

/** Things a step can point the visitor's eye at. */
export type Focus =
  | ComponentId
  | "workers"
  | "availability"
  | "p99"
  | "amplification"
  | "outcomes"
  | "histogram"
  | "breaker"
  | "inspector";

export interface Change {
  /** Reset faults, defences and queues to a clean, healthy system first. */
  reset?: boolean;
  faults?: Partial<Omit<Faults, "killed">> & { killed?: Partial<Record<ApiNode, boolean>> };
  defences?: Partial<Defences>;
}

export interface ScenarioStep {
  title: string;
  body: string[];
  apply?: Change;
  focus?: Focus[];
  watch?: string;
}

export interface Scenario {
  id: string;
  title: string;
  tagline: string;
  steps: ScenarioStep[];
  takeaway: string;
  realWorld: { text: string; where: string };
}

export const scenarios: Scenario[] = [
  {
    id: "node-dies",
    title: "A server dies",
    tagline: "Redundancy, health checks and retries",
    steps: [
      {
        title: "A healthy baseline",
        apply: { reset: true },
        body: [
          "300 requests per second arrive at the load balancer and are spread across three Go API nodes.",
          "Each node has 6 workers. A request takes about 22ms of worker time, so one node can serve roughly 270 requests a second — at 100 each, they sit around 38% busy.",
        ],
        focus: ["api-1", "api-2", "api-3", "workers"],
        watch: "the worker slots inside each API node",
      },
      {
        title: "api-2 crashes",
        apply: { faults: { killed: { "api-2": true } } },
        body: [
          "The load balancer doesn't know yet. For the next ~1.5 seconds, a third of all requests are sent to a dead socket.",
          "Retries are on, so each of those fails in about 1ms and is re-sent to a healthy node after a short backoff. Users see a slightly slower request, not an error.",
        ],
        focus: ["lb", "api-2", "inspector"],
        watch: "the request inspector — some requests show 'connection refused → retry'",
      },
      {
        title: "Health checks evict it",
        body: [
          "After three failed health checks, api-2 is removed from the pool. The two survivors absorb its share and go from ~38% to ~56% busy.",
          "Latency barely moves, because we're nowhere near saturation. That spare headroom is the whole point of running N+1 capacity.",
        ],
        focus: ["api-1", "api-3", "p99"],
        watch: "utilisation on api-1 and api-3, and a flat p99",
      },
      {
        title: "Now without health checks or retries",
        apply: { defences: { healthChecks: false, retries: false } },
        body: [
          "The dead node goes straight back into rotation, and nothing retries.",
          "One in three requests now fails instantly. Every surviving server looks perfectly healthy on its own dashboard — and a third of users are getting errors.",
        ],
        focus: ["availability", "outcomes", "api-2"],
        watch: "availability dropping to about 66%",
      },
    ],
    takeaway:
      "Redundancy only helps if you detect failure (health checks) and route around it (retries). But retries are a loaded gun — see the retry storm.",
    realWorld: {
      text: "Containerised our claims services and added telemetry and real-time monitoring on Azure — a 60% efficiency gain, and failures you can see in seconds.",
      where: "Worklife Tech",
    },
  },
  {
    id: "slow-db",
    title: "The database gets slow",
    tagline: "Why slow is worse than down",
    steps: [
      {
        title: "Postgres slows down by 400ms",
        apply: { reset: true, faults: { dbSlow: true } },
        body: [
          "Only about 15% of requests miss the cache and reach Postgres — but each of those now holds an API worker for 400ms+ instead of ~10ms.",
          "Timeouts cap every query at 250ms. Once more than half of queries are timing out, the circuit breaker trips open.",
        ],
        focus: ["postgres", "breaker"],
        watch: "the breaker on the Postgres link",
      },
      {
        title: "Breaker open: degrade gracefully",
        body: [
          "With the breaker open, cache misses are answered from a stale cached copy instead of waiting on Postgres. About 15% of responses are 'fallback' — slightly stale, but fast.",
          "Every 4 seconds the breaker goes half-open and lets 10% of traffic probe Postgres to see if it has recovered.",
        ],
        focus: ["outcomes", "histogram", "breaker"],
        watch: "the fallback slice in outcomes, and an all-fast latency histogram",
      },
      {
        title: "Remove the circuit breaker",
        apply: { defences: { breaker: false } },
        body: [
          "Every cache miss now waits for the full 250ms timeout. Workers are held more than 10× longer, so each node's capacity collapses — Little's law: capacity = workers ÷ time per request.",
          "Load shedding kicks in, rejecting traffic so the requests that do get in stay fast.",
        ],
        focus: ["workers", "lb", "availability"],
        watch: "worker slots filling up, and the load balancer starting to shed",
      },
      {
        title: "Remove every defence",
        apply: { defences: { timeouts: false, shedding: false, retries: false, healthChecks: false } },
        body: [
          "Now nothing bounds the wait. Workers fill with requests stuck on Postgres, and cache hits — which should take 1ms — queue up behind them.",
          "p99 heads for 10 seconds and availability falls to zero, even though Postgres never actually went down.",
        ],
        focus: ["p99", "workers", "availability"],
        watch: "p99 latency, and queues forming on every API node",
      },
    ],
    takeaway:
      "A slow dependency is more dangerous than a dead one. Dead fails fast; slow quietly eats every worker you have. Timeouts and breakers turn slow into fast failures you can handle.",
    realWorld: {
      text: "Re-engineered PostgreSQL functions on a real-time claims platform, cutting 50–500ms off individual queries. The cheapest fix is not being slow in the first place.",
      where: "Worklife Tech",
    },
  },
  {
    id: "spike",
    title: "Traffic triples",
    tagline: "Queueing theory and load shedding",
    steps: [
      {
        title: "900 req/s hits a system built for ~800",
        apply: { reset: true, faults: { load: 3 } },
        body: [
          "Utilisation goes past 100%. Queueing theory says waiting time grows like ρ / (1 − ρ): at 50% busy you wait 1 unit, at 90% you wait 9, at 99% you wait 99.",
          "Near full capacity there is no 'a bit slower'. There's fine, and then there's a cliff.",
        ],
        focus: ["clients", "workers"],
        watch: "the queueing curve in “How it works”, below",
      },
      {
        title: "Load shedding holds the line",
        body: [
          "The load balancer rejects anything beyond 90% of capacity with an instant 429. About 20% of requests are turned away — but the 80% admitted are served at normal speed.",
          "A fast, honest 'try again later' lets clients back off. A slow 'maybe' helps nobody.",
        ],
        focus: ["lb", "outcomes", "histogram"],
        watch: "the shed slice, while the latency histogram stays fast",
      },
      {
        title: "Turn shedding off",
        apply: { defences: { shedding: false } },
        body: [
          "Everyone gets in, so everyone waits. Queues grow every tick until requests hit the 1-second deadline and are cancelled.",
          "Retries then resend those timed-out requests, adding even more load. Good throughput falls far below what shedding was serving.",
        ],
        focus: ["p99", "availability", "amplification"],
        watch: "good req/s collapsing, and load amplification climbing",
      },
    ],
    takeaway:
      "Serving 80% of users well beats serving 100% of them badly. Capacity limits are real, so decide on purpose who waits.",
    realWorld: {
      text: "Load-tested Go telemetry collectors past 10,000 metrics per second. You find these cliffs in load tests, not in production.",
      where: "Algomox",
    },
  },
  {
    id: "cache",
    title: "The cache disappears",
    tagline: "When an optimisation becomes load-bearing",
    steps: [
      {
        title: "Redis goes down",
        apply: { reset: true, faults: { cacheDown: true } },
        body: [
          "Redis was answering 85% of reads in about 1ms. Now every request goes to Postgres: ~45 queries a second becomes ~300, more than its ~260/s capacity.",
          "Postgres queues up, its latency climbs, and API workers sit waiting on it.",
        ],
        focus: ["redis", "postgres"],
        watch: "Postgres utilisation going past 100%",
      },
      {
        title: "Defences only hold part of the line",
        body: [
          "Shedding keeps admitted traffic within what Postgres can actually serve, so availability settles around 70–75% instead of zero.",
          "The circuit breaker can't save us here: fallbacks are served from the cache — and the cache is what failed.",
        ],
        focus: ["lb", "availability", "inspector"],
        watch: "the request inspector — fallbacks fail with 'no cached copy'",
      },
      {
        title: "Without defences",
        apply: { defences: { healthChecks: false, timeouts: false, retries: false, breaker: false, shedding: false } },
        body: [
          "Postgres is overwhelmed, every API worker is stuck waiting on it, and availability goes to zero.",
          "The database didn't break, and neither did the API. They were just never sized to work without the cache.",
        ],
        focus: ["postgres", "workers", "p99"],
        watch: "p99 hitting the 10s client give-up time",
      },
    ],
    takeaway:
      "A cache that absorbs 85% of reads isn't an optimisation any more, it's load-bearing. Size the database for a cold or missing cache, and keep fallbacks somewhere other than the thing that failed.",
    realWorld: {
      text: "Built a Java ASM-based Cassandra writer for high-volume inserts — 10× faster, with no slow-query build-up under sustained load. Make the storage layer able to take the herd.",
      where: "Algomox",
    },
  },
  {
    id: "storm",
    title: "Retry storm",
    tagline: "A 4-second blip that never ends",
    steps: [
      {
        title: "Busy, but fine",
        apply: { reset: true, faults: { load: 2 }, defences: { breaker: false, shedding: false } },
        body: [
          "600 requests per second — the API nodes are about 75% busy. Healthy, with some headroom.",
          "The circuit breaker and load shedding are off. Retries are on: every client makes up to 3 attempts.",
        ],
        focus: ["workers", "amplification"],
        watch: "load amplification sitting at 1.0×",
      },
      {
        title: "A short database blip",
        apply: { faults: { dbSlow: true } },
        body: [
          "Postgres slows down for a moment. Some requests time out, and clients retry them — adding load at exactly the wrong time.",
          "More load means longer queues, which means more timeouts, which means more retries.",
        ],
        focus: ["amplification", "postgres", "workers"],
        watch: "amplification climbing towards 3×",
      },
      {
        title: "The blip is over… the outage isn't",
        apply: { faults: { dbSlow: false } },
        body: [
          "Postgres is healthy again. But the system stays down: retries keep the API saturated, saturation causes timeouts, and timeouts cause more retries.",
          "This is a metastable failure. The trigger is gone, and the outage now sustains itself. Turning the breaker on wouldn't help — Postgres isn't the problem any more.",
        ],
        focus: ["availability", "amplification"],
        watch: "availability staying low with Postgres green",
      },
      {
        title: "Break the loop",
        apply: { defences: { shedding: true } },
        body: [
          "Load shedding caps admitted work below capacity. Queues drain, timeouts stop, retries stop — and the system snaps back within a couple of seconds.",
          "Turning off retries, or giving them a budget, would also break the loop.",
        ],
        focus: ["lb", "availability", "amplification"],
        watch: "everything going green again",
      },
    ],
    takeaway:
      "Retries without a budget can turn a 4-second blip into an hour-long incident. Every retry policy needs a budget, backoff with jitter, and a system that can shed load.",
    realWorld: {
      text: "Kept core claim-processing under 100ms at high request volume. That latency headroom is what stops a blip from becoming a storm.",
      where: "Worklife Tech",
    },
  },
];
