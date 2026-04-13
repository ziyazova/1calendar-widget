import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Copy, Check, Pencil, LayoutGrid, Grip, X, Menu, Palette, Settings2, Brush, Sliders, Save, Calendar, Clock, Image, ArrowLeft } from 'lucide-react';
import { Logger } from '../../infrastructure/services/Logger';
import { DIContainer } from '../../infrastructure/di/DIContainer';
import { Widget } from '../../domain/entities/Widget';
import { CalendarSettings } from '../../domain/value-objects/CalendarSettings';
import { ClockSettings } from '../../domain/value-objects/ClockSettings';
import { BoardSettings } from '../../domain/value-objects/BoardSettings';

type AnySettings = Partial<CalendarSettings | ClockSettings | BoardSettings>;
import { Sidebar } from '../components/ui/sidebar/Sidebar';
import { DashboardContent } from '../components/dashboard/DashboardViews';
import { WidgetDisplay } from '../components/layout/WidgetDisplay';
import { CustomizationPanel } from '../components/ui/forms/CustomizationPanel';
import { LayoutCheck } from '../components/layout/LayoutCheck';
import { useAuth } from '../context/AuthContext';
import { WidgetStorageService } from '../../infrastructure/services/WidgetStorageService';
import { StylePickerPanel } from '../components/ui/sidebar/StylePickerPanel';
import { CALENDAR_STYLES, CLOCK_STYLES, BOARD_STYLES } from '../components/ui/widgetConfig';

interface StudioPageProps {
  diContainer: DIContainer;
}

type ViewMode = 'editor' | 'layout-check';

const StudioContainer = styled.div<{ $transitioning?: boolean }>`
  display: flex;
  min-height: 100vh;
  background: #ffffff;
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  opacity: ${({ $transitioning }) => $transitioning ? 0 : 1};
  transition: opacity 0.4s ease;
`;

const WorkspaceContainer = styled.div`
  display: flex;
  flex: 1;
  height: 100vh;

  @media (max-width: 768px) {
    flex-direction: column;
    height: 100dvh;
  }
`;

const ContentArea = styled.div<{ $fullWidth?: boolean; $sidebarCollapsed?: boolean; $stylePanelOpen?: boolean; $editorOpen?: boolean }>`
  display: flex;
  flex: 1;
  gap: 0;
  padding: 0;
  overflow: hidden;
  margin-left: ${({ $sidebarCollapsed, $stylePanelOpen }) => {
    const sidebarW = $sidebarCollapsed ? 64 : 270;
    const panelW = $stylePanelOpen ? 280 : 0;
    return `${sidebarW + panelW}px`;
  }};
  margin-right: ${({ $fullWidth, $editorOpen }) => $fullWidth ? '0' : $editorOpen ? '290px' : '12px'};
  height: 100vh;
  transition: margin-left 0.35s cubic-bezier(0.22, 1, 0.36, 1), margin-right 0.35s cubic-bezier(0.22, 1, 0.36, 1);

  @media (max-width: 1024px) {
    margin-left: ${({ $sidebarCollapsed, $stylePanelOpen }) => {
      const sidebarW = $sidebarCollapsed ? 64 : 220;
      const panelW = $stylePanelOpen ? 260 : 0;
      return `${sidebarW + panelW}px`;
    }};
    margin-right: ${({ $fullWidth, $editorOpen }) => $fullWidth ? '0' : $editorOpen ? '240px' : '12px'};
  }

  @media (max-width: 768px) {
    margin-left: 0;
    margin-right: 0;
    flex-direction: column;
  }
`;

const widgetAreaAppear = keyframes`
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const WidgetArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(51, 132, 244, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 60% 80%, rgba(236, 72, 153, 0.05) 0%, transparent 50%),
    #F8F8F7;
  border-radius: ${({ theme }) => theme.radii['2xl']};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  box-shadow: none;
  margin: 24px 12px 12px 12px;
  animation: ${widgetAreaAppear} 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (max-width: 768px) {
    margin: 12px;
    border-radius: ${({ theme }) => theme.radii.xl};
  }

  @media (max-width: 768px) {
    height: auto;
    flex: 1;
    margin: 0;
    border-radius: 0;
    border: none;
    padding-bottom: 70px;
  }
`;


const DotGrid = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.16) 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
`;

const ZoomableWidget = styled.div<{ $zoom: number }>`
  --zoom: ${({ $zoom }) => $zoom};
  transform: scale(var(--zoom)) translateY(-48px);
  transform-origin: center center;
  transition: transform 0.15s ease;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.08)) drop-shadow(0 2px 6px rgba(0, 0, 0, 0.04));
  animation: appear 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.28s both;

  @keyframes appear {
    from { opacity: 0; transform: scale(var(--zoom)) translateY(-44px); }
    to { opacity: 1; transform: scale(var(--zoom)) translateY(-48px); }
  }

  @media (max-width: 768px) {
    transform: scale(0.85) translateY(-60px);
    animation: none;
    opacity: 1;
  }
`;

/* ── Floating Toolbar (Figma-style) ── */

const FloatingToolbar = styled.div`
  position: absolute;
  bottom: 56px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(24px);
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 8px 12px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
  z-index: 10;

  @media (max-width: 1024px) {
    bottom: 84px;
    padding: 6px 10px;
    border-radius: ${({ theme }) => theme.radii.md};
    max-width: 360px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const ToolbarDivider = styled.div`
  width: 1px;
  height: 28px;
  background: rgba(0, 0, 0, 0.08);
  margin: 0 8px;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const Tooltip = styled.span`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colors.text.primary};
  color: #fff;
  font-size: 11px;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.radii.sm};
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease, transform 0.15s ease;
  transform: translateX(-50%) translateY(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ToolbarButton = styled.button<{ $active?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: all 0.15s ease;
  background: ${({ $active }) => $active ? 'rgba(51, 132, 244, 0.12)' : 'transparent'};
  color: ${({ $active, theme }) => $active ? '#3384F4' : theme.colors.text.secondary};

  &:hover {
    background: ${({ $active }) => $active ? 'rgba(51, 132, 244, 0.15)' : 'rgba(0, 0, 0, 0.05)'};
    color: ${({ $active }) => $active ? '#3384F4' : '#1F1F1F'};
  }

  &:hover ${Tooltip} {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  &:active {
    transform: scale(0.92);
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;


const TopRightControls = styled.div`
  position: absolute;
  top: 32px;
  right: 32px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ZoomControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  background: #ffffff;
  border-radius: ${({ theme }) => theme.radii.md};
  height: 36px;
  padding: 0 4px;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  box-shadow: ${({ theme }) => theme.shadows.subtle};

  @media (max-width: 768px) {
    display: none;
  }
`;

const ZoomSlider = styled.input`
  width: 100px;
  height: 3px;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.12);
  outline: none;
  -webkit-appearance: none;
  margin: 0 4px;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #3384F4;
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(51, 132, 244, 0.3);
    transition: transform 0.1s ease;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.15);
  }
`;

const ZoomValueDivider = styled.div`
  width: 1px;
  height: 20px;
  background: rgba(0, 0, 0, 0.1);
  margin: 0 4px 0 8px;
`;

const ZoomValue = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-variant-numeric: tabular-nums;
  min-width: 42px;
  text-align: center;
  user-select: none;
  padding: 0 4px;
`;

const ZoomLabel = styled.span`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.secondary};
  user-select: none;
  cursor: pointer;
  padding: 0 10px;
  transition: color 0.15s ease;
  line-height: 36px;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const GridToggle = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  background: #ffffff;
  color: ${({ $active, theme }) => $active ? '#3384F4' : theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: ${({ theme }) => theme.shadows.subtle};

  &:hover {
    color: ${({ $active }) => $active ? '#3384F4' : '#1F1F1F'};
  }

  svg {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const EmbedUrlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const EmbedUrlInput = styled.input`
  width: 180px;
  height: 32px;
  padding: 0 12px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: rgba(0, 0, 0, 0.04);
  font-size: 11px;
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  color: ${({ theme }) => theme.colors.text.secondary};
  letter-spacing: -0.01em;
  outline: none;

  &:focus {
    background: rgba(0, 0, 0, 0.06);
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &::selection {
    background: rgba(51, 132, 244, 0.2);
  }
`;

const CopyButton = styled.button<{ $copied?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 36px;
  padding: 0 16px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 76px;
  background: ${({ $copied }) => $copied
    ? 'rgba(34, 197, 94, 0.12)'
    : 'linear-gradient(135deg, #3384F4, #5BA0F7)'};
  color: ${({ $copied }) => $copied ? '#16a34a' : '#fff'};

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: ${({ $copied }) => $copied
      ? 'none'
      : '0 2px 8px rgba(51, 132, 244, 0.3)'};
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const SaveBtn = styled.button<{ $saved?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 36px;
  padding: 0 14px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  flex-shrink: 0;
  background: ${({ $saved }) => $saved ? 'rgba(34, 197, 94, 0.12)' : '#1F1F1F'};
  color: ${({ $saved }) => $saved ? '#16a34a' : '#fff'};

  &:hover { opacity: 0.9; }
  &:active { transform: scale(0.95); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
  svg { width: 14px; height: 14px; }
`;

/* ── Mobile Controls ── */
const MobileTopBar = styled.div`
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #ffffff;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  z-index: 20;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileBarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  background: rgba(0, 0, 0, 0.04);
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;

  svg { width: 18px; height: 18px; }

  &:hover { background: rgba(0, 0, 0, 0.08); }
`;

const MobileBarTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
`;

const MobileOverlay = styled.div`
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 49;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileEmbedFloating = styled.div`
  display: none;
  position: absolute;
  top: 16px;
  left: 32px;
  right: 32px;
  z-index: 10;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileEmbedRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0 4px 0 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const MobileEmbedUrl = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  font-size: 11px;
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  color: ${({ theme }) => theme.colors.text.secondary};
  outline: none;
  text-overflow: ellipsis;
`;

const MobileCopyButton = styled.button<{ $copied: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 28px;
  padding: 0 10px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 500;
  font-family: inherit;
  white-space: nowrap;
  background: ${({ $copied }) => $copied ? 'rgba(34, 197, 94, 0.1)' : 'linear-gradient(135deg, #3384F4, #5BA0F7)'};
  color: ${({ $copied }) => $copied ? '#22C55E' : '#fff'};

  svg { width: 12px; height: 12px; }
`;

/* ── Mobile Bottom Tab Bar ── */
type MobileTab = 'content' | 'color' | 'style' | 'layout' | null;

const MobileTabBar = styled.div`
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  padding: 8px 0;
  padding-bottom: calc(8px + env(safe-area-inset-bottom));
  z-index: 52;

  @media (max-width: 768px) {
    display: flex;
    justify-content: space-around;
  }
`;

const MobileTabButton = styled.button<{ $active?: boolean; $disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 60px;
  height: 52px;
  background: none;
  border: none;
  cursor: ${({ $disabled }) => $disabled ? 'default' : 'pointer'};
  border-radius: 14px;
  transition: all 0.15s ease;
  color: ${({ $active, $disabled, theme }) => $disabled ? theme.colors.text.muted : $active ? '#3384F4' : theme.colors.text.tertiary};
  opacity: ${({ $disabled }) => $disabled ? 0.6 : 1};
  pointer-events: ${({ $disabled }) => $disabled ? 'none' : 'auto'};

  ${({ $active }) => $active && `
    background: rgba(51, 132, 244, 0.08);
    color: #3384F4;
  `}

  &:hover {
    background: ${({ $disabled }) => $disabled ? 'none' : 'rgba(51, 132, 244, 0.05)'};
    color: ${({ $disabled, theme }) => $disabled ? theme.colors.text.muted : '#3384F4'};
  }

  svg { width: 20px; height: 20px; }
`;

const MobileTabLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  letter-spacing: -0.01em;
`;

const MobileSheet = styled.div<{ $open: boolean }>`
  display: none;
  position: fixed;
  bottom: calc(60px + env(safe-area-inset-bottom));
  left: 0;
  right: 0;
  max-height: 60vh;
  background: #ffffff;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.08);
  z-index: 51;
  transform: ${({ $open }) => $open ? 'translateY(0)' : 'translateY(100%)'};
  transition: transform 0.45s cubic-bezier(0.32, 0.72, 0, 1);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    display: block;
    padding-bottom: 16px;
    overscroll-behavior: contain;
    touch-action: pan-y;
  }
`;

const MobileSheetTop = styled.div`
  position: sticky;
  top: 0;
  background: #ffffff;
  z-index: 2;
  border-radius: 20px 20px 0 0;
  touch-action: none;
`;

const MobileSheetHandleArea = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 0;
  cursor: grab;
  touch-action: none;
`;

const MobileSheetHandle = styled.div`
  width: 40px;
  height: 5px;
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.15);
`;

const MobileSheetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px 18px;
`;

const MobileSheetTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
`;

const MobileSheetClose = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: rgba(0, 0, 0, 0.04);
  color: ${({ theme }) => theme.colors.text.tertiary};
  cursor: pointer;

  svg { width: 14px; height: 14px; }

  &:hover { background: rgba(0, 0, 0, 0.08); }
`;

const LayoutCheckArea = styled.div`
  flex: 1;
  height: 100vh;
  overflow: hidden;
  background: #ffffff;
  position: relative;
`;

/* ── Type Picker (Create New Widget) ── */
const typeCardAppear = keyframes`
  from { opacity: 0; transform: translateY(16px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const TypePickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 48px 24px;
  text-align: center;
`;

const TypePickerTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  margin: 0 0 8px;
  animation: ${typeCardAppear} 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
`;

const TypePickerSubtitle = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0 0 40px;
  letter-spacing: -0.01em;
  animation: ${typeCardAppear} 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both;
`;

const TypePickerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 560px;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 280px;
    gap: 14px;
  }
`;

const TypePickerCard = styled.div<{ $index: number; $gradient: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 20px 28px;
  background: ${({ $gradient }) => $gradient};
  border: 1.5px solid rgba(200, 195, 230, 0.2);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  animation: ${typeCardAppear} 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${({ $index }) => 0.1 + $index * 0.08}s both;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(200, 195, 230, 0.4);
    box-shadow: 0 12px 32px rgba(130, 120, 200, 0.12), 0 4px 12px rgba(130, 120, 200, 0.06);
  }

  &:active {
    transform: translateY(-2px) scale(0.98);
  }
`;

const TypePickerCardIcon = styled.div<{ $color: string }>`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  svg {
    width: 24px;
    height: 24px;
    color: ${({ $color }) => $color};
    stroke-width: 1.8;
  }
`;

const TypePickerCardLabel = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
`;

const TypePickerCardDesc = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  line-height: 1.4;
  margin-top: -8px;
`;

const StylePickerBackBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text.tertiary};
  padding: 0;
  margin-bottom: 8px;
  transition: color 0.15s ease;

  &:hover { color: ${({ theme }) => theme.colors.text.primary}; }
  svg { width: 14px; height: 14px; }
`;

const StylePickerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  max-width: 640px;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

const StylePickerCard = styled.div<{ $index: number; $gradient: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 28px 16px 24px;
  background: ${({ $gradient }) => $gradient};
  border: 1.5px solid rgba(200, 195, 230, 0.2);
  border-radius: 18px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  animation: ${typeCardAppear} 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${({ $index }) => 0.08 + $index * 0.06}s both;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(200, 195, 230, 0.4);
    box-shadow: 0 8px 24px rgba(130, 120, 200, 0.1);
  }

  &:active {
    transform: translateY(-1px) scale(0.98);
  }
`;

const StylePickerCardIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);

  svg {
    width: 22px;
    height: 22px;
    color: ${({ $color }) => $color};
    stroke-width: 1.8;
  }
`;

const STYLE_GRADIENTS: Record<string, { gradient: string; accent: string }> = {
  calendar: { gradient: 'linear-gradient(135deg, rgba(237,228,255,0.5) 0%, rgba(232,237,255,0.4) 50%, rgba(245,235,250,0.45) 100%)', accent: '#6366F1' },
  clock: { gradient: 'linear-gradient(135deg, rgba(232,237,255,0.5) 0%, rgba(220,235,255,0.4) 50%, rgba(237,228,255,0.45) 100%)', accent: '#3384F4' },
  board: { gradient: 'linear-gradient(135deg, rgba(255,240,245,0.5) 0%, rgba(252,228,236,0.4) 50%, rgba(237,228,255,0.45) 100%)', accent: '#EC4899' },
};

const WIDGET_TYPES = [
  {
    key: 'calendar',
    label: 'Calendar',
    desc: 'Monthly & weekly views',
    icon: Calendar,
    gradient: 'linear-gradient(135deg, rgba(237,228,255,0.5) 0%, rgba(232,237,255,0.4) 50%, rgba(245,235,250,0.45) 100%)',
    accentColor: '#6366F1',
  },
  {
    key: 'clock',
    label: 'Clock',
    desc: 'Analog & digital displays',
    icon: Clock,
    gradient: 'linear-gradient(135deg, rgba(232,237,255,0.5) 0%, rgba(220,235,255,0.4) 50%, rgba(237,228,255,0.45) 100%)',
    accentColor: '#3384F4',
  },
  {
    key: 'board',
    label: 'Board',
    desc: 'Moodboards & canvases',
    icon: Image,
    gradient: 'linear-gradient(135deg, rgba(255,240,245,0.5) 0%, rgba(252,228,236,0.4) 50%, rgba(237,228,255,0.45) 100%)',
    accentColor: '#EC4899',
  },
];

export const StudioPage: React.FC<StudioPageProps> = ({ diContainer }) => {
  const [currentWidget, setCurrentWidget] = useState<Widget | null>(null);
  const [currentWidgetKey, setCurrentWidgetKey] = useState<string>('calendar-modern-grid-zoom-fixed');
  const [availableWidgets, setAvailableWidgets] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const [studioZoom, setStudioZoom] = useState(1.0);
  const [showGrid, setShowGrid] = useState(false);
  const [copied, setCopied] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [mobilePanel, setMobilePanel] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null);
  const [editingWidgetName, setEditingWidgetName] = useState<string>('');
  const [stylePanel, setStylePanel] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showStylePicker, setShowStylePicker] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isRegistered } = useAuth();
  const [dashboardView, setDashboardView] = useState<import('../components/ui/sidebar/Sidebar').DashboardView>('dashboard');

  const handleLogoClick = useCallback(() => {
    setTransitioning(true);
    setTimeout(() => navigate('/'), 400);
  }, [navigate]);

  useEffect(() => {
    const types = diContainer.listAvailableWidgetsUseCase.execute();
    setAvailableWidgets(types);

    if (types.includes('calendar')) {
      createWidgetWithStyle('calendar', 'modern-grid-zoom-fixed');
    }
  }, [diContainer]);

  const createWidgetWithStyle = async (type: string, style: string) => {
    try {
      const widget = await diContainer.createWidgetUseCase.execute(type);

      let updatedWidget;
      if (type === 'calendar') {
        const settings = new CalendarSettings({ style: style as CalendarSettings['style'] });
        updatedWidget = await diContainer.updateWidgetUseCase.execute(widget.id, settings);
      } else if (type === 'board') {
        const settings = new BoardSettings({ layout: style as BoardSettings['layout'] });
        updatedWidget = await diContainer.updateWidgetUseCase.execute(widget.id, settings);
      } else {
        const settings = new ClockSettings({ style: style as 'modern' | 'analog-classic' });
        updatedWidget = await diContainer.updateWidgetUseCase.execute(widget.id, settings);
      }

      setCurrentWidget(updatedWidget);
      setCurrentWidgetKey(`${type}-${style}`);
    } catch (error) {
      Logger.error('StudioPage', 'Failed to create widget with style', error);
    }
  };

  const handleWidgetChange = async (type: string, style?: string) => {
    if (style) {
      await createWidgetWithStyle(type, style);
    } else {
      try {
        const widget = await diContainer.createWidgetUseCase.execute(type);
        setCurrentWidget(widget);
        setCurrentWidgetKey(type);
      } catch (error) {
        Logger.error('StudioPage', 'Failed to create widget', error);
      }
    }
  };

  const handleSettingsChange = async (newSettings: AnySettings) => {
    if (!currentWidget) return;

    try {
      const updatedWidget = await diContainer.updateWidgetUseCase.execute(
        currentWidget.id,
        newSettings
      );
      setCurrentWidget(updatedWidget);
    } catch (error) {
      Logger.error('StudioPage', 'Failed to update widget', error);
    }
  };

  const embedUrl = currentWidget
    ? diContainer.getWidgetEmbedUrlUseCase.execute(currentWidget)
    : '';

  const handleCopyEmbedUrl = () => {
    if (!currentWidget || !embedUrl) return;

    navigator.clipboard.writeText(embedUrl)
      .then(() => {
        Logger.info('StudioPage', 'Embed URL copied to clipboard');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => Logger.error('StudioPage', 'Failed to copy embed URL', err));
  };

  const handleSaveWidget = useCallback(async () => {
    if (!currentWidget || !isRegistered || saving) return;
    setSaving(true);
    try {
      const [type, ...styleParts] = currentWidgetKey.split('-');
      const style = styleParts.join('-');
      const settings = JSON.parse(JSON.stringify(currentWidget.settings));

      if (editingWidgetId) {
        await WidgetStorageService.updateWidget(editingWidgetId, {
          settings: settings as Record<string, unknown>,
          embed_url: embedUrl || undefined,
        });
      } else {
        const saved = await WidgetStorageService.saveWidget({
          name: editingWidgetName || `${currentWidget.type.charAt(0).toUpperCase() + currentWidget.type.slice(1)} Widget`,
          type,
          style,
          settings: settings as Record<string, unknown>,
          embed_url: embedUrl || undefined,
        });
        if (saved) setEditingWidgetId(saved.id);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      Logger.error('StudioPage', 'Failed to save widget', err);
    } finally {
      setSaving(false);
    }
  }, [currentWidget, currentWidgetKey, embedUrl, isRegistered, saving, editingWidgetId, editingWidgetName]);

  // Determine which mobile tabs are available for current widget
  const isBoard = currentWidget?.type === 'board';
  const calStyle = currentWidget?.type === 'calendar' ? (currentWidget.settings as CalendarSettings).style : '';
  const clkStyle = currentWidget?.type === 'clock' ? (currentWidget.settings as ClockSettings).style : '';
  const isCollageStyle = calStyle === 'collage' || calStyle === 'typewriter' || clkStyle === 'flower';
  const hasStyle = isBoard || clkStyle === 'flower'; // only flower clock and board have Style presets
  const hasColor = !isBoard;
  const hasLayout = !isBoard && !isCollageStyle;

  return (
    <StudioContainer $transitioning={transitioning}>
      <WorkspaceContainer>
        <div style={{ position: 'relative', zIndex: mobileSidebar ? 50 : undefined }}>
          <Sidebar
            availableWidgets={availableWidgets}
            currentWidget={currentWidgetKey}
            onWidgetChange={(type, style) => { setDashboardView(null); handleWidgetChange(type, style); setMobileSidebar(false); }}
            onLogoClick={handleLogoClick}
            logoPressed={transitioning}
            mobileOpen={mobileSidebar}
            collapsed={window.innerWidth > 768 && window.innerWidth <= 1024 ? sidebarCollapsed : false}
            onToggleCollapse={window.innerWidth > 768 && window.innerWidth <= 1024 ? () => setSidebarCollapsed(!sidebarCollapsed) : undefined}
            dashboardView={dashboardView}
            onDashboardViewChange={(v) => {
              setDashboardView(v);
              setStylePanel(null);
              if (v) {
                setEditorOpen(false);
                setShowTypePicker(false);
                setShowStylePicker(null);
              } else {
                // "Widgets" clicked — show editor if widget exists, or type picker
                if (currentWidget) {
                  setEditorOpen(true);
                } else {
                  setShowTypePicker(true);
                }
              }
            }}
            expandedCategory={stylePanel}
            onCategoryToggle={() => {}}
          />
          {stylePanel && (() => {
            const stylesMap: Record<string, { styles: typeof CALENDAR_STYLES; label: string }> = {
              calendar: { styles: CALENDAR_STYLES, label: 'Calendar' },
              clock: { styles: CLOCK_STYLES, label: 'Clock' },
              board: { styles: BOARD_STYLES, label: 'Canvas' },
            };
            const cfg = stylesMap[stylePanel];
            if (!cfg) return null;
            return (
              <StylePickerPanel
                styles={cfg.styles}
                widgetType={stylePanel}
                categoryLabel={cfg.label}
                currentWidget={currentWidgetKey}
                canEdit={true}
                onWidgetChange={(type, style) => { setDashboardView(null); handleWidgetChange(type, style); }}
                onEdit={async (type, style, name) => {
                  handleWidgetChange(type, style);
                  setDashboardView(null);
                  setStylePanel(null);
                  setEditingWidgetName(name);
                  // Save to DB immediately
                  const saved = await WidgetStorageService.saveWidget({
                    name,
                    type,
                    style,
                    settings: {},
                    embed_url: undefined,
                  });
                  if (saved) setEditingWidgetId(saved.id);
                  setTimeout(() => setEditorOpen(true), 250);
                }}
                onLockedEdit={() => navigate('/login')}
                onClose={() => {
                  setStylePanel(null);
                  if (!editorOpen && !editingWidgetId) {
                    setShowTypePicker(true);
                  }
                }}
              />
            );
          })()}
        </div>
        {mobileSidebar && <MobileOverlay onClick={() => setMobileSidebar(false)} />}

        <MobileTopBar>
          <MobileBarButton aria-label="Open menu" onClick={() => { const next = !mobileSidebar; setMobileSidebar(next); if (next) setMobileTab(null); }}>
            <Menu />
          </MobileBarButton>
          <MobileBarTitle>Studio</MobileBarTitle>
          <div style={{ width: 40 }} />
        </MobileTopBar>

        <ContentArea $fullWidth={viewMode === 'layout-check' || (!!dashboardView && !stylePanel)} $sidebarCollapsed={sidebarCollapsed} $stylePanelOpen={!!stylePanel} $editorOpen={editorOpen}>
          {dashboardView ? (
            <WidgetArea style={{ overflow: 'auto', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
              <DashboardContent
                view={dashboardView}
                onNavigate={(v) => setDashboardView(v)}
                onAddNew={() => {
                  setDashboardView(null);
                  setShowTypePicker(true);
                  setStylePanel(null);
                  setEditorOpen(false);
                }}
                onCreateType={(type) => {
                  const defaultStyle = type === 'calendar' ? 'modern-grid-zoom-fixed' : type === 'clock' ? 'classic' : 'grid';
                  createWidgetWithStyle(type, defaultStyle);
                  setDashboardView(null);
                  setShowTypePicker(false);
                  setShowStylePicker(null);
                  setStylePanel(null);
                  setEditorOpen(true);
                }}
                onEditWidget={(w) => {
                  handleWidgetChange(w.type, w.style);
                  setDashboardView(null);
                  setStylePanel(null);
                  setEditorOpen(true);
                  setEditingWidgetId(w.id);
                }}
              />
            </WidgetArea>
          ) : viewMode === 'editor' ? (
            <>
              <WidgetArea onClick={() => { if (mobileTab) setMobileTab(null); if (window.innerWidth <= 1024 && !sidebarCollapsed) setSidebarCollapsed(true); }}>
                {showTypePicker ? (
                  <TypePickerContainer>
                    <TypePickerTitle>What would you like to create?</TypePickerTitle>
                    <TypePickerSubtitle>Choose a widget type to get started</TypePickerSubtitle>
                    <TypePickerGrid>
                      {WIDGET_TYPES.map((wt, i) => (
                        <TypePickerCard
                          key={wt.key}
                          $index={i}
                          $gradient={wt.gradient}
                          onClick={() => {
                            setShowTypePicker(false);
                            setShowStylePicker(null);
                            const defaultStyle = wt.key === 'calendar' ? 'modern-grid-zoom-fixed' : wt.key === 'clock' ? 'classic' : 'grid';
                            createWidgetWithStyle(wt.key, defaultStyle);
                            setEditorOpen(true);
                          }}
                        >
                          <TypePickerCardIcon $color={wt.accentColor}>
                            <wt.icon />
                          </TypePickerCardIcon>
                          <TypePickerCardLabel>{wt.label}</TypePickerCardLabel>
                          <TypePickerCardDesc>{wt.desc}</TypePickerCardDesc>
                        </TypePickerCard>
                      ))}
                    </TypePickerGrid>
                  </TypePickerContainer>
                ) : showStylePicker ? (
                  <TypePickerContainer>
                    <StylePickerBackBtn onClick={() => { setShowStylePicker(null); setShowTypePicker(true); }}>
                      <ArrowLeft /> Back
                    </StylePickerBackBtn>
                    <TypePickerTitle>Choose a style</TypePickerTitle>
                    <TypePickerSubtitle>
                      {showStylePicker === 'calendar' ? 'Calendar' : showStylePicker === 'clock' ? 'Clock' : 'Board'} styles
                    </TypePickerSubtitle>
                    <StylePickerGrid>
                      {(showStylePicker === 'calendar' ? CALENDAR_STYLES : showStylePicker === 'clock' ? CLOCK_STYLES : BOARD_STYLES).map((s, i) => {
                        const colors = STYLE_GRADIENTS[showStylePicker!] || STYLE_GRADIENTS.calendar;
                        return (
                          <StylePickerCard
                            key={s.value}
                            $index={i}
                            $gradient={colors.gradient}
                            onClick={() => {
                              setShowStylePicker(null);
                              createWidgetWithStyle(showStylePicker!, s.value);
                              setEditorOpen(true);
                            }}
                          >
                            <StylePickerCardIcon $color={colors.accent}>
                              <s.icon />
                            </StylePickerCardIcon>
                            <TypePickerCardLabel>{s.label}</TypePickerCardLabel>
                          </StylePickerCard>
                        );
                      })}
                    </StylePickerGrid>
                  </TypePickerContainer>
                ) : (
                <>
                {editorOpen && (
                  <MobileEmbedFloating>
                    <MobileEmbedRow>
                      <MobileEmbedUrl
                        readOnly
                        value={embedUrl}
                        onFocus={(e) => e.target.select()}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <MobileCopyButton onClick={(e) => { e.stopPropagation(); handleCopyEmbedUrl(); }} $copied={copied}>
                        {copied ? <><Check /> Copied</> : <><Copy /> Copy</>}
                      </MobileCopyButton>
                    </MobileEmbedRow>
                  </MobileEmbedFloating>
                )}
                {showGrid && <DotGrid />}

                <ZoomableWidget key={currentWidgetKey} $zoom={studioZoom}>
                  <WidgetDisplay widget={currentWidget} />
                </ZoomableWidget>

                {currentWidget && editorOpen && (
                  <FloatingToolbar>
                    <ToolbarButton
                      $active={viewMode === 'editor'}
                      onClick={() => setViewMode('editor')}
                      aria-label="Editor"
                    >
                      <Pencil />
                      <Tooltip>Editor</Tooltip>
                    </ToolbarButton>
                    <ToolbarButton
                      $active={viewMode === 'layout-check' as ViewMode}
                      onClick={() => setViewMode('layout-check')}
                      aria-label="Preview"
                    >
                      <LayoutGrid />
                      <Tooltip>Preview</Tooltip>
                    </ToolbarButton>

                    <ToolbarDivider />

                    <EmbedUrlGroup>
                      <EmbedUrlInput
                        readOnly
                        value={embedUrl}
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                      />
                      <CopyButton onClick={handleCopyEmbedUrl} $copied={copied}>
                        {copied ? <><Check /> Copied</> : <><Copy /> Copy</>}
                      </CopyButton>
                    </EmbedUrlGroup>

                    {isRegistered && (
                      <>
                        <ToolbarDivider />
                        <SaveBtn onClick={handleSaveWidget} disabled={saving} $saved={saved}>
                          {saved ? <><Check /> Saved</> : saving ? <>Saving...</> : <><Save /> Save</>}
                        </SaveBtn>
                      </>
                    )}

                  </FloatingToolbar>
                )}

                {editorOpen && <TopRightControls>
                  <ZoomControl>
                    <ZoomLabel role="button" aria-label="Zoom out" onClick={() => setStudioZoom(Math.max(0.5, +(studioZoom - 0.1).toFixed(1)))}>−</ZoomLabel>
                    <ZoomSlider
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={studioZoom}
                      onChange={(e) => setStudioZoom(parseFloat(e.target.value))}
                    />
                    <ZoomLabel role="button" aria-label="Zoom in" onClick={() => setStudioZoom(Math.min(2.0, +(studioZoom + 0.1).toFixed(1)))}>+</ZoomLabel>
                    <ZoomValueDivider />
                    <ZoomValue>{Math.round(studioZoom * 100)}%</ZoomValue>
                  </ZoomControl>
                  <GridToggle $active={showGrid} onClick={() => setShowGrid(!showGrid)} aria-label="Toggle grid">
                    <Grip />
                  </GridToggle>
                </TopRightControls>}
                </>
                )}
              </WidgetArea>

              {!showTypePicker && editorOpen && (
                <CustomizationPanel
                  widget={currentWidget}
                  onSettingsChange={handleSettingsChange}
                  mobileOpen={mobilePanel}
                  onMobileClose={() => setMobilePanel(false)}
                />
              )}
              {mobilePanel && <MobileOverlay onClick={() => setMobilePanel(false)} />}
            </>
          ) : (
            <LayoutCheckArea>
              <LayoutCheck widget={currentWidget} />

              {currentWidget && (
                <FloatingToolbar style={{ left: 'calc(50% - 145px)' }}>
                  <ToolbarButton
                    onClick={() => setViewMode('editor')}
                    aria-label="Editor"
                  >
                    <Pencil />
                    <Tooltip>Editor</Tooltip>
                  </ToolbarButton>
                  <ToolbarButton
                    $active
                    aria-label="Preview"
                  >
                    <LayoutGrid />
                    <Tooltip>Preview</Tooltip>
                  </ToolbarButton>

                  <ToolbarDivider />

                  <EmbedUrlGroup>
                    <EmbedUrlInput
                      readOnly
                      value={embedUrl}
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <CopyButton onClick={handleCopyEmbedUrl} $copied={copied}>
                      {copied ? <><Check /> Copied</> : <><Copy /> Copy</>}
                    </CopyButton>
                    {isRegistered && (
                      <SaveBtn onClick={handleSaveWidget} disabled={saving} $saved={saved}>
                        {saved ? <><Check /> Saved</> : saving ? <>Saving...</> : <><Save /> Save</>}
                      </SaveBtn>
                    )}
                  </EmbedUrlGroup>
                </FloatingToolbar>
              )}
            </LayoutCheckArea>
          )}
        </ContentArea>
      </WorkspaceContainer>

      {/* Mobile bottom tab bar */}
      {!dashboardView && <MobileTabBar>
        <MobileTabButton $active={mobileTab === 'content'} onClick={() => { setMobileSidebar(false); setMobileTab(mobileTab === 'content' ? null : 'content'); }}>
          <Sliders />
          <MobileTabLabel>Content</MobileTabLabel>
        </MobileTabButton>
        <MobileTabButton $active={mobileTab === 'color'} $disabled={!hasColor} onClick={() => { if (!hasColor) return; setMobileSidebar(false); setMobileTab(mobileTab === 'color' ? null : 'color'); }}>
          <Palette />
          <MobileTabLabel>Color</MobileTabLabel>
        </MobileTabButton>
        <MobileTabButton $active={mobileTab === 'style'} $disabled={!hasStyle} onClick={() => { if (!hasStyle) return; setMobileSidebar(false); setMobileTab(mobileTab === 'style' ? null : 'style'); }}>
          <Brush />
          <MobileTabLabel>Style</MobileTabLabel>
        </MobileTabButton>
        <MobileTabButton $active={mobileTab === 'layout'} $disabled={!hasLayout} onClick={() => { if (!hasLayout) return; setMobileSidebar(false); setMobileTab(mobileTab === 'layout' ? null : 'layout'); }}>
          <Settings2 />
          <MobileTabLabel>Layout</MobileTabLabel>
        </MobileTabButton>
      </MobileTabBar>}

      {/* Mobile bottom sheet */}
      <MobileSheet $open={!!mobileTab}>
        <MobileSheetTop
          onTouchStart={(e) => {
            const startY = e.touches[0].clientY;
            const handleMove = (ev: TouchEvent) => {
              const dy = ev.touches[0].clientY - startY;
              if (dy > 50) { setMobileTab(null); cleanup(); }
            };
            const cleanup = () => { window.removeEventListener('touchmove', handleMove); window.removeEventListener('touchend', cleanup); };
            window.addEventListener('touchmove', handleMove);
            window.addEventListener('touchend', cleanup);
          }}
        >
          <MobileSheetHandleArea>
            <MobileSheetHandle />
          </MobileSheetHandleArea>
          <MobileSheetHeader>
            <MobileSheetTitle>
              {mobileTab === 'style' && 'Style'}
              {mobileTab === 'content' && 'Content'}
              {mobileTab === 'color' && 'Color'}
              {mobileTab === 'layout' && 'Layout'}
            </MobileSheetTitle>
            <MobileSheetClose aria-label="Close" onClick={() => setMobileTab(null)}>
              <X />
            </MobileSheetClose>
          </MobileSheetHeader>
        </MobileSheetTop>
        {mobileTab && (
          <div key={mobileTab} style={{ animation: 'fadeIn 0.15s ease' }}>
            <CustomizationPanel
              widget={currentWidget}
              onSettingsChange={handleSettingsChange}
              visibleSection={mobileTab}
            />
          </div>
        )}
      </MobileSheet>
    </StudioContainer>
  );
};
