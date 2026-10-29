export type RenderMode = 'pending' | '3d' | '2d' | 'static'

type Listener = () => void

/** Raw input written by DOM listeners (scroll + pointer). */
export const sceneInput = {
  chapter: 0,
  pointerX: 0,
  pointerY: 0,
}

/** Smoothed values written once per rendered frame by the camera rig. */
export const frameState = {
  chapter: 0,
  time: 0,
}

export const CHAPTER_COUNT = 5

const inputListeners = new Set<Listener>()

export function subscribeSceneInput(listener: Listener) {
  inputListeners.add(listener)
  return () => {
    inputListeners.delete(listener)
  }
}

export function notifySceneInput() {
  inputListeners.forEach((listener) => listener())
}

let ready = false
const readyListeners = new Set<Listener>()

export function setSceneReady() {
  if (ready) return
  ready = true
  document.documentElement.dataset.ready = 'true'
  readyListeners.forEach((listener) => listener())
}

export function subscribeReady(listener: Listener) {
  readyListeners.add(listener)
  return () => {
    readyListeners.delete(listener)
  }
}

export function getReady() {
  return ready
}

export function getServerReady() {
  return false
}
