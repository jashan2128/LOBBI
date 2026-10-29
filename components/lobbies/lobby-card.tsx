import Link from 'next/link'
import { HudFrame } from '@/components/hud-frame'
import { formatIST, type LobbyCardData, type LobbyStatus } from '@/lib/lobbies'
import { GAMES } from '@/lib/profile-options'

const BADGE: Record<LobbyStatus, string> = {
  open: 'border-neon-green/50 text-neon-green',
  full: 'border-neon-blue/50 text-neon-blue',
  closed: 'border-white/20 text-muted-foreground',
}

export function StatusBadge({ status }: { status: LobbyStatus }) {
  return (
    <span className={`border px-2 py-0.5 font-mono text-[0.68rem] font-bold uppercase tracking-[0.16em] ${BADGE[status]}`}>
      {status}
    </span>
  )
}

export function LobbyCard({ lobby }: { lobby: LobbyCardData }) {
  const game = GAMES.find((g) => g.id === lobby.game)?.label ?? lobby.game
  return (
    <Link
      href={`/lobbies/${lobby.id}`}
      className="group block h-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-green"
    >
      <HudFrame className="h-full p-5 transition-colors group-hover:border-neon-green/40">
        <div className="flex items-start justify-between gap-3">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-neon-green">{game}</p>
          <StatusBadge status={lobby.status} />
        </div>
        <h2 className="font-display mt-3 text-2xl font-bold uppercase leading-tight [overflow-wrap:anywhere]">{lobby.title}</h2>
        <p className="mt-3 text-sm">{formatIST(lobby.play_time)}</p>
        <p className="mt-1 text-sm text-muted-foreground">{lobby.city}</p>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-sm">
          <span className="text-muted-foreground">
            by <span className="text-foreground">{lobby.ownerName}</span>
          </span>
          <span className="font-mono text-xs">
            {lobby.memberCount}/{lobby.slots_total} players
          </span>
        </div>
      </HudFrame>
    </Link>
  )
}
