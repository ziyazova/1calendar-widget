import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronRight, Calendar, Clock, Archive } from 'lucide-react';

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
  background: #fafafa;
  border-right: 1px solid ${({ theme }) => theme.colors.border.primary};
  display: flex;
  flex-direction: column;
  z-index: ${({ theme }) => theme.zIndex.sticky};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
`;

const SidebarHeader = styled.div`
  padding: 0 24px;
  height: 72px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
  background: #ffffff;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PeachIcon = () => (
  <svg width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="48" cy="54" r="36" fill="#F8B898" stroke="#4a4a4a" strokeWidth="5" strokeLinecap="round"/>
    <path d="M30 40 Q36 50 32 64" stroke="#4a4a4a" strokeWidth="4" strokeLinecap="round" fill="none"/>
    <path d="M62 36 Q58 48 64 62" stroke="#4a4a4a" strokeWidth="4" strokeLinecap="round" fill="none"/>
    <ellipse cx="70" cy="22" rx="10" ry="14" fill="#3a7d2c" stroke="#4a4a4a" strokeWidth="4" transform="rotate(-20 70 22)"/>
  </svg>
);

const LogoText = styled.h1`
  font-size: 21px;
  font-weight: 600;
  line-height: 28px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  letter-spacing: -0.02em;

  span {
    color: ${({ theme }) => theme.colors.text.secondary};
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
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 12px 0;
  padding: 0 24px;
  text-transform: uppercase;
  letter-spacing: 0.08em;

  &:nth-of-type(n+2) {
    margin-top: 28px;
    padding-top: 20px;
    border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
  }
`;

const WidgetCategory = styled.div`
  margin-bottom: 4px;
`;

const CategoryHeader = styled.button<{ $expanded: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 24px;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 15px;
  font-weight: 500;
  line-height: 22px;
  cursor: pointer;
  transition: background 0.12s ease;
  font-family: inherit;
  letter-spacing: -0.01em;

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }

  .chevron {
    margin-left: auto;
    transition: transform 0.2s ease;
    transform: rotate(${({ $expanded }) => $expanded ? '90deg' : '0deg'});
    opacity: 0.18;
    width: 12px;
    height: 12px;
  }
`;

const CategoryIcon = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04);

  svg {
    color: ${({ theme }) => theme.colors.text.secondary};
    width: 15px;
    height: 15px;
  }
`;

const StylesList = styled.div<{ $expanded: boolean }>`
  max-height: ${({ $expanded }) => $expanded ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.2s ease;
  padding: 4px 16px 0 66px;
`;

const StyleItem = styled.button<{ $active: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: ${({ $active }) => $active ? 'rgba(0, 0, 0, 0.04)' : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.colors.text.primary : theme.colors.text.secondary};
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: ${({ $active }) => $active ? 500 : 400};
  cursor: pointer;
  transition: all 0.12s ease;
  text-align: left;
  margin-bottom: 2px;
  font-family: inherit;
  letter-spacing: -0.006em;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const StyleDot = styled.div<{ $color: string }>`
  width: 6px;
  height: 6px;
  background: ${({ $color }) => $color};
  border-radius: 50%;
  flex-shrink: 0;
`;

const CALENDAR_STYLES = [
  { label: 'CSS Zoom Fixed', value: 'modern-grid-zoom-fixed', color: '#d35400' },
];

const ARCHIVE_STYLES = [
  { label: 'Modern Grid', value: 'modern-grid', color: '#667EEA' },
  { label: 'CSS Zoom (layout)', value: 'calendar-2', color: '#e67e22' },
  { label: 'Container Query (layout)', value: 'calendar-4', color: '#3498db' },
  { label: 'SVG ViewBox (layout)', value: 'calendar-6', color: '#1abc9c' },
];

const CLOCK_STYLES = [
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

        <SectionLabel>Archive</SectionLabel>

        <WidgetCategory>
          <CategoryHeader
            $expanded={expandedSections.includes('archive')}
            onClick={() => toggle('archive')}
          >
            <CategoryIcon><Archive /></CategoryIcon>
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
      </NavSection>
    </SidebarContainer>
  );
};
