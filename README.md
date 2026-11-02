# Richie Varghese — Portfolio

Personal site for [me.astrx.dev](https://me.astrx.dev). A single, fast, content-first page built with
Next.js (App Router), React 19 and Tailwind CSS v4 — statically rendered, with light/dark themes.

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Edit content

Everything on the page comes from [`src/config/portfolio.ts`](src/config/portfolio.ts).
See [CUSTOMIZE.md](CUSTOMIZE.md) for the full guide.

## Build

```bash
npm run build && npm start
```

Old section URLs (`/about`, `/projects`, …) redirect to the matching anchor on the home page.

## Concept: "Break it"

The site is built around a live chaos lab: a simulated request-processing backend
(load balancer → three Go API nodes → Redis + Postgres) that visitors can break and defend.

- **Guided incidents** — five step-by-step walkthroughs (node failure, slow database, traffic
  spike, cache outage, retry storm / metastable failure) that inject faults, point at what to
  watch and explain *why* the system reacts the way it does: [`src/lib/scenarios.ts`](src/lib/scenarios.ts)
- **Console** — live diagram with per-node worker slots and queues, availability / p99 /
  goodput / load amplification, outcome breakdown, latency histogram, a request inspector that
  shows one live request span-by-span, component explainers and an event log
- **How it works** — Little's law, queueing (ρ/(1−ρ)), circuit-breaker state machine and retry
  amplification, each with a chart driven by the same live simulation
- **Engine** — [`src/lib/chaos.ts`](src/lib/chaos.ts): worker pools sized by Little's law,
  queues, 400 sampled requests per tick, breaker state machine, capped retries

The model is deliberately simple and is labelled as illustrative on the page.
