'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/players', label: 'Players' },
  { href: '/lobbies', label: 'Lobbies' },
  { href: '/profile', label: 'Profile' },
]

export function AppNav() {
  const pathname = usePathname()
  return (
    <nav aria-label="App" className="mb-10 flex gap-1 border-b border-white/10">
      {TABS.map((t) => {
        const active = pathname === t.href || pathname.startsWith(`${t.href}/`)
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? 'page' : undefined}
            className={`-mb-px border-b-2 px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.16em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-green ${
              active ? 'border-neon-green text-neon-green' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </Link>
        )
      })}
    </nav>
  )
}
