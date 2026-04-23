import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import styled, { css, keyframes } from 'styled-components';
import { X, Pencil, Lock } from 'lucide-react';
import { Button } from '@/presentation/components/shared';
import { CalendarSettings } from '@/domain/value-objects/CalendarSettings';
import { ClockSettings } from '@/domain/value-objects/ClockSettings';
import { BoardSettings } from '@/domain/value-objects/BoardSettings';

/* Calendar styles */
import { ModernGridZoomFixed } from '../../widgets/calendar/styles/ModernGridZoomFixed';
import { ClassicCalendar } from '../../widgets/calendar/styles/ClassicCalendar';
import { CollageCalendar } from '../../widgets/calendar/styles/CollageCalendar';
import { TypewriterCalendar } from '../../widgets/calendar/styles/TypewriterCalendar';

/* Clock styles */
import { ClassicClock } from '../../widgets/clock/styles/ClassicClock';
import { FlowerClock } from '../../widgets/clock/styles/FlowerClock';
import { DreamyClock } from '../../widgets/clock/styles/DreamyClock';

/* Board styles */
import { InspirationBoard } from '../../widgets/board/styles/InspirationBoard';

import { getContrastColor } from '@/presentation/themes/colors';
import type { WidgetStyleConfig } from '../widgetConfig';

/* ── Types ── */

interface StylePickerPanelProps {
  styles: WidgetStyleConfig[];
  widgetType: string;
  categoryLabel: string;
  currentWidget: string;
  canEdit: boolean;
  onWidgetChange: (type: string, style?: string) => void;
  onEdit: (type: string, style: string, name: string) => void;
  onLockedEdit?: () => void;
  onClose: () => void;
}

/* ── Preview Renderers ── */

const PREVIEW_TIME = new Date(2026, 2, 25, 10, 42, 15);

const CalendarPreview: React.FC<{ styleValue: string }> = ({ styleValue }) => {
  const settings = useMemo(() => new CalendarSettings({ style: styleValue as CalendarSettings['style'] }), [styleValue]);
  switch (styleValue) {
    case 'modern-grid-zoom-fixed':
      return <ModernGridZoomFixed settings={settings} />;
    case 'classic':
      return <ClassicCalendar settings={settings} />;
    case 'collage':
      return <CollageCalendar settings={settings} />;
    case 'typewriter':
      return <TypewriterCalendar settings={settings} />;
    default:
      return <ModernGridZoomFixed settings={settings} />;
  }
};

const ClockPreview: React.FC<{ styleValue: string }> = ({ styleValue }) => {
  const settings = useMemo(() => new ClockSettings({ style: styleValue as ClockSettings['style'] }), [styleValue]);
  const textColor = getContrastColor(settings.backgroundColor);
  switch (styleValue) {
    case 'classic':
      return <ClassicClock settings={settings} time={PREVIEW_TIME} textColor={textColor} />;
    case 'flower':
      return <FlowerClock settings={settings} time={PREVIEW_TIME} textColor={textColor} />;
    case 'dreamy':
      return <DreamyClock settings={settings} time={PREVIEW_TIME} textColor={textColor} />;
    default:
      return <ClassicClock settings={settings} time={PREVIEW_TIME} textColor={textColor} />;
  }
};

const BoardPreview: React.FC<{ styleValue: string }> = ({ styleValue }) => {
  const settings = useMemo(() => new BoardSettings({ layout: styleValue as BoardSettings['layout'] }), [styleValue]);
  return <InspirationBoard settings={settings} />;
};

/* ── Styled Components ── */

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const cardAppear = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const PanelContainer = styled.div`
  position: fixed;
  left: 270px;
  top: 0;
  width: 280px;
  height: 100vh;
  background: #ffffff;
  border-left: 1px solid ${({ theme }) => theme.colors.border.light};
  z-index: ${({ theme }) => theme.zIndex.sticky - 1};
  display: flex;
  flex-direction: column;
  animation: ${slideIn} 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (max-width: 1024px) {
    left: 220px;
    width: 260px;
  }

  @media (max-width: 768px) {
    left: 270px;
    width: 280px;
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.08);
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 20px 16px;
  flex-shrink: 0;
`;

const PanelTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
  margin: 0;
`;

const CloseButton = styled.button`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: rgba(0, 0, 0, 0.04);
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.tertiary};
  transition: all 0.15s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.08);
    color: ${({ theme }) => theme.colors.text.primary};
  }

  svg { width: 14px; height: 14px; }
`;

const PanelBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 20px;

  &::-webkit-scrollbar { width: 0; }
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CardOuter = styled.div<{ $active: boolean; $index: number }>`
  position: relative;
  border: 1.5px solid ${({ $active }) => $active ? '#3384F4' : 'rgba(0, 0, 0, 0.06)'};
  border-radius: 16px;
  background: #ffffff;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  opacity: 0;
  animation: ${cardAppear} 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: ${({ $index }) => 0.06 + $index * 0.06}s;

  &:hover {
    border-color: ${({ $active }) => $active ? '#3384F4' : 'rgba(0, 0, 0, 0.12)'};
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  }

  ${({ $active }) => $active && css`
    box-shadow: 0 0 0 3px rgba(51, 132, 244, 0.1);
  `}
`;

const PreviewOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 2;
  pointer-events: auto;
`;

const PreviewWrap = styled.div`
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  position: relative;
  background: #FAFAFA;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover ${PreviewOverlay} {
    opacity: 1;
  }
`;

const PreviewScale = styled.div`
  transform: scale(0.26);
  transform-origin: center center;
  width: 420px;
  min-height: 380px;
  flex-shrink: 0;
  pointer-events: none;
`;

const ClockPreviewScale = styled(PreviewScale)`
  width: 360px;
  min-height: 360px;
`;

const BoardPreviewScale = styled(PreviewScale)`
  width: 420px;
  min-height: 420px;
`;

const CardBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
`;

const CardLabel = styled.span<{ $active: boolean }>`
  font-size: 13px;
  font-weight: ${({ $active }) => $active ? 500 : 400};
  color: ${({ $active }) => $active ? '#3384F4' : '#1F1F1F'};
  letter-spacing: -0.01em;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 18px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.95);
  color: #1F1F1F;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s ease;
  letter-spacing: -0.01em;

  svg { width: 14px; height: 14px; }

  &:hover {
    background: #ffffff;
    transform: scale(1.04);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const LockedButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 18px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.95);
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s ease;
  letter-spacing: -0.01em;

  svg { width: 13px; height: 13px; }

  &:hover {
    background: #ffffff;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

/* ── Name Modal ── */

const modalFadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const modalSlideUp = keyframes`
  from { opacity: 0; transform: translateY(12px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${modalFadeIn} 0.2s ease both;
`;

const ModalCard = styled.div`
  width: 380px;
  max-width: 90vw;
  background: #ffffff;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.18);
  animation: ${modalSlideUp} 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: 0.05s;
`;

const ModalTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1F1F1F;
  letter-spacing: -0.02em;
  margin: 0 0 4px;
`;

const ModalSubtitle = styled.p`
  font-size: 13px;
  color: rgba(0, 0, 0, 0.4);
  margin: 0 0 20px;
  letter-spacing: -0.01em;
`;

const ModalPreviewRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
  padding: 12px;
  background: #FAFAFA;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.04);
`;

const ModalPreviewThumb = styled.div`
  width: 56px;
  height: 42px;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(0, 0, 0, 0.06);
`;

const ModalPreviewScale = styled.div`
  transform: scale(0.1);
  transform-origin: center center;
  width: 420px;
  min-height: 380px;
  pointer-events: none;
`;

const ModalPreviewInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ModalPreviewLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #1F1F1F;
  letter-spacing: -0.01em;
`;

const ModalPreviewMeta = styled.span`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.35);
`;

const ModalInput = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border: 1.5px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  background: #FAFAFA;
  font-size: 14px;
  font-family: inherit;
  color: #1F1F1F;
  outline: none;
  transition: all 0.15s ease;
  letter-spacing: -0.01em;
  margin-bottom: 20px;

  &::placeholder { color: rgba(0, 0, 0, 0.25); }
  &:focus { border-color: rgba(51, 132, 244, 0.4); background: #fff; }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;


/* ── Component ── */

export const StylePickerPanel: React.FC<StylePickerPanelProps> = ({
  styles,
  widgetType,
  categoryLabel,
  currentWidget,
  canEdit,
  onWidgetChange,
  onEdit,
  onLockedEdit,
  onClose,
}) => {
  const [nameModal, setNameModal] = useState<{ type: string; style: string; label: string } | null>(null);
  const [widgetName, setWidgetName] = useState('');

  const handleEditClick = (type: string, style: string, label: string) => {
    setWidgetName(`${label} ${categoryLabel}`);
    setNameModal({ type, style, label });
  };

  const handleConfirmEdit = () => {
    if (!nameModal) return;
    onEdit(nameModal.type, nameModal.style, widgetName.trim() || `${nameModal.label} ${categoryLabel}`);
    setNameModal(null);
  };

  const renderPreview = (styleValue: string) => {
    switch (widgetType) {
      case 'calendar':
        return (
          <PreviewScale>
            <CalendarPreview styleValue={styleValue} />
          </PreviewScale>
        );
      case 'clock':
        return (
          <ClockPreviewScale>
            <ClockPreview styleValue={styleValue} />
          </ClockPreviewScale>
        );
      case 'board':
        return (
          <BoardPreviewScale>
            <BoardPreview styleValue={styleValue} />
          </BoardPreviewScale>
        );
      default:
        return null;
    }
  };

  return (
    <PanelContainer>
      <PanelHeader>
        <PanelTitle>{categoryLabel}</PanelTitle>
        <CloseButton onClick={onClose} aria-label="Close">
          <X />
        </CloseButton>
      </PanelHeader>
      <PanelBody>
        <CardList>
          {styles.map((s, i) => {
            const isActive = currentWidget === `${widgetType}-${s.value}`;
            return (
              <CardOuter
                key={s.value}
                $active={isActive}
                $index={i}
                onClick={() => onWidgetChange(widgetType, s.value)}
              >
                <PreviewWrap>
                  {renderPreview(s.value)}
                  <PreviewOverlay>
                    {canEdit ? (
                      <EditButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(widgetType, s.value, s.label);
                        }}
                      >
                        <Pencil /> Edit
                      </EditButton>
                    ) : (
                      <LockedButton
                        onClick={(e) => {
                          e.stopPropagation();
                          onLockedEdit?.();
                        }}
                      >
                        <Lock /> Pro
                      </LockedButton>
                    )}
                  </PreviewOverlay>
                </PreviewWrap>
                <CardBottom>
                  <CardLabel $active={isActive}>{s.label}</CardLabel>
                </CardBottom>
              </CardOuter>
            );
          })}
        </CardList>
      </PanelBody>

      {nameModal && createPortal(
        <ModalOverlay onClick={() => setNameModal(null)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Name your widget</ModalTitle>
            <ModalSubtitle>You can always rename it later</ModalSubtitle>
            <ModalPreviewRow>
              <ModalPreviewThumb>
                <ModalPreviewScale>
                  {renderPreview(nameModal.style)}
                </ModalPreviewScale>
              </ModalPreviewThumb>
              <ModalPreviewInfo>
                <ModalPreviewLabel>{nameModal.label}</ModalPreviewLabel>
                <ModalPreviewMeta>{categoryLabel} widget</ModalPreviewMeta>
              </ModalPreviewInfo>
            </ModalPreviewRow>
            <ModalInput
              autoFocus
              placeholder="My awesome widget..."
              value={widgetName}
              onChange={(e) => setWidgetName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleConfirmEdit(); }}
            />
            <ModalActions>
              <Button $variant="secondary" $size="md" onClick={() => setNameModal(null)}>Cancel</Button>
              <Button $variant="primary" $size="md" onClick={handleConfirmEdit}>Create & Edit</Button>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>,
        document.body
      )}
    </PanelContainer>
  );
};
