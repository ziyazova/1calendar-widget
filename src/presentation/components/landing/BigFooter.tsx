import React from 'react';
import styled from 'styled-components';

/* Vertical rhythm: 8-grid throughout — wrapper padding 48/32, primary →
   secondary gap 48, divider → byline gap 24. Color hierarchy: primary
   (Peachy / nav titles) = text.primary, secondary (links / bylines) =
   text.tertiary. Dividers (top + bottom) span the full viewport. */

const FooterOuter = styled.div`
  margin-top: 120px;
  /* Fixed footer height (min-height so mobile column layouts can grow):
     surfaceAlt fill makes the page transition tonally into the footer
     rather than via a hairline rule. Flex column + space-between
     vertically distributes the brand row and the bottom row so the top
     content sits lower (more breathing room above it) and the copyright
     stays pinned to the floor. align-items: center keeps both wrappers
     at the same 1200px centered width as each other. */
  /* Desktop — 298 (iterated 300 → 260 → 280 → 298, +18 last pass).
   * Extra 18 distributed symmetrically inside the wrapper +9 top / +9
   * bottom (FooterWrapper pt 62→71, FooterBottomWrapper pb 32→41) so
   * brand and copyright move inward equally, keeping the layout
   * balanced. Mobile keeps 270 below, untouched. */
  min-height: 298px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.background.surfaceAlt};

  /* Mobile — 270 (independent of desktop). Set during phone adaptation
   * after FooterWrapper padding/FooterBrand margin tweaks. */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: 270px;
  }
`;

const FooterWrapper = styled.footer`
  width: 100%;
  max-width: 1200px;
  /* Padding-top 53 (was 71, −18). Last ask: "контент футера на десктопе
     выше на 18 пикс" — brand block lifts by exactly 18. The +18 height
     on FooterOuter and the +9 on FooterBottomWrapper still hold, so
     copyright stays anchored at the floor; only the top block moves. */
  padding: 53px 48px 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    /* 2 top — last trim ("футер сверху подрежь на 18 пикс"). Logo's
     * vertical position is now driven almost entirely by FooterBrand's
     * margin-top (36); this kills the residual top breathing inside the
     * wrapper. The section's surfaceAlt band still extends 36 above
     * via the wrapper Section's padding-top token. */
    padding: 2px ${({ theme }) => theme.layout.mobile.gutter} 0;
  }

  /* Tablet — extra right padding (48 → 72) so the right-aligned
   * Legal column doesn't sit flush with the viewport edge. Left
   * stays at 48 to keep the brand block's existing position. */
  @media (min-width: calc(${({ theme }) => theme.breakpoints.md} + 1px))
    and (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 53px 72px 0 48px;
  }
`;

const FooterTop = styled.div`
  display: flex;
  align-items: flex-start;
  /* Brand pinned left, nav block pinned right (anchored to the same
     right edge as "Made with care in 2026" below). */
  justify-content: space-between;
  gap: 48px;
  /* Trimmed (48 → 24) so there's free space inside the 300px container
     for FooterBottomWrapper's margin-top:auto to consume — that's what
     pushes the copyright row to the floor. */
  padding-bottom: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    /* gap 32 (was 56) — footer felt too tall / "выделяется" on mobile
     * per c_2026-04-27. Pulls nav block back up so the surfaceAlt
     * footer band reads quieter. */
    gap: 32px;
    padding-bottom: 16px;
  }
`;

const FooterBrand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
  max-width: 240px;

  /* Mobile — push the logo block down inside the footer without adding
   * top padding to the wrapper (top edge stays trimmed). Iterated
   * 18 → 36 → 10 (last ask: "сверху футер отрежь ещё на 26 сверху", so
   * -26 from 36). */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 10px;
  }
`;

const FooterBrandRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BrandName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
`;

const BrandTagline = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  letter-spacing: -0.01em;
  line-height: 1.5;

  /* Hide on mobile — tagline is decorative; brand name + nav columns
   * carry the structure at this width.
   * Comment c_mog12d2l (2026-04-26): "убери текст у телефонной версии". */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const FooterNav = styled.div`
  display: flex;
  /* 3-column block anchored to the right edge by FooterTop's
     justify-content: space-between. 60px gap reads as a single grouped
     block on the right with breathing room between columns. */
  gap: 60px;

  /* Mobile — 3-column grid (was 2). Longest link "Widget Studio" fits
   * in ~95px, columns at ~100px each in a 375 viewport with 16px gaps
   * still hold without wrapping, so a single tidy row beats 2-up + a
   * lonely third group flowing to a second row.
   * Comment c_mog7230m: "если помещается в одну линию все 3 столбика —
   * давай сделаем". */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* Bumped column-gap 20 → 24 and row-gap 28 → 32 per c_mosld8kt
     * "чуть чуть больше спеса между блоками" — links read less cramped
     * inside the 375 viewport without forcing a wrap. */
    column-gap: 24px;
    row-gap: 32px;
  }
`;

const NavGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  /* Mobile — slightly looser link rhythm inside each column (12 → 14)
   * to match the bumped column/row gaps above. Per c_mosld8kt. */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 14px;
  }
`;

/* Legal column variant — single column stack (Privacy / Terms / Refund
 * / Imprint each on their own row). Was 2×2 grid; reverted to one
 * column per c_legal-stack ("в столбик один а не два") so all four
 * links read as a tidy vertical list flush with the other Footer cols. */
const LegalLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 14px;
  }
`;

const NavTitle = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const NavLink = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};
  letter-spacing: -0.01em;

  &:hover { color: ${({ theme }) => theme.colors.text.primary}; }
`;

/* Bottom divider — short, lives inside the 1200px wrapper above the
   copyright row. Lighter than the top one to reduce visual weight at the
   end of the page. */
const FooterBottomWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  /* margin-top: auto eats the leftover vertical space inside the 300px
     container and pins the copyright row to the floor — works even when
     content naturally totals less than min-height. */
  margin-top: auto;
  /* Desktop pb 24 (was 41) — copyright row drops closer to the page
     bottom so it sits lower under the nav links, per user feedback
     "чуть ниже этот текст у футера чуть отпусти". */
  padding: 0 48px 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 ${({ theme }) => theme.layout.mobile.gutter} 16px;
  }

  /* Tablet — match FooterWrapper's right padding so the copyright
   * row aligns with the brand block above. */
  @media (min-width: calc(${({ theme }) => theme.breakpoints.md} + 1px))
    and (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 72px 41px 48px;
  }
`;

const FooterBottomRow = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  padding-top: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;

  /* Mobile — center the copyright. The "Made with care" sibling is
   * hidden via $hideOnMobile, so space-between leaves the lone © text
   * stuck to the left edge. Center reads as intentional.
   * "контент внутри выровни". Tighter padding-top per "footer оч много". */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: center;
    padding-top: 16px;
  }
`;

const FooterBottom = styled.span<{ $hideOnMobile?: boolean }>`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  letter-spacing: -0.01em;

  /* Mobile — copyright sits at the very bottom of the page, fine print
   * is the right register here. 11px reads as "legal/secondary" rather
   * than competing with footer nav links.
   * Comment c_mog8636s: "меньше по размеру текст этот". */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 11px;
  }

  /* Mobile — instances opted-in via $hideOnMobile drop out. The
   * "Made with care in 2026" line is decorative; the © copyright
   * is enough at this width.
   * Comment c_mofz76xx (2026-04-26): "можно на телефоне убрать". */
  ${({ $hideOnMobile }) =>
    $hideOnMobile &&
    `
    @media (max-width: 768px) {
      display: none;
    }
  `}
`;

interface BigFooterProps {
  onNavigate: (path: string) => void;
  noDivider?: boolean;
}

export const BigFooter: React.FC<BigFooterProps> = ({ onNavigate, noDivider }) => {
  return (
    <FooterOuter style={noDivider ? { marginTop: 0, borderTop: 'none' } : undefined}>
      <FooterWrapper>
        <FooterTop>
          <FooterBrand>
            <FooterBrandRow>
              <img src="/PeachyLogo.png" alt="Peachy" width="24" height="24" style={{ objectFit: 'contain' }} />
              <BrandName>Peachy</BrandName>
            </FooterBrandRow>
            <BrandTagline>Notion widgets &amp; templates that feel like yours.</BrandTagline>
          </FooterBrand>
          <FooterNav>
            <NavGroup>
              <NavTitle>Product</NavTitle>
              <NavLink onClick={() => onNavigate('/templates')}>Templates</NavLink>
              <NavLink onClick={() => onNavigate('/widgets')}>Widget Studio</NavLink>
            </NavGroup>
            <NavGroup>
              <NavTitle>Social</NavTitle>
              <NavLink onClick={() => window.open('https://etsy.com', '_blank')}>Etsy</NavLink>
              <NavLink onClick={() => window.open('https://instagram.com', '_blank')}>Instagram</NavLink>
            </NavGroup>
            <NavGroup>
              <NavTitle>Legal</NavTitle>
              <LegalLinks>
                <NavLink onClick={() => onNavigate('/privacy')}>Privacy</NavLink>
                <NavLink onClick={() => onNavigate('/terms')}>Terms</NavLink>
                <NavLink onClick={() => onNavigate('/refund')}>Refund</NavLink>
                <NavLink onClick={() => onNavigate('/legal')}>Imprint</NavLink>
              </LegalLinks>
            </NavGroup>
          </FooterNav>
        </FooterTop>
      </FooterWrapper>

      <FooterBottomWrapper>
        <FooterBottomRow>
          <FooterBottom>
            © {new Date().getFullYear()} Peachy Studio. All rights reserved.
          </FooterBottom>
          <FooterBottom $hideOnMobile>
            Made with care in 2026
          </FooterBottom>
        </FooterBottomRow>
      </FooterBottomWrapper>
    </FooterOuter>
  );
};
