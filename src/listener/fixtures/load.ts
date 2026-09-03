import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { readWav, type Wav } from '../wav'

export type FixtureName = 'c-major-chord.wav' | 'f-sharp-major-chord.wav' | 'silence.wav' | 'c-major-scale.wav'

export function fixture(name: FixtureName): Wav {
  return readWav(readFileSync(fileURLToPath(new URL(name, import.meta.url))))
}
