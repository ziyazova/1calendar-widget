import { useEffect, useState } from 'react';
import { PublicWidgetService } from '../../infrastructure/services/PublicWidgetService';
import { Logger } from '../../infrastructure/services/Logger';

export type SyncState = 'idle' | 'syncing' | 'live' | 'unavailable' | 'error';

interface SyncResult {
  /** Live settings from Supabase, or null while syncing / on error / when no publicId. */
  liveSettings: Record<string, unknown> | null;
  /** True when the RPC reports the widget was deleted/paused. Render placeholder. */
  unavailable: boolean;
  state: SyncState;
}

/**
 * Embed-page sync hook.
 *
 * The page always renders URL-encoded settings immediately for instant first
 * paint. This hook fetches fresh settings by public_id in the background:
 *   - status `live`        → liveSettings populated, page swaps them in
 *   - status `unavailable` → owner deleted/paused, page renders placeholder
 *   - status `error`/`idle`→ liveSettings stays null, page keeps URL fallback
 *
 * Returning raw settings (not a typed wrapper) keeps the hook widget-agnostic;
 * each page passes the result to its own Settings constructor.
 */
export function usePublicWidgetSync(publicId: string | null): SyncResult {
  const [liveSettings, setLiveSettings] = useState<Record<string, unknown> | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [state, setState] = useState<SyncState>(publicId ? 'syncing' : 'idle');

  useEffect(() => {
    if (!publicId) {
      setState('idle');
      return;
    }

    let cancelled = false;
    setState('syncing');

    PublicWidgetService.fetchByPublicId(publicId).then((result) => {
      if (cancelled) return;

      if (result.status === 'ok') {
        setLiveSettings(result.widget.settings);
        setState('live');
        Logger.debug('PublicWidgetSync', 'Live settings applied', { publicId });
        return;
      }

      if (result.status === 'not_found') {
        setUnavailable(true);
        setState('unavailable');
        Logger.info('PublicWidgetSync', 'Widget unavailable', { publicId });
        return;
      }

      // status === 'error' — keep URL fallback rendering, don't flip placeholder.
      setState('error');
    });

    return () => {
      cancelled = true;
    };
  }, [publicId]);

  return { liveSettings, unavailable, state };
}
