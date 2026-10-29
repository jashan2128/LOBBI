import { redirect } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { HudFrame } from '@/components/hud-frame'
import { Pagination } from '@/components/players/pagination'
import { PlayerCard } from '@/components/players/player-card'
import { PlayerFilters } from '@/components/players/player-filters'
import { FewPlayersNote, NoMatches, NoPlayersYet } from '@/components/players/players-empty'
import { Eyebrow } from '@/components/sections/eyebrow'
import { requireProfile } from '@/lib/auth'
import { buildQuery, hasFilters, PAGE_SIZE, parseFilters, searchPlayers } from '@/lib/players'

export const metadata = { title: 'Players — Lobbi', robots: { index: false } }

const FEW = 5 // below this many players (with no filters) we show the "few players" note

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  // Not logged in -> home. No profile yet -> onboarding.
  const { supabase, user } = await requireProfile()
  const { filters, page } = parseFilters(await searchParams)
  const result = await searchPlayers(supabase, user.id, filters, page)

  const filtered = hasFilters(filters)

  if (!result.ok) {
    return (
      <AppShell size="wide">
        <HudFrame tone="purple" className="px-6 py-12 text-center">
          <h1 className="font-display text-3xl font-bold uppercase">Could not load players</h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">Something went wrong on our side. Please refresh in a minute.</p>
        </HudFrame>
      </AppShell>
    )
  }

  const { players, total } = result
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  // Someone typed ?page=99: jump to the last real page.
  if (page > totalPages) redirect(`/players${buildQuery(filters, totalPages)}`)

  return (
    <AppShell size="wide">
      <Eyebrow className="mb-5">Find teammates</Eyebrow>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-4xl font-bold uppercase leading-none md:text-5xl">Players</h1>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground" aria-live="polite">
          {total} {total === 1 ? 'player' : 'players'}
          {filtered ? ' match' : ''}
        </p>
      </div>

      <HudFrame className="mt-8 p-5">
        <PlayerFilters key={buildQuery(filters, 1)} current={filters} active={filtered} />
      </HudFrame>

      <div className="mt-8">
        {total === 0 ? (
          filtered ? <NoMatches /> : <NoPlayersYet />
        ) : (
          <>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {players.map((p) => (
                <li key={p.userId}>
                  <PlayerCard player={p} />
                </li>
              ))}
            </ul>
            {!filtered && total < FEW && <FewPlayersNote total={total} />}
            <Pagination page={page} totalPages={totalPages} hrefFor={(p) => `/players${buildQuery(filters, p)}`} />
          </>
        )}
      </div>
    </AppShell>
  )
}
