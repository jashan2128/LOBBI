import Form from 'next/form'
import Link from 'next/link'
import { GAMES, LOBBY_CITIES, WHEN_OPTIONS } from '@/lib/profile-options'
import type { LobbyFilters as Filters } from '@/lib/lobbies'

const SELECT =
  'h-11 w-full border border-white/15 bg-[#0b0a14] px-3 text-sm text-foreground focus:border-neon-green/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-green/40'
const LABEL = 'mb-1.5 block font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground'

export function LobbyFilters({ current, active }: { current: Filters; active: boolean }) {
  return (
    <Form action="/lobbies" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
      <div>
        <label htmlFor="lf-game" className={LABEL}>Game</label>
        <select id="lf-game" name="game" defaultValue={current.game ?? ''} className={SELECT}>
          <option value="">Any game</option>
          {GAMES.map((g) => (
            <option key={g.id} value={g.id}>{g.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="lf-city" className={LABEL}>City</label>
        <select id="lf-city" name="city" defaultValue={current.city ?? ''} className={SELECT}>
          <option value="">Any city</option>
          {LOBBY_CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="lf-when" className={LABEL}>When</label>
        <select id="lf-when" name="when" defaultValue={current.when ?? ''} className={SELECT}>
          <option value="">Any time</option>
          {WHEN_OPTIONS.map((w) => (
            <option key={w.id} value={w.id}>{w.label}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="submit"
          className="h-11 border border-neon-green/60 px-5 font-mono text-xs font-bold uppercase tracking-[0.16em] text-neon-green transition-colors hover:bg-neon-green hover:text-background focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-green"
        >
          Apply
        </button>
        {active && (
          <Link href="/lobbies" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            Clear
          </Link>
        )}
      </div>
    </Form>
  )
}
