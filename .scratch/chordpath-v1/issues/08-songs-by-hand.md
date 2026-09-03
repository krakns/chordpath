# 08: Songs by hand

**What to build:** The user's own songs enter the app by typing. A Songs screen lists songs; New Song asks for title, original key, tempo, and feel (straight or swing), then sections are added one at a time (name, bar count) and chords are typed per bar with an optional second chord per bar, plus an optional few-word cue per section line. The result is a Chart: chords per beat slot with cues. The Song screen shows the Chart as a grid, a transpose control that rewrites every chord and the current key, and a delete action with confirmation. Songs live only in IndexedDB.

**Blocked by:** 05 Progress that sticks

**Status:** ready-for-agent

- [ ] A song entered by hand appears in the list after reload with all sections and chords intact
- [ ] Transposing a song rewrites every chord symbol and slash bass correctly, with tests
- [ ] Bad chord symbols are flagged inline at entry time and cannot be saved
- [ ] Delete removes the song and its progress
- [ ] The Chart data shape matches the spec: id, title, originalKey, currentKey, tempo, feel, sections, bars, styleRung, createdAt
