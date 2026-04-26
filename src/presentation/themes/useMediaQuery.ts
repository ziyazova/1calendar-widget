import { useEffect, useState } from 'react';

/**
 * Reactive media-query hook. Use ONLY when CSS can't express the
 * variation (e.g. you need to render a different component tree, swap
 * an `aria-*` attribute, or branch on touch capability in JS).
 *
 * For pure visual changes, prefer `media.mobile` / `media.tablet` from
 * `./media.ts` — pure CSS is cheaper and avoids hydration mismatches.
 *
 * Server/SSR-safe: returns `false` when `window` is undefined.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    setMatches(mql.matches);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * Canonical media-query strings — use as `useMediaQuery(MQ.MOBILE)`
 * instead of duplicating literal strings across the codebase.
 */
export const MQ = {
  MOBILE: '(max-width: 640px)',
  TABLET: '(max-width: 1024px)',
  TOUCH: '(hover: none) and (pointer: coarse)',
  REDUCED_MOTION: '(prefers-reduced-motion: reduce)',
} as const;
