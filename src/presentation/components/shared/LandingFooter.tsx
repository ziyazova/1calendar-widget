import React from 'react';
import styled from 'styled-components';
import { BigFooter } from '../landing/BigFooter';

/**
 * LandingFooter — single source for the page-tail footer pattern that
 * sits on `theme.colors.background.surfaceAlt` with no internal divider.
 * Mirrors the main landing's `<Section $size="gap" $tint $bleedTopDesktop
 * $bleedBottom><BigFooter noDivider /></Section>` 1:1, so every page
 * (LandingPage, /widgets, /templates, /templates/:id, etc) renders the
 * same tail without re-implementing the wrapper. Edit here, every
 * call-site updates.
 *
 *   - Background: surfaceAlt tint (only on the actual footer content)
 *   - Desktop margin-top: 100 (≥100 air between last content and footer
 *     — kept as page background, NOT painted with surfaceAlt). Per
 *     "ты окрасил эту зону спейса почему" (c_2026-04-28).
 *   - Mobile padding-top: layout.mobile.sectionPaddingY (36) so the
 *     footer reads as its own block on phone after the prior content
 *   - <BigFooter /> rendered with `noDivider` so the top hairline is
 *     dropped — the surfaceAlt wash already separates it from above
 */

const FooterSection = styled.section<{ $clearStickyBar?: boolean }>`
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
  padding: 0;
  /* Desktop — 100 of air between last content and footer, kept as
   * page background (white) instead of the surfaceAlt zone. margin
   * doesn't pick up the section's tint, so the gap reads as page
   * space, not "footer with empty top". Per "ты окрасил эту зону
   * спейса почему" (c_2026-04-28). */
  margin-top: 100px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 0;
    padding-top: ${({ theme }) => theme.layout.mobile.sectionPaddingY};
    /* When the page renders a fixed bottom action bar (e.g. <MobileBuyBar>
     * on /templates/:id), reserve ~120px of empty room beneath the footer
     * so its last visible row (Privacy/Terms) clears the bar when scrolled
     * to the very bottom. Without this the bar's blurred-glass surface
     * sits on top of the footer copy. */
    ${({ $clearStickyBar }) =>
      $clearStickyBar &&
      'padding-bottom: calc(56px + env(safe-area-inset-bottom, 0px));'}
  }
`;

interface LandingFooterProps {
  onNavigate: (path: string) => void;
  /** Set to true when the page renders a fixed bottom action bar
   *  (sticky CTA) on mobile, so the footer leaves room for it. */
  clearStickyBar?: boolean;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onNavigate,
  clearStickyBar,
}) => (
  <FooterSection $clearStickyBar={clearStickyBar}>
    <BigFooter onNavigate={onNavigate} noDivider />
  </FooterSection>
);
