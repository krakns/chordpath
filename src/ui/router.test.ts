import { describe, expect, it } from 'vitest'
import { resolveScreenId } from './router'

describe('resolveScreenId', () => {
  it('falls back to home for an unknown hash', () => {
    expect(resolveScreenId('#does-not-exist')).toBe('home')
  })

  it('resolves a known screen id', () => {
    expect(resolveScreenId('#home')).toBe('home')
  })
})
