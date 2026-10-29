'use client'

import { useEffect } from 'react'
import { notifySceneInput, sceneInput } from './scene-store'

/**
 * Maps document scroll to a continuous chapter value using `[data-chapter]` section tops,
 * and optionally tracks a normalized pointer position for parallax.
 */
export function useSceneTracking(enabled: boolean, trackPointer: boolean) {
  useEffect(() => {
    if (!enabled) return

    let tops: number[] = []
    let frame = 0

    const update = () => {
      frame = 0
      const y = window.scrollY
      let chapter = 0
      if (tops.length > 1) {
        const last = tops.length - 1
        if (y >= tops[last]) {
          chapter = last
        } else {
          for (let i = 0; i < last; i++) {
            if (y < tops[i + 1]) {
              const span = Math.max(1, tops[i + 1] - tops[i])
              chapter = i + Math.max(0, y - tops[i]) / span
              break
            }
          }
        }
      }
      sceneInput.chapter = chapter
      notifySceneInput()
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    const measure = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      tops = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter]'))
        .sort((a, b) => Number(a.dataset.chapter) - Number(b.dataset.chapter))
        .map((el) => Math.min(el.getBoundingClientRect().top + window.scrollY, maxScroll))
      schedule()
    }

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      sceneInput.pointerX = (event.clientX / window.innerWidth) * 2 - 1
      sceneInput.pointerY = (event.clientY / window.innerHeight) * 2 - 1
      notifySceneInput()
    }

    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(document.body)
    window.addEventListener('scroll', schedule, { passive: true })
    if (trackPointer) window.addEventListener('pointermove', onPointer, { passive: true })
    measure()

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [enabled, trackPointer])
}
