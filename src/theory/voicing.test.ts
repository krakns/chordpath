import { describe, expect, it } from 'vitest'
import { parseChord } from './chord'
import { shellVoicing, triadVoicing } from './voicing'

function chordOf(symbol: string) {
  const result = parseChord(symbol)
  if (!result.ok) throw new Error(result.error)
  return result.chord
}

describe('triadVoicing', () => {
  const c = chordOf('C')

  it('root position is root, third, fifth ascending', () => {
    expect(triadVoicing(c, 0, 4)).toEqual([60, 64, 67])
  })

  it('first inversion moves the root up an octave', () => {
    expect(triadVoicing(c, 1, 4)).toEqual([64, 67, 72])
  })

  it('second inversion moves root and third up an octave', () => {
    expect(triadVoicing(c, 2, 4)).toEqual([67, 72, 76])
  })

  it('shifts a full octave (12 semitones) between adjacent octave numbers', () => {
    expect(triadVoicing(c, 0, 5)).toEqual([72, 76, 79])
  })

  it('uses the minor triad shape for a minor chord', () => {
    expect(triadVoicing(chordOf('Cm'), 0, 4)).toEqual([60, 63, 67])
  })
})

describe('shellVoicing', () => {
  it('returns root, third, seventh for a dominant seventh', () => {
    expect(shellVoicing(chordOf('C7'), 4)).toEqual([60, 64, 70])
  })

  it('returns root, third, sixth when there is no seventh', () => {
    expect(shellVoicing(chordOf('C6'), 4)).toEqual([60, 64, 69])
  })

  it('falls back to the fifth for a plain triad', () => {
    expect(shellVoicing(chordOf('C'), 4)).toEqual([60, 64, 67])
  })

  it('uses the major seventh for a maj7 chord', () => {
    expect(shellVoicing(chordOf('Cmaj7'), 4)).toEqual([60, 64, 71])
  })
})
