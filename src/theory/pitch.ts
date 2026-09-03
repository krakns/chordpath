export type PitchClass = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
export type Midi = number
export type NoteName = string

export function mod12(n: number): PitchClass {
  return (((n % 12) + 12) % 12) as PitchClass
}

export const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const
export type Letter = (typeof LETTERS)[number]

export const NATURAL_PC: Record<Letter, PitchClass> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
}

const SHARP_NAMES: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const FLAT_NAMES: NoteName[] = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

/**
 * Sharp/flat accidental preference per key center, following the circle of
 * fifths (the side with fewer accidentals wins; F#/Gb defaults to sharp).
 */
export const KEY_PREFERENCE: Record<PitchClass, 'sharp' | 'flat'> = {
  0: 'sharp',
  1: 'flat',
  2: 'sharp',
  3: 'flat',
  4: 'sharp',
  5: 'flat',
  6: 'sharp',
  7: 'sharp',
  8: 'flat',
  9: 'sharp',
  10: 'flat',
  11: 'sharp',
}

export function spellPitchClass(pc: PitchClass, preference: 'sharp' | 'flat'): NoteName {
  return preference === 'sharp' ? SHARP_NAMES[pc] : FLAT_NAMES[pc]
}

/** A pitch class's spelling in its own key (no transposition target given). */
export function defaultSpelling(pc: PitchClass): NoteName {
  return spellPitchClass(pc, KEY_PREFERENCE[pc])
}

export function midiForPc(pc: PitchClass, octave: number): Midi {
  return (octave + 1) * 12 + pc
}
