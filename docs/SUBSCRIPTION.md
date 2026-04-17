# Subscription billing with Polar.sh — implementation plan

> **Status:** planning. Not implemented yet. This doc is the work order; keep
> it in sync as pieces land.

## ⚠️ Token hygiene (read first)

A Polar **access token** was shared in chat on 2026-04-17. That token must be
treated as **compromised**:

1. Go to **polar.sh → Settings → API tokens**.
2. Revoke `polar_oat_UGMDZy7FeRB0LgV3DB1PXKHm2a25KBI3ZJWjn0vNEeF`.
3. Create a new one. **Do not paste it in chat, issue comments, commits, or
   any `.md` file in this repo.**
4. Store the replacement only in:
   - **Supabase Edge Function secrets** (for server-side API calls)
   - **Vercel project env vars** (if we use Vercel Serverless instead)
   - Your local `.env.local` (gitignored) if you need to experiment from a
     script.
5. Never prefix it with `VITE_` — anything Vite sees in env gets bundled into
   the client JS.

---

## Product decision

**Plan:** single Pro subscription — **$4 / month**.

- Buyer outcome: Pro flag on their profile, unlocks Pro widgets / unlimited
  widget count (whatever the current gating rules say in the UI).
- One product in Polar, one monthly recurring price. Extra plans can be
  added later by mapping more Polar `product_id` → flag.

## Stack decision

| Concern | Choice | Why |
|---|---|---|
| Payment processor | **Polar.sh** | Already set up by the user with product + prices |
| Checkout UI | **Polar-hosted checkout** | Zero PCI scope, no card form in our app |
| Backend surface | **Supabase Edge Functions** | Supabase is already the backend; secrets + RLS live there. Vercel Serverless would also work, but it splits infra. |
| State of truth | **Supabase `profiles` table** (new) | Profile row per user keyed by `auth.users.id`; webhook updates `is_pro` + `polar_*` fields. |
| Customer portal | **Polar-hosted** | Manage / cancel / update card — linked from `/settings`. |

Frontend (Vite) never holds the Polar secret. All writes that change plan
state go through the webhook; the client can only **read** plan state via
Supabase RLS-gated queries.

---

## Schema changes (`supabase/migrations/003_subscriptions.sql`)

```sql
-- New profiles table holds plan state. One row per auth user.
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  is_pro boolean not null default false,
  polar_customer_id text unique,
  polar_subscription_id text unique,
  subscription_status text,        -- active | canceled | past_due | trialing | incomplete
  current_period_end timestamptz,  -- when Pro access expires if not renewed
  updated_at timestamptz not null default now()
);

-- Auto-insert a row when a user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill for existing users.
insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;

-- RLS — users read their own row only. Writes come from the Edge Function
-- using the service-role key, so no insert/update policy for end users.
alter table public.profiles enable row level security;

create policy "read own profile"
  on public.profiles for select
  using (auth.uid() = id);
```

Client API:
- `SubscriptionService.getPlan()` → `{ isPro, status, currentPeriodEnd }`
  (reads `profiles` row).
- Cache inside `AuthContext` next to `user`; expose `isPro` everywhere we
  currently gate Pro widgets.

---

## Backend — Supabase Edge Functions

Two functions.

### 1. `polar-checkout` (POST, auth required)
- Input: `{ priceId }` (or hardcode the one price for now).
- Reads the caller's user id from the Supabase JWT.
- Calls Polar API `POST /v1/checkouts/` with:
  - `product_price_id`
  - `customer_email` = user.email
  - `success_url` = `${origin}/settings?upgraded=1`
  - `customer_metadata.supabase_user_id` = user.id  (critical — links back)
- Returns `{ url }`. Frontend redirects `window.location = url`.

Secrets used:
- `POLAR_ACCESS_TOKEN` — Polar server API key (the one you just rotated).
- `POLAR_ORG_ID` — your Polar organization id.
- `POLAR_PRO_PRICE_ID` — the monthly price id from Polar dashboard.

### 2. `polar-webhook` (POST, public)
- Verifies Polar's `Polar-Signature` header using `POLAR_WEBHOOK_SECRET`.
- Handles events:
  - `subscription.created` / `subscription.updated` → find user by
    `metadata.supabase_user_id`, update profile: `is_pro = true` (if
    `status === 'active' || 'trialing'`), `polar_subscription_id`,
    `subscription_status`, `current_period_end`.
  - `subscription.canceled` / `subscription.revoked` → `is_pro = false`,
    `subscription_status = 'canceled'`.
  - `subscription.updated` with failed payment → keep `is_pro` true until
    `current_period_end`, then flip to false on next cron / on read.
- Responds `200` fast (Polar retries on non-2xx).

Uses the Supabase **service-role** key to bypass RLS:
- `SUPABASE_SERVICE_ROLE_KEY` (already available to Edge Functions as `SUPABASE_SERVICE_ROLE_KEY`).

### Webhook URL to paste in Polar dashboard
```
https://vyycfwgkawtqkjllvsuc.supabase.co/functions/v1/polar-webhook
```

---

## Frontend changes

### 1. `SubscriptionService` (`src/infrastructure/services/SubscriptionService.ts`)
- `getPlan()` — select one row from `profiles` where `id = auth.uid()`.
- `startCheckout()` — `supabase.functions.invoke('polar-checkout', { body: { priceId } })`
  → `window.location.href = data.url`.
- `openPortal()` — opens Polar customer portal URL (either from a third Edge
  Function `polar-portal` or, simpler, a static link that Polar exposes per
  customer).

### 2. `AuthContext` additions
- Fetch plan alongside session: `isPro`, `planStatus`, `currentPeriodEnd`.
- Re-fetch on `SIGNED_IN` and on `?upgraded=1` in URL (for instant post-checkout
  UI update; don't trust it — webhook is source of truth, but good UX).

### 3. `UpgradeModal` wiring
- Replace the placeholder **Get Pro** button with
  `onClick={() => SubscriptionService.startCheckout()}`.
- Show a loading state while the Edge Function returns the checkout URL.

### 4. `SettingsPage` — Subscription section
- When `isPro === true`:
  - Card shows **Pro plan · $4/mo · Next billing: …**.
  - Primary action: **Manage subscription** → opens Polar customer portal.
  - Cancel / resume happens on Polar's side; our UI just reflects state.
- When `isPro === false`:
  - Keep the current **Upgrade to Pro** card.

### 5. Gating existing UI
- Pro widget `Upgrade` button: if `isPro === true`, show **Customize** instead
  and let them into studio.
- Widget count limit (free = 3) in `WidgetStorageService` — enforce
  server-side in a Postgres function so the client can't just delete the
  check.

### 6. Post-checkout return
- Polar redirects to `/settings?upgraded=1`.
- On mount, if query has `upgraded=1`, re-fetch profile, strip the param,
  show a one-time confetti / toast "You're on Pro — welcome!".

---

## Environment variables

### Supabase Edge Function secrets (server-side only)
```
POLAR_ACCESS_TOKEN   = <new, non-leaked token>
POLAR_ORG_ID         = <org id from polar.sh>
POLAR_PRO_PRICE_ID   = <price id of the $4/mo subscription>
POLAR_WEBHOOK_SECRET = <generated in polar.sh → webhooks>
```

Set them with:
```bash
supabase secrets set POLAR_ACCESS_TOKEN=... POLAR_ORG_ID=...
```

### Frontend `.env` (nothing sensitive)
No new client env vars needed — the Edge Function URL is derived from
`VITE_SUPABASE_URL`.

---

## Test plan (manual)

Before flipping on for real users:

- [ ] Create a Polar **test mode** product + price, use the test token for
      this whole list first.
- [ ] Hit `/upgrade` → Polar checkout opens with correct email prefilled.
- [ ] Pay with a test card → redirected back to `/settings?upgraded=1`.
- [ ] Within ~5 s, `profiles.is_pro = true` in Supabase.
- [ ] Pro widgets in `/widgets` now show **Customize** (not Upgrade).
- [ ] Cancel the sub from Polar portal → webhook fires →
      `subscription_status = 'canceled'`, `is_pro` flips false after
      `current_period_end`.
- [ ] Delete the Supabase user → check that Polar side is OK (no orphan
      subscription charging). If we want to auto-cancel on delete, add it to
      `delete_own_user` RPC as a follow-up (out of scope for MVP).
- [ ] Replay a webhook (Polar has a "resend" button) → idempotent: profile
      state converges regardless of duplicate events.
- [ ] Fire a webhook with a bad signature (curl) → Edge Function returns 401
      and does not touch the DB.

---

## Rollout checklist

1. **Rotate the leaked token** (see top of doc).
2. Write migration `003_subscriptions.sql`; push to Supabase.
3. Add `SubscriptionService` + wire `isPro` into `AuthContext`.
4. Ship `polar-checkout` + `polar-webhook` Edge Functions.
5. Register webhook URL + webhook secret in Polar dashboard.
6. Replace `UpgradeModal` **Get Pro** button with the real checkout flow.
7. Replace `SettingsPage` Upgrade card with plan-aware card (shows
   "Manage subscription" when Pro).
8. QA in **Polar test mode** end-to-end (checklist above).
9. Swap to **live** product + price in Polar.
10. Update `ROADMAP.md` → move "Subscription billing" to "Shipped".

---

## Out of scope for MVP (track in `ROADMAP.md`)

- Annual plan, team plans, coupon codes.
- Proration on plan changes.
- In-app cancel / resume (Polar portal covers this).
- Invoice email delivery — Polar handles by default.
- Taxes (Polar is a Merchant-of-Record, handles VAT).
- Trial periods.
