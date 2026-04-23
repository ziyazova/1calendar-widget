/**
 * Slider tokens — shared visual language for every range input in the
 * app. Used in the studio customization panel (Corners / Font Size) and
 * any future numeric settings.
 *
 * The tokens cover: track geometry, thumb sizing, colors, and shadows.
 * Sizes scale for touch on mobile automatically.
 */

export const sliderTrackTokens = {
  /** Thin track — used in dense settings panels. */
  height: '4px',
  heightMobile: '6px',
  radius: '4px',
  bg: 'rgba(0, 0, 0, 0.04)',
  bgFocus: 'rgba(0, 0, 0, 0.06)',
  innerShadow: 'inset 0 0.5px 1px rgba(0, 0, 0, 0.04)',
};

export const sliderThumbTokens = {
  size: '18px',
  sizeMobile: '22px',
  bg: '#FFFFFF',
  /** Accent ring — theme accent, thicker on hover. */
  borderWidth: '2px',
  shadow: '0 2px 6px rgba(51, 132, 244, 0.25)',
  shadowHover: '0 3px 10px rgba(51, 132, 244, 0.35)',
  /** Motion presets — spring + scale on hover/press. */
  scaleHover: 1.12,
  scaleActive: 0.94,
  transition: 'transform 0.15s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.15s ease',
};

export const sliderLabelTokens = {
  fontSize: '12px',
  fontSizeMobile: '13px',
  fontWeight: 500,
  letterSpacing: '-0.01em',
  /** Gap between label row and track. */
  labelGap: '8px',
  /** Gap between track and trailing value pill. */
  valueGap: '12px',
  /** Min width of the trailing value so numbers don't jump as they grow. */
  valueMinWidth: '36px',
};
