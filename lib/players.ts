import type { SupabaseClient } from '@supabase/supabase-js'
import { CITIES, GAMES, PLAY_TIMES, RANKS, type GameId } from '@/lib/profile-options'

export const PAGE_SIZE = 12

export type PlayerFilters = { game?: GameId; rank?: string; city?: string; time?: string }

export type PlayerCardData = {
  userId: string
  displayName: string
  city: string
  playTimes: string[]
  games: { game: GameId; rank: string }[]
}

type SearchParams = Record<string, string | string[] | undefined>

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

// The URL can say anything, so only keep values that are on our allowed lists.
export function parseFilters(sp: SearchParams): { filters: PlayerFilters; page: number } {
  const filters: PlayerFilters = {}

  const game = first(sp.game)
  if (game && GAMES.some((g) => g.id === game)) {
    filters.game = game as GameId
    const rank = first(sp.rank)
    if (rank && RANKS[filters.game].includes(rank)) filters.rank = rank // rank only makes sense with a game
  }
  const city = first(sp.city)
  if (city && (CITIES as readonly string[]).includes(city)) filters.city = city
  const time = first(sp.time)
  if (time && PLAY_TIMES.some((t) => t.id === time)) filters.time = time

  const n = Number.parseInt(first(sp.page) ?? '1', 10)
  const page = Number.isFinite(n) && n >= 1 ? Math.min(n, 10_000) : 1
  return { filters, page }
}

export function hasFilters(f: PlayerFilters) {
  return Boolean(f.game || f.rank || f.city || f.time)
}

export function buildQuery(f: PlayerFilters, page: number) {
  const p = new URLSearchParams()
  if (f.game) p.set('game', f.game)
  if (f.rank) p.set('rank', f.rank)
  if (f.city) p.set('city', f.city)
  if (f.time) p.set('time', f.time)
  if (page > 1) p.set('page', String(page))
  const s = p.toString()
  return s ? `?${s}` : ''
}

type ProfileRow = { user_id: string; display_name: string; city: string; play_times: string[] }
type GameRow = { user_id: string; game: GameId; rank: string }

// Row Level Security still decides what comes back: only members with a
// finished profile get rows, and the Discord username is never selected here.
export async function searchPlayers(supabase: SupabaseClient, myId: string, filters: PlayerFilters, page: number) {
  const from = (page - 1) * PAGE_SIZE

  // "!inner" = only keep profiles that have a matching game row.
  const select = filters.game
    ? 'user_id, display_name, city, play_times, player_games!inner(game, rank)'
    : 'user_id, display_name, city, play_times'

  let query = supabase.from('profiles').select(select, { count: 'exact' }).neq('user_id', myId)
  if (filters.game) {
    query = query.eq('player_games.game', filters.game)
    if (filters.rank) query = query.eq('player_games.rank', filters.rank)
  }
  if (filters.city) query = query.eq('city', filters.city)
  if (filters.time) query = query.contains('play_times', [filters.time])

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .order('user_id')
    .range(from, from + PAGE_SIZE - 1)
    .returns<ProfileRow[]>()

  if (error || !data) {
    console.error('searchPlayers failed', error?.code, error?.message)
    return { ok: false as const }
  }

  // The filter above would hide a player's OTHER games, so load every game for these players.
  const ids = data.map((p) => p.user_id)
  const gamesByUser = new Map<string, { game: GameId; rank: string }[]>()
  if (ids.length > 0) {
    const { data: gameRows, error: gamesError } = await supabase
      .from('player_games')
      .select('user_id, game, rank')
      .in('user_id', ids)
      .returns<GameRow[]>()
    if (gamesError) {
      console.error('player_games load failed', gamesError.code, gamesError.message)
      return { ok: false as const }
    }
    for (const row of gameRows ?? []) {
      const list = gamesByUser.get(row.user_id) ?? []
      list.push({ game: row.game, rank: row.rank })
      gamesByUser.set(row.user_id, list)
    }
  }

  const order = GAMES.map((g) => g.id)
  const players: PlayerCardData[] = data.map((p) => ({
    userId: p.user_id,
    displayName: p.display_name,
    city: p.city,
    playTimes: p.play_times,
    games: (gamesByUser.get(p.user_id) ?? []).sort((a, b) => order.indexOf(a.game) - order.indexOf(b.game)),
  }))

  return { ok: true as const, players, total: count ?? 0 }
}
