# 14: Settings and backup

**What to build:** A Settings screen: click ear (left, right, both), click volume, bass volume, speaker fallback toggle, jazz start date, and a Recalibrate button. Export writes one JSON file containing songs, progress, quiz history, calibration, and settings using the share sheet or a download. Import reads that file on another device, merges by id, and reports what was added.

**Blocked by:** 08 Songs by hand

**Status:** ready-for-agent

- [ ] Every setting takes effect immediately and persists after reload
- [ ] Export produces one file; importing it on a fresh install restores songs and progress exactly, with a round-trip test
- [ ] Import of a malformed file fails without touching existing data
- [ ] Export and import work from iOS Safari using the Files app
