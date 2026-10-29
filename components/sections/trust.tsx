import { FadeIn } from '@/components/motion/fade-in'
import { RevealWords } from '@/components/motion/reveal-words'
import { HudFrame } from '@/components/hud-frame'
import { Eyebrow } from './eyebrow'

const RATINGS = [
  { label: 'On time', score: 4.9 },
  { label: 'Comms', score: 4.7 },
  { label: 'Fair play', score: 4.8 },
]

const POINTS = [
  'Show-up rate counts every lobby you join, not just the good nights.',
  'Ratings only come from people who actually played with you.',
  'Miss a game and your rate drops. Keep showing up and it climbs back.',
]

const SHOW_UP = 96
const RING = 2 * Math.PI * 34

function PlayerCard() {
  return (
    <HudFrame as="figure" className="p-6 shadow-[0_30px_80px_-30px_var(--neon-purple)] md:p-8">
      <figcaption className="sr-only">Example player profile showing a 96% show-up rate and post-game ratings</figcaption>
      <div className="flex items-center gap-4">
        <div className="clip-angle-sm grid size-12 shrink-0 place-items-center bg-gradient-to-br from-neon-purple to-neon-blue font-mono text-sm font-bold text-background">
          AR
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium">aarav.r</p>
          <p className="truncate text-sm text-muted-foreground">Valorant · Ascendant 2 · Mumbai</p>
        </div>
        <div className="shrink-0 border border-neon-green/40 bg-neon-green/10 px-2.5 py-1 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Tier</p>
          <p className="font-display text-xl font-bold leading-none text-neon-green">S</p>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-6">
        <div className="relative size-24 shrink-0">
          <svg viewBox="0 0 80 80" className="size-full -rotate-90" aria-hidden="true">
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="var(--neon-green)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${(RING * SHOW_UP) / 100} ${RING}`}
            />
          </svg>
          <span className="absolute inset-0 grid place-items-center text-xl font-semibold">{SHOW_UP}%</span>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Show-up rate</p>
          <p className="mt-1 text-lg font-medium">47 of 49 lobbies</p>
          <p className="mt-1 font-mono text-xs text-neon-green">Never late this month</p>
        </div>
      </div>

      <dl className="mt-8 space-y-4">
        {RATINGS.map((r) => (
          <div key={r.label} className="grid grid-cols-[6rem_1fr_2.5rem] items-center gap-4 text-sm">
            <dt className="text-muted-foreground">{r.label}</dt>
            <div aria-hidden="true" className="h-1 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-neon-blue" style={{ width: `${(r.score / 5) * 100}%` }} />
            </div>
            <dd className="text-right font-mono">{r.score.toFixed(1)}</dd>
          </div>
        ))}
      </dl>

      <ul className="mt-8 flex flex-wrap gap-2" aria-label="Tags from teammates">
        {['Shotcaller', 'Chill comms', 'Plays to win'].map((tag) => (
          <li key={tag} className="border border-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-foreground/80">
            {tag}
          </li>
        ))}
      </ul>
    </HudFrame>
  )
}

export function Trust() {
  return (
    <section id="trust" data-chapter="3" aria-labelledby="trust-title" className="relative scroll-mt-24 py-32 md:py-48">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 md:px-10 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
        <div>
          <Eyebrow className="mb-7">Ch.03 // Trust</Eyebrow>
          <RevealWords
            as="h2"
            id="trust-title"
            text="Your rank is how often you show up."
            accent={['show', 'up.']}
            accentClassName="text-neon-green"
            className="font-display text-balance text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl"
          />
          <ul className="mt-12 space-y-6">
            {POINTS.map((point, i) => (
              <li key={point}>
                <FadeIn delay={i * 0.08} className="flex gap-4">
                  <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-neon-green" />
                  <span className="text-pretty leading-relaxed text-muted-foreground">{point}</span>
                </FadeIn>
              </li>
            ))}
          </ul>
        </div>
        <FadeIn delay={0.1} className="mx-auto w-full max-w-md">
          <PlayerCard />
        </FadeIn>
      </div>
    </section>
  )
}
