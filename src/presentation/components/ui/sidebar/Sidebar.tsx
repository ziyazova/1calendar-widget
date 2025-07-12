import React, { useState } from 'react';
import styled from 'styled-components';
import { Calendar, Settings, Clock, Cloud, ChevronDown, ChevronRight } from 'lucide-react';

interface SidebarProps {
  availableWidgets: string[];
  currentWidget: string;
  onWidgetChange: (type: string, style?: string) => void;
}

const SidebarContainer = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  width: 300px;
  height: 100vh;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-right: 1px solid ${({ theme }) => theme.colors.border.primary};
  padding: ${({ theme }) => theme.spacing.xl};
  z-index: 100;
  overflow-y: auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    
    &.open {
      transform: translateX(0);
    }
  }
`;

const Logo = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const NavSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const WidgetCategory = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CategoryHeader = styled.button<{ $expanded: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
  font-weight: 600;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.tertiary};
  }
  
  .chevron {
    margin-left: auto;
    transition: transform 0.2s ease;
    transform: ${({ $expanded }) => $expanded ? 'rotate(90deg)' : 'rotate(0deg)'};
  }
`;

const StylesList = styled.div<{ $expanded: boolean }>`
  padding-left: ${({ theme }) => theme.spacing.lg};
  max-height: ${({ $expanded }) => $expanded ? '300px' : '0px'};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const StyleItem = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary : 'transparent'};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.background.primary : theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  margin-bottom: 4px;
  
  &:hover {
    background: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.background.tertiary};
    color: ${({ theme, $active }) =>
    $active ? theme.colors.background.primary : theme.colors.text.primary};
  }
`;

const StyleDot = styled.div<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  opacity: 0.7;
`;

// Widget styles configuration
const WIDGET_CATEGORIES = {
  calendar: {
    label: 'Calendar',
    icon: Calendar,
    styles: [
      { value: 'compact-date', label: 'Compact Date', color: '#667EEA' },
      { value: 'modern-grid', label: 'Modern Grid', color: '#764AF1' },
      { value: 'weekly-timeline', label: 'Weekly Timeline', color: '#F093FB' },
    ]
  },
  clock: {
    label: 'Clock',
    icon: Clock,
    styles: [
      { value: 'digital-minimal', label: 'Digital Minimal', color: '#667EEA' },
      { value: 'neon-glow', label: 'Neon Glow', color: '#00F5FF' },
      { value: 'analog-classic', label: 'Analog Classic', color: '#8B4513' },
      { value: 'world-time', label: 'World Time', color: '#FF6B6B' },
    ]
  },
  weather: {
    label: 'Weather',
    icon: Cloud,
    styles: [
      { value: 'modern-card', label: 'Modern Card', color: '#667EEA' },
      { value: 'minimal-info', label: 'Minimal Info', color: '#81C784' },
      { value: 'detailed-forecast', label: 'Detailed Forecast', color: '#42A5F5' },
    ]
  },
};

const getWidgetIcon = (type: string) => {
  const category = WIDGET_CATEGORIES[type as keyof typeof WIDGET_CATEGORIES];
  const IconComponent = category?.icon || Settings;
  return <IconComponent size={20} />;
};

export const Sidebar: React.FC<SidebarProps> = ({
  availableWidgets,
  currentWidget,
  onWidgetChange,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['calendar']);

  const toggleCategory = (categoryType: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryType)
        ? prev.filter(cat => cat !== categoryType)
        : [...prev, categoryType]
    );
  };

  const handleStyleSelect = (widgetType: string, styleValue: string) => {
    onWidgetChange(widgetType, styleValue);
  };

  return (
    <SidebarContainer>
      <Logo>Widget Studio</Logo>

      <NavSection>
        <SectionTitle>Apple-Style Widgets</SectionTitle>

        {availableWidgets.map((widgetType) => {
          const category = WIDGET_CATEGORIES[widgetType as keyof typeof WIDGET_CATEGORIES];
          if (!category) return null;

          const isExpanded = expandedCategories.includes(widgetType);

          return (
            <WidgetCategory key={widgetType}>
              <CategoryHeader
                $expanded={isExpanded}
                onClick={() => toggleCategory(widgetType)}
              >
                {getWidgetIcon(widgetType)}
                {category.label}
                <ChevronRight size={16} className="chevron" />
              </CategoryHeader>

              <StylesList $expanded={isExpanded}>
                {category.styles.map((style) => (
                  <StyleItem
                    key={style.value}
                    $active={currentWidget === `${widgetType}-${style.value}`}
                    onClick={() => handleStyleSelect(widgetType, style.value)}
                  >
                    <StyleDot $color={style.color} />
                    {style.label}
                  </StyleItem>
                ))}
              </StylesList>
            </WidgetCategory>
          );
        })}
      </NavSection>
    </SidebarContainer>
  );
}; 