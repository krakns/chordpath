import type { ComponentType } from 'react'
import { Home } from './screens/Home'
import { Reference } from './screens/Reference'
import { Listen } from './screens/Listen'

export type ScreenId = 'home' | 'reference' | 'listen'

export const SCREENS: Record<ScreenId, { Component: ComponentType }> = {
  home: { Component: Home },
  reference: { Component: Reference },
  listen: { Component: Listen },
}
