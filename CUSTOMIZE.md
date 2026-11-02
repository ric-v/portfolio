# Customising the portfolio

All content lives in **one file**: [`src/config/portfolio.ts`](src/config/portfolio.ts).
Edit it, save, and the page updates — no component changes needed.

| Section in config | What it controls |
| --- | --- |
| `site` | Canonical URL, page `<title>` and meta description (SEO / link previews) |
| `personal` | Name, title, location, headline, intro, portrait, email, resume link, social links |
| `metrics` | The four impact numbers under the hero — keep them concrete and measurable |
| `about` | Bio paragraphs and the "What I focus on" cards |
| `experience` | One entry per company: period, domain, role progression (newest first), highlights, tech |
| `projects` | Project cards. Set `featured: true` on one project to show it full-width at the top |
| `skills` | Grouped skill lists |
| `education`, `certifications` | Education history and certificates |
| `contact` | Heading and message in the contact block |

### Tips

- `personal.intro` can include `{years}` — it's replaced with years since `careerStartYear`.
- Project cards link to `live` if set, otherwise to `github`. `liveLabel` customises the link text.
- Images go in `public/` and are referenced as `/file.png`.
- Social `icon` is one of `github`, `linkedin`, `resume`, `email`.

## Theming

Colours are CSS variables in [`src/app/globals.css`](src/app/globals.css) — one block for light
(`:root`) and one for dark (`[data-theme="dark"]`). Change `--accent` to re-brand the whole site.
The theme follows the visitor's system setting until they use the toggle, which is remembered.

## Structure

```
src/
  app/            layout (metadata, theme script), page, sitemap, robots
  components/
    Header.tsx    sticky nav with scroll-spy + mobile menu
    sections/     Hero, About, Experience, Projects, Skills, Contact, Footer
    ui.tsx        shared Section / Tag helpers
  config/portfolio.ts
```

Add a section by creating a component in `src/components/sections/`, rendering it in
`src/app/page.tsx`, and adding its id to `NAV_ITEMS` in `Header.tsx`.
