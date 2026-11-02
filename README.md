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
