import { LETTERS, NATURAL_PC, type Letter, type NoteName, type PitchClass, defaultSpelling, mod12 } from './pitch'

export type Mode =
  | 'major'
  | 'natural-minor'
  | 'dorian'
  | 'phrygian'
  | 'lydian'
  | 'mixolydian'
  | 'locrian'

/** Each mode's degrees as semitone offsets from the root, index 0 = degree 1. */
export const MODE_INTERVALS: Record<Mode, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  'natural-minor': [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
}

export function scale(root: PitchClass, mode: Mode): PitchClass[] {
  return MODE_INTERVALS[mode].map((interval) => mod12(root + interval))
}

const DEGREE_RE = /^(bb|b|##|#)?([1-7])$/
const ACCIDENTAL_SEMITONES: Record<string, number> = { '': 0, '#': 1, '##': 2, b: -1, bb: -2 }

/**
 * A named scale degree ('4', 'b6', '#4', '7'), spelled correctly for the key:
 * the accidental prefix alters the mode's own degree, and the result keeps
 * that degree's letter (b6 of G is Eb, not the enharmonic D#).
 */
export function degreeOf(key: PitchClass, mode: Mode, degree: string): NoteName {
  const match = DEGREE_RE.exec(degree)
  if (!match) throw new Error(`Invalid scale degree "${degree}"`)
  const [, accidental, digits] = match
  const degreeNumber = Number(digits)

  const targetPc = mod12(key + MODE_INTERVALS[mode][degreeNumber - 1] + ACCIDENTAL_SEMITONES[accidental ?? ''])

  const rootLetter = defaultSpelling(key)[0] as Letter
  const rootLetterIndex = LETTERS.indexOf(rootLetter)
  const targetLetter = LETTERS[(rootLetterIndex + degreeNumber - 1) % 7]
  const naturalPc = NATURAL_PC[targetLetter]

  const diff = ((targetPc - naturalPc + 18) % 12) - 6
  const symbol = diff === 0 ? '' : diff > 0 ? '#'.repeat(diff) : 'b'.repeat(-diff)
  return targetLetter + symbol
}
