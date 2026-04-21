/**
 * Feature flags. Flip values here, nowhere else.
 *
 * When a flag is disabled for launch (e.g. local checkout until Polar one-time
 * is built), the code paths it gates stay in the tree — they're just not
 * rendered. See docs/SUBSCRIPTION-LAUNCH-PLAN.md §10.2 / D12 for the reasoning.
 */

export const FEATURES = {
  /**
   * Local "Add to Cart" → /checkout path for one-time template purchases.
   *
   * OFF for launch: checkout has no payment processor wired. Templates are
   * sold via Etsy redirect only (see `template.etsyUrl`).
   *
   * Flip to true once path A from the launch plan ships:
   * Polar one-time products + purchases table + download-delivery Edge Function.
   * At that point we restore cart/checkout and render BOTH buttons on every
   * template (Path D — buyer picks Peachy or Etsy).
   */
  ENABLE_LOCAL_CHECKOUT: true,
} as const;
