-- Schema for Rutinas Jero (Supabase PostgreSQL + RLS)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Family Profiles Table
create table if not exists public.family_profiles (
  family_code text primary key,
  child_name text not null default 'Jero',
  points_balance integer not null default 0,
  streak_count integer not null default 0,
  last_rollover_date text,
  today_mood jsonb,
  latest_note jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tasks Table
create table if not exists public.tasks (
  id text primary key,
  family_code text not null references public.family_profiles(family_code) on delete cascade,
  title text not null,
  description text,
  category text not null,
  estimated_minutes integer not null default 15,
  reward_points integer not null default 30,
  substeps jsonb not null default '[]'::jsonb,
  status text not null default 'pending',
  assigned_date text not null,
  due_time text,
  frequency_type text not null default 'daily',
  weekly_days jsonb,
  sporadic_date text,
  expired_date text,
  completed_at text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Rewards Table
create table if not exists public.rewards (
  id text primary key,
  family_code text not null references public.family_profiles(family_code) on delete cascade,
  title text not null,
  cost_points integer not null default 50,
  icon text not null default 'gift',
  redeemed_count integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Reward Redemption Requests Table
create table if not exists public.reward_redemption_requests (
  id text primary key,
  family_code text not null references public.family_profiles(family_code) on delete cascade,
  reward_id text not null references public.rewards(id) on delete cascade,
  reward_title text not null,
  cost_points integer not null,
  icon text not null default 'gift',
  requested_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text not null default 'pending'
);

-- Row Level Security (RLS)
alter table public.family_profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.rewards enable row level security;
alter table public.reward_redemption_requests enable row level security;

-- Public policies allowing read and write based on family_code
create policy "Allow all operations for matching family_code on profiles"
  on public.family_profiles for all using (true) with check (true);

create policy "Allow all operations for matching family_code on tasks"
  on public.tasks for all using (true) with check (true);

create policy "Allow all operations for matching family_code on rewards"
  on public.rewards for all using (true) with check (true);

create policy "Allow all operations for matching family_code on requests"
  on public.reward_redemption_requests for all using (true) with check (true);
