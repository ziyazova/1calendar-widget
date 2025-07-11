import React from 'react';
import styled from 'styled-components';
import { Widget } from '../../../domain/entities/Widget';
import { CalendarWidget } from '../widgets/CalendarWidget';
import { ClockWidget } from '../widgets/ClockWidget';
import { WeatherWidget } from '../widgets/WeatherWidget';

interface WidgetDisplayProps {
  widget: Widget | null;
}

const DisplayContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 400px;
  background: ${({ theme }) => theme.colors.background.secondary};
  border: 2px dashed ${({ theme }) => theme.colors.border.secondary};
  border-radius: ${({ theme }) => theme.radii.lg};
`;

const EmptyState = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

const EmptyDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  margin: 0;
`;

const WidgetFrame = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  overflow: hidden;
  max-width: 100%;
  max-height: 100%;
`;

export const WidgetDisplay: React.FC<WidgetDisplayProps> = ({ widget }) => {
  if (!widget) {
    return (
      <DisplayContainer>
        <EmptyState>
          <EmptyTitle>No Widget Selected</EmptyTitle>
          <EmptyDescription>Choose a widget from the sidebar to preview it here</EmptyDescription>
        </EmptyState>
      </DisplayContainer>
    );
  }

  const renderWidget = () => {
    switch (widget.type) {
      case 'calendar':
        return <CalendarWidget widget={widget} />;
      case 'clock':
        return <ClockWidget widget={widget} />;
      case 'weather':
        return <WeatherWidget widget={widget} />;
      default:
        return (
          <EmptyState>
            <EmptyTitle>Widget Type Not Supported</EmptyTitle>
            <EmptyDescription>The widget type "{widget.type}" is not yet implemented</EmptyDescription>
          </EmptyState>
        );
    }
  };

  return (
    <DisplayContainer>
      <WidgetFrame>
        {renderWidget()}
      </WidgetFrame>
    </DisplayContainer>
  );
}; 