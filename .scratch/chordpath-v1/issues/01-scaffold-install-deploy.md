# 01: Scaffold, install, deploy

**What to build:** A chordpath web app that builds, runs its tests in CI, deploys to GitHub Pages, and installs to an iPad or iPhone home screen. The first screen shows the app name and a Start button. Vite, TypeScript, React, Vitest, PWA manifest with icon and standalone display, a GitHub Actions workflow that runs tests and publishes the built site to Pages. Layout works in iPhone portrait and iPad landscape.

**Blocked by:** None (can start immediately)

**Status:** done (merged, https://github.com/krakns/chordpath/pull/1; iOS home-screen install still to verify on the iPad)

- [x] `npm test` runs Vitest and passes with at least one smoke test
- [x] `npm run build` produces a static site with the correct base path for GitHub Pages
- [x] Workflow builds, tests, and deploys to Pages on push to main
- [ ] Manifest and icons let Safari "Add to Home Screen" open the app standalone
- [x] Home screen renders a Start button on both iPhone portrait and iPad landscape
- [x] README states that song charts and progress never enter the repo
