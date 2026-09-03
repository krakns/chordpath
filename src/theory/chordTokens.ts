import type { ChordQuality } from './chord'

/** Triad shape for each quality, semitone offsets from the root. Always includes 0. */
export const QUALITY_BASE_INTERVALS: Record<ChordQuality, number[]> = {
  maj: [0, 4, 7],
  min: [0, 3, 7],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
}

export type TokenEdit = {
  /** Overrides the base triad quality when the token names one. */
  quality?: ChordQuality
  /** Semitone offsets to add on top of the base triad. */
  add?: number[]
}

/**
 * Suffix token to interval edit. A symbol's suffix is consumed by repeatedly
 * matching the longest registered key that prefixes what's left (maximal
 * munch), so "maj7" wins over "m" and "m7b5"/"dim7" win over "m"/"dim" before
 * a bare "7" could misparse them as a triad quality plus a dominant 7th.
 */
export const TOKEN_REGISTRY: Record<string, TokenEdit> = {
  // Quality words and symbols
  min: { quality: 'min' },
  maj: { quality: 'maj' },
  dim: { quality: 'dim' },
  aug: { quality: 'aug' },
  sus4: { quality: 'sus4' },
  sus2: { quality: 'sus2' },
  sus: { quality: 'sus4' },
  m: { quality: 'min' },
  '-': { quality: 'min' },
  '+': { quality: 'aug' },
  '°': { quality: 'dim' },

  // Half-diminished and fully-diminished sevenths are their own entries:
  // "m7b5" and "dim7" are not "m"/"dim" plus a bare extension, because a
  // half- or fully-diminished 7th differs from a dominant 7th (10 semitones).
  m7b5: { quality: 'dim', add: [10] },
  'ø7': { quality: 'dim', add: [10] },
  dim7: { quality: 'dim', add: [9] },

  // Sevenths (triad quality untouched)
  maj7: { add: [11] },
  M7: { add: [11] },
  'Δ7': { add: [11] },
  '7': { add: [10] },

  // Sixths
  6: { add: [9] },

  // Added and extended tones. 9/11/13 bare imply the dominant 7th plus the
  // stacked extensions below them; add9/add2 add only the named color tone.
  add9: { add: [14] },
  add2: { add: [2] },
  2: { add: [2] },
  9: { add: [10, 14] },
  11: { add: [10, 14, 17] },
  13: { add: [10, 14, 21] },

  // Alterations, applied after a preceding "7" token consumes the b7.
  b9: { add: [13] },
  '#9': { add: [15] },
  '#11': { add: [18] },
  b13: { add: [20] },
}

/** The longest registry key that prefixes `remaining`, or undefined. */
export function longestMatchingToken(remaining: string): string | undefined {
  let best: string | undefined
  for (const key of Object.keys(TOKEN_REGISTRY)) {
    if (remaining.startsWith(key) && (best === undefined || key.length > best.length)) {
      best = key
    }
  }
  return best
}
