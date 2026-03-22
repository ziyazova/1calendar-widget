import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface TopNavProps {
  logoPressed?: boolean;
  onLogoClick?: () => void;
  activeLink?: string;
  logoSub?: string;
}

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  padding-top: env(safe-area-inset-top, 0px);
`;

const NavSpacer = styled.div`
  height: calc(57px + env(safe-area-inset-top, 0px));
`;

const NavInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 48px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 16px 24px;
  }
`;

const LogoRow = styled.div<{ $pressed?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease;
  transform: ${({ $pressed }) => $pressed ? 'scale(0.88)' : 'scale(1)'};
  opacity: ${({ $pressed }) => $pressed ? 0.4 : 1};
  transform-origin: left center;

  &:hover {
    opacity: 0.8;
    transform: scale(0.98);
  }

  &:active {
    transform: scale(0.92);
    opacity: 0.5;
    transition: transform 0.1s ease, opacity 0.1s ease;
  }
`;

const LogoText = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
`;

const LogoSub = styled.span`
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.button<{ $active?: boolean }>`
  font-size: 13px;
  font-weight: ${({ $active }) => $active ? '500' : '400'};
  color: ${({ $active, theme }) => $active ? '#1F1F1F' : theme.colors.text.secondary};
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.01em;
  transition: color 0.15s ease;
  &:hover { color: ${({ theme }) => theme.colors.text.primary}; }
`;

const NavCTA = styled.button`
  height: 36px;
  padding: 0 18px;
  background: ${({ theme }) => theme.colors.text.primary};
  color: #ffffff;
  border: none;
  border-radius: ${({ theme }) => theme.radii.button};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.01em;
  transition: all 0.2s ease;

  &:hover {
    background: #3384F4;
    transform: translateY(-1px);
  }
`;

/* ── Burger ── */
const BurgerButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};

  svg { width: 20px; height: 20px; }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const MobileMenu = styled.div`
  display: none;
  position: fixed;
  top: 57px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  padding: 24px;
  animation: ${fadeIn} 0.2s ease;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`;

const MobileLink = styled.button<{ $active?: boolean }>`
  width: 100%;
  text-align: left;
  padding: 14px 16px;
  font-size: 16px;
  font-weight: ${({ $active }) => $active ? '600' : '400'};
  color: ${({ $active, theme }) => $active ? '#1F1F1F' : theme.colors.text.secondary};
  background: ${({ $active }) => $active ? 'rgba(0, 0, 0, 0.03)' : 'none'};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.01em;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.03);
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const MobileCTA = styled.button`
  width: 100%;
  height: 44px;
  margin-top: 16px;
  background: ${({ theme }) => theme.colors.text.primary};
  color: #ffffff;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.01em;
  transition: all 0.2s ease;

  &:hover { background: #333; }
`;

export const TopNav: React.FC<TopNavProps> = ({ logoPressed, onLogoClick, activeLink, logoSub = 'Studio' }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogo = () => {
    setMenuOpen(false);
    if (onLogoClick) {
      onLogoClick();
    } else {
      navigate('/');
    }
  };

  const handleNav = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <>
    <Nav>
      <NavInner>
        <LogoRow $pressed={logoPressed} onClick={handleLogo}>
          <img src="/PeachyLogo.png" alt="Logo" width="22" height="22" style={{ objectFit: 'contain' }} />
          <LogoText>Peachy <LogoSub>{logoSub}</LogoSub></LogoText>
        </LogoRow>
        <NavLinks>
          <NavLink $active={activeLink === 'templates'} onClick={() => navigate('/templates')}>Notion Templates</NavLink>
          <NavLink $active={activeLink === 'studio'} onClick={() => navigate('/widgets')}>Widget Studio</NavLink>
          <NavLink $active={activeLink === 'dev'} onClick={() => navigate('/dev')}>Design System</NavLink>
          <NavCTA>Log in</NavCTA>
        </NavLinks>
        <BurgerButton aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </BurgerButton>
      </NavInner>
    </Nav>
    <NavSpacer />
    {menuOpen && (
      <MobileMenu>
        <MobileLink $active={activeLink === 'templates'} onClick={() => handleNav('/templates')}>Notion Templates</MobileLink>
        <MobileLink $active={activeLink === 'studio'} onClick={() => handleNav('/widgets')}>Widget Studio</MobileLink>
        <MobileLink $active={activeLink === 'dev'} onClick={() => handleNav('/dev')}>Design System</MobileLink>
        <MobileCTA onClick={() => handleNav('/widgets')}>Log in</MobileCTA>
      </MobileMenu>
    )}
    </>
  );
};
