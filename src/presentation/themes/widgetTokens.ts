/**
 * Unified tokens for adaptive widgets.
 * Use these for consistent layout across Calendar and Clock widgets.
 */

// Container sizing — all widgets
export const WIDGET_CONTAINER = {
  minWidth: '200px',
  maxWidth: 'min(420px, 95vw)',
  padding: 'clamp(12px, 4vw, 24px)',
  minHeight: 'clamp(160px, 40vw, 220px)',
} as const;

// Clock-specific (slightly narrower)
export const CLOCK_CONTAINER = {
  maxWidth: 'min(360px, 95vw)',
  padding: 'clamp(12px, 4vw, 24px)',
  minHeight: 'clamp(160px, 40vw, 220px)',
} as const;

// Typography
export const WIDGET_TYPOGRAPHY = {
  heading: 'clamp(14px, 4vw, 22px)',
  body: 'clamp(12px, 2.8vw, 16px)',
  small: 'clamp(10px, 2.2vw, 14px)',
} as const;

// Spacing
export const WIDGET_SPACING = {
  gap: 'clamp(2px, 1vw, 8px)',
  gapMedium: 'clamp(4px, 1.5vw, 12px)',
  margin: 'clamp(8px, 2vw, 16px)',
} as const;

// Breakpoints
export const WIDGET_BREAKPOINTS = {
  xs: '360px',
  sm: '480px',
  md: '640px',
} as const;
