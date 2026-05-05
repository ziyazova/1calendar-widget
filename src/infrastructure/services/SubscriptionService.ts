import { supabase } from './supabase';
import { Logger } from './Logger';

export interface Plan {
  isPro: boolean;
  status: string | null;                 // 'active' | 'trialing' | 'canceled' | 'past_due' | 'incomplete' | null
  currentPeriodEnd: string | null;       // ISO timestamp
  polarCustomerId: string | null;
  polarSubscriptionId: string | null;
}

const DEFAULT_PLAN: Plan = {
  isPro: false,
  status: null,
  currentPeriodEnd: null,
  polarCustomerId: null,
  polarSubscriptionId: null,
};

/* Owner-allowlist — emails that always read as Pro regardless of the
 * profiles.is_pro column. Used so the shop owner can build / preview
 * widgets for her own catalogue without taking out a subscription on
 * herself. Lives client-side and is visible in the JS bundle, which
 * is fine because:
 *   1. The Pro gates this unlocks (settings page, widget cap, paid
 *      styles) are UX features, not security boundaries.
 *   2. Server-side limits (RLS, Polar webhook) still apply.
 *   3. The list is short and only contains owner-controlled emails.
 *
 * Add a new email here when onboarding another team member; remove
 * when they leave. */
const OWNER_EMAILS = new Set<string>([
  'ziyazovaa@gmail.com',
]);

const OWNER_PLAN: Plan = {
  isPro: true,
  status: 'active',
  currentPeriodEnd: null,
  polarCustomerId: null,
  polarSubscriptionId: null,
};

export const SubscriptionService = {
  /**
   * Reads the current user's plan row from `public.profiles`. Returns the
   * default (free) plan if the row does not exist yet — the auth trigger
   * should create one on sign-up, so this is a safety net.
   */
  async getPlan(): Promise<Plan> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return DEFAULT_PLAN;

    /* Owner shortcut — bypass the profiles lookup entirely so the
     * shop owner is always Pro on every device, regardless of what
     * the DB row says. Email comparison is lower-case to be safe. */
    if (user.email && OWNER_EMAILS.has(user.email.toLowerCase())) {
      return OWNER_PLAN;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('is_pro, subscription_status, current_period_end, polar_customer_id, polar_subscription_id')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      Logger.error('Subscription', 'Failed to fetch plan', error);
      return DEFAULT_PLAN;
    }
    if (!data) return DEFAULT_PLAN;

    return {
      isPro: Boolean(data.is_pro),
      status: data.subscription_status ?? null,
      currentPeriodEnd: data.current_period_end ?? null,
      polarCustomerId: data.polar_customer_id ?? null,
      polarSubscriptionId: data.polar_subscription_id ?? null,
    };
  },

  /**
   * Asks the `polar-checkout` Edge Function for a hosted checkout URL and
   * redirects the browser. Throws a human-readable error on failure.
   *
   * Pass `etsyId` (the numeric Etsy listing id) to buy a specific
   * template — the Edge Function resolves it to a Polar product UUID by
   * matching against product names (`{etsyId} {title}` convention).
   * When omitted, defaults to the Pro subscription product server-side.
   * `successPath` lets callers override the post-checkout landing page.
   */
  async startCheckout(opts?: { etsyId?: string; successPath?: string }): Promise<void> {
    const { data, error } = await supabase.functions.invoke<{ url?: string; error?: string }>(
      'polar-checkout',
      { body: opts ?? {} },
    );
    if (error) {
      Logger.error('Subscription', 'Checkout invoke failed', error);
      throw new Error('Could not start checkout. Please try again.');
    }
    if (!data?.url) {
      Logger.error('Subscription', 'Checkout returned no URL', data);
      throw new Error(data?.error ?? 'Checkout did not return a URL.');
    }
    window.location.href = data.url;
  },

  /**
   * Opens Polar's customer portal in a new tab. This is the real
   * cancel/manage entry point (German FCCA Kündigungsbutton target) — the
   * Edge Function mints a signed portal URL tied to the user's own
   * subscription, rather than dropping them on the Polar marketing site.
   *
   * Returns false when the user has no Polar customer record yet (they've
   * never completed a checkout). Callers can use that to nudge them to
   * upgrade instead.
   */
  async openCustomerPortal(): Promise<boolean> {
    const { data, error } = await supabase.functions.invoke<{ url?: string; error?: string }>(
      'polar-customer-portal',
      { body: {} },
    );
    if (error) {
      Logger.error('Subscription', 'Portal invoke failed', error);
      return false;
    }
    if (!data?.url) {
      Logger.error('Subscription', 'Portal returned no URL', data);
      return false;
    }
    window.open(data.url, '_blank', 'noopener,noreferrer');
    return true;
  },
};
