'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { istInputToIso, lobbyErrorKey, LOBBY_ERRORS } from '@/lib/lobbies'
import { GAMES, LOBBY_CITIES, LOBBY_SLOTS, LOBBY_TITLE } from '@/lib/profile-options'

export type CreateLobbyState = { error: string } | null

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function createLobby(_prev: CreateLobbyState, formData: FormData): Promise<CreateLobbyState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: LOBBY_ERRORS.not_signed_in }

  // Check everything again here. The database checks it a third time.
  const title = String(formData.get('title') ?? '').trim().replace(/\s+/g, ' ')
  if (title.length < LOBBY_TITLE.min || title.length > LOBBY_TITLE.max) {
    return { error: `Title must be ${LOBBY_TITLE.min} to ${LOBBY_TITLE.max} characters.` }
  }
  const game = String(formData.get('game') ?? '')
  if (!GAMES.some((g) => g.id === game)) return { error: 'Pick a game.' }

  const slots = Number.parseInt(String(formData.get('slots_total') ?? ''), 10)
  if (!Number.isInteger(slots) || slots < LOBBY_SLOTS.min || slots > LOBBY_SLOTS.max) {
    return { error: `Players must be between ${LOBBY_SLOTS.min} and ${LOBBY_SLOTS.max}.` }
  }
  const city = String(formData.get('city') ?? '')
  if (!(LOBBY_CITIES as readonly string[]).includes(city)) return { error: 'Pick a city, or "Anywhere (online)".' }

  const playTime = istInputToIso(String(formData.get('play_time') ?? ''))
  if (!playTime) return { error: 'Pick a start date and time.' }
  if (new Date(playTime).getTime() <= Date.now()) return { error: LOBBY_ERRORS.play_time_past }

  const { data, error } = await supabase.rpc('create_lobby', {
    p_game: game,
    p_title: title,
    p_slots_total: slots,
    p_play_time: playTime,
    p_city: city,
  })
  if (error || typeof data !== 'string') {
    if (error) console.error('create_lobby failed', error.code, error.message)
    return { error: LOBBY_ERRORS[error ? lobbyErrorKey(error) : 'unknown'] }
  }

  revalidatePath('/lobbies')
  redirect(`/lobbies/${data}`)
}

async function lobbyAction(fn: 'join_lobby' | 'leave_lobby' | 'close_lobby', formData: FormData) {
  const lobbyId = String(formData.get('lobby_id') ?? '')
  if (!UUID.test(lobbyId)) redirect('/lobbies')

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { error } = await supabase.rpc(fn, { p_lobby_id: lobbyId })
  revalidatePath('/lobbies')
  revalidatePath(`/lobbies/${lobbyId}`)
  if (error) {
    console.error(`${fn} failed`, error.code, error.message)
    redirect(`/lobbies/${lobbyId}?error=${lobbyErrorKey(error)}`)
  }
  redirect(`/lobbies/${lobbyId}`)
}

export async function joinLobby(formData: FormData) {
  await lobbyAction('join_lobby', formData)
}
export async function leaveLobby(formData: FormData) {
  await lobbyAction('leave_lobby', formData)
}
export async function closeLobby(formData: FormData) {
  await lobbyAction('close_lobby', formData)
}
