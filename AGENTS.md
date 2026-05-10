# AI Atlas — Agent Notes

## Commands

```bash
npm install
npm run dev          # http://localhost:5173 (Vite, host=127.0.0.1)
npm run build        # outputs to dist/
```

## Deploy

Cloudflare Pages. Build first, then:

```bash
npx wrangler pages deploy dist --project-name=ai-atlas --branch=main
```

Public URL: https://ai.gdo-studio.si/

## Architecture

- React 19 + Vite + Motion (animations)
- Vanilla CSS (no Tailwind, no CSS-in-JS)
- Fully static, no backend or external search API
- Single data source: `src/data/ai-resources.json`

## Data Model

`ai-resources.json` has four top-level keys:

- `categories` — resource categories (Featured, Design, Workflow, etc.)
- `resources` — tools, docs, skills with `id, title, url, type, category, summary, tags, priority, featured`
- `articleGroups` — article group labels (Learn, Build, Refactor, Automate, Read)
- `articles` — article links with `id, title, url, source, group, summary, tags, date`

## Key Conventions

- Favicons fetched from Google: `https://www.google.com/s2/favicons?domain={domain}&sz=64`
- Pixel art thumbnails generated client-side via canvas (seeded by item ID)
- Search is client-side only, scoring against title/category/tags/summary
- Keyboard shortcut Cmd/Ctrl+K focuses search
- No test suite, no linter config, no type checker in the project currently
- `similarity.js` and `pixelArt.js` exist but are only partially wired up

## Adding Content

Edit `src/data/ai-resources.json` directly. No build step needed for data changes unless you want to preview.
