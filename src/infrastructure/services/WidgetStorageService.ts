import { supabase } from './supabase';
import { Logger } from './Logger';

export interface SavedWidget {
  id: string;
  user_id: string;
  name: string;
  type: string;
  style: string;
  settings: Record<string, unknown>;
  embed_url: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Thrown when the server rejects a widget write because the caller is over
 * the free-tier widget count or is trying to use a Pro-only style without
 * an active subscription. Callers catch this to open the upgrade modal.
 *
 * Enforced by the RLS policies in `004_widget_tier_enforcement.sql`.
 */
export class WidgetTierError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WidgetTierError';
  }
}

// Postgres error code for "insufficient privilege" — what PostgREST returns
// when an RLS WITH CHECK clause fails.
const RLS_VIOLATION_CODE = '42501';

function isRlsViolation(error: { code?: string | null } | null | undefined): boolean {
  return error?.code === RLS_VIOLATION_CODE;
}

export const WidgetStorageService = {
  async getUserWidgets(): Promise<SavedWidget[]> {
    const { data, error } = await supabase
      .from('widgets')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      Logger.error('WidgetStorage', 'Failed to fetch widgets', error);
      return [];
    }
    return data || [];
  },

  async saveWidget(widget: {
    name: string;
    type: string;
    style: string;
    settings: Record<string, unknown>;
    embed_url?: string;
  }): Promise<SavedWidget | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('widgets')
      .insert({
        user_id: user.id,
        name: widget.name,
        type: widget.type,
        style: widget.style,
        settings: widget.settings,
        embed_url: widget.embed_url || null,
      })
      .select()
      .single();

    if (isRlsViolation(error)) {
      throw new WidgetTierError(error!.message);
    }
    if (error) {
      Logger.error('WidgetStorage', 'Failed to save widget', error);
      return null;
    }
    return data;
  },

  async updateWidget(id: string, updates: {
    name?: string;
    style?: string;
    settings?: Record<string, unknown>;
    embed_url?: string;
  }): Promise<boolean> {
    const { error } = await supabase
      .from('widgets')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (isRlsViolation(error)) {
      throw new WidgetTierError(error!.message);
    }
    if (error) {
      Logger.error('WidgetStorage', 'Failed to update widget', error);
      return false;
    }
    return true;
  },

  async deleteWidget(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('widgets')
      .delete()
      .eq('id', id);

    if (error) {
      Logger.error('WidgetStorage', 'Failed to delete widget', error);
      return false;
    }
    return true;
  },
};
