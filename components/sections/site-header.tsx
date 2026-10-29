import { SignInButton, SignOutButton } from '@/components/auth/auth-buttons'
import { Logo } from '@/components/logo'
import { WaitlistLink } from '@/components/waitlist-link'
import { createClient } from '@/lib/supabase/server'

const LINKS = [
  { href: '/#how', label: 'How it works' },
  { href: '/#trust', label: 'Trust' },
  { href: '/#india', label: 'India' },
]

const NAV_BTN =
  'inline-flex h-9 items-center border border-white/15 px-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-foreground transition-colors hover:border-neon-green/60 hover:text-neon-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-green sm:px-4'

async function isSignedIn() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()
    return Boolean(data?.claims)
  } catch {
    // e.g. env keys missing: show the logged-out header instead of crashing.
    return false
  }
}

export async function SiteHeader() {
  const signedIn = await isSignedIn()

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-gradient-to-b from-background/90 to-transparent">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:h-20 md:px-10">
        <a href="/" className="rounded-md text-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-green">
          <Logo />
          <span className="sr-only"> home</span>
        </a>
        <nav aria-label="Primary" className="flex items-center gap-8">
          <ul className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-green">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 sm:gap-3">
            {signedIn ? (
              <>
                <a href="/players" className={NAV_BTN}>
                  Open app
                </a>
                <SignOutButton />
              </>
            ) : (
              <>
                <WaitlistLink variant="ghost">Join waitlist</WaitlistLink>
                <SignInButton />
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
