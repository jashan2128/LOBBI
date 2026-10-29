// The allowed values for the profile form.
// The SAME lists exist in supabase/002_profiles.sql (city, game, play time).
// If you change one, change the other.

export const CITIES = [
  'Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
  'Jaipur', 'Lucknow', 'Chandigarh', 'Kochi', 'Indore', 'Bhopal', 'Nagpur', 'Surat',
  'Visakhapatnam', 'Coimbatore', 'Guwahati', 'Bhubaneswar', 'Patna', 'Thiruvananthapuram',
  'Mysuru', 'Vadodara', 'Other India',
] as const

export const GAMES = [
  { id: 'valorant', label: 'Valorant' },
  { id: 'cs2', label: 'CS2' },
  { id: 'dota2', label: 'Dota 2' },
  { id: 'apex', label: 'Apex Legends' },
  { id: 'r6', label: 'Rainbow Six Siege' },
  { id: 'other', label: 'Other' },
] as const

export type GameId = (typeof GAMES)[number]['id']

export const RANKS: Record<GameId, readonly string[]> = {
  valorant: ['Unranked', 'Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ascendant', 'Immortal', 'Radiant'],
  cs2: ['Unranked', 'Silver', 'Gold Nova', 'Master Guardian', 'Legendary Eagle', 'Supreme', 'Global Elite'],
  dota2: ['Unranked', 'Herald', 'Guardian', 'Crusader', 'Archon', 'Legend', 'Ancient', 'Divine', 'Immortal'],
  apex: ['Unranked', 'Rookie', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Predator'],
  r6: ['Unranked', 'Copper', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Emerald', 'Diamond', 'Champion'],
  other: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
}

export const PLAY_TIMES = [
  { id: 'weekday_mornings', label: 'Weekday mornings' },
  { id: 'weekday_afternoons', label: 'Weekday afternoons' },
  { id: 'weekday_evenings', label: 'Weekday evenings' },
  { id: 'weekday_nights', label: 'Weekday nights' },
  { id: 'weekends', label: 'Weekends' },
  { id: 'late_night', label: 'Late night (after midnight)' },
] as const

export const DISPLAY_NAME_PATTERN = /^[\p{L}\p{N} ._-]{2,24}$/u

// ---- Lobbies (Phase 4). The same limits exist in supabase/004_lobbies.sql ----
export const LOBBY_CITIES = [...CITIES, 'Anywhere (online)'] as const
export const LOBBY_SLOTS = { min: 2, max: 5 } as const
export const LOBBY_TITLE = { min: 3, max: 60 } as const
export const WHEN_OPTIONS = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'Next 7 days' },
] as const
