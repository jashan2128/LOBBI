import { redirect } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { HudFrame } from '@/components/hud-frame'
import { Eyebrow } from '@/components/sections/eyebrow'
import { ProfileForm } from '@/components/profile/profile-form'
import { requireUser } from '@/lib/auth'

export const metadata = { title: 'Set up your profile — Lobbi', robots: { index: false } }

export default async function OnboardingPage() {
  const { supabase, user } = await requireUser()

  // Already finished? Go to the profile page instead.
  const { data: existing } = await supabase.from('profiles').select('user_id').eq('user_id', user.id).maybeSingle()
  if (existing) redirect('/profile')

  return (
    <AppShell>
      <Eyebrow className="mb-5">Welcome to Lobbi</Eyebrow>
      <h1 className="font-display text-4xl font-bold uppercase leading-none md:text-5xl">Set up your player card</h1>
      <p className="mt-4 max-w-xl text-pretty text-muted-foreground">
        This is what other players will see. Your Discord username stays hidden. It is only shown to people who are in the same lobby as you.
      </p>
      <HudFrame className="mt-10 p-5 md:p-8">
        <ProfileForm
          submitLabel="Save and continue"
          defaults={{ displayName: '', city: '', playTimes: [], games: {}, is18: false }}
        />
      </HudFrame>
    </AppShell>
  )
}
