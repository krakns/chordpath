# Listener fixtures

The WAVs here are synthetic. `node scripts/make-fixtures.mjs` regenerates them byte for byte. They exist so `chromaOf` and the calibration reducer can run in Vitest with no browser. Replace them with real recordings once the phone sits on the piano.

## Format

- WAV, PCM 16-bit, 44.1 kHz, mono. `src/listener/wav.ts` reads only PCM16 and averages channels, so stereo works but mono is smaller.
- Keep clips between 2 and 4 seconds. The tests slice 4096-sample frames (about 93 ms) with a 50 percent hop and average the chroma.
- Peak below 0 dBFS. Do not normalize or apply effects. Do not use the phone's voice memo enhancement. On iOS, Voice Memos records m4a; convert with `ffmpeg -i clip.m4a -ac 1 -ar 44100 -sample_fmt s16 clip.wav`.

## Naming

`<what>-<detail>.wav`, lowercase, hyphens. The test file names the fixture and the expected pitch classes, so a new clip needs a new `it(...)` in `src/listener/chroma.test.ts` or `calibration.test.ts`.

| File | What to play |
| --- | --- |
| `c-major-chord.wav` | C4 E4 G4 together, hold for the whole clip |
| `f-sharp-major-chord.wav` | F#4 A#4 C#5 together, hold for the whole clip |
| `silence.wav` | Nothing. Room noise with the piano powered on |
| `c-major-scale.wav` | C4 to C5 ascending, one note every 0.4 s, no pedal |

## Recording from the piano

1. Put the phone where it will sit during practice, on the piano's music stand or the case lid, about an arm's length from the speakers.
2. Set the piano to a plain piano voice, no reverb, at practice volume.
3. Record one clip per row above. Start recording, wait half a second, play, keep holding until the clip ends.
4. Convert to mono PCM16 44.1 kHz and drop the file here under the same name to replace the synthetic clip, or under a new name to add one.
5. Run `npm test`. If the top bins differ from the sheet, the recording is the fixture and the thresholds in `src/listener/calibration.ts` are what to tune.
