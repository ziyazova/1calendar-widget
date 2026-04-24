import React from 'react';
import styled, { useTheme } from 'styled-components';

const FooterOuter = styled.div`
  margin-top: 120px;
  border-top: 1px solid ${({ theme }) => theme.colors.border.hairline};
  padding-top: 48px;
`;

const FooterWrapper = styled.footer`
  max-width: 1200px;
  margin: 0 auto;
  padding: 68px 48px 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 52px 24px 0;
  }
`;

const FooterTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 48px;
  margin-bottom: 40px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: 28px;
    margin-bottom: 28px;
  }
`;

const FooterBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

const BrandName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
`;

const FooterNav = styled.div`
  display: flex;
  gap: 40px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 24px;
    flex-wrap: wrap;
  }
`;

const NavGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 110px;
`;

const NavTitle = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 2px;
`;

const NavLink = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};
  letter-spacing: -0.01em;

  &:hover { color: ${({ theme }) => theme.colors.text.primary}; }
`;

const FooterBottom = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.muted};
  letter-spacing: -0.01em;
`;

interface BigFooterProps {
  onNavigate: (path: string) => void;
  noDivider?: boolean;
}

export const BigFooter: React.FC<BigFooterProps> = ({ onNavigate, noDivider }) => {
  const theme = useTheme();
  return (
  <FooterOuter style={noDivider ? { marginTop: 0, borderTop: 'none', paddingTop: 0 } : undefined}>
  <FooterWrapper>
    <FooterTop>
      <FooterBrand>
        <img src="/PeachyLogo.png" alt="Peachy" width="24" height="24" style={{ objectFit: 'contain' }} />
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
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 32 }}>
      <div style={{ borderTop: `1px solid ${theme.colors.border.hairline}`, paddingTop: 20, textAlign: 'center', width: 360 }}>
        <FooterBottom>
          © {new Date().getFullYear()} Peachy Studio. All rights reserved.
        </FooterBottom>
      </div>
    </div>
  </FooterWrapper>
  </FooterOuter>
  );
};
