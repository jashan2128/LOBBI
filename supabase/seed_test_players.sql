-- DEV ONLY: creates 30 fake players so you can test filters and pagination.
-- They use emails like seed1@example.invalid. Delete them with
-- supabase/cleanup_test_players.sql BEFORE you launch.
do $$
declare
  cities text[] := array['Bengaluru','Mumbai','Delhi NCR','Hyderabad','Chennai','Pune','Kolkata','Jaipur'];
  times  text[] := array['weekday_evenings','weekday_nights','weekends','late_night','weekday_afternoons','weekday_mornings'];
  games  text[] := array['valorant','cs2','dota2','apex','r6','other'];
  ranks  jsonb  := '{"valorant":["Unranked","Iron","Bronze","Silver","Gold","Platinum","Diamond"],
                     "cs2":["Silver","Gold Nova","Master Guardian"],
                     "dota2":["Herald","Archon","Legend"],
                     "apex":["Bronze","Gold","Platinum"],
                     "r6":["Copper","Gold","Diamond"],
                     "other":["Beginner","Intermediate","Advanced"]}';
  uid uuid;
  n   int;
  g   text;
begin
  for n in 1..30 loop
    uid := gen_random_uuid();

    insert into auth.users (id, instance_id, aud, role, email, raw_user_meta_data, created_at, updated_at)
    values (uid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
            'seed' || n || '@example.invalid',
            jsonb_build_object('full_name', 'seed_user_' || n), now(), now());

    insert into public.profiles (user_id, display_name, city, play_times, is_18_plus, created_at)
    values (uid, 'Test Player ' || n, cities[1 + (n % 8)],
            array[times[1 + (n % 6)], times[1 + ((n + 2) % 6)]], true,
            now() - (n || ' minutes')::interval);

    foreach g in array array[games[1 + (n % 6)], games[1 + ((n + 3) % 6)]] loop
      insert into public.player_games (user_id, game, rank)
      values (uid, g, (ranks -> g) ->> (n % jsonb_array_length(ranks -> g)));
    end loop;
  end loop;
end $$;
