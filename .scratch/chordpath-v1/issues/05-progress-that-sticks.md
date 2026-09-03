# 05: Progress that sticks

**What to build:** Progress survives closing the app. An IndexedDB store holds progress per rung per key (Wait passed at, Flow passed at, best Flow accuracy), calibration, and settings. Finishing a Wait-mode run of rung 1 with every bar passed records a Wait pass for that rung and key. A Progress screen shows the Church track rungs with per-key status. The curriculum module defines the Church track as an ordered list of Rungs and answers what is unlocked given a progress state. This establishes the progress-state-to-session test seam.

**Blocked by:** 04 First graded drill, Wait mode

**Status:** ready-for-agent

- [ ] A full Wait pass records the rung and key with a timestamp and shows on the Progress screen after reload
- [ ] A run with a skipped bar does not record a pass
- [ ] Curriculum tests assert which rungs are unlocked for given progress states
- [ ] Store wrapper has tests against an in-memory IndexedDB
- [ ] Locked rungs appear on the Progress screen with a lock and their names
