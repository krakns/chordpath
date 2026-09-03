import type { Chroma } from './chroma'
import { advanceCalibration, beginCalibration, type Calibration, type CalibrationStep } from './calibration'
import { unreachable } from './unreachable'

export type ListenView =
  | { kind: 'calibrating'; step: CalibrationStep }
  | { kind: 'meter'; calibration: Calibration }

export type ListenerState =
  | { kind: 'idle' }
  | { kind: 'requesting' }
  | { kind: 'listening'; view: ListenView; chroma: Chroma; level: number }
  | { kind: 'denied' }
  | { kind: 'error'; message: string }

export type ListenerAction =
  | { type: 'start' }
  | { type: 'granted'; calibration: Calibration | null; now: number }
  | { type: 'denied' }
  | { type: 'failed'; message: string }
  | { type: 'frame'; chroma: Chroma; level: number; now: number }
  | { type: 'recalibrate'; now: number }
  | { type: 'stop' }

export const IDLE: ListenerState = { kind: 'idle' }

export function reduceListener(state: ListenerState, action: ListenerAction): ListenerState {
  switch (action.type) {
    case 'start':
      return { kind: 'requesting' }
    case 'granted':
      return {
        kind: 'listening',
        view: action.calibration
          ? { kind: 'meter', calibration: action.calibration }
          : { kind: 'calibrating', step: beginCalibration(action.now) },
        chroma: new Float32Array(12),
        level: 0,
      }
    case 'denied':
      return { kind: 'denied' }
    case 'failed':
      return { kind: 'error', message: action.message }
    case 'frame': {
      if (state.kind !== 'listening') return state
      const view: ListenView =
        state.view.kind === 'calibrating'
          ? { kind: 'calibrating', step: advanceCalibration(state.view.step, action.chroma, action.level, action.now) }
          : state.view
      return { ...state, view, chroma: action.chroma, level: action.level }
    }
    case 'recalibrate':
      if (state.kind !== 'listening') return state
      return { ...state, view: { kind: 'calibrating', step: beginCalibration(action.now) } }
    case 'stop':
      return IDLE
    default:
      return unreachable(action, 'listener action')
  }
}

export function calibrationOf(view: ListenView): Calibration | null {
  if (view.kind === 'meter') return view.calibration
  return view.step.kind === 'heard' ? view.step.calibration : null
}
