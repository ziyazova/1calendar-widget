import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronRight, Calendar, Clock, CloudSun, Sparkles, TestTube } from 'lucide-react';

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
  background: ${({ theme }) => theme.colors.background.elevated};
  border-right: 1px solid ${({ theme }) => theme.colors.border.primary};
  display: flex;
  flex-direction: column;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  backdrop-filter: blur(${({ theme }) => theme.blur.md});
  -webkit-backdrop-filter: blur(${({ theme }) => theme.blur.md});
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    transform: translateX(-100%);
    transition: transform ${({ theme }) => theme.transitions.apple};
  }
`;

const SidebarHeader = styled.div`
  padding: ${({ theme }) => theme.spacing['6']} ${({ theme }) => theme.spacing['6']};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
  background: ${({ theme }) => theme.colors.gradients.card};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']};
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${({ theme }) => theme.colors.gradients.primary};
  border-radius: ${({ theme }) => theme.radii.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.button};
  
  svg {
    color: white;
  }
`;

const LogoText = styled.h1`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fonts.display};
`;

const NavSection = styled.nav`
  flex: 1;
  padding: ${({ theme }) => theme.spacing['6']} 0;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border.secondary};
    border-radius: ${({ theme }) => theme.radii.full};
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.border.primary};
  }
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 ${({ theme }) => theme.spacing['4']} 0;
  padding: 0 ${({ theme }) => theme.spacing['6']};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
`;

const WidgetCategory = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing['2']};
`;

const CategoryHeader = styled.button<{ $expanded: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']};
  padding: ${({ theme }) => theme.spacing['3']} ${({ theme }) => theme.spacing['6']};
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.apple};
  border-radius: ${({ theme }) => theme.radii.md};
  margin: 0 ${({ theme }) => theme.spacing['2']};
  
  &:focus {
    outline: none;
  }
  
  &:hover {
    background: ${({ theme }) => theme.colors.interactive.hover};
    transform: translateX(2px);
  }
  
  .chevron {
    margin-left: auto;
    transition: transform ${({ theme }) => theme.transitions.apple};
    transform: rotate(${({ $expanded }) => $expanded ? '90deg' : '0deg'});
    opacity: 0.7;
  }
`;

const CategoryIcon = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background.glass};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  backdrop-filter: blur(${({ theme }) => theme.blur.sm});
  
  svg {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const StylesList = styled.div<{ $expanded: boolean }>`
  max-height: ${({ $expanded }) => $expanded ? '500px' : '0'};
  overflow: hidden;
  transition: max-height ${({ theme }) => theme.transitions.slow};
  margin-left: ${({ theme }) => theme.spacing['12']};
  margin-right: ${({ theme }) => theme.spacing['2']};
`;

const StyleItem = styled.button<{ $active: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']};
  padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['4']};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.background.glass : 'transparent'};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.text.primary : theme.colors.text.secondary};
  border: ${({ theme, $active }) =>
    $active ? `1px solid ${theme.colors.border.primary}` : '1px solid transparent'};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme, $active }) => $active ? theme.typography.weights.semibold : theme.typography.weights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.apple};
  text-align: left;
  margin-bottom: ${({ theme }) => theme.spacing['1']};
  position: relative;
  
  &:focus {
    outline: none;
  }
  
  ${({ $active, theme }) => $active && `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 16px;
      background: ${theme.colors.primary};
      border-radius: 0 2px 2px 0;
    }
  `}
  
  &:hover {
    background: ${({ theme, $active }) =>
    $active ? theme.colors.background.glass : theme.colors.interactive.hover};
    transform: translateX(2px);
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const StyleDot = styled.div<{ $color: string }>`
  width: 10px;
  height: 10px;
  background: ${({ $color }) => $color};
  border-radius: ${({ theme }) => theme.radii.full};
  flex-shrink: 0;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const WIDGET_CATEGORIES = {
  calendar: {
    label: 'Calendar',
    icon: Calendar,
    styles: [
      { label: 'Modern Grid', value: 'modern-grid', color: '#667EEA' },
      { label: 'Compact Date', value: 'compact-date', color: '#764BA2' },
      { label: 'Aesthetic Calendar', value: 'aesthetic', color: '#A67C52' },
      { label: 'Modern Weekly', value: 'modern-weekly', color: '#f857a6' },
    ],
  },
  clock: {
    label: 'Clock',
    icon: Clock,
    styles: [
      { label: 'Modern Digital', value: 'modern', color: '#43E97B' },
      { label: 'Analog Classic', value: 'analog-classic', color: '#FA709A' },
      { label: 'Digital Minimal', value: 'digital-minimal', color: '#FEE140' },
      { label: 'World Time', value: 'world-time', color: '#A8E6CF' },
    ],
  },
  weather: {
    label: 'Weather',
    icon: CloudSun,
    styles: [
      { label: 'Modern Card', value: 'modern', color: '#F093FB' },
      { label: 'Detailed Forecast', value: 'detailed-forecast', color: '#F8BBD9' },
      { label: 'Minimal Info', value: 'minimal-info', color: '#FFB199' },
    ],
  },
  test: {
    label: 'Test Widget',
    icon: TestTube,
    styles: [
      { label: 'Chess Board', value: 'chess-board', color: '#8B5A2B' },
    ],
  },
} as const;

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

  const getWidgetIcon = (widgetType: string) => {
    const category = WIDGET_CATEGORIES[widgetType as keyof typeof WIDGET_CATEGORIES];
    if (!category) return <Calendar size={16} />;

    const IconComponent = category.icon;
    return <IconComponent size={16} />;
  };

  return (
    <SidebarContainer>
      <SidebarHeader>
        <Logo>
          <LogoIcon>
            <Sparkles size={16} />
          </LogoIcon>
          <LogoText>Widget Studio</LogoText>
        </Logo>
      </SidebarHeader>

      <NavSection>
        <SectionTitle>Available Widgets</SectionTitle>

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
                <CategoryIcon>
                  {getWidgetIcon(widgetType)}
                </CategoryIcon>
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