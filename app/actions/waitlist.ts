'use server'

import { isRateLimited } from '@/lib/rate-limit'
import { createAnonClient } from '@/lib/supabase/server-anon'

export type JoinWaitlistResult =
  | { ok: true; alreadyJoined: boolean }
  | { ok: false; reason: 'invalid' | 'rate_limited' | 'unknown' }

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function joinWaitlist(rawEmail: string): Promise<JoinWaitlistResult> {
  // Never trust the browser: validate again on the server.
  const email = String(rawEmail ?? '').trim().toLowerCase()
  if (email.length < 5 || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { ok: false, reason: 'invalid' }
  }

  // At most 20 tries per hour from one connection. Many students can share one
  // network, so this is generous on purpose.
  if (await isRateLimited('waitlist', 20, 3600)) return { ok: false, reason: 'rate_limited' }

  try {
    const supabase = createAnonClient()
    const { error } = await supabase.from('waitlist').insert({ email })

    if (!error) return { ok: true, alreadyJoined: false }
    // 23505 = Postgres "unique violation": this email is already in the table.
    if (error.code === '23505') return { ok: true, alreadyJoined: true }
    // 23514 = "check violation": the database rejected the email format.
    if (error.code === '23514') return { ok: false, reason: 'invalid' }

    console.error('waitlist insert failed', error.code, error.message)
    return { ok: false, reason: 'unknown' }
  } catch (err) {
    console.error('waitlist action crashed', err)
    return { ok: false, reason: 'unknown' }
  }
}
