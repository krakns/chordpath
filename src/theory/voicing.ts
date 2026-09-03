import { type Midi, midiForPc } from './pitch'
import { QUALITY_BASE_INTERVALS } from './chordTokens'
import type { Chord, Seventh } from './chord'

export type Voicing = Midi[]

const SEVENTH_INTERVAL: Record<Seventh, number> = { maj7: 11, min7: 10, dim7: 9 }

function invert(notes: Midi[], times: number): Voicing {
  let result = notes
  for (let i = 0; i < times; i++) {
    const [lowest, ...rest] = result
    result = [...rest, lowest + 12]
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
  const top = chord.seventh ? SEVENTH_INTERVAL[chord.seventh] : chord.intervals.includes(9) ? 9 : fifth

  const rootMidi = midiForPc(chord.root, octave)
  return [rootMidi, rootMidi + third, rootMidi + top]
}
