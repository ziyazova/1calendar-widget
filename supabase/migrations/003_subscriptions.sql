-- Profiles table holds per-user subscription state mirrored from Polar.sh
-- via the `polar-webhook` Edge Function. One row per auth user; the trigger
-- below inserts it on sign-up so application code can always select one row.

create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  is_pro boolean not null default false,
  polar_customer_id text unique,
  polar_subscription_id text unique,
  subscription_status text,        -- active | trialing | canceled | past_due | incomplete
  current_period_end timestamptz,  -- when Pro access expires if not renewed
  updated_at timestamptz not null default now()
);

-- Insert a profile row whenever a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill for users that predate this migration.
insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;

-- RLS — the user can read only their own row. All writes go through the
-- webhook using the service-role key (which bypasses RLS), so we don't need
-- update/insert policies for the authenticated role.
alter table public.profiles enable row level security;

drop policy if exists "read own profile" on public.profiles;
create policy "read own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- updated_at bookkeeping.
create or replace function public.touch_profiles_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.touch_profiles_updated_at();
