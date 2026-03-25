import { supabase } from './supabase';

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

export const WidgetStorageService = {
  async getUserWidgets(): Promise<SavedWidget[]> {
    const { data, error } = await supabase
      .from('widgets')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('[WidgetStorage] Failed to fetch widgets:', error.message);
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

    if (error) {
      console.error('[WidgetStorage] Failed to save widget:', error.message);
      return null;
    }
    return data;
  },

  async updateWidget(id: string, updates: {
    name?: string;
    settings?: Record<string, unknown>;
    embed_url?: string;
  }): Promise<boolean> {
    const { error } = await supabase
      .from('widgets')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('[WidgetStorage] Failed to update widget:', error.message);
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
      console.error('[WidgetStorage] Failed to delete widget:', error.message);
      return false;
    }
    return true;
  },
};
