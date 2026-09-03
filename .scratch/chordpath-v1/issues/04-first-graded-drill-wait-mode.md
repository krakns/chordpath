# 04: First graded drill, Wait mode

**What to build:** Church rung 1 playable end to end. The user picks a key, the Drill screen shows one chord at a time (the diatonic triads of that key in a generated progression) with its keyboard diagram, and holds until the Listener returns a pass Verdict, then advances. A skip button moves past a stuck bar. A silent bar shows "nothing heard" rather than "wrong". The live meter stays visible. The grader consumes chroma frames for a Bar Window and returns pass, fail, or silent using pitch-class matching: the expected classes together carry a large majority of energy across active frames, and each expected class is present above threshold in some frames. Thresholds start from calibration values.

**Blocked by:** 02 Chord lookup, 03 Hear the piano

**Status:** ready-for-agent

- [ ] Drill generator produces a diatonic triad progression for any key from theory, with tests
- [ ] Fixture tests assert pass for the right chord, fail for a wrong chord, silent for silence
- [ ] Playing the shown triad on the piano advances to the next chord within about a second
- [ ] Playing a different triad does not advance
- [ ] Skip advances and is recorded as a skipped bar
- [ ] Completing every bar shows a summary of passed and skipped bars
