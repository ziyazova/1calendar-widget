import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/presentation/context/AuthContext';
import { WidgetStorageService } from '@/infrastructure/services/WidgetStorageService';

const FREE_WIDGET_LIMIT = 3;

export interface WidgetQuota {
  count: number;
  limit: number;
  isPro: boolean;
  /** Free user who has reached or exceeded the free cap. A Pro user is never at-limit. */
  atLimit: boolean;
  /** True until the first fetch resolves (prevents flicker-gating before count is known). */
  loading: boolean;
  refresh: () => Promise<void>;
}

/**
 * Cheap widget-count + plan hook used by every surface that needs to decide
 * whether to let the user create another widget (gallery Customize buttons,
 * Studio banner, upgrade prompts). Fetches only for registered users — guests
 * and anonymous visitors short-circuit to `{ count: 0, atLimit: false }` so
 * the paywall never triggers outside of real save paths.
 */
export function useWidgetQuota(): WidgetQuota {
  const { isRegistered, isPro } = useAuth();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(isRegistered);

  const refresh = useCallback(async () => {
    if (!isRegistered) {
      setCount(0);
      setLoading(false);
      return;
    }
    const widgets = await WidgetStorageService.getUserWidgets();
    setCount(widgets.length);
    setLoading(false);
  }, [isRegistered]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const atLimit = isRegistered && !isPro && count >= FREE_WIDGET_LIMIT;

  return { count, limit: FREE_WIDGET_LIMIT, isPro, atLimit, loading, refresh };
}
