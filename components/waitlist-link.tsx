'use client'

import type { MouseEvent, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const WAITLIST_INPUT_ID = 'waitlist-email'

type WaitlistLinkProps = {
  children: ReactNode
  variant?: 'primary' | 'ghost'
  className?: string
}

export function WaitlistLink({ children, variant = 'primary', className }: WaitlistLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const section = document.getElementById('waitlist')
    const input = document.getElementById(WAITLIST_INPUT_ID)
    if (!section || !input) return
    event.preventDefault()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    section.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
    input.focus({ preventScroll: true })
  }

  return (
    <a
      href="/#waitlist"
      onClick={handleClick}
      className={cn(
        'group relative inline-flex items-center justify-center gap-2 font-mono font-bold uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-green',
        variant === 'primary' && 'h-13 px-7 text-sm tracking-[0.16em] text-background',
        variant === 'ghost' &&
          'h-9 border border-white/15 px-4 text-xs tracking-[0.14em] text-foreground transition-colors hover:border-neon-green/60 hover:text-neon-green',
        className,
      )}
    >
      {variant === 'primary' && (
        <span
          aria-hidden="true"
          className="clip-angle neon-btn absolute inset-0 bg-neon-green transition-[background-color,filter] duration-300 group-hover:bg-foreground"
        />
      )}
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </a>
  )
}
