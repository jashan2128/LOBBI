-- Phase 1: waitlist table
create table public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now(),
  -- the database itself refuses bad data, even if our code has a bug
  constraint waitlist_email_lowercase check (email = lower(email)),
  constraint waitlist_email_length    check (char_length(email) between 5 and 254)
);

-- Turn Row Level Security ON. With no policy, nobody can do anything.
alter table public.waitlist enable row level security;

-- Policy: the public (anon + logged-in) may INSERT, nothing else.
create policy "anyone can join the waitlist"
  on public.waitlist
  for insert
  to anon, authenticated
  with check (true);

-- No SELECT / UPDATE / DELETE policies = nobody can read or change rows
-- through the API. The Supabase dashboard (postgres role) can still read them.

-- Belt and braces: also remove the table-level permission to read.
revoke select, update, delete on public.waitlist from anon, authenticated;
