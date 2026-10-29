'use client'

import { type FormEvent, useId, useState } from 'react'
import Link from 'next/link'
import { joinWaitlist } from '@/app/actions/waitlist'
import { WAITLIST_INPUT_ID } from '@/components/waitlist-link'

type Status = 'idle' | 'submitting' | 'done' | 'invalid' | 'limited' | 'network' | 'unknown'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [alreadyJoined, setAlreadyJoined] = useState(false)
  const messageId = useId()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'submitting') return
    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus('invalid')
      return
    }
    setStatus('submitting')
    try {
      const result = await joinWaitlist(email)
      if (result.ok) {
        setAlreadyJoined(result.alreadyJoined)
        setStatus('done')
      } else {
        setStatus(result.reason === 'invalid' ? 'invalid' : result.reason === 'rate_limited' ? 'limited' : 'unknown')
      }
    } catch {
      // The request never reached the server (offline, timeout, etc.)
      setStatus('network')
    }
  }

  if (status === 'done') {
    return (
      <div role="status" className="border border-neon-green/40 bg-neon-green/[0.06] p-6 text-center md:p-8">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-neon-green">Match found</p>
        <p className="font-display mt-2 text-3xl font-bold uppercase text-foreground">
          {alreadyJoined ? "You're already on the list." : "You're in the lobby."}
        </p>
        <p className="mt-2 text-pretty text-muted-foreground">
          {"We'll"} email <span className="text-foreground">{email.trim()}</span> when Lobbi opens near you.
        </p>
      </div>
    )
  }

  const invalid = status === 'invalid'
  const failed = status === 'network' || status === 'unknown' || status === 'limited'

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      <label htmlFor={WAITLIST_INPUT_ID} className="mb-3 block text-sm text-muted-foreground">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={WAITLIST_INPUT_ID}
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (invalid || failed) setStatus('idle')
          }}
          aria-invalid={invalid}
          aria-describedby={messageId}
          className="h-13 min-w-0 flex-1 border border-white/15 bg-white/[0.04] px-5 text-base text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-neon-green/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-green/40 aria-[invalid=true]:border-neon-purple"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="group relative h-13 shrink-0 px-7 font-mono text-sm font-bold uppercase tracking-[0.16em] text-background focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-green disabled:cursor-wait disabled:opacity-70"
        >
          <span aria-hidden="true" className="clip-angle neon-btn absolute inset-0 bg-neon-green transition-colors duration-300 group-hover:bg-foreground" />
          <span className="relative">{status === 'submitting' ? 'Locking in…' : 'Join the waitlist'}</span>
        </button>
      </div>
      <p id={messageId} aria-live="polite" className="mt-3 min-h-5 text-sm">
        {invalid ? (
          <span className="text-neon-purple">That email looks off. Mind checking it?</span>
        ) : status === 'network' ? (
          <span className="text-neon-purple">Could not reach the server. Check your internet and try again.</span>
        ) : status === 'limited' ? (
          <span className="text-neon-purple">Too many tries from your connection. Please wait a while and try again.</span>
        ) : status === 'unknown' ? (
          <span className="text-neon-purple">Something went wrong on our side. Please try again in a minute.</span>
        ) : (
          <span className="text-muted-foreground">One email when your city opens. Nothing else.</span>
        )}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground/70">
        {"We use your email only to tell you when Lobbi opens in your city. We don't sell or share it."}{' '}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
          Privacy policy
        </Link>
      </p>
    </form>
  )
}
