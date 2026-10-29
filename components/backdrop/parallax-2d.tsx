'use client'

import { type CSSProperties, useEffect, useMemo, useRef } from 'react'
import { mulberry32 } from '@/lib/math'
import { NEON } from '@/lib/palette'
import { CHAPTER_COUNT, sceneInput, subscribeSceneInput } from '@/lib/scene-store'

const NEONS = [NEON.purple, NEON.blue, NEON.green]

type Tower = { x: number; w: number; h: number; color: string; lit: { y: number; x: number }[] }

function generateSkyline(seed: number, count: number, minH: number, maxH: number): Tower[] {
  const rng = mulberry32(seed)
  const towers: Tower[] = []
  let x = -20
  for (let i = 0; i < count && x < 1220; i++) {
    const w = 28 + rng() * 60
    const h = minH + rng() * (maxH - minH)
    const lit = Array.from({ length: Math.floor(rng() * 4) }, () => ({ x: 6 + rng() * (w - 14), y: 300 - h + 12 + rng() * (h - 24) }))
    towers.push({ x, w, h, color: NEONS[Math.floor(rng() * NEONS.length)], lit })
    x += w + rng() * 10
  }
  return towers
}

function Skyline({ seed, minH, maxH, fill, glow }: { seed: number; minH: number; maxH: number; fill: string; glow: number }) {
  const towers = useMemo(() => generateSkyline(seed, 40, minH, maxH), [seed, minH, maxH])
  return (
    <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice" className="h-full w-full">
      {towers.map((t, i) => (
        <g key={i}>
          <rect x={t.x} y={300 - t.h} width={t.w} height={t.h} fill={fill} />
          <rect x={t.x} y={300 - t.h} width={t.w} height={2} fill={t.color} opacity={glow} />
          {t.lit.map((l, j) => (
            <rect key={j} x={t.x + l.x} y={l.y} width={6} height={4} fill={t.color} opacity={glow * 0.7} />
          ))}
        </g>
      ))}
    </svg>
  )
}

function GlassCard({ color, filled, className }: { color: string; filled: number; className: string }) {
  return (
    <div
      className={`absolute rounded-2xl border bg-[#100e1f]/80 p-4 ${className}`}
      style={{ borderColor: `${color}66`, boxShadow: `0 0 40px -8px ${color}55` }}
    >
      <div className="h-2 w-3/4 rounded-full" style={{ background: color }} />
      <div className="mt-3 h-1.5 w-1/2 rounded-full bg-white/15" />
      <div className="mt-5 flex gap-1.5">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className="size-3.5 rounded-full"
            style={{ background: i < filled ? NEON.green : '#25223b', boxShadow: i < filled ? `0 0 10px ${NEON.green}` : 'none' }}
          />
        ))}
      </div>
      <div className="mt-5 h-1 w-full rounded-full bg-white/10">
        <div className="h-full rounded-full" style={{ width: `${filled * 20}%`, background: NEON.green }} />
      </div>
    </div>
  )
}

const DOTS = Array.from({ length: 18 }, (_, i) => {
  const rng = mulberry32(i + 9)
  return { left: rng() * 100, top: rng() * 100, size: 2 + rng() * 3, delay: rng() * -12, color: NEONS[i % 3] }
})

const layer = (depth: number): CSSProperties => ({
  transform: `translate3d(0, calc(var(--p) * ${-depth}px), 0)`,
})

export function Parallax2D({ reducedMotion }: { reducedMotion: boolean }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reducedMotion) return
    let frame = 0
    const apply = () => {
      frame = 0
      root.current?.style.setProperty('--p', (sceneInput.chapter / (CHAPTER_COUNT - 1)).toFixed(4))
    }
    const unsubscribe = subscribeSceneInput(() => {
      if (!frame) frame = requestAnimationFrame(apply)
    })
    apply()
    return () => {
      unsubscribe()
      cancelAnimationFrame(frame)
    }
  }, [reducedMotion])

  return (
    <div ref={root} className="absolute inset-0" style={{ '--p': 0 } as CSSProperties}>
      <div className="parallax-layer absolute -inset-x-20 -top-20 h-[70%]" style={layer(40)}>
        <div className="absolute left-[10%] top-[10%] size-[55vmax] rounded-full bg-neon-purple/20 blur-[90px]" />
        <div className="absolute right-[-10%] top-[30%] size-[45vmax] rounded-full bg-neon-blue/15 blur-[90px]" />
      </div>

      <div className="parallax-layer absolute inset-x-0 bottom-[18%] h-[34%] opacity-60" style={layer(30)}>
        <Skyline seed={4} minH={60} maxH={220} fill="#0d0c19" glow={0.5} />
      </div>
      <div className="parallax-layer absolute inset-x-0 -bottom-[2%] h-[30%]" style={layer(90)}>
        <Skyline seed={11} minH={40} maxH={170} fill="#08070f" glow={1} />
      </div>

      <div className="parallax-layer absolute right-[-12%] top-[14%] w-[62vw] max-w-[420px] sm:right-[4%]" style={layer(180)}>
        <div className="relative aspect-[4/5] w-full opacity-70 sm:opacity-90">
          <GlassCard color={NEON.purple} filled={4} className="left-0 top-[8%] w-[46%] -rotate-6" />
          <GlassCard color={NEON.blue} filled={5} className="right-0 top-0 w-[46%] rotate-3" />
          <GlassCard color={NEON.green} filled={3} className="left-[24%] top-[46%] w-[48%] rotate-1" />
        </div>
      </div>

      {DOTS.map((dot, i) => (
        <span
          key={i}
          className="float-dot absolute rounded-full"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            width: dot.size,
            height: dot.size,
            background: dot.color,
            boxShadow: `0 0 8px ${dot.color}`,
            animationDelay: `${dot.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
