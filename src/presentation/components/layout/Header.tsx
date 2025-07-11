import React from 'react';
import styled from 'styled-components';
import { Copy, ExternalLink } from 'lucide-react';
import { Widget } from '../../../domain/entities/Widget';

interface HeaderProps {
  currentWidget: Widget | null;
  onCopyEmbedUrl: () => void;
}

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing['2xl']};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
  background: ${({ theme }) => theme.colors.background.primary};
`;

const HeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.secondary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(ActionButton)`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background.primary};
  border-color: ${({ theme }) => theme.colors.primary};
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryDark};
    border-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export const Header: React.FC<HeaderProps> = ({
  currentWidget,
  onCopyEmbedUrl,
}) => {
  const handlePreview = () => {
    if (!currentWidget) return;

    const embedUrl = `/embed/${currentWidget.type}`;
    window.open(embedUrl, '_blank');
  };

  return (
    <HeaderContainer>
      <HeaderTitle>
        <Title>
          {currentWidget ? `${currentWidget.type.charAt(0).toUpperCase()}${currentWidget.type.slice(1)} Widget` : 'Widget Studio'}
        </Title>
        <Subtitle>
          {currentWidget ? 'Customize your widget and copy the embed code' : 'Select a widget to get started'}
        </Subtitle>
      </HeaderTitle>

      <HeaderActions>
        <ActionButton
          onClick={handlePreview}
          disabled={!currentWidget}
        >
          <ExternalLink size={16} />
          Preview
        </ActionButton>

        <PrimaryButton
          onClick={onCopyEmbedUrl}
          disabled={!currentWidget}
        >
          <Copy size={16} />
          Copy Embed URL
        </PrimaryButton>
      </HeaderActions>
    </HeaderContainer>
  );
}; 