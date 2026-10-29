import type { RenderMode } from './scene-store'

type ExtendedNavigator = Navigator & {
  deviceMemory?: number
  connection?: { saveData?: boolean }
}

export function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Decides which backdrop to render. `?scene=3d|2d|static` overrides detection for testing.
 * Mobile, low-end, data-saver and reduced-motion users get the 2D parallax version.
 */
export function detectRenderMode(): RenderMode {
  const forced = new URLSearchParams(window.location.search).get('scene')
  if (forced === '2d' || forced === 'static') return forced
  if (forced === '3d') return hasWebGL() ? '3d' : 'static'

  const nav = navigator as ExtendedNavigator
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches
  const smallScreen = window.innerWidth < 900
  const fewCores = (nav.hardwareConcurrency ?? 8) <= 4
  const lowMemory = (nav.deviceMemory ?? 8) < 4
  const saveData = Boolean(nav.connection?.saveData)

  if (prefersReducedMotion() || coarsePointer || smallScreen || fewCores || lowMemory || saveData) {
    return '2d'
  }

  return hasWebGL() ? '3d' : 'static'
}
