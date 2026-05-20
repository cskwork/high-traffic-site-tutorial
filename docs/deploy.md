# Deploy

This repo deploys to GitHub Pages automatically on every push to `main`.

## How it works

`.github/workflows/deploy.yml` runs on `push` to `main` and on manual `workflow_dispatch`:

1. Checks out the repo.
2. Installs Node 22 (`npm ci`).
3. Computes `VITE_BASE_PATH` from the repo name (e.g. `/high-traffic-site-tutorial/`) and exports it
   so Vite emits asset URLs that work from a sub-path.
4. Runs `npm run build` → `dist/`.
5. Adds `.nojekyll` so GitHub serves files with leading dots / underscores.
6. Copies `index.html` to `404.html` as an SPA fallback (HashRouter handles in-app routing, but
   any direct hit on a non-existent file lands on the SPA).
7. Uploads `dist/` as a Pages artifact and deploys via `actions/deploy-pages@v4`.

## Enabling Pages on a fresh repo

1. Push to `main`.
2. Repo → Settings → Pages → "Source" → set to **GitHub Actions**.
3. Wait for the first workflow run. URL appears on the workflow summary or
   under Settings → Pages.

## Local preview of the production bundle

```bash
npm run build
VITE_BASE_PATH=/ npm run preview
```

`HashRouter` keeps deep links working on Pages without any custom rewrite — `/#/learn/foo`
always reaches the right concept.
