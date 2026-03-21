import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '@/presentation/themes/theme';
import { TopNav } from '@/presentation/components/layout/TopNav';
import { Button } from '@/presentation/components/shared/Button';
import { FilterChip } from '@/presentation/components/shared/FilterChip';
import { BackButton } from '@/presentation/components/shared/BackButton';
import { SectionHeader } from '@/presentation/components/shared/SectionHeader';
import { Footer } from '@/presentation/components/shared/Footer';
import { Search, Check, Star, User, Home, Settings, Calendar, Clock, ToggleLeft, ToggleRight, Type } from 'lucide-react';

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
      <TopNav logoSub="Design System" activeLink="dev" />
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
              Peachy Studio — design tokens, components and patterns
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
            </SectionCard>
          </Section>
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
