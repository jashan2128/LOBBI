'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CITIES, DISPLAY_NAME_PATTERN, GAMES, PLAY_TIMES, RANKS, type GameId } from '@/lib/profile-options'

export type SaveProfileState = { error: string } | null

export async function saveProfile(_prev: SaveProfileState, formData: FormData): Promise<SaveProfileState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Your session expired. Please sign in again.' }

  // Never trust the browser: check everything again here.
  const displayName = String(formData.get('display_name') ?? '').trim().replace(/\s+/g, ' ')
  if (!DISPLAY_NAME_PATTERN.test(displayName)) {
    return { error: 'Display name: 2 to 24 characters. Letters, numbers, spaces, dots, dashes and underscores only.' }
  }

  const city = String(formData.get('city') ?? '')
  if (!(CITIES as readonly string[]).includes(city)) return { error: 'Please pick your city from the list.' }

  const gameIds = [...new Set(formData.getAll('games').map(String))]
  if (gameIds.length < 1) return { error: 'Pick at least one game.' }
  const games: { game: string; rank: string }[] = []
  for (const id of gameIds) {
    if (!GAMES.some((g) => g.id === id)) return { error: 'Unknown game selected.' }
    const rank = String(formData.get(`rank_${id}`) ?? '')
    if (!RANKS[id as GameId].includes(rank)) return { error: 'Please pick a rank for every game you selected.' }
    games.push({ game: id, rank })
  }

  const playTimes = [...new Set(formData.getAll('play_times').map(String))]
  if (playTimes.length < 1 || !playTimes.every((t) => PLAY_TIMES.some((p) => p.id === t))) {
    return { error: 'Pick at least one usual play time.' }
  }

  if (formData.get('is_18_plus') !== 'on') return { error: 'You must be 18 or older to use Lobbi.' }

  const { error } = await supabase.rpc('save_profile', {
    p_display_name: displayName,
    p_city: city,
    p_play_times: playTimes,
    p_is_18_plus: true,
    p_games: games,
  })
  if (error) {
    console.error('save_profile failed', error.code, error.message)
    return { error: 'Could not save your profile. Please try again.' }
  }

  revalidatePath('/profile')
  redirect('/profile?saved=1')
}
