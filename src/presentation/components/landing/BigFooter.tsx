import React from 'react';
import styled from 'styled-components';

const FooterOuter = styled.div`
  margin-top: 120px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding-top: 48px;
`;

const FooterWrapper = styled.footer`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 48px 40px;

  @media (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const FooterTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 48px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
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
  font-size: 17px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
`;

const FooterNav = styled.div`
  display: flex;
  gap: 40px;

  @media (max-width: 768px) {
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
  letter-spacing: 0.04em;
  margin-bottom: 2px;
`;

const NavLink = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  cursor: pointer;
  transition: color 0.15s ease;
  letter-spacing: -0.01em;

  &:hover { color: ${({ theme }) => theme.colors.text.primary}; }
`;

const FooterBottom = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.muted};
  letter-spacing: -0.01em;
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
          <NavLink onClick={() => window.open('https://pinterest.com', '_blank')}>Pinterest</NavLink>
        </NavGroup>
        <NavGroup>
          <NavTitle>Legal</NavTitle>
          <NavLink>Privacy</NavLink>
          <NavLink>Terms</NavLink>
        </NavGroup>
      </FooterNav>
    </FooterTop>
    <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 24 }}>
      <FooterBottom>
        © {new Date().getFullYear()} Peachy Studio. All rights reserved.
      </FooterBottom>
    </div>
  </FooterWrapper>
  </FooterOuter>
);
