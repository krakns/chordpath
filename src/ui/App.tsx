import { useHashRoute } from './router'
import { SCREENS } from './screens'

export function App() {
  const screenId = useHashRoute()
  const { Component } = SCREENS[screenId]
  return <Component />
}
