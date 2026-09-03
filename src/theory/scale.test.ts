import { describe, expect, it } from 'vitest'
import { degreeOf, scale } from './scale'
import type { PitchClass } from './pitch'

describe('scale', () => {
  it('builds the major scale of C as all naturals', () => {
    expect(scale(0, 'major')).toEqual([0, 2, 4, 5, 7, 9, 11])
  })

  it('builds the natural minor scale of A as all naturals', () => {
    expect(scale(9, 'natural-minor')).toEqual([9, 11, 0, 2, 4, 5, 7])
  })

  it('builds all seven modes of C starting on the same root', () => {
    expect(scale(0, 'dorian')).toEqual([0, 2, 3, 5, 7, 9, 10])
    expect(scale(0, 'phrygian')).toEqual([0, 1, 3, 5, 7, 8, 10])
    expect(scale(0, 'lydian')).toEqual([0, 2, 4, 6, 7, 9, 11])
    expect(scale(0, 'mixolydian')).toEqual([0, 2, 4, 5, 7, 9, 10])
    expect(scale(0, 'locrian')).toEqual([0, 1, 3, 5, 6, 8, 10])
  })
})

describe('degreeOf', () => {
  // Expected spellings for every key's major scale, degrees 1-7.
  const MAJOR_DEGREES: Record<PitchClass, string[]> = {
    0: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    1: ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'],
    2: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
    3: ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],
    4: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
    5: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
    6: ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'],
    7: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
    8: ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'],
    9: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
    10: ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
    11: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
  }

  // Expected spellings for every key's natural minor scale, degrees 1-7. Db
  // and Ab minor (keys 1 and 8) carry a double flat: their tonic is itself
  // spelled with a flat, and strict letter sequencing from that tonic forces
  // one degree two semitones below its natural letter.
  const NATURAL_MINOR_DEGREES: Record<PitchClass, string[]> = {
    0: ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'],
    1: ['Db', 'Eb', 'Fb', 'Gb', 'Ab', 'Bbb', 'Cb'],
    2: ['D', 'E', 'F', 'G', 'A', 'Bb', 'C'],
    3: ['Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'Db'],
    4: ['E', 'F#', 'G', 'A', 'B', 'C', 'D'],
    5: ['F', 'G', 'Ab', 'Bb', 'C', 'Db', 'Eb'],
    6: ['F#', 'G#', 'A', 'B', 'C#', 'D', 'E'],
    7: ['G', 'A', 'Bb', 'C', 'D', 'Eb', 'F'],
    8: ['Ab', 'Bb', 'Cb', 'Db', 'Eb', 'Fb', 'Gb'],
    9: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    10: ['Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'Ab'],
    11: ['B', 'C#', 'D', 'E', 'F#', 'G', 'A'],
  }

  for (const [key, degrees] of Object.entries(MAJOR_DEGREES)) {
    const pc = Number(key) as PitchClass
    degrees.forEach((expected, index) => {
      it(`degree ${index + 1} of key ${pc} major is ${expected}`, () => {
        expect(degreeOf(pc, 'major', String(index + 1))).toBe(expected)
      })
    })
  }

  for (const [key, degrees] of Object.entries(NATURAL_MINOR_DEGREES)) {
    const pc = Number(key) as PitchClass
    degrees.forEach((expected, index) => {
      it(`degree ${index + 1} of key ${pc} natural minor is ${expected}`, () => {
        expect(degreeOf(pc, 'natural-minor', String(index + 1))).toBe(expected)
      })
    })
  }

  it('spells b6 of G as Eb, not the enharmonic D#', () => {
    expect(degreeOf(7, 'major', 'b6')).toBe('Eb')
  })

  it('spells #4 of C as F#', () => {
    expect(degreeOf(0, 'major', '#4')).toBe('F#')
  })

  it('spells b7 of C as Bb', () => {
    expect(degreeOf(0, 'major', 'b7')).toBe('Bb')
  })
})
