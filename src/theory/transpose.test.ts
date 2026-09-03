import { describe, expect, it } from 'vitest'
import { parseChord } from './chord'
import { transposeChord } from './transpose'

function chordOf(symbol: string) {
  const result = parseChord(symbol)
  if (!result.ok) throw new Error(result.error)
  return result.chord
}

describe('transposeChord', () => {
  it('moves the root and rebuilds the symbol', () => {
    const chord = transposeChord(chordOf('Cmaj7'), 2)
    expect(chord.root).toBe(2)
    expect(chord.rootName).toBe('D')
    expect(chord.symbol).toBe('Dmaj7')
    expect(chord.intervals).toEqual([0, 4, 7, 11])
  })

  it('moves the bass note of a slash chord', () => {
    const chord = transposeChord(chordOf('G/B'), 2)
    expect(chord.rootName).toBe('A')
    expect(chord.bassName).toBe('C#')
    expect(chord.symbol).toBe('A/C#')
  })

  it('re-spells for a given target key', () => {
    const chord = transposeChord(chordOf('C7'), 1, 8) // Ab major, flat side
    expect(chord.rootName).toBe('Db')
    expect(chord.symbol).toBe('Db7')
  })

  it('wraps root and bass around the octave', () => {
    const chord = transposeChord(chordOf('C/E'), -1)
    expect(chord.rootName).toBe('B')
    expect(chord.bassName).toBe('D#')
  })

  it('round-trips back to the original pitch classes after +7 then -7', () => {
    const original = chordOf('Fm7b5')
    const roundTripped = transposeChord(transposeChord(original, 7), -7)
    expect(roundTripped.root).toBe(original.root)
    expect(roundTripped.intervals).toEqual(original.intervals)
  })

  it('round-trips through all twelve semitones back to the start', () => {
    const original = chordOf('Bb9')
    let chord = original
    for (let i = 0; i < 12; i++) chord = transposeChord(chord, 1)
    expect(chord.root).toBe(original.root)
    expect(chord.rootName).toBe(original.rootName)
  })
})
