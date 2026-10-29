'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { CHAPTER_COUNT, frameState, sceneInput, subscribeSceneInput } from '@/lib/scene-store'

const KEEP_ALIVE_MS = 1400
const EPSILON = 0.0005

/** One camera stop per chapter: hero, problem, how it works, trust, waitlist. */
const POSITIONS: [number, number, number][] = [
  [2.6, 2.8, 15],
  [-11, 8, 12],
  [10, 3.4, 9.5],
  [0.5, 4.6, 11.5],
  [0, 13, 29],
]
const TARGETS: [number, number, number][] = [
  [-2.8, 1.6, 0],
  [0, 0.4, 0],
  [-1, 1.9, 0],
  [-2.2, 1.9, 0],
  [0, -1.5, 0],
]

export function CameraRig() {
  const camera = useThree((state) => state.camera)
  const invalidate = useThree((state) => state.invalidate)

  const curves = useMemo(
    () => ({
      position: new THREE.CatmullRomCurve3(POSITIONS.map((p) => new THREE.Vector3(...p)), false, 'centripetal'),
      target: new THREE.CatmullRomCurve3(TARGETS.map((p) => new THREE.Vector3(...p)), false, 'centripetal'),
      pos: new THREE.Vector3(),
      look: new THREE.Vector3(),
    }),
    [],
  )

  const state = useRef({
    pointerX: 0,
    pointerY: 0,
    intro: 6,
    keepAliveUntil: 0,
  })

  useEffect(() => {
    frameState.chapter = sceneInput.chapter
    state.current.keepAliveUntil = performance.now() + 2600
    invalidate()
    return subscribeSceneInput(() => {
      state.current.keepAliveUntil = performance.now() + KEEP_ALIVE_MS
      invalidate()
    })
  }, [invalidate])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    const s = state.current

    frameState.time += dt
    frameState.chapter = THREE.MathUtils.damp(frameState.chapter, sceneInput.chapter, 3.2, dt)
    s.pointerX = THREE.MathUtils.damp(s.pointerX, sceneInput.pointerX, 2.4, dt)
    s.pointerY = THREE.MathUtils.damp(s.pointerY, sceneInput.pointerY, 2.4, dt)
    s.intro = THREE.MathUtils.damp(s.intro, 0, 1.6, dt)

    const t = THREE.MathUtils.clamp(frameState.chapter / (CHAPTER_COUNT - 1), 0, 1)
    curves.position.getPoint(t, curves.pos)
    curves.target.getPoint(t, curves.look)

    camera.position.set(
      curves.pos.x + s.pointerX * 0.9,
      curves.pos.y - s.pointerY * 0.5 + s.intro * 0.25,
      curves.pos.z + s.intro,
    )
    camera.lookAt(curves.look)

    const settling =
      Math.abs(frameState.chapter - sceneInput.chapter) > EPSILON ||
      Math.abs(s.pointerX - sceneInput.pointerX) > EPSILON ||
      Math.abs(s.pointerY - sceneInput.pointerY) > EPSILON ||
      s.intro > 0.01

    if (settling || performance.now() < s.keepAliveUntil) invalidate()
  })

  return null
}
