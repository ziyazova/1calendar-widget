import React from 'react';
import styled from 'styled-components';
import { Calendar, Settings, Clock, Cloud } from 'lucide-react';

interface SidebarProps {
  availableWidgets: string[];
  currentWidget: string;
  onWidgetChange: (type: string) => void;
}

const SidebarContainer = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  width: 280px;
  height: 100vh;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-right: 1px solid ${({ theme }) => theme.colors.border.primary};
  padding: ${({ theme }) => theme.spacing.xl};
  z-index: 100;
  
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

const WidgetItem = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: none;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary : 'transparent'};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.background.primary : theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.background.tertiary};
  }
`;

const getWidgetIcon = (type: string) => {
  switch (type) {
    case 'calendar':
      return <Calendar size={20} />;
    case 'clock':
      return <Clock size={20} />;
    case 'weather':
      return <Cloud size={20} />;
    default:
      return <Settings size={20} />;
  }
};

const getWidgetLabel = (type: string) => {
  switch (type) {
    case 'calendar':
      return 'Calendar';
    case 'clock':
      return 'Clock';
    case 'weather':
      return 'Weather';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
};

export const Sidebar: React.FC<SidebarProps> = ({
  availableWidgets,
  currentWidget,
  onWidgetChange,
}) => {
  return (
    <SidebarContainer>
      <Logo>Widget Studio</Logo>

      <NavSection>
        <SectionTitle>Apple-Style Widgets</SectionTitle>
        {availableWidgets.map((widget) => (
          <WidgetItem
            key={widget}
            $active={currentWidget === widget}
            onClick={() => onWidgetChange(widget)}
          >
            {getWidgetIcon(widget)}
            {getWidgetLabel(widget)}
          </WidgetItem>
        ))}
      </NavSection>
    </SidebarContainer>
  );
}; 