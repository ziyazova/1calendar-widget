import React, { useState } from 'react';
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
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(ActionButton) <{ $copied?: boolean }>`
  background: ${({ theme, $copied }) => $copied ? '#37bd64' : theme.colors.primary};
  color: #fcfcfc;
  border-color: ${({ theme, $copied }) => $copied ? '#43E97B' : theme.colors.primary};
  transition: background 0.3s cubic-bezier(0.4,0,0.2,1), color 0.3s, border-color 0.3s;
  position: relative;
  overflow: hidden;
  min-width: 190px;
  font-size: 1rem;
`;

const ButtonTextWrap = styled.span`
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
`;

const ButtonText = styled.span<{ $visible: boolean }>`
  position: absolute;
  left: 0; right: 0;
  top: 0;
  opacity: ${({ $visible }) => $visible ? 1 : 0};
  transform: translateY(${({ $visible }) => $visible ? '0' : '10px'});
  transition: opacity 0.25s, transform 0.25s;
  text-align: left;
`;

export const Header: React.FC<HeaderProps> = ({
  currentWidget,
  onCopyEmbedUrl,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopyEmbedUrl();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        {/* Removed Preview button */}
        <PrimaryButton
          onClick={handleCopy}
          disabled={!currentWidget}
          $copied={copied}
        >
          <Copy size={16} />
          <ButtonTextWrap>
            <ButtonText $visible={!copied}>Copy Embed URL</ButtonText>
            <ButtonText $visible={copied}>Copied!</ButtonText>
          </ButtonTextWrap>
        </PrimaryButton>
      </HeaderActions>
    </HeaderContainer>
  );
}; 