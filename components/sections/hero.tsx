import type { CSSProperties } from 'react'
import { WaitlistLink } from '@/components/waitlist-link'
import { MatchmakingPanel } from './matchmaking-panel'

const HEADLINE = ['Find', 'teammates', 'who', 'actually', 'show', 'up.']
const ACCENT = new Set(['show', 'up.'])

const LOBBIES = [
  'Valorant · Ascendant · Mumbai · 3/5',
  'CS2 · Premier 15K · Delhi · 4/5',
  'Dota 2 · Ancient · Bengaluru · 2/5',
  'Apex · Platinum · Pune · 2/3',
  'Valorant · Unrated · Chennai · 4/5',
  'CS2 · Faceit 7 · Hyderabad · 3/5',
  'Rainbow Six · Gold · Kolkata · 3/5',
]

function LobbyTicker() {
  const items = [...LOBBIES, ...LOBBIES]
  return (
    <div aria-hidden="true" className="relative overflow-hidden border-y border-white/10 bg-background/60 py-3 backdrop-blur-sm">
      <div className="marquee flex w-max gap-10 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {items.map((lobby, i) => (
          <span key={i} className="flex items-center gap-3 whitespace-nowrap">
            <span className="size-1.5 bg-neon-green" />
            {lobby}
          </span>
        ))}
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section id="top" data-chapter="0" aria-labelledby="hero-title" className="relative flex min-h-svh flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-5 pb-16 pt-28 md:px-10 md:pt-32">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <div>
            <p className="hero-rise mb-7 inline-flex items-center gap-2.5 border border-neon-green/30 bg-neon-green/[0.06] px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-neon-green">
              <span aria-hidden="true" className="size-1.5 animate-pulse bg-neon-green" />
              Season 0 · PC squads in India
            </p>

            <h1
              id="hero-title"
              className="font-display text-balance text-[2.6rem] font-bold uppercase leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-[5.25rem]"
            >
              <span className="sr-only">Find teammates who actually show up.</span>
              <span aria-hidden="true">
                {HEADLINE.map((word, i) => (
                  <span key={word} className="inline-block overflow-hidden pb-[0.06em] align-bottom">
                    <span className="hero-word inline-block" style={{ '--i': i } as CSSProperties}>
                      <span className={ACCENT.has(word) ? 'rgb-split text-neon-green' : undefined}>{word}</span>
                    </span>
                    {i < HEADLINE.length - 1 ? '\u00a0' : ''}
                  </span>
                ))}
              </span>
            </h1>

            <p
              className="hero-rise mt-7 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
              style={{ '--d': '600ms' } as CSSProperties}
            >
              Every player on Lobbi has a show-up rate. Post a lobby, pick people who turn up, and drop in on time. No more waiting on a fifth who never logs in.
            </p>

            <div className="hero-rise mt-9 flex flex-wrap items-center gap-x-6 gap-y-4" style={{ '--d': '750ms' } as CSSProperties}>
              <WaitlistLink>
                Join the waitlist
                <span aria-hidden="true">{'\u2192'}</span>
              </WaitlistLink>
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Free at launch · No spam</span>
            </div>
          </div>

          <div className="hero-rise mx-auto w-full max-w-md lg:mr-0" style={{ '--d': '900ms' } as CSSProperties}>
            <MatchmakingPanel />
          </div>
        </div>
      </div>

      <LobbyTicker />
    </section>
  )
}
