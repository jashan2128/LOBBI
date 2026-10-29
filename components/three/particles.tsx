'use client'

import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { mulberry32 } from '@/lib/math'
import { NEON } from '@/lib/palette'

const COUNT = 240
const MIN_Y = -8
const MAX_Y = 12

function createDotTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 32
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.35, 'rgba(255,255,255,0.5)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 32, 32)
  }
  return new THREE.CanvasTexture(canvas)
}

export function Particles() {
  const points = useRef<THREE.Points>(null)

  const { positions, colors, speeds, texture } = useMemo(() => {
    const rng = mulberry32(42)
    const palette = [NEON.purple, NEON.blue, NEON.green].map((c) => new THREE.Color(c))
    const positions = new Float32Array(COUNT * 3)
    const colors = new Float32Array(COUNT * 3)
    const speeds = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (rng() - 0.5) * 48
      positions[i * 3 + 1] = MIN_Y + rng() * (MAX_Y - MIN_Y)
      positions[i * 3 + 2] = (rng() - 0.5) * 48
      const color = palette[i % palette.length].clone().multiplyScalar(0.5 + rng() * 1.1)
      colors.set([color.r, color.g, color.b], i * 3)
      speeds[i] = 0.12 + rng() * 0.3
    }
    return { positions, colors, speeds, texture: createDotTexture() }
  }, [])

  useEffect(() => () => texture.dispose(), [texture])

  useFrame((_, delta) => {
    const mesh = points.current
    if (!mesh) return
    const dt = Math.min(delta, 0.05)
    const attribute = mesh.geometry.attributes.position as THREE.BufferAttribute
    const array = attribute.array as Float32Array
    for (let i = 0; i < COUNT; i++) {
      const y = array[i * 3 + 1] + speeds[i] * dt
      array[i * 3 + 1] = y > MAX_Y ? MIN_Y : y
    }
    attribute.needsUpdate = true
    mesh.rotation.y += dt * 0.012
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        sizeAttenuation
        vertexColors
        map={texture}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  )
}
