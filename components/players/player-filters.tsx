'use client'

import Form from 'next/form'
import Link from 'next/link'
import { useState } from 'react'
import { CITIES, GAMES, PLAY_TIMES, RANKS, type GameId } from '@/lib/profile-options'
import type { PlayerFilters as Filters } from '@/lib/players'

const SELECT =
  'h-11 w-full border border-white/15 bg-[#0b0a14] px-3 text-sm text-foreground focus:border-neon-green/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-green/40 disabled:opacity-50'
const LABEL = 'mb-1.5 block font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground'

export function PlayerFilters({ current, active }: { current: Filters; active: boolean }) {
  // The rank list depends on the game, so we remember which game is picked.
  const [game, setGame] = useState<GameId | ''>(current.game ?? '')
  const [rank, setRank] = useState(current.rank ?? '')

  return (
    // Next's <Form> sends the choices as ?game=...&city=... to the same page (no page reload).
    <Form action="/players" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
      <div>
        <label htmlFor="f-game" className={LABEL}>Game</label>
        <select
          id="f-game"
          name="game"
          value={game}
          onChange={(e) => {
            setGame(e.target.value as GameId | '')
            setRank('')
          }}
          className={SELECT}
        >
          <option value="">Any game</option>
          {GAMES.map((g) => (
            <option key={g.id} value={g.id}>{g.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="f-rank" className={LABEL}>Rank</label>
        <select id="f-rank" name="rank" value={rank} onChange={(e) => setRank(e.target.value)} disabled={!game} className={SELECT}>
          <option value="">{game ? 'Any rank' : 'Pick a game first'}</option>
          {game && RANKS[game].map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="f-city" className={LABEL}>City</label>
        <select id="f-city" name="city" defaultValue={current.city ?? ''} className={SELECT}>
          <option value="">Any city</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="f-time" className={LABEL}>Play time</label>
        <select id="f-time" name="time" defaultValue={current.time ?? ''} className={SELECT}>
          <option value="">Any time</option>
          {PLAY_TIMES.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-4 sm:col-span-2 lg:col-span-1">
        <button
          type="submit"
          className="h-11 border border-neon-green/60 px-5 font-mono text-xs font-bold uppercase tracking-[0.16em] text-neon-green transition-colors hover:bg-neon-green hover:text-background focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-green"
        >
          Apply
        </button>
        {active && (
          <Link href="/players" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            Clear
          </Link>
        )}
      </div>
    </Form>
  )
}
