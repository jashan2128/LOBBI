import { Check, Star, X } from 'lucide-react'
import { FadeIn } from '@/components/motion/fade-in'
import { RevealWords } from '@/components/motion/reveal-words'
import { HudFrame } from '@/components/hud-frame'
import { Eyebrow } from './eyebrow'

function PostPreview() {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {['Valorant', 'Ascendant+', '10:30 PM IST', 'Comp', 'Hindi/Eng'].map((chip) => (
          <span key={chip} className="border border-neon-purple/40 bg-neon-purple/10 px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-foreground">
            {chip}
          </span>
        ))}
      </div>
      <div className="clip-angle-sm flex h-9 items-center justify-center bg-neon-purple font-mono text-xs font-bold uppercase tracking-[0.2em] text-background">
        Post lobby
      </div>
    </div>
  )
}

function JoinPreview() {
  return (
    <div className="space-y-2">
      {[
        { tag: 'kavya_op', rate: 92 },
        { tag: 'zoro.exe', rate: 98 },
      ].map((p) => (
        <div key={p.tag} className="flex h-11 items-center gap-3 border border-white/10 bg-white/[0.03] px-3">
          <span className="min-w-0 flex-1 truncate text-sm font-medium">{p.tag}</span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neon-green">{p.rate}%</span>
          <span className="grid size-6 place-items-center bg-neon-green text-background">
            <Check className="size-3.5" strokeWidth={3} />
          </span>
          <span className="grid size-6 place-items-center border border-white/15 text-muted-foreground">
            <X className="size-3.5" strokeWidth={3} />
          </span>
        </div>
      ))}
    </div>
  )
}

function RatePreview() {
  return (
    <div className="space-y-2.5">
      {['On time', 'Comms', 'Fair play'].map((label, i) => (
        <div key={label} className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className="flex gap-0.5 text-neon-green">
            {Array.from({ length: 5 }, (_, s) => (
              <Star key={s} className="size-4" fill={s < 5 - (i === 1 ? 1 : 0) ? 'currentColor' : 'none'} />
            ))}
          </span>
        </div>
      ))}
    </div>
  )
}

const STEPS = [
  {
    n: '01',
    title: 'Post',
    body: 'Game, rank, slot in IST and how serious you want it. Ten seconds.',
    tone: 'purple' as const,
    text: 'text-neon-purple',
    Preview: PostPreview,
  },
  {
    n: '02',
    title: 'Join',
    body: 'Players request a spot. You see their show-up rate before you accept.',
    tone: 'blue' as const,
    text: 'text-neon-blue',
    Preview: JoinPreview,
  },
  {
    n: '03',
    title: 'Rate',
    body: 'After the match, everyone rates everyone. Ghosts get found out fast.',
    tone: 'green' as const,
    text: 'text-neon-green',
    Preview: RatePreview,
  },
]

export function HowItWorks() {
  return (
    <section id="how" data-chapter="2" aria-labelledby="how-title" className="relative scroll-mt-24 py-28 md:py-44">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Eyebrow className="mb-7">Ch.02 // How it works</Eyebrow>
        <RevealWords
          as="h2"
          id="how-title"
          text="Three steps. Then you play."
          className="font-display max-w-3xl text-balance text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl"
        />

        <ol className="mt-16 grid gap-5 md:mt-20 md:grid-cols-3">
          {STEPS.map(({ n, title, body, tone, text, Preview }, i) => (
            <li key={n}>
              <FadeIn delay={i * 0.12} className="h-full">
                <HudFrame tone={tone} className="flex h-full flex-col p-6 md:p-7">
                  <div className="flex items-baseline justify-between">
                    <span className={`font-mono text-xs font-semibold uppercase tracking-[0.22em] ${text}`}>Stage {n}</span>
                    <span aria-hidden="true" className="font-display text-5xl font-bold leading-none text-white/[0.06]">
                      {n}
                    </span>
                  </div>
                  <h3 className="font-display mt-6 text-3xl font-bold uppercase tracking-tight">{title}</h3>
                  <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{body}</p>
                  <div aria-hidden="true" className="mt-8 border-t border-white/10 pt-6 md:mt-auto">
                    <Preview />
                  </div>
                </HudFrame>
              </FadeIn>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
