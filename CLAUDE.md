# chordpath

Personal piano practice web app. Listens through the mic on an iPhone or iPad, grades chords per bar by pitch class, and walks a church chord-piano ladder first and a jazz ladder second. Spec: `.scratch/chordpath-v1/spec.md`.

Song charts and progress live only on the user's device. Never commit charts, PDFs, or lyric text.

## Agent skills

### Issue tracker

Issues and specs live as markdown files under `.scratch/<feature-slug>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default labels, unchanged: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
