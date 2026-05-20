-- Enable Row Level Security
create extension if not exists "uuid-ossp";

-- Players table
create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz default now()
);

-- Rounds table
create table if not exists rounds (
  id uuid primary key default gen_random_uuid(),
  round_number int not null unique,
  played_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Results table
create table if not exists results (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  round_id uuid not null references rounds(id) on delete cascade,
  rank int check (rank >= 1 and rank <= 10),
  points int not null default 0,
  dnf boolean default false,
  created_at timestamptz default now(),
  unique(player_id, round_id)
);

-- Create indexes for performance
create index if not exists idx_results_player_id on results(player_id);
create index if not exists idx_results_round_id on results(round_id);
create index if not exists idx_rounds_round_number on rounds(round_number);

-- Season state: tracks the declared champion. Single-row singleton (id = 1).
create table if not exists season_state (
  id int primary key default 1,
  winner_player_id uuid references players(id) on delete set null,
  declared_at timestamptz,
  constraint season_singleton check (id = 1)
);
insert into season_state (id) values (1) on conflict do nothing;

-- Row Level Security: anon (public) can READ everything but cannot write.
-- All writes go through the server using the service_role key, which bypasses RLS.
alter table players enable row level security;
alter table rounds enable row level security;
alter table results enable row level security;
alter table season_state enable row level security;

-- Drop existing policies (idempotent re-runs)
drop policy if exists "public read players" on players;
drop policy if exists "public read rounds" on rounds;
drop policy if exists "public read results" on results;
drop policy if exists "public read season_state" on season_state;

create policy "public read players" on players for select using (true);
create policy "public read rounds" on rounds for select using (true);
create policy "public read results" on results for select using (true);
create policy "public read season_state" on season_state for select using (true);

-- NOTE: no insert/update/delete policies for anon → all writes blocked at DB level.
-- The service_role key (used only on the server) bypasses RLS automatically.
