# 06: Flow mode

**What to build:** Playing in time. Once a rung has a Wait pass, Flow mode is offered. A transport built on Tone.js plays a click and a generated bass line (roots and fifths on beats 1 and 3 for straight feel, walking roots with chromatic approaches for swing) derived from the drill's Chart, at a chosen tempo. Settings pick which earbud gets click and bass and their volumes, with a click-only speaker fallback. A one-bar count-in, then the transport emits bar boundaries that define Bar Windows; the grader returns a Verdict per bar as the run goes. The current comping rhythm pattern (straight eighths, Charleston, reverse Charleston, Red Garland) is displayed with the click but not graded. At the end, a bar-by-bar list shows pass, fail, or silent. A Flow run at 80% or more bars passed records a Flow pass, which unlocks the next rung. Both numbers live in the curriculum as constants.

**Blocked by:** 05 Progress that sticks

**Status:** ready-for-agent

- [ ] Click and bass play through the chosen earbud side at the set volumes and stay in time with each other over 32 bars
- [ ] Speaker fallback plays click only
- [ ] Bar Windows line up with the click within a tolerance the user cannot notice
- [ ] Fixture test: a recorded Flow run of a short progression yields the expected per-bar Verdict list
- [ ] Rhythm pattern display matches the drill's feel
- [ ] Score screen lists every bar with its Verdict and the accuracy percentage
- [ ] 80% or better records a Flow pass and unlocks the next rung; below does not
