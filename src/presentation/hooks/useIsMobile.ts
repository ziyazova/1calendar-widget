import { useState, useEffect } from 'react';

const PHONE_BREAKPOINT = 480;
const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;
const COMPACT_BREAKPOINT = 1100;

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    setMatches(mq.matches);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`);
}

export function useIsTablet(): boolean {
  return useMediaQuery(
    `(min-width: ${MOBILE_BREAKPOINT + 1}px) and (max-width: ${TABLET_BREAKPOINT}px)`
  );
}

/** Compact desktop layout — true at ≤1100px. Used by /widgets logged-in
 *  cards where the 3-col grid keeps a stacked card body (title on top,
 *  full-width button below) until 1100, then switches to inline title +
 *  button on wider screens. */
export function useIsCompact(): boolean {
  return useMediaQuery(`(max-width: ${COMPACT_BREAKPOINT}px)`);
}

/** Narrow phone — true at ≤480px (sm breakpoint). Used to swap button
 *  variants where the dense single-column layout calls for a darker
 *  CTA, e.g. /widgets landing Customize → primary at this width. */
export function useIsPhone(): boolean {
  return useMediaQuery(`(max-width: ${PHONE_BREAKPOINT}px)`);
}
