-- Phase 5: reports, rate limiting, and a per-hour cap on creating lobbies.
-- Run this whole file once in Supabase -> SQL Editor (after 004).

-- ---------------------------------------------------------------
-- 1) reports: members can FILE a report. Nobody can read them through the app.
--    You read them in the Supabase dashboard (Table Editor), which uses the
--    admin role and skips RLS.
-- ---------------------------------------------------------------
create table public.reports (
  id          uuid primary key default gen_random_uuid(),
  -- "set null": if the reporter later deletes their account, the report stays
  reporter_id uuid references auth.users (id) on delete set null,
  target_type text not null,
  target_id   uuid not null,          -- a profile's user_id, or a lobby's id (no foreign key on purpose,
                                      -- so a report survives even if the target is deleted)
  category    text not null,
  reason      text not null default '',
  created_at  timestamptz not null default now(),

  constraint reports_target_type_allowed check (target_type in ('profile', 'lobby')),
  constraint reports_category_allowed    check (category in ('harassment','spam','cheating','underage','fake_profile','other')),
  constraint reports_reason_length       check (char_length(reason) <= 500),
  constraint reports_other_needs_details check (category <> 'other' or char_length(reason) >= 10)
);

create index reports_created_idx on public.reports (created_at desc);
create index reports_target_idx  on public.reports (target_type, target_id);

alter table public.reports enable row level security;

-- Signed-in members may INSERT. Nobody gets SELECT, UPDATE or DELETE.
revoke all on public.reports from anon, authenticated;
grant insert on public.reports to authenticated;

create policy "reports: members can file their own"
  on public.reports for insert to authenticated
  with check (reporter_id = (select auth.uid()) and (select public.has_profile()));
-- No select policy = nobody can read reports through the API.

-- Rules that must hold even if someone calls the API directly:
create function public.enforce_report_rules()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform pg_advisory_xact_lock(hashtextextended(new.reporter_id::text, 1));

  if new.target_type = 'profile' then
    if not exists (select 1 from public.profiles where user_id = new.target_id) then
      raise exception 'report_target_missing';
    end if;
    if new.target_id = new.reporter_id then raise exception 'report_self'; end if;
  else
    if not exists (select 1 from public.lobbies where id = new.target_id) then
      raise exception 'report_target_missing';
    end if;
    if exists (select 1 from public.lobbies where id = new.target_id and owner_id = new.reporter_id) then
      raise exception 'report_self';
    end if;
  end if;

  -- at most 10 reports per person per day
  if (select count(*) from public.reports
      where reporter_id = new.reporter_id and created_at > now() - interval '24 hours') >= 10 then
    raise exception 'report_limit';
  end if;

  -- the same thing cannot be reported twice by the same person within a day
  if exists (select 1 from public.reports
             where reporter_id = new.reporter_id
               and target_type = new.target_type
               and target_id   = new.target_id
               and created_at > now() - interval '24 hours') then
    raise exception 'report_duplicate';
  end if;

  return new;
end;
$$;

create trigger reports_enforce_rules
  before insert on public.reports
  for each row execute function public.enforce_report_rules();

-- ---------------------------------------------------------------
-- 2) rate_limits + check_rate_limit(): a counter per (key, time window).
--    ONLY our server (using the secret "service_role" key) may call it.
--    Visitors and members cannot, so nobody can burn another person's allowance.
-- ---------------------------------------------------------------
create table public.rate_limits (
  key        text   not null,
  bucket     bigint not null,
  hits       int    not null default 1,
  updated_at timestamptz not null default now(),
  primary key (key, bucket)
);

alter table public.rate_limits enable row level security;
revoke all on public.rate_limits from anon, authenticated;
-- No policies at all: the API can never read or write this table.

create function public.check_rate_limit(p_key text, p_limit int, p_window_seconds int)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_bucket bigint;
  v_hits   int;
begin
  if p_key is null or char_length(p_key) > 120 or p_limit < 1 or p_window_seconds < 1 or p_window_seconds > 86400 then
    raise exception 'bad_rate_limit_call';
  end if;

  v_bucket := floor(extract(epoch from now()) / p_window_seconds);

  insert into public.rate_limits as r (key, bucket, hits)
  values (p_key || ':' || p_window_seconds, v_bucket, 1)
  on conflict (key, bucket) do update set hits = r.hits + 1, updated_at = now()
  returning r.hits into v_hits;

  -- tidy up old counters now and then
  if random() < 0.02 then
    delete from public.rate_limits where updated_at < now() - interval '2 days';
  end if;

  return v_hits <= p_limit;   -- true = allowed, false = too many
end;
$$;

revoke execute on function public.check_rate_limit(text, int, int) from public, anon, authenticated;
grant  execute on function public.check_rate_limit(text, int, int) to service_role;

-- ---------------------------------------------------------------
-- 3) create_lobby(): same as Phase 4, plus "at most 5 lobbies created per hour".
--    (Closing and re-creating lobbies in a loop is stopped by this.)
-- ---------------------------------------------------------------
create or replace function public.create_lobby(
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

  perform pg_advisory_xact_lock(hashtextextended(v_user::text, 0));

  if (select count(*) from public.lobbies
      where owner_id = v_user and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'rate_limited';
  end if;

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
