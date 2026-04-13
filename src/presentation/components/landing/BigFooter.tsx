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
        {/* Etsy */}
        <a href="https://etsy.com" target="_blank" rel="noopener noreferrer" style={{ color: '#999', transition: 'color 0.15s' }} onMouseEnter={e => (e.currentTarget.style.color = '#F56400')} onMouseLeave={e => (e.currentTarget.style.color = '#999')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8.559 3.074c0-.588.063-.588.965-.588h2.697c2.07 0 2.822.588 3.41 2.822l.378 1.323h.84l-.21-5.183H3.955l.042.798c1.176.042 1.596.252 1.596 1.764v15.96c0 1.512-.42 1.722-1.596 1.764l-.042.798h12.684l.63-5.562h-.84l-.378 1.512c-.63 2.52-1.386 2.948-3.834 2.948h-2.234c-.84 0-.924 0-.924-.588V12.68h1.806c1.512 0 2.016.378 2.352 2.142h.84V7.774h-.84c-.294 1.764-.84 2.142-2.352 2.142H8.559V3.074z"/></svg>
        </a>
        {/* Instagram */}
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: '#999', transition: 'color 0.15s' }} onMouseEnter={e => (e.currentTarget.style.color = '#E4405F')} onMouseLeave={e => (e.currentTarget.style.color = '#999')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
        </a>
        {/* Pinterest */}
        <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" style={{ color: '#999', transition: 'color 0.15s' }} onMouseEnter={e => (e.currentTarget.style.color = '#E60023')} onMouseLeave={e => (e.currentTarget.style.color = '#999')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>
        </a>
      </div>
    </div>
  </FooterWrapper>
  </FooterOuter>
);
