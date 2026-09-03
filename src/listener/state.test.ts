// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { calibrationOf, IDLE, reduceListener, type ListenerState } from './state'

const calibration = { noiseFloor: 0.001, gain: 2, measuredAt: '2026-09-03T00:00:00.000Z' }
const silent = new Float32Array(12)

function listening(state: ListenerState) {
  if (state.kind !== 'listening') throw new Error(`expected listening, got ${state.kind}`)
  return state
}

describe('reduceListener', () => {
  it('starts calibration when nothing is stored', () => {
    const state = reduceListener(reduceListener(IDLE, { type: 'start' }), {
      type: 'granted',
      calibration: null,
      now: 1000,
    })
    expect(listening(state).view).toEqual({ kind: 'calibrating', step: { kind: 'quiet', startedAt: 1000, levels: [] } })
  })

  it('goes straight to the meter when calibrated', () => {
    const state = reduceListener({ kind: 'requesting' }, { type: 'granted', calibration, now: 1000 })
    expect(listening(state).view).toEqual({ kind: 'meter', calibration })
    expect(calibrationOf(listening(state).view)).toBe(calibration)
  })

  it('feeds frames into the calibration step and the meter', () => {
    let state = reduceListener({ kind: 'requesting' }, { type: 'granted', calibration: null, now: 0 })
    state = reduceListener(state, { type: 'frame', chroma: silent, level: 0.01, now: 50 })
    const view = listening(state).view
    expect(view.kind === 'calibrating' && view.step.kind === 'quiet' && view.step.levels).toEqual([0.01])
    expect(listening(state).level).toBe(0.01)
  })

  it('ignores frames outside listening and stops back to idle', () => {
    expect(reduceListener(IDLE, { type: 'frame', chroma: silent, level: 1, now: 0 })).toBe(IDLE)
    const state = reduceListener({ kind: 'requesting' }, { type: 'granted', calibration, now: 0 })
    expect(reduceListener(state, { type: 'stop' })).toBe(IDLE)
  })

  it('recalibrate restarts the quiet phase from the meter', () => {
    const meter = reduceListener({ kind: 'requesting' }, { type: 'granted', calibration, now: 0 })
    const state = reduceListener(meter, { type: 'recalibrate', now: 500 })
    expect(listening(state).view).toEqual({ kind: 'calibrating', step: { kind: 'quiet', startedAt: 500, levels: [] } })
  })

  it('maps permission and failure outcomes', () => {
    expect(reduceListener({ kind: 'requesting' }, { type: 'denied' })).toEqual({ kind: 'denied' })
    expect(reduceListener({ kind: 'requesting' }, { type: 'failed', message: 'boom' })).toEqual({
      kind: 'error',
      message: 'boom',
    })
  })
})
