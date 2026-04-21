import { supabase } from './supabase';
import { Logger } from './Logger';

export interface Purchase {
  id: string;
  polarOrderId: string;
  polarProductId: string;
  productName: string | null;
  amountCents: number | null;
  currency: string;
  status: 'paid' | 'refunded';
  createdAt: string;
}

export const PurchaseService = {
  /**
   * Returns all purchases linked to the signed-in user. Guest purchases
   * (bought before the buyer had an account) are attached in AuthContext on
   * sign-in via `link_purchases_to_user`, so the same query covers both
   * pre- and post-signup orders.
   */
  async getMyPurchases(): Promise<Purchase[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('purchases')
      .select('id, polar_order_id, polar_product_id, product_name, amount_cents, currency, status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      Logger.error('Purchase', 'Failed to fetch purchases', error);
      return [];
    }

    return (data ?? []).map(row => ({
      id: row.id,
      polarOrderId: row.polar_order_id,
      polarProductId: row.polar_product_id,
      productName: row.product_name,
      amountCents: row.amount_cents,
      currency: row.currency ?? 'usd',
      status: (row.status === 'refunded' ? 'refunded' : 'paid'),
      createdAt: row.created_at,
    }));
  },
};
