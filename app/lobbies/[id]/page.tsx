import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { HudFrame } from '@/components/hud-frame'
import { LobbyActions } from '@/components/lobbies/lobby-actions'
import { ReportButton } from '@/components/report-button'
import { StatusBadge } from '@/components/lobbies/lobby-card'
import { requireProfile } from '@/lib/auth'
import { formatIST, getLobbyDetail, LOBBY_ERRORS } from '@/lib/lobbies'
import { GAMES } from '@/lib/profile-options'

export const metadata = { title: 'Lobby — Lobbi', robots: { index: false } }

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function LobbyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  if (!UUID.test(id)) notFound()

  const { supabase, user } = await requireProfile()
  const detail = await getLobbyDetail(supabase, id, user.id)
  if (!detail) notFound()

  const { lobby, members, isMember, isOwner } = detail
  const { error } = await searchParams
  // Only show messages we wrote ourselves, never text from the URL.
  const errorText = error && Object.hasOwn(LOBBY_ERRORS, error) ? LOBBY_ERRORS[error] : null

  const game = GAMES.find((g) => g.id === lobby.game)?.label ?? lobby.game
  const started = new Date(lobby.play_time).getTime() <= Date.now()

  return (
    <AppShell>
      <Link href="/lobbies" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
        ← All lobbies
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-neon-green">{game}</p>
        <StatusBadge status={lobby.status} />
      </div>
      <h1 className="font-display mt-3 text-4xl font-bold uppercase leading-none [overflow-wrap:anywhere] md:text-5xl">{lobby.title}</h1>

      {errorText && (
        <p role="alert" className="mt-6 border border-neon-purple/40 bg-neon-purple/[0.08] px-4 py-3 text-sm text-neon-purple">
          {errorText}
        </p>
      )}

      <HudFrame className="mt-8 p-5 md:p-6">
        <dl className="grid gap-5 sm:grid-cols-3">
          <div>
            <dt className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">Starts</dt>
            <dd className="mt-1">{formatIST(lobby.play_time)}</dd>
          </div>
          <div>
            <dt className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">City</dt>
            <dd className="mt-1">{lobby.city}</dd>
          </div>
          <div>
            <dt className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">Players</dt>
            <dd className="mt-1">
              {members.length} of {lobby.slots_total}
            </dd>
          </div>
        </dl>
        <div className="mt-6 border-t border-white/10 pt-5">
          <LobbyActions lobbyId={lobby.id} status={lobby.status} started={started} isMember={isMember} isOwner={isOwner} />
        </div>
        {!isOwner && (
          <div className="mt-4 flex justify-end">
            <ReportButton targetType="lobby" targetId={lobby.id} subject="this lobby" />
          </div>
        )}
      </HudFrame>

      <h2 className="font-display mt-12 text-2xl font-bold uppercase">Players in this lobby</h2>
      <ul className="mt-4 grid gap-3">
        {members.map((m) => (
          <li key={m.userId}>
            <HudFrame tone="blue" className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium [overflow-wrap:anywhere]">
                  {m.displayName}
                  {m.isOwner && <span className="ml-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-neon-green">Owner</span>}
                  {m.userId === user.id && <span className="ml-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">You</span>}
                </p>
                <div className="flex items-center gap-4">
                  {m.rank && <p className="font-mono text-xs text-neon-green">{m.rank}</p>}
                  {m.userId !== user.id && <ReportButton targetType="profile" targetId={m.userId} subject={m.displayName} />}
                </div>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{m.city}</p>
              {isMember && (
                <p className="mt-3 border-t border-white/10 pt-3 text-sm">
                  <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">Discord </span>
                  {m.discord ?? <span className="text-muted-foreground">not available</span>}
                </p>
              )}
            </HudFrame>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
        {isMember
          ? 'Discord usernames are only visible to people in this lobby, and stop being visible 12 hours after it starts, or when the lobby is closed.'
          : 'Join this lobby to see the other players’ Discord usernames. They are never shown to anyone outside the lobby.'}
      </p>
    </AppShell>
  )
}
