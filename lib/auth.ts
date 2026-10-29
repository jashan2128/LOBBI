import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type Profile = {
  user_id: string
  display_name: string
  city: string
  play_times: string[]
  is_18_plus: boolean
}
export type PlayerGame = { game: string; rank: string }

// Use at the top of any page that needs a logged-in user.
// getUser() asks Supabase to confirm the login is real (not just a cookie).
export async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/')
  return { supabase, user }
}

// Use on pages that need a finished profile. No profile yet = onboarding first.
export async function requireProfile() {
  const { supabase, user } = await requireUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('user_id, display_name, city, play_times, is_18_plus')
    .eq('user_id', user.id)
    .maybeSingle<Profile>()
  if (!profile || !profile.is_18_plus) redirect('/onboarding')

  const { data: games } = await supabase
    .from('player_games')
    .select('game, rank')
    .eq('user_id', user.id)
    .returns<PlayerGame[]>()

  return { supabase, user, profile, games: games ?? [] }
}
