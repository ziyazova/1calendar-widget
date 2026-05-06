-- HOTFIX: restore widgets RLS policies after migration 007's first run.
--
-- The original 007 ended with a policy rewrite that called
-- public.user_is_pro(uuid). On this DB that function didn't exist (migration
-- 004 was only partially applied). The DROP POLICY at the start of the
-- rewrite block ran and committed before the failing CREATE rolled back,
-- leaving the widgets table without an INSERT policy — every save / refresh
-- in the studio dashboard then failed silently with a 42501 RLS violation.
--
-- This migration drops every known policy name on widgets and recreates the
-- canonical owner-can-CRUD-own-rows set from migration 001, intentionally
-- without the free-tier count cap. The owner (the only writer right now)
-- is on Pro anyway, and reintroducing the tier enforcement requires
-- migration 004's user_is_pro / is_pro_style helpers, which we'll wire up
-- in a follow-up once the rest of 004 is verified live.

drop policy if exists "Users can view own widgets" on public.widgets;
drop policy if exists "Users can insert own widgets" on public.widgets;
drop policy if exists "Users can update own widgets" on public.widgets;
drop policy if exists "Users can delete own widgets" on public.widgets;
drop policy if exists "insert own widgets within tier" on public.widgets;
drop policy if exists "update own widgets within tier" on public.widgets;

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
