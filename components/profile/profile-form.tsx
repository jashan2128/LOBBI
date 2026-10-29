'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import { saveProfile, type SaveProfileState } from '@/app/actions/profile'
import { CITIES, GAMES, PLAY_TIMES, RANKS, type GameId } from '@/lib/profile-options'

export type ProfileDefaults = {
  displayName: string
  city: string
  playTimes: string[]
  games: Partial<Record<GameId, string>>
  is18: boolean
}

const FIELD =
  'h-12 w-full border border-white/15 bg-white/[0.04] px-4 text-base text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-neon-green/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-green/40'
const LABEL = 'mb-2 block font-mono text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground'

export function ProfileForm({ defaults, submitLabel }: { defaults: ProfileDefaults; submitLabel: string }) {
  const [state, formAction, pending] = useActionState<SaveProfileState, FormData>(saveProfile, null)

  // Controlled inputs, so what you typed is kept if the server sends back an error.
  const [displayName, setDisplayName] = useState(defaults.displayName)
  const [city, setCity] = useState(defaults.city)
  const [playTimes, setPlayTimes] = useState<string[]>(defaults.playTimes)
  const [games, setGames] = useState<Partial<Record<GameId, string>>>(defaults.games)
  const [is18, setIs18] = useState(defaults.is18)

  const toggleGame = (id: GameId, on: boolean) =>
    setGames((prev) => {
      const next = { ...prev }
      if (on) next[id] = RANKS[id][0]
      else delete next[id]
      return next
    })

  const togglePlayTime = (id: string, on: boolean) =>
    setPlayTimes((prev) => (on ? [...prev, id] : prev.filter((t) => t !== id)))

  return (
    <form action={formAction} className="space-y-9">
      <div>
        <label htmlFor="display_name" className={LABEL}>
          Display name
        </label>
        <input
          id="display_name"
          name="display_name"
          required
          minLength={2}
          maxLength={24}
          autoComplete="nickname"
          placeholder="What teammates will see"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className={FIELD}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Shown to other players. Not your Discord name, and not your real name unless you want it to be.
        </p>
      </div>

      <div>
        <label htmlFor="city" className={LABEL}>
          City
        </label>
        <select id="city" name="city" required value={city} onChange={(e) => setCity(e.target.value)} className={`${FIELD} bg-[#0b0a14]`}>
          <option value="" disabled>
            Select your city
          </option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className={LABEL}>Games you play</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {GAMES.map((g) => {
            const selected = games[g.id] !== undefined
            return (
              <div key={g.id} className={`border p-4 transition-colors ${selected ? 'border-neon-green/50 bg-neon-green/[0.04]' : 'border-white/10'}`}>
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    name="games"
                    value={g.id}
                    checked={selected}
                    onChange={(e) => toggleGame(g.id, e.target.checked)}
                    className="size-5 accent-neon-green"
                  />
                  <span className="font-medium">{g.label}</span>
                </label>
                {selected && (
                  <div className="mt-3">
                    <label htmlFor={`rank_${g.id}`} className="sr-only">
                      {g.label} rank
                    </label>
                    <select
                      id={`rank_${g.id}`}
                      name={`rank_${g.id}`}
                      value={games[g.id]}
                      onChange={(e) => setGames((prev) => ({ ...prev, [g.id]: e.target.value }))}
                      className="h-10 w-full border border-white/15 bg-[#0b0a14] px-3 text-sm focus:border-neon-green/70 focus:outline-none"
                    >
                      {RANKS[g.id].map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className={LABEL}>Usual play time</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {PLAY_TIMES.map((t) => (
            <label key={t.id} className="flex cursor-pointer items-center gap-3 border border-white/10 p-3">
              <input
                type="checkbox"
                name="play_times"
                value={t.id}
                checked={playTimes.includes(t.id)}
                onChange={(e) => togglePlayTime(t.id, e.target.checked)}
                className="size-5 accent-neon-green"
              />
              <span className="text-sm">{t.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex cursor-pointer items-start gap-3 border border-white/10 p-4">
        <input
          type="checkbox"
          name="is_18_plus"
          required
          checked={is18}
          onChange={(e) => setIs18(e.target.checked)}
          className="mt-0.5 size-5 accent-neon-green"
        />
        <span className="text-sm leading-relaxed">I am 18 or older.</span>
      </label>
      <p className="-mt-5 text-xs leading-relaxed text-muted-foreground">
        By saving, you agree to our{' '}
        <Link href="/terms" target="_blank" className="underline underline-offset-2 hover:text-foreground">Terms</Link> and{' '}
        <Link href="/privacy" target="_blank" className="underline underline-offset-2 hover:text-foreground">Privacy Policy</Link>.
      </p>

      <div>
        <p aria-live="polite" className="mb-3 min-h-5 text-sm text-neon-purple">
          {state?.error}
        </p>
        <button
          type="submit"
          disabled={pending}
          className="group relative h-13 px-7 font-mono text-sm font-bold uppercase tracking-[0.16em] text-background focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-green disabled:cursor-wait disabled:opacity-70"
        >
          <span aria-hidden="true" className="clip-angle neon-btn absolute inset-0 bg-neon-green transition-colors duration-300 group-hover:bg-foreground" />
          <span className="relative">{pending ? 'Saving…' : submitLabel}</span>
        </button>
      </div>
    </form>
  )
}
