import { RevealWords } from '@/components/motion/reveal-words'
import { HudFrame } from '@/components/hud-frame'
import { Eyebrow } from './eyebrow'
import { WaitlistForm } from './waitlist-form'

export function Waitlist() {
  return (
    <section id="waitlist" data-chapter="4" aria-labelledby="waitlist-title" className="relative scroll-mt-24 py-28 md:py-44">
      <div className="mx-auto max-w-3xl px-5 md:px-10">
        <HudFrame className="px-5 py-12 text-center shadow-[0_0_120px_-40px_var(--neon-green)] sm:px-12 md:py-16">
          <Eyebrow className="mb-7 justify-center">Ready check</Eyebrow>
          <RevealWords
            as="h2"
            id="waitlist-title"
            text="Be first in the lobby."
            className="font-display text-balance text-5xl font-bold uppercase leading-[0.95] tracking-tight md:text-7xl"
          />
          <p className="mx-auto mt-7 max-w-md text-pretty leading-relaxed text-muted-foreground">
            {"We're opening city by city. Lock in your spot and we'll send an invite when your server goes live."}
          </p>
          <div className="mx-auto mt-10 max-w-xl text-left">
            <WaitlistForm />
          </div>
        </HudFrame>
      </div>
    </section>
  )
}
