import { css } from 'styled-components';
import { theme } from './theme';

/**
 * Single source of truth for responsive queries in styled-components.
 *
 * The site is desktop-first — desktop layout is frozen and visually
 * untouchable. We override DOWNWARD on smaller screens via max-width
 * media queries. Never use min-width to alter desktop styles.
 *
 * Semantics (cumulative — smallest wins):
 *   media.mobile      → applies on ≤ 640px (phones)
 *   media.tablet      → applies on ≤ 1024px (phones AND tablets)
 *   media.desktopUp   → applies on ≥ 1025px (rare; min-width helper)
 *
 * Usage:
 *   const Hero = styled.section`
 *     padding: 0 48px;
 *     ${media.mobile`
 *       padding: 0 24px;
 *     `}
 *   `;
 */

type CssArgs = Parameters<typeof css>;

const maxWidth =
  (px: string) =>
  (...args: CssArgs) =>
    css`
      @media (max-width: ${px}) {
        ${css(...args)}
      }
    `;

const minWidth =
  (px: string) =>
  (...args: CssArgs) =>
    css`
      @media (min-width: ${px}) {
        ${css(...args)}
      }
    `;

export const media = {
  /** ≤ 640px — phones. Single column, burger, sticky CTAs. */
  mobile: maxWidth(theme.breakpoints.mobile),

  /** ≤ 1024px — phones + tablets. Cumulative; mobile rules still apply. */
  tablet: maxWidth(theme.breakpoints.tablet),

  /** ≥ 1025px — desktop only. Use sparingly; desktop is the default. */
  desktopUp: minWidth(theme.breakpoints.desktop),
} as const;

export { useMediaQuery, MQ } from './useMediaQuery';
