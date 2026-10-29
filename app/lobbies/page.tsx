import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { HudFrame } from '@/components/hud-frame'
import { LobbyCard } from '@/components/lobbies/lobby-card'
import { NoLobbiesYet, NoLobbyMatches } from '@/components/lobbies/lobby-empty'
import { LobbyFilters } from '@/components/lobbies/lobby-filters'
import { Pagination } from '@/components/players/pagination'
import { Eyebrow } from '@/components/sections/eyebrow'
import { requireProfile } from '@/lib/auth'
import { buildLobbyQuery, hasLobbyFilters, LOBBY_PAGE_SIZE, parseLobbyFilters, searchLobbies } from '@/lib/lobbies'

export const metadata = { title: 'Lobbies — Lobbi', robots: { index: false } }

export default async function LobbiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { supabase } = await requireProfile()
  const { filters, page } = parseLobbyFilters(await searchParams)
  const result = await searchLobbies(supabase, filters, page)
  const filtered = hasLobbyFilters(filters)

  if (!result.ok) {
    return (
      <AppShell size="wide">
        <HudFrame tone="purple" className="px-6 py-12 text-center">
          <h1 className="font-display text-3xl font-bold uppercase">Could not load lobbies</h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">Something went wrong on our side. Please refresh in a minute.</p>
        </HudFrame>
      </AppShell>
    )
  }

  const { lobbies, total } = result
  const totalPages = Math.max(1, Math.ceil(total / LOBBY_PAGE_SIZE))
  if (page > totalPages) redirect(`/lobbies${buildLobbyQuery(filters, totalPages)}`)

  return (
    <AppShell size="wide">
      <Eyebrow className="mb-5">Squad up</Eyebrow>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold uppercase leading-none md:text-5xl">Open lobbies</h1>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground" aria-live="polite">
            {total} {total === 1 ? 'lobby' : 'lobbies'}
            {filtered ? ' match' : ''}
          </p>
        </div>
        <Link
          href="/lobbies/new"
          className="inline-flex h-11 items-center border border-neon-green/60 px-6 font-mono text-xs font-bold uppercase tracking-[0.16em] text-neon-green transition-colors hover:bg-neon-green hover:text-background focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-green"
        >
          Create lobby
        </Link>
      </div>

      <HudFrame className="mt-8 p-5">
        <LobbyFilters key={buildLobbyQuery(filters, 1)} current={filters} active={filtered} />
      </HudFrame>

      <div className="mt-8">
        {total === 0 ? (
          filtered ? <NoLobbyMatches /> : <NoLobbiesYet />
        ) : (
          <>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lobbies.map((l) => (
                <li key={l.id}>
                  <LobbyCard lobby={l} />
                </li>
              ))}
            </ul>
            <Pagination page={page} totalPages={totalPages} hrefFor={(p) => `/lobbies${buildLobbyQuery(filters, p)}`} />
          </>
        )}
      </div>
    </AppShell>
  )
}
