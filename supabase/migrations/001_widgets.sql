-- Widgets table: stores user-created widgets
create table if not exists public.widgets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null default 'Untitled Widget',
  type text not null, -- 'calendar', 'clock', 'board'
  style text not null, -- 'modern-grid-zoom-fixed', 'classic', 'analog-classic', etc
  settings jsonb not null default '{}',
  embed_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security: users can only access their own widgets
alter table public.widgets enable row level security;

create policy "Users can view own widgets"
  on public.widgets for select
  using (auth.uid() = user_id);

create policy "Users can insert own widgets"
  on public.widgets for insert
  with check (auth.uid() = user_id);

create policy "Users can update own widgets"
  on public.widgets for update
  using (auth.uid() = user_id);

create policy "Users can delete own widgets"
  on public.widgets for delete
  using (auth.uid() = user_id);

-- Index for fast lookup
create index if not exists idx_widgets_user_id on public.widgets(user_id);
