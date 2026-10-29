import { FadeIn } from '@/components/motion/fade-in'
import { RevealWords } from '@/components/motion/reveal-words'
import { HudFrame } from '@/components/hud-frame'
import { cn } from '@/lib/utils'
import { Eyebrow } from './eyebrow'

type LogLine = { time: string; who: string; text: string; tag?: string; tone: 'ok' | 'muted' | 'bad' }

const SQUAD_LOG: LogLine[] = [
  { time: '22:30', who: 'SYSTEM', text: 'Party full', tag: '5/5', tone: 'ok' },
  { time: '22:34', who: 'kabir_ttv', text: '"2 min bro, dinner"', tone: 'muted' },
  { time: '22:41', who: 'rnd_7782', text: 'is AFK', tag: 'AFK', tone: 'bad' },
  { time: '22:48', who: 'kabir_ttv', text: 'never logged in', tag: 'No-show', tone: 'bad' },
  { time: '22:56', who: 'rnd_7782', text: 'left after round 3', tag: 'Left', tone: 'bad' },
  { time: '23:05', who: 'SYSTEM', text: 'Ready check failed', tag: '2/5', tone: 'bad' },
]

const TONE = {
  ok: 'text-neon-green border-neon-green/40 bg-neon-green/10',
  muted: '',
  bad: 'text-neon-purple border-neon-purple/50 bg-neon-purple/10',
}

export function Problem() {
  return (
    <section data-chapter="1" aria-labelledby="problem-title" className="relative py-28 md:py-44">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <Eyebrow className="mb-7">Ch.01 // The problem</Eyebrow>
          <h2 id="problem-title" className="sr-only">
            Empty lobbies and no-shows
          </h2>
          <RevealWords
            as="p"
            text="10:30 PM. The party says five out of five. Only two of you are actually here."
            accent={['two']}
            accentClassName="text-neon-purple"
            className="font-display max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl"
          />
          <FadeIn className="mt-10 max-w-md">
            <p className="text-pretty leading-relaxed text-muted-foreground">
              Finding people is easy. Finding people who show up is the hard part. Lobbi fixes that one thing.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.1}>
          <HudFrame tone="purple" className="p-4 sm:p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-xs uppercase tracking-[0.2em]">
              <span className="text-foreground">Squad log</span>
              <span className="text-neon-purple">Tonight</span>
            </div>
            <ol className="mt-3 space-y-1" aria-label="A typical night without Lobbi">
              {SQUAD_LOG.map((line, i) => (
                <li key={`${line.time}-${i}`}>
                  <FadeIn delay={0.15 + i * 0.12} className="flex items-center gap-3 py-2 text-sm">
                    <span className="w-11 shrink-0 font-mono text-xs tabular-nums text-muted-foreground">{line.time}</span>
                    <span className="min-w-0 flex-1 truncate">
                      <span className={cn('font-semibold', line.who === 'SYSTEM' ? 'font-mono text-xs tracking-wider text-neon-blue' : 'text-foreground')}>
                        {line.who}
                      </span>{' '}
                      <span className="text-muted-foreground">{line.text}</span>
                    </span>
                    {line.tag && (
                      <span className={cn('shrink-0 border px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider', TONE[line.tone])}>
                        {line.tag}
                      </span>
                    )}
                  </FadeIn>
                </li>
              ))}
            </ol>
            <p className="mt-4 border-t border-white/10 pt-4 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {'Time wasted: 35 min · Games played: 0'}
            </p>
          </HudFrame>
        </FadeIn>
      </div>
    </section>
  )
}
