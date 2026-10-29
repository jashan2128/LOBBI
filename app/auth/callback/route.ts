import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Discord -> Supabase -> here. We receive a one-time "code" and swap it
// for a real login session (stored in a cookie).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    // /players sends brand-new users on to /onboarding by itself.
    if (!error) return NextResponse.redirect(`${origin}/players`)
  }
  return NextResponse.redirect(`${origin}/auth/error`)
}
