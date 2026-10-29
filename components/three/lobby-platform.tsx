'use client'

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { NEON } from '@/lib/palette'
import { frameState } from '@/lib/scene-store'
import { PartyCard } from './party-card'

const CARDS = [
  { angle: -1.15, color: NEON.purple },
  { angle: -0.38, color: NEON.blue },
  { angle: 0.38, color: NEON.green },
  { angle: 1.15, color: NEON.purple },
]

const glow = (hex: string, intensity: number) => new THREE.Color(hex).multiplyScalar(intensity)

export function LobbyPlatform() {
  const root = useRef<THREE.Group>(null)
  const halo = useRef<THREE.Mesh>(null)

  useFrame(() => {
    const { time } = frameState
    if (root.current) root.current.position.y = Math.sin(time * 0.6) * 0.12
    if (halo.current) halo.current.rotation.z = time * 0.25
  })

  return (
    <group ref={root}>
      <mesh>
        <cylinderGeometry args={[6, 5.2, 0.5, 6]} />
        <meshBasicMaterial color="#0e0c1b" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, Math.PI / 6]} position-y={0.26}>
        <torusGeometry args={[6, 0.045, 3, 6]} />
        <meshBasicMaterial color={glow(NEON.purple, 2)} toneMapped={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, Math.PI / 6]} position-y={-0.26}>
        <torusGeometry args={[5.2, 0.03, 3, 6]} />
        <meshBasicMaterial color={glow(NEON.blue, 1.4)} toneMapped={false} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.27}>
        <ringGeometry args={[4.2, 4.26, 6, 1]} />
        <meshBasicMaterial color={glow(NEON.purple, 0.8)} toneMapped={false} />
      </mesh>
      <mesh ref={halo} rotation-x={-Math.PI / 2} position-y={0.5}>
        <ringGeometry args={[1.2, 1.26, 48, 1, 0, Math.PI * 1.5]} />
        <meshBasicMaterial color={glow(NEON.green, 1.8)} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position-y={-1.6}>
        <coneGeometry args={[2.6, 2.4, 6, 1, true]} />
        <meshBasicMaterial color="#0a0914" side={THREE.DoubleSide} />
      </mesh>

      {CARDS.map((card, index) => (
        <PartyCard key={index} index={index} color={card.color} angle={card.angle} radius={3.6} height={2.2} />
      ))}
    </group>
  )
}
