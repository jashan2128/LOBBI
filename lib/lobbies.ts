import type { SupabaseClient } from '@supabase/supabase-js'
import { GAMES, LOBBY_CITIES, WHEN_OPTIONS, type GameId } from '@/lib/profile-options'

export const LOBBY_PAGE_SIZE = 12

export type LobbyStatus = 'open' | 'full' | 'closed'
export type LobbyFilters = { game?: GameId; city?: string; when?: 'today' | 'week' }

export type LobbyRow = {
  id: string
  owner_id: string
  game: GameId
  title: string
  slots_total: number
  play_time: string
  city: string
  status: LobbyStatus
}
export type LobbyCardData = LobbyRow & { ownerName: string; memberCount: number }

export type LobbyMember = {
  userId: string
  displayName: string
  city: string
  rank: string | null
  isOwner: boolean
  discord: string | null // stays null unless the database lets this viewer see it
}

// ---------- Time: everything is India time (IST, UTC+05:30, no daylight saving) ----------
const IST_MS = 5.5 * 60 * 60 * 1000

export function formatIST(iso: string) {
  const text = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  }).format(new Date(iso))
  return `${text} IST`
}

// The form sends "2026-10-30T21:30". We say that means India time.
export function istInputToIso(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null
  const date = new Date(`${value}:00+05:30`)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function endOfTodayIST(now: Date) {
  const ist = new Date(now.getTime() + IST_MS)
  return new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate() + 1) - IST_MS)
}

// ---------- URL filters ----------
type SearchParams = Record<string, string | string[] | undefined>
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

export function parseLobbyFilters(sp: SearchParams): { filters: LobbyFilters; page: number } {
  const filters: LobbyFilters = {}
  const game = first(sp.game)
  if (game && GAMES.some((g) => g.id === game)) filters.game = game as GameId
  const city = first(sp.city)
  if (city && (LOBBY_CITIES as readonly string[]).includes(city)) filters.city = city
  const when = first(sp.when)
  if (when && WHEN_OPTIONS.some((w) => w.id === when)) filters.when = when as 'today' | 'week'

  const n = Number.parseInt(first(sp.page) ?? '1', 10)
  const page = Number.isFinite(n) && n >= 1 ? Math.min(n, 10_000) : 1
  return { filters, page }
}

export const hasLobbyFilters = (f: LobbyFilters) => Boolean(f.game || f.city || f.when)

export function buildLobbyQuery(f: LobbyFilters, page: number) {
  const p = new URLSearchParams()
  if (f.game) p.set('game', f.game)
  if (f.city) p.set('city', f.city)
  if (f.when) p.set('when', f.when)
  if (page > 1) p.set('page', String(page))
  const s = p.toString()
  return s ? `?${s}` : ''
}

// ---------- Messages for the errors our database functions raise ----------
export const LOBBY_ERRORS: Record<string, string> = {
  not_signed_in: 'Your session expired. Please sign in again.',
  profile_required: 'Finish your profile first.',
  play_time_past: 'Pick a start time that is in the future.',
  rate_limited: 'You are creating lobbies too fast. Please wait a while and try again.',
  limit_open_lobbies: 'You already have 3 active lobbies. Close one before creating another.',
  limit_memberships: 'You are in 5 active lobbies already. Leave one before joining another.',
  lobby_not_found: 'That lobby does not exist.',
  lobby_not_open: 'This lobby is full or closed.',
  lobby_expired: 'This lobby has already started.',
  already_member: 'You are already in this lobby.',
  owner_cannot_leave: 'You own this lobby, so you cannot leave it. Close it instead.',
  not_member: 'You are not in this lobby.',
  not_owner: 'Only the owner can close a lobby.',
  invalid: 'Some details are not valid. Check the title, game, slots and city.',
  unknown: 'Something went wrong on our side. Please try again.',
}

export function lobbyErrorKey(error: { code?: string; message?: string }) {
  if (error.message && error.message in LOBBY_ERRORS) return error.message
  if (error.code === '23514') return 'invalid'
  return 'unknown'
}

// ---------- Reading lobbies ----------
export async function searchLobbies(supabase: SupabaseClient, filters: LobbyFilters, page: number) {
  const now = new Date()
  const from = (page - 1) * LOBBY_PAGE_SIZE

  let query = supabase
    .from('lobbies')
    .select('id, owner_id, game, title, slots_total, play_time, city, status', { count: 'exact' })
    .eq('status', 'open')
    .gt('play_time', now.toISOString())
  if (filters.game) query = query.eq('game', filters.game)
  if (filters.city) query = query.eq('city', filters.city)
  if (filters.when === 'today') query = query.lt('play_time', endOfTodayIST(now).toISOString())
  if (filters.when === 'week') query = query.lt('play_time', new Date(now.getTime() + 7 * 86_400_000).toISOString())

  const { data, count, error } = await query
    .order('play_time', { ascending: true })
    .order('id')
    .range(from, from + LOBBY_PAGE_SIZE - 1)
    .returns<LobbyRow[]>()
  if (error || !data) {
    console.error('searchLobbies failed', error?.code, error?.message)
    return { ok: false as const }
  }

  const ownerIds = [...new Set(data.map((l) => l.owner_id))]
  const lobbyIds = data.map((l) => l.id)
  const names = new Map<string, string>()
  const counts = new Map<string, number>()

  if (lobbyIds.length > 0) {
    const [owners, members] = await Promise.all([
      supabase.from('profiles').select('user_id, display_name').in('user_id', ownerIds).returns<{ user_id: string; display_name: string }[]>(),
      supabase.from('lobby_members').select('lobby_id').in('lobby_id', lobbyIds).returns<{ lobby_id: string }[]>(),
    ])
    if (owners.error || members.error) {
      console.error('lobby extras failed', owners.error?.message, members.error?.message)
      return { ok: false as const }
    }
    for (const o of owners.data ?? []) names.set(o.user_id, o.display_name)
    for (const m of members.data ?? []) counts.set(m.lobby_id, (counts.get(m.lobby_id) ?? 0) + 1)
  }

  const lobbies: LobbyCardData[] = data.map((l) => ({
    ...l,
    ownerName: names.get(l.owner_id) ?? 'Unknown',
    memberCount: counts.get(l.id) ?? 0,
  }))
  return { ok: true as const, lobbies, total: count ?? 0 }
}

export async function getLobbyDetail(supabase: SupabaseClient, lobbyId: string, viewerId: string) {
  const { data: lobby } = await supabase
    .from('lobbies')
    .select('id, owner_id, game, title, slots_total, play_time, city, status')
    .eq('id', lobbyId)
    .maybeSingle<LobbyRow>()
  if (!lobby) return null

  const { data: memberRows } = await supabase
    .from('lobby_members')
    .select('user_id, joined_at')
    .eq('lobby_id', lobbyId)
    .order('joined_at', { ascending: true })
    .returns<{ user_id: string; joined_at: string }[]>()
  const ids = (memberRows ?? []).map((m) => m.user_id)

  const [profiles, games, priv] =
    ids.length === 0
      ? [{ data: [] }, { data: [] }, { data: [] }]
      : await Promise.all([
          supabase.from('profiles').select('user_id, display_name, city').in('user_id', ids).returns<{ user_id: string; display_name: string; city: string }[]>(),
          supabase.from('player_games').select('user_id, rank').eq('game', lobby.game).in('user_id', ids).returns<{ user_id: string; rank: string }[]>(),
          // The database only returns rows the viewer is allowed to see (own row + lobby-mates).
          supabase.from('profile_private').select('user_id, discord_username').in('user_id', ids).returns<{ user_id: string; discord_username: string | null }[]>(),
        ])

  const byProfile = new Map((profiles.data ?? []).map((p) => [p.user_id, p]))
  const byRank = new Map((games.data ?? []).map((g) => [g.user_id, g.rank]))
  const byDiscord = new Map((priv.data ?? []).map((p) => [p.user_id, p.discord_username]))

  const members: LobbyMember[] = ids.map((id) => ({
    userId: id,
    displayName: byProfile.get(id)?.display_name ?? 'Unknown',
    city: byProfile.get(id)?.city ?? '',
    rank: byRank.get(id) ?? null,
    isOwner: id === lobby.owner_id,
    discord: byDiscord.get(id) ?? null,
  }))

  return { lobby, members, isMember: ids.includes(viewerId), isOwner: lobby.owner_id === viewerId }
}
