'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useState } from 'react'
import { detectRenderMode, prefersReducedMotion } from '@/lib/device'
import { type RenderMode, setSceneReady } from '@/lib/scene-store'
import { useSceneTracking } from '@/lib/use-scene-tracking'
import { SceneErrorBoundary } from '@/components/three/scene-error-boundary'
import { Parallax2D } from './parallax-2d'

const SceneCanvas = dynamic(() => import('@/components/three/scene-canvas'), {
  ssr: false,
  loading: () => null,
})

export function Backdrop() {
  const [mode, setMode] = useState<RenderMode>('pending')
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setMode(detectRenderMode())
    setReducedMotion(prefersReducedMotion())
  }, [])

  useEffect(() => {
    if (mode === '2d' || mode === 'static') setSceneReady()
  }, [mode])

  useSceneTracking(mode === '3d' || (mode === '2d' && !reducedMotion), mode === '3d')

  const fallbackToStatic = useCallback(() => setMode('static'), [])
  const fallbackTo2D = useCallback(() => setMode('2d'), [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="static-gradient absolute inset-0" />
      {mode === '2d' && <Parallax2D reducedMotion={reducedMotion} />}
      {mode === '3d' && (
        <div className="absolute inset-0">
          <SceneErrorBoundary onError={fallbackToStatic}>
            <SceneCanvas onReady={setSceneReady} onContextLost={fallbackToStatic} onTooSlow={fallbackTo2D} />
          </SceneErrorBoundary>
        </div>
      )}
    </div>
  )
}
