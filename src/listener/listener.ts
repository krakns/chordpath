import { chromaOf, rms, type Chroma } from './chroma'

export type Handle = { stop(): void }

export const FFT_SIZE = 4096
export const FRAME_MS = 50

export async function startListening(onChroma: (chroma: Chroma, level: number) => void): Promise<Handle> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error('This browser has no microphone access. On iOS the page must be served over HTTPS.')
  }

  const ctx = new AudioContext()
  const resumed = ctx.resume()

  let stream: MediaStream
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
    })
  } catch (error) {
    void ctx.close()
    throw error
  }
  await resumed

  const analyser = ctx.createAnalyser()
  analyser.fftSize = FFT_SIZE
  ctx.createMediaStreamSource(stream).connect(analyser)

  const frame = new Float32Array(FFT_SIZE)
  const timer = setInterval(() => {
    analyser.getFloatTimeDomainData(frame)
    onChroma(chromaOf(frame, ctx.sampleRate), rms(frame))
  }, FRAME_MS)

  const wakeLock = await requestWakeLock()

  return {
    stop() {
      clearInterval(timer)
      for (const track of stream.getTracks()) track.stop()
      void ctx.close()
      wakeLock?.release().catch(() => {})
    },
  }
}

export function isPermissionDenied(error: unknown): boolean {
  return error instanceof DOMException && (error.name === 'NotAllowedError' || error.name === 'SecurityError')
}

export function messageOf(error: unknown): string {
  if (error instanceof DOMException && error.name === 'NotFoundError') return 'No microphone was found on this device.'
  return error instanceof Error ? error.message : String(error)
}

async function requestWakeLock(): Promise<WakeLockSentinel | null> {
  try {
    return (await navigator.wakeLock?.request('screen')) ?? null
  } catch {
    return null
  }
}
