import React, { useState } from 'react';
import styled from 'styled-components';
import { Copy, Check, Save } from 'lucide-react';
import { Widget } from '../../../domain/entities/Widget';

type ViewMode = 'editor' | 'layout-check';

interface HeaderProps {
  currentWidget: Widget | null;
  onCopyEmbedUrl: () => void;
  onSaveWidget?: () => Promise<void>;
  canSave?: boolean;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  height: 64px;
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.sticky};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: 270px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-left: 0;
  }
`;

const TabGroup = styled.div`
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 12px;
  padding: 4px;
  gap: 2px;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 6px 16px;
  height: 32px;
  font-size: 13px;
  font-weight: ${({ $active }) => $active ? 500 : 400};
  font-family: inherit;
  letter-spacing: -0.01em;
  color: ${({ $active }) => $active ? '#1F1F1F' : '#6B6B6B'};
  background: ${({ $active }) => $active ? 'rgba(255, 255, 255, 0.9)' : 'transparent'};
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${({ $active }) => $active
    ? '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)'
    : 'none'};

  &:hover {
    color: ${({ $active }) => $active ? '#1F1F1F' : '#1F1F1F'};
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
  gap: 8px;
  padding: 0 20px;
  height: 36px;
  background: ${({ $copied }) => $copied
    ? 'linear-gradient(135deg, #22c55e, #16a34a)'
    : 'linear-gradient(135deg, #6366f1, #8b5cf6)'};
  color: #ffffff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  transition: all 0.2s ease;
  letter-spacing: -0.01em;
  box-shadow: 0 2px 8px ${({ $copied }) => $copied
    ? 'rgba(34, 197, 94, 0.3)'
    : 'rgba(99, 102, 241, 0.3)'};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${({ $copied }) => $copied
      ? 'rgba(34, 197, 94, 0.4)'
      : 'rgba(99, 102, 241, 0.4)'};
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  svg {
    width: 14px;
    height: 14px;
    opacity: 0.9;
  }
`;

const SaveButton = styled.button<{ $saving?: boolean; $saved?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  height: 36px;
  background: ${({ $saved }) => $saved ? '#22c55e' : '#1F1F1F'};
  color: #ffffff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  letter-spacing: -0.01em;
  transition: all 0.2s ease;
  opacity: ${({ $saving }) => $saving ? 0.7 : 1};

  svg { width: 14px; height: 14px; }

  &:hover:not(:disabled) { background: ${({ $saved }) => $saved ? '#16a34a' : '#333'}; }
  &:active:not(:disabled) { transform: scale(0.97); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

export const Header: React.FC<HeaderProps> = ({
  currentWidget,
  onCopyEmbedUrl,
  onSaveWidget,
  canSave,
  viewMode,
  onViewModeChange,
}) => {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopy = () => {
    onCopyEmbedUrl();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!onSaveWidget || saving) return;
    setSaving(true);
    try {
      await onSaveWidget();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
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

      <HeaderRight>
        {currentWidget && canSave && (
          <SaveButton onClick={handleSave} disabled={saving} $saving={saving} $saved={saved}>
            {saved ? <Check /> : <Save />}
            {saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
          </SaveButton>
        )}
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
