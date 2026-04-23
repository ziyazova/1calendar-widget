/**
 * Nav tokens — dimensions, colors, and motion for the site-wide TopNav.
 * One source of truth so the nav bar, mobile menu, cart dropdown, and
 * avatar menu all share the same geometry and backdrop treatment.
 */

/* ── Bar geometry ─────────────────────────────────────────────────── */

export const navBarTokens = {
  height: '72px',
  /** Reserved in layout so fixed nav doesn't overlap page content. */
  spacerHeight: '65px',
  /** Horizontal padding — wider on desktop for editorial breathing room. */
  paddingX: '46px',
  paddingXMobile: '24px',
  /** Vertical padding only kicks in on mobile (height is fixed desktop). */
  paddingYMobile: '16px',
  maxWidth: '1300px',
  /** Frosted glass — backdrop-blur over ~70% white. */
  bg: 'rgba(255, 255, 255, 0.7)',
  blur: '12px',
  borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
  zIndex: 100,
};

/* ── Logo ────────────────────────────────────────────────────────── */

export const navLogoTokens = {
  gap: '8px',
  fontSize: '16px',
  fontWeight: 600,
  letterSpacing: '-0.02em',
  /** Tap-feedback — scale + opacity while pressed. */
  scalePressed: 0.88,
  scaleHover: 0.98,
  scaleActive: 0.92,
  opacityPressed: 0.4,
  opacityHover: 0.8,
  transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease',
};

/* ── Links ───────────────────────────────────────────────────────── */

export const navLinkTokens = {
  gap: '28px',
  fontSize: '13px',
  letterSpacing: '-0.01em',
  weightActive: 500,
  weightInactive: 400,
  /** Color comes from theme — stored here so we can swap at the token
      level if the text palette shifts. */
  transition: 'color 0.15s ease',
};

/* ── Primary CTA pill (Login / Studio) ───────────────────────────── */

export const navCtaTokens = {
  height: '34px',
  paddingX: '16px',
  fontSize: '13px',
  fontWeight: 500,
  /** Hover lifts the button 1px for tactile feedback. */
  hoverLift: '-1px',
  bgHover: '#333',
};

/* ── Mobile menu + burger ────────────────────────────────────────── */

export const navMobileTokens = {
  burgerSize: '36px',
  iconSize: '20px',
  /** Full-screen drop — sits just below the fixed nav. */
  topOffset: '57px',
  menuBg: 'rgba(255, 255, 255, 0.98)',
  menuBlur: '24px',
  linkFontSize: '15px',
  linkPadding: '14px 16px',
  linkGap: '2px',
  ctaHeight: '48px',
};

/* ── Cart trigger + dropdown/sheet ───────────────────────────────── */

export const navCartTokens = {
  buttonSize: '36px',
  iconSize: '18px',
  /** Notification pill (unread count) sits in top-right corner. */
  badgeMinWidth: '16px',
  badgeHeight: '16px',
  badgePaddingX: '4px',
  badgeFontSize: '10px',
  /** Desktop dropdown width — fixed so it doesn't jump on empty vs full. */
  dropdownWidth: '320px',
  dropdownOffset: '8px',
  /** Mobile bottom sheet cap — never covers more than 60% of viewport. */
  sheetMaxHeight: '60vh',
};
