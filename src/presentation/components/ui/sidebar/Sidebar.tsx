import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { ChevronRight, PanelLeftClose, Calendar, Clock, Image, ArrowLeft, LayoutGrid, Home, Settings, LogOut, ShoppingBag, Plus } from 'lucide-react';
import { CALENDAR_STYLES, CLOCK_STYLES, BOARD_STYLES } from '../widgetConfig';
import { useAuth } from '@/presentation/context/AuthContext';
import type { WidgetStyleConfig } from '../widgetConfig';

export type DashboardView = 'dashboard' | 'my-widgets' | 'templates' | 'purchases' | 'profile' | null;

interface SidebarProps {
  availableWidgets: string[];
  currentWidget: string;
  onWidgetChange: (type: string, style?: string) => void;
  onLogoClick?: () => void;
  logoPressed?: boolean;
  mobileOpen?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  dashboardView?: DashboardView;
  onDashboardViewChange?: (view: DashboardView) => void;
  /** Called when a widget category is expanded/collapsed in the sidebar */
  expandedCategory?: string | null;
  onCategoryToggle?: (category: string | null) => void;
}

/* ─── Sidebar Container ─── */

const SidebarContainer = styled.aside<{ $mobileOpen?: boolean; $collapsed?: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  width: ${({ $collapsed }) => $collapsed ? '64px' : '270px'};
  height: 100vh;
  background: ${({ theme }) => theme.colors.background.elevated};
  backdrop-filter: blur(20px);
  border-right: none;
  display: flex;
  flex-direction: column;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  transition: width ${({ theme }) => theme.transitions.base};
  overflow: visible;

  @media (max-width: 1024px) {
    width: ${({ $collapsed }) => $collapsed ? '56px' : '220px'};
  }

  @media (max-width: 768px) {
    width: 270px;
    transform: ${({ $mobileOpen }) => $mobileOpen ? 'translateX(0)' : 'translateX(-100%)'};
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    box-shadow: ${({ $mobileOpen }) => $mobileOpen ? '4px 0 20px rgba(0, 0, 0, 0.1)' : 'none'};
  }
`;

/* ─── Header ─── */

const SidebarHeader = styled.div<{ $collapsed?: boolean }>`
  padding: 24px ${({ $collapsed }) => $collapsed ? '10px' : '16px'} 0;
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => $collapsed ? 'center' : 'flex-start'};
  gap: 8px;
  border-bottom: none;
`;

const LogoText = styled.span<{ $collapsed?: boolean }>`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
  opacity: ${({ $collapsed }) => $collapsed ? 0 : 1};
  transition: opacity ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
  overflow: hidden;
  width: ${({ $collapsed }) => $collapsed ? '0' : 'auto'};
`;

const LogoSub = styled.span`
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const BackButton = styled.button`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.tertiary};
  flex-shrink: 0;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: rgba(0, 0, 0, 0.04);
    color: ${({ theme }) => theme.colors.text.primary};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const CollapseHeaderBtn = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: rgba(0, 0, 0, 0.04);
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.body};
  margin-left: auto;
  flex-shrink: 0;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.state.activeWash};
    color: ${({ theme }) => theme.colors.accent};
  }

  svg { width: 18px; height: 18px; }

  @media (min-width: 1025px) {
    display: none;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

/* ─── Nav Section ─── */

const NavSection = styled.nav<{ $collapsed?: boolean }>`
  flex: 1;
  padding: ${({ $collapsed }) => $collapsed ? '20px 0' : '16px 0'};
  overflow-y: auto;
  overflow-x: visible;
  display: flex;
  flex-direction: column;
  ${({ $collapsed }) => $collapsed && 'align-items: center;'}

  &::-webkit-scrollbar {
    width: 0;
  }
`;

const SectionLabel = styled.h2<{ $collapsed?: boolean }>`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-transform: uppercase;
  letter-spacing: -0.01em;
  margin: 0 0 18px 0;
  padding: 0 24px;
  opacity: ${({ $collapsed }) => $collapsed ? 0 : 1};
  height: ${({ $collapsed }) => $collapsed ? '0' : 'auto'};
  margin-bottom: ${({ $collapsed }) => $collapsed ? '0' : '18px'};
  overflow: hidden;
  transition: opacity ${({ theme }) => theme.transitions.fast}, height ${({ theme }) => theme.transitions.base}, margin ${({ theme }) => theme.transitions.base};

  &:nth-of-type(n+2) {
    margin-top: ${({ $collapsed }) => $collapsed ? '0' : '24px'};
    padding-top: ${({ $collapsed }) => $collapsed ? '0' : '24px'};
    border-top: ${({ $collapsed, theme }) => $collapsed ? 'none' : `1px solid ${theme.colors.border.light}`};
  }
`;

/* ─── Widget Category ─── */

const WidgetCategory = styled.div<{ $collapsed?: boolean }>`
  margin-bottom: ${({ $collapsed }) => $collapsed ? '10px' : '8px'};
  position: relative;
`;

const CategoryHeader = styled.button<{ $expanded: boolean; $muted?: boolean; $collapsed?: boolean; $hasActive?: boolean }>`
  width: ${({ $collapsed }) => $collapsed ? '44px' : 'calc(100% - 32px)'};
  margin: ${({ $collapsed }) => $collapsed ? '0 auto' : '0 16px'};
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => $collapsed ? 'center' : 'flex-start'};
  gap: ${({ $collapsed }) => $collapsed ? '0' : '12px'};
  padding: ${({ $collapsed }) => $collapsed ? '0' : '8px 12px'};
  height: ${({ $collapsed }) => $collapsed ? '44px' : 'auto'};
  background: ${({ $expanded }) => $expanded ? 'rgba(51, 132, 244, 0.04)' : 'transparent'};
  border: none;
  border-radius: ${({ $collapsed }) => $collapsed ? '10px' : '8px'};
  color: ${({ $expanded, $muted, theme }) => $expanded ? theme.colors.state.active : $muted ? theme.colors.text.body : theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: 500;
  line-height: 22px;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  font-family: inherit;
  letter-spacing: -0.01em;
  position: relative;

  &:hover {
    background: rgba(51, 132, 244, 0.04);
    color: ${({ theme }) => theme.colors.text.primary};
  }

  .chevron {
    margin-left: auto;
    transition: transform ${({ theme }) => theme.transitions.medium};
    transform: rotate(${({ $expanded }) => $expanded ? '90deg' : '0deg'});
    opacity: 0.25;
    width: 12px;
    height: 12px;
  }
`;

const CategoryText = styled.span<{ $collapsed?: boolean }>`
  opacity: ${({ $collapsed }) => $collapsed ? 0 : 1};
  transition: opacity ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
  overflow: hidden;
  width: ${({ $collapsed }) => $collapsed ? '0' : 'auto'};
`;

const CollapsedIconWrapper = styled.div<{ $hasActive?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ $hasActive }) => $hasActive && css`
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${({ theme }) => theme.colors.state.active};
    }
  `}
`;

const CategoryIcon = styled.div<{ $muted?: boolean; $active?: boolean }>`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $muted, $active, theme }) =>
    $active
      ? theme.colors.state.activeWash
      : $muted
        ? 'rgba(0, 0, 0, 0.04)'
        : 'linear-gradient(135deg, rgba(51, 132, 244, 0.08), rgba(91, 160, 247, 0.08))'};
  flex-shrink: 0;
  transition: all ${({ theme }) => theme.transitions.medium};

  svg {
    color: ${({ $muted, theme }) => $muted ? theme.colors.text.tertiary : theme.colors.state.active};
    width: 16px;
    height: 16px;
  }
`;

/* ─── Styles List (expanded mode) ─── */



/* ─── Tooltip ─── */

const Tooltip = styled.div`
  position: absolute;
  left: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
  background: ${({ theme }) => theme.colors.text.primary};
  color: ${({ theme }) => theme.colors.background.elevated};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: 500;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radii.sm};
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity ${({ theme }) => theme.transitions.fast};
  z-index: 1000;

  ${CategoryHeader}:hover & {
    opacity: 1;
  }
`;

/* ─── Account Nav Item ─── */

const AccountItem = styled.button<{ $active?: boolean; $collapsed?: boolean }>`
  width: ${({ $collapsed }) => $collapsed ? '44px' : 'calc(100% - 32px)'};
  margin: ${({ $collapsed }) => $collapsed ? '0 auto' : '0 16px'};
  height: ${({ $collapsed }) => $collapsed ? '44px' : '36px'};
  display: flex;
  align-items: center;
  gap: 10px;
  padding: ${({ $collapsed }) => $collapsed ? '0' : '0 12px'};
  justify-content: ${({ $collapsed }) => $collapsed ? 'center' : 'flex-start'};
  background: ${({ $active, theme }) => $active ? theme.colors.state.activeWash : 'transparent'};
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: ${({ $active }) => $active ? '500' : '400'};
  color: ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.text.body};
  letter-spacing: -0.01em;
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  margin-bottom: 2px;

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  &:hover {
    background: ${({ $active, theme }) => $active ? theme.colors.state.activeWash : 'rgba(0, 0, 0, 0.03)'};
    color: ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.text.primary};
  }
`;

const AccountItemLabel = styled.span<{ $collapsed?: boolean }>`
  opacity: ${({ $collapsed }) => $collapsed ? 0 : 1};
  width: ${({ $collapsed }) => $collapsed ? '0' : 'auto'};
  overflow: hidden;
  white-space: nowrap;
  transition: opacity ${({ theme }) => theme.transitions.fast};
`;

/* ─── Profile Footer ─── */

const ProfileFooter = styled.div<{ $collapsed?: boolean }>`
  padding: ${({ $collapsed }) => $collapsed ? '12px 10px' : '12px 16px'};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  flex-shrink: 0;
`;

const ProfileAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent}, #8B5CF6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: 600;
  cursor: pointer;
  flex-shrink: 0;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover { opacity: 0.85; }
`;

const ProfileInfo = styled.div`
  flex: 1;
  min-width: 0;
  cursor: pointer;
`;

const ProfileName = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProfileEmail = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.muted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProfilePopup = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 12px;
  right: 12px;
  background: #fff;
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.popover};
  padding: 6px;
  z-index: 100;
`;

const ProfilePopupItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.body};
  transition: all 0.1s ease;

  svg { width: 15px; height: 15px; }

  &:hover {
    background: rgba(0, 0, 0, 0.03);
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

/* ─── Popover (collapsed mode) ─── */

const popoverFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-4px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const PopoverOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 64px;
  right: 0;
  bottom: 0;
  z-index: 999;
`;

const PopoverContainer = styled.div<{ $top: number }>`
  position: fixed;
  left: 68px;
  top: ${({ $top }) => $top}px;
  background: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.popover};
  padding: 8px;
  min-width: 180px;
  z-index: 1000;
  animation: ${popoverFadeIn} 0.15s ease both;
`;

const PopoverTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.02em;
  padding: 4px 8px 8px;
`;

const PopoverItem = styled.button<{ $active: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: ${({ $active }) => $active ? 'rgba(51, 132, 244, 0.06)' : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.colors.state.active : theme.colors.text.primary};
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: ${({ $active }) => $active ? 500 : 400};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  text-align: left;
  font-family: inherit;
  letter-spacing: -0.01em;

  &:hover {
    background: rgba(51, 132, 244, 0.06);
    color: ${({ theme }) => theme.colors.accent};
  }

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    opacity: 0.5;
  }
`;

/* ─── Collapse Toggle ─── */

const CollapseToggle = styled.button<{ $collapsed?: boolean }>`
  width: ${({ $collapsed }) => $collapsed ? '36px' : 'calc(100% - 32px)'};
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => $collapsed ? 'center' : 'flex-start'};
  gap: 8px;
  padding: ${({ $collapsed }) => $collapsed ? '0' : '8px 12px'};
  height: 36px;
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: 400;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  font-family: inherit;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
    color: ${({ theme }) => theme.colors.text.primary};
  }

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    transition: transform ${({ theme }) => theme.transitions.base};
    transform: rotate(${({ $collapsed }) => $collapsed ? '180deg' : '0deg'});
  }
`;

const CollapseText = styled.span<{ $collapsed?: boolean }>`
  opacity: ${({ $collapsed }) => $collapsed ? 0 : 1};
  transition: opacity ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
  overflow: hidden;
  width: ${({ $collapsed }) => $collapsed ? '0' : 'auto'};
`;

/* ─── Category Popover Component ─── */

interface CategoryPopoverProps {
  title: string;
  styles: WidgetStyleConfig[];
  widgetType: string;
  currentWidget: string;
  onWidgetChange: (type: string, style?: string) => void;
  anchorTop: number;
  onClose: () => void;
}

const CategoryPopover: React.FC<CategoryPopoverProps> = ({
  title,
  styles,
  widgetType,
  currentWidget,
  onWidgetChange,
  anchorTop,
  onClose,
}) => {
  return (
    <>
      <PopoverOverlay onClick={onClose} />
      <PopoverContainer $top={anchorTop}>
        <PopoverTitle>{title}</PopoverTitle>
        {styles.map((s) => (
          <PopoverItem
            key={s.value}
            $active={currentWidget === `${widgetType}-${s.value}`}
            onClick={() => {
              onWidgetChange(widgetType, s.value);
            }}
          >
            <s.icon />
            {s.label}
          </PopoverItem>
        ))}
      </PopoverContainer>
    </>
  );
};

/* ─── Sidebar Component ─── */

export const Sidebar: React.FC<SidebarProps> = ({
  availableWidgets,
  currentWidget,
  onWidgetChange,
  onLogoClick,
  logoPressed,
  mobileOpen,
  collapsed,
  onToggleCollapse,
  dashboardView,
  onDashboardViewChange,
  expandedCategory,
  onCategoryToggle,
}) => {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const { isRegistered, user, logout } = useAuth();
  const [popover, setPopover] = useState<{
    type: string;
    title: string;
    styles: WidgetStyleConfig[];
    top: number;
  } | null>(null);

  const calendarRef = useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>;
  const clockRef = useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>;
  const boardRef = useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>;

  const openPopover = useCallback((
    type: string,
    title: string,
    styles: WidgetStyleConfig[],
    ref: React.RefObject<HTMLButtonElement>,
  ) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPopover({ type, title, styles, top: rect.top });
  }, []);

  const closePopover = useCallback(() => setPopover(null), []);

  // Close popover when collapsing/expanding
  useEffect(() => {
    setPopover(null);
  }, [collapsed]);

  // Esc closes popover
  useEffect(() => {
    if (!popover) return;
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') closePopover(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [popover, closePopover]);

  const handleCategoryClick = (
    key: string,
    title: string,
    styles: WidgetStyleConfig[],
    ref: React.RefObject<HTMLButtonElement>,
  ) => {
    if (collapsed) {
      if (popover?.type === key) {
        closePopover();
      } else {
        openPopover(key, title, styles, ref);
      }
    } else {
      // Toggle the external category panel
      onCategoryToggle?.(expandedCategory === key ? null : key);
    }
  };

  const handleLogoClick = () => {
    const confirmed = window.confirm('Leave Widget Studio? Unsaved changes may be lost.');
    if (!confirmed) return;
    if (onLogoClick) {
      onLogoClick();
    } else {
      navigate('/');
    }
  };

  const hasActiveStyle = (type: string, styles: WidgetStyleConfig[]) =>
    styles.some(s => currentWidget === `${type}-${s.value}`);

  const renderCategory = (
    key: string,
    title: string,
    Icon: React.FC,
    styles: WidgetStyleConfig[],
    ref: React.RefObject<HTMLButtonElement>,
  ) => {
    if (!availableWidgets.includes(key)) return null;

    const isExpanded = expandedCategory === key;
    const hasActive = hasActiveStyle(key, styles);

    return (
      <WidgetCategory key={key} $collapsed={collapsed}>
        <CategoryHeader
          ref={ref}
          $expanded={isExpanded}
          $collapsed={collapsed}
          $hasActive={hasActive}
          onClick={() => handleCategoryClick(key, title, styles, ref)}
        >
          <CollapsedIconWrapper $hasActive={collapsed ? hasActive : false}>
            <CategoryIcon $active={isExpanded || hasActive}>
              <Icon />
            </CategoryIcon>
          </CollapsedIconWrapper>
          <CategoryText $collapsed={collapsed}>{title}</CategoryText>
          {collapsed && <Tooltip>{title}</Tooltip>}
        </CategoryHeader>
      </WidgetCategory>
    );
  };

  return (
    <SidebarContainer $mobileOpen={mobileOpen} $collapsed={collapsed}>
      <SidebarHeader $collapsed={collapsed}>
        {collapsed ? (
          <CollapseHeaderBtn onClick={onToggleCollapse} title="Expand sidebar" style={{ margin: '0 auto' }}>
            <PanelLeftClose style={{ transform: 'rotate(180deg)' }} />
          </CollapseHeaderBtn>
        ) : (
          <>
            <BackButton onClick={handleLogoClick} title="Back">
              <ArrowLeft />
            </BackButton>
            <LogoText $collapsed={collapsed}>Peachy <LogoSub>Studio</LogoSub></LogoText>
            {onToggleCollapse && (
              <CollapseHeaderBtn onClick={onToggleCollapse} title="Collapse">
                <PanelLeftClose />
              </CollapseHeaderBtn>
            )}
          </>
        )}
      </SidebarHeader>

      <NavSection $collapsed={collapsed}>
        <WidgetCategory $collapsed={collapsed}>
          <CategoryHeader
            $expanded={dashboardView === 'dashboard'}
            $collapsed={collapsed}
            onClick={() => onDashboardViewChange?.('dashboard')}
          >
            <CategoryIcon $active={dashboardView === 'dashboard'}>
              <Home />
            </CategoryIcon>
            <CategoryText $collapsed={collapsed}>Dashboard</CategoryText>
            {collapsed && <Tooltip>Dashboard</Tooltip>}
          </CategoryHeader>
        </WidgetCategory>

        <WidgetCategory $collapsed={collapsed}>
          <CategoryHeader
            $expanded={dashboardView === 'my-widgets'}
            $collapsed={collapsed}
            onClick={() => onDashboardViewChange?.('my-widgets')}
          >
            <CategoryIcon $active={dashboardView === 'my-widgets'}>
              <Calendar />
            </CategoryIcon>
            <CategoryText $collapsed={collapsed}>Widgets</CategoryText>
            {collapsed && <Tooltip>Widgets</Tooltip>}
          </CategoryHeader>
        </WidgetCategory>

        <WidgetCategory $collapsed={collapsed}>
          <CategoryHeader
            $expanded={dashboardView === 'purchases'}
            $collapsed={collapsed}
            onClick={() => onDashboardViewChange?.('purchases')}
          >
            <CategoryIcon $active={dashboardView === 'purchases'}>
              <ShoppingBag />
            </CategoryIcon>
            <CategoryText $collapsed={collapsed}>Purchases</CategoryText>
            {collapsed && <Tooltip>Purchases</Tooltip>}
          </CategoryHeader>
        </WidgetCategory>

        <SectionLabel $collapsed={collapsed}>Account</SectionLabel>

        <WidgetCategory $collapsed={collapsed}>
          <CategoryHeader
            $expanded={dashboardView === 'profile'}
            $collapsed={collapsed}
            onClick={() => onDashboardViewChange?.('profile')}
          >
            <CategoryIcon $active={dashboardView === 'profile'}>
              <Settings />
            </CategoryIcon>
            <CategoryText $collapsed={collapsed}>Settings</CategoryText>
            {collapsed && <Tooltip>Settings</Tooltip>}
          </CategoryHeader>
        </WidgetCategory>
      </NavSection>

      {isRegistered && (
        <ProfileFooter $collapsed={collapsed}>
          <ProfileAvatar>
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
          </ProfileAvatar>
          {!collapsed && (
            <>
              <ProfileInfo>
                <ProfileName>{user?.name || 'User'}</ProfileName>
                <ProfileEmail>{user?.email || ''}</ProfileEmail>
              </ProfileInfo>
              <ProfilePopupItem onClick={async () => { await logout(); navigate('/'); }} style={{ marginLeft: 'auto', padding: '0 8px', background: 'none', border: 'none' }}>
                <LogOut />
              </ProfilePopupItem>
            </>
          )}
        </ProfileFooter>
      )}

    </SidebarContainer>
  );
};
