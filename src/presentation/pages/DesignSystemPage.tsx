import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '@/presentation/themes/theme';
import { TopNav } from '@/presentation/components/layout/TopNav';
import { Button } from '@/presentation/components/shared/Button';
import { FilterChip } from '@/presentation/components/shared/FilterChip';
import { BackButton } from '@/presentation/components/shared/BackButton';
import { SectionHeader } from '@/presentation/components/shared/SectionHeader';
import { Footer } from '@/presentation/components/shared/Footer';
import { Search, Check, Clipboard } from 'lucide-react';

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

/* ── Sections nav data ── */

const SECTIONS = [
  { id: 'colors', label: 'Colors', dot: theme.colors.accent },
  { id: 'typography', label: 'Typography', dot: theme.colors.text.primary },
  { id: 'spacing', label: 'Spacing', dot: theme.colors.success },
  { id: 'radii', label: 'Border Radius', dot: theme.colors.warning },
  { id: 'shadows', label: 'Shadows', dot: '#9A9A9A' },
  { id: 'buttons', label: 'Buttons', dot: theme.colors.destructive },
  { id: 'transitions', label: 'Transitions', dot: '#7C63B8' },
  { id: 'components', label: 'Components', dot: '#E89A78' },
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

          {/* ═══════ 6. BUTTONS ═══════ */}
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
