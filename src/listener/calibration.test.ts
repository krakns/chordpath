// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { chromaOf, rms } from './chroma'
import {
  advanceCalibration,
  beginCalibration,
  chordShare,
  C_MAJOR,
  gainFor,
  median,
  parseCalibration,
  TARGET_LEVEL,
  type CalibrationStep,
} from './calibration'
import { fixture, type FixtureName } from './fixtures/load'

const FRAME = 4096
const FRAME_MS = 50

function feed(
  step: CalibrationStep,
  name: FixtureName,
  from: number,
  frames: number,
): { step: CalibrationStep; now: number } {
  const { samples, sampleRate } = fixture(name)
  const perClip = Math.floor(samples.length / FRAME)
  let now = from
  for (let i = 0; i < frames; i++) {
    now += FRAME_MS
    const at = (i % perClip) * FRAME
    const frame = samples.subarray(at, at + FRAME)
    step = advanceCalibration(step, chromaOf(frame, sampleRate), rms(frame), now)
  }
  return { step, now }
}

const QUIET_FRAMES = 70
const CHORD_WINDOW_FRAMES = 110

describe('calibration through the fixtures', () => {
  it('silence then the C major chord ends in heard with a sensible gain', () => {
    const settled = feed(beginCalibration(0), 'silence.wav', 0, QUIET_FRAMES)
    expect(settled.step.kind).toBe('chord')

    const { step } = feed(settled.step, 'c-major-chord.wav', settled.now, 10)
    expect(step.kind).toBe('heard')
    if (step.kind !== 'heard') return
    expect(step.calibration.noiseFloor).toBeLessThan(0.002)
    expect(step.calibration.gain).toBeGreaterThan(0)
    expect(step.calibration.gain).toBeLessThan(1)
    expect(Date.parse(step.calibration.measuredAt)).not.toBeNaN()
  })

  it('silence then the F sharp chord fails after the chord window', () => {
    const settled = feed(beginCalibration(0), 'silence.wav', 0, QUIET_FRAMES)
    const early = feed(settled.step, 'f-sharp-major-chord.wav', settled.now, 20)
    expect(early.step.kind).toBe('chord')

    const { step } = feed(early.step, 'f-sharp-major-chord.wav', early.now, CHORD_WINDOW_FRAMES)
    expect(step.kind).toBe('failed')
    if (step.kind !== 'failed') return
    expect(step.message).toMatch(/C major/)
  })

  it('silence alone never counts as the chord', () => {
    const settled = feed(beginCalibration(0), 'silence.wav', 0, QUIET_FRAMES)
    const { step } = feed(settled.step, 'silence.wav', settled.now, CHORD_WINDOW_FRAMES)
    expect(step.kind).toBe('failed')
  })
})

describe('chordShare', () => {
  it('is high for the C chord fixture and low for the F sharp one', () => {
    const shareOf = (name: FixtureName) => {
      const { samples, sampleRate } = fixture(name)
      return chordShare(chromaOf(samples.subarray(0, FRAME), sampleRate), C_MAJOR)
    }
    expect(shareOf('c-major-chord.wav')).toBeGreaterThanOrEqual(0.6)
    expect(shareOf('f-sharp-major-chord.wav')).toBeLessThan(0.2)
  })
})

describe('gainFor', () => {
  it('scales the chord level to the target and clamps', () => {
    expect(gainFor(TARGET_LEVEL)).toBe(1)
    expect(gainFor(TARGET_LEVEL / 4)).toBe(4)
    expect(gainFor(0)).toBe(100)
    expect(gainFor(10)).toBe(0.1)
  })
})

describe('median', () => {
  it('handles odd, even and empty inputs', () => {
    expect(median([3, 1, 2])).toBe(2)
    expect(median([4, 1, 3, 2])).toBe(2.5)
    expect(median([])).toBe(0)
  })
})

describe('parseCalibration', () => {
  it('accepts a well formed record and rejects the rest', () => {
    const good = { noiseFloor: 0.001, gain: 2, measuredAt: '2026-09-03T00:00:00.000Z' }
    expect(parseCalibration(good)).toEqual(good)
    expect(parseCalibration(null)).toBeNull()
    expect(parseCalibration({ noiseFloor: '0', gain: 2, measuredAt: 'x' })).toBeNull()
    expect(parseCalibration({ noiseFloor: 0, gain: 0, measuredAt: 'x' })).toBeNull()
  })
})
