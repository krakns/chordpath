# 02: Chord lookup

**What to build:** A Reference screen where the user types any chord symbol and sees the note names, a keyboard diagram highlighting the keys for a root-position voicing, and a transpose control that moves it to any key. This ticket brings in the theory module: chord symbol parsing (major, minor, dim, aug, sus2, sus4, add9, 6, maj7, m7, 7, m7b5, dim7, slash bass, 9/11/13 extensions and alterations parsed and reduced to pitch classes), chord to pitch-class set, major and natural minor scales and the seven modes, scale degree lookup by name (b6 of G), transposition, and voicing generators for root-position and inverted triads and for chord shells.

**Blocked by:** 01 Scaffold, install, deploy

**Status:** in-review (PR https://github.com/krakns/chordpath/pull/3)

- [ ] Every chord symbol type listed above parses to the correct pitch-class set, with tests
- [ ] Unknown or malformed symbols return a clear parse error shown in the UI
- [ ] Scale degree lookup answers "what is the b6 of G" style queries for all degrees and keys, with tests
- [ ] Transposing a chord by any interval produces the correct new symbol and pitch classes
- [ ] Keyboard diagram highlights the right keys for the chosen voicing
- [ ] Theory functions are pure and have no DOM or audio dependencies
