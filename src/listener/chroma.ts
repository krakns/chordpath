import { fft } from './fft'

export type Chroma = Float32Array
export type Frame = Float32Array

export const PITCH_CLASSES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const

const MIN_HZ = 60
const MAX_HZ = 2000

export const PRESENCE_THRESHOLD = 1 / 12

const windows = new Map<number, Float64Array>()

function hannWindow(len: number): Float64Array {
  let w = windows.get(len)
  if (!w) {
    w = new Float64Array(len)
    for (let i = 0; i < len; i++) w[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / len)
    windows.set(len, w)
  }
  return w
}

export function pitchClassOf(hz: number): number {
  const midi = Math.round(69 + 12 * Math.log2(hz / 440))
  return ((midi % 12) + 12) % 12
}

export function rms(frame: Frame): number {
  if (frame.length === 0) return 0
  let sum = 0
  for (let i = 0; i < frame.length; i++) sum += frame[i] * frame[i]
  return Math.sqrt(sum / frame.length)
}

export function chromaOf(frame: Frame, sampleRate: number): Chroma {
  const chroma = new Float32Array(12)
  const len = frame.length
  if (len === 0) return chroma

  const n = nextPowerOfTwo(len)
  const re = new Float64Array(n)
  const im = new Float64Array(n)
  const window = hannWindow(len)
  for (let i = 0; i < len; i++) re[i] = frame[i] * window[i]
  fft(re, im)

  const bins = n / 2
  const binHz = sampleRate / n
  const first = Math.max(1, Math.ceil(MIN_HZ / binHz))
  const last = Math.min(Math.floor(MAX_HZ / binHz), bins - 1)
  const mag = new Float64Array(bins + 1)
  for (let k = first - 1; k <= last + 1; k++) mag[k] = Math.sqrt(re[k] * re[k] + im[k] * im[k])
  for (let k = first; k <= last; k++) {
    if (!(mag[k] > mag[k - 1] && mag[k] >= mag[k + 1])) continue
    chroma[pitchClassOf((k + peakOffset(mag[k - 1], mag[k], mag[k + 1])) * binHz)] += mag[k]
  }

  let total = 0
  for (let i = 0; i < 12; i++) total += chroma[i]
  if (total > 0) for (let i = 0; i < 12; i++) chroma[i] /= total
  return chroma
}

function peakOffset(left: number, peak: number, right: number): number {
  const curvature = left - 2 * peak + right
  return curvature === 0 ? 0 : (0.5 * (left - right)) / curvature
}

function nextPowerOfTwo(n: number): number {
  let p = 1
  while (p < n) p <<= 1
  return p
}
