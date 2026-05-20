# High-Traffic Sites Interactive Tutorial — Brief

## Mission
Ship a production-ready, interactive 2D + 3D + musical web tutorial that teaches developers — beginner through expert — how to design and operate high-traffic sites using **Apache Kafka** and **Redis**. The tutorial lives in this repository and deploys automatically to **GitHub Pages**.

## Why
High-traffic architecture is normally taught in dense text and slide decks. This project bets that:
- A concept-driven UI/UX (clear mental models, not just docs)
- Real interactive visualizations (2D diagrams that animate, 3D scenes that show data flow)
- A wild, dynamic, musical layer that reacts to learner actions
… will make Kafka + Redis architecture click in a way no README can.

## Quality bar
- Fully functional, production-quality static site (Vite + React + TypeScript)
- 3D via React Three Fiber + drei + Three.js
- Audio via Tone.js (procedural / reactive music engine)
- Strong typed, accessible (a11y), responsive, fast (Lighthouse > 90)
- Deployed via GitHub Actions to `gh-pages`
- No emojis in code, no AI-slop, no unused abstractions

## Required tooling
- Use the `bkit-claude-code` plugin from https://github.com/popup-studio-ai/bkit-claude-code
- Plugin must be set up first and used to drive the build

## Content scope (beginner → expert)

### Kafka track
1. **Beginner** — What Kafka is, brokers, topics, producers, consumers (interactive 2D message flow)
2. **Intermediate** — Partitions, replication, consumer groups, offsets (animated 2D + 3D partition layout)
3. **Expert** — Streams, KSQL, schema registry, exactly-once, multi-datacenter (interactive 3D cluster scenes)

### Redis track
1. **Beginner** — Data types (strings, hashes, lists, sets, sorted sets) — interactive playground
2. **Intermediate** — Pub/Sub, Streams, transactions, Lua, eviction policies (2D + 3D state machines)
3. **Expert** — Clustering, replication, sharding, persistence (AOF/RDB), Sentinel, RedisJSON/Search

### Integrated patterns track
- Cache-aside, write-through, write-behind
- Rate limiting (token bucket, sliding window) using Redis
- Event sourcing + CQRS with Kafka
- Leaderboards, presence, session, queueing
- Outbox pattern (Kafka + DB + Redis)

## UX principles (concept-based design)
- One concept per page, no walls of text
- Each concept paired with: (a) plain-language analogy, (b) interactive visualization, (c) "try it" sandbox, (d) musical motif that represents the concept
- Persistent left rail = curriculum tree; persistent right rail = inspector
- Dark, editorial typography; controlled color palette tied to concept families (Kafka = ember/amber, Redis = crimson, Patterns = cyan)

## Audio principles
- Tone.js procedural engine — no canned audio files
- Each concept has a leitmotif (small repeating phrase)
- User interactions (publish, consume, evict, replicate) trigger note events
- Always mutable / persistent volume control / respects `prefers-reduced-motion` semantically (audio default OFF, with hero "turn on the music" CTA)

## Deployment
- GitHub Actions workflow on push to `main`
- Static build → `gh-pages` branch → GitHub Pages
- Repo must expose a working URL when done

## Out of scope
- Backend services (this is a static tutorial; the "live" Kafka/Redis are simulated in-browser)
- User accounts / progress sync (local storage only)
- Mobile-only design (responsive, but desktop-first)
