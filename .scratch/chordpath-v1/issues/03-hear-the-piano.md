# 03: Hear the piano

**What to build:** The Listener's first path from mic to screen. Tapping a button asks for the mic (iOS requires the gesture), a Calibration screen measures room noise for a few seconds, asks the user to play a chord, confirms it heard it, and stores noise floor and gain. A live 12-bin chroma meter shows which pitch classes are sounding. The screen stays awake while listening. The audio pipeline is an AudioWorklet producing a chroma vector per frame at roughly 20 frames per second. This ticket also establishes the audio-fixture test seam: short WAV clips recorded from the user's digital piano through the phone mic (a few chords, a wrong chord, silence, a scale) are committed as fixtures and run through the same pipeline offline in tests.

**Blocked by:** 01 Scaffold, install, deploy

**Status:** in-review (PR https://github.com/krakns/chordpath/pull/2)

- [ ] Mic starts from a tap on iOS Safari, both in the browser and installed from the home screen
- [ ] Calibration stores noise floor and gain and can be re-run
- [ ] Calibration reports failure clearly if it cannot hear the test chord
- [ ] Live meter shows the right dominant bins when a single chord is played on the piano
- [ ] Wake lock is held while the meter screen is open and released when leaving it
- [ ] Offline test runs a WAV fixture through the pipeline and asserts the dominant pitch classes per clip
- [ ] Fixture recording instructions are documented so more clips can be added later
