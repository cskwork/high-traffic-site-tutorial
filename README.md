# High-Traffic Site Tutorial — Kafka × Redis

An interactive 2D + 3D + musical tutorial that teaches developers — beginner through expert —
how to design and operate high-traffic web architecture using **Apache Kafka** and **Redis**.

Built as a static React + Three.js + Tone.js app and deployed to GitHub Pages.

## Stack

- Vite + React 18 + TypeScript (strict)
- React Three Fiber + drei + three.js for 3D scenes
- Tone.js for the procedural music engine
- Tailwind CSS for the concept-based design system
- Framer Motion for layout transitions
- Zustand for client state (progress, audio settings)
- React Router (HashRouter — GitHub Pages friendly)

## Develop

```bash
npm install
npm run dev          # http://localhost:5173
npm run typecheck    # tsc --noEmit
npm run build        # production bundle in dist/
npm run preview      # serve the production bundle
npm test             # vitest run
```

## Curriculum

| Track    | Modules                                                       |
|----------|---------------------------------------------------------------|
| Kafka    | Beginner → Intermediate → Expert                              |
| Redis    | Beginner → Intermediate → Expert                              |
| Patterns | Cache-aside · Rate limit · CQRS/Event sourcing · Outbox · LB  |

Every concept ships with: plain-language analogy, interactive 2D or 3D scene,
"try it" sandbox, and a musical leitmotif played by the procedural audio engine.

## Deploy

Pushes to `main` trigger `.github/workflows/deploy.yml`, which runs `npm ci && npm run build`
and publishes `dist/` to GitHub Pages. Live URL is configured under repo Settings → Pages.

## Project layout

```
src/
├─ App.tsx, main.tsx, index.css     // bootstrap
├─ components/                       // design system + shell + UI primitives
├─ routes/                           // HomePage, ConceptPage, NotFoundPage
├─ content/                          // concept registry + per-concept content modules
├─ audio/                            // Tone.js engine + leitmotif registry
├─ viz/                              // 2D + 3D visualization primitives
├─ lib/                              // tiny utilities + state stores
└─ test/                             // vitest setup
```

## License

MIT (see `LICENSE` once added).
