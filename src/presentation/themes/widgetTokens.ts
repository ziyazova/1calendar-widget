/**
 * Unified tokens for adaptive widgets.
 * Use these for consistent layout across Calendar and Clock widgets.
 *
 * The embed wrapper uses CSS zoom for proportional shrinking,
 * so these values target the widget's design width (280px).
 */

// Container sizing — all widgets
export const WIDGET_CONTAINER = {
  minWidth: '200px',
  maxWidth: '256px',
  padding: '12px',
  minHeight: '160px',
  maxHeight: '380px',
} as const;

// Clock-specific (slightly narrower)
export const CLOCK_CONTAINER = {
  maxWidth: '360px',
  padding: '20px',
  minHeight: '160px',
} as const;

// Typography
export const WIDGET_TYPOGRAPHY = {
  heading: '17px',
  body: '13px',
  small: '11px',
} as const;

// Spacing
export const WIDGET_SPACING = {
  gap: '4px',
  gapMedium: '6px',
  margin: '10px',
} as const;

// Breakpoints
export const WIDGET_BREAKPOINTS = {
  xs: '360px',
  sm: '480px',
  md: '640px',
} as const;
