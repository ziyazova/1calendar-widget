# Commerce launch plan — Peachy Studio

> **Status:** research + current-state map complete (Apr 17, 2026).
> No implementation yet — this doc is the agreed spec before we start building.
>
> **Scope:** ship all three revenue surfaces to live customers compliantly.
>
> 1. **`$4/month Pro` widget subscription** via Polar (Merchant of Record).
> 2. **One-time Notion planner purchases** — either on Peachy (via Polar) or
>    redirected to external marketplaces. See §13.
> 3. **External marketplace redirects** (Etsy today; Gumroad/Creative Market
>    later). The seller of record for those sales is the marketplace, not us,
>    but we still have disclosure, privacy, and UX obligations. See §14.
>
> All three share the same legal foundation (ToS, Privacy, Impressum, Refund,
> ODR link) but differ in checkout flow, withdrawal rules, and refund
> responsibility. Differences are spelled out per surface.
>
> Cross-cutting concerns still apply to all three:
> - free tier properly enforced (3 widgets, basic types)
> - Pro upgrade flow (real merchant onboarding)
> - legal pages that won't get us sued or fined
> - clean cancel/renewal UX (EU + California + Germany compliant)
> - observability + anti-abuse basics

> **Owner context:** sole individual in Sweden (EU), selling globally via Polar as
> Merchant of Record. No registered business yet (decision pending — see §6).
> Related docs:
> - `docs/SUBSCRIPTION.md` — implementation plan for the code side
> - `docs/AUTH.md` — auth flows
> - `docs/ROADMAP.md` — ongoing backlog

---

## 1. Current state (map of code that exists today)

### 1.1 Subscription (Pro)

| Area | Status | Gap |
|---|---|---|
| **Checkout wiring** (UpgradeModal → `polar-checkout` → Polar) | ✅ Works end-to-end; Polar hosted checkout opens with prefilled email | None (blocked only on Polar merchant onboarding) |
| **Webhook → `profiles.is_pro`** (`polar-webhook`) | ✅ Handles 4 events, HMAC-verified, idempotent via row-level updates | No dedicated `polar_webhook_events` dedup table — minor |
| **`isPro` in frontend** (`AuthContext`) | ✅ Exposed; `SettingsPage` + `TopNav` adapt to pro state | None |
| **Widget count limit (3 free)** | ⚠️ Client-only: `StudioPage` shows `{n}/3`, red ring at 3 | **Server-side RLS check missing** — free user can bypass via direct PostgREST |
| **Pro widget gating** (Typewriter, Flower Clock) | ⚠️ Cosmetic: card shows `✦ Upgrade`, opens modal | Once user is logged in, no runtime check when saving a Pro-styled widget |
| **Email verification** | ⚠️ Banner only (`EmailVerificationBanner`) | Doesn't gate checkout or widget-create; bots can sign up + convert |
| **Cancel subscription** | ⚠️ Settings button opens `polar.sh` in new tab | No persistent footer link, no in-app portal deep-link |
| **Legal pages** | ✅ `/privacy` + `/terms` — real content, Swedish law, EU-aware | No `/refund`, no imprint/legal notice, no subscription-specific terms, no ODR link |
| **Cookie banner** | ✅ `ConsentBanner` — but only informational (no tracking set anyway) | N/A until analytics added |
| **Analytics / events** | ❌ Nothing | Greenfield; add Plausible (cookie-less) before launch |

### 1.2 Planners / templates (one-time)

| Area | Status | Gap |
|---|---|---|
| **Template catalog** (`/templates`, `/templates/:id`) | ✅ 13 templates with prices, images, features, FAQ, related | None |
| **Local cart** (`CartContext`) | ⚠️ Exists, adds/removes items, shows count in nav | **No real checkout** — `/checkout` page renders form but nothing executes |
| **Etsy "Buy" button** | ⚠️ `window.open('https://www.etsy.com/shop/PeachyStudio', '_blank')` on `TemplateDetailPage.tsx:865, 917` | Missing `rel="noopener noreferrer"`; no disclosure that sale is processed by Etsy; goes to shop root, not product page |
| **Commercial license** | ⚠️ FAQ says "commercial use allowed" | Not in ToS; no license file; resale/redistribution rules undefined |
| **Delivery mechanism** (download link after pay) | ❌ Nothing (sale happens on Etsy, which handles delivery) | If we sell directly via Polar later → need private link / email fulfilment |
| **Refund policy for digital goods** | ❌ Nothing | CRD waiver needed at checkout; Etsy has own policy we can't override |

### 1.3 External marketplace redirects

| Area | Status | Gap |
|---|---|---|
| **Etsy redirect** | ⚠️ Two entry points (desktop sidebar + mobile sticky bar) | No disclosure, no `noopener`, confusing alongside internal "Add to Cart" |
| **Other marketplaces** (Gumroad, Creative Market, Notion Gallery) | ❌ Not wired | Plan says templates may appear there later — need a unified outbound-link pattern |
| **Affiliate / UTM tracking** | ❌ Nothing | Can't measure conversion from site → Etsy sale |

### 1.4 Verdict

Checkout wiring is done, legal pages are good foundations, planner redirects
work but are mis-labelled, and the local cart is a UX lie (nothing executes).
Hard blockers before real paying customers:

1. Server-side tier enforcement for subscription (see §4).
2. Proper checkout disclosures for subscription (see §5) and per-purchase
   waiver for digital downloads (see §13).
3. Cancel-subscription button in footer (subscription) + clear "this takes you
   to Etsy" disclosure (marketplace redirects).
4. Refund / auto-renewal policy that matches CRD Art. 16(m) waiver.
5. Decide: keep local cart theatre for planners, remove it entirely, or make it
   real via Polar. Today's "Add to Cart" + "Buy on Etsy" side-by-side is not
   shippable (see §13.2).

---

## 2. What Polar covers as Merchant of Record (and what it doesn't)

Polar explicitly acts as **reseller of record**. This shifts a lot:

**Polar handles:**
- VAT / GST / US sales tax collection & remittance (via EU OSS, UK VAT, US per-state).
- Invoice generation (Polar Software Inc. is listed as seller, NOT us).
- Chargeback handling (fee **$15 per dispute, non-refundable**, deducted from balance).
- Refund processing (up to 60 days at Polar's discretion, even against a "no refund" policy).
- 3DS2 / SCA / PSD2 compliance.
- KYC of buyers.
- Acceptable-use enforcement (they suspend us if chargeback ratio > ~0.7%).

**We stay responsible for:**

1. **Swedish income tax** — Polar's payouts to us are income. Register **F-skatt** at Skatteverket. VAT threshold SEK 120,000/yr (below it → no VAT reg, Polar's MoR covers tax on sales anyway).
2. **Product liability** (EU Digital Content Directive 2019/770) — 2-year conformity obligation to end users. Can't disclaim.
3. **Data Controller under GDPR** — everything about user accounts, not just billing.
4. **Consumer disclosures on our website** — ToS, Privacy, Refund, Impressum, cancel button.
5. **MoR disclosure** — tell users "Polar Software Inc. is the seller of record; your card statement will read POLAR*PEACHY…" (reduces "who is this charge?" chargebacks).
6. **14-day withdrawal right waiver opt-in** — Polar doesn't write this for us.
7. **Indemnity to Polar** for IP/tax breaches. Don't copy other people's templates.

**Commonly missed:**
- Polar's payout to us = income, not post-tax net. Bookkeep accordingly.
- Disputed charge = $15 lost even if we "win" the dispute. Good copy and easy cancel beat disputes.

---

## 3. Legal pages checklist

Rule: **required** = if missing, we can be fined or contracts voided.
**recommended** = standard practice; missing these invites trouble.

### 3.1 Terms of Service — REQUIRED
**Status:** `/terms` exists, ~2000 words, Swedish law, subscription clause stub.
**Needs update for launch:**
- [ ] **Merchant of Record disclosure** — one paragraph: "Payments are processed by Polar Software Inc, acting as Merchant of Record. Your card statement will read POLAR*PEACHY…"
- [ ] **Auto-renewal clause**: "Your subscription renews monthly at €4 (or local equivalent) until cancelled."
- [ ] **14-day withdrawal + waiver** (CRD Art. 16(m)): "By subscribing and ticking the consent box at checkout, you ask us to start performance immediately and acknowledge you lose the 14-day right of withdrawal."
- [ ] **Cancellation method** — link to Polar portal + in-app button.
- [ ] **Governing law caveat** — we keep Swedish law, but consumers in other EU states retain their home-country protections (can't override with venue clause).
- [ ] **ODR platform link** — `https://ec.europa.eu/consumers/odr` — required for all EU online traders.
- [ ] **What happens on downgrade / cancel** — link to §4.5 below (grandfather widgets, lock new creates).

### 3.2 Privacy Policy — REQUIRED
**Status:** `/privacy` exists, ~2200 words, GDPR-structured, covers Supabase + Vercel + Google OAuth.
**Needs update:**
- [ ] Add **Polar Software Inc. (payments)** to sub-processor list.
- [ ] **International transfers** — name the legal mechanism: EU-US Data Privacy Framework (Supabase/Vercel/Polar/Google are all certified), or SCCs 2021/914 for any non-DPF vendor.
- [ ] **Right to lodge complaint** — link to [IMY](https://www.imy.se) (Swedish DPA).
- [ ] **Billing data retention** — 7 years (Bokföringslagen — Swedish bookkeeping law).

### 3.3 Refund / Cancellation Policy — REQUIRED (currently missing)
**New page `/refund`:**
- [ ] State: **by default, 14-day cooling-off applies** to consumers in EU.
- [ ] State the waiver: "If you tick the box and subscribe, you ask us to start Pro access immediately and lose the withdrawal right."
- [ ] Goodwill policy (optional, reduces chargebacks): "Within the first 7 days of your first Pro payment, if you're unsatisfied, email us — we'll refund. After that, subscriptions are non-refundable; you can cancel anytime via the customer portal to stop future billing."
- [ ] Cancellation how-to (step-by-step + portal link).
- [ ] What happens to data on cancel (grandfathered widgets, read-only embeds, no destruction — see §4.5).

### 3.4 Impressum / Legal notice — REQUIRED in EU
E-commerce Directive Art. 5 (Sweden: E-handelslagen SFS 2002:562).
**New page `/legal`** with:
- [ ] Full name of operator.
- [ ] Business address (if we register as sole trader → use registered address or a business-address-as-a-service like Sverigehuset; we will **NOT** publish a personnummer).
- [ ] Email for direct contact.
- [ ] `organisationsnummer` / VAT number if registered.
- [ ] Consumer-agency supervisor note: "Konsumentverket (Swedish Consumer Agency) oversees consumer complaints."
- [ ] ODR link (again — in footer + here).

**Decision pending:** register `enskild näringsverksamhet` at Bolagsverket (free) or launch as unregistered. If unregistered, we publish name + business-address-as-a-service. See §6.

### 3.5 DPA — RECOMMENDED (on request)
**New page `/legal/dpa`** or linked PDF:
- [ ] Standard SCCs template + sub-processor list.
- [ ] Offer on request only (don't push; B2C users don't need it, but a business-user might).

### 3.6 Subscription Terms block — REQUIRED at checkout
Cannot hide behind "it's in ToS"; must surface **before the pay button**:
- [ ] Product description (what Pro includes).
- [ ] Total including VAT.
- [ ] Recurrence ("renews monthly at €4 until cancelled").
- [ ] Cancellation instructions.
- [ ] Withdrawal waiver checkbox (unchecked by default).
- [ ] MoR disclosure.

### 3.7 Cookie banner — OK as-is
We only use strictly-necessary cookies (auth session). No consent banner needed until we add non-essential analytics. If/when Plausible is added — it's cookie-less, still no banner needed.

**Commonly missed:** Google Fonts via CDN is a GDPR violation in Germany. Self-host Inter (or confirm we're not using Google CDN). TODO: audit this.

### 3.8 Templates / where to write
Preference for launch:
- ToS, Privacy, Refund → hand-written (we have a good start); run final pass through **Termly** free tier as a sanity check / fills-in-blanks.
- Impressum → hand-written, 10 lines.
- DPA → SCCs 2021/914 base + our sub-processor list.

---

## 4. Free tier enforcement (where and how)

### 4.1 Principle: defense in depth
Client-side gating = nice error UX; server-side gating = security. We need both.

### 4.2 Widget-count limit (3 on free, ∞ on Pro)

| Layer | What | Where |
|---|---|---|
| UI | Hide Create button at 3, show upgrade modal | `StudioPage.tsx` (already has `widgetLimit={3}` counter) |
| DB | RLS WITH CHECK on `widgets.INSERT` | New migration `004_widget_tier_enforcement.sql` |

**Migration sketch:**
```sql
-- Replace the existing permissive INSERT policy with a tier-aware one.
create or replace function public.user_is_pro(uid uuid)
returns boolean language sql stable security definer as $$
  select coalesce(is_pro, false) from public.profiles where id = uid;
$$;

drop policy if exists "insert own widgets" on public.widgets;
create policy "insert own widgets within tier"
  on public.widgets for insert
  with check (
    auth.uid() = user_id
    and (
      public.user_is_pro(auth.uid())
      or (select count(*) from public.widgets where user_id = auth.uid()) < 3
    )
  );
```

### 4.3 Pro widget styles (Typewriter, Flower Clock, …)
Gate at DB — free user cannot insert a widget with a pro-only `style`:
```sql
-- List of pro styles lives in the function so we can change without migration.
create or replace function public.is_pro_style(style text)
returns boolean language sql immutable as $$
  select style in ('typewriter', 'flower-clock'); -- extend as needed
$$;

-- Add to the INSERT / UPDATE WITH CHECK:
-- OR public.user_is_pro(auth.uid()) OR NOT public.is_pro_style(widgets.style)
```

### 4.4 Tier column protection (don't let users self-upgrade)
`profiles` already has RLS **read-only** for `authenticated` (no INSERT / UPDATE policy → default deny). Write path is webhook with service-role key.
**Belt & braces:** `REVOKE UPDATE (is_pro, polar_customer_id, polar_subscription_id, subscription_status, current_period_end) ON public.profiles FROM authenticated;` — Supabase-documented column-level lock.
**Audit:** no `SECURITY DEFINER` RPC should touch tier. `delete_own_user` is the only existing one — fine.

### 4.5 Downgrade behaviour (industry standard: grandfather)
When `subscription.revoked` fires:
- `profiles.is_pro = false`.
- Existing widgets **stay**, embeds **stay live** (widget state is URL-encoded anyway — there's no per-widget cost).
- **Block creating new widgets if count ≥ 3** (same RLS rule as a fresh free user).
- **Pro-only styles remain embeddable** for already-live widgets. Future edit that changes `style` → blocked by RLS unless they re-upgrade. This avoids "support nightmare: my Notion embed broke" ragequits (Notion, Linear, Airtable all follow this pattern).
- Copy this clearly in `/refund` and in the cancel-confirmation email.

### 4.6 Email verification as free-tier gate
Add a gate: **widget creation requires `email_confirmed_at != null`**. Why:
- Stops bot sign-ups from consuming 3-widget quota and burning signup rate limits.
- Polar checkout still works from unverified account (you pay then we reconcile).
- RLS `with check (auth.jwt() ->> 'email_verified' = 'true' OR …)` — use Supabase's JWT claim.

### 4.7 Webhook idempotency (safety net)
Currently webhook updates are idempotent because `UPDATE` is deterministic. Still add:
```sql
create table public.polar_webhook_events (
  event_id text primary key,
  type text not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  payload jsonb
);
```
Handler: `INSERT … ON CONFLICT (event_id) DO NOTHING RETURNING *`. If nothing returned → duplicate, respond 200 and exit. Retention ≥ 7 days to cover Polar retry window.

### 4.8 Reconciliation cron (safety net)
Polar emits `customer.state_changed` which contains the authoritative state. Daily cron pulls it, diffs against `profiles`, fixes drift. Implement later — webhook is reliable enough for launch.

---

## 5. Checkout / cancel UX — what EU + California + Germany require

### 5.1 Pay button label — **contract-validity risk**
Must be unambiguous about payment obligation. CJEU rulings (Fuhrmann-2, Conny) have voided contracts where the button said "Book" or "Continue". Accepted:
- **"Subscribe — €4/month"** ← recommended
- **"Pay and subscribe"**
- **"Pay €4 now"**
- **"Buy now"**

Banned: "Start Pro", "Continue", "Confirm", "Submit", "Register".

Polar's hosted checkout is probably compliant — **verify the actual button text** on their UI in Sandbox, and on any checkout we embed. If Polar's label is non-compliant, file a ticket.

### 5.2 Pre-contract info (before pay button)
Polar's checkout shows price + product, which covers most of it. Our responsibility: make sure a link to our Refund Policy + Terms is accessible from the checkout page. Polar supports custom metadata and a custom "checkout fields" form — we can add a required checkbox:
> ☐ I agree to the Terms, Privacy, and Refund Policy and consent to immediate performance, understanding I lose my 14-day right of withdrawal.

This is built on Polar's `custom_fields` feature, configured per product in Polar dashboard.

### 5.3 Cancel surface — REQUIRED under EU 2023/2673 + German FCCA
- [ ] **Footer link "Cancel subscription"** on every page (German Kündigungsbutton: permanently visible, labelled explicitly, reachable without extra login hurdles beyond the usual).
- [ ] **Settings → Subscription** section (already built) — polish the Polar portal link copy: **"Cancel or manage subscription"** not just "Manage on Polar".
- [ ] On cancel confirmation (Polar portal handles this): email receipt.
- [ ] Don't disable Pro access on `subscription.canceled`; do it on `subscription.revoked` (access continues till period end — user paid for it).

### 5.4 Post-purchase welcome email (we send; Polar only sends a receipt)
Required content per CRD Art. 8(7):
- Confirmation of subscription.
- Plan + price + billing cycle.
- Link to cancel (Polar portal URL).
- Link to withdrawal form (CRD Annex I model form) — or a note that waiver was given.
- Link to Terms & Refund Policy snapshots at purchase time.
- Support contact.

Implementation: Supabase Edge Function `polar-welcome-email` triggered by `subscription.created`, sends via Resend/SendGrid. Post-launch.

### 5.5 Renewal reminder (Germany-safe)
Send an email 3 days before `current_period_end` to existing subscribers: "Your Pro renews on [date] for €4. Cancel anytime: [link]." Cheap, reduces chargebacks dramatically. Polar doesn't do this automatically. Same email function.

### 5.6 Price-change notification
If we ever raise the price, EU requires **30 days advance notice** to existing subscribers and the right to cancel before it applies. Not urgent for launch, but write the procedure down.

---

## 6. Business registration decision (blocker for launch)

**Choice:**

**A) Launch unregistered as individual.** Publish real name + business-address-as-a-service + email. Tax filed as personal income (NE-bilaga). Swedish VAT threshold SEK 120k/yr — below it, no VAT registration needed.
- Pros: fastest, zero cost, Polar handles VAT on sales.
- Cons: personal name publicly attached; above SEK 120k triggers VAT registration; F-skatt still needed.

**B) Register `enskild näringsverksamhet`.** Free at Bolagsverket, still unlimited personal liability but visible business name.
- Pros: business name in impressum instead of personal name; cleaner for contracts; registered address (can be virtual).
- Cons: admin; still personal liability.

**C) Aktiebolag (AB).** Limited liability, SEK 25,000 share capital, annual reports.
- Pros: proper liability shield.
- Cons: overkill for $4/mo SaaS at launch.

**Recommendation for launch:** **A** (fast) or **B** (clean). Default to A; upgrade to B once revenue is steady. **Get F-skatt first** either way.

**Action items (you):**
- [ ] Register F-skatt at verksamt.se.
- [ ] Pick A or B.
- [ ] If B: register at bolagsverket.se → get business-address-as-a-service (~SEK 300/mo) if you don't want home address public.

---

## 7. Observability & anti-abuse — minimum viable

### 7.1 Events to track (from day 1)
Store in a `events` table (own) or a cookie-less analytics service (Plausible `$9/mo`, or PostHog free tier).

Lifecycle:
- `user.signup` / `email.verified`
- `widget.created` / `widget.updated` / `widget.deleted`
- `upgrade.cta_clicked` (which page?)
- `checkout.started` (our Edge Function logs this)
- `checkout.expired` (Polar webhook)
- `subscription.created` / `active` / `past_due` / `canceled` / `revoked`
- `order.refunded` / `refund.created`
- `login.failed` / `password.reset`

### 7.2 Abuse mitigations (cheap wins)
- [ ] **Disposable-email blocklist** on signup (use `disposable-email-domains` GitHub list, update monthly). Kills ~90% of free-tier abuse.
- [ ] **Rate-limit checkout** — 5 checkouts per IP per hour (via Supabase Edge Function rate limit).
- [ ] **Require email verification before widget creation.**
- [ ] **Monitor chargeback ratio** — once/week eyeball Polar dashboard. Above 0.5% → investigate before we hit Polar's 0.7% suspension ceiling.

### 7.3 Incident response
- Supabase Edge Function logs tailed for errors (already have these via Supabase dashboard).
- Polar dashboard for payment diagnostics.
- Nothing fancy needed pre-launch.

---

## 8. Phased implementation plan

Grouped so each phase ends on a deployable, testable increment.

### Phase 0 — Polar merchant onboarding (BLOCKER, owner task)
- Connect Stripe Connect in Polar.
- Complete KYC / verification.
- Publish live product.
- **No code work.**

### Phase 1 — Server-side tier enforcement (code)
- Migration `004_widget_tier_enforcement.sql`:
  - `user_is_pro(uid)` SQL helper.
  - `is_pro_style(style)` SQL helper.
  - Replace `widgets.INSERT` policy with tier-aware WITH CHECK (count < 3 OR pro).
  - Same for UPDATE when `style` changes.
  - Column-level revoke on `profiles` tier columns.
- Frontend: wrap widget-save error handling; show friendly "upgrade to keep saving" prompt on 403.
- Test: free user with 3 widgets → 4th save fails server-side AND opens modal. Upgrade → 4th saves.

### Phase 2 — Legal pages + compliance copy
- Update `/terms`: MoR disclosure, auto-renewal clause, withdrawal waiver, ODR link.
- Update `/privacy`: add Polar to sub-processors, DPF / SCCs mention, IMY link, 7-year billing retention.
- New `/refund`: 14-day right + waiver, goodwill 7-day window, cancel how-to, downgrade behaviour.
- New `/legal` (impressum): name, address, email, ODR link, Konsumentverket note.
- Footer: add `Refund`, `Legal/Imprint`, **"Cancel subscription"** (deep-links to Polar portal for Pro users, to `/settings` otherwise).

### Phase 3 — Checkout polish + welcome email

**Code shipped (Apr 18, 2026):**
- Migration `005_email_bookkeeping.sql` — adds `welcome_email_sent_at` and
  `last_renewal_reminder_sent_at` on `profiles`, plus a partial index scoped
  to active-pro rows so the daily sweep stays cheap.
- Edge Function `polar-welcome-email` — idempotent Resend sender keyed off
  `welcome_email_sent_at`. Covers MoR disclosure, cancel link, withdrawal-waiver
  acknowledgement, and Terms/Refund/Privacy links.
- `polar-webhook` — fire-and-forget invoke of `polar-welcome-email` on
  `subscription.created`. Email failures never fail the webhook.
- Edge Function `polar-renewal-reminder` — cron-triggered sweep for
  `current_period_end` 2.5–3.5 days out, dedup window of 20 days so one
  reminder per billing cycle. Gated by `CRON_SHARED_SECRET` (not user JWT).
- `SettingsPage` — button relabelled to **"Cancel or manage subscription"**
  per §5.3.

**Owner tasks (before launch):**
1. **Resend account + domain**
   - Sign up at [resend.com](https://resend.com).
   - Verify a sending domain (e.g. `peachy.studio` or subdomain). SPF + DKIM
     records take 5–15 min to propagate.
   - Create API key → copy value.
2. **Set Supabase secrets** (Dashboard → Project Settings → Edge Functions → Secrets):
   ```
   RESEND_API_KEY      = re_xxx…
   RESEND_FROM         = Peachy Studio <no-reply@peachy.studio>
   CRON_SHARED_SECRET  = <any 32+ char random string>
   # APP_BASE_URL already set for polar-checkout — reuse
   ```
3. **Deploy the two functions:**
   ```
   supabase functions deploy polar-welcome-email
   supabase functions deploy polar-renewal-reminder --no-verify-jwt=true
   ```
4. **Schedule the reminder cron** — pick one:
   - *Simplest — external cron* (cron-job.org, EasyCron): daily POST to
     `https://<project>.supabase.co/functions/v1/polar-renewal-reminder` with
     header `Authorization: Bearer <CRON_SHARED_SECRET>`.
   - *Supabase pg_cron* (Dashboard → Database → Extensions → enable `pg_cron`
     + `pg_net`, then run in SQL Editor):
     ```sql
     select cron.schedule(
       'polar-renewal-reminder-daily',
       '0 9 * * *',
       $$
       select net.http_post(
         url := 'https://<project-ref>.supabase.co/functions/v1/polar-renewal-reminder',
         headers := jsonb_build_object(
           'Authorization', 'Bearer <CRON_SHARED_SECRET>',
           'Content-Type', 'application/json'
         ),
         body := '{}'::jsonb
       );
       $$
     );
     ```
5. **Polar dashboard — product-level checkout config** (still owner task):
   - Enable the custom-fields checkbox: *"I agree to the Terms, Privacy, and
     Refund Policy and consent to immediate performance, understanding I lose
     my 14-day right of withdrawal."* Required, unchecked by default.
   - Verify the pay button copy reads **"Subscribe — $4/month"** (or a
     compliant variant per §5.1). File a ticket with Polar if not.

**Smoke test after deploy:**
- Trigger a sandbox subscription → inbox receives welcome email within ~10s
  with the right renewal date.
- Re-trigger the webhook (Polar → Webhooks → Retry) → welcome function
  returns `{ skipped: "already_sent" }`, no second email.
- Manually POST to the reminder function with the shared secret → returns
  `{ scanned, sent, errors }`.

### Phase 4 — Email verification gate + anti-abuse
- Add `auth.jwt() ->> 'email_verified' = 'true'` to widget INSERT RLS.
- Frontend: if unverified, widget-save returns 403, show verify banner more prominently.
- Signup form: disposable-email blocklist check.
- Signup: rate-limit per IP (via Edge Function).

### Phase 5 — Observability
- Add Plausible to frontend (cookie-less — no banner needed).
- Add `events` table in Supabase + a thin `trackEvent(name, data)` helper.
- Minimal dashboard: MRR, active subs, signup→paid conversion. Can be SQL queries for v1.

### Phase 6 — Reconciliation safety net (nice-to-have)
- Daily cron (Supabase `pg_cron`): call Polar `GET /v1/customers?state_changed_after=…`, diff against `profiles`, fix drift.

### Phase 7 — Downgrade UX polish
- On cancel confirmation, show the user clearly: "Your widgets stay. Pro styles on existing embeds keep working. You can't create new widgets after you go below the 3-widget free limit."
- Test: cancel → period ends → tier drops → existing widgets editable for metadata but style changes to Pro-only are blocked.

---

## 9. Pre-launch checklist (print + tick)

### Legal & business
- [ ] F-skatt registered (Skatteverket)
- [ ] Decide A / B / C business form (§6) and registered if B/C
- [ ] Business address-as-a-service if B/C
- [ ] Collect DPAs: Supabase, Polar, Vercel, Supabase auth (Google)
- [ ] Audit Google Fonts usage (self-host Inter if applicable)

### Polar merchant
- [ ] Stripe Connect linked
- [ ] KYC passed
- [ ] Merchant terms accepted
- [ ] Live product published
- [ ] Production webhook endpoint configured with `subscription.created/updated/canceled/revoked`
- [ ] Custom-fields checkbox at checkout (withdrawal waiver)
- [ ] Pay button wording verified

### Code (server)
- [ ] `004_widget_tier_enforcement.sql` applied
- [ ] Column-level revoke on `profiles.is_pro` et al
- [ ] `polar_webhook_events` dedup table
- [ ] `polar-welcome-email` Edge Function
- [ ] `polar-renewal-reminder` Edge Function
- [ ] Email-verification gate on widget INSERT
- [ ] Disposable-email blocklist

### Code (client)
- [ ] Upgrade modal handles server-403 gracefully
- [ ] Footer has `Cancel subscription` link
- [ ] `/settings → Subscription` copy polished ("Cancel or manage")
- [ ] Plausible added

### Legal pages
- [ ] `/terms` updated (MoR, auto-renewal, withdrawal, ODR, downgrade)
- [ ] `/privacy` updated (Polar, DPF, IMY, retention)
- [ ] `/refund` published
- [ ] `/legal` (imprint) published
- [ ] Footer links all four + Cancel

### Planners (one-time) — path B (Etsy for launch)
- [ ] Every template has `etsyUrl` deep-link (no shop-root fallback)
- [ ] All Etsy buttons use `<a rel="noopener noreferrer" target="_blank">` (no `window.open`)
- [ ] Disclosure line "Purchase is processed by Etsy — their terms apply" on product page + mobile buy bar
- [ ] Local cart + `/checkout` removed (or behind feature flag) to stop UX lie
- [ ] `/license` page published; linked from each product page's FAQ
- [ ] Etsy shop has the same Terms / Refund / License wording as Peachy — no conflicts

### Marketplace redirects (all outbound buy links)
- [ ] Centralised `MarketplaceLink` component used everywhere (no ad-hoc `window.open`)
- [ ] Each marketplace has its own disclosure copy in a constants file
- [ ] Outbound clicks tracked as `outbound.click` event with `{marketplace, template_id}` payload
- [ ] ODR link present in footer regardless of where sales go

### Launch-day smoke test
- [ ] Signup → verify email → create 3 widgets → try to create 4th → upgrade modal opens
- [ ] Upgrade → Polar checkout → pay with real card (small test) → return to `/settings` → `is_pro=true`
- [ ] Welcome email arrives
- [ ] Create 4th widget → succeeds
- [ ] Cancel subscription via Polar portal → receive cancel email → access persists until `current_period_end`
- [ ] Period ends → tier drops → 4th widget stays, new widgets blocked at 3 again
- [ ] Open a template page → "Buy on Etsy" deep-links to the exact product on etsy.com (new tab) with disclosure visible
- [ ] Local `/checkout` page is gone or clearly labelled "coming soon"

---

## 10. Planners (one-time digital downloads) — launch

### 10.1 Two viable paths

| Path | MoR | What we sell | Delivery | Refund owner |
|---|---|---|---|---|
| **A — Sell on Peachy via Polar** | Polar (same as subscription) | One-time product per template (~$9–$19) | Supabase-signed download URL emailed on `order.paid` | Us (bound by Polar's 60-day discretion) |
| **B — Redirect to Etsy / Gumroad** | Marketplace | Nothing on our side — we're a shop-front | Marketplace handles (Etsy .zip, Gumroad link) | Marketplace (Etsy 14-day for digital with "immediate delivery" disclosure, Gumroad seller-defined) |
| **C — Per-template hybrid** | Both | Sell 2–3 flagship templates on Peachy; long tail stays on Etsy | Mixed per template | Mixed — must clearly label each template |
| **D — Dual per-product (buyer picks)** | Both — buyer's choice | Every template available on *both* Peachy (Polar) and Etsy | Depends on which button buyer clicks | Depends on which path buyer took — **must be unmistakable at the click** |

**Recommendation:**

- **For launch (Polar one-time not built yet):** **B** — hide the local cart,
  every template goes only to Etsy. Fast, compliant, zero new code.
- **End state (after Polar one-time lands, §10.4):** **D — dual per-product**.
  Both buttons on every card. Buyer chooses based on their preference:
  - They have an Etsy account / trust Etsy reviews → Etsy.
  - They want an instant download without creating an Etsy account → Peachy.
  - They want to support the creator directly (we keep ~100% vs ~85%) → Peachy.

Reasons for going to **D** rather than **C**:
- **Don't force a funnel.** Some buyers actively prefer Etsy (account, reviews,
  familiar refund process). Losing them to hide the Peachy button costs sales.
- **Some buyers actively distrust new checkouts.** Forcing them onto Polar
  costs sales. Letting them pick Etsy keeps the conversion.
- **We learn real preferences** once both are live — if 90% pick Peachy on a
  given template, we know direct is winning; if Etsy keeps winning, we've
  still captured the sale.
- **Marginal implementation cost.** Once path A is built for *any* template,
  adding both buttons per template is ~1 extra line in `templates.ts`
  (`polarProductId?: string` alongside `etsyUrl?: string`) and a conditional
  render of two buttons instead of one.

Reasons to not do D at launch:
- Path A code doesn't exist yet (§10.4 is still on the backlog).
- Having two buttons while only one works is the exact UX bug we're fixing
  in §10.2.

**Net:** launch with B (Etsy only, local cart hidden). Once path A ships, flip
to D (both buttons on every template) — that's the long-term shape.

### 10.2 Current UX is broken (must fix before any real traffic)

`TemplateDetailPage.tsx` today renders two mutually contradictory CTAs:

- **"Add to Cart"** (outline button) → local `CartContext`, no checkout path
  exists. `/checkout` renders a form but nothing processes it.
- **"Buy on Etsy"** (primary button) → opens Etsy shop root (not the product
  page), no disclosure, no `rel="noopener noreferrer"`.

This is unshippable. Users will click Add to Cart, proceed to `/checkout`, fill
in card info (!) and nothing will happen. Pick one path per template and hide
the other.

**Proposed decisions (need sign-off):**

- [ ] **Kill `/checkout` and `CartContext`** for templates until path A ships.
      Replace "Add to Cart" with "Preview" or remove entirely.
- [ ] **Fix Etsy links to deep-link to product pages** (each template gets an
      explicit `etsyUrl: string` in `templates.ts`). No shop-root links.
- [ ] **Add `rel="noopener noreferrer"`** to all `window.open('...', '_blank')`
      and switch to real `<a target="_blank">` for a11y + right-click support.

### 10.3 Legal deltas vs subscription

One-time digital downloads differ from subscriptions in four load-bearing ways:

| Topic | Subscription | One-time download |
|---|---|---|
| Auto-renewal disclosure | Required (§5.1) | N/A |
| Cancellation button (German FCCA) | Required in footer | **Not applicable** — no ongoing contract |
| 14-day withdrawal waiver (CRD Art. 16(m)) | "Immediate performance" checkbox | **"Immediate download" checkbox — clearer** — the classic example in the directive |
| Post-purchase obligations | Conformity for duration of sub + 2-yr DCD | **2-year conformity (DCD 2019/770)** — template must match description for 2 years |
| Commercial license | Bundled in ToS | **Needs explicit license text** — can they resell? redistribute? use in client work? Today's FAQ says "commercial use allowed" but that's not a license. |
| Refund window | Recurring — "cancel to stop future charges" | **One-time — refund is the only remedy** if unhappy |

### 10.4 If we go path A (sell on Peachy via Polar) — engineering sketch

- New Polar products: one per template, `type: one_time`, price in USD.
- New Edge Function `polar-checkout-template` (or parameterise the existing
  `polar-checkout` on product type): builds a Polar checkout session with
  `product_id` (one-time) instead of `product_price_id` (subscription).
- Extend `polar-webhook` handlers:
  - `order.created` → ignore (payment pending).
  - `order.paid` → insert row into new `purchases` table
    (`user_id`, `template_id`, `polar_order_id`, `paid_at`, `amount_cents`,
    `download_url_expires_at`), enqueue delivery email.
  - `order.refunded` → soft-delete the purchase, revoke download.
- New `purchases` table + RLS (read-own). Identical security posture to
  `profiles`: service-role writes, authenticated read-own.
- New Edge Function `template-download` — signed URL generator: checks
  `purchases` row for `(auth.uid(), template_id)`, returns a short-lived
  Supabase Storage signed URL (5-minute TTL is standard).
- Storage: upload `.zip` per template to Supabase Storage **private** bucket.
  Never link the raw object URL — always go through the signed-URL Edge.

### 10.5 Commercial license (required regardless of path)

Today's FAQ promise is a legal commitment we haven't formalised. Add a
**License Terms** page (`/license`) covering:

- [ ] **Permitted:** personal use, use inside client deliverables, duplicating
      and customising the template in your own Notion workspace.
- [ ] **Prohibited:** reselling the template as-is, redistributing it as a
      free download, sublicensing, reverse-engineering the underlying Notion
      formulas.
- [ ] **Updates:** "lifetime updates" = updates to the template itself;
      **not** a guarantee that Notion will keep every feature working forever.
- [ ] **Refund:** see Refund policy §3.3.
- [ ] **Liability cap:** purchase price.

Link from FAQ ("Can I use it commercially?"), checkout, and product page.

### 10.6 Checkout copy (if we go path A)

Pay button wording from §5.1 also binds here — **"Buy now · $14.99"** is
compliant. Banned: "Continue", "Submit", "Download" (ambiguous about payment).

Pre-contract info required under CRD Art. 8(2):

- Product description + preview images.
- Total including VAT.
- Download method: "You'll receive an email with your download link within
  1 minute of payment."
- Refund policy link.
- **Withdrawal waiver:** "☐ I understand that I'm buying a digital download
  that's delivered immediately. I agree to start the download now and
  acknowledge I lose the 14-day right of withdrawal." (Unchecked by default.)

### 10.7 Phased plan

- **Planner P0 (immediate, required for launch):** fix §10.2 — for launch
  only the Etsy button is visible. Deep-link to each Etsy product page,
  `rel="noopener noreferrer"`, disclosure copy (§11.3). Hide the local cart
  and `/checkout` behind a feature flag (not deleted — we bring them back
  in P2).
- **Planner P1:** `/license` page; link from FAQ + product pages. Same
  license text applies whether the buyer came via Peachy or Etsy, so this
  can land with P0.
- **Planner P2 (end state — Path D, after subscription launch):** build
  path A infra (Polar one-time checkout, `purchases` table, download
  delivery Edge Function, Supabase Storage private bucket). When ready,
  add `polarProductId?: string` next to `etsyUrl?: string` in `templates.ts`
  — any template with both fields renders **both buttons** (Buy on Peachy
  + Buy on Etsy). Each button carries its own disclosure and refund-policy
  link. Users pick the path they prefer. This is the permanent shape, not
  a migration away from Etsy — Etsy stays as an always-available second
  option.
- **Planner P3 (optional, data-driven):** once we have 1–2 months of
  click/conversion data by path, decide per-template whether the Peachy
  button goes first or Etsy goes first. No more structural change — just
  reordering two buttons.

---

## 11. External marketplace redirects (Etsy today; others later)

### 11.1 What a redirect actually is, legally

When a user clicks "Buy on Etsy" and completes the purchase on etsy.com:

- **Etsy is the Merchant of Record** for that sale. They issue the invoice,
  collect VAT, accept the card, handle chargebacks.
- We are the **seller** inside Etsy's platform (we run the shop). Etsy's
  **seller policy** governs our obligations to the buyer.
- On Peachy, we are **merely advertising** the product and linking out. The
  E-Commerce Directive Art. 5 disclosures for Peachy still apply (imprint,
  privacy, contact) — but no subscription / refund obligations attach to
  these redirect sales on Peachy's side.

### 11.2 What we must disclose before / at the click

Not legally mandatory in Sweden for a plain outbound link, but strongly
recommended (and required once we add affiliate links for templates we don't
author — see §11.6):

- [ ] A one-line label above or next to the button:
      **"Purchase is processed by Etsy — their terms and privacy policy
      apply."**
- [ ] Same for Gumroad, Creative Market, Notion Gallery, etc. Centralise the
      copy as `MARKETPLACE_DISCLOSURE[marketplace]` in a constants file so
      all surfaces stay consistent.
- [ ] For a11y + security: `<a href="{url}" target="_blank" rel="noopener noreferrer">`
      — never `window.open` from an `onClick`. Opens in new tab so we don't
      lose our own session; `noopener` prevents reverse-tabnabbing; `noreferrer`
      means Etsy doesn't see the Peachy page a user came from (also hides
      UTMs — if we want attribution, use signed outbound URLs instead; see
      §11.6).

### 11.3 Privacy of data collected pre-redirect

If we collect anything from the user **before** redirecting to the
marketplace (email, cart contents), we become data controllers for that data
even if the sale happens elsewhere. Today the local cart holds only
`{id, title, price, image}` from `templates.ts` — no user PII — so this is
fine. If we ever add email capture before the redirect, update Privacy Policy
to disclose it. **Do not pass user email to Etsy via URL parameters** — Etsy
doesn't expect it, and prefilling foreign parameters into their checkout can
violate Etsy seller policy.

### 11.4 Terms / ODR implications

- EU ODR platform link **still required on Peachy pages** even if all sales go
  to Etsy, because we are a commercial website in the EU. Put it in footer.
- **Do not** link our Refund Policy next to the Etsy button — that policy is
  for direct purchases. Instead, show "Etsy's refund policy applies — view at
  etsy.com/help".

### 11.5 Fix list for current Etsy buttons

Touching `TemplateDetailPage.tsx`:

- [ ] Replace `window.open('https://www.etsy.com/shop/PeachyStudio', '_blank')`
      with `<a href={template.etsyUrl} target="_blank" rel="noopener noreferrer">`
      styled as the button (both desktop `ActionBtn` and mobile `MobileBuyBtn`).
- [ ] Add `etsyUrl: string` field to `Template` in `templates.ts`; fill in per
      template with the deep-link (not shop root).
- [ ] Add disclosure sentence under the buy button:
      *"Purchase is processed by Etsy — their terms and refund policy apply."*
- [ ] Style disclosure as small secondary text, not flash (compliance, not
      alarm).

### 11.6 Future: affiliate links to other creators

If we ever feature templates we don't author (affiliate model), FTC + EU
disclosure rules kick in:

- [ ] **"Sponsored" or "Affiliate" label on the listing itself** — not just
      the tooltip. US FTC Endorsement Guides + EU Unfair Commercial Practices
      Directive.
- [ ] Track clicks server-side (our `polar-track-outbound` Edge Function or
      Plausible custom event) so we have authoritative numbers independent of
      the marketplace's reporting.
- [ ] If marketplace supports affiliate IDs in URL (Gumroad `?a=…`, Amazon
      `tag=`), store affiliate ID per marketplace in env, append at click
      time via a thin redirect URL like `/out/{marketplace}/{template_id}`.
      Benefits: centralised disclosure page, consistent analytics, ability
      to swap affiliate IDs without redeploy.

### 11.7 Gumroad / Creative Market / Notion Gallery notes

- **Gumroad** — US-based MoR, handles VAT on EU digital sales, gives us an
  affiliate program (10–50% creator-defined). Good secondary channel.
- **Creative Market** — similar but charges a 40% flat fee; less useful.
- **Notion Gallery** — free directory listing, links out to our shop or Etsy;
  does not process sales. Worth submitting once 1–2 flagships are polished.
- **Product Hunt / Reddit r/Notion** — not storefronts; discovery only.

Track each as a separate outbound source in analytics from day 1.

### 11.8 Phased plan

- **Redirect P0:** fix §11.5 (deep links, `rel`, disclosure copy).
- **Redirect P1:** unify all outbound marketplace clicks through a constants
  file + typed helper `<MarketplaceLink marketplace="etsy" url={…} />` that
  renders the disclosure + styled `<a>`.
- **Redirect P2:** add `/out/{marketplace}/{template_id}` redirect route for
  click analytics + future affiliate-ID injection. 10 lines of React Router +
  Plausible event.

---

## 12. Out of scope for this launch (explicit)

Things we'll track but not build pre-launch:
- Annual pricing, team plans, promo codes.
- Multi-currency beyond what Polar shows by default.
- A proper customer portal embedded (we use Polar's hosted).
- Full reconciliation cron — manual check for first month.
- Custom analytics dashboard — Plausible default is enough.
- DPA auto-sign flow (offer on email request).
- In-app upgrade suggestions beyond Upgrade button + 3-widget cap.
- SLAs / uptime guarantees.
- Free trial (we use freemium 3-widget tier instead).
- Refund automation (manual through email for goodwill refunds).

---

## 13. Sources (cited in research)

### Polar
- [Polar — Merchant of Record](https://polar.sh/docs/merchant-of-record/introduction)
- [Polar — Acceptable Use](https://polar.sh/docs/merchant-of-record/acceptable-use)
- [Polar — Webhook Events](https://polar.sh/docs/integrate/webhooks/events)
- [Polar — Customer Portal](https://polar.sh/docs/features/customer-portal)
- [Polar — Terms of Service (PDF)](https://polarsource.github.io/legal/terms.pdf)

### EU legal
- [EU Consumer Rights Directive (CRD) summary](https://eur-lex.europa.eu/EN/legal-content/summary/consumer-information-right-of-withdrawal-and-other-consumer-rights.html)
- [EU Digital Content Directive 2019/770](https://eur-lex.europa.eu/eli/dir/2019/770/oj/eng)
- [e-Commerce Directive 2000/31/EC (Art. 5 disclosures)](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=celex:32000L0031)
- [EU Directive 2023/2673 — Cancel Contract button](https://www.jdsupra.com/legalnews/new-eu-rule-requires-easy-cancel-4333652/)
- [CJEU Fuhrmann-2 / Conny (pay-button wording)](https://www.insideprivacy.com/consumer-protection/cjeu-clarifies-online-order-buttons-must-indicate-that-the-consumer-is-assuming-an-obligation-to-pay/)
- [SCC 2021/914](https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/standard-contractual-clauses-scc_en)

### Germany
- [Fair Consumer Contracts Act (Kündigungsbutton)](https://gameslaw.org/a-new-termination-button-and-other-rules-for-germany-under-the-fair-consumer-contracts-act/)

### California / US
- [California AB-390 / ARL](https://www.dglaw.com/californias-amended-automatic-renewal-law-takes-effect-july-1-2022-what-subscription-based-companies-need-to-know/)
- [FTC Click-to-Cancel — vacated July 2025 but good practice](https://www.hklaw.com/en/insights/publications/2025/09/ftc-steps-up-subscription-enforcement-after-click-to-cancel-rule)

### Sweden specific
- [Swedish E-commerce Act overview](https://portal.postnord.com/info/en/delivery-guide/ecommerce/ecommerce-act/)
- [Skatteverket — F-tax approval](https://www.skatteverket.se/servicelankar/otherlanguages/englishengelska/businessesandemployers/startingandrunningaswedishbusiness/registeringabusiness/approvalforftax.4.676f4884175c97df4192308.html)
- [Bolagsverket — Sole trader](https://bolagsverket.se/en/foretag/enskildnaringsverksamhet/startaenskildnaringsverksamhet.821.html)
- [IMY — Swedish DPA](https://www.imy.se)

### Technical / Supabase
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase Column-Level Security](https://supabase.com/docs/guides/database/postgres/column-level-security)
- [Stripe webhook idempotency (applies to Polar too)](https://docs.stripe.com/api/idempotent_requests)

### Industry patterns
- [Airtable — Downgrade behaviour](https://support.airtable.com/docs/changing-your-airtable-workspace-plan)
- [Notion — Downgrade behaviour](https://www.notion.com/help/plan-downgrade)
- [disposable-email-domains GitHub list](https://github.com/disposable-email-domains/disposable-email-domains)

### Templates
- [Termly](https://termly.io/)
- [GDPR.eu templates](https://gdpr.eu/privacy-notice/)

---

## 14. Decision log (update as we discuss)

| # | Decision | Status | Notes |
|---|---|---|---|
| D1 | Free-tier limit: 3 widgets | Agreed | existing behaviour |
| D2 | Pro price: $4/month | Agreed | existing Polar product |
| D3 | Enforce widget count server-side | **Proposed** | §4.2 — needs confirmation before phase 1 |
| D4 | Pro-style gating server-side | **Proposed** | §4.3 |
| D5 | Email verification as widget-create gate | **Proposed** | §4.6 — mild friction but kills abuse |
| D6 | Downgrade: grandfather everything, block new creates | **Proposed** | §4.5 |
| D7 | Business registration: A/B/C? | **Open** | §6 |
| D8 | Launch cookie-less analytics (Plausible) | **Proposed** | §7 |
| D9 | Welcome + renewal reminder emails | **Proposed** | §5.4, §5.5 — Resend costs ~$20/mo |
| D10 | Skip free trial, keep freemium instead | Agreed | §12 |
| D11 | Planners end state = Path D (both Peachy + Etsy buttons on every template); launch as Path B (Etsy-only) while Polar one-time is built | **Proposed** | §10.1, §10.7 — confirmed by owner Apr 18 |
| D12 | Hide local `/checkout` + cart behind feature flag for launch, reactivate with Path D | **Proposed** | §10.2, §10.7 |
| D13 | Deep-link each template to its Etsy product page (new `etsyUrl` field) | **Proposed** | §10.2, §11.5 |
| D14 | Add `/license` page and link from FAQ + product pages | **Proposed** | §10.5 |
| D15 | Marketplace disclosure line under every outbound buy button | **Proposed** | §11.2 |
| D16 | Keep one abstraction layer between app ↔ Supabase and app ↔ Polar so we can swap vendors later | **Proposed** | see ROADMAP "vendor-portable architecture" |
| D17 | For planner sales beyond MVP, build path A (Polar one-time) before Gumroad | **Proposed** | §10.7 Planner P2 |
| D18 | Reconcile the 45–55% price gap between site and Etsy before direct-to-Peachy sales | **Open** | `docs/TEMPLATES-ETSY-SYNC.md` §3.1 — uncovered Apr 18 CSV diff. Either raise site prices to match, or position Peachy as undercut channel |

---

**Next step:** review this doc. For each **Proposed** or **Open** decision in §14, mark
accept / reject / modify. Then I'll split Phase 1 into concrete tasks and start.
