import { useEffect, useState } from 'react'
import { SCREENS, type ScreenId } from './screens'

export function resolveScreenId(hash: string): ScreenId {
  const id = hash.replace(/^#/, '')
  return id in SCREENS ? (id as ScreenId) : 'home'
}

export function useHashRoute(): ScreenId {
  const [screenId, setScreenId] = useState<ScreenId>(() => resolveScreenId(window.location.hash))

  useEffect(() => {
    const onHashChange = () => setScreenId(resolveScreenId(window.location.hash))
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return screenId
}
