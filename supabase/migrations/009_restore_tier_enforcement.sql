-- Restore the free-tier widget cap (and Pro-only style gate) that 008
-- intentionally left out while we got the studio unblocked.
--
-- Defines public.user_is_pro(uuid) and public.is_pro_style(text) — the same
-- helpers migration 004 declared but never persisted to this DB — and
-- recreates the tier-aware INSERT/UPDATE policies on widgets. Owner email
-- is hardcoded into user_is_pro as an allowlist so the owner is unmetered
-- even if the profiles/Polar pipeline isn't wired up for them yet.
--
-- Idempotent: every CREATE is OR REPLACE / IF NOT EXISTS, every DROP is
-- IF EXISTS, so re-running this is safe.

-- ─────────────────────────────────────────────────────────────────────────
-- Helper: is a user currently on the Pro plan?
--
-- Two paths combine: the owner allowlist (a user whose email is in the
-- hardcoded list is always Pro, regardless of profiles state — used for
-- the studio operator and dev accounts) and profiles.is_pro (mirrored from
-- Polar by the polar-webhook Edge Function for paying customers).
-- security definer so the function can read profiles past RLS — RLS only
-- lets a user read their own row, but tier checks need to evaluate any
-- caller's row.
-- ─────────────────────────────────────────────────────────────────────────

create or replace function public.user_is_pro(uid uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  caller_email text;
  profile_pro boolean;
begin
  -- Owner / dev allowlist. Add additional emails here if you onboard
  -- collaborators who should bypass the free cap.
  select email into caller_email from auth.users where id = uid;
  if caller_email in ('ziyazovaa@gmail.com') then
    return true;
  end if;

  -- Paid Pro from Polar (mirrored by polar-webhook into profiles.is_pro).
  -- Wrapped in a sub-select to tolerate the table not existing yet on
  -- partially-migrated DBs — exception path returns false (treat as free).
  begin
    select coalesce(is_pro, false) into profile_pro
    from public.profiles
    where id = uid;
    return coalesce(profile_pro, false);
  exception when undefined_table then
    return false;
  end;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────
-- Helper: is this widget style gated behind Pro?
--
-- Seed list pulled from migration 004's intent. To change the gate without
-- a frontend deploy, re-run CREATE OR REPLACE on this function in a new
-- migration.
-- ─────────────────────────────────────────────────────────────────────────

create or replace function public.is_pro_style(style text)
returns boolean
language sql
immutable
as $$
  select style in ('typewriter', 'flower');
$$;

-- ─────────────────────────────────────────────────────────────────────────
-- INSERT policy with tier enforcement.
--
-- Allowed when caller owns the row AND
--   (caller is Pro)  OR
--   (caller has < 3 active widgets AND requested style is not Pro-only).
-- ─────────────────────────────────────────────────────────────────────────

drop policy if exists "Users can insert own widgets" on public.widgets;
drop policy if exists "insert own widgets within tier" on public.widgets;
create policy "insert own widgets within tier"
  on public.widgets
  for insert
  with check (
    auth.uid() = user_id
    and (
      public.user_is_pro(auth.uid())
      or (
        (
          select count(*)
          from public.widgets
          where user_id = auth.uid()
            and is_active = true
        ) < 3
        and not public.is_pro_style(style)
      )
    )
  );

-- ─────────────────────────────────────────────────────────────────────────
-- UPDATE policy with tier-aware style check.
-- Without the WITH CHECK clause, a free user could UPDATE their existing
-- widget's style to a Pro-only one and bypass the gate.
-- ─────────────────────────────────────────────────────────────────────────

drop policy if exists "Users can update own widgets" on public.widgets;
drop policy if exists "update own widgets within tier" on public.widgets;
create policy "update own widgets within tier"
  on public.widgets
  for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and (
      public.user_is_pro(auth.uid())
      or not public.is_pro_style(style)
    )
  );

-- SELECT and DELETE policies (from 008) are unchanged and remain correct.
