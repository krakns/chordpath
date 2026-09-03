import { NATURAL_PC, type Letter, type NoteName, type PitchClass, mod12 } from './pitch'
import { QUALITY_BASE_INTERVALS, TOKEN_REGISTRY, longestMatchingToken } from './chordTokens'

export type ChordQuality = 'maj' | 'min' | 'dim' | 'aug' | 'sus2' | 'sus4'
export type Seventh = 'maj7' | 'min7' | 'dim7'

export type Chord = {
  root: PitchClass
  rootName: NoteName
  quality: ChordQuality
  seventh: Seventh | null
  /** Semitone offsets from the root, sorted, always including 0. */
  intervals: number[]
  bass: PitchClass | null
  bassName: NoteName | null
  symbol: string
}

export type ParseResult = { ok: true; chord: Chord } | { ok: false; error: string }

const ROOT_RE = /^([A-G])(#|b)?/

function parseNote(text: string): { pc: PitchClass; name: NoteName; length: number } | undefined {
  const match = ROOT_RE.exec(text)
  if (!match) return undefined
  const [full, letter, accidental] = match
  const offset = accidental === '#' ? 1 : accidental === 'b' ? -1 : 0
  return { pc: mod12(NATURAL_PC[letter as Letter] + offset), name: full, length: full.length }
}

export function parseChord(symbol: string): ParseResult {
  if (symbol.length === 0) {
    return { ok: false, error: 'Empty chord symbol' }
  }

  const slashIndex = symbol.indexOf('/')
  const mainPart = slashIndex === -1 ? symbol : symbol.slice(0, slashIndex)
  const bassPart = slashIndex === -1 ? undefined : symbol.slice(slashIndex + 1)

  const root = parseNote(mainPart)
  if (!root) {
    return { ok: false, error: `Unrecognized root note in "${symbol}"` }
  }

  let bass: { pc: PitchClass; name: NoteName } | undefined
  if (bassPart !== undefined) {
    const parsedBass = parseNote(bassPart)
    if (!parsedBass || parsedBass.length !== bassPart.length) {
      return { ok: false, error: `Unrecognized bass note "${bassPart}" in "${symbol}"` }
    }
    bass = parsedBass
  }

  let quality: ChordQuality = 'maj'
  let seventh: Seventh | null = null
  const additions: number[] = []
  let remaining = mainPart.slice(root.length)
  while (remaining.length > 0) {
    const token = longestMatchingToken(remaining)
    if (!token) {
      return { ok: false, error: `Unknown token "${remaining}" in "${symbol}"` }
    }
    const edit = TOKEN_REGISTRY[token]
    if (edit.quality) quality = edit.quality
    if (edit.seventh) seventh = edit.seventh
    if (edit.add) additions.push(...edit.add)
    remaining = remaining.slice(token.length)
  }

  const intervals = Array.from(new Set([...QUALITY_BASE_INTERVALS[quality], ...additions])).sort(
    (a, b) => a - b,
  )

  const chord: Chord = {
    root: root.pc,
    rootName: root.name,
    quality,
    seventh,
    intervals,
    bass: bass?.pc ?? null,
    bassName: bass?.name ?? null,
    symbol,
  }
  return { ok: true, chord }
}

export function pitchClasses(chord: Chord): Set<PitchClass> {
  const classes = new Set<PitchClass>(chord.intervals.map((interval) => mod12(chord.root + interval)))
  if (chord.bass !== null) classes.add(chord.bass)
  return classes
}
