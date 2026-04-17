# Roadmap & Backlog

Living backlog for Peachy Studio. Track everything that's **not yet merged** here
so the product state is legible without grepping the code.

Update this doc whenever you:
- start / finish / deprioritise a task,
- decide not to do something (move to **Won't do** with a reason),
- carry a known issue across a release.

---

## Legend

- **Priority:** 🔴 critical (security / data loss) · 🟡 important (UX, growth)
  · 🟢 nice-to-have
- **Effort:** S (<½ day), M (½–2 days), L (2+ days) — rough implementation only,
  not including QA / design.
- **Blocker:** what stops this from shipping now (if anything).

---

## In progress

_Nothing — update when you pick something up._

---

## Backlog — high priority 🔴

### Subscription billing via Polar.sh
- **Status:** planned, not started. Full plan in `docs/SUBSCRIPTION.md`.
- **Effort:** L
- **Why:** Product needs real revenue. Polar is already set up with a $4/mo
  Pro product + price.
- **Blocker (immediate):** leaked access token must be rotated — see
  `SUBSCRIPTION.md → "Token hygiene"` first step.
- **Summary of the plan:**
  1. Migration `003_subscriptions.sql` — `profiles` table (`is_pro`,
     `polar_customer_id`, `polar_subscription_id`, `subscription_status`,
     `current_period_end`) + new-user trigger + RLS.
  2. Supabase Edge Functions: `polar-checkout` (creates session, returns
     URL) + `polar-webhook` (verifies signature, updates profile).
  3. Frontend: `SubscriptionService`, `isPro` in `AuthContext`,
     `UpgradeModal` real checkout, Settings plan-aware Subscription card.
  4. QA in Polar **test mode** end-to-end before going live.
- **Related:** `docs/SUBSCRIPTION.md`, existing `UpgradeModal.tsx`.

### Soft-delete with 30-day grace period
- **Status:** not started
- **Effort:** L
- **Why:** Today's delete is irreversible (`supabase.rpc('delete_own_user')`
  removes the Postgres row immediately). Users who click by mistake cannot
  recover. Standard SaaS pattern is a 30-day grace window.
- **Plan:**
  1. Add `profiles.deletion_scheduled_at timestamptz` column + migration.
  2. Change `delete_own_user()` to set `deletion_scheduled_at = now() + interval '30 days'`
     instead of `DELETE FROM auth.users`.
  3. On login, if `deletion_scheduled_at` is set, route user to
     `/account/recover` with a "Cancel deletion" button (clears the column).
  4. Daily Postgres cron (pg_cron) that hard-deletes rows whose
     `deletion_scheduled_at < now()`.
- **Blocker:** Requires server-side work (migration + cron). No client-only
  workaround.
- **Related files:** `supabase/migrations/002_delete_own_user.sql`,
  `src/infrastructure/services/AccountService.ts`.

### Post-password-change notification email
- **Status:** not started
- **Effort:** M
- **Why:** Right now a password change / reset is silent. If an attacker
  takes over a session, the real owner never hears about it. Industry
  standard is "Your password was changed — if this wasn't you, click here."
- **Plan:**
  1. Postgres trigger on `auth.users` update that fires when
     `encrypted_password` changes.
  2. Trigger invokes an HTTP call to a Supabase Edge Function with
     user email + timestamp + IP.
  3. Edge Function sends a plaintext email via Resend / SendGrid /
     Supabase's own SMTP.
- **Blocker:** Requires Supabase Edge Function + email-service account.
  Not doable from the client.
- **Related docs:** see `docs/AUTH.md` — Roadmap, high priority.

---

## Backlog — medium priority 🟡

### Unverified-email restriction
- **Status:** not started, needs product decision
- **Effort:** S
- **Why:** Users who sign up with email but don't click the confirmation
  link currently get **full** Studio access. `isEmailVerified` is only
  used for the `EmailVerificationBanner` — nothing blocks actions.
- **Decision needed from PM:** what to restrict?
  - Option A (soft): keep full access, banner-only (current).
  - Option B (medium): block **save widget** and **change email** until
    verified. Banner stays. Best UX: try freely, save gates at commit.
  - Option C (hard): block all Studio access until verified. Low-friction
    for SaaS, but harsh here because anonymous users can already use Studio.
- **Recommendation:** **Option B**. Lets users play with the Studio,
  nudges them to verify when they actually want to keep their work.
- **Related files:** `src/presentation/components/shared/EmailVerificationBanner.tsx`,
  `src/infrastructure/services/WidgetStorageService.ts` (saveWidget gate).

### Suspicious sign-in notification email
- **Status:** not started
- **Effort:** M
- **Why:** Notify the user when their account is accessed from a new
  country / new device. Cheap signal that catches early takeovers.
- **Plan:** Supabase Edge Function on sign-in events, diff against recent
  `auth.sessions` rows, email if user-agent / IP country changed.
- **Blocker:** Edge Function + email service (same infra as post-password-change
  notification — pair them up).

### Password-breach check at signup
- **Status:** not started
- **Effort:** S
- **Why:** Reject obviously compromised passwords ("password123", leaked
  credentials). Best to catch at signup rather than after a breach.
- **Plan:** Client-side k-anonymity call to HaveIBeenPwned Pwned Passwords
  API (first 5 chars of SHA-1). No password ever leaves the client.

---

## Backlog — low priority 🟢

### Active sessions management UI
- Show the list of devices signed in, revoke individual sessions.
- Needs Admin API + a custom `sessions` view.
- Today: we only offer "sign out of every other device" (implemented in
  `SettingsPage`).

### Account-recover page UI
- Only needed once **soft-delete with 30-day grace** lands.

---

## Won't do (for now)

### Per-session selective revocation
- Reason: requires Admin API + a custom sessions table. Overkill for a
  widget-studio MVP with no compliance requirements yet.

### Migration from styled-components to shadcn/ui + Tailwind
- Reason: auto-suggested by the Vercel plugin. Current styling works, is
  consistent, and moving would cost weeks of UI rework with zero user-facing
  benefit. Revisit if we adopt Next.js + need SSR.

---

## Shipped recently

(Move items here when merged so the "done" state is visible without going
through git log.)

### 2026-04-17
- **Auth hardening iteration 1** — `logoutOthers()` after password reset;
  `confirm password` field in sign-up; `updateProfile` returns errors;
  `loginWithCode` guard; Google `avatar_url` in signed-in card.
- **Auth hardening iteration 2** — `verifyPassword` (re-auth before
  changing password / email); Change-email flow (`Settings → Change email`);
  `hasSupabaseEnv` dev banner on `/login` when env vars are missing.
- **Verify-email page** — dedicated `/verify-email` route handles
  success, `otp_expired`, and direct-visit cases instead of dumping the
  user onto the marketing page with an unparseable hash.
- **TopNav "Log in" autologin bug** — removed the silent
  `loginWithCode('PEACHY2026') + navigate('/studio')` that made the
  "Log in" button act like "skip login". Now it correctly navigates to
  `/login`.
- **Shared Upgrade modal** — extracted to
  `presentation/components/shared/UpgradeModal.tsx` and wired through
  `UpgradeModalContext` at the app root. Every "Upgrade" CTA (widgets
  gallery, Studio sidebar / upgrade-now button, TopNav account dropdown,
  Settings → Upgrade to Pro) opens the same instance. Price: $4/month.
  Removed two ~75-line inline copies from `WidgetStudioPage.tsx` and
  `StudioPage.tsx`.
- **Cart / account dropdown consistency** — account menu was
  hover-to-open (desktop) while the cart was click-to-open, and the two
  used different z-indexes. Both now open on click, close on
  click-outside **or Escape**, share the same listener, and expose
  `aria-expanded` / keyboard activation on the account pill. No visual
  change.
- **Pro / Customize button rework** — the on-card CTA used to say
  "✦ Pro" for locked widgets regardless of login state, which read as a
  paywall for anonymous visitors. Now the button is:
  **logged-in** `✦ Upgrade` (opens shared modal) ·
  **not logged-in** `Customize` (lets them try the studio first).
  In both cases a subtle corner `PRO` badge on the card image sets the
  expectation without blocking interaction.
- **Landing "Top templates" dedupe** — `TEMPLATE_ROW_1` in
  `TemplatesGallery.tsx` had drifted into a hand-maintained duplicate of
  the shop catalog with its own `tags` vocabulary. Replaced it with a
  curated id-order array (`LANDING_TEMPLATE_IDS`) that references
  `TEMPLATES` from `data/templates.ts`. Filter chips now map to the
  canonical `Category` type; output is deduped by id so a template with
  multiple categories can't render twice inside a single filter view.
  The marquee's `[...a, ...a]` duplication was also removed — it was a
  regular horizontal scroll, not an infinite-loop animation, so the
  duplication produced *actual* visible repeats.
- **Settings density pass** — roughly −20% across title sizes, card
  padding, row padding, input/button heights, icon wrappers. Reduces the
  "heavy" feel users reported without removing any content.
- **Settings section icons** — moved from black `#1F1F1F` filled squares
  to neutral `#F5F5F2` bg + `#9A9AA0` icon + stroke-width 1.75, sized to
  match the title + subtitle block (34×34). Danger zone stays red.
- **Upgrade CTA treatment** — violet/indigo brand palette
  (`#EEF0FF → #E2E7FF` gradient, `#4F46E5` text, `#6366F1` icon) on the
  TopNav dropdown item and on the Settings "Upgrade" buttons. Both
  buttons now open the shared `UpgradeModal` instead of navigating to
  `/templates` (which was semantically wrong). Icon swapped from
  `Sparkles` → `ArrowUpRight` for a cleaner look.
- **Avatar color sync** — TopNav pill + dropdown avatars were indigo; the
  Settings profile avatar was peach sunset. Unified to the peach sunset
  gradient everywhere for brand consistency.
- **"Free plan" badge** — removed the Sparkles icon (Sparkles on the
  free tier read as "premium"); badge is now a neutral pill.

---

## How to use this doc

- **Adding something:** drop a block under the right priority bucket.
  Keep each entry self-contained (status / effort / why / plan / blocker).
- **Starting work:** move to **In progress**, cross-link the PR or branch.
- **Finishing work:** move to **Shipped recently** with the merge date;
  once it's in CLAUDE.md or another durable doc, prune it from here.
- **Dropping scope:** move to **Won't do** with the reason. Future-you
  will want to know why.
