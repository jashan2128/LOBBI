'use client'

import { useActionState } from 'react'
import { createLobby, type CreateLobbyState } from '@/app/actions/lobbies'
import { GAMES, LOBBY_CITIES, LOBBY_SLOTS, LOBBY_TITLE } from '@/lib/profile-options'

const FIELD =
  'h-12 w-full border border-white/15 bg-[#0b0a14] px-4 text-base text-foreground placeholder:text-muted-foreground/60 focus:border-neon-green/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-green/40 [color-scheme:dark]'
const LABEL = 'mb-2 block font-mono text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground'

export function LobbyForm() {
  const [state, formAction, pending] = useActionState<CreateLobbyState, FormData>(createLobby, null)
  const slotOptions = Array.from({ length: LOBBY_SLOTS.max - LOBBY_SLOTS.min + 1 }, (_, i) => LOBBY_SLOTS.min + i)

  return (
    <form action={formAction} className="space-y-7">
      <div>
        <label htmlFor="title" className={LABEL}>Title</label>
        <input
          id="title"
          name="title"
          required
          minLength={LOBBY_TITLE.min}
          maxLength={LOBBY_TITLE.max}
          placeholder="e.g. Chill ranked, no tilt"
          className={FIELD}
        />
      </div>

      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor="game" className={LABEL}>Game</label>
          <select id="game" name="game" required defaultValue="" className={FIELD}>
            <option value="" disabled>Select a game</option>
            {GAMES.map((g) => (
              <option key={g.id} value={g.id}>{g.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="slots_total" className={LABEL}>Players (including you)</label>
          <select id="slots_total" name="slots_total" required defaultValue="5" className={FIELD}>
            {slotOptions.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor="play_time" className={LABEL}>Start time (India time)</label>
          <input id="play_time" name="play_time" type="datetime-local" required className={FIELD} />
        </div>
        <div>
          <label htmlFor="city" className={LABEL}>City</label>
          <select id="city" name="city" required defaultValue="" className={FIELD}>
            <option value="" disabled>Select a city</option>
            {LOBBY_CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <p aria-live="polite" className="mb-3 min-h-5 text-sm text-neon-purple">{state?.error}</p>
        <button
          type="submit"
          disabled={pending}
          className="group relative h-13 px-7 font-mono text-sm font-bold uppercase tracking-[0.16em] text-background focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-green disabled:cursor-wait disabled:opacity-70"
        >
          <span aria-hidden="true" className="clip-angle neon-btn absolute inset-0 bg-neon-green transition-colors duration-300 group-hover:bg-foreground" />
          <span className="relative">{pending ? 'Creating…' : 'Create lobby'}</span>
        </button>
      </div>
    </form>
  )
}
