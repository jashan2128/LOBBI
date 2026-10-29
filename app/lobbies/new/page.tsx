import { AppShell } from '@/components/app-shell'
import { HudFrame } from '@/components/hud-frame'
import { LobbyForm } from '@/components/lobbies/lobby-form'
import { Eyebrow } from '@/components/sections/eyebrow'
import { requireProfile } from '@/lib/auth'

export const metadata = { title: 'Create a lobby — Lobbi', robots: { index: false } }

export default async function NewLobbyPage() {
  await requireProfile()
  return (
    <AppShell>
      <Eyebrow className="mb-5">New lobby</Eyebrow>
      <h1 className="font-display text-4xl font-bold uppercase leading-none md:text-5xl">Create a lobby</h1>
      <p className="mt-4 max-w-xl text-pretty text-muted-foreground">
        You can have up to 3 active lobbies at a time, with 2 to 5 players each (you count as one).
        Everyone who joins will be able to see your Discord username.
      </p>
      <HudFrame className="mt-10 p-5 md:p-8">
        <LobbyForm />
      </HudFrame>
    </AppShell>
  )
}
