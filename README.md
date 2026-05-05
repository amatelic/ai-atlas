# AI Atlas

A fast, searchable directory of important AI links, tools, skills, docs, workflows, and articles.

## Features

- Clean, modern design inspired by manus.im
- Local search with smart scoring
- Browse by category (Featured, Design, Workflow, Refactoring, Productivity, Research, Coding, Text to Speech)
- Filter by resource type (Skill, Tool, Docs, Framework, Directory, Protocol)
- Link preview cards with favicon and domain display
- Keyboard shortcut (Cmd/Ctrl + K) to focus search
- Fully static - no external search dependency

## Getting Started

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Building

```bash
npm run build
```

Output will be in `dist/` directory.

## Deploying

The site is permanently deployed at **https://ai-links-search.pages.dev**.

To deploy updates:

```bash
npm run build
npx wrangler pages deploy dist --project-name=ai-links-search --branch=master
```

The URL will always remain `https://ai-links-search.pages.dev` as long as the Cloudflare project name stays `ai-links-search`.

## Data

Resources are stored in `src/data/ai-resources.json`. Edit this file to add or update links.

## Technologies

- React 19
- Vite
- Motion (animations)
- Vanilla CSS
