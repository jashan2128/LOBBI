import Link from 'next/link'
import { HudFrame } from '@/components/hud-frame'

export function NoPlayersYet() {
  return (
    <HudFrame tone="purple" className="px-6 py-14 text-center">
      <p aria-hidden="true" className="font-mono text-6xl font-bold text-neon-purple/70">0</p>
      <h2 className="font-display mt-4 text-3xl font-bold uppercase">{"You're early."}</h2>
      <p className="mx-auto mt-3 max-w-md text-pretty text-muted-foreground">
        Lobbi is just getting started and you are one of the first players here. Share it with your squad, so there is someone to team up with.
      </p>
    </HudFrame>
  )
}

export function NoMatches() {
  return (
    <HudFrame tone="blue" className="px-6 py-14 text-center">
      <p aria-hidden="true" className="font-mono text-6xl font-bold text-neon-blue/70">0</p>
      <h2 className="font-display mt-4 text-3xl font-bold uppercase">No players match</h2>
      <p className="mx-auto mt-3 max-w-md text-pretty text-muted-foreground">
        Nobody fits all of those filters yet. Try fewer filters, a different rank, or another city.
      </p>
      <Link
        href="/players"
        className="mt-6 inline-flex h-10 items-center border border-white/20 px-5 font-mono text-xs font-bold uppercase tracking-[0.14em] transition-colors hover:border-neon-green/60 hover:text-neon-green"
      >
        Clear filters
      </Link>
    </HudFrame>
  )
}

export function FewPlayersNote({ total }: { total: number }) {
  return (
    <p className="mt-8 border border-white/10 px-4 py-3 text-sm text-muted-foreground">
      Only {total} {total === 1 ? 'player is' : 'players are'} here so far. More are joining, so check back soon.
    </p>
  )
}
