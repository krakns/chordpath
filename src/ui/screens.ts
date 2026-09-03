import type { ComponentType } from 'react'
import { Home } from './screens/Home'

export type ScreenId = 'home'

export const SCREENS: Record<ScreenId, { Component: ComponentType }> = {
  home: { Component: Home },
}
