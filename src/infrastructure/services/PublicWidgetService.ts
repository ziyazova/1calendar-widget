import { supabase } from './supabase';
import { Logger } from './Logger';

export interface PublicWidgetData {
  type: string;
  style: string;
  settings: Record<string, unknown>;
}

// Discriminated result so callers can tell apart:
//   ok        → live settings, render with these
//   not_found → owner deleted / paused → render <WidgetUnavailable/>
//   error     → network/server hiccup → keep the URL-encoded fallback
export type PublicWidgetFetch =
  | { status: 'ok'; widget: PublicWidgetData }
  | { status: 'not_found' }
  | { status: 'error' };

/**
 * Public read for embed pages — fetches a widget's current settings by its
 * short public_id without requiring a Supabase session.
 *
 * Backed by the `get_public_widget(p_id)` RPC (security definer, granted to
 * `anon`). Empty result → widget was hard-deleted or owner flipped is_active
 * to false; surfaced as `not_found` so the embed renders the placeholder.
 */
export const PublicWidgetService = {
  async fetchByPublicId(publicId: string): Promise<PublicWidgetFetch> {
    const { data, error } = await supabase.rpc('get_public_widget', { p_id: publicId });

    if (error) {
      Logger.warn('PublicWidget', 'RPC failed, falling back to URL settings', error);
      return { status: 'error' };
    }

    const rows = (data as PublicWidgetData[] | null) ?? [];
    if (rows.length === 0) {
      return { status: 'not_found' };
    }
    return { status: 'ok', widget: rows[0] };
  },
};
