-- DEV ONLY: 3 fake lobbies owned by the fake players from seed_test_players.sql.
-- Lets you test Join / Leave / Full with just ONE real account.
-- Run seed_test_players.sql first. cleanup_test_players.sql removes these lobbies too.
insert into public.lobbies (owner_id, game, title, slots_total, play_time, city)
select p.user_id, v.game, v.title, v.slots, now() + v.delay, v.city
from (values
  ('Test Player 1', 'valorant', 'Seed: Valorant night',  3, interval '1 day',   'Pune'),
  ('Test Player 2', 'cs2',      'Seed: CS2 scrims',      2, interval '2 days',  'Anywhere (online)'),
  ('Test Player 3', 'apex',     'Seed: Apex trios',      5, interval '3 hours', 'Mumbai')
) as v(owner_name, game, title, slots, delay, city)
join public.profiles p on p.display_name = v.owner_name;

insert into public.lobby_members (lobby_id, user_id)
select id, owner_id from public.lobbies where title like 'Seed:%';
