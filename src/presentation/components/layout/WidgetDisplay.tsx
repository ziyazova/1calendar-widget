import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Widget } from '../../../domain/entities/Widget';
import { CalendarWidget } from '../widgets/CalendarWidget';
import { ClockWidget } from '../widgets/ClockWidget';
import { Sparkles } from 'lucide-react';

interface WidgetDisplayProps {
  widget: Widget | null;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const DisplayContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const WidgetFrame = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px;
  position: relative;
  z-index: 1;
`;

const EmptyIcon = styled.div`
  width: 56px;
  height: 56px;
  margin: 0 auto 20px;
  background: ${({ theme }) => theme.colors.gradients.primary};
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.md};
  animation: ${float} 4s ease-in-out infinite;

  svg {
    color: white;
  }
`;

const EmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
`;

const EmptyDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0;
  max-width: 280px;
  line-height: 1.5;
  margin: 0 auto;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 48px;
  position: relative;
  z-index: 1;
`;

const WidgetContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.4s cubic-bezier(0.54, 1.5, 0.38, 1.11);
`;

export const WidgetDisplay: React.FC<WidgetDisplayProps> = ({ widget }) => {
  if (!widget) {
    return (
      <DisplayContainer>
        <EmptyState>
          <EmptyIcon>
            <Sparkles size={24} />
          </EmptyIcon>
          <EmptyTitle>Choose a Widget</EmptyTitle>
          <EmptyDescription>
            Select a widget from the sidebar to preview and customize
          </EmptyDescription>
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
      default:
        return (
          <ErrorState>
            <EmptyTitle>Not Supported</EmptyTitle>
            <EmptyDescription>
              Widget type "{widget.type}" is not yet implemented
            </EmptyDescription>
          </ErrorState>
        );
    }
  };

  return (
    <DisplayContainer>
      <WidgetFrame>
        <WidgetContainer>
          {renderWidget()}
        </WidgetContainer>
      </WidgetFrame>
    </DisplayContainer>
  );
};
