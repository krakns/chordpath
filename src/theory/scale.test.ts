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

  // Db and Ab minor need a double flat: strict letter sequencing from a flat tonic forces it.
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

  const TABLES = [
    ['major', MAJOR_DEGREES],
    ['natural-minor', NATURAL_MINOR_DEGREES],
  ] as const
  for (const [mode, table] of TABLES) {
    for (const [key, degrees] of Object.entries(table)) {
      const pc = Number(key) as PitchClass
      degrees.forEach((expected, index) => {
        it(`degree ${index + 1} of key ${pc} ${mode} is ${expected}`, () => {
          expect(degreeOf(pc, mode, String(index + 1))).toBe(expected)
        })
      })
    }
  }

  it('reads an accidental against the major scale in any mode', () => {
    expect(degreeOf(9, 'natural-minor', 'b6')).toBe('F')
    expect(degreeOf(9, 'natural-minor', '6')).toBe('F')
    expect(degreeOf(0, 'dorian', 'b3')).toBe('Eb')
    expect(degreeOf(0, 'dorian', '3')).toBe('Eb')
    expect(degreeOf(0, 'dorian', 'b7')).toBe('Bb')
  })

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
