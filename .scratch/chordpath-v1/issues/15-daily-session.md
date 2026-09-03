# 15: Daily session

**What to build:** The Start button on the home screen builds today's Session: about 5 minutes of drills (the lowest unpassed Church rung in a song key, and the current Jazz rung in the month's key), 10 minutes on one song at its current Style rung, and 5 minutes of quiz or free play with the click. Each block shows its target time and can be skipped or swapped for another block of the same kind. Finishing a Session appends to a practice log (date, blocks, passes). A Log screen lists past sessions. Session building is a pure curriculum function over progress, songs, and the date.

**Blocked by:** 09 Styles on a song, 12 Jazz beginner rungs, 13 Theory quiz

**Status:** ready-for-agent

- [ ] Session builder tests: given progress states and song lists, the plan picks the expected drills, song, and rung
- [ ] With no songs, the session substitutes a Church rung drill in the month's key for the song block
- [ ] Skip and swap work per block and the log records what was actually done
- [ ] The Log screen lists sessions newest first with passes gained
