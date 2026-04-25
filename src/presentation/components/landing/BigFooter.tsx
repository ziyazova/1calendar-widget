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
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
`;

const FooterWrapper = styled.footer`
  width: 100%;
  max-width: 1200px;
  /* Padding-top 82 drops the Peachy block well below the footer's top
     edge — gives the brand a soft entrance from the surfaceAlt fill
     instead of sitting flush against it. */
  padding: 82px 48px 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 60px 24px 0;
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
    gap: 32px;
    padding-bottom: 24px;
  }
`;

const FooterBrand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
  max-width: 240px;
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
`;

const FooterNav = styled.div`
  display: flex;
  /* 3-column block anchored to the right edge by FooterTop's
     justify-content: space-between. 60px gap reads as a single grouped
     block on the right with breathing room between columns. */
  gap: 60px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 40px;
    flex-wrap: wrap;
  }
`;

const NavGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  padding: 0 48px 32px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 24px 24px;
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
`;

const FooterBottom = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  letter-spacing: -0.01em;
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
              <NavLink onClick={() => onNavigate('/privacy')}>Privacy</NavLink>
              <NavLink onClick={() => onNavigate('/terms')}>Terms</NavLink>
            </NavGroup>
          </FooterNav>
        </FooterTop>
      </FooterWrapper>

      <FooterBottomWrapper>
        <FooterBottomRow>
          <FooterBottom>
            © {new Date().getFullYear()} Peachy Studio. All rights reserved.
          </FooterBottom>
          <FooterBottom>
            Made with care in 2026
          </FooterBottom>
        </FooterBottomRow>
      </FooterBottomWrapper>
    </FooterOuter>
  );
};
