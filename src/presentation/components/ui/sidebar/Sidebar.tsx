import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronRight, Calendar, Clock, Archive, Image } from 'lucide-react';

interface SidebarProps {
  availableWidgets: string[];
  currentWidget: string;
  onWidgetChange: (type: string, style?: string) => void;
}

const SidebarContainer = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  width: 270px;
  height: 100vh;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  z-index: ${({ theme }) => theme.zIndex.sticky};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
`;

const SidebarHeader = styled.div`
  padding: 0 21px;
  height: 56px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 6px;
`;

const PeachIcon = () => (
  <img src="/studio-logo.png" alt="Logo" width="32" height="32" style={{ objectFit: 'contain', marginBottom: '-4px' }} />
);

const LogoText = styled.h1`
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  color: #1a1a2e;
  margin: 0;
  letter-spacing: -0.02em;

  span {
    color: #94a3b8;
    font-weight: 400;
  }
`;

const NavSection = styled.nav`
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0;
  }
`;

const SectionLabel = styled.h2`
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
  margin: 0 0 12px 0;
  padding: 0 24px;
  text-transform: uppercase;
  letter-spacing: 0.1em;

  &:nth-of-type(n+2) {
    margin-top: 28px;
    padding-top: 20px;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
  }
`;

const WidgetCategory = styled.div`
  margin-bottom: 4px;
`;

const CategoryHeader = styled.button<{ $expanded: boolean; $muted?: boolean }>`
  width: calc(100% - 24px);
  margin: 0 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: ${({ $muted }) => $muted ? '#64748b' : '#334155'};
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
  letter-spacing: -0.01em;

  &:hover {
    background: rgba(99, 102, 241, 0.04);
    color: ${({ $muted }) => $muted ? '#475569' : '#1a1a2e'};
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

const CategoryIcon = styled.div<{ $muted?: boolean }>`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: ${({ $muted }) => $muted
    ? 'rgba(0, 0, 0, 0.04)'
    : 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.08))'};

  svg {
    color: ${({ $muted }) => $muted ? '#94a3b8' : '#6366f1'};
    width: 16px;
    height: 16px;
  }
`;

const StylesList = styled.div<{ $expanded: boolean }>`
  max-height: ${({ $expanded }) => $expanded ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.2s ease;
  padding: 4px 12px 0 12px;
`;

const StyleItem = styled.button<{ $active: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px 7px 44px;
  background: ${({ $active }) => $active ? 'rgba(99, 102, 241, 0.04)' : 'transparent'};
  color: ${({ $active }) => $active ? '#4f46e5' : '#64748b'};
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: ${({ $active }) => $active ? 500 : 400};
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
  margin-bottom: 5px;
  font-family: inherit;
  letter-spacing: -0.01em;

  &:hover {
    background: rgba(99, 102, 241, 0.04);
    color: #4f46e5;
  }

`;

const StyleDot = styled.div<{ $color: string }>`
  width: 6px;
  height: 6px;
  background: ${({ $color }) => $color};
  opacity: 0.45;
  border-radius: 50%;
  flex-shrink: 0;
`;

const CALENDAR_STYLES = [
  { label: 'Default', value: 'modern-grid-zoom-fixed', color: '#d35400' },
  { label: 'Classic', value: 'classic', color: '#6E7FF2' },
  { label: 'Collage', value: 'collage', color: '#a89e8e' },
  { label: 'Typewriter', value: 'typewriter', color: '#7a9bb5' },
];

const ARCHIVE_STYLES = [
  { label: 'Modern Grid', value: 'modern-grid', color: '#667EEA' },
  { label: 'CSS Zoom (layout)', value: 'calendar-2', color: '#e67e22' },
  { label: 'Container Query (layout)', value: 'calendar-4', color: '#3498db' },
  { label: 'SVG ViewBox (layout)', value: 'calendar-6', color: '#1abc9c' },
];

const CLOCK_STYLES = [
  { label: 'Clock', value: 'classic', color: '#6E7FF2' },
  { label: 'Flower', value: 'flower', color: '#2d6a4f' },
  { label: 'Dreamy', value: 'dreamy', color: '#A78BFA' },
];

const BOARD_STYLES = [
  { label: 'Moodboard', value: 'grid', color: '#E91E63' },
];

const CLOCK_ARCHIVE_STYLES = [
  { label: 'Modern Digital', value: 'modern', color: '#43E97B' },
  { label: 'Analog Classic', value: 'analog-classic', color: '#FA709A' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  availableWidgets,
  currentWidget,
  onWidgetChange,
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['calendar']);

  const toggle = (key: string) => {
    setExpandedSections(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  return (
    <SidebarContainer>
      <SidebarHeader>
        <LogoWrapper>
          <PeachIcon />
          <LogoText>Peachy <span>Studio</span></LogoText>
        </LogoWrapper>
      </SidebarHeader>

      <NavSection>
        <SectionLabel>Widgets</SectionLabel>

        {availableWidgets.includes('calendar') && (
          <WidgetCategory>
            <CategoryHeader
              $expanded={expandedSections.includes('calendar')}
              onClick={() => toggle('calendar')}
            >
              <CategoryIcon><Calendar /></CategoryIcon>
              Calendar
              <ChevronRight className="chevron" />
            </CategoryHeader>
            <StylesList $expanded={expandedSections.includes('calendar')}>
              {CALENDAR_STYLES.map((s) => (
                <StyleItem
                  key={s.value}
                  $active={currentWidget === `calendar-${s.value}`}
                  onClick={() => onWidgetChange('calendar', s.value)}
                >
                  <StyleDot $color={s.color} />
                  {s.label}
                </StyleItem>
              ))}
            </StylesList>
          </WidgetCategory>
        )}

        {availableWidgets.includes('clock') && (
          <WidgetCategory>
            <CategoryHeader
              $expanded={expandedSections.includes('clock')}
              onClick={() => toggle('clock')}
            >
              <CategoryIcon><Clock /></CategoryIcon>
              Clock
              <ChevronRight className="chevron" />
            </CategoryHeader>
            <StylesList $expanded={expandedSections.includes('clock')}>
              {CLOCK_STYLES.map((s) => (
                <StyleItem
                  key={s.value}
                  $active={currentWidget === `clock-${s.value}`}
                  onClick={() => onWidgetChange('clock', s.value)}
                >
                  <StyleDot $color={s.color} />
                  {s.label}
                </StyleItem>
              ))}
            </StylesList>
          </WidgetCategory>
        )}

        {availableWidgets.includes('board') && (
          <WidgetCategory>
            <CategoryHeader
              $expanded={expandedSections.includes('board')}
              onClick={() => toggle('board')}
            >
              <CategoryIcon><Image /></CategoryIcon>
              Board
              <ChevronRight className="chevron" />
            </CategoryHeader>
            <StylesList $expanded={expandedSections.includes('board')}>
              {BOARD_STYLES.map((s) => (
                <StyleItem
                  key={s.value}
                  $active={currentWidget === `board-${s.value}`}
                  onClick={() => onWidgetChange('board', s.value)}
                >
                  <StyleDot $color={s.color} />
                  {s.label}
                </StyleItem>
              ))}
            </StylesList>
          </WidgetCategory>
        )}

        <SectionLabel>Archive</SectionLabel>

        <WidgetCategory>
          <CategoryHeader
            $expanded={expandedSections.includes('archive')}
            $muted
            onClick={() => toggle('archive')}
          >
            <CategoryIcon $muted><Archive /></CategoryIcon>
            Layout Experiments
            <ChevronRight className="chevron" />
          </CategoryHeader>
          <StylesList $expanded={expandedSections.includes('archive')}>
            {ARCHIVE_STYLES.map((s) => (
              <StyleItem
                key={s.value}
                $active={currentWidget === `calendar-${s.value}`}
                onClick={() => onWidgetChange('calendar', s.value)}
              >
                <StyleDot $color={s.color} />
                {s.label}
              </StyleItem>
            ))}
          </StylesList>
        </WidgetCategory>

        <WidgetCategory>
          <CategoryHeader
            $expanded={expandedSections.includes('clock-archive')}
            $muted
            onClick={() => toggle('clock-archive')}
          >
            <CategoryIcon $muted><Archive /></CategoryIcon>
            Clock Archive
            <ChevronRight className="chevron" />
          </CategoryHeader>
          <StylesList $expanded={expandedSections.includes('clock-archive')}>
            {CLOCK_ARCHIVE_STYLES.map((s) => (
              <StyleItem
                key={s.value}
                $active={currentWidget === `clock-${s.value}`}
                onClick={() => onWidgetChange('clock', s.value)}
              >
                <StyleDot $color={s.color} />
                {s.label}
              </StyleItem>
            ))}
          </StylesList>
        </WidgetCategory>
      </NavSection>
    </SidebarContainer>
  );
};
