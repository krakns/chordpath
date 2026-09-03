# 10: PDF import

**What to build:** Import a text PDF chord chart into a Song. The user picks a PDF from the Files app, the importer extracts text with pdf.js, detects chord lines above lyric lines, section headers, and bar counts from chord spacing, and produces a Chart plus a few-word cue per line. A review screen shows the parsed grid next to the original text lines so the user can correct chords, bar counts, and section names before saving. If the PDF has no extractable text, the app says so and offers manual entry. Fixtures are public-domain hymn charts formatted like worship charts; the user's real sample is used locally and never committed.

**Blocked by:** 08 Songs by hand

**Status:** ready-for-agent

- [ ] Fixture test: each sample PDF parses to the expected sections, bar counts, chords per slot, and cues
- [ ] Scanned or image-only PDFs are detected and routed to manual entry with a clear message
- [ ] Review screen edits change the saved Chart
- [ ] Saved songs from PDF are indistinguishable from hand-entered ones everywhere else in the app
- [ ] No PDF, lyric line, or chart is written anywhere except IndexedDB
