import Link from 'next/link'
import { HudFrame } from '@/components/hud-frame'

const CTA =
  'inline-flex h-10 items-center border border-neon-green/60 px-5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-neon-green transition-colors hover:bg-neon-green hover:text-background'

export function NoLobbiesYet() {
  return (
    <HudFrame tone="purple" className="px-6 py-14 text-center">
      <p aria-hidden="true" className="font-mono text-6xl font-bold text-neon-purple/70">0</p>
      <h2 className="font-display mt-4 text-3xl font-bold uppercase">No open lobbies yet</h2>
      <p className="mx-auto mt-3 max-w-md text-pretty text-muted-foreground">
        Be the first. Pick a game and a time, and other players can join you.
      </p>
      <div className="mt-6">
        <Link href="/lobbies/new" className={CTA}>Create a lobby</Link>
      </div>
    </HudFrame>
  )
}

export function NoLobbyMatches() {
  return (
    <HudFrame tone="blue" className="px-6 py-14 text-center">
      <p aria-hidden="true" className="font-mono text-6xl font-bold text-neon-blue/70">0</p>
      <h2 className="font-display mt-4 text-3xl font-bold uppercase">No lobbies match</h2>
      <p className="mx-auto mt-3 max-w-md text-pretty text-muted-foreground">
        Nothing fits those filters right now. Clear them, or start your own lobby.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/lobbies" className="inline-flex h-10 items-center border border-white/20 px-5 font-mono text-xs font-bold uppercase tracking-[0.14em] hover:border-neon-green/60 hover:text-neon-green">
          Clear filters
        </Link>
        <Link href="/lobbies/new" className={CTA}>Create a lobby</Link>
      </div>
    </HudFrame>
  )
}
