import Link from 'next/link'
import { Logo } from '@/components/logo'
import { CONTACT_EMAIL } from '@/lib/site'

const LINKS = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Contact', href: CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : '/privacy#contact' },
]

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex flex-col gap-2">
          <Logo />
          <p className="text-sm text-muted-foreground">Made in India, for people who play on PC.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex gap-6 text-sm text-muted-foreground">
            {LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-green">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="font-mono text-xs text-muted-foreground">{'\u00a9'} 2026 Lobbi</p>
      </div>
    </footer>
  )
}
