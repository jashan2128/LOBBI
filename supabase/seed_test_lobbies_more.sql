-- DEV ONLY: ~27 more fake lobbies, so you can test filters and pagination (12 per page),
-- plus three special lobbies: one full, one closed, one already started.
-- Run AFTER seed_test_players.sql (needs "Test Player 1..30").
-- cleanup_test_players.sql removes all of this (the lobbies are deleted with their owners).
do $$
declare
  games  text[] := array['valorant','cs2','dota2','apex','r6','other'];
  slots  int[]  := array[2,3,4,5,5,3];
  cities text[] := array['Bengaluru','Mumbai','Delhi NCR','Hyderabad','Chennai','Pune','Kolkata','Anywhere (online)'];
  titles text[] := array['Ranked grind','Chill queue','Scrims tonight','Learning the game','Tryhards only','Casual fun'];
  n        int;
  owner    uuid;
  extra    uuid;
  lid      uuid;
  s        int;
begin
  -- 1) 27 open lobbies, each with a different owner, starting at different times
  for n in 4..30 loop
    select user_id into owner from public.profiles where display_name = 'Test Player ' || n;
    continue when owner is null;
    s := slots[1 + (n % 6)];

    insert into public.lobbies (owner_id, game, title, slots_total, play_time, city)
    values (owner, games[1 + (n % 6)], 'Seed+: ' || titles[1 + (n % 6)] || ' #' || n, s,
            case when n >= 28 then now() + interval '10 days'          -- outside "next 7 days"
                 else now() + ((n * 100) || ' minutes')::interval end,  -- 7 hours .. 2 days
            cities[1 + (n % 8)])
    returning id into lid;

    insert into public.lobby_members (lobby_id, user_id) values (lid, owner);

    -- lobbies with 3+ slots get one extra player, so cards show "2/4 players" etc.
    if s >= 3 then
      select user_id into extra from public.profiles where display_name = 'Test Player ' || (((n + 12) % 30) + 1);
      if extra is not null and extra <> owner then
        insert into public.lobby_members (lobby_id, user_id) values (lid, extra);
      end if;
    end if;
  end loop;

  -- 2) A FULL lobby (3 of 3). Should NOT appear in the Lobbies list; open its page to see "Full".
  select user_id into owner from public.profiles where display_name = 'Test Player 1';
  insert into public.lobbies (owner_id, game, title, slots_total, play_time, city, status)
  values (owner, 'valorant', 'Seed+: Full house', 3, now() + interval '1 day', 'Mumbai', 'full')
  returning id into lid;
  insert into public.lobby_members (lobby_id, user_id)
  select lid, user_id from public.profiles where display_name in ('Test Player 1','Test Player 5','Test Player 6');

  -- 3) A CLOSED lobby. Not listed; its page says "closed".
  select user_id into owner from public.profiles where display_name = 'Test Player 2';
  insert into public.lobbies (owner_id, game, title, slots_total, play_time, city, status)
  values (owner, 'cs2', 'Seed+: Closed lobby', 5, now() + interval '1 day', 'Pune', 'closed')
  returning id into lid;
  insert into public.lobby_members (lobby_id, user_id) values (lid, owner);

  -- 4) An ALREADY STARTED lobby (still "open" in the table). Not listed; Join says "already started".
  select user_id into owner from public.profiles where display_name = 'Test Player 3';
  insert into public.lobbies (owner_id, game, title, slots_total, play_time, city)
  values (owner, 'apex', 'Seed+: Already started', 4, now() - interval '1 hour', 'Chennai')
  returning id into lid;
  insert into public.lobby_members (lobby_id, user_id) values (lid, owner);
end $$;
