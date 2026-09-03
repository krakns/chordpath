# chordpath spec

Status: ready-for-agent. Written 2026-09-03 from the grilling session.

## Glossary

- **Track.** One of two curricula: Church or Jazz. Each is a ladder of Rungs.
- **Rung.** One step on a Track's ladder. A Rung names a Drill type, a Key policy, and a pass condition. Passing a Rung in Wait mode unlocks Flow mode for it; passing in Flow mode unlocks the next Rung.
- **Drill.** A short generated exercise: a scale, a chord set, a progression, or an improv frame. Drills are generated from theory, never copied from a course.
- **Style.** One of Charlie Tran's four ways to play a song: (1) melody plus bass, (2) top note plus left-hand comping, (3) right-hand comping plus left-hand bass, (4) spread voicings. Styles are Rungs on the Church track applied to a Song.
- **Song.** A chart imported by the user: title, key, sections, bars, and one chord per beat slot. Lives only on the device.
- **Chart.** The bar-by-bar chord grid of a Song after import.
- **Bar Window.** The span of audio the Listener analyzes for one bar. Grading happens per Bar Window.
- **Verdict.** The Listener's decision for one Bar Window: pass, fail, or silent.
- **Wait mode.** The app holds on a bar until the Verdict is pass. No click.
- **Flow mode.** The click keeps going. Every bar gets a Verdict. Score is shown at the end.
- **Session.** One daily practice run of about 20 minutes: drills, one Song at its current Rung, quiz or free play.
- **Listener.** The mic pipeline: audio in, chroma out, Verdict out.
- **Chroma.** A 12-bin vector of energy per pitch class for one analysis frame.

## Problem Statement

I am a far beginner at piano. I read chord symbols roughly. I want to play chord piano at church and eventually play jazz. The two plans I like, Piano With Jonny's 1-year plan and Charlie Tran's stock-vocabulary framework, are PDFs and videos. Nothing tells me whether what I just played was right, and nothing sequences church playing before jazz. The mic-based piano apps that exist are pop and classical, cannot grade chords reliably, and have no jazz curriculum. The jazz drill apps that exist require a MIDI cable and are drills only, with no year-long path and no church material.

## Solution

A web app I open on my iPhone or iPad, placed on my digital piano. It shows me one drill or one bar of one of my own songs at a time, listens through the mic, and tells me per bar whether the chord I played contains the right notes. It moves me up a ladder: church triads first, then inversions, slash and sus chords, then Tran's four styles over my church songs, alongside Jonny's beginner jazz pillars in a rotating key. It keeps a click and a generated bass line in my earbud, tracks which drills I have passed in which keys, and quizzes me on theory when I am away from the piano. My songs come from my own PDF charts and never leave the device.

## User Stories

### Setup and calibration

1. As a practicer, I want to open the app from my iPad or iPhone home screen, so that it feels like an app and not a browser tab.
2. As a practicer, I want the app to ask for the mic once and remember the choice, so that I do not fight permissions every session.
3. As a practicer, I want a 30-second calibration on first run that measures room noise and checks it can hear a chord I play, so that I know the mic placement works before I rely on it.
4. As a practicer, I want to re-run calibration from settings, so that I can fix detection when I move the piano or the device.
5. As a practicer, I want the screen to stay awake during a session, so that the iPad does not lock mid-drill.
6. As a practicer, I want to pick which ear gets the click and bass and set their volume, so that I can hear the piano and the click together.
7. As a practicer, I want a click-only fallback through the speaker, so that I can still practice without earbuds.

### Church track

8. As a church pianist, I want to play the triads of a song's key with the root in my left hand, so that I can hold down a simple chart on Sunday.
9. As a church pianist, I want to drill triad inversions so that my right hand moves the least between chords.
10. As a church pianist, I want to drill slash chords with the named bass note in the left hand, so that I can play the bass movement worship charts depend on.
11. As a church pianist, I want to drill sus2, sus4, and add9 chords, so that I can play the colors on modern worship charts.
12. As a church pianist, I want to drill the common worship progressions (1-5-6-4, 6-4-1-5, 1-4-6-5) in every key my songs use, so that my hands know the moves before the song.
13. As a church pianist, I want to play a song in Style 1 (melody or top note plus bass), so that I can outline the tune.
14. As a church pianist, I want to play a song in Style 2 (top note plus left-hand comping), so that I can play with a singer.
15. As a church pianist, I want to play a song in Style 3 (right-hand comping plus left-hand bass), so that I can play behind a band or lead vocal.
16. As a church pianist, I want to play a song in Style 4 (spread voicings with 7ths), so that I can play solo piano intros and pads.
17. As a church pianist, I want the comping rhythm (Charleston, reverse Charleston, Red Garland, straight eighths for worship) shown on screen with the click, so that I copy a real pattern even though the app does not grade it.
18. As a church pianist, I want the app to suggest a comping rhythm suited to the song's feel, so that worship songs get straight patterns and jazz tunes get swing.

### Jazz track

19. As a jazz learner, I want a key of the month that rotates through all 12 keys, so that I follow Jonny's plan.
20. As a jazz learner, I want to play the major and natural minor scale of the month's key up and down while the app checks each note in order, so that I know I played it right.
21. As a jazz learner, I want to drill major and minor triads in all inversions in the month's key, so that I build Jonny's pillar 2.
22. As a jazz learner, I want to drill chord shells (root, 3rd, 7th) on a 2-5-1 in the month's key, so that I build Jonny's pillar 3 and Tran's essential tones.
23. As a jazz learner, I want to play a 2-5-1 while the app scores how many of my notes on each bar are chord tones, so that I practice chord-tone targeting.
24. As a jazz learner, I want a half-note bass drill (roots and fifths, then chromatic approaches) over a 2-5-1, so that I build Tran's bass vocabulary.
25. As a jazz learner, I want to see intermediate and advanced rungs listed but locked, so that I know where the path goes.

### Songs

26. As a practicer, I want to import a text PDF chord chart, so that my church set list becomes practice material.
27. As a practicer, I want the importer to keep chords, section labels, bar counts, and a few-word lyric cue per line, so that I can place myself in the song.
28. As a practicer, I want to review and correct the imported chart bar by bar before saving, so that a bad parse does not become a bad drill.
29. As a practicer, I want to type a chart by hand, section by section, so that scanned PDFs and songs I only know by ear still work.
30. As a practicer, I want to transpose a song to any key and have the drills follow, so that I can match the worship leader's key.
31. As a practicer, I want to set a song's tempo and feel (straight or swing), so that the click and bass fit the song.
32. As a practicer, I want to delete a song, so that old set lists do not clutter the list.
33. As a practicer, I want my songs stored only on this device, so that copyrighted charts never go anywhere.
34. As a practicer, I want to export all songs and progress to a file and import that file on another device, so that I never lose my data and can move from phone to iPad.

### Listening and grading

35. As a practicer, I want the app to tell me per bar whether the chord I played contained the chord's notes, so that I get feedback while my hands are still on the keys.
36. As a practicer, I want slash chords to fail if the named bass note is missing, so that the bass movement is checked.
37. As a practicer, I want inversions shown as a diagram but not graded, so that the mic's limits do not block me.
38. As a practicer, I want scale drills graded note by note in order with no timing, so that I can play them slowly at first.
39. As a practicer, I want a silent bar to read as "nothing heard" rather than "wrong", so that I know when the mic is the problem.
40. As a practicer, I want a live meter showing which pitch classes the app hears, so that I can debug a failing bar myself.
41. As a practicer, I want Wait mode on any new rung, so that the app holds each bar until I get it.
42. As a practicer, I want Flow mode unlocked after I pass a rung in Wait mode, so that I then practice in time.
43. As a practicer, I want a per-bar score list at the end of a Flow run, so that I see which bars I missed.
44. As a practicer, I want a rung to pass when I clear a Flow run at a set bar accuracy, so that passing means playing in time.

### Session and progress

45. As a practicer, I want a Start Session button that builds today's 20 minutes (5 drills, 10 song, 5 quiz or free), so that I do not plan.
46. As a practicer, I want to skip or swap any session block, so that the plan bends to my time.
47. As a practicer, I want to see per drill per key whether I have passed it in Wait and in Flow, so that I know my coverage.
48. As a practicer, I want each song to show its current Style rung, so that I know what to practice on it next.
49. As a practicer, I want no streaks, badges, or leaderboards, so that the app stays a tool.
50. As a practicer, I want a practice log of sessions with dates and what was passed, so that I can see progress over months.

### Theory quiz

51. As a learner, I want a scale-degree quiz (what is the b6 of G) with no mic, so that I can drill theory anywhere.
52. As a learner, I want a chord-spelling quiz (spell Ebmaj7), so that chord symbols become notes fast.
53. As a learner, I want a chord-symbol reading quiz (which of these is a slash chord, what does sus4 replace), so that worship charts stop confusing me.
54. As a learner, I want the quiz to weight toward keys and chords from my songs and the month's key, so that it stays relevant.
55. As a learner, I want quiz history tracked per item, so that missed items come back sooner.

### Reference

56. As a practicer, I want a chord diagram for any chord symbol showing the keys to press for a chosen voicing, so that I can look up a chord I do not know.
57. As a practicer, I want a page that explains each Style and each comping rhythm in a few sentences, so that the ladder is not a mystery.

## Implementation Decisions

### Platform and hosting

- Static web app, installable to the iOS home screen, hosted on GitHub Pages from a public repo. No backend. HTTPS is required for the mic and GitHub Pages provides it.
- Stack: Vite, TypeScript, React, Tone.js for click and bass synthesis, Web Audio AudioWorklet for chroma analysis, pdf.js for text extraction, IndexedDB for all persistence.
- Responsive layout for iPhone portrait and iPad landscape. The practice screen shows the current bar large enough to read from the music stand.
- The mic starts from a user tap because iOS requires a gesture. The app requests the screen wake lock at session start.
- Song data and progress never enter the repo. The repo holds code, generated fixtures, and public-domain samples only.

### Modules

- **theory.** Pure functions. Chord symbol parsing (triads, sus2, sus4, add9, 6, maj7, m7, 7, dim, m7b5, slash bass, extensions parsed but reduced to pitch classes for grading). Chord to pitch-class set. Scale and mode construction. Scale degree lookup. Transposition. Voicing generators: root-position and inverted triads, shells, spread voicings by top note at the functional level. Drill generators take a key and a rung and return a Chart.
- **curriculum.** Pure functions over progress state. Defines both Tracks as ordered Rungs. Computes the key of the month from a start date. Builds a Session from progress, songs, and the date. Decides pass conditions and unlocks. Weighted item selection for the quiz.
- **listener.** The mic pipeline. AudioWorklet computes a chroma vector per frame (around 20 frames per second). A grader consumes chroma frames for a Bar Window and returns a Verdict. Pitch-class matching: a bar passes when the expected pitch classes together carry a large majority of chroma energy across the window's active frames and each expected class is present above a threshold in at least some frames. A slash chord adds the bass class to the required set. Silence is a Verdict of its own. A monophonic pitch tracker (autocorrelation-based) handles scale drills, producing a note sequence that is matched in order against the expected scale.
- **transport.** Tone.js scheduling of click and generated bass, in Flow mode only. Bass is roots and fifths on beats 1 and 3 for straight feel, walking roots and approaches for swing, derived from the Chart. Transport emits bar boundaries that define Bar Windows for the listener.
- **importer.** pdf.js text extraction, then a parser that detects chord lines above lyric lines, section headers, and bar counts from chord spacing. Produces a Chart plus lyric cues for review. Manual entry produces the same shape.
- **store.** IndexedDB wrapper for songs, progress, quiz history, calibration, and settings. Export and import as one JSON file.
- **ui.** React screens: Home, Session, Drill, Song, Import review, Quiz, Progress, Reference, Settings. The UI is thin and calls the modules above.

### Practice screen behaviour

- Wait mode: show the current bar's chord and a keyboard diagram, listen until pass, then advance. A "skip bar" button exists for stuck bars.
- Flow mode: count-in of one bar, then the click runs. Verdicts appear per bar as the run goes. At the end a bar-by-bar list appears with pass, fail, or silent.
- A live 12-bin meter is visible on the practice screen at all times.
- Rung pass rule: a Wait-mode run with every bar passed unlocks Flow mode; a Flow-mode run with at least 80% of bars passed passes the Rung. Both numbers are curriculum constants.

### Church track rungs

1. Diatonic triads, root position, key of a chosen song.
2. Triad inversions, nearest-voicing movement through the song's progression.
3. Slash chords and sus chords from the song.
4. Common worship progressions in the song's key.
5. Style 1 on the song.
6. Style 2 on the song.
7. Style 3 on the song.
8. Style 4 on the song, functional-level spread voicings with 7ths.

Rungs 1 to 4 are per key. Rungs 5 to 8 are per song.

### Jazz track rungs, beginner tier

1. Major and natural minor scale of the month's key, graded note by note.
2. Major and minor triads in all inversions, month's key.
3. Chord shells on 2-5-1, month's key.
4. Half-note bass on 2-5-1, month's key.
5. Chord-tone targeting over 2-5-1, month's key, scored as chord-tone ratio per bar.

Intermediate and advanced tiers are listed as locked placeholders with names only.

### Data shapes

- Song: id, title, originalKey, currentKey, tempo, feel, sections (name, bars), bars (chords per beat slot, lyric cue), styleRung, createdAt.
- Progress: per rung per key: waitPassedAt, flowPassedAt, bestFlowAccuracy. Per song: styleRung.
- Quiz history: per item id: attempts, misses, lastSeenAt.
- Calibration: noiseFloor, gain, lastRunAt.
- Settings: clickEar, clickVolume, bassVolume, speakerFallback, jazzStartDate.

## Testing Decisions

A good test feeds a module real input at its boundary and checks visible output. It never inspects internal state or mocks a collaborator that could run for real.

Three seams, highest possible:

1. **Audio fixture to Verdict.** Recorded WAV clips of a real digital piano through a phone mic (chords, slash chords, wrong chords, silence, scales) run through the listener offline via an OfflineAudioContext. Assert the Verdict per bar. This covers chroma analysis, grading thresholds, and the pitch tracker in one seam. Fixtures are recorded from the user's own piano during calibration development and committed to the repo.
2. **PDF fixture to Chart.** Sample text PDFs (public-domain hymns formatted like worship charts, plus the user's real sample kept out of the repo) run through the importer. Assert sections, bar counts, chords per slot, and lyric cues.
3. **Progress state to Session and unlocks.** Given a progress state, a song list, and a date, assert the Session plan, the key of the month, which rungs are unlocked, and what passes after a given run result. Theory functions are tested through this seam by asserting generated drill Charts, with a small number of direct theory tests for chord parsing edge cases.

The UI is tested by hand on the iPad. Transport timing is checked by hand with the click against a metronome.

No prior art exists. This is a new repo. Test runner is Vitest.

## Out of Scope

- MIDI input of any kind. The design allows adding it later as a second Listener.
- Grading inversions, voicings, or octaves through the mic.
- Grading comping rhythm or timing within a bar.
- Full polyphonic transcription models on device.
- Intermediate and advanced jazz content beyond locked placeholders.
- Scanned PDF OCR. Scans are entered by hand.
- Full lyric display. Only short cues.
- Accounts, sync, sharing, payments, streaks, badges.
- Reproducing any Piano With Jonny or Charlie Tran material. Structure only, exercises generated from theory.
- Melody grading in Style 1 and Style 2. The top note is shown, the chord tones are graded.

## Further Notes

- The user's digital piano is played through its own speakers, which gives the mic a clean tone. Detection thresholds are tuned to that instrument first.
- The PDF sample is due 2026-09-04. If it turns out to be a scan, the importer ships as manual entry only in v1 and PDF parsing moves to a later ticket.
- Jonny May's plan drives the jazz key rotation and pillar order. Charlie Tran's stock vocabulary and four styles drive the church ladder's later rungs and the comping and bass vocabulary. Both are cited in the Reference screen as sources without reproducing their materials.
- Pitch-class matching is deliberately forgiving. Its job is to catch wrong chords, not to judge voicing. If it proves too lenient on the user's piano, the first tuning knob is requiring each expected class above threshold in more frames, not adding a transcription model.
