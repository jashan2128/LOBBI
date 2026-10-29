import { Backdrop } from '@/components/backdrop/backdrop'
import { LoadingScreen } from '@/components/backdrop/loading-screen'
import { Overlays } from '@/components/backdrop/overlays'
import { Hero } from '@/components/sections/hero'
import { HowItWorks } from '@/components/sections/how-it-works'
import { IndiaFocus } from '@/components/sections/india-focus'
import { Problem } from '@/components/sections/problem'
import { SiteFooter } from '@/components/sections/site-footer'
import { SiteHeader } from '@/components/sections/site-header'
import { Trust } from '@/components/sections/trust'
import { Waitlist } from '@/components/sections/waitlist'

export default function Page() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[70] rounded-full bg-foreground px-4 py-2 text-background focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <LoadingScreen />
      <Backdrop />
      <Overlays />
      <SiteHeader />
      <main id="main" className="relative z-10">
        <Hero />
        <Problem />
        <HowItWorks />
        <Trust />
        <IndiaFocus />
        <Waitlist />
      </main>
      <SiteFooter />
    </>
  )
}
