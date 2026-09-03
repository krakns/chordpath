import { describe, expect, it } from 'vitest'
import { parseChord, pitchClasses } from './chord'
import type { PitchClass } from './pitch'

function pcs(symbol: string): PitchClass[] {
  const result = parseChord(symbol)
  if (!result.ok) throw new Error(`expected "${symbol}" to parse: ${result.error}`)
  return [...pitchClasses(result.chord)].sort((a, b) => a - b)
}

describe('parseChord', () => {
  const cases: Array<[string, PitchClass[]]> = [
    ['C', [0, 4, 7]],
    ['Cm', [0, 3, 7]],
    ['C-', [0, 3, 7]],
    ['Cmin', [0, 3, 7]],
    ['Cmaj7', [0, 4, 7, 11]],
    ['CM7', [0, 4, 7, 11]],
    ['CΔ7', [0, 4, 7, 11]],
    ['C7', [0, 4, 7, 10]],
    ['Cm7', [0, 3, 7, 10]],
    ['Cdim', [0, 3, 6]],
    ['C°', [0, 3, 6]],
    ['Cm7b5', [0, 3, 6, 10]],
    ['Cø7', [0, 3, 6, 10]],
    ['Cdim7', [0, 3, 6, 9]],
    ['Caug', [0, 4, 8]],
    ['C+', [0, 4, 8]],
    ['Csus4', [0, 5, 7]],
    ['Csus2', [0, 2, 7]],
    ['Cadd9', [0, 2, 4, 7]],
    ['C2', [0, 2, 4, 7]],
    ['C6', [0, 4, 7, 9]],
    ['C9', [0, 2, 4, 7, 10]],
    ['C13', [0, 2, 4, 7, 9, 10]],
    ['C7b9', [0, 1, 4, 7, 10]],
    ['C7#11', [0, 4, 6, 7, 10]],
    ['G/B', [2, 7, 11]],
    ['C/E', [0, 4, 7]],
  ]

  it.each(cases)('parses %s to pitch classes %j', (symbol, expected) => {
    expect(pcs(symbol)).toEqual(expected)
  })

  it('spells the root and quality on a valid parse', () => {
    const result = parseChord('Cmaj7')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.chord.root).toBe(0)
    expect(result.chord.rootName).toBe('C')
    expect(result.chord.quality).toBe('maj')
    expect(result.chord.intervals).toEqual([0, 4, 7, 11])
    expect(result.chord.bass).toBeNull()
    expect(result.chord.bassName).toBeNull()
  })

  it('captures the bass note for a slash chord', () => {
    const result = parseChord('G/B')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.chord.bass).toBe(11)
    expect(result.chord.bassName).toBe('B')
  })

  it('never throws on garbage input', () => {
    expect(() => parseChord('')).not.toThrow()
    expect(() => parseChord('xyz')).not.toThrow()
    expect(() => parseChord('Cqq7')).not.toThrow()
  })

  it('rejects an empty symbol', () => {
    const result = parseChord('')
    expect(result.ok).toBe(false)
  })

  it('rejects an unrecognized root', () => {
    const result = parseChord('H7')
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toMatch(/root/i)
  })

  it('names the unknown token in the error', () => {
    const result = parseChord('Cqq7')
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toContain('qq7')
  })

  it('rejects a malformed bass note', () => {
    const result = parseChord('C/H')
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toMatch(/bass/i)
  })
})
