-- Removes the fake players made by seed_test_players.sql.
-- Their profiles, games and private rows are deleted automatically (cascade).
delete from auth.users where email like 'seed%@example.invalid';
