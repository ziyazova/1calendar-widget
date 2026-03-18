import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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
`;

const NavSpacer = styled.div`
  height: 57px;
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
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  transform: ${({ $pressed }) => $pressed ? 'scale(0.94)' : 'scale(1)'};
  opacity: ${({ $pressed }) => $pressed ? 0.6 : 1};
  &:hover { opacity: 0.7; }
`;

const LogoText = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #1F1F1F;
  letter-spacing: -0.02em;
`;

const LogoSub = styled.span`
  font-weight: 400;
  color: #9A9A9A;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

const NavLink = styled.button<{ $active?: boolean }>`
  font-size: 13px;
  font-weight: ${({ $active }) => $active ? '500' : '400'};
  color: ${({ $active }) => $active ? '#1F1F1F' : '#6B6B6B'};
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.01em;
  transition: color 0.15s ease;
  &:hover { color: #1F1F1F; }

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavCTA = styled.button`
  height: 34px;
  padding: 0 18px;
  background: #1F1F1F;
  color: #ffffff;
  border: none;
  border-radius: 10px;
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

export const TopNav: React.FC<TopNavProps> = ({ logoPressed, onLogoClick, activeLink, logoSub = 'Studio' }) => {
  const navigate = useNavigate();

  const handleLogo = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      navigate('/');
    }
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
          <NavLink $active={activeLink === 'studio'} onClick={() => navigate('/widgets')}>Notion Widgets</NavLink>
          <NavLink $active={activeLink === 'apps'}>Apps</NavLink>
          <NavLink $active={activeLink === 'community'}>Community</NavLink>
          <NavCTA>Log in</NavCTA>
        </NavLinks>
      </NavInner>
    </Nav>
    <NavSpacer />
    </>
  );
};
