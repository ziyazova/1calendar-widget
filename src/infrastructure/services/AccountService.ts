import { supabase } from './supabase';
import { WidgetStorageService } from './WidgetStorageService';
import { Logger } from './Logger';

export const AccountService = {
  // Bundles the current user's profile + all their widgets into a JSON payload
  // suitable for GDPR data export. Returns null if not authenticated.
  async buildExportPayload(): Promise<Record<string, unknown> | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const widgets = await WidgetStorageService.getUserWidgets();
    return {
      exported_at: new Date().toISOString(),
      profile: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        created_at: user.created_at,
      },
      widgets,
    };
  },

  async deleteOwnAccount(): Promise<string | null> {
    const { error } = await supabase.rpc('delete_own_user');
    if (error) {
      Logger.error('Account', 'Failed to delete account', error);
      return error.message;
    }
    // Clear the local session since the user no longer exists on the server.
    try { await supabase.auth.signOut(); } catch { /* ignore */ }
    // Wipe any peachy_* client state (guest flag, cart, cached filters).
    // Otherwise a different Google account signing in on this device would
    // inherit the previous user's local cache.
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k) continue;
        if (k.startsWith('peachy_') || k.startsWith('sb-')) keysToRemove.push(k);
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      sessionStorage.setItem('peachy_account_deleted', '1');
    } catch { /* ignore storage errors */ }
    return null;
  },
};
