-- Server-side enforcement of the free tier for widgets.
--
-- Before this migration, widget limits (3 per free user) and Pro-only styles
-- were enforced only on the client: a malicious user could bypass them with
-- a direct PostgREST call. This migration moves enforcement into RLS so the
-- database is the source of truth.
--
-- Two helper functions + replacement INSERT and UPDATE policies on widgets,
-- plus a column-level REVOKE on profiles as belt-and-braces against a user
-- self-upgrading to Pro (the subscription webhook remains the sole writer).
--
-- See docs/SUBSCRIPTION-LAUNCH-PLAN.md §4 for context.

-- ─────────────────────────────────────────────────────────────────────────
-- Helper: is a user currently on the Pro plan?
-- SECURITY DEFINER so the function can read `profiles` even though the
-- caller may not have direct SELECT access to another user's row (they
-- don't, and won't — they're only ever checking their own).
-- ─────────────────────────────────────────────────────────────────────────

create or replace function public.user_is_pro(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(is_pro, false)
  from public.profiles
  where id = uid;
$$;

-- ─────────────────────────────────────────────────────────────────────────
-- Helper: is a given widget style gated behind Pro?
--
-- Seed list comes from docs/SUBSCRIPTION-LAUNCH-PLAN.md §4.3 — current
-- intent is that Typewriter (Letterpress calendar) and Flower (analog clock)
-- are Pro-only. To change the list without a frontend deploy, CREATE OR
-- REPLACE this function in a new migration. Immutable because the mapping
-- is deterministic given just the input string.
-- ─────────────────────────────────────────────────────────────────────────

create or replace function public.is_pro_style(style text)
returns boolean
language sql
immutable
as $$
  select style in ('typewriter', 'flower');
$$;

-- ─────────────────────────────────────────────────────────────────────────
-- Replace widgets.INSERT policy with a tier-aware version.
--
-- Allowed to insert when:
--   (a) the row's user_id matches the caller (unchanged from prior policy),
--   AND
--   (b) EITHER the caller is Pro (no count limit, no style limit),
--       OR    the caller has < 3 widgets AND the requested style is not Pro.
-- ─────────────────────────────────────────────────────────────────────────

drop policy if exists "Users can insert own widgets" on public.widgets;
create policy "insert own widgets within tier"
  on public.widgets
  for insert
  with check (
    auth.uid() = user_id
    and (
      public.user_is_pro(auth.uid())
      or (
        (select count(*) from public.widgets where user_id = auth.uid()) < 3
        and not public.is_pro_style(style)
      )
    )
  );

-- ─────────────────────────────────────────────────────────────────────────
-- Replace widgets.UPDATE policy. The prior version only had `using` which
-- validates the OLD row — it happily allows a free user to UPDATE their
-- existing widget's `style` to a Pro style. We add a `with check` clause
-- that validates the NEW row, so changing to a Pro style as a free user
-- is blocked too.
-- ─────────────────────────────────────────────────────────────────────────

drop policy if exists "Users can update own widgets" on public.widgets;
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

-- SELECT and DELETE policies from migration 001 are still correct; left alone.

-- ─────────────────────────────────────────────────────────────────────────
-- Profiles: column-level revoke of the tier/billing columns.
--
-- No UPDATE policy for `authenticated` exists today (so RLS already denies
-- all writes by end users — the webhook writes via the service-role key
-- which bypasses RLS). This REVOKE is defense in depth: even if an
-- UPDATE policy were accidentally added later, the authenticated role
-- still cannot modify these specific columns without an explicit GRANT.
-- ─────────────────────────────────────────────────────────────────────────

revoke update (
  is_pro,
  polar_customer_id,
  polar_subscription_id,
  subscription_status,
  current_period_end
) on public.profiles from authenticated;
