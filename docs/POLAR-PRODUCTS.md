# Polar product integration

> Updated 2026-05-05 — migrated from hardcoded `polarProductId` UUIDs in code
> to runtime resolution via Etsy listing id. See **Architecture** below.

## Architecture

**Single source of truth: the Etsy listing id.** Each template in
`src/presentation/data/templates.ts` carries only an `etsyUrl`
(e.g. `https://www.etsy.com/listing/1736107034`). The numeric id is
parsed out via `getTemplateEtsyId()` and used everywhere downstream.

Polar's internal UUIDs (`ce9b8c81-...`) **do not appear in the code**. They
live only in Polar's dashboard. The `polar-checkout` Edge Function resolves
Etsy id → Polar UUID at request time by listing all Polar products and
matching the one whose name starts with `{etsyId} `.

```
   templates.ts                  polar-checkout                    Polar
   ────────────                  ──────────────                    ─────
   etsyUrl: ".../1736107034"  →  GET /v1/products/?limit=100   →   33 items
                                 find(name startsWith "1736107034 ")
                                 → product.id (UUID)
                                 POST /v1/checkouts/ { products: [UUID] }
                                                                   ↓
                                  successful payment              Polar webhook
                                                                   ↓
                                  recordOrder() in polar-webhook   purchases table
```

### Why this design

- One mental model: you think in Etsy ids (Etsy listing + Polar product
  name + URL slug all share the same number).
- Polar UUIDs can change (recreate product → new UUID) without any code
  edit. As long as the Polar product name still starts with the Etsy id,
  the site keeps working.
- No periodic sync script, no manual UUID copy-paste, no out-of-date
  mapping table to maintain.

### The naming convention is load-bearing

Every Polar product **must** be named `{etsyId} {anything}` — for example
`1736107034 Notion Life Planner`. If you remove the leading Etsy id from
a product name, Buy Now for that template will fail with
`product_not_found_for_etsy_id`.

## Files

| File | Role |
|---|---|
| `src/presentation/data/templates.ts` | Template catalogue. `etsyUrl` is the join key. Exports `getEtsyIdFromUrl()` + `getTemplateEtsyId()` helpers. |
| `src/presentation/pages/TemplateDetailPage.tsx` | Buy Now button passes `etsyId` to the Edge Function. |
| `src/infrastructure/services/SubscriptionService.ts` | `startCheckout({ etsyId })` — no etsyId means subscription. |
| `supabase/functions/polar-checkout/index.ts` | Resolves `etsyId` → Polar UUID, opens hosted checkout. Subscription path uses `POLAR_PRO_PRICE_ID` env var. |
| `supabase/functions/polar-webhook/index.ts` | Handles `subscription.*` (writes `profiles`) **and** `order.*` (writes `purchases`). |
| `src/infrastructure/services/PurchaseService.ts` | Reads `purchases` table. |
| `src/presentation/components/dashboard/PurchaseList.tsx` | Matches purchase → template by extracting leading number from `product_name`. |
| `supabase/migrations/006_purchases.sql` | DB schema for one-time purchases. |
| `supabase/functions/polar-list-products/index.ts` | Helper Edge Function — dumps all Polar products. Use for debugging or audits. |

## End-to-end flow

1. User opens `/templates/{etsyId}` and clicks **Buy Now**.
2. `TemplateDetailPage.handleBuyNow` calls
   `SubscriptionService.startCheckout({ etsyId, successPath: '/studio?purchased={etsyId}' })`.
3. Edge Function `polar-checkout` lists Polar products, finds the one
   matching `etsyId`, creates a hosted checkout for its UUID.
4. User completes payment on Polar.
5. Polar redirects browser to `successPath`.
6. Polar fires `order.paid` webhook → `polar-webhook` writes a row to
   `purchases` (with `polar_product_id` UUID, `product_name`, etsy id in
   metadata, etc).
7. Dashboard's Purchases tab loads via `PurchaseService.getMyPurchases()`,
   `PurchaseList` parses Etsy id from `product_name`, joins to local
   `TEMPLATES` for image + title.

## Adding a new template

1. **In Polar dashboard** ([products](https://polar.sh/dashboard/aliia-ziiazova/products)):
   - Either create a new product named `{etsyId} {whatever}`, or pick an
     existing one with the right Etsy id in its name.
   - The product's UUID doesn't matter to the codebase — the Etsy id in
     the name is the join key.
2. **In `src/presentation/data/templates.ts`**, add a new entry to
   `TEMPLATES` with at minimum:
   ```ts
   {
     id: '<etsyId>',                                       // page slug
     title: '...',
     etsyUrl: 'https://www.etsy.com/listing/<etsyId>',     // join key
     // ...standard fields: description, price, image, etc.
   }
   ```
3. Commit, push, deploy. **No Polar-side change** needed beyond ensuring
   the product name starts with the Etsy id.

The Buy Now button picks up `etsyUrl` automatically and the resolver finds
the Polar product on the next click.

## Removing a template

Just delete the entry from `TEMPLATES`. The Polar product can stay or be
archived in Polar — neither side breaks.

## Editing prices

Prices in `templates.ts` (`price` / `priceNum`) are **hard-coded** and
must be kept in sync with the Polar product price manually. Do a price
reconciliation pass whenever you touch this doc — align the card price to
what Polar actually charges.

## Subscription (Peachy Pro) — separate flow

Subscription doesn't go through the Etsy id resolver. The Edge Function
falls back to `POLAR_PRO_PRICE_ID` (Supabase secret) when no `etsyId` is
in the request body. Upgrade button in `UpgradeModal` calls
`startCheckout()` with no args. See `docs/SUBSCRIPTION.md`.

## Webhook events to subscribe in Polar

In Polar dashboard → Settings → Webhooks → your endpoint
(`https://vyycfwgkawtqkjllvsuc.supabase.co/functions/v1/polar-webhook`),
events must include:

- `subscription.created` / `subscription.updated` / `subscription.canceled`
  / `subscription.revoked` — for Peachy Pro plan state.
- `order.created` / `order.updated` / `order.paid` — for one-time template
  purchases. Without these, payments succeed in Polar but no `purchases`
  row appears and Buyers see nothing in their dashboard.
- `order.refunded` — optional, `order.updated` already covers status
  flips.

## Debugging

**Buy Now fails with checkout error:**
1. Open Supabase Dashboard → Edge Functions → `polar-checkout` → **Logs**.
2. Look for the latest entry. Common errors:
   - `product_not_found_for_etsy_id` → the Polar product isn't named
     `{etsyId} ...`. Fix the name in Polar.
   - `polar_list_failed` → `POLAR_ACCESS_TOKEN` secret is missing or
     invalid. Reset in Supabase → Edge Functions → Secrets.
   - `polar_failed` → Polar rejected the checkout creation. The `detail`
     field has Polar's error message.

**Purchase doesn't appear in dashboard after payment:**
1. Check Polar Dashboard → Webhooks → your endpoint → **Logs**. If you
   see a 401 → secret mismatch (`POLAR_WEBHOOK_SECRET` in Supabase ≠
   what Polar shows in webhook settings).
2. If 200 — open Supabase → Edge Functions → `polar-webhook` → Logs.
   Look for `order missing email` or `no supabase_user_id in metadata`.
3. Check the `purchases` table directly in SQL Editor:
   `select * from purchases order by created_at desc limit 10`.

**Dashboard shows generic placeholder image instead of template card:**
- The `product_name` in the purchase row doesn't start with a numeric
  Etsy id, OR the Etsy id doesn't match any template's `etsyUrl`.
- Run the dump endpoint to see Polar product names:
  `https://vyycfwgkawtqkjllvsuc.supabase.co/functions/v1/polar-list-products`

## Deployment

Edge Function changes only take effect after deploy:

```bash
npx -y supabase@latest functions deploy polar-checkout --project-ref vyycfwgkawtqkjllvsuc
npx -y supabase@latest functions deploy polar-webhook --project-ref vyycfwgkawtqkjllvsuc --no-verify-jwt
```

`--no-verify-jwt` is **mandatory** for the webhook — Polar signs requests
with its own HMAC, not a Supabase JWT.

## Required Supabase secrets

| Name | Source |
|---|---|
| `POLAR_ACCESS_TOKEN` | Polar Dashboard → Settings → API Tokens → Create token |
| `POLAR_WEBHOOK_SECRET` | Polar Dashboard → Settings → Webhooks → your endpoint → Signing secret (`polar_whs_...`) |
| `POLAR_PRO_PRICE_ID` | Polar UUID of the Peachy Pro subscription product |
| `APP_BASE_URL` | `https://1calendar-widget-aliias-projects-37358320.vercel.app` |
| `POLAR_API_URL` | Optional — defaults to `https://api.polar.sh`. Set to `https://sandbox-api.polar.sh` for sandbox testing. |
