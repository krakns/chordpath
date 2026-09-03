import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'listener', 'fixtures')
const SAMPLE_RATE = 44100
const HARMONICS = 4

const C4 = 60
const E4 = 64
const G4 = 67
const FS4 = 66
const AS4 = 70
const CS5 = 73

function hz(midi) {
  return 440 * 2 ** ((midi - 69) / 12)
}

function tone(midi, seconds) {
  const out = new Float32Array(Math.round(seconds * SAMPLE_RATE))
  const f = hz(midi)
  for (let i = 0; i < out.length; i++) {
    const t = i / SAMPLE_RATE
    let s = 0
    for (let k = 1; k <= HARMONICS; k++) {
      s += (Math.exp(-t * (0.8 + 0.6 * k)) / k) * Math.sin(2 * Math.PI * f * k * t)
    }
    out[i] = s
  }
  return out
}

function mix(parts) {
  const out = new Float32Array(parts[0].length)
  for (const p of parts) for (let i = 0; i < out.length; i++) out[i] += p[i]
  return out
}

function concat(parts) {
  const out = new Float32Array(parts.reduce((n, p) => n + p.length, 0))
  let at = 0
  for (const p of parts) {
    out.set(p, at)
    at += p.length
  }
  return out
}

function normalize(samples, peak) {
  let max = 0
  for (const s of samples) max = Math.max(max, Math.abs(s))
  const scale = max > 0 ? peak / max : 1
  return samples.map((s) => s * scale)
}

function noise(seconds, amplitude, seed) {
  let state = seed >>> 0
  const out = new Float32Array(Math.round(seconds * SAMPLE_RATE))
  for (let i = 0; i < out.length; i++) {
    state = (state + 0x6d2b79f5) >>> 0
    let x = Math.imul(state ^ (state >>> 15), 1 | state)
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x
    const unit = ((x ^ (x >>> 14)) >>> 0) / 4294967296
    out[i] = (unit * 2 - 1) * amplitude
  }
  return out
}

function writeWav(name, samples) {
  const data = Buffer.alloc(samples.length * 2)
  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]))
    data.writeInt16LE(Math.round(clamped * 32767), i * 2)
  }
  const header = Buffer.alloc(44)
  header.write('RIFF', 0)
  header.writeUInt32LE(36 + data.length, 4)
  header.write('WAVE', 8)
  header.write('fmt ', 12)
  header.writeUInt32LE(16, 16)
  header.writeUInt16LE(1, 20)
  header.writeUInt16LE(1, 22)
  header.writeUInt32LE(SAMPLE_RATE, 24)
  header.writeUInt32LE(SAMPLE_RATE * 2, 28)
  header.writeUInt16LE(2, 32)
  header.writeUInt16LE(16, 34)
  header.write('data', 36)
  header.writeUInt32LE(data.length, 40)
  writeFileSync(join(outDir, name), Buffer.concat([header, data]))
  console.log(`${name}: ${(samples.length / SAMPLE_RATE).toFixed(2)} s`)
}

mkdirSync(outDir, { recursive: true })
writeWav('c-major-chord.wav', normalize(mix([tone(C4, 2), tone(E4, 2), tone(G4, 2)]), 0.8))
writeWav('f-sharp-major-chord.wav', normalize(mix([tone(FS4, 2), tone(AS4, 2), tone(CS5, 2)]), 0.8))
writeWav('silence.wav', noise(2, 0.0005, 1))
writeWav(
  'c-major-scale.wav',
  normalize(concat([C4, 62, 64, 65, 67, 69, 71, 72].map((midi) => tone(midi, 0.4))), 0.8),
)
