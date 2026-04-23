/**
 * Footer tokens — geometry, spacing, and typography for the primary
 * site-wide <Footer> (brand row + nav columns + copyright). Legal pages
 * can reuse the same primitive via the `$minimal` mode.
 */

export const footerLayoutTokens = {
  maxWidth: '1200px',
  paddingX: '48px',
  paddingXMobile: '24px',
  /** Top offset — space between page content and the divider line. */
  marginTop: '120px',
  /** Inner top padding (after divider) so the brand row doesn't hug the rule. */
  paddingTop: '68px',
  paddingTopMobile: '52px',
  /** Divider separating footer from page content. */
  divider: '1px solid rgba(0, 0, 0, 0.06)',
  /** Internal horizontal divider before the copyright line. */
  dividerInner: '1px solid rgba(0, 0, 0, 0.06)',
  /** Outer paddingTop only when divider is shown. */
  outerPaddingTop: '48px',
};

export const footerBrandTokens = {
  logoSize: '24px',
  logoGap: '10px',
  nameFontSize: '17px',
  nameWeight: 600,
  nameLetterSpacing: '-0.02em',
};

export const footerNavTokens = {
  /** Gap between column groups. */
  columnGap: '40px',
  columnGapMobile: '24px',
  /** Gap between label + links inside a single column. */
  innerGap: '10px',
  columnMinWidth: '110px',
  /** Top row margin before copyright band. */
  topRowMarginBottom: '40px',
  topRowMarginBottomMobile: '28px',
};

export const footerCopyTokens = {
  /** Title above each nav column — small caps, tight tracking. */
  titleFontSize: '12px',
  titleWeight: 600,
  titleTracking: '0.04em',
  titleCase: 'uppercase',
  titleMarginBottom: '2px',

  /** Nav link text. */
  linkFontSize: '13px',
  linkLetterSpacing: '-0.01em',
  linkTransition: 'color 0.15s ease',

  /** Copyright line. */
  copyFontSize: '13px',
  copyLetterSpacing: '-0.01em',
  /** Fixed width of the centered copyright strip. */
  copyBoxWidth: '360px',
  copyBoxPaddingTop: '20px',
  copyBoxMarginTop: '32px',
};
