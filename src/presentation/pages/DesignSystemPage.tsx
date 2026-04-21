import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '@/presentation/themes/theme';
import { TopNav } from '@/presentation/components/layout/TopNav';
import { Button } from '@/presentation/components/shared/Button';
import { FilterChip } from '@/presentation/components/shared/FilterChip';
import { BackButton } from '@/presentation/components/shared/BackButton';
import { SectionHeader } from '@/presentation/components/shared/SectionHeader';
import { Footer } from '@/presentation/components/shared/Footer';
import {
  ProPill,
  NewPill,
  FreePill,
  LimitedPill,
  PopularPill,
  PlanPill,
  PlanBadge,
  BADGE_ACCENT_TEXT,
  badgeBase,
} from '@/presentation/components/shared';
import { Search, Check, Star, User, Home, Settings, Calendar, Clock, ToggleLeft, ToggleRight, Type, Lock, Pencil, Trash2, Sparkles, ChevronDown, LogOut, ArrowUpRight, ShoppingBag, Menu, X, ArrowRight, ExternalLink, Plus } from 'lucide-react';

/* ── Toast animation ── */

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const Toast = styled.div<{ $visible: boolean }>`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: ${({ theme }) => theme.colors.text.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  border-radius: ${({ theme }) => theme.radii.full};
  box-shadow: ${({ theme }) => theme.shadows.heavy};
  z-index: ${({ theme }) => theme.zIndex.tooltip};
  pointer-events: none;
  animation: ${({ $visible }) => ($visible ? fadeInUp : fadeOut)} 0.2s ease forwards;

  svg {
    width: 14px;
    height: 14px;
  }
`;

/* ── Layout ── */

const NavOverride = styled.div`
  nav > div {
    max-width: none;
    padding: 0 24px;
  }
`;

const PageWrap = styled.div`
  display: flex;
  min-height: 100vh;
  background: #FAFAFA;
`;

const Sidebar = styled.nav`
  position: fixed;
  top: calc(57px + env(safe-area-inset-top, 0px));
  left: 0;
  bottom: 0;
  width: 180px;
  padding: ${({ theme }) => theme.spacing['8']} ${({ theme }) => theme.spacing['4']};
  overflow-y: auto;
  background: #FAFAFA;
  z-index: ${({ theme }) => theme.zIndex.docked};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const SidebarGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['1']};
`;

const SidebarLink = styled.a<{ $active?: boolean; $dotColor?: string }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: ${({ $active, theme }) =>
    $active ? theme.typography.weights.medium : theme.typography.weights.normal};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.text.primary : theme.colors.text.secondary};
  background: ${({ $active }) =>
    $active ? 'rgba(0, 0, 0, 0.04)' : 'transparent'};
  border-radius: ${({ theme }) => theme.radii.sm};
  text-decoration: none;
  cursor: pointer;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.normal};
  transition: all ${({ theme }) => theme.transitions.fast};

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: ${({ theme }) => theme.radii.full};
    background: ${({ $dotColor }) => $dotColor ?? 'transparent'};
    flex-shrink: 0;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background: rgba(0, 0, 0, 0.04);
  }
`;

const Content = styled.main`
  margin-left: 180px;
  flex: 1;
  max-width: 960px;
  padding: ${({ theme }) => theme.spacing['8']} ${({ theme }) => theme.spacing['12']} ${({ theme }) => theme.spacing['20']};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-left: 0;
    padding: ${({ theme }) => theme.spacing['6']} ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['16']};
  }
`;

/* ── Hero header ── */

const HeroHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing['12']};
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.sizes['3xl']};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
  margin: 0 0 ${({ theme }) => theme.spacing['2']};
`;

const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.normal};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`;

/* ── Search ── */

const SearchWrap = styled.div`
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing['10']};

  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

const SearchInput = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 ${({ theme }) => theme.spacing['4']} 0 42px;
  background: ${({ theme }) => theme.colors.background.page};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.md};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.primary};
  outline: none;
  transition: border-color ${({ theme }) => theme.transitions.fast};
  box-shadow: ${({ theme }) => theme.shadows.form};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.border.focus};
  }
`;

/* ── Card sections ── */

const Section = styled.section`
  scroll-margin-top: 80px;
`;

const SectionCard = styled.div`
  background: ${({ theme }) => theme.colors.background.page};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing['8']};
  margin-bottom: ${({ theme }) => theme.spacing['12']};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing['6']};
  }
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
  margin: 0 0 ${({ theme }) => theme.spacing['6']};
`;

const SubsectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.normal};
  margin: 0 0 ${({ theme }) => theme.spacing['4']};
  text-transform: uppercase;
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  letter-spacing: 0.04em;
`;

const SubsectionDivider = styled.div`
  margin-top: ${({ theme }) => theme.spacing['8']};
`;

/* ── Token helpers ── */

const TokenLabel = styled.span`
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TokenMono = styled.span`
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.tertiary};
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.text.accent};
  }
`;

/* ── Color swatches ── */

const SwatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: ${({ theme }) => theme.spacing['4']};
  margin-bottom: ${({ theme }) => theme.spacing['8']};
`;

const SwatchCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2']};
  cursor: pointer;
`;

const ColorSquare = styled.div<{ $bg: string; $border?: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $bg }) => $bg};
  border: ${({ $border }) =>
    $border ? '1px solid rgba(0,0,0,0.12)' : '1px solid rgba(0,0,0,0.06)'};
  transition: transform ${({ theme }) => theme.transitions.fast};

  ${SwatchCard}:hover & {
    transform: scale(1.05);
  }
`;

const BorderRect = styled.div<{ $borderColor: string }>`
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background.page};
  border: 2px solid ${({ $borderColor }) => $borderColor};
  transition: transform ${({ theme }) => theme.transitions.fast};

  ${SwatchCard}:hover & {
    transform: scale(1.05);
  }
`;

const GradientRect = styled.div<{ $bg: string }>`
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $bg }) => $bg};
  transition: transform ${({ theme }) => theme.transitions.fast};

  ${SwatchCard}:hover & {
    transform: scale(1.05);
  }
`;

const StatusRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing['3']};
  margin-bottom: ${({ theme }) => theme.spacing['8']};
`;

const StatusPill = styled.span<{ $bg: string }>`
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 0 16px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ $bg }) => $bg};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: scale(1.05);
  }
`;

/* ── Typography ── */

const TypoRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing['6']};
  padding: ${({ theme }) => theme.spacing['4']} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing['2']};
  }
`;

const TypoMeta = styled.div`
  width: 120px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const TypoPreview = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing['4']};
  flex: 1;
  min-width: 0;
`;

const TypoAa = styled.span<{ $size: string; $weight?: number; $ls?: string }>`
  font-size: ${({ $size }) => $size};
  font-weight: ${({ $weight }) => $weight ?? 400};
  letter-spacing: ${({ $ls }) => $ls ?? '-0.01em'};
  color: ${({ theme }) => theme.colors.text.primary};
  flex-shrink: 0;
`;

const TypoSentence = styled.span<{ $size: string; $weight?: number; $ls?: string }>`
  font-size: ${({ $size }) => $size};
  font-weight: ${({ $weight }) => $weight ?? 400};
  letter-spacing: ${({ $ls }) => $ls ?? '-0.01em'};
  color: ${({ theme }) => theme.colors.text.secondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/* ── Spacing ── */

const SpacingRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['4']};
  margin-bottom: ${({ theme }) => theme.spacing['2']};
  cursor: pointer;

  &:hover > div:first-child {
    opacity: 0.8;
  }
`;

const SpacingBar = styled.div<{ $width: string }>`
  width: ${({ $width }) => $width};
  height: 16px;
  min-width: 4px;
  background: ${({ theme }) => theme.colors.accent};
  border-radius: 4px;
  transition: opacity ${({ theme }) => theme.transitions.fast};
`;

const SpacingLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']};
  min-width: 140px;
`;

/* ── Border Radius ── */

const RadiiGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing['4']};
`;

const RadiiItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['2']};
  cursor: pointer;
`;

const RadiiBox = styled.div<{ $radius: string }>`
  width: 80px;
  height: 80px;
  background: ${({ theme }) => theme.colors.background.surface};
  border: 1.5px solid ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ $radius }) => $radius};
  transition: transform ${({ theme }) => theme.transitions.fast};

  ${RadiiItem}:hover & {
    transform: scale(1.05);
  }
`;

/* ── Shadows ── */

const ShadowGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing['6']};
`;

const ShadowItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']};
  cursor: pointer;
`;

const ShadowCard = styled.div<{ $shadow: string }>`
  width: 100%;
  height: 100px;
  background: ${({ theme }) => theme.colors.background.page};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ $shadow }) => $shadow};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform ${({ theme }) => theme.transitions.fast};

  ${ShadowItem}:hover & {
    transform: translateY(-2px);
  }
`;

/* ── Buttons ── */

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing['4']};
`;

const ButtonCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['3']};
  padding: ${({ theme }) => theme.spacing['6']};
  background: ${({ theme }) => theme.colors.background.surface};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const ButtonCellLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const ButtonCellRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']};
`;

/* ── Transitions ── */

const TransitionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: ${({ theme }) => theme.spacing['4']};
`;

const TransitionItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['2']};
`;

const TransitionBox = styled.div<{ $transition: string }>`
  width: 100%;
  height: 72px;
  background: ${({ theme }) => theme.colors.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  transition: all ${({ $transition }) => $transition};
  position: relative;
  overflow: hidden;

  &::after {
    content: 'After';
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.text.inverse};
    font-size: ${({ theme }) => theme.typography.sizes.sm};
    font-weight: ${({ theme }) => theme.typography.weights.medium};
    opacity: 0;
    transition: opacity ${({ $transition }) => $transition};
    border-radius: ${({ theme }) => theme.radii.md};
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadows.medium};

    &::after {
      opacity: 1;
    }
  }
`;

const TransitionLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

/* ── Component Examples ── */

const ComponentBox = styled.div`
  padding: ${({ theme }) => theme.spacing['6']};
  border: 1px dashed ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background.surface};
  margin-bottom: ${({ theme }) => theme.spacing['4']};
`;

const ComponentLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: ${({ theme }) => theme.spacing['4']};
`;

/* ── Blur ── */

const BlurGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: ${({ theme }) => theme.spacing['4']};
`;

const BlurItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['2']};
  cursor: pointer;
`;

const BlurBox = styled.div<{ $blur: string }>`
  width: 100%;
  height: 100px;
  border-radius: ${({ theme }) => theme.radii.md};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #3384F4 0%, #EC4899 50%, #F59E0B 100%);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(${({ $blur }) => $blur});
    -webkit-backdrop-filter: blur(${({ $blur }) => $blur});
  }
`;

/* ── Breakpoints ruler ── */

const BreakpointsBar = styled.div`
  position: relative;
  height: 64px;
  background: ${({ theme }) => theme.colors.background.surface};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  overflow: hidden;
`;

const BreakpointMarker = styled.div<{ $left: string }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${({ $left }) => $left};
  border-left: 2px dashed ${({ theme }) => theme.colors.border.medium};
  display: flex;
  align-items: flex-start;
  padding-top: 6px;
`;

const BreakpointTag = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  background: ${({ theme }) => theme.colors.background.page};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: 2px 6px;
  margin-left: 4px;
  white-space: nowrap;
`;

const CurrentWidthMarker = styled.div<{ $left: string }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${({ $left }) => $left};
  width: 3px;
  background: ${({ theme }) => theme.colors.accent};
  border-radius: 2px;

  &::after {
    content: attr(data-label);
    position: absolute;
    bottom: 6px;
    left: 8px;
    font-size: ${({ theme }) => theme.typography.sizes.xs};
    font-weight: ${({ theme }) => theme.typography.weights.medium};
    color: ${({ theme }) => theme.colors.text.accent};
    white-space: nowrap;
  }
`;

/* ── Z-index stacked cards ── */

const ZIndexStack = styled.div`
  position: relative;
  height: 280px;
  margin-bottom: ${({ theme }) => theme.spacing['4']};
`;

const ZIndexCard = styled.div<{ $zIndex: number; $offset: number; $color: string }>`
  position: absolute;
  left: ${({ $offset }) => $offset * 24}px;
  top: ${({ $offset }) => $offset * 28}px;
  width: 200px;
  height: 72px;
  background: ${({ theme }) => theme.colors.background.page};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  z-index: ${({ $zIndex }) => $zIndex};
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacing['4']};
  gap: ${({ theme }) => theme.spacing['3']};
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
  }

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: ${({ theme }) => theme.radii.full};
    background: ${({ $color }) => $color};
    flex-shrink: 0;
  }
`;

/* ── Line Heights ── */

const LineHeightRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing['6']};
  margin-bottom: ${({ theme }) => theme.spacing['4']};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const LineHeightBox = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing['4']};
  background: ${({ theme }) => theme.colors.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const LineHeightText = styled.p<{ $lh: number }>`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  line-height: ${({ $lh }) => $lh};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: ${({ theme }) => theme.spacing['2']} 0 0;
`;

/* ── Button sizes table ── */

const SpecTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: ${({ theme }) => theme.spacing['6']};

  th, td {
    text-align: left;
    padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['3']};
    font-size: ${({ theme }) => theme.typography.sizes.sm};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  }

  th {
    font-weight: ${({ theme }) => theme.typography.weights.medium};
    color: ${({ theme }) => theme.colors.text.secondary};
    text-transform: uppercase;
    font-size: ${({ theme }) => theme.typography.sizes.xs};
    letter-spacing: 0.04em;
  }

  td {
    font-family: ${({ theme }) => theme.typography.fonts.mono};
    font-size: ${({ theme }) => theme.typography.sizes.xs};
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

/* ── Borders ── */

const BorderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: ${({ theme }) => theme.spacing['4']};
`;

const BorderCard = styled.div<{ $border: string }>`
  padding: ${({ theme }) => theme.spacing['6']};
  background: ${({ theme }) => theme.colors.background.page};
  border: ${({ $border }) => $border};
  border-radius: ${({ theme }) => theme.radii.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2']};
`;

const DividerLine = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.colors.border.light};
  margin: ${({ theme }) => theme.spacing['2']} 0;
`;

/* ── Site Components section ── */

const ComponentFrame = styled.div`
  padding: ${({ theme }) => theme.spacing['6']};
  border: 1px dashed ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background.surface};
  margin-bottom: ${({ theme }) => theme.spacing['4']};
`;

const ComponentFrameHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing['4']};
`;

const ComponentFrameName = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ComponentFrameUsage = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-style: italic;
`;

/* inline mini nav preview */
const MiniNavBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`;

const MiniNavLogo = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
`;

const MiniNavLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing['4']};
`;

const MiniNavLink = styled.span<{ $active?: boolean }>`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ $active, theme }) => $active ? theme.colors.text.primary : theme.colors.text.tertiary};
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover { color: ${({ theme }) => theme.colors.text.primary}; }
`;

/* testimonial card mini */
const TestimonialCardMini = styled.div`
  background: ${({ theme }) => theme.colors.background.page};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing['5']};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  max-width: 340px;
`;

const TestimonialHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']};
  margin-bottom: ${({ theme }) => theme.spacing['3']};
`;

const TestimonialAvatar = styled.div<{ $color: string }>`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.inverse};
`;

const TestimonialName = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TestimonialRole = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const TestimonialStars = styled.div`
  display: flex;
  gap: 2px;
  margin-bottom: ${({ theme }) => theme.spacing['2']};
  color: #F59E0B;

  svg { width: 14px; height: 14px; fill: currentColor; }
`;

const TestimonialText = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  margin: 0;
`;

/* pinterest pin mini */
const MiniPinCard = styled.div<{ $bg: string; $color?: string }>`
  padding: ${({ theme }) => theme.spacing['5']};
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color || '#1F1F1F'};
  border-radius: ${({ theme }) => theme.radii.lg};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 100px;
`;

const MiniPinTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  letter-spacing: -0.02em;
  margin-bottom: 4px;
`;

const MiniPinSub = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  opacity: 0.7;
`;

/* feature tab mini */
const FeatureTabMini = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.radii['2xl']};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  max-width: 300px;
`;

const FeatureTabHeader = styled.div<{ $bg: string }>`
  padding: ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['5']};
  background: ${({ $bg }) => $bg};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
`;

const FeatureTabBody = styled.div`
  padding: ${({ theme }) => theme.spacing['5']};
  background: ${({ theme }) => theme.colors.background.page};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`;

/* color picker mini */
const ColorPickerMini = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']};
`;

const ColorSwatch = styled.div<{ $color: string }>`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ $color }) => $color};
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.fast};

  &:hover { transform: scale(1.1); }
`;

const ColorHexInput = styled.div`
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.background.page};
`;

/* toggle mini */
const ToggleTrack = styled.div<{ $on: boolean }>`
  width: 44px;
  height: 24px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ $on }) => $on ? '#3384F4' : '#D4D4D4'};
  position: relative;
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast};
`;

const ToggleThumb = styled.div<{ $on: boolean }>`
  position: absolute;
  top: 2px;
  left: ${({ $on }) => $on ? '22px' : '2px'};
  width: 20px;
  height: 20px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: #ffffff;
  box-shadow: ${({ theme }) => theme.shadows.form};
  transition: left ${({ theme }) => theme.transitions.fast};
`;

/* input field mini */
const MiniInput = styled.input`
  width: 240px;
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing['3']};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.background.page};
  outline: none;
  box-shadow: ${({ theme }) => theme.shadows.form};
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &::placeholder { color: ${({ theme }) => theme.colors.text.tertiary}; }
  &:focus { border-color: ${({ theme }) => theme.colors.border.focus}; }
`;

/* mobile tab bar mini */
const MobileTabBarMini = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 8px 0;
  background: ${({ theme }) => theme.colors.background.page};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.lg};
  max-width: 320px;
`;

const MobileTabItem = styled.div<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  color: ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.text.tertiary};
  transition: color ${({ theme }) => theme.transitions.fast};

  svg { width: 20px; height: 20px; }

  span {
    font-size: 10px;
    font-weight: ${({ theme }) => theme.typography.weights.medium};
  }
`;

/* ── Upgrade button + dropdown demos (1:1 copies of production styles) ── */

// 1:1 copy of CustomizeBtn from WidgetStudioPage.tsx:473
const CustomizeBtnDemo = styled.button<{ $pro?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 13px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ $pro }) => $pro ? '#2B2320' : '#fff'};
  background: ${({ $pro }) => $pro ? 'transparent' : '#2B2320'};
  border: 1px solid ${({ $pro }) => $pro ? '#2B2320' : 'transparent'};
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  letter-spacing: -0.01em;
  transition: all 0.15s ease;
  flex-shrink: 0;

  &:hover {
    background: ${({ $pro }) => $pro ? '#2B2320' : '#1F1814'};
    color: #fff;
    border-color: ${({ $pro }) => $pro ? '#2B2320' : 'transparent'};
  }

  svg { width: 13px; height: 13px; }
`;

const UpgradeStateGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const UpgradeStateCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  background: ${({ theme }) => theme.colors.background.page};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const UpgradeStateLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

// Mock of the TopNav avatar dropdown container
const DropdownMock = styled.div`
  width: 240px;
  max-width: 100%;
  padding: 8px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

// 1:1 copy of the "Upgrade to Pro" dropdown row from TopNav.tsx:651
const DropdownRowUpgrade = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgba(99, 102, 241, 0.18);
  cursor: pointer;
  background: linear-gradient(135deg, #EEF0FF 0%, #E2E7FF 100%);
  color: #4F46E5;
  font-family: inherit;
  border-radius: 10px;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: -0.005em;
  transition: transform 0.1s ease, box-shadow 0.15s ease, border-color 0.15s ease;

  &:hover {
    border-color: rgba(99, 102, 241, 0.36);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.16);
  }
`;

const DropdownUpgradeBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #6366F1;
  background: rgba(255, 255, 255, 0.65);
  padding: 2px 6px;
  border-radius: 4px;
`;

const DropdownRowPlain = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 12.5px;
  font-weight: 500;
  border-radius: 8px;
  transition: background 0.12s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`;

/* ── Full avatar dropdown mock (TopNav.tsx:592) ── */

const AvatarDropdownFull = styled.div`
  width: 260px;
  max-width: 100%;
  background: #fff;
  border-radius: 18px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.04);
  overflow: hidden;
`;

const DropdownUserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 16px 14px;
  background: linear-gradient(135deg, rgba(237, 228, 255, 0.3) 0%, rgba(232, 237, 255, 0.2) 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
`;

const DropdownAvatarCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: linear-gradient(135deg, #FFD4B8 0%, #FFB3A0 40%, #E8B4E3 100%);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow: 0 2px 8px rgba(255, 160, 140, 0.28);
`;

const DropdownUserName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #1F1F1F;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DropdownUserEmail = styled.div`
  font-size: 11.5px;
  color: #8E8E93;
  margin-top: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DropdownMenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  color: #1F1F1F;
  border-radius: 9px;
  letter-spacing: -0.005em;
  transition: background 0.12s;

  &:hover {
    background: rgba(0, 0, 0, 0.035);
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  margin: 0 12px;
  background: rgba(0, 0, 0, 0.04);
`;

const DropdownLogoutItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  color: #8E8E93;
  border-radius: 9px;
  letter-spacing: -0.005em;
  transition: background 0.12s, color 0.12s;

  &:hover {
    background: rgba(220, 60, 60, 0.08);
    color: #C23B3B;
  }
`;

const DropdownPlanRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  background: linear-gradient(135deg, #EEF0FF 0%, #E2E7FF 100%);
  border: 1px solid rgba(99, 102, 241, 0.18);
`;

// DropdownPlanBadge removed — uses shared PlanBadge with $pro prop now.

/* ── Additional label demos (1:1 copies from site) ── */

// 1:1 copy of CategoryChip from CategoriesMarquee.tsx:38
const CategoryChipDemo = styled.div<{ $color: string }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: ${({ $color }) => {
    const hex = $color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.08)`;
  }};
  border: 1px solid ${({ $color }) => {
    const hex = $color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.12)`;
  }};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  letter-spacing: -0.01em;
  white-space: nowrap;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 3px;
    background: ${({ $color }) => $color};
    flex-shrink: 0;
  }
`;

// 1:1 copy of CardBadge from TemplatesPage.tsx:172 — overlay badge on template card
const CardBadgeDemo = styled.span`
  padding: 3px 8px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: 6px;
  font-size: 10px;
  font-weight: 500;
`;

// 1:1 copy of WidgetLabel from StudioPage.tsx:167 — overlay on studio widget cards
const WidgetLabelDemo = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #6366F1;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(8px);
  padding: 3px 10px;
  border-radius: 6px;
`;

// 1:1 copy of CategoryTag from TemplateDetailPage.tsx:520 — inline metadata tag
const CategoryTagDemo = styled.span`
  display: inline-block;
  padding: 2px 10px;
  background: ${({ theme }) => theme.colors.background.surface};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

// 1:1 copy of SectionLabel from HeroSectionV2.tsx:414 — tiny eyebrow label
const SectionLabelDemo = styled.div`
  font-size: 9.5px;
  color: #9B9790;
  font-weight: 500;
  letter-spacing: -0.005em;
  display: flex;
  align-items: center;
  gap: 5px;
`;

// SocialBadge compound (HeroSection.tsx:110) — avatars + divider + stars + text
const SocialBadgeDemo = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 5px 14px 5px 5px;
  background: rgba(255, 255, 255, 0.44);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 999px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.45),
    0 1px 2px rgba(20, 20, 40, 0.03),
    0 4px 12px -4px rgba(20, 20, 40, 0.05);
`;

const SocialAvatarStack = styled.div`
  display: inline-flex;
  align-items: center;
`;

const SocialAvatar = styled.div<{ $bg: string; $i: number }>`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${({ $bg }) => $bg};
  border: 1.5px solid #fff;
  margin-left: ${({ $i }) => ($i === 0 ? '0' : '-7px')};
  z-index: ${({ $i }) => 10 - $i};
`;

const SocialBadgeDivider = styled.span`
  width: 1px;
  height: 12px;
  background: rgba(0, 0, 0, 0.1);
`;

const SocialBadgeStars = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 1px;
  color: #8B7FD6;
  font-size: 11px;
  line-height: 1;
  letter-spacing: 0.5px;
`;

const SocialBadgeText = styled.span`
  font-size: 12.5px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  letter-spacing: -0.005em;
  white-space: nowrap;

  strong {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: 600;
  }
`;

// Mesh-backed stage so glass variants (SocialBadge, WidgetLabel, CardBadge) read correctly
const GlassStage = styled.div`
  background: ${({ theme }) => theme.colors.background.mesh};
  padding: 24px 20px;
  border-radius: 14px;
  display: inline-flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
`;

/* ── Button demos (1:1 copies of production button variants) ── */

// 1:1 copy of NavCTA from TopNav.tsx:109
const NavCTADemo = styled.button`
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

// 1:1 copy of MobileCTA from TopNav.tsx:193
const MobileCTADemo = styled.button`
  width: 260px;
  height: 48px;
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

// 1:1 copy of BurgerButton from TopNav.tsx:131
const BurgerButtonDemo = styled.button`
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

// 1:1 copy of CartButton from TopNav.tsx:213
const CartButtonDemo = styled.button`
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

// 1:1 copy of CartRemoveBtn from TopNav.tsx:358
const CartRemoveBtnDemo = styled.button`
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

// 1:1 copy of CartCheckoutBtn from TopNav.tsx:405
const CartCheckoutBtnDemo = styled.button`
  width: 260px;
  height: 44px;
  background: ${({ theme }) => theme.colors.text.primary};
  color: #fff;
  border: none;
  border-radius: ${({ theme }) => theme.radii.button};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover { background: #333; }
`;

// 1:1 copy of ResendBtn from EmailVerificationBanner.tsx:36
const ResendBtnDemo = styled.button`
  height: 30px;
  padding: 0 14px;
  background: #fff;
  border: 1px solid rgba(180, 98, 58, 0.28);
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  color: #6B3A1F;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  white-space: nowrap;

  &:hover { background: #FFF9F2; border-color: rgba(180, 98, 58, 0.42); }
`;

// 1:1 copy of AcceptBtn from ConsentBanner.tsx:79
const AcceptBtnDemo = styled.button`
  height: 34px;
  padding: 0 16px;
  border: none;
  border-radius: 10px;
  background: #1F1F1F;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
  letter-spacing: -0.01em;

  &:hover { background: #333; }
`;

// 1:1 copy of ActionButton from SectionHeader.tsx:44 — the canonical dark-with-icon action.
// WidgetStudioSection.AccessBtn and TemplatesGallery.ExploreBtn are visual duplicates of this.
const ActionButtonDemo = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 18px;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  background: ${({ theme }) => theme.colors.text.primary};
  border: none;
  border-radius: ${({ theme }) => theme.radii.button};
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover { background: #333; }
  svg { width: 14px; height: 14px; }
`;

// 1:1 copy of OverlayBtn from DashboardViews.tsx:226 — used on widget card hover overlays.
const OverlayBtnDemo = styled.button<{ $danger?: boolean }>`
  height: 34px;
  padding: 0 18px;
  background: ${({ $danger }) => ($danger ? 'rgba(220, 40, 40, 0.9)' : 'rgba(255, 255, 255, 0.95)')};
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  color: ${({ $danger }) => ($danger ? '#fff' : '#1F1F1F')};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s ease;

  svg { width: 14px; height: 14px; }
  &:hover { transform: scale(1.04); }
  &:active { transform: scale(0.95); }
`;

// Dark stage so the semi-transparent OverlayBtn demos read like they do over card art.
const OverlayStage = styled.div`
  background: linear-gradient(135deg, #4a3a55 0%, #5a4258 40%, #6b4846 100%);
  padding: 18px 20px;
  border-radius: 14px;
  display: inline-flex;
  gap: 10px;
`;

const BadgeRowTight = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

/* ── Rules cards ── */

const RulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing['4']};
`;

const RuleCard = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing['3']};
  padding: ${({ theme }) => theme.spacing['5']};
  background: ${({ theme }) => theme.colors.background.page};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.md};
  transition: box-shadow ${({ theme }) => theme.transitions.fast};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.subtle};
  }
`;

const RuleDot = styled.div<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ $color }) => $color};
  flex-shrink: 0;
  margin-top: 5px;
`;

const RuleContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const RuleTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const RuleDescription = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`;

/* ── Modals / Badges / Cards / Forms styled demos ── */

const ModalStage = styled.div`
  background: rgba(26, 22, 19, 0.28);
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 260px;
`;

const ModalCardDemo = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 28px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.22);
`;

const ModalTitle = styled.h3`
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 6px;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ModalSubtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 20px;
  line-height: 1.5;
`;

const ModalCompare = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const PlanCol = styled.div<{ $highlight?: boolean }>`
  position: relative;
  padding: 16px;
  border-radius: 14px;
  border: 1px solid ${({ $highlight }) => $highlight ? '#6366F1' : 'rgba(0,0,0,0.08)'};
  background: ${({ $highlight }) => $highlight ? 'linear-gradient(180deg, #F4F3FF, #fff)' : '#fff'};
`;

const PlanTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-bottom: 6px;
`;

const PlanPrice = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
  margin-bottom: 10px;

  span {
    font-size: 13px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text.tertiary};
    margin-left: 2px;
  }
`;

const PlanSub = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-bottom: 12px;
`;

const PlanLi = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 4px 0;
  &::before {
    content: '✓';
    color: #7FA96B;
    margin-right: 6px;
  }
`;

const ModalInput = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 14px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  margin-bottom: 16px;
  outline: none;
  &:focus { border-color: #6E7FF2; }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const ModalBtn = styled.button<{ $primary?: boolean }>`
  height: 36px;
  padding: 0 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  border: 1px solid ${({ $primary }) => $primary ? '#1F1F1F' : 'rgba(0,0,0,0.1)'};
  background: ${({ $primary }) => $primary ? '#1F1F1F' : '#fff'};
  color: ${({ $primary }) => $primary ? '#fff' : '#1F1F1F'};
  &:hover { opacity: 0.88; }
`;

const ConsentBar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: rgba(26, 22, 19, 0.92);
  border-radius: 999px;
  color: #fff;
  font-size: 13px;
  max-width: 680px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);

  span { flex: 1; }
`;

const ConsentBtn = styled.button`
  height: 32px;
  padding: 0 16px;
  border-radius: 999px;
  background: #fff;
  color: #1F1F1F;
  border: none;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  &:hover { background: #F4F2EF; }
`;

const VerifyBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: linear-gradient(180deg, #FFF4E6, #FFE8CE);
  border: 1px solid rgba(244, 166, 114, 0.3);
  border-radius: 10px;
  font-size: 13px;
  color: #5C3D20;

  span { flex: 1; }
`;

const VerifyDot = styled.i`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #F4A672;
  flex-shrink: 0;
`;

const VerifyAction = styled.button`
  background: none;
  border: none;
  font-size: 12px;
  font-weight: 600;
  color: #B5743A;
  cursor: pointer;
  text-decoration: underline;
  font-family: inherit;
  &:hover { color: #8A5624; }
`;

const ToastPill = styled.div<{ $danger?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 999px;
  background: ${({ $danger }) => $danger ? '#DC2828' : '#1F1F1F'};
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.22);
  svg { width: 14px; height: 14px; }
`;

/* ── Badges, pills, overlay labels ──
   Master-UI design language:
   • One geometry for every badge — same radius, height, padding, type.
   • Two color families: brand accent (purple) and ink-neutral.
   • Visual differentiation comes from *texture* not more colors:
     leading dots, subtle outlines, gentle gradients.
   • No aggressive solid fills. The loudest variant is a soft-accent
     solid with hairline inner highlight, used at most once per screen.
*/

// Badge components (ProPill, NewPill, FreePill, LimitedPill, PopularPill,
// PlanPill) are imported from @/presentation/components/shared and are the
// single source of truth — site and DS render the exact same atoms.

const EyebrowDemo = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px 6px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  border: 0.5px solid rgba(26, 22, 19, 0.08);
  backdrop-filter: blur(14px) saturate(140%);
  box-shadow: 0 1px 2px rgba(20, 20, 40, 0.03), 0 4px 12px -4px rgba(20, 20, 40, 0.05);
  font-size: 13px;
  color: #4A433D;
  font-weight: 500;
`;

const AvatarStack = styled.div`
  display: flex;
`;

const MiniAvatar = styled.i<{ $bg: string }>`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #fff;
  display: block;
  background: ${({ $bg }) => $bg};
  &:not(:first-child) { margin-left: -6px; }
`;

const EyebrowStars = styled.span`
  color: #F4A672;
  font-size: 12px;
  letter-spacing: 1px;
`;

/* Card overlay labels — sit ON images, so need a glass base instead of tint.
   Same geometry/typography as all other badges. Shared overlay styling:
   white-transparent bg + hairline outline + accent text = legible on any image. */
const overlayGlass = `
  padding: 0 10px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12px) saturate(140%);
  -webkit-backdrop-filter: blur(12px) saturate(140%);
  border-color: rgba(255, 255, 255, 0.55);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.7),
    0 1px 2px rgba(0, 0, 0, 0.06);
  color: ${BADGE_ACCENT_TEXT};
`;

const WidgetLabelPill = styled.span`
  ${badgeBase}
  ${overlayGlass}
`;

const GalleryLabelPill = styled.span`
  ${badgeBase}
  ${overlayGlass}
`;

const LockedPill = styled.span`
  ${badgeBase}
  ${overlayGlass}
`;

/* ── Cards demos ── */

const TemplateCardDemo = styled.div`
  width: 220px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const TemplateCardImg = styled.div`
  width: 100%;
  aspect-ratio: 288 / 220;
  border-radius: 20px;
  border: 1px solid rgba(43, 35, 32, 0.06);
  box-shadow: 0 2px 6px rgba(43, 35, 32, 0.04), 0 12px 28px -16px rgba(43, 35, 32, 0.12);
  position: relative;
`;

const TemplateMeta = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px;
`;

const TemplateName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TemplatePrice = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const WidgetCardDemo = styled.div`
  width: 280px;
  background: #fff;
  border: 1.5px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  overflow: hidden;
`;

const WidgetPreview = styled.div`
  aspect-ratio: 4 / 3;
  position: relative;
`;

const WidgetBottomBar = styled.div`
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
`;

const WidgetCardName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const IconBtn = styled.button<{ $danger?: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: #fff;
  color: ${({ $danger }) => $danger ? '#DC2828' : '#6B6B6B'};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  &:hover { background: #F4F2EF; }
  svg { width: 14px; height: 14px; }
`;

const PricingCardDemo = styled.div<{ $highlighted?: boolean }>`
  position: relative;
  width: 220px;
  padding: 24px;
  border-radius: 18px;
  background: #fff;
  border: 1px solid ${({ $highlighted }) => $highlighted ? '#6366F1' : 'rgba(0,0,0,0.08)'};
  box-shadow: ${({ $highlighted }) => $highlighted ? '0 6px 32px rgba(100, 80, 200, 0.1)' : '0 1px 3px rgba(0,0,0,0.04)'};
`;

const TestimonialCardDemo = styled.div`
  max-width: 340px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(43, 35, 32, 0.06);
  border-radius: 20px;
  padding: 22px;
  box-shadow: 0 2px 6px rgba(43, 35, 32, 0.04), 0 12px 28px -16px rgba(43, 35, 32, 0.1);
`;

const TestimonialTextDemo = styled.p`
  font-size: 14px;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 16px;
`;

const TestimonialDivider = styled.div`
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
  margin-bottom: 12px;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

/* ── Form demos ── */

const FormStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 420px;
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FormLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  letter-spacing: 0.02em;
`;

const FormInput = styled.input`
  height: 42px;
  padding: 0 14px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  &:focus { border-color: #6E7FF2; }
`;

const FormTextarea = styled.textarea`
  padding: 10px 14px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  resize: vertical;
  &:focus { border-color: #6E7FF2; }
`;

const FormSelect = styled.select`
  height: 42px;
  padding: 0 14px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  background: #fff;
  cursor: pointer;
  max-width: 280px;
  &:focus { border-color: #6E7FF2; }
`;

const FormHint = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-weight: 500;
`;

const FormRange = styled.input`
  width: 100%;
  accent-color: #6E7FF2;
`;

const CheckboxRow = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
`;

const FormCheckbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #6E7FF2;
`;

const ColorSwatchDemo = styled.button<{ $color: string; $active?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  border: 2px solid ${({ $active }) => $active ? '#1F1F1F' : 'transparent'};
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  padding: 0;
  transition: transform 0.12s;
  &:hover { transform: scale(1.1); }
`;

/* ── Dropdown menu demo ── */

const DropdownWrap = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  gap: 8px;
`;

const DropdownButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid rgba(31, 31, 31, 0.1);
  background: #fff;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
  &:hover {
    border-color: rgba(31, 31, 31, 0.2);
    background: #FAFAFA;
  }
  svg { width: 14px; height: 14px; color: ${({ theme }) => theme.colors.text.tertiary}; }
`;

const DropdownMenu = styled.div`
  background: #fff;
  border: 1px solid rgba(31, 31, 31, 0.08);
  border-radius: 12px;
  padding: 6px;
  min-width: 200px;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 8px 24px -6px rgba(0, 0, 0, 0.12);
`;

const DropdownItem = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 34px;
  padding: 0 10px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  color: ${({ $danger, theme }) => $danger ? '#DC2828' : theme.colors.text.primary};
  cursor: pointer;
  text-align: left;
  transition: background 0.12s ease;
  &:hover { background: ${({ $danger }) => $danger ? 'rgba(220, 40, 40, 0.06)' : 'rgba(31, 31, 31, 0.05)'}; }
  svg { width: 14px; height: 14px; color: ${({ $danger, theme }) => $danger ? '#DC2828' : theme.colors.text.tertiary}; }
`;

const DropdownSeparator = styled.div`
  height: 1px;
  background: rgba(31, 31, 31, 0.06);
  margin: 4px 2px;
`;

const DropdownLabel = styled.div`
  padding: 6px 10px 4px;
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.tertiary};
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

/* ── Sections nav data ── */

const SECTIONS = [
  { id: 'colors', label: 'Colors', dot: theme.colors.accent },
  { id: 'typography', label: 'Typography', dot: theme.colors.text.primary },
  { id: 'spacing', label: 'Spacing', dot: theme.colors.success },
  { id: 'radii', label: 'Border Radius', dot: theme.colors.warning },
  { id: 'shadows', label: 'Shadows', dot: '#9A9A9A' },
  { id: 'blur', label: 'Blur', dot: '#A78BFA' },
  { id: 'breakpoints', label: 'Breakpoints', dot: '#06B6D4' },
  { id: 'zindex', label: 'Z-index', dot: '#F97316' },
  { id: 'lineheights', label: 'Line Heights', dot: '#10B981' },
  { id: 'buttonsizes', label: 'Button Sizes', dot: theme.colors.destructive },
  { id: 'borders', label: 'Borders', dot: '#8B5CF6' },
  { id: 'buttons', label: 'Buttons', dot: theme.colors.destructive },
  { id: 'transitions', label: 'Transitions', dot: '#7C63B8' },
  { id: 'components', label: 'Components', dot: '#E89A78' },
  { id: 'sitecomponents', label: 'Site Components', dot: '#EC4899' },
  { id: 'modals', label: 'Modals & Banners', dot: '#F97316' },
  { id: 'badges', label: 'Labels & Badges', dot: '#6366F1' },
  { id: 'cards', label: 'Cards', dot: '#14B8A6' },
  { id: 'forms', label: 'Form Elements', dot: '#A855F7' },
  { id: 'rules', label: 'Rules', dot: '#22C55E' },
];

/* ── Helpers ── */

function useClipboard() {
  const [toast, setToast] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback((value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setToast(value);
      timeoutRef.current = setTimeout(() => setToast(null), 1400);
    });
  }, []);

  return { toast, copy };
}

function matchesFilter(text: string, filter: string): boolean {
  if (!filter) return true;
  const lower = filter.toLowerCase();
  return text.toLowerCase().includes(lower);
}

/* ── Toggle Switch sub-component (needs local state) ── */

const ToggleSwitchFrame: React.FC<{ copy: (v: string) => void }> = ({ copy }) => {
  const [on, setOn] = useState(false);
  return (
    <ComponentFrame>
      <ComponentFrameHeader>
        <ComponentFrameName>Toggle Switch</ComponentFrameName>
        <ComponentFrameUsage>Used in: Studio (CustomizationPanel)</ComponentFrameUsage>
      </ComponentFrameHeader>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <ToggleTrack $on={on} onClick={() => setOn(!on)}>
          <ToggleThumb $on={on} />
        </ToggleTrack>
        <TokenLabel>{on ? 'On' : 'Off'}</TokenLabel>
      </div>
    </ComponentFrame>
  );
};

/* ── Main page ── */

export const DesignSystemPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('colors');
  const [search, setSearch] = useState('');
  const { toast, copy } = useClipboard();

  // Scroll spy
  const observerRef = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0 },
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const handleSidebarClick = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const f = search.trim();

  return (
    <>
      <NavOverride>
        <TopNav logoSub="Design System" activeLink="dev" />
      </NavOverride>
      <PageWrap>
        {/* Sidebar */}
        <Sidebar>
          <SidebarGroup>
            {SECTIONS.map((s) => (
              <SidebarLink
                key={s.id}
                $active={activeSection === s.id}
                $dotColor={s.dot}
                onClick={() => handleSidebarClick(s.id)}
              >
                {s.label}
              </SidebarLink>
            ))}
          </SidebarGroup>
        </Sidebar>

        <Content>
          {/* Hero */}
          <HeroHeader>
            <HeroTitle>Design System</HeroTitle>
            <HeroSubtitle>
              9 type sizes &middot; 7 radii &middot; 4 shadows &middot; 3 transitions &middot; 4 text colors &middot; 200+ token refs
            </HeroSubtitle>
          </HeroHeader>

          {/* Search */}
          <SearchWrap>
            <Search />
            <SearchInput
              placeholder="Filter tokens by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </SearchWrap>

          {/* ═══════ 1. COLORS ═══════ */}
          <Section id="colors">
            <SectionCard>
              <SectionTitle>Colors</SectionTitle>

              {/* Text colors */}
              {(Object.entries(theme.colors.text) as [string, string][]).some(
                ([key]) => matchesFilter(`text.${key}`, f),
              ) && (
                <>
                  <SubsectionTitle>Text</SubsectionTitle>
                  <SwatchGrid>
                    {(Object.entries(theme.colors.text) as [string, string][])
                      .filter(([key]) => matchesFilter(`text.${key}`, f))
                      .map(([key, value]) => (
                        <SwatchCard key={key} onClick={() => copy(value)}>
                          <ColorSquare $bg={value} $border={value === '#ffffff'} />
                          <TokenLabel>text.{key}</TokenLabel>
                          <TokenMono>{value}</TokenMono>
                        </SwatchCard>
                      ))}
                  </SwatchGrid>
                </>
              )}

              {/* Background colors */}
              {(Object.entries(theme.colors.background) as [string, string][]).some(
                ([key]) => matchesFilter(`background.${key}`, f),
              ) && (
                <SubsectionDivider>
                  <SubsectionTitle>Background</SubsectionTitle>
                  <SwatchGrid>
                    {(Object.entries(theme.colors.background) as [string, string][])
                      .filter(([key]) => matchesFilter(`background.${key}`, f))
                      .map(([key, value]) => (
                        <SwatchCard key={key} onClick={() => copy(value)}>
                          <ColorSquare $bg={value} $border />
                          <TokenLabel>background.{key}</TokenLabel>
                          <TokenMono>{value}</TokenMono>
                        </SwatchCard>
                      ))}
                  </SwatchGrid>
                </SubsectionDivider>
              )}

              {/* Border colors */}
              {(Object.entries(theme.colors.border) as [string, string][]).some(
                ([key]) => matchesFilter(`border.${key}`, f),
              ) && (
                <SubsectionDivider>
                  <SubsectionTitle>Border</SubsectionTitle>
                  <SwatchGrid>
                    {(Object.entries(theme.colors.border) as [string, string][])
                      .filter(([key]) => matchesFilter(`border.${key}`, f))
                      .map(([key, value]) => (
                        <SwatchCard key={key} onClick={() => copy(value)}>
                          <BorderRect $borderColor={value} />
                          <TokenLabel>border.{key}</TokenLabel>
                          <TokenMono>{value}</TokenMono>
                        </SwatchCard>
                      ))}
                  </SwatchGrid>
                </SubsectionDivider>
              )}

              {/* Status colors */}
              {matchesFilter('status accent success warning destructive', f) && (
                <SubsectionDivider>
                  <SubsectionTitle>Status</SubsectionTitle>
                  <StatusRow>
                    {[
                      { name: 'accent', value: theme.colors.accent },
                      { name: 'success', value: theme.colors.success },
                      { name: 'warning', value: theme.colors.warning },
                      { name: 'destructive', value: theme.colors.destructive },
                    ]
                      .filter(({ name }) => matchesFilter(name, f))
                      .map(({ name, value }) => (
                        <StatusPill key={name} $bg={value} onClick={() => copy(value)}>
                          {name} &middot; {value}
                        </StatusPill>
                      ))}
                  </StatusRow>
                </SubsectionDivider>
              )}

              {/* Gradients */}
              {(Object.entries(theme.colors.gradients) as [string, string][]).some(
                ([key]) => matchesFilter(`gradients.${key}`, f),
              ) && (
                <SubsectionDivider>
                  <SubsectionTitle>Gradients</SubsectionTitle>
                  <SwatchGrid>
                    {(Object.entries(theme.colors.gradients) as [string, string][])
                      .filter(([key]) => matchesFilter(`gradients.${key}`, f))
                      .map(([key, value]) => (
                        <SwatchCard key={key} onClick={() => copy(value)}>
                          <GradientRect $bg={value} />
                          <TokenLabel>gradients.{key}</TokenLabel>
                          <TokenMono style={{ wordBreak: 'break-all' }}>{value}</TokenMono>
                        </SwatchCard>
                      ))}
                  </SwatchGrid>
                </SubsectionDivider>
              )}
            </SectionCard>
          </Section>

          {/* ═══════ 2. TYPOGRAPHY ═══════ */}
          <Section id="typography">
            <SectionCard>
              <SectionTitle>Typography</SectionTitle>

              {/* Type Scale */}
              {(Object.entries(theme.typography.sizes) as [string, string][]).some(
                ([key]) => matchesFilter(`sizes.${key}`, f),
              ) && (
                <>
                  <SubsectionTitle>Scale</SubsectionTitle>
                  <div style={{ marginBottom: 32 }}>
                    {(Object.entries(theme.typography.sizes) as [string, string][])
                      .filter(([key]) => matchesFilter(`sizes.${key}`, f))
                      .map(([key, value]) => (
                        <TypoRow key={key} onClick={() => copy(value)} style={{ cursor: 'pointer' }}>
                          <TypoMeta>
                            <TokenLabel>{key}</TokenLabel>
                            <TokenMono>{value}</TokenMono>
                          </TypoMeta>
                          <TypoPreview>
                            <TypoAa $size={value} $weight={500}>Aa</TypoAa>
                            <TypoSentence $size={value}>
                              The quick brown fox jumps over the lazy dog
                            </TypoSentence>
                          </TypoPreview>
                        </TypoRow>
                      ))}
                  </div>
                </>
              )}

              {/* Font Weights */}
              {(Object.entries(theme.typography.weights) as [string, number][]).some(
                ([key]) => matchesFilter(`weights.${key}`, f),
              ) && (
                <SubsectionDivider>
                  <SubsectionTitle>Weights</SubsectionTitle>
                  <div style={{ marginBottom: 32 }}>
                    {(Object.entries(theme.typography.weights) as [string, number][])
                      .filter(([key]) => matchesFilter(`weights.${key}`, f))
                      .map(([key, value]) => (
                        <TypoRow key={key} onClick={() => copy(String(value))} style={{ cursor: 'pointer' }}>
                          <TypoMeta>
                            <TokenLabel>{key}</TokenLabel>
                            <TokenMono>{value}</TokenMono>
                          </TypoMeta>
                          <TypoPreview>
                            <TypoAa $size="24px" $weight={value}>Aa</TypoAa>
                            <TypoSentence $size="16px" $weight={value}>
                              The quick brown fox jumps over the lazy dog
                            </TypoSentence>
                          </TypoPreview>
                        </TypoRow>
                      ))}
                  </div>
                </SubsectionDivider>
              )}

              {/* Letter Spacing */}
              {(Object.entries(theme.typography.letterSpacing) as [string, string][]).some(
                ([key]) => matchesFilter(`letterSpacing.${key}`, f),
              ) && (
                <SubsectionDivider>
                  <SubsectionTitle>Spacing</SubsectionTitle>
                  <div>
                    {(Object.entries(theme.typography.letterSpacing) as [string, string][])
                      .filter(([key]) => matchesFilter(`letterSpacing.${key}`, f))
                      .map(([key, value]) => (
                        <TypoRow key={key} onClick={() => copy(value)} style={{ cursor: 'pointer' }}>
                          <TypoMeta>
                            <TokenLabel>{key}</TokenLabel>
                            <TokenMono>{value}</TokenMono>
                          </TypoMeta>
                          <TypoPreview>
                            <TypoSentence $size="16px" $weight={500} $ls={value}>
                              The quick brown fox jumps over the lazy dog
                            </TypoSentence>
                          </TypoPreview>
                        </TypoRow>
                      ))}
                  </div>
                </SubsectionDivider>
              )}
            </SectionCard>
          </Section>

          {/* ═══════ 3. SPACING ═══════ */}
          <Section id="spacing">
            <SectionCard>
              <SectionTitle>Spacing</SectionTitle>
              {(Object.entries(theme.spacing) as [string, string][])
                .filter(([key]) => matchesFilter(`spacing.${key}`, f))
                .map(([key, value]) => (
                  <SpacingRow key={key} onClick={() => copy(value)}>
                    <SpacingBar $width={value === '0' ? '4px' : value} style={value === '0' ? { opacity: 0.3 } : undefined} />
                    <SpacingLabel>
                      <TokenLabel>spacing.{key}</TokenLabel>
                      <TokenMono>{value}</TokenMono>
                    </SpacingLabel>
                  </SpacingRow>
                ))}
            </SectionCard>
          </Section>

          {/* ═══════ 4. BORDER RADIUS ═══════ */}
          <Section id="radii">
            <SectionCard>
              <SectionTitle>Border Radius</SectionTitle>
              <RadiiGrid>
                {(Object.entries(theme.radii) as [string, string][])
                  .filter(([key]) => matchesFilter(`radii.${key}`, f))
                  .map(([key, value]) => (
                    <RadiiItem key={key} onClick={() => copy(value)}>
                      <RadiiBox $radius={value} />
                      <TokenLabel>{key}</TokenLabel>
                      <TokenMono>{value}</TokenMono>
                    </RadiiItem>
                  ))}
              </RadiiGrid>
            </SectionCard>
          </Section>

          {/* ═══════ 5. SHADOWS ═══════ */}
          <Section id="shadows">
            <SectionCard>
              <SectionTitle>Shadows</SectionTitle>
              <ShadowGrid>
                {(Object.entries(theme.shadows) as [string, string][])
                  .filter(([key]) => matchesFilter(`shadows.${key}`, f))
                  .map(([key, value]) => (
                    <ShadowItem key={key} onClick={() => copy(value)}>
                      <ShadowCard $shadow={value}>
                        <TokenLabel>{key}</TokenLabel>
                      </ShadowCard>
                      <TokenMono style={{ maxWidth: 200, wordBreak: 'break-all', textAlign: 'center' }}>
                        {value}
                      </TokenMono>
                    </ShadowItem>
                  ))}
              </ShadowGrid>
            </SectionCard>
          </Section>

          {/* ═══════ 6. BLUR ═══════ */}
          {matchesFilter('blur frosted glass', f) && (
            <Section id="blur">
              <SectionCard>
                <SectionTitle>Blur Effects</SectionTitle>
                <HeroSubtitle style={{ marginBottom: 24 }}>
                  Frosted glass overlays using backdrop-filter. Click to copy the value.
                </HeroSubtitle>
                <BlurGrid>
                  {(Object.entries(theme.blur) as [string, string][]).map(([key, value]) => (
                    <BlurItem key={key} onClick={() => copy(value)}>
                      <BlurBox $blur={value} />
                      <TokenLabel>blur.{key}</TokenLabel>
                      <TokenMono>{value}</TokenMono>
                    </BlurItem>
                  ))}
                </BlurGrid>
              </SectionCard>
            </Section>
          )}

          {/* ═══════ 7. BREAKPOINTS ═══════ */}
          {matchesFilter('breakpoints responsive', f) && (
            <Section id="breakpoints">
              <SectionCard>
                <SectionTitle>Breakpoints</SectionTitle>
                <HeroSubtitle style={{ marginBottom: 24 }}>
                  Responsive breakpoints with current window width indicator.
                </HeroSubtitle>
                <BreakpointsBar>
                  {(Object.entries(theme.breakpoints) as [string, string][]).map(([key, value]) => {
                    const px = parseInt(value);
                    const pct = Math.min((px / 1400) * 100, 98);
                    return (
                      <BreakpointMarker key={key} $left={`${pct}%`} onClick={() => copy(value)}>
                        <BreakpointTag>{key}: {value}</BreakpointTag>
                      </BreakpointMarker>
                    );
                  })}
                  <CurrentWidthMarker
                    $left={`${Math.min((window.innerWidth / 1400) * 100, 98)}%`}
                    data-label={`Current: ${window.innerWidth}px`}
                  />
                </BreakpointsBar>
                <div style={{ marginTop: 16 }}>
                  {(Object.entries(theme.breakpoints) as [string, string][]).map(([key, value]) => (
                    <SpacingRow key={key} onClick={() => copy(value)}>
                      <SpacingLabel>
                        <TokenLabel>{key}</TokenLabel>
                        <TokenMono>{value}</TokenMono>
                      </SpacingLabel>
                    </SpacingRow>
                  ))}
                </div>
              </SectionCard>
            </Section>
          )}

          {/* ═══════ 8. Z-INDEX ═══════ */}
          {matchesFilter('zindex z-index layer stack', f) && (
            <Section id="zindex">
              <SectionCard>
                <SectionTitle>Z-index</SectionTitle>
                <HeroSubtitle style={{ marginBottom: 24 }}>
                  Layering system — stacked cards show relative z-levels. Click to copy.
                </HeroSubtitle>
                <ZIndexStack>
                  {(Object.entries(theme.zIndex) as [string, number][]).map(([key, value], idx) => {
                    const colors = ['#3384F4', '#22C55E', '#F59E0B', '#DC2828', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];
                    return (
                      <ZIndexCard
                        key={key}
                        $zIndex={value || idx}
                        $offset={idx}
                        $color={colors[idx % colors.length]}
                        onClick={() => copy(String(value))}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <TokenLabel>{key}</TokenLabel>
                          <TokenMono>{value}</TokenMono>
                        </div>
                      </ZIndexCard>
                    );
                  })}
                </ZIndexStack>
              </SectionCard>
            </Section>
          )}

          {/* ═══════ 9. LINE HEIGHTS ═══════ */}
          {matchesFilter('line height leading', f) && (
            <Section id="lineheights">
              <SectionCard>
                <SectionTitle>Line Heights</SectionTitle>
                <LineHeightRow>
                  {(Object.entries(theme.typography.lineHeights) as [string, number][]).map(([key, value]) => (
                    <LineHeightBox key={key} onClick={() => copy(String(value))} style={{ cursor: 'pointer' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TokenLabel>{key}</TokenLabel>
                        <TokenMono>{value}</TokenMono>
                      </div>
                      <LineHeightText $lh={value}>
                        The quick brown fox jumps over the lazy dog. Typography is the art and technique
                        of arranging type to make written language legible and appealing.
                      </LineHeightText>
                    </LineHeightBox>
                  ))}
                </LineHeightRow>
              </SectionCard>
            </Section>
          )}

          {/* ═══════ 10. BUTTON SIZES ═══════ */}
          {matchesFilter('button size spec', f) && (
            <Section id="buttonsizes">
              <SectionCard>
                <SectionTitle>Button Sizes</SectionTitle>
                <SubsectionTitle>Specs</SubsectionTitle>
                <SpecTable>
                  <thead>
                    <tr>
                      <th>Size</th>
                      <th>Height</th>
                      <th>Padding</th>
                      <th>Radius</th>
                      <th>Font Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr onClick={() => copy('buttons.sm')}>
                      <td style={{ fontWeight: 500, color: theme.colors.text.primary, fontFamily: 'inherit' }}>sm</td>
                      <td>{theme.buttons.sm.height}</td>
                      <td>{theme.buttons.sm.padding}</td>
                      <td>{theme.buttons.sm.radius}</td>
                      <td>{theme.buttons.sm.fontSize}</td>
                    </tr>
                    <tr onClick={() => copy('buttons.lg')}>
                      <td style={{ fontWeight: 500, color: theme.colors.text.primary, fontFamily: 'inherit' }}>lg</td>
                      <td>{theme.buttons.lg.height}</td>
                      <td>{theme.buttons.lg.padding}</td>
                      <td>{theme.buttons.lg.radius}</td>
                      <td>{theme.buttons.lg.fontSize}</td>
                    </tr>
                    <tr onClick={() => copy('buttons.icon')}>
                      <td style={{ fontWeight: 500, color: theme.colors.text.primary, fontFamily: 'inherit' }}>icon</td>
                      <td>{theme.buttons.icon.size}</td>
                      <td>--</td>
                      <td>{theme.buttons.icon.radius}</td>
                      <td>--</td>
                    </tr>
                  </tbody>
                </SpecTable>
                <SubsectionTitle>Rendered</SubsectionTitle>
                <ButtonCellRow>
                  <Button $variant="primary" $size="sm">Small</Button>
                  <Button $variant="primary" $size="lg">Large</Button>
                  <Button $variant="secondary" $size="sm">Small</Button>
                  <Button $variant="secondary" $size="lg">Large</Button>
                </ButtonCellRow>
              </SectionCard>
            </Section>
          )}

          {/* ═══════ 11. BORDERS ═══════ */}
          {matchesFilter('border stroke divider', f) && (
            <Section id="borders">
              <SectionCard>
                <SectionTitle>Borders & Strokes</SectionTitle>
                <BorderGrid>
                  <BorderCard $border={`1px solid ${theme.colors.border.light}`} onClick={() => copy(theme.colors.border.light)}>
                    <TokenLabel>border.light</TokenLabel>
                    <TokenMono>1px — card borders, dividers</TokenMono>
                  </BorderCard>
                  <BorderCard $border={`1px solid ${theme.colors.border.medium}`} onClick={() => copy(theme.colors.border.medium)}>
                    <TokenLabel>border.medium</TokenLabel>
                    <TokenMono>1px — hover, active states</TokenMono>
                  </BorderCard>
                  <BorderCard $border={`2px solid ${theme.colors.border.focus}`} onClick={() => copy(theme.colors.border.focus)}>
                    <TokenLabel>border.focus</TokenLabel>
                    <TokenMono>2px — focus ring</TokenMono>
                  </BorderCard>
                </BorderGrid>
                <SubsectionDivider>
                  <SubsectionTitle>Divider</SubsectionTitle>
                  <div style={{ padding: '0 16px' }}>
                    <TokenMono>1px solid border.light</TokenMono>
                    <DividerLine />
                    <TokenMono>Used between list items, section separators</TokenMono>
                  </div>
                </SubsectionDivider>
              </SectionCard>
            </Section>
          )}

          {/* ═══════ 12. BUTTONS ═══════ */}
          <Section id="buttons">
            <SectionCard>
              <SectionTitle>Buttons</SectionTitle>

              {/* Shared Button component — primary / secondary / ghost × sm / lg */}
              <ButtonGrid>
                {(['primary', 'secondary', 'ghost'] as const).map((variant) =>
                  (['sm', 'lg'] as const).map((size) =>
                    matchesFilter(`${variant} ${size}`, f) ? (
                      <ButtonCell key={`${variant}-${size}`}>
                        <ButtonCellLabel>
                          {variant} / {size}
                        </ButtonCellLabel>
                        <ButtonCellRow>
                          <Button $variant={variant} $size={size}>
                            {variant.charAt(0).toUpperCase() + variant.slice(1)} {size}
                          </Button>
                        </ButtonCellRow>
                      </ButtonCell>
                    ) : null,
                  ),
                )}
              </ButtonGrid>

              {/* Nav CTAs */}
              {matchesFilter('nav cta topnav login mobile', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Nav CTAs</ComponentFrameName>
                    <ComponentFrameUsage>TopNav — desktop (34px) and mobile menu (48px full-width)</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <BadgeRowTight>
                    <NavCTADemo>Log in</NavCTADemo>
                    <MobileCTADemo>Log in</MobileCTADemo>
                  </BadgeRowTight>
                </ComponentFrame>
              )}

              {/* Action button with icon */}
              {matchesFilter('action button icon dark section header', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Action Button (dark + icon)</ComponentFrameName>
                    <ComponentFrameUsage>
                      SectionHeader / WidgetStudioSection.AccessBtn / TemplatesGallery.ExploreBtn — same visual, 3 call sites
                    </ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <BadgeRowTight>
                    <ActionButtonDemo>View all<ArrowRight /></ActionButtonDemo>
                    <ActionButtonDemo><ExternalLink />Explore</ActionButtonDemo>
                  </BadgeRowTight>
                </ComponentFrame>
              )}

              {/* Banner CTAs */}
              {matchesFilter('banner cta consent cookie email verification resend accept', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Banner CTAs</ComponentFrameName>
                    <ComponentFrameUsage>ConsentBanner (AcceptBtn) · EmailVerificationBanner (ResendBtn, warm outline pill)</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <BadgeRowTight>
                    <AcceptBtnDemo>Got it</AcceptBtnDemo>
                    <ResendBtnDemo>Resend email</ResendBtnDemo>
                  </BadgeRowTight>
                </ComponentFrame>
              )}

              {/* Icon-only buttons */}
              {matchesFilter('icon only cart burger close menu', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Icon-only buttons</ComponentFrameName>
                    <ComponentFrameUsage>TopNav cart / burger · cart item remove (danger hover)</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <BadgeRowTight>
                    <BurgerButtonDemo title="Menu"><Menu /></BurgerButtonDemo>
                    <CartButtonDemo title="Cart"><ShoppingBag /></CartButtonDemo>
                    <CartRemoveBtnDemo title="Remove (danger on hover)"><Trash2 /></CartRemoveBtnDemo>
                  </BadgeRowTight>
                </ComponentFrame>
              )}

              {/* Cart checkout — full-width dark CTA */}
              {matchesFilter('cart checkout full width cta', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Cart Checkout (full-width)</ComponentFrameName>
                    <ComponentFrameUsage>TopNav cart footer — 44px full-width dark</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <CartCheckoutBtnDemo>Checkout · $12</CartCheckoutBtnDemo>
                </ComponentFrame>
              )}

              {/* Card overlay actions — dashboard */}
              {matchesFilter('overlay card dashboard action edit delete danger', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Card Overlay Actions</ComponentFrameName>
                    <ComponentFrameUsage>DashboardViews widget cards — shown over card art on hover, default + danger variant</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <OverlayStage>
                    <OverlayBtnDemo><Pencil />Edit</OverlayBtnDemo>
                    <OverlayBtnDemo $danger><Trash2 />Delete</OverlayBtnDemo>
                  </OverlayStage>
                </ComponentFrame>
              )}
            </SectionCard>
          </Section>

          {/* ═══════ 7. TRANSITIONS ═══════ */}
          <Section id="transitions">
            <SectionCard>
              <SectionTitle>Transitions</SectionTitle>
              <HeroSubtitle style={{ marginBottom: 24 }}>
                Hover to see before/after transition effect.
              </HeroSubtitle>
              <TransitionGrid>
                {(Object.entries(theme.transitions) as [string, string][])
                  .filter(([key]) => matchesFilter(`transitions.${key}`, f))
                  .map(([key, value]) => (
                    <TransitionItem key={key} onClick={() => copy(value)}>
                      <TransitionBox $transition={value}>
                        <TokenLabel style={{ fontSize: 12 }}>Before</TokenLabel>
                        <TransitionLabel>{key}</TransitionLabel>
                      </TransitionBox>
                      <TokenMono>{value}</TokenMono>
                    </TransitionItem>
                  ))}
              </TransitionGrid>
            </SectionCard>
          </Section>

          {/* ═══════ 8. COMPONENTS ═══════ */}
          <Section id="components">
            <SectionCard>
              <SectionTitle>Components</SectionTitle>

              {matchesFilter('filterchip chip', f) && (
                <ComponentBox>
                  <ComponentLabel>FilterChip</ComponentLabel>
                  <ButtonCellRow>
                    <FilterChip $active={true}>Active Chip</FilterChip>
                    <FilterChip $active={false}>Inactive Chip</FilterChip>
                  </ButtonCellRow>
                </ComponentBox>
              )}

              {matchesFilter('backbutton back', f) && (
                <ComponentBox>
                  <ComponentLabel>BackButton</ComponentLabel>
                  <BackButton label="Back to Home" onClick={() => window.history.back()} />
                </ComponentBox>
              )}

              {matchesFilter('sectionheader header', f) && (
                <ComponentBox>
                  <ComponentLabel>SectionHeader</ComponentLabel>
                  <SectionHeader
                    title="Featured Widgets"
                    subtitle="Browse our most popular widget designs"
                    actionLabel="View all"
                    onAction={() => {}}
                  />
                </ComponentBox>
              )}

              {matchesFilter('footer', f) && (
                <ComponentBox>
                  <ComponentLabel>Footer</ComponentLabel>
                  <Footer left="Peachy Studio" right="Design System" />
                </ComponentBox>
              )}
            </SectionCard>
          </Section>
          {/* ═══════ 16. SITE COMPONENTS ═══════ */}
          <Section id="sitecomponents">
            <SectionCard>
              <SectionTitle>Site Components</SectionTitle>

              {/* Navigation Bar */}
              {matchesFilter('navigation nav bar topnav', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Navigation Bar</ComponentFrameName>
                    <ComponentFrameUsage>Used in: All pages</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <MiniNavBar>
                    <MiniNavLogo>Peachy</MiniNavLogo>
                    <MiniNavLinks>
                      <MiniNavLink $active>Templates</MiniNavLink>
                      <MiniNavLink>Studio</MiniNavLink>
                      <MiniNavLink>Dev</MiniNavLink>
                    </MiniNavLinks>
                  </MiniNavBar>
                </ComponentFrame>
              )}

              {/* Section Header */}
              {matchesFilter('section header title', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Section Header</ComponentFrameName>
                    <ComponentFrameUsage>Used in: Landing, Templates</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <SectionHeader
                    title="Popular Templates"
                    subtitle="Ready-made Notion setups with embedded widgets"
                    actionLabel="Browse all"
                    onAction={() => {}}
                  />
                </ComponentFrame>
              )}

              {/* Testimonial Card */}
              {matchesFilter('testimonial review card', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Testimonial Card</ComponentFrameName>
                    <ComponentFrameUsage>Used in: Landing</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <TestimonialCardMini>
                    <TestimonialHeader>
                      <TestimonialAvatar $color="#6366F1">AK</TestimonialAvatar>
                      <div>
                        <TestimonialName>Anna Kovacs</TestimonialName>
                        <TestimonialRole>Product Designer at Figma</TestimonialRole>
                      </div>
                    </TestimonialHeader>
                    <TestimonialStars>
                      {[...Array(5)].map((_, i) => <Star key={i} />)}
                    </TestimonialStars>
                    <TestimonialText>
                      Finally a widget tool that doesn't look like it's from 2015. The calendar fits perfectly into my Notion setup.
                    </TestimonialText>
                  </TestimonialCardMini>
                </ComponentFrame>
              )}

              {/* Pinterest Pin */}
              {matchesFilter('pinterest pin card gallery', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Pinterest Pin</ComponentFrameName>
                    <ComponentFrameUsage>Used in: Landing (PinterestGallery)</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <MiniPinCard $bg="#F0E6FF" style={{ width: 180 }}>
                      <MiniPinTitle>Life OS</MiniPinTitle>
                      <MiniPinSub>Complete Notion template</MiniPinSub>
                    </MiniPinCard>
                    <MiniPinCard $bg="#1c1c1e" $color="#ffffff" style={{ width: 180 }}>
                      <MiniPinTitle>Dark Mode</MiniPinTitle>
                      <MiniPinSub>Sleek dark widgets</MiniPinSub>
                    </MiniPinCard>
                  </div>
                </ComponentFrame>
              )}

              {/* Feature Card Tab */}
              {matchesFilter('feature card tab header', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Feature Card Tab</ComponentFrameName>
                    <ComponentFrameUsage>Used in: Landing (FeatureCardsSection)</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <FeatureTabMini>
                    <FeatureTabHeader $bg="#3384F4">Customizable Widgets</FeatureTabHeader>
                    <FeatureTabBody>
                      Pick colors, fonts, and layouts. Every widget adapts to your Notion workspace.
                    </FeatureTabBody>
                  </FeatureTabMini>
                </ComponentFrame>
              )}

              {/* Filter Chips */}
              {matchesFilter('filter chip active inactive tag', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Filter Chips</ComponentFrameName>
                    <ComponentFrameUsage>Used in: Landing, Templates</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <ButtonCellRow>
                    <FilterChip $active={true}>All Widgets</FilterChip>
                    <FilterChip $active={false}>Calendar</FilterChip>
                    <FilterChip $active={false}>Clock</FilterChip>
                    <FilterChip $active={false}>Templates</FilterChip>
                  </ButtonCellRow>
                </ComponentFrame>
              )}

              {/* Color Picker mini */}
              {matchesFilter('color picker swatch hex', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Color Picker (inline)</ComponentFrameName>
                    <ComponentFrameUsage>Used in: Studio (CustomizationPanel)</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <ColorPickerMini>
                    <ColorSwatch $color="#3384F4" />
                    <ColorSwatch $color="#6E7FF2" />
                    <ColorSwatch $color="#7C63B8" />
                    <ColorSwatch $color="#E89A78" />
                    <ColorHexInput>#3384F4</ColorHexInput>
                  </ColorPickerMini>
                </ComponentFrame>
              )}

              {/* Toggle Switch */}
              {matchesFilter('toggle switch on off', f) && (
                <ToggleSwitchFrame copy={copy} />
              )}

              {/* Input Field */}
              {matchesFilter('input field text placeholder', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Input Field</ComponentFrameName>
                    <ComponentFrameUsage>Used in: Studio, Design System</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                    <MiniInput placeholder="Widget name..." />
                    <MiniInput placeholder="Search templates..." style={{ borderColor: theme.colors.border.focus }} />
                  </div>
                </ComponentFrame>
              )}

              {/* Mobile Tab Bar */}
              {matchesFilter('mobile tab bar bottom navigation', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Mobile Tab Bar</ComponentFrameName>
                    <ComponentFrameUsage>Used in: Landing (mobile), Studio (mobile)</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <MobileTabBarMini>
                    <MobileTabItem $active><Home /><span>Home</span></MobileTabItem>
                    <MobileTabItem><Calendar /><span>Calendar</span></MobileTabItem>
                    <MobileTabItem><Clock /><span>Clock</span></MobileTabItem>
                    <MobileTabItem><Settings /><span>Settings</span></MobileTabItem>
                  </MobileTabBarMini>
                </ComponentFrame>
              )}

              {/* Upgrade Button (studio gallery card) */}
              {matchesFilter('upgrade pro customize studio button', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Gallery Card Action (Upgrade / Customize)</ComponentFrameName>
                    <ComponentFrameUsage>Used in: WidgetStudioPage widget gallery cards — swaps on plan</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <UpgradeStateGrid>
                    <UpgradeStateCell>
                      <UpgradeStateLabel>Free / quota reached</UpgradeStateLabel>
                      <CustomizeBtnDemo $pro><span>✦</span>Upgrade</CustomizeBtnDemo>
                    </UpgradeStateCell>
                    <UpgradeStateCell>
                      <UpgradeStateLabel>Pro / within quota</UpgradeStateLabel>
                      <CustomizeBtnDemo><Pencil /> Customize</CustomizeBtnDemo>
                    </UpgradeStateCell>
                  </UpgradeStateGrid>
                </ComponentFrame>
              )}

              {/* Full Nav Avatar Dropdown — all rows, both Pro/Free states */}
              {matchesFilter('avatar dropdown nav menu user profile upgrade pro free plan logout', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Nav Avatar Dropdown (full)</ComponentFrameName>
                    <ComponentFrameUsage>
                      TopNav.tsx:592 — complete menu. Rows: user card · plan widget (Pro) / Upgrade CTA (Free) · Dashboard · Settings · divider · Logout (destructive)
                    </ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <UpgradeStateGrid>
                    <UpgradeStateCell>
                      <UpgradeStateLabel>Free plan</UpgradeStateLabel>
                      <AvatarDropdownFull>
                        <DropdownUserCard>
                          <DropdownAvatarCircle>AK</DropdownAvatarCircle>
                          <div style={{ minWidth: 0 }}>
                            <DropdownUserName>Aliya Kovacs</DropdownUserName>
                            <DropdownUserEmail>aliya@example.com</DropdownUserEmail>
                          </div>
                        </DropdownUserCard>
                        <div style={{ padding: '8px 8px 4px' }}>
                          <DropdownRowUpgrade>
                            <ArrowUpRight style={{ width: 14, height: 14, strokeWidth: 2, color: '#6366F1', flexShrink: 0 }} />
                            <span style={{ flex: 1, textAlign: 'left' }}>Upgrade to Pro</span>
                            <DropdownUpgradeBadge>$4/mo</DropdownUpgradeBadge>
                          </DropdownRowUpgrade>
                        </div>
                        <div style={{ padding: '4px 8px 8px' }}>
                          <DropdownMenuItem>
                            <Home style={{ width: 15, height: 15, strokeWidth: 1.75, color: '#8E8E93', flexShrink: 0 }} />
                            Dashboard
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings style={{ width: 15, height: 15, strokeWidth: 1.75, color: '#8E8E93', flexShrink: 0 }} />
                            Settings
                          </DropdownMenuItem>
                        </div>
                        <DropdownDivider />
                        <div style={{ padding: '8px' }}>
                          <DropdownLogoutItem>
                            <LogOut style={{ width: 15, height: 15, strokeWidth: 1.75, flexShrink: 0 }} />
                            Log out
                          </DropdownLogoutItem>
                        </div>
                      </AvatarDropdownFull>
                    </UpgradeStateCell>
                    <UpgradeStateCell>
                      <UpgradeStateLabel>Pro plan</UpgradeStateLabel>
                      <AvatarDropdownFull>
                        <DropdownUserCard>
                          <DropdownAvatarCircle>AK</DropdownAvatarCircle>
                          <div style={{ minWidth: 0 }}>
                            <DropdownUserName>Aliya Kovacs</DropdownUserName>
                            <DropdownUserEmail>aliya@example.com</DropdownUserEmail>
                          </div>
                        </DropdownUserCard>
                        <div style={{ padding: '8px 8px 4px' }}>
                          <DropdownPlanRow>
                            <PlanBadge $pro>Pro</PlanBadge>
                            <span style={{ fontSize: 12.5, fontWeight: 600, color: '#4F46E5' }}>Unlimited widgets</span>
                          </DropdownPlanRow>
                        </div>
                        <div style={{ padding: '4px 8px 8px' }}>
                          <DropdownMenuItem>
                            <Home style={{ width: 15, height: 15, strokeWidth: 1.75, color: '#8E8E93', flexShrink: 0 }} />
                            Dashboard
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings style={{ width: 15, height: 15, strokeWidth: 1.75, color: '#8E8E93', flexShrink: 0 }} />
                            Settings
                          </DropdownMenuItem>
                        </div>
                        <DropdownDivider />
                        <div style={{ padding: '8px' }}>
                          <DropdownLogoutItem>
                            <LogOut style={{ width: 15, height: 15, strokeWidth: 1.75, flexShrink: 0 }} />
                            Log out
                          </DropdownLogoutItem>
                        </div>
                      </AvatarDropdownFull>
                    </UpgradeStateCell>
                  </UpgradeStateGrid>
                </ComponentFrame>
              )}
            </SectionCard>
          </Section>

          {/* ═══════ 17. MODALS & BANNERS ═══════ */}
          <Section id="modals">
            <SectionCard>
              <SectionTitle>Modals & Banners</SectionTitle>

              {matchesFilter('upgrade modal pro', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>UpgradeModal</ComponentFrameName>
                    <ComponentFrameUsage>Studio quota reached, Pro-locked styles</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <ModalStage data-ux="Demo UpgradeModal">
                    <ModalCardDemo>
                      <ModalTitle>Upgrade to Pro</ModalTitle>
                      <ModalSubtitle>Unlock unlimited widgets, all styles, and premium features.</ModalSubtitle>
                      <ModalCompare>
                        <PlanCol>
                          <PlanTitle>Free</PlanTitle>
                          <PlanPrice>$0</PlanPrice>
                          <PlanLi>3 widgets</PlanLi>
                          <PlanLi>Basic styles</PlanLi>
                        </PlanCol>
                        <PlanCol $highlight>
                          <PopularPill>Popular</PopularPill>
                          <PlanTitle>Pro</PlanTitle>
                          <PlanPrice>$4<span>/mo</span></PlanPrice>
                          <PlanLi>Unlimited widgets</PlanLi>
                          <PlanLi>All premium styles</PlanLi>
                        </PlanCol>
                      </ModalCompare>
                    </ModalCardDemo>
                  </ModalStage>
                </ComponentFrame>
              )}

              {matchesFilter('name widget modal rename dialog', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Name Widget Modal</ComponentFrameName>
                    <ComponentFrameUsage>StylePickerPanel when creating/renaming a widget</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <ModalStage data-ux="Demo NameModal">
                    <ModalCardDemo style={{ maxWidth: 360 }}>
                      <ModalTitle style={{ fontSize: 18 }}>Name your widget</ModalTitle>
                      <ModalInput placeholder="My new widget" defaultValue="Spring Planner" />
                      <ModalActions>
                        <ModalBtn>Cancel</ModalBtn>
                        <ModalBtn $primary>Create</ModalBtn>
                      </ModalActions>
                    </ModalCardDemo>
                  </ModalStage>
                </ComponentFrame>
              )}

              {matchesFilter('consent cookie banner bar', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>ConsentBanner (Cookies)</ComponentFrameName>
                    <ComponentFrameUsage>Global — first visit only</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
                    <ConsentBar data-ux="Demo ConsentBanner">
                      <span>We use cookies to make Peachy better. Only essentials are loaded by default.</span>
                      <ConsentBtn>Got it</ConsentBtn>
                    </ConsentBar>
                  </div>
                </ComponentFrame>
              )}

              {matchesFilter('email verification banner', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>EmailVerificationBanner</ComponentFrameName>
                    <ComponentFrameUsage>Top of page when email unverified</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <VerifyBar data-ux="Demo EmailVerificationBanner">
                    <VerifyDot />
                    <span>Please verify your email — we sent a link to ziyazovaa@gmail.com</span>
                    <VerifyAction>Resend</VerifyAction>
                  </VerifyBar>
                </ComponentFrame>
              )}

              {matchesFilter('toast snackbar alert notification', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Toasts</ComponentFrameName>
                    <ComponentFrameUsage>Copy confirmations, save notifications, errors</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <ToastPill data-ux="Demo Toast Success"><Check /> Saved</ToastPill>
                    <ToastPill data-ux="Demo Toast Copy"><Check /> Link copied</ToastPill>
                    <ToastPill $danger data-ux="Demo Toast Error">Failed to save</ToastPill>
                  </div>
                </ComponentFrame>
              )}
            </SectionCard>
          </Section>

          {/* ═══════ 18. LABELS & BADGES ═══════ */}
          <Section id="badges">
            <SectionCard>
              <SectionTitle>Labels & Badges</SectionTitle>

              {matchesFilter('pro badge premium', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Status Badges</ComponentFrameName>
                    <ComponentFrameUsage>Pro / New / Free / Limited — each represents tier/state</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    <ProPill data-ux="Demo ProBadge"><Star fill="currentColor" strokeWidth={0} /><span>Pro</span></ProPill>
                    <NewPill data-ux="Demo NewBadge">NEW</NewPill>
                    <FreePill data-ux="Demo FreeBadge">FREE</FreePill>
                    <LimitedPill data-ux="Demo LimitedBadge">Limited</LimitedPill>
                  </div>
                </ComponentFrame>
              )}

              {matchesFilter('plan pill pricing popular', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Plan / Popular pills</ComponentFrameName>
                    <ComponentFrameUsage>Pricing cards, dashboard plan indicator</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', position: 'relative', height: 40 }}>
                    <PopularPill style={{ position: 'static' }} data-ux="Demo PopularBadge">Popular</PopularPill>
                    <PlanPill $pro data-ux="Demo PlanPill Pro">PRO</PlanPill>
                    <PlanPill data-ux="Demo PlanPill Free">FREE</PlanPill>
                  </div>
                </ComponentFrame>
              )}

              {/* Compact plan badge — used inside cards (Settings, avatar dropdown) */}
              {matchesFilter('plan badge compact gradient settings dropdown', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Plan Badge (compact, inside cards)</ComponentFrameName>
                    <ComponentFrameUsage>SettingsPage profile card · TopNav avatar dropdown Pro row. Smaller+bolder than PlanPill.</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <BadgeRowTight>
                    <PlanBadge $pro>Pro</PlanBadge>
                    <PlanBadge>Free</PlanBadge>
                  </BadgeRowTight>
                </ComponentFrame>
              )}

              {/* Category chip (landing marquee) */}
              {matchesFilter('category chip marquee landing tag', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Category Chip</ComponentFrameName>
                    <ComponentFrameUsage>CategoriesMarquee on landing — color-tinted per category, leading square dot</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <BadgeRowTight>
                    <CategoryChipDemo $color="#6366F1">Productivity</CategoryChipDemo>
                    <CategoryChipDemo $color="#F4A672">Planning</CategoryChipDemo>
                    <CategoryChipDemo $color="#7FA96B">Study</CategoryChipDemo>
                    <CategoryChipDemo $color="#E89B9B">Wellness</CategoryChipDemo>
                  </BadgeRowTight>
                </ComponentFrame>
              )}

              {/* Category tag (template detail metadata) */}
              {matchesFilter('category tag template detail metadata', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Category Tag</ComponentFrameName>
                    <ComponentFrameUsage>TemplateDetailPage info meta — inline metadata tag, surface-bg</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <BadgeRowTight>
                    <CategoryTagDemo>Productivity</CategoryTagDemo>
                    <CategoryTagDemo>Notion</CategoryTagDemo>
                  </BadgeRowTight>
                </ComponentFrame>
              )}

              {/* Overlay card labels — sit over card art, need a visible stage */}
              {matchesFilter('overlay card label widget template glass', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Overlay Card Labels</ComponentFrameName>
                    <ComponentFrameUsage>
                      CardBadge (TemplatesPage card) · WidgetLabel (StudioPage card) — glassy overlays pinned top-left of card art
                    </ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <GlassStage>
                    <CardBadgeDemo>New</CardBadgeDemo>
                    <WidgetLabelDemo>Calendar</WidgetLabelDemo>
                  </GlassStage>
                </ComponentFrame>
              )}

              {/* Section label (eyebrow) */}
              {matchesFilter('section label eyebrow hero micro', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Section Label (eyebrow)</ComponentFrameName>
                    <ComponentFrameUsage>HeroSectionV2 panel sections — tiny 9.5px muted label above groupings</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <SectionLabelDemo>FEATURED BY</SectionLabelDemo>
                </ComponentFrame>
              )}

              {/* Social badge compound (hero) */}
              {matchesFilter('social badge hero featured proof avatars stars', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Social Proof Badge (compound)</ComponentFrameName>
                    <ComponentFrameUsage>HeroSection — avatars + divider + stars + text, glassy pill over mesh background</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <GlassStage>
                    <SocialBadgeDemo>
                      <SocialAvatarStack>
                        <SocialAvatar $bg="#FFB3A0" $i={0} />
                        <SocialAvatar $bg="#B8E0D2" $i={1} />
                        <SocialAvatar $bg="#C4A8FF" $i={2} />
                      </SocialAvatarStack>
                      <SocialBadgeDivider />
                      <SocialBadgeStars>★★★★★</SocialBadgeStars>
                      <SocialBadgeDivider />
                      <SocialBadgeText>Loved by <strong>2,400+ users</strong></SocialBadgeText>
                    </SocialBadgeDemo>
                  </GlassStage>
                </ComponentFrame>
              )}

              {matchesFilter('filter chip category', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>FilterChip</ComponentFrameName>
                    <ComponentFrameUsage>Templates gallery filters, Style picker</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <ButtonCellRow>
                    <FilterChip $active>All</FilterChip>
                    <FilterChip $active={false}>Life</FilterChip>
                    <FilterChip $active={false}>Student</FilterChip>
                    <FilterChip $active={false}>Wellness</FilterChip>
                  </ButtonCellRow>
                </ComponentFrame>
              )}

              {matchesFilter('eyebrow social proof', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Eyebrow (Social Proof)</ComponentFrameName>
                    <ComponentFrameUsage>HeroSectionV2 above headline</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <EyebrowDemo data-ux="Demo Eyebrow">
                    <AvatarStack>
                      <MiniAvatar $bg="linear-gradient(135deg, #F8E3D0, #EFCAAB)" />
                      <MiniAvatar $bg="linear-gradient(135deg, #F2D8D8, #E4BEBE)" />
                      <MiniAvatar $bg="linear-gradient(135deg, #DAE0EC, #B9C4D8)" />
                    </AvatarStack>
                    <EyebrowStars>★★★★★</EyebrowStars>
                    <span>Loved by 11,000+ people</span>
                  </EyebrowDemo>
                </ComponentFrame>
              )}

              {matchesFilter('card overlay label lock widget', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Card overlay labels</ComponentFrameName>
                    <ComponentFrameUsage>Studio widget thumbnails, TemplatesGallery, locked variants</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    <WidgetLabelPill data-ux="Demo WidgetLabel">Calendar</WidgetLabelPill>
                    <GalleryLabelPill data-ux="Demo GalleryCardLabel">Planner</GalleryLabelPill>
                    <LockedPill data-ux="Demo LockedPill"><Lock /> Pro</LockedPill>
                  </div>
                </ComponentFrame>
              )}
            </SectionCard>
          </Section>

          {/* ═══════ 19. CARDS ═══════ */}
          <Section id="cards">
            <SectionCard>
              <SectionTitle>Cards</SectionTitle>

              {matchesFilter('template card shop price', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>TemplateCard</ComponentFrameName>
                    <ComponentFrameUsage>/templates shop, landing TemplatesGallery</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <TemplateCardDemo data-ux="Demo TemplateCard Regular">
                      <TemplateCardImg style={{ background: 'linear-gradient(135deg, #FFE4CC, #F9C89E)' }} />
                      <TemplateMeta>
                        <TemplateName>Daily Planner</TemplateName>
                        <TemplatePrice>$10.00</TemplatePrice>
                      </TemplateMeta>
                    </TemplateCardDemo>
                    <TemplateCardDemo data-ux="Demo TemplateCard Pro">
                      <TemplateCardImg style={{ background: 'linear-gradient(135deg, #EADFF5, #D3C6E8)' }}>
                        <ProPill style={{ position: 'absolute', top: 12, right: 12 }}><Star fill="currentColor" strokeWidth={0} /><span>Pro</span></ProPill>
                      </TemplateCardImg>
                      <TemplateMeta>
                        <TemplateName>Life OS</TemplateName>
                        <TemplatePrice>$24.00</TemplatePrice>
                      </TemplateMeta>
                    </TemplateCardDemo>
                  </div>
                </ComponentFrame>
              )}

              {matchesFilter('widget card studio dashboard', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>WidgetCard</ComponentFrameName>
                    <ComponentFrameUsage>Studio My Widgets grid</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <WidgetCardDemo data-ux="Demo WidgetCard">
                    <WidgetPreview style={{ background: '#FAFAF9' }}>
                      <WidgetLabelPill style={{ position: 'absolute', top: 10, left: 10 }}>Calendar</WidgetLabelPill>
                    </WidgetPreview>
                    <WidgetBottomBar>
                      <WidgetCardName>Spring Planner</WidgetCardName>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <IconBtn><Pencil /></IconBtn>
                        <IconBtn $danger><Trash2 /></IconBtn>
                      </div>
                    </WidgetBottomBar>
                  </WidgetCardDemo>
                </ComponentFrame>
              )}

              {matchesFilter('pricing card plan tier', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>PricingCard</ComponentFrameName>
                    <ComponentFrameUsage>/widgets pricing section</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <PricingCardDemo data-ux="Demo PricingCard Free">
                      <PlanTitle>Free</PlanTitle>
                      <PlanPrice>$0</PlanPrice>
                      <PlanSub>forever</PlanSub>
                      <PlanLi>3 widgets</PlanLi>
                      <PlanLi>Basic types</PlanLi>
                    </PricingCardDemo>
                    <PricingCardDemo $highlighted data-ux="Demo PricingCard Pro">
                      <PopularPill>Popular</PopularPill>
                      <PlanTitle>Pro</PlanTitle>
                      <PlanPrice>$4<span>/mo</span></PlanPrice>
                      <PlanSub>monthly</PlanSub>
                      <PlanLi>Unlimited widgets</PlanLi>
                      <PlanLi>All styles</PlanLi>
                    </PricingCardDemo>
                  </div>
                </ComponentFrame>
              )}

              {matchesFilter('testimonial review card', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>TestimonialCard</ComponentFrameName>
                    <ComponentFrameUsage>Landing testimonials marquee</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <TestimonialCardDemo data-ux="Demo TestimonialCard">
                    <EyebrowStars style={{ display: 'block', marginBottom: 10 }}>★★★★★</EyebrowStars>
                    <TestimonialText>An absolute game changer in my daily life.</TestimonialText>
                    <TestimonialDivider />
                    <TestimonialAuthor>
                      <MiniAvatar style={{ width: 28, height: 28 }} $bg="#D4E0EF" />
                      <span>Alyssa</span>
                    </TestimonialAuthor>
                  </TestimonialCardDemo>
                </ComponentFrame>
              )}
            </SectionCard>
          </Section>

          {/* ═══════ 20. FORM ELEMENTS ═══════ */}
          <Section id="forms">
            <SectionCard>
              <SectionTitle>Form Elements</SectionTitle>

              {matchesFilter('input text email password', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Text Input / Textarea</ComponentFrameName>
                    <ComponentFrameUsage>Login, Checkout, Settings, Forms across site</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <FormStack>
                    <FormRow>
                      <FormLabel>Email</FormLabel>
                      <FormInput data-ux="Demo FormInput Email" placeholder="you@example.com" defaultValue="ziyazovaa@gmail.com" />
                    </FormRow>
                    <FormRow>
                      <FormLabel>Password</FormLabel>
                      <FormInput data-ux="Demo FormInput Password" type="password" defaultValue="••••••••" />
                    </FormRow>
                    <FormRow>
                      <FormLabel>Bio</FormLabel>
                      <FormTextarea data-ux="Demo FormTextarea" placeholder="Tell us about yourself" rows={3} />
                    </FormRow>
                  </FormStack>
                </ComponentFrame>
              )}

              {matchesFilter('select dropdown picker native', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Native Select</ComponentFrameName>
                    <ComponentFrameUsage>Inside forms: Settings, Customization panel (for simple enum picks)</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <FormSelect data-ux="Demo FormSelect" defaultValue="auto">
                    <option value="auto">Auto (system)</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </FormSelect>
                </ComponentFrame>
              )}

              {matchesFilter('dropdown menu floating popover profile cart', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Dropdown Menu</ComponentFrameName>
                    <ComponentFrameUsage>Profile menu, cart preview, filter selectors, context actions</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <DropdownWrap data-ux="Demo Dropdown">
                    <DropdownButton>
                      <User />
                      Aliya
                      <ChevronDown style={{ marginLeft: 4 }} />
                    </DropdownButton>
                    <DropdownMenu data-ux="Demo Dropdown Menu Open">
                      <DropdownLabel>Account</DropdownLabel>
                      <DropdownItem><User /> Profile</DropdownItem>
                      <DropdownItem><Settings /> Settings</DropdownItem>
                      <DropdownSeparator />
                      <DropdownLabel>Workspace</DropdownLabel>
                      <DropdownItem><Home /> My widgets</DropdownItem>
                      <DropdownItem><Star /> Templates</DropdownItem>
                      <DropdownSeparator />
                      <DropdownItem $danger><LogOut /> Sign out</DropdownItem>
                    </DropdownMenu>
                  </DropdownWrap>
                </ComponentFrame>
              )}

              {matchesFilter('slider range', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Range Slider</ComponentFrameName>
                    <ComponentFrameUsage>Customization panel (border radius, font size, embed size)</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <FormRow>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <FormLabel>Border Radius</FormLabel>
                      <FormHint>12px</FormHint>
                    </div>
                    <FormRange data-ux="Demo FormRange" type="range" min={0} max={32} defaultValue={12} />
                  </FormRow>
                </ComponentFrame>
              )}

              {matchesFilter('checkbox check', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Checkbox</ComponentFrameName>
                    <ComponentFrameUsage>Settings, Customization panel</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    <CheckboxRow data-ux="Demo Checkbox Checked">
                      <FormCheckbox type="checkbox" defaultChecked />
                      <span>Show weekends</span>
                    </CheckboxRow>
                    <CheckboxRow data-ux="Demo Checkbox Unchecked">
                      <FormCheckbox type="checkbox" />
                      <span>Show day borders</span>
                    </CheckboxRow>
                  </div>
                </ComponentFrame>
              )}

              {matchesFilter('color swatch picker palette', f) && (
                <ComponentFrame>
                  <ComponentFrameHeader>
                    <ComponentFrameName>Color Picker Swatches</ComponentFrameName>
                    <ComponentFrameUsage>Customization panel color selectors</ComponentFrameUsage>
                  </ComponentFrameHeader>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['#6E7FF2', '#7C63B8', '#E89A78', '#F4A672', '#7FA96B', '#3B82F6'].map((c, i) => (
                      <ColorSwatchDemo key={c} $color={c} $active={i === 0} data-ux={`Demo ColorSwatch ${c}`} />
                    ))}
                  </div>
                </ComponentFrame>
              )}
            </SectionCard>
          </Section>

          {/* ═══════ RULES ═══════ */}
          {matchesFilter('rules spacing button border color radius shadow typography transition', f) && (
            <Section id="rules">
              <SectionCard>
                <SectionTitle>Rules</SectionTitle>
                <RulesGrid>
                  <RuleCard>
                    <RuleDot $color="#22C55E" />
                    <RuleContent>
                      <RuleTitle>Spacing Rule</RuleTitle>
                      <RuleDescription>All gaps follow 4/8pt grid: 4, 8, 12, 16, 24, 32, 48, 64px. No exceptions.</RuleDescription>
                    </RuleContent>
                  </RuleCard>
                  <RuleCard>
                    <RuleDot $color="#3384F4" />
                    <RuleContent>
                      <RuleTitle>Button Rule</RuleTitle>
                      <RuleDescription>Two sizes only: sm (36px) and lg (44px). Icon buttons: 40px.</RuleDescription>
                    </RuleContent>
                  </RuleCard>
                  <RuleCard>
                    <RuleDot $color="#8B5CF6" />
                    <RuleContent>
                      <RuleTitle>Border Rule</RuleTitle>
                      <RuleDescription>One border opacity: border.light (rgba 0.06). One hover border: border.medium (rgba 0.12).</RuleDescription>
                    </RuleContent>
                  </RuleCard>
                  <RuleCard>
                    <RuleDot $color="#6B6B6B" />
                    <RuleContent>
                      <RuleTitle>Color Rule</RuleTitle>
                      <RuleDescription>Four grays only: primary (#1F1F1F), secondary (#6B6B6B), tertiary (#9A9A9A), muted (#ABABAB).</RuleDescription>
                    </RuleContent>
                  </RuleCard>
                  <RuleCard>
                    <RuleDot $color="#F59E0B" />
                    <RuleContent>
                      <RuleTitle>Radius Rule</RuleTitle>
                      <RuleDescription>Seven levels: sm(8) button(10) md(12) lg(16) xl(20) 2xl(24) full.</RuleDescription>
                    </RuleContent>
                  </RuleCard>
                  <RuleCard>
                    <RuleDot $color="#9A9A9A" />
                    <RuleContent>
                      <RuleTitle>Shadow Rule</RuleTitle>
                      <RuleDescription>Four levels: form, subtle, medium, heavy. No custom shadows.</RuleDescription>
                    </RuleContent>
                  </RuleCard>
                  <RuleCard>
                    <RuleDot $color="#1F1F1F" />
                    <RuleContent>
                      <RuleTitle>Typography Rule</RuleTitle>
                      <RuleDescription>Nine sizes: 11, 12, 13, 14, 16, 18, 24, 32, 36px. No 15px.</RuleDescription>
                    </RuleContent>
                  </RuleCard>
                  <RuleCard>
                    <RuleDot $color="#7C63B8" />
                    <RuleContent>
                      <RuleTitle>Transition Rule</RuleTitle>
                      <RuleDescription>Three speeds: fast (0.15s), base (0.2s), smooth (0.3s cubic-bezier). No other curves.</RuleDescription>
                    </RuleContent>
                  </RuleCard>
                </RulesGrid>
              </SectionCard>
            </Section>
          )}
        </Content>
      </PageWrap>

      {/* Toast */}
      {toast !== null && (
        <Toast $visible={toast !== null}>
          <Check /> Copied: {toast.length > 40 ? toast.slice(0, 40) + '...' : toast}
        </Toast>
      )}
    </>
  );
};
