import { fft } from './fft'

export type Chroma = Float32Array
export type Frame = Float32Array

export const PITCH_CLASSES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const

const MIN_HZ = 60
const MAX_HZ = 2000

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
  for (let i = 0; i < len; i++) {
    re[i] = frame[i] * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / len))
  }
  fft(re, im)

  const binHz = sampleRate / n
  const first = Math.max(1, Math.ceil(MIN_HZ / binHz))
  const last = Math.min(Math.floor(MAX_HZ / binHz), n / 2)
  for (let k = first; k <= last; k++) {
    chroma[pitchClassOf(k * binHz)] += Math.hypot(re[k], im[k])
  }

  let total = 0
  for (let i = 0; i < 12; i++) total += chroma[i]
  if (total > 0) for (let i = 0; i < 12; i++) chroma[i] /= total
  return chroma
}

function nextPowerOfTwo(n: number): number {
  let p = 1
  while (p < n) p <<= 1
  return p
}
