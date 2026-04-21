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

### Wave 0 — Etsy redirect wiring for templates
- **Status:** code complete Apr 18, awaiting owner visual QA in browser
  before close-out. Typecheck + build are clean.
- **What landed:**
  - `etsyUrl` field on `Template`, 13/13 templates mapped (id=5 shares
    listing with id=3 pending merge).
  - `window.open` → `<a rel="noopener noreferrer" target="_blank">` in
    both sidebar CTA and mobile sticky bar on `/templates/:id`.
  - Price-variation disclosure under the Etsy button.
  - `FEATURES.ENABLE_LOCAL_CHECKOUT` flag in `src/config/features.ts`
    (currently `true` — both Add-to-Cart + Buy-on-Etsy visible on every
    template, Path D).
  - `docs/etsy-listings.csv` checked in (33 listings, Apr 17 snapshot).
  - `docs/TEMPLATES-ETSY-SYNC.md` populated: mapping, description drift
    per template, Etsy-only inventory (21 listings with promote-yes/no
    recommendations), price-gap analysis.
- **Deferred from Wave 0** (tracked as separate items in backlog below):
  - `/checkout` page is a UX lie (see "Fix /checkout UX lie" below).
  - Merge id=3 + id=5 into one card with light/dark animation
    (see "Merge Academic Dark + Student Light" below).

---

## Backlog — high priority 🔴

### Commerce launch (subscription + planners + marketplace redirects)
- **Status:** plan written (`docs/SUBSCRIPTION-LAUNCH-PLAN.md`, Apr 17 —
  scope expanded Apr 17 to cover one-time planners and external marketplace
  redirects, not just the subscription). Awaiting owner sign-off on the
  17 open decisions (§14 of that doc) before we start Phase 1.
- **Effort:** L (7 phases, each shippable independently)
- **Why:** Ship the $4/mo Pro subscription to real paying customers
  compliantly. Covers: server-side tier enforcement, EU consumer-law
  disclosures (CRD, GDPR, e-Commerce Directive), German Kündigungsbutton,
  California ARL, welcome/renewal emails, anti-abuse, observability.
- **Phases** (see plan for detail):
  1. Polar merchant onboarding (owner task — Stripe Connect + KYC).
  2. Server-side tier enforcement (RLS WITH CHECK on widgets.INSERT;
     column-level revoke on profiles).
  3. Legal pages: Terms update (MoR, auto-renewal, withdrawal waiver,
     ODR link) + new `/refund` + new `/legal` impressum.
  4. Checkout polish + welcome email + renewal reminder email.
  5. Email-verification gate on widget create + disposable-email blocklist.
  6. Observability (Plausible or equivalent, cookie-less).
  7. Reconciliation cron (nice-to-have safety net).
- **Commonly-missed gotchas** the plan explicitly blocks on:
  - Pay button wording (CRD Art. 8(2)) — contract-void risk.
  - 14-day withdrawal waiver must be opt-in checkbox at checkout.
  - German cancellation button (permanent, labelled "Cancel subscription").
  - No `/impressum` = Swedish e-commerce law violation.
  - Google Fonts via CDN = GDPR violation in Germany (self-host Inter).
- **Related:**
  - `docs/SUBSCRIPTION-LAUNCH-PLAN.md` — master plan
  - `docs/SUBSCRIPTION.md` — technical wiring
  - `docs/AUTH.md` — auth flows

### Fix /checkout UX lie
- **Status:** not started. Surfaced Apr 18 after flipping
  `ENABLE_LOCAL_CHECKOUT=true` in Wave 0.
- **Priority:** 🔴 critical — `/checkout` currently accepts card input in the
  Stripe-labelled form but nothing processes it. Buyer enters data, clicks
  "Pay $X.XX", nothing happens. Happens now because the flag is on.
- **Effort:** S (under an hour)
- **Fix options** (pick one):
  1. Replace `PayBtn` with a `ComingSoonBtn` labelled
     *"Direct purchase launching soon — buy on Etsy"*; drop the "Secure
     checkout powered by Stripe" line; link back to the template page.
  2. Redirect `/checkout` to `/templates` until Polar one-time ships, with a
     flash message *"Direct purchase coming soon — use the Etsy link on any
     template in the meantime."*
  3. Disable the cart itself until Polar one-time ships (set
     `ENABLE_LOCAL_CHECKOUT=false`), leaving only the Etsy button on every
     template.
- **Related:** `src/presentation/pages/CheckoutPage.tsx` (no submit handler
  today — line ~510 `<PayBtn>` + line ~513 `<SecureNote>` "powered by
  Stripe" which is false).
- **Blocker:** owner picks 1 / 2 / 3.

### Merge Academic Dark + Student Light into one card with theme animation
- **Status:** not started. Spec in `docs/TEMPLATES-ETSY-SYNC.md` §2.1.
- **Priority:** 🟡 important — these are the same Notion product with
  different color themes, today shown as two separate cards pointing at the
  same Etsy listing.
- **Effort:** S (half a day)
- **What it involves:**
  - Drop `id=5` entry from `templates.ts`; extend `id=3` with
    `imageDark: 'template-academic-dark.png'` + `imageLight:
    'template-student-light.png'`.
  - `TemplateCard` cross-fades the two images on hover (or auto-loop every
    3s) when both are present.
  - `/templates/3` detail page — dark image opens, small light/dark
    toggle swaps them in the carousel.
  - React Router redirect `/templates/5` → `/templates/3` so existing links
    don't 404.
  - Rename card title: "Academic Planner Dark" → "Academic Planner (Light
    & Dark)".
- **Related:** `src/presentation/data/templates.ts`,
  `src/presentation/components/TemplateCard.tsx` (or equivalent),
  `src/presentation/pages/TemplatesPage.tsx`,
  `src/presentation/pages/TemplateDetailPage.tsx`, `src/App.tsx` routes.

### Vendor-portable architecture (so Supabase and Polar can be swapped later)
- **Status:** **DEFERRED (Apr 18, 2026).** Owner decision: stay on
  Supabase + Polar. The 2–3 day full refactor is premature for current
  scale (user count well under Supabase Pro's 100k MAU limit; no migration
  trigger on the horizon). Instead, added a lightweight rule to
  `CLAUDE.md` ("Vendor abstraction rule"): new Supabase/Polar calls must
  live in `src/infrastructure/services/*`, not directly in pages or
  contexts. Existing direct imports are grandfathered tech debt, migrated
  opportunistically.
- **Revive this task when:** (a) Supabase bill exceeds ~$500/mo without
  matching revenue, (b) we hit auth or DB limits that Pro can't lift, or
  (c) a specific product reason (multi-region writes, compliance, pricing
  event) makes migration concrete.
- **Design-only task — no behaviour change; pure refactor so we're not locked in.**
- **Priority:** 🟡 important — do before writing more vendor-specific code,
  because every new feature we add cements the coupling.
- **Effort:** M (2–3 days of disciplined renaming + interface extraction;
  zero product-visible change).
- **Why:** today the app imports `supabase` and `polar` SDKs from anywhere
  (pages, contexts, services). If we ever need to migrate:
  - **Supabase → another DB / auth** (Neon + Clerk, Firebase, self-hosted
    Postgres + Lucia): we'd have to touch dozens of files.
  - **Polar → Stripe / LemonSqueezy / Paddle**: same problem — checkout URL
    builders, webhook verifiers, and plan-state fetchers are scattered.
  The fix is boring: funnel all vendor calls through two narrow interfaces.
- **Plan:**
  1. Define `AuthProvider`, `DatabaseProvider`, `StorageProvider` interfaces
     in `src/domain/ports/` (clean-arch "ports"). Each is a plain TS type
     with only the methods the app actually uses today (no kitchen sink).
     Start with what's in use: `signIn`, `signOut`, `getSession`,
     `onAuthChange`, `fetchWidgets`, `saveWidget`, `deleteWidget`,
     `fetchProfile`, `uploadBlob`.
  2. Write a single `SupabaseAdapter` in
     `src/infrastructure/adapters/supabase/` that implements all three ports
     using the current Supabase client. Move the existing
     `supabase.ts` + `WidgetStorageService.ts` + `AccountService.ts` code
     there unchanged, renamed.
  3. Register the adapter in `DIContainer` — app code resolves
     `container.get<DatabaseProvider>()` instead of importing `supabase`.
  4. Same for payments: `PaymentProvider` interface with
     `startSubscriptionCheckout(userId, planId) → url`,
     `startOneTimeCheckout(userId, productId) → url`,
     `openCustomerPortal(userId)`,
     `verifyWebhook(request) → Event`,
     `mapEventToAppEvent(event) → AppBillingEvent`. Current `polar-checkout`
     + `polar-webhook` Edge Functions become `PolarAdapter`.
  5. Grep the codebase for `import { supabase }` and `polar` — zero hits
     outside the adapter is the acceptance test.
- **Migration ergonomics (the goal):** when we swap vendors later, the diff
  is literally "write a new adapter, flip one DI binding, delete the old
  adapter." No product code changes.
- **Non-goals:**
  - Don't abstract RLS-level concerns — SQL lives in `supabase/migrations/`
    and moves with the database, not with the app.
  - Don't build feature flags for vendor switching. One vendor at a time;
    this is about making the swap cheap, not running both in parallel.
- **Related files:** `src/infrastructure/services/supabase.ts`,
  `src/infrastructure/services/WidgetStorageService.ts`,
  `src/infrastructure/services/SubscriptionService.ts`,
  `supabase/functions/polar-checkout/index.ts`,
  `supabase/functions/polar-webhook/index.ts`.

### Polar merchant onboarding (unblocks real payments)
- **Status:** not started. Wiring complete, blocked only on Polar org setup.
- **Effort:** S–M (depends on verification turnaround)
- **Why:** Checkout flow works end-to-end (Edge Functions deploy, JWT,
  webhook signatures all verified). But Polar returns "Organization is
  not ready to accept payments" because the merchant side isn't set up:
  no Stripe Connect, no KYC, no merchant terms accepted.
- **Steps:**
  1. polar.sh → Settings → find "Complete setup" / "Verification" section.
  2. Connect **Stripe Connect** account (Polar uses Stripe underneath).
  3. Fill in business info: name, address, tax ID / SSN / IBAN.
  4. Agree to merchant terms, submit for review.
  5. Wait for approval (minutes to 1-2 days depending on jurisdiction).
- **Workaround until then:** test in Polar **Sandbox** environment.
  Requires separate product + token + webhook in `sandbox.polar.sh`, and
  swapping `api.polar.sh` → `sandbox-api.polar.sh` in the Edge Function.
  Easy toggle via a `POLAR_API_URL` env var — add when needed.
- **Related:** `docs/SUBSCRIPTION.md`, `supabase/functions/polar-checkout/index.ts`.

### Subscription billing via Polar.sh (implementation)
- **Status:** ✅ Implemented and wired (Apr 17). Awaiting merchant
  onboarding above to go live.
- **What works:**
  - Migration `003_subscriptions.sql` applied — `profiles` table
    with `is_pro`, `polar_customer_id`, `polar_subscription_id`,
    `subscription_status`, `current_period_end`; auto-insert trigger
    on `auth.users`; RLS read-own.
  - Edge Functions deployed: `polar-checkout` (creates session, returns
    URL), `polar-webhook` (HMAC-SHA256 signature verify, updates profile).
  - Frontend: `SubscriptionService.getPlan()` + `startCheckout()`;
    `isPro` in `AuthContext`; `UpgradeModal` wired to real checkout;
    `SettingsPage` Subscription section plan-aware; post-checkout
    `?upgraded=1` banner.
  - Vercel env vars set in production (`VITE_SUPABASE_URL`,
    `VITE_SUPABASE_ANON_KEY`, `VITE_EMBED_BASE_URL`).
  - Supabase OAuth redirect URLs include prod + localhost.
- **What confirmed live:**
  - Clicking Upgrade → Get Pro opens Polar hosted checkout with
    user's email prefilled.
  - Cart total, product, and subscription price all render correctly.
- **Related:** `docs/SUBSCRIPTION.md`.

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

### Owner-ops toolkit — visibility + feedback workflow
- **Status:** planned Apr 18 evening, to execute Apr 19.
- **Effort:** M total (1 day across the 3 parts), but shippable in slices.
- **Why:** owner wants (a) a faster way to flag visual / UX problems
  without re-explaining context, and (b) a single place to see what's
  happening on the site (sales, signups, failures). Today she has to
  check Polar, Supabase, and Vercel separately.
- **Part 1 — Feedback template (convention, no code):**
  - Owner pastes issues in the format
    `WHERE: <page> / BAD: <observed> / WANT: <desired>` plus a screenshot
    with an arrow (macOS ⌘+Shift+5 → Markup, or CleanShot X).
  - For multi-step UX flows: 20-second Loom with voice-over.
  - Screenshots on `~/Desktop` are readable from Claude Code directly —
    no upload friction.
- **Part 2 — Basic observability (owner enables):**
  - Vercel dashboard → Analytics → enable for the `peachyplanner` project.
    One click, privacy-friendly (no cookies), free on the Hobby plan.
  - Polar dashboard stays the source of truth for money / orders.
- **Part 3 — ROADMAP.md kanban rewrite (Claude does):**
  - Replace the current linear "high / medium / low priority" sections
    with 4 columns: **🔥 Active** / **⏸ Blocked** / **📋 Next up** /
    **✅ Done (30 days)**. Keep the per-item body structure (Status /
    Effort / Why / Related) — only the top-level grouping changes.
  - Consider migrating to Linear if ROADMAP.md gets unwieldy past ~50
    open items. Revisit then, not now.
- **Part 4 — `/admin` page on the site (Claude builds):**
  - Route gated to `user.email === 'ziyazovaa@gmail.com'` (simple, no
    roles table yet; promote to a proper `admins` table when co-founder
    joins).
  - Single-page dashboard with 4 panels:
    - 💰 Recent orders — last 20 rows from `purchases`, joined with
      `TEMPLATES[]` for titles.
    - 📊 MRR estimate — `count(profiles WHERE is_pro AND
      subscription_status='active') * $4`.
    - 👥 Signups this week — count from `auth.users.created_at > now()
      - interval '7 days'`.
    - 🐛 Recent webhook health — Edge Function log tail (via Supabase
      Management API or stored in a `webhook_events` table we'd add).
  - Feature-flag toggles next — a simple UI on top of
    `src/config/features.ts` so the owner can flip flags without a
    redeploy. (Parking lot until flags actually cause redeploy pain.)
- **Priority ordering:** parts 1 + 2 are zero-code and unblock everything.
  Part 3 is cheap. Part 4 is where most value is — do it right after
  Polar-launch-steps are done.

### Digital goods refund policy — clarify before first real sale
- **Status:** open — owner flagged Apr 18 that refund rules for downloaded
  PDFs aren't written anywhere yet. `RefundPage.tsx` exists but its text
  is a placeholder.
- **Priority:** 🔴 must land **before** first paid sale. Selling without a
  documented refund policy is a compliance gap in the EU / Germany
  (consumer protection, Fernabsatzgesetz) and a customer-support nightmare.
- **Effort:** S (copy decision) + S (UI / legal copy)
- **Key questions to decide:**
  - **Is a refund ever given once the file is downloaded?** Industry
    standard for digital goods = **no**, because the item can't be
    "returned". Gumroad and Etsy Pattern both default to "all sales final
    for digital". Polar also assumes this by default.
  - **14-day withdrawal right (EU CRD)** — EU buyers have a statutory
    14-day cancellation right, **but** it is waived for digital downloads
    *if the buyer ticks an explicit waiver checkbox at checkout* ("I agree
    that delivery begins immediately and I waive my 14-day withdrawal
    right"). Polar supports this natively — **turn it on**.
  - **Resend / wrong email (not a refund)** — cover in the same page:
    "Within 30 days of purchase, if the email was wrong, contact support
    and we re-send to the correct address at no cost."
  - **Exceptional case refunds** — chargeback? duplicate purchase? owner
    decides the internal playbook (e.g. "refund within 7 days if product
    is unusable / file is broken"); public-facing copy can stay narrow.
- **Deliverables:**
  - `src/presentation/pages/RefundPage.tsx` — real legal copy.
  - Checkbox on Polar checkout enforcing CRD waiver (Polar setting, not
    code).
  - One line in `TermsPage.tsx` linking to `/refund`.
  - Email autoresponder (via `polar-welcome-email` Edge Function) that
    also links to the refund policy.
- **Related:** existing roadmap item *Commerce launch* §3 covers legal
  pages at a high level; this is the same workstream, unblocked earlier
  because we now have real Polar checkout live.

### Purchase flow — guest vs registered + delivery mechanism
- **Status:** open questions. Site ships Buy Now wired to Polar checkout
  (Apr 18), but only for logged-in users, and post-purchase delivery is
  unclear.
- **Priority:** 🔴 — without this, real paying customers either can't buy
  (guests get redirected to login) or buy but can't get the template.
- **Effort:** M (each option below is 1-2 days)
- **Decision needed from owner:** pick **one** of A / B / C.
  - **A. Guest checkout** — no login required. Buyer enters email in Polar,
    Polar emails them the Notion template link. Max conversion. No
    purchase history in site UI — re-download only from email.
    *Code:* drop the JWT check in `polar-checkout` for template products,
    pass `customer_email` if available (from a lightweight email field on
    the template page); let Polar own the delivery.
  - **B. Registered only (current)** — buyer must sign up / sign in before
    Buy Now works. Purchase history in UI (needs a `purchases` table).
    Re-download from `/studio → Purchases`. Expect 30-40% lower conversion
    per industry benchmark on forced-signup at checkout.
  - **C. Hybrid** — guest pays, post-purchase success page offers
    "Create an account to re-download later". Middle-ground conversion,
    best of both. Most technical work (need to link purchase-by-email
    to a later account creation).
- **Delivery mechanism:** independent of A/B/C.
  - **D1. Polar Benefits → Custom link** (recommended) — you attach a
    Notion-duplicable page URL to each Polar product under
    "Benefits". Polar auto-delivers in email + on the success page.
    Zero code.
  - **D2. Site-hosted download page** — webhook writes a `purchases`
    row; `/studio → Purchases` lists templates with a "Copy link" button.
    Requires a `purchases` table migration + UI.
  - **D3. Both** — Polar handles primary delivery (email), site mirrors
    for re-download. Best UX, most work.
- **What's blocking:** owner decision on A/B/C + D1/D2/D3 + whether
  Polar product Benefits are configured per product.
- **Related:** `src/presentation/pages/TemplateDetailPage.tsx`
  (handleBuyNow redirects to /login when not registered),
  `supabase/functions/polar-checkout/index.ts` (currently requires JWT),
  `supabase/functions/polar-webhook/index.ts` (currently only updates
  subscription state — would also need to record template purchases for
  option D2).

### Polar sandbox environment for payment testing
- **Status:** code supports it (Apr 18) but sandbox account not set up.
- **Effort:** S (<30 min once a sandbox Polar org exists)
- **Why:** testing the purchase flow against prod Polar requires a real
  card and a real charge / refund each time. Painful. Sandbox uses Stripe
  test cards (`4242 4242 4242 4242`), no real money.
- **How to enable (when needed):**
  1. Sign up at `https://sandbox.polar.sh` with a separate org.
  2. Replicate one or two products (for testing).
  3. Create sandbox API token + webhook there, pointed at the same
     `polar-webhook` Edge Function (signature scheme is identical).
  4. In Supabase Edge Function secrets, set:
     - `POLAR_API_URL=https://sandbox-api.polar.sh`
     - `POLAR_ACCESS_TOKEN=<sandbox token>`
     - `POLAR_WEBHOOK_SECRET=<sandbox webhook secret>`
     - `POLAR_PRO_PRICE_ID=<sandbox subscription product id>`
  5. Redeploy `polar-checkout` and `polar-webhook` so they pick up the
     new secrets. (No code change — the env var already exists.)
  6. Test with Stripe test card `4242 4242 4242 4242`, any future expiry,
     any 3-digit CVC.
- **Switching back:** reset the same env vars to production values and
  redeploy. No DB / code changes required.
- **Related:** `supabase/functions/polar-checkout/index.ts` reads
  `POLAR_API_URL` (added Apr 18 — defaults to prod).

### Cart surface left in the codebase (intentionally)
- **Status:** decided Apr 18 to **drop the cart from the UI** but keep
  the `CartContext` + `/checkout` page in code for now, in case we want
  to revisit multi-item checkout later. Only "Free" templates still use
  `Add to Cart` (single-item get flow).
- **Follow-up:** the existing roadmap item *"Fix /checkout UX lie"* is
  still open — `/checkout` currently renders a Stripe-labelled form with
  no submit handler. Pick a resolution (redirect / disable / replace)
  once the purchase-flow decision above lands.
- **Files touched Apr 18:** `src/presentation/pages/TemplateDetailPage.tsx`
  (hid Add-to-Cart for paid items, kept Buy Now + Buy on Etsy).

### Rename `swift-processor` Edge Function → `polar-list-products`
- **Status:** not started (leftover from Apr 18 session — Supabase auto-named
  the deploy).
- **Effort:** S (<10 min)
- **What to do:** in Supabase Dashboard → Edge Functions, delete the
  `swift-processor` function, redeploy the same code under the correct
  name `polar-list-products`. Update the `polar-list-products URL` line
  in `docs/POLAR-PRODUCTS.md` once renamed.
- **Why not blocked:** the name is cosmetic — the function works as-is.
  Worth fixing only for operator clarity.

### Verify webhook signature fix with a live Polar delivery
- **Status:** not started — code is deployed but we haven't confirmed a
  real event flows end-to-end and flips `profiles.is_pro` without manual
  SQL.
- **Effort:** S
- **How to verify:**
  1. In Polar dashboard → Webhooks → Deliveries, pick any failed
     `subscription.created` or `.updated` event → Redeliver.
  2. Watch `polar-webhook` logs in Supabase → expect 200 OK with no
     "signature verification failed" entries.
  3. Run `select is_pro, subscription_status from public.profiles where
     id = '<user id>';` — should reflect the delivered state.
- **Fallback:** the manual SQL unblock (setting `is_pro=true` directly)
  still works if the webhook fails again. Capture the failure log in
  this ticket before retrying.

### Add cards for the 21 unmapped Polar products (or archive them)
- **Status:** not started. Product IDs + prices captured in
  `docs/POLAR-PRODUCTS.md` §2.
- **Effort:** M (half a day per ~10 cards if images + copy already exist)
- **Decision:** do we want **all 34** Polar products as site cards, or
  curate (current 13 + pick some of the 21)? Bundles look valuable
  ($13-14 price points, likely higher AOV than single templates).
- **How to add a card:** `docs/POLAR-PRODUCTS.md` "cheat sheet" at the
  bottom — copy id into a new `TEMPLATES[]` entry. No Polar-side change.
- **Related files:** `src/presentation/data/templates.ts`,
  `public/` (needs an `image` asset per card).

### Footer legal-links coverage audit
- **Status:** not started
- **Effort:** S
- **Why:** `Footer.tsx` renders Privacy / Terms / Refund / Imprint. German
  law (TMG §5 Impressum) requires these be reachable from **every** page in
  ≤2 clicks. Need to verify the Footer is actually mounted on every route:
  LandingPage, TemplatesPage, TemplateDetailPage, WidgetStudioPage, StudioPage,
  CheckoutPage, LoginPage, SettingsPage, PrivacyPage, TermsPage, RefundPage,
  LegalPage, embed pages. Embed pages (`/embed/*`) are iframes — footer there
  is optional / arguably wrong, but confirm.
- **Plan:** grep each page for `<Footer` import, list any page missing it,
  decide per page whether to add or explicitly document why absent.
- **Related files:** `src/presentation/components/shared/Footer.tsx`, every
  file under `src/presentation/pages/`.

### Password-breach check at signup
- **Status:** not started
- **Effort:** S
- **Why:** Reject obviously compromised passwords ("password123", leaked
  credentials). Best to catch at signup rather than after a breach.
- **Plan:** Client-side k-anonymity call to HaveIBeenPwned Pwned Passwords
  API (first 5 chars of SHA-1). No password ever leaves the client.

---

## Backlog — low priority 🟢

### Hero V2 rollout — cleanup old HeroSection
- **Status:** V2 is live as default on landing (Apr 20, 2026). Old `HeroSection`
  is archived but still in the repo as a fallback.
- **To delete once V2 is confirmed in prod:**
  - `src/presentation/components/landing/HeroSection.tsx`
  - Commented import in `src/presentation/pages/LandingPage.tsx` (line ~5)
  - `$v2` prop on the `Hero` styled-component in `LandingPage.tsx` (now always
    true — drop the prop, always apply the V2 background, delete the v1 gradient
    `&::before` branch)
  - Any `?hero=v2` URL-param references left in analytics or docs
- **Effort:** S (15 min cleanup)
- **Blocker:** owner visual QA of V2 on production for 1 week before delete

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

### 2026-04-18 (subscription + Polar sync session)
- **Supabase env var recovery** — production deploy was falling back to
  `https://example.supabase.co` because `VITE_SUPABASE_URL` /
  `VITE_SUPABASE_ANON_KEY` weren't in Vercel when the last build ran.
  Added them, redeployed, Google OAuth works again. Removed the silent
  `fallbackUrl` in `supabase.ts` — missing env now throws loudly instead
  of producing a bogus client.
- **Polar webhook signature verification fix** — webhook was returning
  **401 on every delivery** because the code checked for the old
  `Polar-Signature` header while Polar has migrated to Standard Webhooks
  (`webhook-id` / `webhook-timestamp` / `webhook-signature`). Rewrote
  `polar-webhook/index.ts` to use `standardwebhooks@1.0.0` from esm.sh,
  and to translate `polar_whs_<b64>` → `whsec_<b64>` so the library
  accepts the secret. Webhook-missing-metadata path now also logs the
  full payload and all request headers for future debugging.
- **Pro state propagation fix** — multiple surfaces still showed "Free"
  for Pro users:
  - `StudioPage` welcome banner and widget-editor header showed
    `4/3 widgets · Upgrade now` for Pro users — now shows a `PRO ·
    N widgets · unlimited` block.
  - `WidgetStudioPage` gallery Customize button read `(item.pro ||
    quota.atLimit)`, unconditionally gating Pro-only styles behind
    Upgrade even for Pro users. Fixed to `(item.pro && !quota.isPro) ||
    quota.atLimit`.
  - `DashboardViews.tsx` SettingsView was a hard-coded "Free plan"
    with a non-functional Upgrade button — now reads `isPro` from
    AuthContext and shows Manage (Polar portal) for Pro users.
  - `TopNav` account dropdown hid the Upgrade CTA for Pro users and
    added a matching `PRO · Unlimited widgets` info row.
- **Plan-loading flicker** — hard refresh on a Pro page flashed the
  free-tier UI for ~200ms while `SubscriptionService.getPlan()` resolved.
  Added `planLoading` to `AuthContext`; surfaces gate Pro-only UI until
  the first read completes.
- **PRO badge visual consistency** — unified the four places that
  rendered a Pro indicator (Settings, Studio dashboard, widget editor,
  avatar dropdown) onto a single pill style: height 22 · radius 999 ·
  font-size 10 · letter-spacing 0.06em · uppercase · indigo gradient.
- **Polar product catalogue pulled into the site** —
  - New Edge Function `polar-list-products` fetches all products
    from Polar (currently deployed at `/functions/v1/swift-processor`
    under its auto-generated name — rename when convenient).
  - `Template.polarProductId` field added; all 13 site cards populated
    by matching the Etsy listing id that Polar uses as a product-name
    prefix. Output captured in `docs/POLAR-PRODUCTS.md` (34 products
    — 13 on the site, 21 available for future cards).
  - `polar-checkout` Edge Function now accepts `{ productId,
    successPath }` in the request body, defaulting to
    `POLAR_PRO_PRICE_ID` for the subscription flow. One handler for
    subscription + template purchases.
  - `SubscriptionService.startCheckout({ productId, successPath })`
    plumbs the new options through.
  - `TemplateDetailPage` primary CTA is now **Buy Now · $X** wired to
    Polar; the Etsy button stays as a secondary alternative for buyers
    who prefer it. Mobile sticky buy bar updated to match.
- **Template prices reconciled with Polar** — 12 of 13 cards had a
  hard-coded display price higher than what Polar actually charges
  ($18.99 vs $9, etc.). `price` / `priceNum` realigned to the Polar
  amount so the UI never over-promises and then under-charges.
- **Roadmap** — new item *Footer legal-links coverage audit* added
  (medium priority) to verify TMG §5 Impressum reachable from every
  page, and an Apr 18 changelog entry (this one) to record the above.
- **Hybrid guest/registered purchase flow — wired up** —
  - New migration `006_purchases.sql`: `purchases` table (nullable
    `user_id` so guests can buy), unique `polar_order_id` for
    idempotency, row-level security so each user can only see their own,
    plus a `link_purchases_to_user(uuid, text)` SECURITY DEFINER
    function for back-filling on sign-up.
  - `polar-webhook` now handles `order.created` / `order.updated` /
    `order.paid`, writes to `purchases` with an upsert on
    `polar_order_id`. Subscription invoice orders are skipped to avoid
    double-counting.
  - `polar-checkout` no longer requires a JWT for template products —
    guest checkout works end-to-end; Polar collects the email on its
    hosted page. Subscriptions still require auth.
  - `AuthContext` calls `link_purchases_to_user` on every sign-in so a
    buyer who paid as a guest, then later registered with the same
    email, sees their order in the dashboard. Idempotent — safe to run
    repeatedly.
  - New `PurchaseService.getMyPurchases()`; rewritten Studio →
    Purchases view pulls real rows from Supabase, maps product ids back
    to local `TEMPLATES[]` for image + title, formats the amount and
    date, routes Download → Polar customer portal.
  - Success banner on `/studio?purchased=<productId>` (green pill with
    email + "Create account" CTA for guests + dismiss button). URL
    param cleared on dismiss so refresh doesn't re-show.
  - Cart UI hidden for paid templates (kept for free ones); Etsy link
    demoted to secondary.
- **Owner checklist** — new doc `docs/POLAR-LAUNCH-STEPS.md` enumerates
  every manual step the owner still needs to do: run migration 006,
  redeploy both edge functions, subscribe webhook to `order.*` events,
  attach PDF file benefits to all 13 Polar products, turn on the EU
  withdrawal-right waiver, write real Refund page copy, set up the
  support email forwarder.

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
