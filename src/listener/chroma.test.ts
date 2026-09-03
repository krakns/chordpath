// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { chromaOf, pitchClassOf, rms, type Chroma } from './chroma'
import { fixture } from './fixtures/load'

const FRAME = 4096

function averageChroma(samples: Float32Array, sampleRate: number): Chroma {
  const sum = new Float32Array(12)
  let frames = 0
  for (let at = 0; at + FRAME <= samples.length; at += FRAME / 2) {
    const c = chromaOf(samples.subarray(at, at + FRAME), sampleRate)
    for (let i = 0; i < 12; i++) sum[i] += c[i]
    frames++
  }
  if (frames > 0) for (let i = 0; i < 12; i++) sum[i] /= frames
  return sum
}

function topBins(chroma: Chroma, count: number): number[] {
  return [...chroma.keys()].sort((a, b) => chroma[b] - chroma[a]).slice(0, count)
}

describe('pitchClassOf', () => {
  it('maps middle C, A440 and their neighbours', () => {
    expect(pitchClassOf(261.63)).toBe(0)
    expect(pitchClassOf(440)).toBe(9)
    expect(pitchClassOf(466.16)).toBe(10)
    expect(pitchClassOf(65.41)).toBe(0)
  })
})

describe('chromaOf', () => {
  it('puts a pure A440 sine in the A bin and sums to one', () => {
    const frame = new Float32Array(FRAME)
    for (let i = 0; i < FRAME; i++) frame[i] = Math.sin((2 * Math.PI * 440 * i) / 44100)
    const c = chromaOf(frame, 44100)
    expect(topBins(c, 1)).toEqual([9])
    expect(c.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 5)
  })

  it('keeps a chord of pure sines inside its three pitch classes', () => {
    for (const freqs of [
      [261.63, 329.63, 392],
      [130.81, 164.81, 196],
    ]) {
      const frame = new Float32Array(FRAME)
      for (let i = 0; i < FRAME; i++) for (const hz of freqs) frame[i] += 0.2 * Math.sin((2 * Math.PI * hz * i) / 48000)
      const c = chromaOf(frame, 48000)
      expect(topBins(c, 3).sort((a, b) => a - b)).toEqual([0, 4, 7])
      expect(c[0] + c[4] + c[7]).toBeGreaterThan(0.9)
    }
  })

  it('returns all zeros for a silent frame', () => {
    const c = chromaOf(new Float32Array(FRAME), 44100)
    expect([...c]).toEqual(new Array(12).fill(0))
  })

  it('accepts a frame that is not a power of two', () => {
    const frame = new Float32Array(3000)
    for (let i = 0; i < frame.length; i++) frame[i] = Math.sin((2 * Math.PI * 261.63 * i) / 44100)
    expect(topBins(chromaOf(frame, 44100), 1)).toEqual([0])
  })
})

describe('fixtures', () => {
  it('c-major-chord.wav: top three bins are C, E, G', () => {
    const { samples, sampleRate } = fixture('c-major-chord.wav')
    expect(topBins(averageChroma(samples, sampleRate), 3).sort((a, b) => a - b)).toEqual([0, 4, 7])
  })

  it('f-sharp-major-chord.wav: top three bins are F#, A#, C#', () => {
    const { samples, sampleRate } = fixture('f-sharp-major-chord.wav')
    expect(topBins(averageChroma(samples, sampleRate), 3).sort((a, b) => a - b)).toEqual([1, 6, 10])
  })

  it('silence.wav: RMS is near zero', () => {
    const { samples } = fixture('silence.wav')
    expect(rms(samples)).toBeLessThan(0.002)
  })

  it('c-major-scale.wav: each 0.4 s slice is dominated by its note', () => {
    const { samples, sampleRate } = fixture('c-major-scale.wav')
    const perNote = Math.round(0.4 * sampleRate)
    const expected = [0, 2, 4, 5, 7, 9, 11, 0]
    const dominant = expected.map((_, i) =>
      topBins(averageChroma(samples.subarray(i * perNote, (i + 1) * perNote), sampleRate), 1)[0],
    )
    expect(dominant).toEqual(expected)
  })
})
