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

export const SubscriptionService = {
  /**
   * Reads the current user's plan row from `public.profiles`. Returns the
   * default (free) plan if the row does not exist yet — the auth trigger
   * should create one on sign-up, so this is a safety net.
   */
  async getPlan(): Promise<Plan> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return DEFAULT_PLAN;

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
   */
  async startCheckout(): Promise<void> {
    const { data, error } = await supabase.functions.invoke<{ url?: string; error?: string }>(
      'polar-checkout',
      { body: {} },
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
};
