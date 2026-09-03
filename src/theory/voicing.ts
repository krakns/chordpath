import { type Midi, midiForPc } from './pitch'
import { QUALITY_BASE_INTERVALS } from './chordTokens'
import type { Chord } from './chord'

export type Voicing = Midi[]

/** Rotates the lowest note to the top, an octave up, `times` times. */
function invert(notes: Midi[], times: number): Voicing {
  const result = [...notes]
  for (let i = 0; i < times; i++) {
    const lowest = result.shift()!
    result.push(lowest + 12)
  }
  return result
}

export function triadVoicing(chord: Chord, inversion: 0 | 1 | 2, octave: number): Voicing {
  const triadIntervals = QUALITY_BASE_INTERVALS[chord.quality]
  const rootPosition = triadIntervals.map((interval) => midiForPc(chord.root, octave) + interval)
  return invert(rootPosition, inversion)
}

/** Root, 3rd, and 7th (or 6th if there's no 7th, or 5th for a plain triad). */
export function shellVoicing(chord: Chord, octave: number): Voicing {
  const [, third, fifth] = QUALITY_BASE_INTERVALS[chord.quality]
  const hasSeventh = chord.intervals.includes(10) || chord.intervals.includes(11)
  const hasSixth = chord.intervals.includes(9)
  const seventh = chord.intervals.includes(11) ? 11 : chord.intervals.includes(10) ? 10 : undefined
  const top = hasSeventh ? seventh! : hasSixth ? 9 : fifth

  const rootMidi = midiForPc(chord.root, octave)
  return [rootMidi, rootMidi + third, rootMidi + top]
}
