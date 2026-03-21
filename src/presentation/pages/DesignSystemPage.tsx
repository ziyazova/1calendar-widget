import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '@/presentation/themes/theme';
import { TopNav } from '@/presentation/components/layout/TopNav';
import { Button } from '@/presentation/components/shared/Button';
import { FilterChip } from '@/presentation/components/shared/FilterChip';
import { BackButton } from '@/presentation/components/shared/BackButton';
import { SectionHeader } from '@/presentation/components/shared/SectionHeader';
import { Footer } from '@/presentation/components/shared/Footer';

/* ── Layout ── */

const PageWrap = styled.div`
  display: flex;
  min-height: 100vh;
  background: #ffffff;
`;

const Sidebar = styled.nav`
  position: fixed;
  top: calc(57px + env(safe-area-inset-top, 0px));
  left: 0;
  bottom: 0;
  width: 220px;
  padding: 32px 24px;
  border-right: 1px solid ${({ theme }) => theme.colors.border.light};
  overflow-y: auto;
  background: #ffffff;
  z-index: 10;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SidebarLink = styled.a<{ $active?: boolean }>`
  display: block;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 500 : 400)};
  color: ${({ $active, theme }) =>
    $active ? '#1F1F1F' : theme.colors.text.secondary};
  background: ${({ $active }) =>
    $active ? 'rgba(0, 0, 0, 0.04)' : 'transparent'};
  border-radius: ${({ theme }) => theme.radii.sm};
  text-decoration: none;
  cursor: pointer;
  letter-spacing: -0.01em;
  transition: all 0.15s ease;

  &:hover {
    color: #1f1f1f;
    background: rgba(0, 0, 0, 0.04);
  }
`;

const Content = styled.main`
  margin-left: 220px;
  flex: 1;
  max-width: 1200px;
  padding: 48px 48px 80px;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 32px 24px 64px;
  }
`;

const Section = styled.section`
  margin-bottom: 64px;
  scroll-margin-top: 80px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #1f1f1f;
  letter-spacing: -0.02em;
  margin: 0 0 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const SubsectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: #1f1f1f;
  letter-spacing: -0.01em;
  margin: 0 0 16px;
`;

const TokenLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const TokenValue = styled.span`
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.muted};
`;

/* ── Grids ── */

const SwatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const SwatchCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ColorSquare = styled.div<{ $bg: string; $border?: boolean }>`
  width: 100%;
  height: 64px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $bg }) => $bg};
  border: ${({ $border }) =>
    $border ? '1px solid rgba(0,0,0,0.12)' : '1px solid rgba(0,0,0,0.06)'};
`;

const BorderRect = styled.div<{ $borderColor: string }>`
  width: 100%;
  height: 64px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: #ffffff;
  border: 2px solid ${({ $borderColor }) => $borderColor};
`;

const StatusPill = styled.span<{ $bg: string }>`
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 14px;
  border-radius: 9999px;
  background: ${({ $bg }) => $bg};
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
`;

const GradientRect = styled.div<{ $bg: string }>`
  width: 100%;
  height: 64px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $bg }) => $bg};
`;

/* ── Typography ── */

const TypoRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 24px;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};

  &:last-child {
    border-bottom: none;
  }
`;

const TypoLabel = styled.div`
  width: 100px;
  flex-shrink: 0;
`;

const TypoSample = styled.div<{ $size: string; $weight?: number; $ls?: string }>`
  font-size: ${({ $size }) => $size};
  font-weight: ${({ $weight }) => $weight ?? 400};
  letter-spacing: ${({ $ls }) => $ls ?? '-0.01em'};
  color: #1f1f1f;
`;

/* ── Spacing ── */

const SpacingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
`;

const SpacingBlock = styled.div<{ $size: string }>`
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  min-width: 4px;
  min-height: 4px;
  background: ${({ theme }) => theme.colors.accent};
  border-radius: 4px;
`;

/* ── Radii ── */

const RadiiGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 32px;
`;

const RadiiBox = styled.div<{ $radius: string }>`
  width: 80px;
  height: 80px;
  background: ${({ theme }) => theme.colors.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ $radius }) => $radius};
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* ── Shadows ── */

const ShadowGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 32px;
`;

const ShadowCard = styled.div<{ $shadow: string }>`
  width: 200px;
  height: 100px;
  background: #ffffff;
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ $shadow }) => $shadow};
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* ── Buttons ── */

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

/* ── Transitions ── */

const TransitionBox = styled.div<{ $transition: string }>`
  width: 120px;
  height: 60px;
  background: ${({ theme }) => theme.colors.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.md};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${({ $transition }) => $transition};

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(51, 132, 244, 0.2);
  }
`;

const TransitionGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 32px;
`;

/* ── Component Examples ── */

const ComponentBox = styled.div`
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 16px;
`;

const ComponentLabel = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 16px;
`;

/* ── Sections nav ── */

const SECTIONS = [
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'radii', label: 'Border Radius' },
  { id: 'shadows', label: 'Shadows' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'transitions', label: 'Transitions' },
  { id: 'components', label: 'Components' },
];

export const DesignSystemPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('colors');

  const handleSidebarClick = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <TopNav logoSub="Design System" />
      <PageWrap>
        {/* Sticky sidebar */}
        <Sidebar>
          {SECTIONS.map((s) => (
            <SidebarLink
              key={s.id}
              $active={activeSection === s.id}
              onClick={() => handleSidebarClick(s.id)}
            >
              {s.label}
            </SidebarLink>
          ))}
        </Sidebar>

        <Content>
          {/* ═══════ COLORS ═══════ */}
          <Section id="colors">
            <SectionTitle>Colors</SectionTitle>

            {/* Text colors */}
            <SubsectionTitle>Text</SubsectionTitle>
            <SwatchGrid>
              {(Object.entries(theme.colors.text) as [string, string][]).map(
                ([key, value]) => (
                  <SwatchCard key={key}>
                    <ColorSquare $bg={value} />
                    <TokenLabel>text.{key}</TokenLabel>
                    <TokenValue>{value}</TokenValue>
                  </SwatchCard>
                ),
              )}
            </SwatchGrid>

            {/* Background colors */}
            <SubsectionTitle>Background</SubsectionTitle>
            <SwatchGrid>
              {(
                Object.entries(theme.colors.background) as [string, string][]
              ).map(([key, value]) => (
                <SwatchCard key={key}>
                  <ColorSquare $bg={value} $border />
                  <TokenLabel>background.{key}</TokenLabel>
                  <TokenValue>{value}</TokenValue>
                </SwatchCard>
              ))}
            </SwatchGrid>

            {/* Border colors */}
            <SubsectionTitle>Border</SubsectionTitle>
            <SwatchGrid>
              {(Object.entries(theme.colors.border) as [string, string][]).map(
                ([key, value]) => (
                  <SwatchCard key={key}>
                    <BorderRect $borderColor={value} />
                    <TokenLabel>border.{key}</TokenLabel>
                    <TokenValue>{value}</TokenValue>
                  </SwatchCard>
                ),
              )}
            </SwatchGrid>

            {/* Interactive */}
            <SubsectionTitle>Interactive</SubsectionTitle>
            <SwatchGrid>
              {(
                Object.entries(theme.colors.interactive) as [string, string][]
              ).map(([key, value]) => (
                <SwatchCard key={key}>
                  <ColorSquare $bg={value} $border />
                  <TokenLabel>interactive.{key}</TokenLabel>
                  <TokenValue>{value}</TokenValue>
                </SwatchCard>
              ))}
            </SwatchGrid>

            {/* Status colors */}
            <SubsectionTitle>Status</SubsectionTitle>
            <ButtonRow>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
                <StatusPill $bg={theme.colors.accent}>accent {theme.colors.accent}</StatusPill>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
                <StatusPill $bg={theme.colors.success}>success {theme.colors.success}</StatusPill>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
                <StatusPill $bg={theme.colors.warning}>warning {theme.colors.warning}</StatusPill>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
                <StatusPill $bg={theme.colors.destructive}>destructive {theme.colors.destructive}</StatusPill>
              </div>
            </ButtonRow>

            {/* Gradients */}
            <SubsectionTitle style={{ marginTop: 32 }}>Gradients</SubsectionTitle>
            <SwatchGrid>
              {(
                Object.entries(theme.colors.gradients) as [string, string][]
              ).map(([key, value]) => (
                <SwatchCard key={key}>
                  <GradientRect $bg={value} />
                  <TokenLabel>gradients.{key}</TokenLabel>
                  <TokenValue style={{ wordBreak: 'break-all' }}>{value}</TokenValue>
                </SwatchCard>
              ))}
            </SwatchGrid>
          </Section>

          {/* ═══════ TYPOGRAPHY ═══════ */}
          <Section id="typography">
            <SectionTitle>Typography</SectionTitle>

            <SubsectionTitle>Type Scale</SubsectionTitle>
            <div style={{ marginBottom: 32 }}>
              {(
                Object.entries(theme.typography.sizes) as [string, string][]
              ).map(([key, value]) => (
                <TypoRow key={key}>
                  <TypoLabel>
                    <TokenLabel>{key}</TokenLabel>
                    <br />
                    <TokenValue>{value}</TokenValue>
                  </TypoLabel>
                  <TypoSample $size={value}>
                    The quick brown fox jumps over the lazy dog
                  </TypoSample>
                </TypoRow>
              ))}
            </div>

            <SubsectionTitle>Font Weights</SubsectionTitle>
            <div style={{ marginBottom: 32 }}>
              {(
                Object.entries(theme.typography.weights) as [string, number][]
              ).map(([key, value]) => (
                <TypoRow key={key}>
                  <TypoLabel>
                    <TokenLabel>{key}</TokenLabel>
                    <br />
                    <TokenValue>{value}</TokenValue>
                  </TypoLabel>
                  <TypoSample $size="16px" $weight={value}>
                    The quick brown fox jumps over the lazy dog
                  </TypoSample>
                </TypoRow>
              ))}
            </div>

            <SubsectionTitle>Letter Spacing</SubsectionTitle>
            <div style={{ marginBottom: 32 }}>
              {(
                Object.entries(theme.typography.letterSpacing) as [
                  string,
                  string,
                ][]
              ).map(([key, value]) => (
                <TypoRow key={key}>
                  <TypoLabel>
                    <TokenLabel>{key}</TokenLabel>
                    <br />
                    <TokenValue>{value}</TokenValue>
                  </TypoLabel>
                  <TypoSample $size="16px" $weight={500} $ls={value}>
                    The quick brown fox jumps over the lazy dog
                  </TypoSample>
                </TypoRow>
              ))}
            </div>
          </Section>

          {/* ═══════ SPACING ═══════ */}
          <Section id="spacing">
            <SectionTitle>Spacing</SectionTitle>
            {(Object.entries(theme.spacing) as [string, string][]).map(
              ([key, value]) => (
                <SpacingRow key={key}>
                  <SpacingBlock $size={value === '0' ? '4px' : value} style={value === '0' ? { opacity: 0.3 } : undefined} />
                  <TokenLabel>spacing.{key}</TokenLabel>
                  <TokenValue>{value}</TokenValue>
                </SpacingRow>
              ),
            )}
          </Section>

          {/* ═══════ BORDER RADIUS ═══════ */}
          <Section id="radii">
            <SectionTitle>Border Radius</SectionTitle>
            <RadiiGrid>
              {(Object.entries(theme.radii) as [string, string][]).map(
                ([key, value]) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <RadiiBox $radius={value} />
                    <TokenLabel>{key}</TokenLabel>
                    <TokenValue>{value}</TokenValue>
                  </div>
                ),
              )}
            </RadiiGrid>
          </Section>

          {/* ═══════ SHADOWS ═══════ */}
          <Section id="shadows">
            <SectionTitle>Shadows</SectionTitle>
            <ShadowGrid>
              {(Object.entries(theme.shadows) as [string, string][]).map(
                ([key, value]) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <ShadowCard $shadow={value}>
                      <TokenLabel>{key}</TokenLabel>
                    </ShadowCard>
                    <TokenValue style={{ maxWidth: 200, wordBreak: 'break-all', textAlign: 'center' }}>
                      {value}
                    </TokenValue>
                  </div>
                ),
              )}
            </ShadowGrid>
          </Section>

          {/* ═══════ BUTTONS ═══════ */}
          <Section id="buttons">
            <SectionTitle>Buttons</SectionTitle>

            <SubsectionTitle>Primary</SubsectionTitle>
            <ButtonRow>
              <Button $variant="primary" $size="sm">Primary sm</Button>
              <Button $variant="primary" $size="lg">Primary lg</Button>
            </ButtonRow>

            <SubsectionTitle>Secondary</SubsectionTitle>
            <ButtonRow>
              <Button $variant="secondary" $size="sm">Secondary sm</Button>
              <Button $variant="secondary" $size="lg">Secondary lg</Button>
            </ButtonRow>

            <SubsectionTitle>Ghost</SubsectionTitle>
            <ButtonRow>
              <Button $variant="ghost" $size="sm">Ghost sm</Button>
              <Button $variant="ghost" $size="lg">Ghost lg</Button>
            </ButtonRow>
          </Section>

          {/* ═══════ TRANSITIONS ═══════ */}
          <Section id="transitions">
            <SectionTitle>Transitions</SectionTitle>
            <p style={{ fontSize: 13, color: theme.colors.text.secondary, marginBottom: 16 }}>
              Hover over each box to see the transition in action.
            </p>
            <TransitionGrid>
              {(Object.entries(theme.transitions) as [string, string][]).map(
                ([key, value]) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <TransitionBox $transition={value}>
                      <span style={{ fontSize: 12, fontWeight: 500 }}>Hover me</span>
                    </TransitionBox>
                    <TokenLabel>{key}</TokenLabel>
                    <TokenValue>{value}</TokenValue>
                  </div>
                ),
              )}
            </TransitionGrid>
          </Section>

          {/* ═══════ COMPONENT EXAMPLES ═══════ */}
          <Section id="components">
            <SectionTitle>Components</SectionTitle>

            <ComponentBox>
              <ComponentLabel>FilterChip (active + inactive)</ComponentLabel>
              <ButtonRow>
                <FilterChip $active={true}>Active Chip</FilterChip>
                <FilterChip $active={false}>Inactive Chip</FilterChip>
              </ButtonRow>
            </ComponentBox>

            <ComponentBox>
              <ComponentLabel>BackButton</ComponentLabel>
              <BackButton label="Back to Home" onClick={() => window.history.back()} />
            </ComponentBox>

            <ComponentBox>
              <ComponentLabel>SectionHeader (with title, subtitle, action)</ComponentLabel>
              <SectionHeader
                title="Featured Widgets"
                subtitle="Browse our most popular widget designs"
                actionLabel="View all"
                onAction={() => {}}
              />
            </ComponentBox>

            <ComponentBox>
              <ComponentLabel>Footer</ComponentLabel>
              <Footer left="Peachy Studio" right="Design System" />
            </ComponentBox>
          </Section>
        </Content>
      </PageWrap>
    </>
  );
};
