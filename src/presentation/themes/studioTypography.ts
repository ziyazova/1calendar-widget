import { css } from 'styled-components';
import {
  TypographySize,
  TypographyWeight,
  TypographyLineHeight,
  TypographyLetterSpacing,
} from './textStyleTokens';

/**
 * Studio / Dashboard / Settings — internal UI typography presets.
 *
 * These are DIFFERENT from the public-site `textStyleTokens.ts` presets.
 * The app-internal surfaces (widget editor, my widgets, purchases, sidebar,
 * settings) run a tighter, denser type system than the marketing pages —
 * more UI-chrome, less editorial. Keeping them separate avoids collisions
 * and lets each zone evolve independently.
 *
 * Patterns below are extracted from real declarations in:
 *   - StudioPage.tsx (widget picker, editor)
 *   - DashboardViews.tsx (my widgets, purchases)
 *   - SettingsPage.tsx (profile, billing)
 *   - Sidebar.tsx (navigation)
 *
 * Usage:
 *
 *   import { studioText } from '@/presentation/themes/studioTypography';
 *   const Title = styled.h2`
 *     ${studioText('sectionTitle')}
 *     color: ${({ theme }) => theme.colors.text.primary};
 *   `;
 *
 *   // or via shared component:
 *   <StudioText $variant="cardTitle">My Widget</StudioText>
 */

export type StudioTextStyle =
  | 'pageTitle'
  | 'sectionTitle'
  | 'cardTitle'
  | 'cardTitleSm'
  | 'menuItem'
  | 'body'
  | 'caption'
  | 'micro';

interface StudioTextRecipe {
  size: TypographySize;
  weight: TypographyWeight;
  lineHeight: TypographyLineHeight;
  letterSpacing: TypographyLetterSpacing;
}

export const studioTypographyTokens: Record<StudioTextStyle, StudioTextRecipe> = {
  /** Welcome h1, Settings page title — 28px · 600 · -0.03em */
  pageTitle: {
    size: '6xl',
    weight: 'semibold',
    lineHeight: 'snug',
    letterSpacing: 'tightest',
  },
  /** "Calendars" / "Clocks" block header in Studio, "Profile" in Settings — 18px · 600 · -0.02em */
  sectionTitle: {
    size: '2xl',
    weight: 'semibold',
    lineHeight: 'snug',
    letterSpacing: 'tighter',
  },
  /** Dashboard card title, purchase item — 14px · 600 · -0.01em */
  cardTitle: {
    size: 'base',
    weight: 'semibold',
    lineHeight: 'snug',
    letterSpacing: 'tight',
  },
  /** Widget card name in grid, smaller contexts — 13px · 600 · -0.01em */
  cardTitleSm: {
    size: 'md',
    weight: 'semibold',
    lineHeight: 'snug',
    letterSpacing: 'tight',
  },
  /** Sidebar navigation entry — 13px · 500 · -0.01em */
  menuItem: {
    size: 'md',
    weight: 'medium',
    lineHeight: 'normal',
    letterSpacing: 'tight',
  },
  /** Modal body text, helper paragraphs — 14px · 400 · 1.5 · -0.005em */
  body: {
    size: 'base',
    weight: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'loose',
  },
  /** Meta / timestamp / muted label — 12px · 400 · 0 */
  caption: {
    size: 'sm',
    weight: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  /** Bottom-tab labels, compact chrome — 11px · 500 · -0.01em */
  micro: {
    size: 'xs',
    weight: 'medium',
    lineHeight: 'tight',
    letterSpacing: 'tight',
  },
};

/** CSS fragment for a named studio text style. */
export const studioText = (name: StudioTextStyle) => {
  const t = studioTypographyTokens[name];
  return css`
    font-family: ${({ theme }) => theme.typography.fonts.primary};
    font-size: ${({ theme }) => theme.typography.sizes[t.size]};
    font-weight: ${({ theme }) => theme.typography.weights[t.weight]};
    line-height: ${({ theme }) => theme.typography.lineHeights[t.lineHeight]};
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing[t.letterSpacing]};
  `;
};
