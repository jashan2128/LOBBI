import { HudFrame } from '@/components/hud-frame'
import { ReportButton } from '@/components/report-button'
import { GAMES, PLAY_TIMES } from '@/lib/profile-options'
import type { PlayerCardData } from '@/lib/players'

// Shows only public info. There is no Discord username anywhere in this data.
export function PlayerCard({ player }: { player: PlayerCardData }) {
  const times = player.playTimes
    .map((id) => PLAY_TIMES.find((t) => t.id === id)?.label)
    .filter(Boolean)
    .join(' · ')

  return (
    <HudFrame className="h-full p-5">
      <h2 className="font-display text-2xl font-bold uppercase leading-tight [overflow-wrap:anywhere]">{player.displayName}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{player.city}</p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {player.games.map((g) => (
          <li key={g.game} className="border border-neon-green/40 bg-neon-green/[0.05] px-2.5 py-1 font-mono text-xs">
            {GAMES.find((x) => x.id === g.game)?.label ?? g.game} <span className="text-neon-green">{g.rank}</span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        <span className="font-mono uppercase tracking-[0.16em]">Plays</span> {times}
      </p>

      <div className="mt-4 flex justify-end border-t border-white/10 pt-3">
        <ReportButton targetType="profile" targetId={player.userId} subject={player.displayName} />
      </div>
    </HudFrame>
  )
}
