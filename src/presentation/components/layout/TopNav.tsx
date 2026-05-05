import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Settings, Home, Sparkles, ShoppingBag, LayoutGrid, LayoutTemplate, Calendar } from 'lucide-react';
import { useAuth } from '@/presentation/context/AuthContext';
import { useUpgradeModal } from '@/presentation/context/UpgradeModalContext';
import { media } from '@/presentation/themes/media';
import { useMediaQuery, MQ } from '@/presentation/themes/useMediaQuery';
import {
  Button,
  AccountPillWrap,
  AccountPill,
  PeachAvatar,
  PillChevron,
  AccountDropdown,
  DropdownUserRow,
  DropdownUserText,
  DropdownName,
  DropdownEmail,
  DropdownDivider,
  DropdownSpacer,
  DropdownMenuGroup,
  DropdownItem,
  ProPlanRow,
  ProPlanLabel,
  ProManageLink,
  UpgradeInner,
  UpgradePrice,
} from '@/presentation/components/shared';

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
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.hairline};
  height: 78px;
  padding-top: env(safe-area-inset-top, 0px);

  /* Mobile — slimmer nav (74, was 78). NavInner switches to vertical
     padding 0 + align-items:center so the logo / burger sit dead
     centre in the smaller bar. */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 74px;
  }
`;

const NavSpacer = styled.div`
  height: calc(71px + env(safe-area-inset-top, 0px));

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: calc(67px + env(safe-area-inset-top, 0px));
  }
`;

const NavInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px;
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;

  ${media.mobile`
    /* Drop the asymmetric vertical padding (was 16) — height: 100%
       + align-items: center already centers the row. Keeps content
       perfectly centered in the slimmer 74px nav. */
    padding: 0 20px;
  `}

  /* 641–770 — drop horizontal padding to 0 so the logo + burger
   * sit flush with viewport edges (the desktop 48 was crowding
   * the row). Per "паддинги у верхней навигации убери у 640-770". */
  @media (min-width: 641px) and (max-width: 770px) {
    padding: 0 20px;
  }
`;

const LogoRow = styled.div<{ $pressed?: boolean; $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: ${({ $disabled }) => $disabled ? 'default' : 'pointer'};
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease;
  transform: ${({ $pressed }) => $pressed ? 'scale(0.88)' : 'scale(1)'};
  opacity: ${({ $pressed }) => $pressed ? 0.4 : 1};
  transform-origin: left center;
  flex-shrink: 0;

  &:hover {
    opacity: ${({ $disabled }) => $disabled ? 1 : 0.8};
    transform: ${({ $disabled }) => $disabled ? 'scale(1)' : 'scale(0.98)'};
  }

  &:active {
    transform: ${({ $disabled }) => $disabled ? 'scale(1)' : 'scale(0.92)'};
    opacity: ${({ $disabled }) => $disabled ? 1 : 0.5};
    transition: transform 0.1s ease, opacity 0.1s ease;
  }
`;

const LogoText = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
  white-space: nowrap;
`;

const LogoSub = styled.span`
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
  flex-shrink: 0;

  /* Hide all the way through tablet (≤1024) — at 641–1024 the inline
   * row crowds against the auth/cart cluster on the right and the
   * burger version reads cleaner. Per "пусть в топ навигации будет
   * телефонная версия до размеров планшета". */
  ${media.tablet`
    display: none;
  `}
`;

const NavLink = styled.button<{ $active?: boolean }>`
  font-size: 13px;
  font-weight: ${({ $active }) => $active ? '500' : '400'};
  color: ${({ $active, theme }) => $active ? theme.colors.text.primary : theme.colors.text.body};
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.01em;
  transition: color ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
  &:hover { color: ${({ theme }) => theme.colors.text.primary}; }

  /* Tablet (641–820) — drop label size 13 → 12 to free the few pixels
   * needed for all four nav items + auth/cart at this width. */
  @media (min-width: 641px) and (max-width: 820px) {
    font-size: 12px;
  }
`;

/* ── Burger ── */
// 44×44 hit target on mobile (Apple HIG). Burger only renders on mobile,
// so the size is unconditional; visual icon stays 20×20.
const BurgerButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};

  svg { width: 20px; height: 20px; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

/* Backdrop behind the mobile menu. On phones (≤640) the menu is an
   edge-to-edge sheet so a dim+blur layer reads as a proper overlay.
   On wide-phone / tablet (641–1024) the menu is a small card pinned to
   the right; dimming the whole page there feels heavy, so the backdrop
   becomes an invisible click-catcher (no fill, no blur) — the page
   stays readable, only the menu floats over it. Tap still closes. */
const MobileMenuBackdrop = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 98;
  background: rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: ${fadeIn} 0.18s ease;

  @media (min-width: 641px) and (max-width: 1024px) {
    background: transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
`;

/* Edge-to-edge panel that slides down from under the nav — reads as a
   continuation of the navbar (page-like), not a floating card. Sticks
   to the viewport sides, only the bottom corners rounded so the seam
   with the nav stays flush. Soft drop shadow at the bottom edge gives
   it depth without competing with the page. NOT fullscreen — height is
   content-driven up to a viewport cap, with internal scroll. */
const MobileMenu = styled.div`
  position: fixed;
  top: calc(74px + env(safe-area-inset-top, 0px));
  left: 0;
  right: 0;
  z-index: 99;
  background: ${({ theme }) => theme.colors.background.elevated};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.hairline};
  border-radius: 0 0 ${({ theme }) => theme.radii.lg} ${({ theme }) => theme.radii.lg};
  box-shadow: 0 16px 32px -8px rgba(0,0,0,0.10);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 74px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px));
  animation: ${fadeIn} 0.2s cubic-bezier(0.22, 1, 0.36, 1);

  /* Wide-phone / tablet (641–1024) — burger is still showing, but the
   * viewport is wide enough that an edge-to-edge sheet feels wrong.
   * Anchor the panel to the right (under the burger) as a floating
   * card. Backdrop dim is suppressed at this breakpoint, so the card
   * earns its presence via a heavier shadow, a subtle backdrop-filter
   * on the card itself (blur the area behind ONLY the card, not the
   * page), and a slightly darker border so the edge stays crisp on
   * any underlying content. */
  @media (min-width: 641px) and (max-width: 1024px) {
    top: calc(74px + 8px + env(safe-area-inset-top, 0px));
    left: auto;
    right: 12px;
    width: 360px;
    max-width: calc(100vw - 24px);
    background: ${({ theme }) => theme.colors.background.elevated};
    border: 1px solid ${({ theme }) => theme.colors.border.medium};
    border-radius: ${({ theme }) => theme.radii.lg};
    box-shadow:
      0 2px 4px rgba(26, 22, 19, 0.06),
      0 16px 32px -8px rgba(26, 22, 19, 0.16),
      0 40px 72px -20px rgba(26, 22, 19, 0.22);
    backdrop-filter: blur(12px) saturate(140%);
    -webkit-backdrop-filter: blur(12px) saturate(140%);
    max-height: calc(100vh - 90px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px));
  }
`;

const MobileMenuScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 8px 12px;
`;

/* Identity row — compact strip. Tightened down so the avatar + name +
   email feel like a tidy header, not a hero. */
const MobileMenuIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 8px 14px;
`;

const MobileMenuIdentityText = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  /* Headline → subtitle gap pulled out into the column so it's a
     single source of truth — was a flaky margin-top on the email. */
  gap: 3px;
`;

const MobileMenuName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.015em;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MobileMenuEmail = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  letter-spacing: -0.005em;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/* Hairline divider — full-bleed inside the scroll padding so groups
   feel separated by structure, not by labels. Top margin shaved (4 vs
   8) so the divider lifts up closer to the welcome / identity block
   above. */
const MobileMenuDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border.hairline};
  margin: 4px 0 8px;
`;

/* Clean row — no icon bubble, no gradient, no chevron. Plain icon +
   label, subtle hover/active fill, minimal motion. Mirrors how Linear
   / Notion / Vercel handle nav lists on mobile. & + & adds a 4px
   vertical gap between consecutive rows so Templates/Widgets/etc don't
   feel mashed together (per c_dropdown-row-spacing). */
const MobileLink = styled.button<{ $active?: boolean; $danger?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 10px;
  & + & { margin-top: 4px; }
  font-size: 15px;
  font-weight: 500;
  color: ${({ $active, $danger, theme }) =>
    $danger ? theme.colors.danger.strong
    : $active ? theme.colors.text.primary
    : theme.colors.text.body};
  background: ${({ $active }) => $active ? 'rgba(0,0,0,0.04)' : 'none'};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.015em;
  text-align: left;
  transition: background 140ms ease;

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    color: ${({ $danger, theme }) => $danger ? theme.colors.danger.strong : theme.colors.text.tertiary};
    stroke-width: 1.75;
  }

  &:hover {
    background: ${({ $danger }) => $danger ? 'rgba(220, 40, 40, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
  }
`;

const MobileMenuFooter = styled.div<{ $bordered?: boolean }>`
  padding: 8px 12px calc(12px + env(safe-area-inset-bottom, 0px));
  /* Border only when there's content above worth separating from the
     CTAs (logged-in flow has account links right above). Guest flow
     already shows the Log in / Sign up directly under the nav links —
     a second hairline above the footer reads as a duplicate. */
  ${({ $bordered, theme }) => $bordered && `border-top: 1px solid ${theme.colors.border.hairline};`}
`;

/* ── Cart ── */

const CartButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all ${({ theme }) => theme.transitions.fast};

  svg { width: 18px; height: 18px; }

  &:hover { opacity: 0.7; }

  /* Mobile — hide entirely. Cart functionality is being removed from
   * the product (see project_no_cart memory); on phone we already
   * suppress the icon. Desktop kept untouched per the desktop-frozen
   * rule until cart is removed globally.
   * Comment c_mofyy4jr (2026-04-26): "у нас корзины вообще нигде нет удали". */
  ${media.mobile`
    display: none;
  `}
`;

const CartBadge = styled.span`
  position: absolute;
  top: 2px;
  right: 0px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  font-size: 11px;
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  border-radius: ${({ theme }) => theme.radii.full};
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

/* Desktop dropdown */
// Width clamps to viewport on narrow screens so the dropdown never
// overflows the right edge (was 320px fixed → broke on iPhone SE 375).
const CartDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: -16px;
  width: min(320px, calc(100vw - 24px));
  background: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.heavy};
  z-index: ${({ theme }) => theme.zIndex.popover};
  animation: ${fadeIn} 0.15s ease;
  overflow: hidden;
`;

/* Mobile bottom sheet */
const CartSheet = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 101;
  background: ${({ theme }) => theme.colors.background.elevated};
  border-top-left-radius: ${({ theme }) => theme.radii.xl};
  border-top-right-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.heavy};
  animation: ${slideUp} 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  max-height: 60vh;
  overflow-y: auto;
`;

const CartOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.3);
  animation: ${keyframes`from { opacity: 0; } to { opacity: 1; }`} 0.2s ease;
`;

const CartSheetHandle = styled.div`
  display: flex;
  justify-content: center;
  padding: 12px 0 4px;

  &::after {
    content: '';
    width: 36px;
    height: 4px;
    border-radius: 2px;
    background: ${({ theme }) => theme.colors.border.medium};
  }
`;

const CartHeader = styled.div`
  padding: 12px 16px 16px;
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CartItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  }
`;

const CartItemImage = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: linear-gradient(180deg, #FAFAFC 0%, #F6F6FA 50%, #F0F0F8 100%);
  overflow: hidden;
  flex-shrink: 0;
  position: relative;

  img {
    width: 80%;
    height: 80%;
    object-fit: contain;
    position: absolute;
    inset: 0;
    margin: auto;
  }
`;

const CartItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const CartItemTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CartItemPrice = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const CartRemoveBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.muted};
  border-radius: ${({ theme }) => theme.radii.sm};
  transition: all ${({ theme }) => theme.transitions.fast};
  flex-shrink: 0;

  svg { width: 14px; height: 14px; }

  &:hover {
    color: ${({ theme }) => theme.colors.danger.strong};
    background: rgba(220, 40, 40, 0.06);
  }
`;

const CartEmpty = styled.div`
  padding: 32px 16px;
  text-align: center;
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const CartFooter = styled.div`
  padding: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const CartTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CartTotalValue = styled.span`
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
`;

const CartWrap = styled.div`
  position: relative;
`;

const MobileRight = styled.div`
  display: none;
  align-items: center;
  gap: 4px;

  /* Show burger up through tablet (≤1024) — paired with NavLinks
   * being hidden in the same range. */
  ${media.tablet`
    display: flex;
  `}
`;

export const TopNav: React.FC<TopNavProps> = ({ logoPressed, onLogoClick, activeLink, logoSub = 'Studio' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn, user, logout, isPro, planLoading } = useAuth();
  const { open: openUpgrade } = useUpgradeModal();
  const isLanding = location.pathname === '/';

  // Click-outside for the avatar dropdown.
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (avatarOpen && avatarRef.current && !avatarRef.current.contains(target)) {
        setAvatarOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && avatarOpen) setAvatarOpen(false);
    };
    if (avatarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [avatarOpen]);

  const handleLogo = () => {
    setMenuOpen(false);
    if (isLanding) return; // Already on landing
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
        <LogoRow $pressed={logoPressed} $disabled={isLanding} onClick={handleLogo}>
          <img src="/PeachyLogo.png" alt="Logo" width="22" height="22" style={{ objectFit: 'contain' }} />
          <LogoText>Peachy <LogoSub>{logoSub}</LogoSub></LogoText>
        </LogoRow>
        <NavLinks>
          <NavLink $active={activeLink === 'templates'} onClick={() => navigate('/templates')}>Notion Templates</NavLink>
          <NavLink $active={activeLink === 'studio'} onClick={() => navigate('/widgets')}>Notion Widgets</NavLink>
          {/* Dashboard — top-level entry to /studio for logged-in users.
              Was previously hidden behind the avatar pill labeled
              "Dashboard"; that pill actually opens the profile menu, so
              clicking the label took 2 hops to reach the dashboard.
              Split per "когда нав баре сверху текст Dashboard - но по
              факту это профиль дропдаун" (c_2026-04-29). */}
          {isLoggedIn && (
            <NavLink $active={activeLink === 'dashboard'} onClick={() => navigate('/dashboard')}>Dashboard</NavLink>
          )}
          {/* Cart removed entirely per "корзины не будет, убери".
              Per project_no_cart memory. */}
          {isLoggedIn ? (
            <AccountPillWrap ref={avatarRef}>
              <AccountPill
                $open={avatarOpen}
                onClick={() => setAvatarOpen(v => !v)}
                aria-haspopup="menu"
                aria-expanded={avatarOpen}
              >
                <PeachAvatar $size={30} $fontSize={11}>
                  {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                </PeachAvatar>
                {/* Pill is now a pure profile menu — Dashboard moved to
                    its own NavLink above. No text label keeps the pill
                    compact (avatar + chevron only). */}
                <PillChevron $open={avatarOpen} />
              </AccountPill>

              {avatarOpen && (
                <AccountDropdown role="menu">
                  <DropdownUserRow>
                    <PeachAvatar $size={44} $fontSize={15}>
                      {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                    </PeachAvatar>
                    <DropdownUserText>
                      <DropdownName>{user?.name || 'User'}</DropdownName>
                      <DropdownEmail>{user?.email || ''}</DropdownEmail>
                    </DropdownUserText>
                  </DropdownUserRow>

                  <DropdownDivider />

                  {!planLoading && isPro && (
                    <ProPlanRow>
                      <ProPlanLabel>
                        <Sparkles fill="currentColor" strokeWidth={1.5} />
                        Pro plan
                      </ProPlanLabel>
                      <ProManageLink onClick={(e) => { e.preventDefault(); setAvatarOpen(false); navigate('/settings'); }}>
                        Manage
                      </ProManageLink>
                    </ProPlanRow>
                  )}

                  {!planLoading && !isPro && (
                    <Button
                      $variant="upgrade"
                      $size="md"
                      $fullWidth
                      onClick={() => { setAvatarOpen(false); openUpgrade(); }}
                      /* Slightly taller (42 vs 38), softer 12px radius,
                         tighter inner padding so the Sparkles + label +
                         price read as a balanced premium chip. */
                      style={{
                        justifyContent: 'space-between',
                        padding: '0 12px',
                        height: 42,
                        borderRadius: 12,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      <UpgradeInner>
                        <Sparkles fill="currentColor" strokeWidth={1.5} />
                        Upgrade to Pro
                      </UpgradeInner>
                      <UpgradePrice>$4/mo</UpgradePrice>
                    </Button>
                  )}

                  <DropdownSpacer />

                  {/* Dashboard moved to NavLinks as a top-level entry —
                      dropdown stays focused on account-only shortcuts:
                      Purchases (your past orders) + Settings + Logout.
                      Purchases deep-links into the dashboard's Purchases
                      tab via ?tab=purchases (StudioPage syncs tab state
                      with the search param). */}
                  <DropdownMenuGroup>
                    <DropdownItem onClick={() => { setAvatarOpen(false); navigate('/dashboard?tab=widgets'); }}>
                      <LayoutGrid />
                      My Widgets
                    </DropdownItem>
                    <DropdownItem onClick={() => { setAvatarOpen(false); navigate('/dashboard?tab=purchases'); }}>
                      <ShoppingBag />
                      Purchases
                    </DropdownItem>
                    <DropdownItem onClick={() => { setAvatarOpen(false); navigate('/settings'); }}>
                      <Settings />
                      Settings
                    </DropdownItem>
                  </DropdownMenuGroup>

                  <DropdownDivider />

                  <DropdownItem
                    $danger
                    onClick={async () => { setAvatarOpen(false); await logout(); navigate('/'); }}
                  >
                    <LogOut />
                    Log out
                  </DropdownItem>
                </AccountDropdown>
              )}
            </AccountPillWrap>
          ) : (
            <Button $variant="primary" $size="sm" onClick={() => navigate('/login')}>Log in</Button>
          )}
        </NavLinks>
        <MobileRight>
          <BurgerButton aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </BurgerButton>
        </MobileRight>
      </NavInner>
    </Nav>
    <NavSpacer />

    {/* Cart removed entirely per "корзины не будет" + project_no_cart. */}

    {menuOpen && (
      <>
        <MobileMenuBackdrop onClick={() => setMenuOpen(false)} />
        <MobileMenu role="menu">
          <MobileMenuScroll>
            {/* Top strip — identity for logged-in users, welcome copy
                for guests. Both sit in the same MobileMenuIdentity slot
                so the menu always opens with a "who you are / who you
                could be" anchor instead of jumping straight into nav. */}
            {!isLoggedIn && (
              <>
                <MobileMenuIdentity>
                  <MobileMenuIdentityText>
                    {/* Slightly larger + muted (tertiary) — reads as a
                        passive greeting, not an active heading. */}
                    <MobileMenuName style={{ fontSize: 16, color: 'rgba(0,0,0,0.7)', fontWeight: 500 }}>
                      Welcome to Peachy
                    </MobileMenuName>
                    <MobileMenuEmail>Sign in or create an account</MobileMenuEmail>
                  </MobileMenuIdentityText>
                </MobileMenuIdentity>
                <MobileMenuDivider />
              </>
            )}
            {isLoggedIn && (
              <>
                <MobileMenuIdentity>
                  <PeachAvatar $size={32} $fontSize={12}>
                    {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                  </PeachAvatar>
                  <MobileMenuIdentityText>
                    <MobileMenuName>{user?.name || 'User'}</MobileMenuName>
                    <MobileMenuEmail>{user?.email || ''}</MobileMenuEmail>
                  </MobileMenuIdentityText>
                  {/* Upgrade / Pro indicator — sits as a compact pill in
                      the same row as the avatar + name + email so the
                      identity strip carries the plan state inline,
                      without a second full-width Upgrade row below. */}
                  {!planLoading && !isPro && (
                    <Button
                      $variant="accent"
                      $size="sm"
                      onClick={() => { setMenuOpen(false); openUpgrade(); }}
                      style={{ flexShrink: 0, padding: '0 12px', gap: 6, fontSize: 13 }}
                    >
                      <Sparkles fill="currentColor" strokeWidth={1.5} style={{ width: 13, height: 13 }} />
                      Upgrade
                    </Button>
                  )}
                  {!planLoading && isPro && (
                    <ProManageLink
                      onClick={() => { setMenuOpen(false); navigate('/settings'); }}
                      style={{ flexShrink: 0 }}
                    >
                      Pro · Manage
                    </ProManageLink>
                  )}
                </MobileMenuIdentity>

                <MobileMenuDivider />
              </>
            )}

            {/* Public navigation — visible to everyone. Hairline divider
                between groups carries the structure, no labels needed. */}
            <MobileLink
              $active={activeLink === 'templates'}
              onClick={() => handleNav('/templates')}
            >
              <Calendar />
              Notion Templates
            </MobileLink>
            <MobileLink
              $active={activeLink === 'studio'}
              onClick={() => handleNav('/widgets')}
            >
              <LayoutTemplate />
              Notion Widgets
            </MobileLink>

            {/* Account shortcuts — only for logged-in users, mirrors the
                desktop dropdown's DropdownMenuGroup. */}
            {isLoggedIn && (
              <>
                <MobileMenuDivider />
                <MobileLink onClick={() => handleNav('/dashboard?tab=widgets')}>
                  <LayoutGrid />
                  My Widgets
                </MobileLink>
                <MobileLink onClick={() => handleNav('/dashboard?tab=purchases')}>
                  <ShoppingBag />
                  Purchases
                </MobileLink>
                <MobileLink onClick={() => handleNav('/settings')}>
                  <Settings />
                  Settings
                </MobileLink>
              </>
            )}
          </MobileMenuScroll>

          {/* Footer pinned outside the scroll area so logout / login is
              always reachable even on small viewports with long content. */}
          <MobileMenuFooter $bordered={isLoggedIn}>
            {isLoggedIn ? (
              <MobileLink
                $danger
                onClick={async () => { setMenuOpen(false); await logout(); navigate('/'); }}
              >
                <LogOut />
                Log out
              </MobileLink>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Button
                  $variant="primary"
                  $size="lg"
                  $fullWidth
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/login', { state: { signup: true } });
                  }}
                >
                  Create account
                </Button>
                <Button
                  $variant="secondary"
                  $size="lg"
                  $fullWidth
                  onClick={() => handleNav('/login')}
                >
                  Log in
                </Button>
              </div>
            )}
          </MobileMenuFooter>
        </MobileMenu>
      </>
    )}
    </>
  );
};
