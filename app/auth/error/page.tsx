import { AppShell } from '@/components/app-shell'
import { HudFrame } from '@/components/hud-frame'
import { SignInButton } from '@/components/auth/auth-buttons'

export const metadata = { title: 'Sign-in problem — Lobbi', robots: { index: false } }

export default function AuthErrorPage() {
  return (
    <AppShell>
      <HudFrame tone="purple" className="px-6 py-12 text-center">
        <h1 className="font-display text-3xl font-bold uppercase">Sign-in did not work</h1>
        <p className="mx-auto mt-3 max-w-md text-pretty text-muted-foreground">
          Discord or our server said no. This can happen if you cancelled, or if the link expired. Please try again.
        </p>
        <div className="mt-6 flex justify-center">
          <SignInButton />
        </div>
      </HudFrame>
    </AppShell>
  )
}
