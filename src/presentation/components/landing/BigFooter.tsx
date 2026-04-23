import React from 'react';
import styled from 'styled-components';
import {
  footerLayoutTokens,
  footerBrandTokens,
  footerNavTokens,
  footerCopyTokens,
} from '@/presentation/themes/footerTokens';

/**
 * BigFooter — primary site-wide footer (brand + nav columns + copyright).
 * Tokenized via `themes/footerTokens.ts`. Also re-exported through
 * `components/shared/index.ts` so consumers can import from the DS
 * barrel; the file stays here to preserve the 15+ existing imports.
 */

const FooterOuter = styled.div`
  margin-top: ${footerLayoutTokens.marginTop};
  border-top: ${footerLayoutTokens.divider};
  padding-top: ${footerLayoutTokens.outerPaddingTop};
`;

const FooterWrapper = styled.footer`
  max-width: ${footerLayoutTokens.maxWidth};
  margin: 0 auto;
  padding: ${footerLayoutTokens.paddingTop} ${footerLayoutTokens.paddingX} 0;

  @media (max-width: 768px) {
    padding: ${footerLayoutTokens.paddingTopMobile} ${footerLayoutTokens.paddingXMobile} 0;
  }
`;

const FooterTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${footerLayoutTokens.paddingX};
  margin-bottom: ${footerNavTokens.topRowMarginBottom};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${footerNavTokens.columnGapMobile};
    margin-bottom: ${footerNavTokens.topRowMarginBottomMobile};
  }
`;

const FooterBrand = styled.div`
  display: flex;
  align-items: center;
  gap: ${footerBrandTokens.logoGap};
  flex-shrink: 0;
`;

const BrandName = styled.span`
  font-size: ${footerBrandTokens.nameFontSize};
  font-weight: ${footerBrandTokens.nameWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: ${footerBrandTokens.nameLetterSpacing};
`;

const FooterNav = styled.div`
  display: flex;
  gap: ${footerNavTokens.columnGap};

  @media (max-width: 768px) {
    gap: ${footerNavTokens.columnGapMobile};
    flex-wrap: wrap;
  }
`;

const NavGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${footerNavTokens.innerGap};
  min-width: ${footerNavTokens.columnMinWidth};
`;

const NavTitle = styled.span`
  font-size: ${footerCopyTokens.titleFontSize};
  font-weight: ${footerCopyTokens.titleWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  text-transform: ${footerCopyTokens.titleCase};
  letter-spacing: ${footerCopyTokens.titleTracking};
  margin-bottom: ${footerCopyTokens.titleMarginBottom};
`;

const NavLink = styled.span`
  font-size: ${footerCopyTokens.linkFontSize};
  color: ${({ theme }) => theme.colors.text.tertiary};
  cursor: pointer;
  transition: ${footerCopyTokens.linkTransition};
  letter-spacing: ${footerCopyTokens.linkLetterSpacing};

  &:hover { color: ${({ theme }) => theme.colors.text.primary}; }
`;

const FooterBottomBand = styled.div`
  display: flex;
  justify-content: center;
  padding-top: ${footerCopyTokens.copyBoxMarginTop};
`;

const FooterBottomBox = styled.div`
  border-top: ${footerLayoutTokens.dividerInner};
  padding-top: ${footerCopyTokens.copyBoxPaddingTop};
  text-align: center;
  width: ${footerCopyTokens.copyBoxWidth};
`;

const FooterBottom = styled.div`
  font-size: ${footerCopyTokens.copyFontSize};
  color: ${({ theme }) => theme.colors.text.muted};
  letter-spacing: ${footerCopyTokens.linkLetterSpacing};
`;

interface BigFooterProps {
  onNavigate: (path: string) => void;
  noDivider?: boolean;
}

export const BigFooter: React.FC<BigFooterProps> = ({ onNavigate, noDivider }) => (
  <FooterOuter style={noDivider ? { marginTop: 0, borderTop: 'none', paddingTop: 0 } : undefined}>
    <FooterWrapper>
      <FooterTop>
        <FooterBrand>
          <img
            src="/PeachyLogo.png"
            alt="Peachy"
            width={footerBrandTokens.logoSize.replace('px', '')}
            height={footerBrandTokens.logoSize.replace('px', '')}
            style={{ objectFit: 'contain' }}
          />
          <BrandName>Peachy</BrandName>
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
      <FooterBottomBand>
        <FooterBottomBox>
          <FooterBottom>
            © {new Date().getFullYear()} Peachy Studio. All rights reserved.
          </FooterBottom>
        </FooterBottomBox>
      </FooterBottomBand>
    </FooterWrapper>
  </FooterOuter>
);
