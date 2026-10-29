import { closeLobby, joinLobby, leaveLobby } from '@/app/actions/lobbies'
import type { LobbyStatus } from '@/lib/lobbies'

const PRIMARY =
  'h-11 border border-neon-green/60 px-6 font-mono text-xs font-bold uppercase tracking-[0.16em] text-neon-green transition-colors hover:bg-neon-green hover:text-background focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-green'
const DANGER =
  'h-11 border border-neon-purple/60 px-6 font-mono text-xs font-bold uppercase tracking-[0.16em] text-neon-purple transition-colors hover:bg-neon-purple hover:text-background focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-purple'

export function LobbyActions({
  lobbyId,
  status,
  started,
  isMember,
  isOwner,
}: {
  lobbyId: string
  status: LobbyStatus
  started: boolean
  isMember: boolean
  isOwner: boolean
}) {
  if (isOwner) {
    if (status === 'closed') return <p className="text-sm text-muted-foreground">You closed this lobby.</p>
    return (
      <form action={closeLobby}>
        <input type="hidden" name="lobby_id" value={lobbyId} />
        <button type="submit" className={DANGER}>Close lobby</button>
      </form>
    )
  }
  if (isMember) {
    return (
      <form action={leaveLobby}>
        <input type="hidden" name="lobby_id" value={lobbyId} />
        <button type="submit" className={DANGER}>Leave lobby</button>
      </form>
    )
  }
  if (status === 'open' && !started) {
    return (
      <form action={joinLobby}>
        <input type="hidden" name="lobby_id" value={lobbyId} />
        <button type="submit" className={PRIMARY}>Join lobby</button>
      </form>
    )
  }
  return (
    <p className="text-sm text-muted-foreground">
      {started ? 'This lobby has already started.' : status === 'full' ? 'This lobby is full.' : 'This lobby is closed.'}
    </p>
  )
}
