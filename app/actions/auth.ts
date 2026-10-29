'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signInWithDiscord() {
  const supabase = await createClient()
  const h = await headers()
  // Supabase only accepts redirect addresses on its allow-list, so a faked
  // origin header cannot send people to another site.
  const origin = h.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: { redirectTo: `${origin}/auth/callback` },
  })
  if (error || !data.url) redirect('/auth/error')
  redirect(data.url) // sends the browser to Discord
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
