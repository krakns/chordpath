import { useMemo, useState } from 'react'
import {
  defaultSpelling,
  mod12,
  parseChord,
  pitchClasses,
  transposeChord,
  triadVoicing,
  type PitchClass,
} from '../../theory'
import { Keyboard } from '../components/Keyboard'

const INVERSIONS: Array<{ value: 0 | 1 | 2; label: string }> = [
  { value: 0, label: 'Root position' },
  { value: 1, label: '1st inversion' },
  { value: 2, label: '2nd inversion' },
]

const KEY_OPTIONS: PitchClass[] = Array.from({ length: 12 }, (_, pc) => pc as PitchClass)

export function Reference() {
  const [symbol, setSymbol] = useState('')
  const [inversion, setInversion] = useState<0 | 1 | 2>(0)
  const [transposeKey, setTransposeKey] = useState<PitchClass | 'original'>('original')

  const parsed = useMemo(() => (symbol.trim() === '' ? null : parseChord(symbol.trim())), [symbol])

  const chord = useMemo(() => {
    if (!parsed || !parsed.ok) return null
    if (transposeKey === 'original' || transposeKey === parsed.chord.root) return parsed.chord
    const semitones = mod12(transposeKey - parsed.chord.root)
    return transposeChord(parsed.chord, semitones, transposeKey)
  }, [parsed, transposeKey])

  const noteNames = useMemo(() => {
    if (!chord) return []
    return [...pitchClasses(chord)].sort((a, b) => a - b).map((pc) => defaultSpelling(pc))
  }, [chord])

  const voicing = useMemo(() => (chord ? triadVoicing(chord, inversion, 4) : null), [chord, inversion])

  return (
    <main className="screen reference">
      <h1 className="reference__title">Chord lookup</h1>

      <label className="reference__field">
        <span>Chord symbol</span>
        <input
          type="text"
          value={symbol}
          onChange={(event) => setSymbol(event.target.value)}
          autoFocus
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="e.g. Cmaj7, G/B, Fm7b5"
          className="reference__input"
        />
      </label>

      {parsed && !parsed.ok && <p className="reference__error">{parsed.error}</p>}

      {chord && voicing && (
        <>
          <p className="reference__notes">{noteNames.join('  ')}</p>

          <Keyboard voicing={voicing} rootPitchClass={chord.root} />

          <div className="reference__controls">
            <label className="reference__field">
              <span>Inversion</span>
              <select
                value={inversion}
                onChange={(event) => setInversion(Number(event.target.value) as 0 | 1 | 2)}
              >
                {INVERSIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="reference__field">
              <span>Transpose to</span>
              <select
                value={transposeKey}
                onChange={(event) =>
                  setTransposeKey(
                    event.target.value === 'original' ? 'original' : (Number(event.target.value) as PitchClass),
                  )
                }
              >
                <option value="original">As written</option>
                {KEY_OPTIONS.map((pc) => (
                  <option key={pc} value={pc}>
                    {defaultSpelling(pc)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </>
      )}
    </main>
  )
}
