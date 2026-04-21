import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Trash2, LogOut, Settings, Home, ChevronDown, ArrowUpRight } from 'lucide-react';
import { useCart } from '@/presentation/context/CartContext';
import { useAuth } from '@/presentation/context/AuthContext';
import { useUpgradeModal } from '@/presentation/context/UpgradeModalContext';

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
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  height: 72px;
  padding-top: env(safe-area-inset-top, 0px);
`;

const NavSpacer = styled.div`
  height: calc(65px + env(safe-area-inset-top, 0px));
`;

const NavInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 46px;
  max-width: 1300px;
  height: 100%;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 16px 24px;
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
  white-space: nowrap;
  &:hover { color: ${({ theme }) => theme.colors.text.primary}; }
`;

const NavCTA = styled.button`
  height: 34px;
  padding: 0 16px;
  background: ${({ theme }) => theme.colors.text.primary};
  color: #ffffff;
  border: none;
  border-radius: ${({ theme }) => theme.radii.button};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.01em;
  transition: all ${({ theme }) => theme.transitions.base};
  white-space: nowrap;

  &:hover {
    background: #333;
    transform: translateY(-1px);
  }
`;

/* ── Burger ── */
const BurgerButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
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

const MobileMenu = styled.div`
  position: fixed;
  top: 57px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  padding: 16px 24px;
  animation: ${fadeIn} 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const MobileLink = styled.button<{ $active?: boolean }>`
  width: 100%;
  text-align: left;
  padding: 14px 16px;
  font-size: 15px;
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
  height: 48px;
  margin-top: 12px;
  background: ${({ theme }) => theme.colors.text.primary};
  color: #ffffff;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.01em;
  transition: all 0.2s ease;

  &:hover { background: #333; }
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
  font-size: 10px;
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  border-radius: ${({ theme }) => theme.radii.full};
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

/* Desktop dropdown */
const CartDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: -16px;
  width: 320px;
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
    color: ${({ theme }) => theme.colors.destructive};
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

const CartCheckoutBtn = styled.button`
  width: 100%;
  height: 44px;
  background: ${({ theme }) => theme.colors.text.primary};
  color: #fff;
  border: none;
  border-radius: ${({ theme }) => theme.radii.button};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  font-family: inherit;
  cursor: pointer;
  letter-spacing: -0.01em;
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover { background: #333; }
`;

const CartWrap = styled.div`
  position: relative;
`;

const MobileRight = styled.div`
  display: none;
  align-items: center;
  gap: 4px;

  @media (max-width: 768px) {
    display: flex;
  }
`;

export const TopNav: React.FC<TopNavProps> = ({ logoPressed, onLogoClick, activeLink, logoSub = 'Studio' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const { items, itemCount, removeItem } = useCart();
  const { isLoggedIn, user, logout, isPro, planLoading } = useAuth();
  const { open: openUpgrade } = useUpgradeModal();
  const isLanding = location.pathname === '/';
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  // Click-outside for the click-opened dropdowns (cart + account). Both open
  // on click now — account was hover-only before, which made the two menus
  // behave differently on desktop. Mobile cart uses a bottom sheet, which has
  // its own backdrop, so we skip the listener there.
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (cartOpen && cartRef.current && !cartRef.current.contains(target)) {
        setCartOpen(false);
      }
      if (avatarOpen && avatarRef.current && !avatarRef.current.contains(target)) {
        setAvatarOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (cartOpen) setCartOpen(false);
      if (avatarOpen) setAvatarOpen(false);
    };
    const needsListener = (cartOpen && !isMobile) || avatarOpen;
    if (needsListener) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [cartOpen, avatarOpen, isMobile]);

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

  const total = items.reduce((sum, item) => {
    const num = parseFloat(item.price.replace('$', ''));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const cartItems = (
    <>
      {items.length === 0 ? (
        <CartEmpty>Your cart is empty</CartEmpty>
      ) : (
        <>
          {items.map(item => (
            <CartItemRow key={item.id}>
              <CartItemImage>
                <img src={item.image} alt={item.title} />
              </CartItemImage>
              <CartItemInfo>
                <CartItemTitle>{item.title}</CartItemTitle>
                <CartItemPrice>{item.price}</CartItemPrice>
              </CartItemInfo>
              <CartRemoveBtn onClick={() => removeItem(item.id)} aria-label="Remove">
                <Trash2 />
              </CartRemoveBtn>
            </CartItemRow>
          ))}
          <CartFooter>
            <CartTotal>
              <span>Total</span>
              <CartTotalValue>{total === 0 ? 'Free' : `$${total.toFixed(2)}`}</CartTotalValue>
            </CartTotal>
            <CartCheckoutBtn onClick={() => { setCartOpen(false); navigate('/checkout'); }}>Checkout</CartCheckoutBtn>
          </CartFooter>
        </>
      )}
    </>
  );

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
          {itemCount > 0 && <CartWrap ref={cartRef}>
            <CartButton aria-label="Cart" onClick={() => setCartOpen(!cartOpen)}>
              <ShoppingCart />
              <CartBadge>{itemCount}</CartBadge>
            </CartButton>
            {cartOpen && (
              <CartDropdown>
                <CartHeader>Cart ({itemCount})</CartHeader>
                {cartItems}
              </CartDropdown>
            )}
          </CartWrap>}
          {isLoggedIn ? (
            <div ref={avatarRef} style={{ position: 'relative' }}>
              <div
                onClick={() => setAvatarOpen(v => !v)}
                role="button"
                aria-haspopup="menu"
                aria-expanded={avatarOpen}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setAvatarOpen(v => !v);
                  }
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  cursor: 'pointer',
                  padding: '5px 14px 5px 5px',
                  borderRadius: 24,
                  background: avatarOpen ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.02)',
                  border: 'none',
                  transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FFD4B8 0%, #FFB3A0 40%, #E8B4E3 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: '#fff',
                  flexShrink: 0, letterSpacing: '0.02em',
                  boxShadow: '0 2px 8px rgba(255, 160, 140, 0.28)',
                }}>
                  {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: avatarOpen ? '#1F1F1F' : '#666', transition: 'color 0.2s' }}>Dashboard</span>
                <ChevronDown style={{ width: 14, height: 14, color: '#bbb', transition: 'transform 0.2s', transform: avatarOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
              </div>
              {avatarOpen && (
                <>
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: -8, zIndex: 100,
                    background: '#fff', borderRadius: 18, border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.04)',
                    padding: 0, minWidth: 240, overflow: 'hidden',
                    animation: 'avatarDropIn 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}>
                    <style>{`@keyframes avatarDropIn { from { opacity: 0; transform: translateY(-10px) scale(0.92); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>

                    {/* User info — compact, no cheap inline pill anymore; Upgrade
                        lives as a proper first-class menu item below. */}
                    <div style={{
                      padding: '16px 16px 14px',
                      background: 'linear-gradient(135deg, rgba(237,228,255,0.3) 0%, rgba(232,237,255,0.2) 100%)',
                      borderBottom: '1px solid rgba(0,0,0,0.04)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #FFD4B8 0%, #FFB3A0 40%, #E8B4E3 100%)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
                          boxShadow: '0 2px 8px rgba(255, 160, 140, 0.28)',
                          letterSpacing: '0.02em',
                        }}>
                          {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#1F1F1F', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{user?.name || 'User'}</div>
                          <div style={{ fontSize: 11.5, color: '#8E8E93', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{user?.email || ''}</div>
                        </div>
                      </div>
                    </div>

                    {/* Pro users get a status badge instead of the upgrade CTA */}
                    {!planLoading && isPro && (
                      <div style={{ padding: '8px 8px 4px' }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px',
                          borderRadius: 10,
                          background: 'linear-gradient(135deg, #EEF0FF 0%, #E2E7FF 100%)',
                          border: '1px solid rgba(99, 102, 241, 0.18)',
                        }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 10px',
                            borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
                            textTransform: 'uppercase' as const,
                            color: '#fff', background: 'linear-gradient(135deg, #6366F1, #818CF8)',
                            boxShadow: '0 1px 4px rgba(99,102,241,0.25)',
                          }}>Pro</span>
                          <span style={{ fontSize: 12.5, fontWeight: 600, color: '#4F46E5' }}>Unlimited widgets</span>
                        </div>
                      </div>
                    )}

                    {/* Upgrade to Pro — headline CTA in the menu (hidden for Pro users and while plan loads) */}
                    {!planLoading && !isPro && <div style={{ padding: '8px 8px 4px' }}>
                      <button
                        onClick={() => { setAvatarOpen(false); openUpgrade(); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px',
                          border: '1px solid rgba(99, 102, 241, 0.18)', cursor: 'pointer',
                          background: 'linear-gradient(135deg, #EEF0FF 0%, #E2E7FF 100%)',
                          color: '#4F46E5', fontFamily: 'inherit', borderRadius: 10,
                          fontSize: 12.5, fontWeight: 600, letterSpacing: '-0.005em',
                          transition: 'transform 0.1s ease, box-shadow 0.15s ease, border-color 0.15s ease',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.36)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.16)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.18)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <ArrowUpRight style={{ width: 14, height: 14, strokeWidth: 2, color: '#6366F1', flexShrink: 0 }} />
                        <span style={{ flex: 1, textAlign: 'left' }}>Upgrade to Pro</span>
                        <span style={{
                          fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' as const,
                          color: '#6366F1', background: 'rgba(255,255,255,0.65)',
                          padding: '2px 6px', borderRadius: 4,
                        }}>$4/mo</span>
                      </button>
                    </div>}

                    {/* Menu items */}
                    <div style={{ padding: '4px 8px 8px' }}>
                      {[
                        { icon: Home, label: 'Dashboard', onClick: () => { setAvatarOpen(false); navigate('/studio'); } },
                        { icon: Settings, label: 'Settings', onClick: () => { setAvatarOpen(false); navigate('/settings'); } },
                      ].map(item => (
                        <button
                          key={item.label}
                          onClick={item.onClick}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 12px',
                            border: 'none', background: 'transparent', cursor: 'pointer',
                            fontSize: 13, fontWeight: 500, color: '#1F1F1F',
                            fontFamily: 'inherit', borderRadius: 9, transition: 'background 0.12s',
                            letterSpacing: '-0.005em',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.035)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <item.icon style={{ width: 15, height: 15, strokeWidth: 1.75, color: '#8E8E93', flexShrink: 0 }} />
                          {item.label}
                        </button>
                      ))}
                    </div>

                    <div style={{ height: 1, margin: '0 12px', background: 'rgba(0,0,0,0.04)' }} />

                    {/* Logout — soft red destructive hover. */}
                    <div style={{ padding: '8px 8px' }}>
                      <button
                        onClick={async () => { setAvatarOpen(false); await logout(); navigate('/'); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 12px',
                          border: 'none', background: 'transparent', cursor: 'pointer',
                          fontSize: 13, fontWeight: 500, color: '#8E8E93',
                          fontFamily: 'inherit', borderRadius: 9,
                          transition: 'background 0.12s, color 0.12s',
                          letterSpacing: '-0.005em',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'rgba(220, 60, 60, 0.08)';
                          e.currentTarget.style.color = '#C23B3B';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#8E8E93';
                        }}
                      >
                        <LogOut style={{ width: 15, height: 15, strokeWidth: 1.75, flexShrink: 0 }} />
                        Log out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <NavCTA onClick={() => navigate('/login')}>Log in</NavCTA>
          )}
        </NavLinks>
        <MobileRight>
          <CartButton aria-label="Cart" onClick={() => setCartOpen(!cartOpen)}>
            <ShoppingCart />
            {itemCount > 0 && <CartBadge>{itemCount}</CartBadge>}
          </CartButton>
          <BurgerButton aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </BurgerButton>
        </MobileRight>
      </NavInner>
    </Nav>
    <NavSpacer />

    {/* Mobile cart bottom sheet */}
    {cartOpen && isMobile && (
      <>
        <CartOverlay onClick={() => setCartOpen(false)} />
        <CartSheet>
          <CartSheetHandle />
          <CartHeader>Cart ({itemCount})</CartHeader>
          {cartItems}
        </CartSheet>
      </>
    )}

    {menuOpen && (
      <MobileMenu>
        <MobileLink $active={activeLink === 'templates'} onClick={() => handleNav('/templates')}>Notion Templates</MobileLink>
        <MobileLink $active={activeLink === 'studio'} onClick={() => handleNav('/widgets')}>Notion Widgets</MobileLink>
        <MobileCTA onClick={() => handleNav(isLoggedIn ? '/studio' : '/login')}>
          {isLoggedIn ? 'Studio' : 'Log in'}
        </MobileCTA>
      </MobileMenu>
    )}
    </>
  );
};
