'use client'

import { useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { HudFrame } from '@/components/hud-frame'
import { cn } from '@/lib/utils'

const SQUAD = [
  { tag: 'you', role: 'Host', rate: null },
  { tag: 'aarav.r', role: 'Duelist', rate: 96 },
  { tag: 'kavya_op', role: 'Controller', rate: 92 },
  { tag: 'zoro.exe', role: 'Sentinel', rate: 98 },
  { tag: 'ishaan.k', role: 'Initiator', rate: 94 },
]

const TICK_MS = 1000
const HOLD_STEPS = 4
const CYCLE = SQUAD.length + HOLD_STEPS

function formatClock(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
}

export function MatchmakingPanel() {
  const reduced = useReducedMotion()
  const [step, setStep] = useState(1)

  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setStep((s) => (s + 1) % CYCLE || 1), TICK_MS)
    return () => clearInterval(id)
  }, [reduced])

  const filled = reduced ? SQUAD.length : Math.min(step, SQUAD.length)
  const ready = filled === SQUAD.length
  const clock = formatClock(filled * 7 + (ready ? 0 : 3))

  return (
    <figure className="w-full">
      <figcaption className="sr-only">
        Example lobby: a five-player Valorant squad in Mumbai filling up with players whose show-up rates are above 90%.
      </figcaption>
      <HudFrame className="p-4 sm:p-5">
        <div aria-hidden="true">
          <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.18em]">
            <span className="flex items-center gap-2 text-foreground">
              <span className={cn('size-2 rounded-full', ready ? 'bg-neon-green shadow-[0_0_10px_var(--neon-green)]' : 'animate-pulse bg-neon-blue')} />
              {ready ? 'Lobby ready' : 'Matchmaking'}
            </span>
            <span className="tabular-nums text-muted-foreground">{clock}</span>
          </div>
          <p className="mt-1.5 truncate text-xs text-muted-foreground">Valorant · Competitive · Mumbai · 10:30 PM IST</p>

          <ul className="mt-4 space-y-1.5">
            {SQUAD.map((player, i) => {
              const joined = i < filled
              return (
                <li
                  key={player.tag}
                  className={cn(
                    'flex h-11 items-center gap-3 border px-3 transition-colors duration-500',
                    joined ? 'border-white/10 bg-white/[0.04]' : 'scan-shimmer border-dashed border-white/10',
                  )}
                >
                  <span className="w-4 font-mono text-[11px] text-muted-foreground">{i + 1}</span>
                  {joined ? (
                    <>
                      <span className="clip-angle-sm grid size-7 shrink-0 place-items-center bg-gradient-to-br from-neon-purple to-neon-blue font-mono text-[11px] font-bold uppercase text-background">
                        {player.tag.slice(0, 2)}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm">
                        <span className="font-medium text-foreground">{player.tag}</span>
                        <span className="ml-2 text-xs text-muted-foreground">{player.role}</span>
                      </span>
                      {player.rate ? (
                        <span className="shrink-0 font-mono text-[11px] font-semibold uppercase tracking-wider text-neon-green">
                          {player.rate}% show-up
                        </span>
                      ) : (
                        <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-neon-purple">Host</span>
                      )}
                    </>
                  ) : (
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">Searching…</span>
                  )}
                </li>
              )
            })}
          </ul>

          <div className="mt-4 flex gap-1">
            {SQUAD.map((p, i) => (
              <span
                key={p.tag}
                className={cn('h-1 flex-1 transition-colors duration-500', i < filled ? 'bg-neon-green shadow-[0_0_8px_var(--neon-green)]' : 'bg-white/10')}
              />
            ))}
          </div>
          <p className={cn('mt-3 font-mono text-xs uppercase tracking-[0.18em]', ready ? 'text-neon-green' : 'text-muted-foreground')}>
            {ready ? '5/5 locked in · 0 no-shows' : `${filled}/5 · Only reliable players`}
          </p>
        </div>
      </HudFrame>
    </figure>
  )
}
