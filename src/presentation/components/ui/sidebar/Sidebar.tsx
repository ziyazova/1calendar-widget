import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { ChevronRight, PanelLeftClose, Calendar, Clock, Image, ArrowLeft, LayoutGrid, ShoppingBag, Receipt, Settings, LogOut } from 'lucide-react';
import { CALENDAR_STYLES, CLOCK_STYLES, BOARD_STYLES } from '../widgetConfig';
import { useAuth } from '@/presentation/context/AuthContext';
import type { WidgetStyleConfig } from '../widgetConfig';

export type DashboardView = 'my-widgets' | 'templates' | 'purchases' | 'profile' | null;

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
}

/* ─── Sidebar Container ─── */

const SidebarContainer = styled.aside<{ $mobileOpen?: boolean; $collapsed?: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  width: ${({ $collapsed }) => $collapsed ? '64px' : '270px'};
  height: 100vh;
  background: #ffffff;
  backdrop-filter: blur(20px);
  border-right: none;
  display: flex;
  flex-direction: column;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  transition: width 0.25s ease;
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
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
  opacity: ${({ $collapsed }) => $collapsed ? 0 : 1};
  transition: opacity 0.15s ease;
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
  transition: all 0.15s ease;

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
  border-radius: ${({ theme }) => theme.radii.button};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-left: auto;
  flex-shrink: 0;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(51, 132, 244, 0.08);
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
  font-size: 11px;
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
  transition: opacity 0.15s ease, height 0.25s ease, margin 0.25s ease;

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

const CategoryHeader = styled.button<{ $expanded: boolean; $muted?: boolean; $collapsed?: boolean }>`
  width: ${({ $collapsed }) => $collapsed ? '44px' : 'calc(100% - 32px)'};
  margin: ${({ $collapsed }) => $collapsed ? '0 auto' : '0 16px'};
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => $collapsed ? 'center' : 'flex-start'};
  gap: ${({ $collapsed }) => $collapsed ? '0' : '12px'};
  padding: ${({ $collapsed }) => $collapsed ? '0' : '8px 12px'};
  height: ${({ $collapsed }) => $collapsed ? '44px' : 'auto'};
  background: transparent;
  border: none;
  border-radius: ${({ $collapsed }) => $collapsed ? '10px' : '8px'};
  color: ${({ $muted, theme }) => $muted ? theme.colors.text.secondary : '#1F1F1F'};
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
  letter-spacing: -0.01em;
  position: relative;

  &:hover {
    background: rgba(51, 132, 244, 0.04);
    color: ${({ $muted }) => $muted ? '#1F1F1F' : '#1F1F1F'};
  }

  .chevron {
    margin-left: auto;
    transition: transform 0.2s ease;
    transform: rotate(${({ $expanded }) => $expanded ? '90deg' : '0deg'});
    opacity: 0.25;
    width: 12px;
    height: 12px;
  }
`;

const CategoryText = styled.span<{ $collapsed?: boolean }>`
  opacity: ${({ $collapsed }) => $collapsed ? 0 : 1};
  transition: opacity 0.15s ease;
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
      background: #3384F4;
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
  background: ${({ $muted, $active }) =>
    $active
      ? 'rgba(51, 132, 244, 0.08)'
      : $muted
        ? 'rgba(0, 0, 0, 0.04)'
        : 'linear-gradient(135deg, rgba(51, 132, 244, 0.08), rgba(91, 160, 247, 0.08))'};
  flex-shrink: 0;
  transition: all 0.2s ease;

  svg {
    color: ${({ $muted, theme }) => $muted ? theme.colors.text.tertiary : '#3384F4'};
    width: 16px;
    height: 16px;
  }
`;

/* ─── Styles List (expanded mode) ─── */

const StylesList = styled.div<{ $expanded: boolean }>`
  display: grid;
  grid-template-rows: ${({ $expanded }) => $expanded ? '1fr' : '0fr'};
  overflow: hidden;
  transition: grid-template-rows 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
  padding: 0 16px;
  margin-left: 36px;
  position: relative;

  > div {
    min-height: 0;
    padding-top: 4px;
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 8px;
    bottom: 12px;
    width: 1px;
    background: ${({ theme }) => theme.colors.border.light};
    opacity: ${({ $expanded }) => $expanded ? 1 : 0};
    transition: opacity 0.2s ease;
  }
`;

const StyleItem = styled.button<{ $active: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${({ $active }) => $active ? 'rgba(51, 132, 244, 0.04)' : 'transparent'};
  color: ${({ $active }) => $active ? '#3384F4' : '#1F1F1F'};
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 13px;
  font-weight: ${({ $active }) => $active ? 500 : 400};
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
  margin-bottom: 2px;
  font-family: inherit;
  letter-spacing: -0.01em;

  &:hover {
    background: rgba(51, 132, 244, 0.04);
    color: ${({ theme }) => theme.colors.accent};
  }

  svg {
    width: 13px;
    height: 13px;
    flex-shrink: 0;
    opacity: 0.5;
  }
`;

/* ─── Tooltip ─── */

const Tooltip = styled.div`
  position: absolute;
  left: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
  background: ${({ theme }) => theme.colors.text.primary};
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease;
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
  background: ${({ $active }) => $active ? 'rgba(51, 132, 244, 0.08)' : 'transparent'};
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  font-weight: ${({ $active }) => $active ? '500' : '400'};
  color: ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.text.secondary};
  letter-spacing: -0.01em;
  transition: all 0.15s ease;
  position: relative;
  margin-bottom: 2px;

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  &:hover {
    background: ${({ $active }) => $active ? 'rgba(51, 132, 244, 0.08)' : 'rgba(0, 0, 0, 0.03)'};
    color: ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.text.primary};
  }
`;

const AccountItemLabel = styled.span<{ $collapsed?: boolean }>`
  opacity: ${({ $collapsed }) => $collapsed ? 0 : 1};
  width: ${({ $collapsed }) => $collapsed ? '0' : 'auto'};
  overflow: hidden;
  white-space: nowrap;
  transition: opacity 0.15s ease;
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
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  flex-shrink: 0;
  transition: opacity 0.15s ease;

  &:hover { opacity: 0.85; }
`;

const ProfileInfo = styled.div`
  flex: 1;
  min-width: 0;
  cursor: pointer;
`;

const ProfileName = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProfileEmail = styled.div`
  font-size: 11px;
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
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04);
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
  border-radius: 6px;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.secondary};
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
  background: #ffffff;
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04);
  padding: 8px;
  min-width: 180px;
  z-index: 1000;
  animation: ${popoverFadeIn} 0.15s ease both;
`;

const PopoverTitle = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.03em;
  padding: 4px 8px 8px;
`;

const PopoverItem = styled.button<{ $active: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: ${({ $active }) => $active ? 'rgba(51, 132, 244, 0.06)' : 'transparent'};
  color: ${({ $active }) => $active ? '#3384F4' : '#1F1F1F'};
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 13px;
  font-weight: ${({ $active }) => $active ? 500 : 400};
  cursor: pointer;
  transition: all 0.15s ease;
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
  border-radius: ${({ theme }) => theme.radii.button};
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: 13px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
    color: ${({ theme }) => theme.colors.text.primary};
  }

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    transition: transform 0.25s ease;
    transform: rotate(${({ $collapsed }) => $collapsed ? '180deg' : '0deg'});
  }
`;

const CollapseText = styled.span<{ $collapsed?: boolean }>`
  opacity: ${({ $collapsed }) => $collapsed ? 0 : 1};
  transition: opacity 0.15s ease;
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
}) => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(['calendar']);
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

  const toggle = (key: string) => {
    setExpandedSections(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

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
      toggle(key);
    }
  };

  const handleLogoClick = () => {
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

    const isExpanded = expandedSections.includes(key);
    const hasActive = hasActiveStyle(key, styles);

    return (
      <WidgetCategory key={key} $collapsed={collapsed}>
        <CategoryHeader
          ref={ref}
          $expanded={isExpanded}
          $collapsed={collapsed}
          onClick={() => handleCategoryClick(key, title, styles, ref)}
        >
          <CollapsedIconWrapper $hasActive={collapsed ? hasActive : false}>
            <CategoryIcon $active={collapsed && hasActive}>
              <Icon />
            </CategoryIcon>
          </CollapsedIconWrapper>
          <CategoryText $collapsed={collapsed}>{title}</CategoryText>
          {!collapsed && <ChevronRight className="chevron" />}
          {collapsed && <Tooltip>{title}</Tooltip>}
        </CategoryHeader>
        {!collapsed && (
          <StylesList $expanded={isExpanded}>
            <div>
              {styles.map((s) => (
                <StyleItem
                  key={s.value}
                  $active={currentWidget === `${key}-${s.value}`}
                  onClick={() => onWidgetChange(key, s.value)}
                >
                  <s.icon />
                  {s.label}
                </StyleItem>
              ))}
            </div>
          </StylesList>
        )}
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
            <LogoText $collapsed={collapsed}>Widget <LogoSub>Studio</LogoSub></LogoText>
            {onToggleCollapse && (
              <CollapseHeaderBtn onClick={onToggleCollapse} title="Collapse">
                <PanelLeftClose />
              </CollapseHeaderBtn>
            )}
          </>
        )}
      </SidebarHeader>

      <NavSection $collapsed={collapsed}>
        <SectionLabel $collapsed={collapsed}>Widgets</SectionLabel>
        {renderCategory('calendar', 'Calendar', Calendar, CALENDAR_STYLES, calendarRef)}
        {renderCategory('clock', 'Clock', Clock, CLOCK_STYLES, clockRef)}
        {renderCategory('board', 'Canvas', Image, BOARD_STYLES, boardRef)}

        {isRegistered && (
          <>
            <SectionLabel $collapsed={collapsed}>Account</SectionLabel>
            <AccountItem
              $active={dashboardView === 'my-widgets'}
              $collapsed={collapsed}
              onClick={() => onDashboardViewChange?.(dashboardView === 'my-widgets' ? null : 'my-widgets')}
            >
              <LayoutGrid />
              <AccountItemLabel $collapsed={collapsed}>My Widgets</AccountItemLabel>
            </AccountItem>
            <AccountItem
              $active={dashboardView === 'templates'}
              $collapsed={collapsed}
              onClick={() => onDashboardViewChange?.(dashboardView === 'templates' ? null : 'templates')}
            >
              <ShoppingBag />
              <AccountItemLabel $collapsed={collapsed}>Templates</AccountItemLabel>
            </AccountItem>
            <AccountItem
              $active={dashboardView === 'purchases'}
              $collapsed={collapsed}
              onClick={() => onDashboardViewChange?.(dashboardView === 'purchases' ? null : 'purchases')}
            >
              <Receipt />
              <AccountItemLabel $collapsed={collapsed}>Purchases</AccountItemLabel>
            </AccountItem>
          </>
        )}
      </NavSection>

      {isRegistered && (
        <ProfileFooter $collapsed={collapsed}>
          <ProfileAvatar onClick={() => setProfileOpen(!profileOpen)}>
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
          </ProfileAvatar>
          {!collapsed && (
            <ProfileInfo onClick={() => setProfileOpen(!profileOpen)}>
              <ProfileName>{user?.name || 'User'}</ProfileName>
              <ProfileEmail>{user?.email || ''}</ProfileEmail>
            </ProfileInfo>
          )}
          {profileOpen && (
            <ProfilePopup>
              <ProfilePopupItem onClick={() => { setProfileOpen(false); onDashboardViewChange?.('profile'); }}>
                <Settings /> Settings
              </ProfilePopupItem>
              <ProfilePopupItem onClick={async () => { await logout(); navigate('/'); }}>
              <LogOut /> Log out
            </ProfilePopupItem>
          </ProfilePopup>
        )}
      </ProfileFooter>
      )}

      {collapsed && popover && (
        <CategoryPopover
          title={popover.title}
          styles={popover.styles}
          widgetType={popover.type}
          currentWidget={currentWidget}
          onWidgetChange={onWidgetChange}
          anchorTop={popover.top}
          onClose={closePopover}
        />
      )}
    </SidebarContainer>
  );
};
