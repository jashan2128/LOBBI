import { AppShell } from '@/components/app-shell'
import { HudFrame } from '@/components/hud-frame'
import { ProfileForm } from '@/components/profile/profile-form'
import { Eyebrow } from '@/components/sections/eyebrow'
import { requireProfile } from '@/lib/auth'
import { GAMES, type GameId } from '@/lib/profile-options'

export const metadata = { title: 'Your profile — Lobbi', robots: { index: false } }

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { supabase, user, profile, games } = await requireProfile()
  const { saved } = await searchParams

  // Only YOU can read this row (see the profile_private policy).
  const { data: priv } = await supabase
    .from('profile_private')
    .select('discord_username')
    .eq('user_id', user.id)
    .maybeSingle<{ discord_username: string | null }>()

  const gameDefaults: Partial<Record<GameId, string>> = {}
  for (const g of games) {
    if (GAMES.some((x) => x.id === g.game)) gameDefaults[g.game as GameId] = g.rank
  }

  return (
    <AppShell>
      <Eyebrow className="mb-5">Your account</Eyebrow>
      <h1 className="font-display text-4xl font-bold uppercase leading-none md:text-5xl">Your player card</h1>

      {saved && (
        <p role="status" className="mt-6 border border-neon-green/40 bg-neon-green/[0.06] px-4 py-3 text-sm text-neon-green">
          Saved.
        </p>
      )}

      <HudFrame tone="purple" className="mt-8 p-5">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Your Discord username</p>
        <p className="mt-1 text-lg">{priv?.discord_username ?? 'Not available'}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Private. Only people in the same lobby as you will be able to see it. Everyone else cannot.
        </p>
      </HudFrame>

      <HudFrame className="mt-6 p-5 md:p-8">
        <ProfileForm
          submitLabel="Save changes"
          defaults={{
            displayName: profile.display_name,
            city: profile.city,
            playTimes: profile.play_times,
            games: gameDefaults,
            is18: profile.is_18_plus,
          }}
        />
      </HudFrame>
    </AppShell>
  )
}
