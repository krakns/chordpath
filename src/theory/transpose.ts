import { KEY_PREFERENCE, type PitchClass, mod12, spellPitchClass } from './pitch'
import type { Chord } from './chord'

/** Re-spells the root and bass for `targetKey` (or the transposed root's own key when omitted). */
export function transposeChord(chord: Chord, semitones: number, targetKey?: PitchClass): Chord {
  const newRoot = mod12(chord.root + semitones)
  const newBass = chord.bass === null ? null : mod12(chord.bass + semitones)
  const preference = KEY_PREFERENCE[targetKey ?? newRoot]

  const newRootName = spellPitchClass(newRoot, preference)
  const newBassName = newBass === null ? null : spellPitchClass(newBass, preference)

  const suffix = chord.symbol.split('/')[0].slice(chord.rootName.length)
  const newSymbol = newRootName + suffix + (newBassName !== null ? `/${newBassName}` : '')

  return {
    ...chord,
    root: newRoot,
    rootName: newRootName,
    bass: newBass,
    bassName: newBassName,
    symbol: newSymbol,
  }
}
