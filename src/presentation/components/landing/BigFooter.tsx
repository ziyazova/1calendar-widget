import React from 'react';
import styled from 'styled-components';

const FooterOuter = styled.div``;

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
}

export const BigFooter: React.FC<BigFooterProps> = ({ onNavigate }) => (
  <FooterOuter>
  <FooterWrapper>
    <FooterTop>
      <FooterBrand>
        <img src="/PeachyLogo.png" alt="Peachy" width="24" height="24" style={{ objectFit: 'contain' }} />
        <BrandName>Peachy Studio</BrandName>
      </FooterBrand>
      <FooterNav>
        <NavGroup>
          <NavTitle>Product</NavTitle>
          <NavLink onClick={() => onNavigate('/templates')}>Templates</NavLink>
          <NavLink onClick={() => onNavigate('/widgets')}>Widget Studio</NavLink>
        </NavGroup>
        <NavGroup>
          <NavTitle>Widgets</NavTitle>
          <NavLink onClick={() => onNavigate('/widgets')}>Calendar</NavLink>
          <NavLink onClick={() => onNavigate('/widgets')}>Clock</NavLink>
        </NavGroup>
        <NavGroup>
          <NavTitle>Legal</NavTitle>
          <NavLink>Privacy</NavLink>
          <NavLink>Terms</NavLink>
        </NavGroup>
      </FooterNav>
    </FooterTop>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 24 }}>
      <FooterBottom>
        © {new Date().getFullYear()} Peachy Studio. All rights reserved.
      </FooterBottom>
      <div style={{ display: 'flex', gap: 16 }}>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: '#999', transition: 'color 0.15s' }} onMouseEnter={e => (e.currentTarget.style.color = '#1F1F1F')} onMouseLeave={e => (e.currentTarget.style.color = '#999')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: '#999', transition: 'color 0.15s' }} onMouseEnter={e => (e.currentTarget.style.color = '#1F1F1F')} onMouseLeave={e => (e.currentTarget.style.color = '#999')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
        <a href="https://discord.com" target="_blank" rel="noopener noreferrer" style={{ color: '#999', transition: 'color 0.15s' }} onMouseEnter={e => (e.currentTarget.style.color = '#1F1F1F')} onMouseLeave={e => (e.currentTarget.style.color = '#999')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
        </a>
      </div>
    </div>
  </FooterWrapper>
  </FooterOuter>
);
