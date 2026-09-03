import type { Chroma } from './chroma'

export type Calibration = { noiseFloor: number; gain: number; measuredAt: string }

export const TARGET_LEVEL = 0.1
export const QUIET_MS = 3000
export const CHORD_MS = 5000
export const CHORD_SHARE = 0.6
export const CHORD_FRAMES = 5
export const C_MAJOR: readonly number[] = [0, 4, 7]

const MIN_GAIN = 0.1
const MAX_GAIN = 100

export type CalibrationStep =
  | { kind: 'quiet'; startedAt: number; levels: number[] }
  | { kind: 'chord'; startedAt: number; noiseFloor: number; hitLevels: number[] }
  | { kind: 'heard'; calibration: Calibration }
  | { kind: 'failed'; noiseFloor: number; message: string }

export function beginCalibration(now: number): CalibrationStep {
  return { kind: 'quiet', startedAt: now, levels: [] }
}

export function advanceCalibration(
  step: CalibrationStep,
  chroma: Chroma,
  level: number,
  now: number,
): CalibrationStep {
  switch (step.kind) {
    case 'quiet': {
      const levels = [...step.levels, level]
      if (now - step.startedAt < QUIET_MS) return { ...step, levels }
      return { kind: 'chord', startedAt: now, noiseFloor: median(levels), hitLevels: [] }
    }
    case 'chord': {
      const hit = level > step.noiseFloor * 2 && chordShare(chroma, C_MAJOR) >= CHORD_SHARE
      const hitLevels = hit ? [...step.hitLevels, level] : []
      if (hitLevels.length >= CHORD_FRAMES) {
        return {
          kind: 'heard',
          calibration: {
            noiseFloor: step.noiseFloor,
            gain: gainFor(median(hitLevels)),
            measuredAt: new Date(now).toISOString(),
          },
        }
      }
      if (now - step.startedAt >= CHORD_MS) {
        return {
          kind: 'failed',
          noiseFloor: step.noiseFloor,
          message: 'Did not hear a C major chord. Move the device closer to the piano and try again.',
        }
      }
      return { ...step, hitLevels }
    }
    case 'heard':
    case 'failed':
      return step
    default:
      return assertNever(step)
  }
}

export function chordShare(chroma: Chroma, pitchClasses: readonly number[]): number {
  let share = 0
  for (const pc of pitchClasses) share += chroma[pc]
  return share
}

export function gainFor(chordLevel: number): number {
  if (chordLevel <= 0) return MAX_GAIN
  return Math.min(MAX_GAIN, Math.max(MIN_GAIN, TARGET_LEVEL / chordLevel))
}

export function median(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = sorted.length >> 1
  return sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

export const CALIBRATION_KEY = 'chordpath.calibration'

export function loadCalibration(): Calibration | null {
  try {
    const raw = localStorage.getItem(CALIBRATION_KEY)
    return raw === null ? null : parseCalibration(JSON.parse(raw))
  } catch {
    return null
  }
}

export function saveCalibration(calibration: Calibration): void {
  try {
    localStorage.setItem(CALIBRATION_KEY, JSON.stringify(calibration))
  } catch {
    // Private mode or a full quota: the session still works, the next launch recalibrates.
  }
}

export function parseCalibration(value: unknown): Calibration | null {
  if (typeof value !== 'object' || value === null) return null
  const { noiseFloor, gain, measuredAt } = value as Record<string, unknown>
  if (typeof noiseFloor !== 'number' || typeof gain !== 'number' || typeof measuredAt !== 'string') return null
  if (!Number.isFinite(noiseFloor) || !Number.isFinite(gain) || gain <= 0) return null
  return { noiseFloor, gain, measuredAt }
}

function assertNever(value: never): never {
  throw new Error(`unexpected calibration step ${JSON.stringify(value)}`)
}
