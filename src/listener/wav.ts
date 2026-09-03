export type Wav = { sampleRate: number; samples: Float32Array }

export function readWav(bytes: Uint8Array): Wav {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const tag = (at: number) => String.fromCharCode(...bytes.subarray(at, at + 4))
  if (tag(0) !== 'RIFF' || tag(8) !== 'WAVE') throw new Error('not a RIFF/WAVE file')

  let format = 0
  let channels = 0
  let sampleRate = 0
  let bits = 0
  let at = 12
  while (at + 8 <= bytes.length) {
    const id = tag(at)
    const size = view.getUint32(at + 4, true)
    const body = at + 8
    if (id === 'fmt ') {
      format = view.getUint16(body, true)
      channels = view.getUint16(body + 2, true)
      sampleRate = view.getUint32(body + 4, true)
      bits = view.getUint16(body + 14, true)
    } else if (id === 'data') {
      if (format !== 1 || bits !== 16 || channels < 1) {
        throw new Error(`only PCM16 is supported, got format ${format}, ${bits} bit, ${channels} channels`)
      }
      const count = Math.floor(size / (2 * channels))
      const samples = new Float32Array(count)
      for (let i = 0; i < count; i++) {
        let sum = 0
        for (let c = 0; c < channels; c++) sum += view.getInt16(body + (i * channels + c) * 2, true)
        samples[i] = sum / channels / 32768
      }
      return { sampleRate, samples }
    }
    at = body + size + (size & 1)
  }
  throw new Error('no data chunk')
}
