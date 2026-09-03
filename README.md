# chordpath

chordpath is a personal piano practice web app. It listens through the device mic, grades chords per bar, and walks a church chord-piano ladder first and a jazz ladder second.

## Development

```
npm install
npm run dev
```

## Testing

```
npm test
```

Runs Vitest once (`vitest run`) against jsdom with React Testing Library.

## Building

```
npm run build
npm run preview
```

`npm run build` runs `tsc -b` first, so a type error fails the build. `npm run typecheck` runs the same check on its own. The production build uses base path `/chordpath/` (override with the `VITE_BASE` env var); the dev server stays at `/`.

## Deploy

`.github/workflows/deploy.yml` runs on every push to `main`: install with `npm ci`, `npm test`, `npm run build` (which type-checks first), then publish `dist/` to GitHub Pages via `actions/upload-pages-artifact` and `actions/deploy-pages`.

## Data

Song charts, PDFs, lyrics, and practice progress never enter this repo. They live only on the device, in IndexedDB.
