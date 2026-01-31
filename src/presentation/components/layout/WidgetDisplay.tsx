import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Widget } from '../../../domain/entities/Widget';
import { CalendarWidget } from '../widgets/CalendarWidget';
import { ClockWidget } from '../widgets/ClockWidget';
import { Sparkles, Zap, Palette } from 'lucide-react';

interface WidgetDisplayProps {
  widget: Widget | null;
}

const floatingAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const shimmerAnimation = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const DisplayContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.radii.card};
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ theme }) => theme.colors.gradients.card};
    opacity: 0.3;
    z-index: 0;
  }
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
  padding: ${({ theme }) => theme.spacing['12']};
  color: ${({ theme }) => theme.colors.text.secondary};
  position: relative;
  z-index: 1;
`;

const EmptyStateIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto ${({ theme }) => theme.spacing['6']};
  background: ${({ theme }) => theme.colors.gradients.primary};
  border-radius: ${({ theme }) => theme.radii.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.button};
  animation: ${floatingAnimation} 4s ease-in-out infinite;
  
  svg {
    color: white;
  }
`;

const EmptyTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing['3']} 0;
  font-family: ${({ theme }) => theme.typography.fonts.display};
`;

const EmptyDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 ${({ theme }) => theme.spacing['8']} 0;
  max-width: 400px;
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`;

const FeatureList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing['6']};
  margin-top: ${({ theme }) => theme.spacing['8']};
  max-width: 600px;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']};
  padding: ${({ theme }) => theme.spacing['4']};
  background: ${({ theme }) => theme.colors.background.glass};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  backdrop-filter: blur(${({ theme }) => theme.blur.sm});
  transition: all ${({ theme }) => theme.transitions.apple};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const FeatureIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${({ theme }) => theme.colors.gradients.primary};
  border-radius: ${({ theme }) => theme.radii.md};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    color: white;
  }
`;

const FeatureText = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing['12']};
  position: relative;
  z-index: 1;
`;

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 3px solid ${({ theme }) => theme.colors.border.primary};
  border-top: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.full};
  animation: spin 1s linear infinite;
  margin-bottom: ${({ theme }) => theme.spacing['4']};
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.text.secondary} 0%,
    ${({ theme }) => theme.colors.text.primary} 50%,
    ${({ theme }) => theme.colors.text.secondary} 100%
  );
  background-size: 200px 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${shimmerAnimation} 2s infinite;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['12']};
  color: ${({ theme }) => theme.colors.accent};
  position: relative;
  z-index: 1;
`;

const ErrorIcon = styled.div`
  width: 60px;
  height: 60px;
  margin: 0 auto ${({ theme }) => theme.spacing['4']};
  background: ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radii.full};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '!';
    color: white;
    font-size: ${({ theme }) => theme.typography.sizes['2xl']};
    font-weight: ${({ theme }) => theme.typography.weights.bold};
  }
`;

const WidgetContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.transitions.apple};
  
  &.fade-in {
    animation: fadeIn 0.5s ${({ theme }) => theme.transitions.apple};
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const WidgetDisplay: React.FC<WidgetDisplayProps> = ({ widget }) => {
  if (!widget) {
    return (
      <DisplayContainer>
        <EmptyState>
          <EmptyStateIcon>
            <Sparkles size={32} />
          </EmptyStateIcon>
          <EmptyTitle>Choose Your Widget</EmptyTitle>
          <EmptyDescription>
            Select a widget from the sidebar to start customizing and see a live preview here
          </EmptyDescription>

          <FeatureList>
            <FeatureItem>
              <FeatureIcon>
                <Palette size={16} />
              </FeatureIcon>
              <FeatureText>Real-time Customization</FeatureText>
            </FeatureItem>

            <FeatureItem>
              <FeatureIcon>
                <Zap size={16} />
              </FeatureIcon>
              <FeatureText>Instant Preview</FeatureText>
            </FeatureItem>

            <FeatureItem>
              <FeatureIcon>
                <Sparkles size={16} />
              </FeatureIcon>
              <FeatureText>Apple-style Design</FeatureText>
            </FeatureItem>
          </FeatureList>
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
            <ErrorIcon />
            <EmptyTitle>Widget Type Not Supported</EmptyTitle>
            <EmptyDescription>
              The widget type "{widget.type}" is not yet implemented
            </EmptyDescription>
          </ErrorState>
        );
    }
  };

  return (
    <DisplayContainer>
      <WidgetFrame>
        <WidgetContainer className="fade-in">
          {renderWidget()}
        </WidgetContainer>
      </WidgetFrame>
    </DisplayContainer>
  );
}; 