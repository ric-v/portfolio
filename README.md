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

A deliberately minimal site built around a live chaos lab: a small simulated system
(load balancer, three Go API nodes, Redis, Postgres) that visitors can break — kill nodes,
slow or take down the database, spike traffic — and then watch health checks, timeouts,
retries, a circuit breaker and load shedding keep it up. Turn the defences off to see it fall over.

- Simulation engine: [`src/lib/chaos.ts`](src/lib/chaos.ts)
- Lab UI: [`src/components/chaos/Lab.tsx`](src/components/chaos/Lab.tsx)
