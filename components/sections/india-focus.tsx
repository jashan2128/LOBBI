import { FadeIn } from '@/components/motion/fade-in'
import { RevealWords } from '@/components/motion/reveal-words'
import { HudFrame } from '@/components/hud-frame'
import { Eyebrow } from './eyebrow'

const FEATURES = [
  { stat: '<40ms', title: 'Ping-aware lobbies', body: 'Matched by server region, so nobody is stuck at 120 ms.' },
  { stat: 'IST', title: 'Runs on your clock', body: 'Post-work and post-college slots are the main event.' },
  { stat: '6+', title: 'Your language', body: 'Tag lobbies Hindi, English, Tamil, Bengali and more.' },
  { stat: 'PC', title: 'Desk setups only', body: 'Valorant, CS2, Dota 2, Apex, R6 and more.' },
]

const SERVERS = [
  { city: 'Mumbai', ping: 12 },
  { city: 'Delhi', ping: 18 },
  { city: 'Bengaluru', ping: 21 },
  { city: 'Hyderabad', ping: 24 },
  { city: 'Chennai', ping: 26 },
  { city: 'Kolkata', ping: 34 },
]

function PingBars({ ping }: { ping: number }) {
  const strength = ping < 20 ? 4 : ping < 30 ? 3 : 2
  return (
    <span aria-hidden="true" className="flex items-end gap-0.5">
      {[1, 2, 3, 4].map((b) => (
        <span key={b} className={b <= strength ? 'w-1 bg-neon-green' : 'w-1 bg-white/15'} style={{ height: b * 3 + 2 }} />
      ))}
    </span>
  )
}

export function IndiaFocus() {
  return (
    <section id="india" aria-labelledby="india-title" className="relative scroll-mt-24 py-28 md:py-44">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Eyebrow className="mb-7">Ch.04 // India first</Eyebrow>
        <RevealWords
          as="h2"
          id="india-title"
          text="Built for how India plays."
          className="font-display max-w-3xl text-balance text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl"
        />

        <ul className="mt-16 grid gap-5 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <li key={f.title}>
              <FadeIn delay={i * 0.08} className="h-full">
                <HudFrame tone={i % 2 ? 'blue' : 'purple'} className="h-full p-6 md:p-7">
                  <p aria-hidden="true" className="font-display text-4xl font-bold text-foreground">
                    {f.stat}
                  </p>
                  <h3 className="mt-6 font-mono text-sm font-semibold uppercase tracking-[0.16em]">{f.title}</h3>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                </HudFrame>
              </FadeIn>
            </li>
          ))}
        </ul>

        <FadeIn className="mt-8">
          <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Opening first in</h3>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {SERVERS.map((s) => (
              <li key={s.city} className="flex items-center justify-between gap-3 border border-white/10 bg-background/60 px-3 py-2.5 backdrop-blur-sm">
                <span className="text-sm text-foreground">{s.city}</span>
                <span className="flex items-center gap-2 font-mono text-xs tabular-nums text-neon-green">
                  <span className="sr-only">Typical ping</span>
                  {s.ping}ms
                  <PingBars ping={s.ping} />
                </span>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  )
}
