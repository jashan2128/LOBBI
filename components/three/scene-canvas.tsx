'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useCallback, useRef, useState } from 'react'
import { NIGHT } from '@/lib/palette'
import { CameraRig } from './camera-rig'
import { City } from './city'
import { LobbyPlatform } from './lobby-platform'
import { Particles } from './particles'

type SceneCanvasProps = {
  onReady: () => void
  onContextLost: () => void
  onTooSlow: () => void
}

type Quality = 'high' | 'low'

function FirstFrame({ onReady }: { onReady: () => void }) {
  const done = useRef(false)
  useFrame(() => {
    if (done.current) return
    done.current = true
    requestAnimationFrame(onReady)
  })
  return null
}

/** Averages fps over consecutive rendered frames only, so demand-mode idle gaps are ignored. */
function PerformanceGuard({ onSample }: { onSample: (fps: number) => void }) {
  const acc = useRef({ warmup: 40, frames: 0, time: 0 })
  useFrame((_, delta) => {
    const a = acc.current
    if (delta > 0.07) return
    if (a.warmup > 0) {
      a.warmup--
      return
    }
    a.frames++
    a.time += delta
    if (a.frames >= 120) {
      onSample(a.frames / a.time)
      a.frames = 0
      a.time = 0
    }
  })
  return null
}

export default function SceneCanvas({ onReady, onContextLost, onTooSlow }: SceneCanvasProps) {
  const [quality, setQuality] = useState<Quality>('high')

  const handleSample = useCallback(
    (fps: number) => {
      if (fps < 26) onTooSlow()
      else if (fps < 45) setQuality('low')
    },
    [onTooSlow],
  )

  return (
    <Canvas
      frameloop="demand"
      dpr={quality === 'high' ? [1, 1.5] : 1}
      gl={{ antialias: false, alpha: false, stencil: false, powerPreference: 'high-performance' }}
      camera={{ fov: 42, near: 0.1, far: 140, position: [2.6, 2.8, 21] }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (event) => {
          event.preventDefault()
          onContextLost()
        })
      }}
    >
      <color attach="background" args={[NIGHT]} />
      <fog attach="fog" args={[NIGHT, 20, 72]} />

      <CameraRig />
      <City />
      <LobbyPlatform />
      <Particles />

      <FirstFrame onReady={onReady} />
      <PerformanceGuard onSample={handleSample} />

      {quality === 'high' && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={0.75} luminanceThreshold={0.6} luminanceSmoothing={0.2} radius={0.7} />
        </EffectComposer>
      )}
    </Canvas>
  )
}
