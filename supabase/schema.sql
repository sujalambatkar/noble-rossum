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

-- Disable RLS for now (we'll handle auth in app)
alter table players disable row level security;
alter table rounds disable row level security;
alter table results disable row level security;
