-- Phase 3: let signed-in members browse each other's players list.
-- Run this whole file once in Supabase -> SQL Editor (after 002).

-- ---------------------------------------------------------------
-- 1) has_profile(): "has the person asking finished onboarding (and ticked 18+)?"
--    Why a function: a policy on `profiles` that looks inside `profiles`
--    would loop forever. "security definer" lets this one check skip RLS.
-- ---------------------------------------------------------------
create function public.has_profile()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where user_id = (select auth.uid()) and is_18_plus
  );
$$;

revoke execute on function public.has_profile() from public, anon;
grant  execute on function public.has_profile() to authenticated;

-- ---------------------------------------------------------------
-- 2) Two new READ policies. Policies are OR-ed together, so the
--    "read own" policies from Phase 2 stay and these add to them.
-- ---------------------------------------------------------------
create policy "profiles: members can read all"
  on public.profiles for select to authenticated
  using ((select public.has_profile()));

create policy "player_games: members can read all"
  on public.player_games for select to authenticated
  using ((select public.has_profile()));

-- profile_private is NOT touched: the Discord username stays owner-only.

-- ---------------------------------------------------------------
-- 3) Indexes: like the index at the back of a book, they let the
--    database find rows for a filter without reading every row.
-- ---------------------------------------------------------------
create index player_games_game_rank_idx on public.player_games (game, rank);
create index profiles_city_created_idx  on public.profiles (city, created_at desc);
