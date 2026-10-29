-- Phase 4: lobbies, members, rules, and "lobby-mates can see each other's Discord name"
-- Run this whole file once in Supabase -> SQL Editor (after 003).

-- ---------------------------------------------------------------
-- 1) Tables
-- ---------------------------------------------------------------
create table public.lobbies (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references public.profiles (user_id) on delete cascade,
  game        text not null,
  title       text not null,
  slots_total int  not null,           -- total players INCLUDING the owner
  play_time   timestamptz not null,    -- when the session starts
  city        text not null,
  status      text not null default 'open',
  created_at  timestamptz not null default now(),

  constraint lobbies_game_allowed  check (game in ('valorant','cs2','dota2','apex','r6','other')),
  constraint lobbies_title_length  check (char_length(title) between 3 and 60),
  constraint lobbies_slots_range   check (slots_total between 2 and 5),
  constraint lobbies_status_allowed check (status in ('open','full','closed')),
  constraint lobbies_city_allowed  check (city in (
    'Bengaluru','Mumbai','Delhi NCR','Hyderabad','Chennai','Kolkata','Pune','Ahmedabad',
    'Jaipur','Lucknow','Chandigarh','Kochi','Indore','Bhopal','Nagpur','Surat',
    'Visakhapatnam','Coimbatore','Guwahati','Bhubaneswar','Patna','Thiruvananthapuram',
    'Mysuru','Vadodara','Other India','Anywhere (online)'
  ))
);

create table public.lobby_members (
  lobby_id  uuid not null references public.lobbies (id) on delete cascade,
  user_id   uuid not null references public.profiles (user_id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (lobby_id, user_id)
);

create index lobbies_status_time_idx on public.lobbies (status, play_time);
create index lobbies_owner_idx       on public.lobbies (owner_id);
create index lobby_members_user_idx  on public.lobby_members (user_id);

-- ---------------------------------------------------------------
-- 2) RLS on, and READ-ONLY for signed-in members.
--    Nobody can insert/update/delete these tables directly.
--    All changes go through the four functions in section 3,
--    which enforce the rules no matter what the browser sends.
-- ---------------------------------------------------------------
alter table public.lobbies        enable row level security;
alter table public.lobby_members  enable row level security;

revoke all on public.lobbies, public.lobby_members from anon;
revoke all on public.lobbies, public.lobby_members from authenticated;
grant select on public.lobbies, public.lobby_members to authenticated;

create policy "lobbies: members can read"
  on public.lobbies for select to authenticated
  using ((select public.has_profile()));

create policy "lobby_members: members can read"
  on public.lobby_members for select to authenticated
  using ((select public.has_profile()));

-- ---------------------------------------------------------------
-- 3) The four actions. "security definer" = they run with the table
--    owner's rights, so users can change lobbies ONLY through these.
--    Each one uses auth.uid() (who is asking), never an id the browser sends.
--    Limits live in these functions: 3 active lobbies per owner,
--    5 active lobbies joined per person, and the start time must be in the future.
-- ---------------------------------------------------------------
create function public.create_lobby(
  p_game        text,
  p_title       text,
  p_slots_total int,
  p_play_time   timestamptz,
  p_city        text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := (select auth.uid());
  v_id   uuid;
begin
  if v_user is null then raise exception 'not_signed_in'; end if;
  if not public.has_profile() then raise exception 'profile_required'; end if;

  -- one request at a time per person, so two quick clicks cannot beat the limits
  perform pg_advisory_xact_lock(hashtextextended(v_user::text, 0));

  if p_play_time is null or p_play_time <= now() then raise exception 'play_time_past'; end if;

  if (select count(*) from public.lobbies
      where owner_id = v_user and status in ('open','full') and play_time > now()) >= 3 then
    raise exception 'limit_open_lobbies';
  end if;

  if (select count(*) from public.lobby_members m
      join public.lobbies l on l.id = m.lobby_id
      where m.user_id = v_user and l.status in ('open','full') and l.play_time > now()) >= 5 then
    raise exception 'limit_memberships';
  end if;

  insert into public.lobbies (owner_id, game, title, slots_total, play_time, city)
  values (v_user, p_game, btrim(p_title), p_slots_total, p_play_time, p_city)
  returning id into v_id;

  insert into public.lobby_members (lobby_id, user_id) values (v_id, v_user);
  return v_id;
end;
$$;

create function public.join_lobby(p_lobby_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user  uuid := (select auth.uid());
  v_lobby public.lobbies%rowtype;
  v_count int;
begin
  if v_user is null then raise exception 'not_signed_in'; end if;
  if not public.has_profile() then raise exception 'profile_required'; end if;

  perform pg_advisory_xact_lock(hashtextextended(v_user::text, 0));

  -- "for update" locks this lobby row, so two people cannot grab the last slot together
  select * into v_lobby from public.lobbies where id = p_lobby_id for update;
  if not found then raise exception 'lobby_not_found'; end if;
  if v_lobby.status <> 'open' then raise exception 'lobby_not_open'; end if;
  if v_lobby.play_time <= now() then raise exception 'lobby_expired'; end if;

  if exists (select 1 from public.lobby_members where lobby_id = p_lobby_id and user_id = v_user) then
    raise exception 'already_member';
  end if;

  if (select count(*) from public.lobby_members m
      join public.lobbies l on l.id = m.lobby_id
      where m.user_id = v_user and l.status in ('open','full') and l.play_time > now()) >= 5 then
    raise exception 'limit_memberships';
  end if;

  insert into public.lobby_members (lobby_id, user_id) values (p_lobby_id, v_user);

  select count(*) into v_count from public.lobby_members where lobby_id = p_lobby_id;
  if v_count >= v_lobby.slots_total then
    update public.lobbies set status = 'full' where id = p_lobby_id;
  end if;
end;
$$;

create function public.leave_lobby(p_lobby_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user  uuid := (select auth.uid());
  v_lobby public.lobbies%rowtype;
begin
  if v_user is null then raise exception 'not_signed_in'; end if;

  select * into v_lobby from public.lobbies where id = p_lobby_id for update;
  if not found then raise exception 'lobby_not_found'; end if;
  if v_lobby.owner_id = v_user then raise exception 'owner_cannot_leave'; end if;

  delete from public.lobby_members where lobby_id = p_lobby_id and user_id = v_user;
  if not found then raise exception 'not_member'; end if;

  -- a slot just opened up
  if v_lobby.status = 'full' then
    update public.lobbies set status = 'open' where id = p_lobby_id;
  end if;
end;
$$;

create function public.close_lobby(p_lobby_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user  uuid := (select auth.uid());
  v_lobby public.lobbies%rowtype;
begin
  if v_user is null then raise exception 'not_signed_in'; end if;

  select * into v_lobby from public.lobbies where id = p_lobby_id for update;
  if not found then raise exception 'lobby_not_found'; end if;
  if v_lobby.owner_id <> v_user then raise exception 'not_owner'; end if;

  update public.lobbies set status = 'closed' where id = p_lobby_id;
end;
$$;

revoke execute on function public.create_lobby(text, text, int, timestamptz, text) from public, anon;
revoke execute on function public.join_lobby(uuid)  from public, anon;
revoke execute on function public.leave_lobby(uuid) from public, anon;
revoke execute on function public.close_lobby(uuid) from public, anon;
grant  execute on function public.create_lobby(text, text, int, timestamptz, text) to authenticated;
grant  execute on function public.join_lobby(uuid)  to authenticated;
grant  execute on function public.leave_lobby(uuid) to authenticated;
grant  execute on function public.close_lobby(uuid) to authenticated;

-- ---------------------------------------------------------------
-- 4) The Discord-username rule.
--    shares_active_lobby_with(x) is true only when the person asking and x
--    are members of the SAME lobby that is open or full, and that started
--    less than 12 hours ago (or has not started yet).
-- ---------------------------------------------------------------
create function public.shares_active_lobby_with(p_other uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.lobby_members me
    join public.lobby_members them on them.lobby_id = me.lobby_id
    join public.lobbies l          on l.id = me.lobby_id
    where me.user_id   = (select auth.uid())
      and them.user_id = p_other
      and l.status in ('open','full')
      and l.play_time > now() - interval '12 hours'
  );
$$;

revoke execute on function public.shares_active_lobby_with(uuid) from public, anon;
grant  execute on function public.shares_active_lobby_with(uuid) to authenticated;

-- A NEW read policy on profile_private. It sits next to "read own" from Phase 2
-- (policies are OR-ed): you can read your own row, plus rows of lobby-mates.
create policy "profile_private: lobby-mates can read"
  on public.profile_private for select to authenticated
  using ((select public.shares_active_lobby_with(user_id)));
