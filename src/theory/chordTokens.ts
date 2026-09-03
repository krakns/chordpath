import type { ChordQuality, Seventh } from './chord'

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
  seventh?: Seventh
  /** Semitone offsets to add on top of the base triad. */
  add?: number[]
}

export const TOKEN_REGISTRY: Record<string, TokenEdit> = {
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

  m7b5: { quality: 'dim', seventh: 'min7', add: [10] },
  'ø7': { quality: 'dim', seventh: 'min7', add: [10] },
  dim7: { quality: 'dim', seventh: 'dim7', add: [9] },

  maj7: { seventh: 'maj7', add: [11] },
  M7: { seventh: 'maj7', add: [11] },
  'Δ7': { seventh: 'maj7', add: [11] },
  '7': { seventh: 'min7', add: [10] },

  6: { add: [9] },

  add9: { add: [14] },
  add2: { add: [2] },
  2: { add: [2] },
  9: { seventh: 'min7', add: [10, 14] },
  11: { seventh: 'min7', add: [10, 14, 17] },
  13: { seventh: 'min7', add: [10, 14, 21] },

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
