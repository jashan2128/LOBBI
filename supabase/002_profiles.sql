-- Phase 2: profiles, games, private Discord username, RLS, save function
-- Run this whole file once in Supabase -> SQL Editor.

-- ---------------------------------------------------------------
-- 1) profiles: public-facing info (shown to other players in Phase 3)
-- ---------------------------------------------------------------
create table public.profiles (
  user_id      uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  city         text not null,
  play_times   text[] not null,
  is_18_plus   boolean not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  constraint profiles_display_name_length check (char_length(display_name) between 2 and 24),
  constraint profiles_city_allowed check (city in (
    'Bengaluru','Mumbai','Delhi NCR','Hyderabad','Chennai','Kolkata','Pune','Ahmedabad',
    'Jaipur','Lucknow','Chandigarh','Kochi','Indore','Bhopal','Nagpur','Surat',
    'Visakhapatnam','Coimbatore','Guwahati','Bhubaneswar','Patna','Thiruvananthapuram',
    'Mysuru','Vadodara','Other India'
  )),
  constraint profiles_play_times_allowed check (
    cardinality(play_times) between 1 and 6
    and play_times <@ array['weekday_mornings','weekday_afternoons','weekday_evenings',
                            'weekday_nights','weekends','late_night']::text[]
  ),
  -- The row cannot exist unless the 18+ box was ticked.
  constraint profiles_must_be_18_plus check (is_18_plus = true)
);

-- ---------------------------------------------------------------
-- 2) player_games: one row per game a player plays
-- ---------------------------------------------------------------
create table public.player_games (
  user_id uuid not null references public.profiles (user_id) on delete cascade,
  game    text not null,
  rank    text not null,
  primary key (user_id, game),
  constraint player_games_game_allowed check (game in ('valorant','cs2','dota2','apex','r6','other')),
  constraint player_games_rank_length  check (char_length(rank) between 1 and 30)
);

-- ---------------------------------------------------------------
-- 3) profile_private: the Discord username lives HERE, not in profiles.
--    RLS works per ROW, not per column, so a secret column inside a table
--    that other people can read would not stay secret.
-- ---------------------------------------------------------------
create table public.profile_private (
  user_id          uuid primary key references auth.users (id) on delete cascade,
  discord_username text
);

-- ---------------------------------------------------------------
-- 4) Turn RLS on for every table
-- ---------------------------------------------------------------
alter table public.profiles        enable row level security;
alter table public.player_games    enable row level security;
alter table public.profile_private enable row level security;

-- ---------------------------------------------------------------
-- 5) Permissions: logged-in users only. Visitors (anon) get nothing.
-- ---------------------------------------------------------------
revoke all on public.profiles, public.player_games, public.profile_private from anon;
revoke all on public.profiles, public.player_games, public.profile_private from authenticated;
grant select, insert, update on public.profiles        to authenticated;
grant select, insert, delete on public.player_games    to authenticated;
grant select                 on public.profile_private to authenticated;

-- ---------------------------------------------------------------
-- 6) Policies. "(select auth.uid())" = the id of the person asking.
-- ---------------------------------------------------------------
create policy "profiles: read own"
  on public.profiles for select to authenticated
  using (user_id = (select auth.uid()));

create policy "profiles: insert own"
  on public.profiles for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "profiles: update own"
  on public.profiles for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "player_games: read own"
  on public.player_games for select to authenticated
  using (user_id = (select auth.uid()));

create policy "player_games: insert own"
  on public.player_games for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "player_games: delete own"
  on public.player_games for delete to authenticated
  using (user_id = (select auth.uid()));

create policy "profile_private: read own"
  on public.profile_private for select to authenticated
  using (user_id = (select auth.uid()));
-- profile_private has NO insert/update/delete policy on purpose:
-- only the trigger below can write to it, so nobody can fake a username.

-- ---------------------------------------------------------------
-- 7) Trigger: copy the Discord username from the login data into
--    profile_private, automatically, on the server side.
-- ---------------------------------------------------------------
create function public.sync_discord_username()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profile_private (user_id, discord_username)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'preferred_username'
    )
  )
  on conflict (user_id) do update set discord_username = excluded.discord_username;
  return new;
end;
$$;

create trigger on_auth_user_sync_discord
  after insert or update of raw_user_meta_data on auth.users
  for each row execute function public.sync_discord_username();

-- ---------------------------------------------------------------
-- 8) save_profile(): saves profile + games in ONE all-or-nothing step.
--    "security invoker" = it runs as the logged-in user, so RLS still applies.
-- ---------------------------------------------------------------
create function public.save_profile(
  p_display_name text,
  p_city         text,
  p_play_times   text[],
  p_is_18_plus   boolean,
  p_games        jsonb
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user uuid := (select auth.uid());
begin
  if v_user is null then
    raise exception 'not signed in';
  end if;
  if jsonb_typeof(p_games) <> 'array' or jsonb_array_length(p_games) not between 1 and 6 then
    raise exception 'pick between 1 and 6 games';
  end if;

  insert into public.profiles (user_id, display_name, city, play_times, is_18_plus)
  values (v_user, p_display_name, p_city, p_play_times, p_is_18_plus)
  on conflict (user_id) do update
    set display_name = excluded.display_name,
        city         = excluded.city,
        play_times   = excluded.play_times,
        is_18_plus   = excluded.is_18_plus,
        updated_at   = now();

  delete from public.player_games where user_id = v_user;

  insert into public.player_games (user_id, game, rank)
  select v_user, g.game, g.rank
  from jsonb_to_recordset(p_games) as g(game text, rank text);
end;
$$;

revoke execute on function public.save_profile(text, text, text[], boolean, jsonb) from public, anon;
grant  execute on function public.save_profile(text, text, text[], boolean, jsonb) to authenticated;
