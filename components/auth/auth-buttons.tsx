import { signInWithDiscord, signOut } from '@/app/actions/auth'

const GHOST =
  'h-9 border border-white/15 px-4 font-mono text-xs font-bold uppercase tracking-[0.14em] text-foreground transition-colors hover:border-neon-green/60 hover:text-neon-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-green'

export function SignInButton() {
  return (
    <form action={signInWithDiscord}>
      <button type="submit" className={GHOST} title="Sign in with Discord">
        Sign in
      </button>
    </form>
  )
}

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button type="submit" className={GHOST}>
        Sign out
      </button>
    </form>
  )
}
