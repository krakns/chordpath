# 11: Scale drill and key of the month

**What to build:** The Jazz track begins. The curriculum computes the key of the month from a jazz start date in settings, rotating through all 12 keys pairing major and natural minor. Jazz rung 1: play the major then the natural minor scale of the month's key up and down while the app grades note by note in order with no timing, showing the next expected note. This adds the Listener's monophonic path: an autocorrelation pitch tracker producing a note sequence from the mic, matched in order against the expected scale, tolerant of repeated and held notes. The Progress screen gains a Jazz tab.

**Blocked by:** 05 Progress that sticks

**Status:** ready-for-agent

- [ ] Key of the month is correct for any start date and month offset, with tests
- [ ] Fixture test: a recorded scale yields the expected note sequence and passes; a scale with a wrong note fails at that note
- [ ] Held or repeated notes do not count as extra notes
- [ ] The screen shows the expected next note and marks each note as heard
- [ ] Passing records jazz rung 1 for the month's key
