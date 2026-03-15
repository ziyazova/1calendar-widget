import React, { useState } from 'react';
import styled from 'styled-components';
import { Copy, Check } from 'lucide-react';
import { Widget } from '../../../domain/entities/Widget';

type ViewMode = 'editor' | 'layout-check';

interface HeaderProps {
  currentWidget: Widget | null;
  onCopyEmbedUrl: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  background: #ffffff;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.secondary};
  height: 64px;
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.sticky};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  margin-left: 300px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-left: 0;
  }
`;

const TabGroup = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 10px;
  padding: 4px;
  gap: 2px;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 7px 18px;
  height: 34px;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  letter-spacing: -0.01em;
  color: ${({ $active, theme }) => $active ? theme.colors.text.primary : theme.colors.text.tertiary};
  background: ${({ $active }) => $active ? '#ffffff' : 'transparent'};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: ${({ $active }) => $active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const CopyButton = styled.button<{ $copied?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 20px;
  height: 40px;
  background: ${({ $copied }) => $copied ? '#15803d' : '#1a1a1a'};
  color: #ffffff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  transition: all 0.15s ease;
  letter-spacing: -0.01em;

  &:hover:not(:disabled) {
    background: ${({ $copied }) => $copied ? '#15803d' : '#333'};
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  svg {
    width: 15px;
    height: 15px;
  }
`;

export const Header: React.FC<HeaderProps> = ({
  currentWidget,
  onCopyEmbedUrl,
  viewMode,
  onViewModeChange,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopyEmbedUrl();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <HeaderContainer>
      <HeaderLeft>
        {currentWidget && (
          <TabGroup>
            <Tab $active={viewMode === 'editor'} onClick={() => onViewModeChange('editor')}>
              Editor
            </Tab>
            <Tab $active={viewMode === 'layout-check'} onClick={() => onViewModeChange('layout-check')}>
              Layout Check
            </Tab>
          </TabGroup>
        )}
      </HeaderLeft>

      <CopyButton
        onClick={handleCopy}
        disabled={!currentWidget}
        $copied={copied}
      >
        {copied ? <Check /> : <Copy />}
        {copied ? 'Copied!' : 'Copy Embed URL'}
      </CopyButton>
    </HeaderContainer>
  );
};
