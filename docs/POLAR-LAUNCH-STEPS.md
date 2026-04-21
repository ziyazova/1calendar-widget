# Polar launch — things only you can do (manual steps)

Checklist for the owner to flip digital-good sales from "code is ready" to
"money in the bank". Code is deployed; these are the Polar / Supabase
dashboard clicks + legal copy decisions that only a human with the right
credentials can do.

> Order matters — the steps below are in the order you should do them.
> Skipping one may cause a purchase to succeed without the buyer getting
> their file, or fail on the first checkout attempt.

---

## 1. Apply the `purchases` table migration

**Where:** Supabase Dashboard → SQL Editor → New query
**What:** paste the contents of `supabase/migrations/006_purchases.sql`
and run.

**Verify:** Table editor → confirm `purchases` exists with columns
`user_id`, `email`, `polar_order_id`, `polar_product_id`, `status`, etc.
Function `link_purchases_to_user(uuid, text)` should also exist under
Database → Functions.

**Without this:** webhook crashes when writing an order and returns 500
to Polar; buyer sees Polar-hosted checkout succeed but nothing on your
side.

---

## 2. Redeploy the two edge functions

Both files were changed in code — the dashboard copies are still on the
old versions.

### 2a. `polar-checkout`

**Where:** Supabase → Edge Functions → `polar-checkout` → Edit
**What:** clear the editor, paste the contents of
`supabase/functions/polar-checkout/index.ts` from the repo, **Deploy**.

Key new behavior: accepts `productId` in the request body, allows guest
(unauthenticated) checkout for template products, reads `POLAR_API_URL`
env var for sandbox toggling.

### 2b. `polar-webhook`

**Where:** Supabase → Edge Functions → `polar-webhook` → Edit
**What:** clear the editor, paste the contents of
`supabase/functions/polar-webhook/index.ts` from the repo, **Deploy**.

Key new behavior: handles `order.created` / `order.updated` / `order.paid`
events and writes a `purchases` row.

**Verify:** after deploy, open Details tab of each function — deployment
timestamp should be within the last minute.

---

## 3. Add `order.*` event subscriptions in Polar

**Where:** polar.sh → Settings → Webhooks → your webhook → Events
**What:** tick the following boxes (in addition to the existing
`subscription.*` ones):

- `order.created`
- `order.updated`
- `order.paid`

**Save.**

**Without this:** the webhook endpoint is wired up correctly but Polar
won't deliver one-time-purchase events to it. Buyer pays, nothing lands
in our `purchases` table.

---

## 4. Attach the PDF file to each of the 13 Polar products

**Where:** polar.sh → Products → each product → **Benefits** → **+ Add
Benefit** → **File Downloads**

Upload the PDF that corresponds to that product. Polar generates a
signed download URL and emails it to the buyer automatically on every
successful order.

**The 13 products** (copy ids from `docs/POLAR-PRODUCTS.md`):

- Ultimate Life Planner → `ce9b8c81-b345-40a2-bf2b-88d98206a4c1`
- Ultimate Wellness Planner → `7bdfe90a-5182-42b7-83da-8580d13660a8`
- Academic Planner Dark → `c7ed28ea-f289-4d9b-995c-1b3d5d963c12`
- Green Life Planner → `b93535e2-b518-4bb1-b18e-d166b867c2a3`
- Student Planner Light → `c7ed28ea-f289-4d9b-995c-1b3d5d963c12`
  (shares product id with Academic Planner Dark — split in Polar if you
  want separate files)
- Mystic Life Planner → `52d1dbea-bc2a-4c91-bf75-abc50b34dead`
- Light Academia Planner → `73771fd2-284e-499d-9fc5-e1219ab861c4`
- Glow Up Planner → `48899592-5480-452c-931f-1f070cfcf8eb`
- Olive Life Planner → `23df2ca8-7b26-49d7-8173-22d7d9d44b27`
- Cherub Planner → `410c035a-e013-4a0e-9ff6-8e60df1d7c64`
- Minimalist Green Planner → `83f84551-d312-4e81-ad41-ca42663d5424`
- Dark Academia Student → `9c94c452-3bf2-42f3-ba68-15e7f96021d6`
- University Planner → `f6d16580-63f9-4d2d-9081-a4dc76252384`

**Without this:** Polar checkout succeeds, we record the purchase, but
the confirmation email has no download link — buyer writes to support.

---

## 5. Turn on the EU withdrawal-right waiver checkbox

**Where:** polar.sh → Settings → Organization / Checkout preferences
(exact path changes between Polar versions — look for "digital goods" /
"withdrawal right" / "CRD waiver")
**What:** enable the checkout-time checkbox "I agree delivery begins
immediately and I waive my 14-day cancellation right."

**Why:** EU Consumer Rights Directive Art. 16(m). Without the waiver,
an EU buyer can legally demand a full refund up to 14 days after
download. With the waiver ticked, they can't.

---

## 6. Write real copy for the Refund page

**Where:** `src/presentation/pages/RefundPage.tsx` (needs a code change,
but the decision is yours — pasted here as a reminder)
**What:** replace the placeholder with real policy. Recommended minimum:

- "All sales are final for digital downloads, once the file has been
  delivered by email."
- "If the email you entered was wrong, contact
  `support@peachyplanner.com` within 30 days and we will re-send to the
  correct address at no cost."
- "If you have not received your file within 1 hour of purchase, check
  spam, then contact support — we will manually re-deliver or issue a
  refund."
- "Chargeback / duplicate-order cases are handled case-by-case."

**Without this:** the `/refund` page is a compliance gap under German
Fernabsatzgesetz and reads as unprofessional.

---

## 7. Set up support email / inbox

**Where:** wherever your domain is registered; add `support@peachyplanner.com`
as a forwarder to your personal inbox, or use Gmail aliases.

Referenced in:
- Success banner on `/studio?purchased=X` ("Contact support" link)
- (future) `/refund` page
- Polar email templates (optional — they default to Polar's own support)

---

## 8. (Optional, later) Set up a sandbox for safe testing

See `docs/ROADMAP.md` → *Polar sandbox environment for payment testing*
for the full recipe. Short version:

1. Sign up at `https://sandbox.polar.sh`.
2. Copy sandbox tokens / product ids / webhook secret.
3. Set in Supabase Edge Function secrets:
   - `POLAR_API_URL=https://sandbox-api.polar.sh`
   - `POLAR_ACCESS_TOKEN=<sandbox token>`
   - `POLAR_WEBHOOK_SECRET=<sandbox webhook secret>`
4. Redeploy edge functions.
5. Test with card `4242 4242 4242 4242`.

Flip back to prod by resetting the same env vars.

---

## Done? Smoke-test the flow

1. As a **guest** (incognito window), open a template page → Buy Now →
   Polar checkout → pay (sandbox card) → redirects to
   `/studio?purchased=<id>`.
2. Expect a green success banner with your email + "Create account" CTA.
3. Check your inbox — Polar email with download link should arrive within
   a minute.
4. Click "Create account", sign up with the **same** email. After login,
   open Dashboard → Purchases. The purchase should be there.
5. As a **signed-in** user, repeat Buy Now. Skip the signup step; go
   straight to Dashboard → Purchases.

If any step fails, check:
- Supabase → Edge Functions → `polar-webhook` → Logs for the latest
  event. 200 = fine; 401 = signature problem; 500 = code bug.
- Supabase → Table Editor → `purchases` — row should appear per order.
