import 'server-only'
import { createHmac } from 'node:crypto'
import { headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

// Counts how many times one visitor (by IP address) did something in a time window.
// Uses the SECRET service_role key, because only our server may call check_rate_limit.
// This is the ONLY place the secret key is used, and it never leaves the server.
//
// Returns true when the visitor has done it too many times.
// If the limiter itself is unavailable we let the request through (fail open),
// so a hiccup never blocks real signups.
export async function isRateLimited(name: string, limit: number, windowSeconds: number): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !secret) {
    console.warn('Rate limiting is OFF: SUPABASE_SERVICE_ROLE_KEY is not set.')
    return false
  }

  const h = await headers()
  // On Vercel the platform sets the visitor's IP. On your own computer there is none,
  // so in development we use a fixed one, which lets you test the limit locally.
  const ip = h.get('x-real-ip') ?? h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? (process.env.NODE_ENV !== 'production' ? '127.0.0.1' : undefined)
  if (!ip) return false

  // Store a scrambled version of the IP, never the IP itself.
  const visitor = createHmac('sha256', secret).update(ip).digest('hex').slice(0, 32)

  try {
    const admin = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } })
    const { data, error } = await admin.rpc('check_rate_limit', {
      p_key: `${name}:${visitor}`,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    })
    if (error) {
      console.error('check_rate_limit failed', error.code, error.message)
      return false
    }
    return data === false
  } catch (err) {
    console.error('rate limiter crashed', err)
    return false
  }
}
