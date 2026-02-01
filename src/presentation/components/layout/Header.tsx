import React, { useState } from 'react';
import styled from 'styled-components';
import { Copy, Sparkles } from 'lucide-react';
import { Widget } from '../../../domain/entities/Widget';

interface HeaderProps {
  currentWidget: Widget | null;
  onCopyEmbedUrl: () => void;
}

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['6']};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
  background: ${({ theme }) => theme.colors.background.elevated};
  height: 80px;
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.sticky};
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['6']};
  margin-left: 300px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-left: 0;
  }
`;

const LogoContainer = styled.div`
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
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ theme }) => theme.colors.gradients.glass};
    opacity: 0.5;
  }
  
  svg {
    color: white;
    z-index: 1;
    position: relative;
  }
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
`;

const BrandName = styled.h1`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fonts.display};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
`;

const BrandTagline = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  font-weight: ${({ theme }) => theme.typography.weights.medium};
`;

const WidgetInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['1']};
`;

const WidgetTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fonts.display};
`;

const WidgetSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing['4']};
`;

const PrimaryButton = styled.button<{ $copied?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing['3']};
  padding: ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['6']};
  min-height: 44px;
  min-width: 160px;
  background: ${({ theme, $copied }) => $copied ? theme.colors.success : theme.colors.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  border: none;
  border-radius: ${({ theme }) => theme.radii.button};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  transition: all ${({ theme }) => theme.transitions.apple};
  box-shadow: ${({ theme }) => theme.shadows.button};
  position: relative;
  overflow: hidden;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ButtonTextWrap = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-width: 120px;
  white-space: nowrap;
`;

const ButtonText = styled.span<{ $visible: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $visible }) => $visible ? 1 : 0};
  transform: translateY(${({ $visible }) => $visible ? '0' : '10px'});
  transition: opacity 0.25s ${({ theme }) => theme.transitions.apple},
              transform 0.25s ${({ theme }) => theme.transitions.apple};
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
        {currentWidget && (
          <WidgetInfo>
            <WidgetTitle>
              {currentWidget.type.charAt(0).toUpperCase()}{currentWidget.type.slice(1)} Widget
            </WidgetTitle>
            <WidgetSubtitle>
              Customize and embed in your Notion pages
            </WidgetSubtitle>
          </WidgetInfo>
        )}
      </HeaderTitle>

      <HeaderActions>
        <PrimaryButton
          onClick={handleCopy}
          disabled={!currentWidget}
          $copied={copied}
        >
          <Copy size={18} />
          <ButtonTextWrap>
            <ButtonText $visible={!copied}>Copy Embed URL</ButtonText>
            <ButtonText $visible={copied}>Copied!</ButtonText>
          </ButtonTextWrap>
        </PrimaryButton>
      </HeaderActions>
    </HeaderContainer>
  );
}; 