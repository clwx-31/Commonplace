-- ============================================================
--  Common Place — database setup
--  Paste this whole file into Supabase → SQL Editor → Run.
--  (Dashboard → your project → SQL Editor → New query)
-- ============================================================

-- Everyone's daily answers
create table if not exists answers (
  id            bigint generated always as identity primary key,
  question_date date        not null,
  player        text        not null,
  answer        text        not null,
  created_at    timestamptz default now(),
  unique (question_date, player)     -- one answer per person per day (re-submitting updates it)
);

-- Mini-game scores
create table if not exists scores (
  id         bigint generated always as identity primary key,
  game_date  date   not null,
  game       text   not null,
  player     text   not null,
  score      int    not null,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
--  Access rules (Row Level Security).
--  For a small friends-only app we let anyone read + add rows,
--  but NOT edit or delete other people's stuff.
-- ------------------------------------------------------------
alter table answers enable row level security;
alter table scores  enable row level security;

create policy "read answers"   on answers for select using (true);
create policy "add answers"    on answers for insert with check (true);
create policy "update answers" on answers for update using (true) with check (true);

create policy "read scores" on scores for select using (true);
create policy "add scores"  on scores for insert with check (true);
