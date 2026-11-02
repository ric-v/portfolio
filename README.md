# Richie Varghese — Portfolio

Personal site for [me.astrx.dev](https://me.astrx.dev). A single, fast, content-first page built with
Next.js (App Router), React 19 and Tailwind CSS v4 — statically rendered.

## Concept: "The Trace"

The portfolio renders the career as a distributed trace (inspired by Jaeger / Datadog APM):
- Waterfall of spans with start/end dates for education, Algomox, Worklife Tech and each promotion; ongoing spans pulse as "running".
- Click a span (or use j/k) to inspect attributes, event logs, tags and child spans in a side panel.
- Header shows a real "served in Xms" badge from the Navigation Timing API.
- Metrics, projects as linked traces, skills as dependencies, and contact options.
- Span data lives in [`src/config/trace.ts`](src/config/trace.ts); text is pulled from [`src/config/portfolio.ts`](src/config/portfolio.ts).

### The Lab (`/lab`)

For visitors who want to see system reliability in practice, an interactive lab lives at **`/lab`**: a simulated request-processing backend
(load balancer → three Go API nodes → Redis + Postgres) that visitors can break and defend.

- **Guided incidents** — five step-by-step walkthroughs (node failure, slow database, traffic
  spike, cache outage, retry storm / metastable failure): [`src/lib/scenarios.ts`](src/lib/scenarios.ts)
- **Console** — live diagram with worker slots and queues, metrics, latency histogram, and a request inspector.
- **Engine** — [`src/lib/chaos.ts`](src/lib/chaos.ts): worker pools sized by Little's law,
  queues, 400 sampled requests per tick, breaker state machine, capped retries.

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
