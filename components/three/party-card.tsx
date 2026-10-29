'use client'

import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { clamp, sampleKeys } from '@/lib/math'
import { NEON } from '@/lib/palette'
import { frameState } from '@/lib/scene-store'

const SLOTS = 5

/** Per-chapter keyframes: hero, problem, how it works, trust, waitlist. */
const FILL_KEYS = [
  [0.6, 0.2, 0.8, 1, 1],
  [0.8, 0, 0.6, 1, 1],
  [0.4, 0.2, 1, 1, 1],
  [1, 0.4, 0.6, 1, 1],
] as const
const GLOW_KEYS = [1, 0.3, 1.2, 1.45, 1.2] as const
const LIFT_KEYS = [0, -0.2, 0, 0.3, 0.3] as const

type PartyCardProps = {
  index: number
  color: string
  angle: number
  radius: number
  height: number
}

export function PartyCard({ index, color, angle, radius, height }: PartyCardProps) {
  const group = useRef<THREE.Group>(null)
  const rim = useRef<THREE.MeshBasicMaterial>(null)
  const header = useRef<THREE.MeshBasicMaterial>(null)
  const meter = useRef<THREE.Mesh>(null)
  const slots = useRef<THREE.InstancedMesh>(null)

  const colors = useMemo(
    () => ({
      base: new THREE.Color(color),
      slotOn: new THREE.Color(NEON.green).multiplyScalar(1.8),
      slotOff: new THREE.Color('#25223b'),
      scratch: new THREE.Color(),
    }),
    [color],
  )

  useLayoutEffect(() => {
    const mesh = slots.current
    if (!mesh) return
    const dummy = new THREE.Object3D()
    for (let i = 0; i < SLOTS; i++) {
      dummy.position.set((i - (SLOTS - 1) / 2) * 0.38, -0.25, 0.045)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      mesh.setColorAt(i, colors.slotOff)
    }
    mesh.instanceMatrix.needsUpdate = true
  }, [colors])

  useFrame(() => {
    const { chapter, time } = frameState
    const fill = sampleKeys(FILL_KEYS[index % FILL_KEYS.length], chapter)
    let glow = sampleKeys(GLOW_KEYS, chapter)

    const problemWeight = 1 - Math.min(Math.abs(chapter - 1), 1)
    if (index === 1) glow *= 1 - problemWeight * 0.45 * (0.5 + 0.5 * Math.sin(time * 11))

    rim.current?.color.copy(colors.base).multiplyScalar(glow * 1.4)
    header.current?.color.copy(colors.base).multiplyScalar(glow * 2)

    const mesh = slots.current
    if (mesh) {
      for (let i = 0; i < SLOTS; i++) {
        const on = clamp(fill * SLOTS - i, 0, 1)
        colors.scratch.copy(colors.slotOff).lerp(colors.slotOn, on)
        mesh.setColorAt(i, colors.scratch)
      }
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    }

    if (meter.current) {
      const width = Math.max(fill, 0.001)
      meter.current.scale.x = width
      meter.current.position.x = -0.8 + 0.8 * width
    }

    if (group.current) {
      group.current.position.y =
        height + Math.sin(time * 0.9 + index * 1.3) * 0.08 + sampleKeys(LIFT_KEYS, chapter)
    }
  })

  return (
    <group
      ref={group}
      position={[Math.sin(angle) * radius, height, Math.cos(angle) * radius]}
      rotation-y={angle}
    >
      <mesh position-z={-0.03}>
        <planeGeometry args={[2.28, 3.08]} />
        <meshBasicMaterial ref={rim} toneMapped={false} />
      </mesh>
      <mesh>
        <boxGeometry args={[2.2, 3, 0.05]} />
        <meshBasicMaterial color="#100e1f" />
      </mesh>
      <mesh position={[0, 1.15, 0.03]}>
        <planeGeometry args={[1.7, 0.2]} />
        <meshBasicMaterial ref={header} toneMapped={false} />
      </mesh>
      <mesh position={[-0.25, 0.75, 0.03]}>
        <planeGeometry args={[1.2, 0.08]} />
        <meshBasicMaterial color="#4a4766" />
      </mesh>
      <mesh position={[-0.45, 0.55, 0.03]}>
        <planeGeometry args={[0.8, 0.08]} />
        <meshBasicMaterial color="#35334d" />
      </mesh>
      <instancedMesh ref={slots} args={[undefined, undefined, SLOTS]}>
        <circleGeometry args={[0.14, 20]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <mesh position={[0, -1.05, 0.03]}>
        <planeGeometry args={[1.6, 0.07]} />
        <meshBasicMaterial color="#1f1d33" />
      </mesh>
      <mesh ref={meter} position={[0, -1.05, 0.035]}>
        <planeGeometry args={[1.6, 0.07]} />
        <meshBasicMaterial color={new THREE.Color(NEON.green).multiplyScalar(1.6)} toneMapped={false} />
      </mesh>
    </group>
  )
}
