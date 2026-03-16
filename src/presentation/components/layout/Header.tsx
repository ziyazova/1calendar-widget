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
  padding: 0 24px;
  background: #ffffff;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
  height: 72px;
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.sticky};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-left: 270px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-left: 0;
  }
`;

const TabGroup = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 10px;
  padding: 3px;
  gap: 2px;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 7px 18px;
  height: 34px;
  font-size: 14px;
  font-weight: ${({ $active }) => $active ? 600 : 500};
  font-family: inherit;
  letter-spacing: -0.006em;
  color: ${({ $active, theme }) => $active ? theme.colors.text.primary : theme.colors.text.tertiary};
  background: ${({ $active }) => $active ? '#ffffff' : 'transparent'};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: ${({ $active }) => $active
    ? '0 1px 3px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)'
    : 'none'};

  &:hover {
    color: ${({ $active, theme }) => $active ? theme.colors.text.primary : theme.colors.text.secondary};
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: 290px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-right: 0;
  }
`;

const CopyButton = styled.button<{ $copied?: boolean }>`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 18px;
  height: 40px;
  background: ${({ $copied }) => $copied ? '#22863a' : '#1d1d1f'};
  color: #ffffff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  transition: all 0.15s ease;
  letter-spacing: -0.006em;

  &:hover:not(:disabled) {
    background: ${({ $copied }) => $copied ? '#22863a' : '#3a3a3c'};
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }

  svg {
    width: 14px;
    height: 14px;
    opacity: 0.85;
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
          <>
            <TabGroup>
              <Tab $active={viewMode === 'editor'} onClick={() => onViewModeChange('editor')}>
                Editor
              </Tab>
              <Tab $active={viewMode === 'layout-check'} onClick={() => onViewModeChange('layout-check')}>
                Layout Check
              </Tab>
            </TabGroup>
          </>
        )}
      </HeaderLeft>

      <HeaderRight>
        {currentWidget && (
          <CopyButton
            onClick={handleCopy}
            disabled={!currentWidget}
            $copied={copied}
          >
            {copied ? <Check /> : <Copy />}
            {copied ? 'Copied!' : 'Copy Embed URL'}
          </CopyButton>
        )}
      </HeaderRight>
    </HeaderContainer>
  );
};
