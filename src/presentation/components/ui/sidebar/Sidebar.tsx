import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronRight, Calendar, CalendarDays, Clock, Archive, Image, LayoutGrid, Type, Flower2, Sparkles, Grid, AlarmClock, Brush, Layers } from 'lucide-react';

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
  background: #ffffff;
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  z-index: ${({ theme }) => theme.zIndex.sticky};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
`;

const SidebarHeader = styled.div`
  padding: 0 22px;
  height: 64px;
  display: flex;
  align-items: center;
  border-bottom: none;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PeachIcon = () => (
  <img src="/PeachyLogo.png" alt="Logo" width="22" height="22" style={{ objectFit: 'contain', marginTop: '-1px' }} />
);

const LogoText = styled.h1`
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  color: #1F1F1F;
  margin: 0;
  letter-spacing: -0.02em;

  span {
    color: #9A9A9A;
    font-weight: 400;
  }
`;

const NavSection = styled.nav`
  flex: 1;
  padding: 16px 0;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0;
  }
`;

const SectionLabel = styled.h2`
  font-size: 11px;
  font-weight: 500;
  color: #9A9A9A;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 18px 0;
  padding: 0 24px;
  letter-spacing: -0.01em;

  &:nth-of-type(n+2) {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
  }
`;

const WidgetCategory = styled.div`
  margin-bottom: 8px;
`;

const CategoryHeader = styled.button<{ $expanded: boolean; $muted?: boolean }>`
  width: calc(100% - 32px);
  margin: 0 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: ${({ $muted }) => $muted ? '#6B6B6B' : '#1F1F1F'};
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
  letter-spacing: -0.01em;

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

const CategoryIcon = styled.div<{ $muted?: boolean }>`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: ${({ $muted }) => $muted
    ? 'rgba(0, 0, 0, 0.04)'
    : 'linear-gradient(135deg, rgba(51, 132, 244, 0.08), rgba(91, 160, 247, 0.08))'};

  svg {
    color: ${({ $muted }) => $muted ? '#9A9A9A' : '#3384F4'};
    width: 16px;
    height: 16px;
  }
`;

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
    background: rgba(0, 0, 0, 0.08);
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
  border-radius: 8px;
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
    color: #3384F4;
  }

  svg {
    width: 13px;
    height: 13px;
    flex-shrink: 0;
    opacity: 0.5;
  }
`;

const CALENDAR_STYLES = [
  { label: 'Core', value: 'modern-grid-zoom-fixed', icon: Calendar },
  { label: 'Soft', value: 'classic', icon: CalendarDays },
  { label: 'Paper', value: 'collage', icon: LayoutGrid },
  { label: 'Editorial', value: 'typewriter', icon: Type },
];

const ARCHIVE_STYLES = [
  { label: 'Modern Grid', value: 'modern-grid', icon: Grid },
  { label: 'CSS Zoom', value: 'calendar-2', icon: Calendar },
  { label: 'Container Query', value: 'calendar-4', icon: Calendar },
  { label: 'SVG ViewBox', value: 'calendar-6', icon: Calendar },
];

const CLOCK_STYLES = [
  { label: 'Duo', value: 'classic', icon: Clock },
  { label: 'Bloom', value: 'flower', icon: Flower2 },
  { label: 'Alarm', value: 'dreamy', icon: Sparkles },
];

const BOARD_STYLES = [
  { label: 'Moodboard', value: 'grid', icon: Image },
];

const CLOCK_ARCHIVE_STYLES = [
  { label: 'Buddy', value: 'modern', icon: Brush },
  { label: 'Analog Classic', value: 'analog-classic', icon: AlarmClock },
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
              <div>
                {CALENDAR_STYLES.map((s) => (
                  <StyleItem
                    key={s.value}
                    $active={currentWidget === `calendar-${s.value}`}
                    onClick={() => onWidgetChange('calendar', s.value)}
                  >
                    <s.icon />
                    {s.label}
                  </StyleItem>
                ))}
              </div>
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
              <div>
                {CLOCK_STYLES.map((s) => (
                  <StyleItem
                    key={s.value}
                    $active={currentWidget === `clock-${s.value}`}
                    onClick={() => onWidgetChange('clock', s.value)}
                  >
                    <s.icon />
                    {s.label}
                  </StyleItem>
                ))}
              </div>
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
              Canvas
              <ChevronRight className="chevron" />
            </CategoryHeader>
            <StylesList $expanded={expandedSections.includes('board')}>
              <div>
                {BOARD_STYLES.map((s) => (
                  <StyleItem
                    key={s.value}
                    $active={currentWidget === `board-${s.value}`}
                    onClick={() => onWidgetChange('board', s.value)}
                  >
                    <s.icon />
                    {s.label}
                  </StyleItem>
                ))}
              </div>
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
            <div>
              {ARCHIVE_STYLES.map((s) => (
                <StyleItem
                  key={s.value}
                  $active={currentWidget === `calendar-${s.value}`}
                  onClick={() => onWidgetChange('calendar', s.value)}
                >
                  <s.icon />
                  {s.label}
                </StyleItem>
              ))}
            </div>
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
            <div>
              {CLOCK_ARCHIVE_STYLES.map((s) => (
                <StyleItem
                  key={s.value}
                  $active={currentWidget === `clock-${s.value}`}
                  onClick={() => onWidgetChange('clock', s.value)}
                >
                  <s.icon />
                  {s.label}
                </StyleItem>
              ))}
            </div>
          </StylesList>
        </WidgetCategory>
      </NavSection>
    </SidebarContainer>
  );
};
