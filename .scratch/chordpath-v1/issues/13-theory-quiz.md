# 13: Theory quiz

**What to build:** A Quiz screen that needs no mic. Three item types: scale degree (what is the b6 of G, answer by tapping a note name), chord spelling (spell Ebmaj7, tap notes in order), and chord symbol reading (multiple choice about what a symbol means, for example what sus4 replaces or what the slash in G/B means). Items are weighted toward the keys of the user's songs and the month's key, and missed items return sooner. Per-item history (attempts, misses, last seen) is stored.

**Blocked by:** 02 Chord lookup, 05 Progress that sticks

**Status:** ready-for-agent

- [ ] Item generator covers all degrees and keys and all chord types from the theory module, with tests
- [ ] Weighting tests: a missed item is scheduled before an unseen one; song keys appear more often than others
- [ ] A 5-minute quiz round runs without the mic and records history
- [ ] Wrong answers show the correct answer and a one-line explanation
