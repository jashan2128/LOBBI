'use client'

import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { mulberry32 } from '@/lib/math'
import { NEON } from '@/lib/palette'

const GROUND_Y = -10
const BUILDING_COUNT = 170
const PALETTE = [NEON.purple, NEON.blue, NEON.green, NEON.purple, NEON.blue]

type Building = {
  x: number
  z: number
  w: number
  d: number
  h: number
  roof: THREE.Color
  body: THREE.Color
  windows: number
}

type Box = { x: number; y: number; z: number; sx: number; sy: number; sz: number; color?: THREE.Color }

function generateCity() {
  const rng = mulberry32(1337)
  const buildings: Building[] = []
  let guard = 0

  while (buildings.length < BUILDING_COUNT && guard < 2000) {
    guard++
    const angle = rng() * Math.PI * 2
    const radius = 18 + Math.pow(rng(), 0.8) * 42
    const towardCamera = Math.abs(Math.atan2(Math.sin(angle - Math.PI / 2), Math.cos(angle - Math.PI / 2)))
    if (towardCamera < 0.55 && radius < 44) continue

    const far = (radius - 18) / 42
    const neon = new THREE.Color(PALETTE[Math.floor(rng() * PALETTE.length)])
    const bright = rng() > 0.55
    buildings.push({
      x: Math.cos(angle) * radius,
      z: Math.sin(angle) * radius,
      w: 1.6 + rng() * 2.6,
      d: 1.6 + rng() * 2.6,
      h: 4 + rng() * 10 + far * 10 + (rng() > 0.9 ? 8 : 0),
      roof: neon.multiplyScalar(bright ? 1.6 : 0.45),
      body: new THREE.Color('#0c0b17').multiplyScalar(0.8 + rng() * 0.5),
      windows: rng() > 0.35 ? Math.floor(rng() * 7) : 0,
    })
  }

  const roofs: Box[] = []
  const strips: Box[] = []
  const windows: Box[] = []
  const warm = new THREE.Color('#ffd9a8')

  for (const b of buildings) {
    roofs.push({ x: b.x, y: GROUND_Y + b.h + 0.05, z: b.z, sx: b.w + 0.08, sy: 0.1, sz: b.d + 0.08, color: b.roof })

    const facesX = Math.abs(b.x) > Math.abs(b.z)
    const faceX = facesX ? b.x - Math.sign(b.x) * (b.w / 2 + 0.03) : b.x
    const faceZ = facesX ? b.z : b.z - Math.sign(b.z) * (b.d / 2 + 0.03)
    const faceWidth = facesX ? b.d : b.w

    if (b.h > 12 && rng() > 0.4) {
      strips.push({
        x: faceX,
        y: GROUND_Y + b.h * 0.55,
        z: faceZ,
        sx: facesX ? 0.04 : 0.16,
        sy: b.h * 0.7,
        sz: facesX ? 0.16 : 0.04,
        color: b.roof.clone().multiplyScalar(1.2),
      })
    }

    for (let i = 0; i < b.windows; i++) {
      const along = (rng() - 0.5) * (faceWidth - 0.6)
      const color = rng() > 0.7 ? warm.clone().multiplyScalar(0.9) : b.roof.clone().multiplyScalar(0.7)
      windows.push({
        x: facesX ? faceX : b.x + along,
        y: GROUND_Y + 1 + rng() * (b.h - 2),
        z: facesX ? b.z + along : faceZ,
        sx: facesX ? 0.03 : 0.32,
        sy: 0.22,
        sz: facesX ? 0.32 : 0.03,
        color,
      })
    }
  }

  return { buildings, roofs, strips, windows }
}

function useInstancedBoxes(boxes: Box[]) {
  const ref = useRef<THREE.InstancedMesh>(null)
  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const dummy = new THREE.Object3D()
    boxes.forEach((box, i) => {
      dummy.position.set(box.x, box.y, box.z)
      dummy.scale.set(box.sx, box.sy, box.sz)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      if (box.color) mesh.setColorAt(i, box.color)
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [boxes])
  return ref
}

export function City() {
  const city = useMemo(generateCity, [])

  const bodies = useMemo<Box[]>(
    () =>
      city.buildings.map((b) => ({
        x: b.x,
        y: GROUND_Y + b.h / 2,
        z: b.z,
        sx: b.w,
        sy: b.h,
        sz: b.d,
        color: b.body,
      })),
    [city],
  )

  const bodyRef = useInstancedBoxes(bodies)
  const roofRef = useInstancedBoxes(city.roofs)
  const stripRef = useInstancedBoxes(city.strips)
  const windowRef = useInstancedBoxes(city.windows)

  return (
    <group>
      <instancedMesh ref={bodyRef} args={[undefined, undefined, bodies.length]}>
        <boxGeometry />
        <meshBasicMaterial />
      </instancedMesh>
      <instancedMesh ref={roofRef} args={[undefined, undefined, city.roofs.length]}>
        <boxGeometry />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={stripRef} args={[undefined, undefined, city.strips.length]}>
        <boxGeometry />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={windowRef} args={[undefined, undefined, city.windows.length]}>
        <boxGeometry />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      <mesh rotation-x={-Math.PI / 2} position-y={GROUND_Y}>
        <planeGeometry args={[220, 220]} />
        <meshBasicMaterial color="#07070d" />
      </mesh>
      <gridHelper args={[220, 90, '#2a1f52', '#15122b']} position-y={GROUND_Y + 0.02} />
    </group>
  )
}
