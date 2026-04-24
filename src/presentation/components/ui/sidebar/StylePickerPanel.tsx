import React, { useMemo, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { X, Pencil, Lock } from 'lucide-react';
import { Button, Modal, ModalFooter } from '@/presentation/components/shared';
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
  background: ${({ theme }) => theme.colors.background.elevated};
  border-left: 1px solid ${({ theme }) => theme.colors.border.light};
  z-index: ${({ theme }) => theme.zIndex.sticky - 1};
  display: flex;
  flex-direction: column;
  animation: ${slideIn} 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    left: 220px;
    width: 260px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
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
  transition: all ${({ theme }) => theme.transitions.fast};

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
  border: 1.5px solid ${({ $active, theme }) => $active ? theme.colors.state.active : theme.colors.border.hairline};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.background.elevated};
  overflow: hidden;
  transition: border-color ${({ theme }) => theme.transitions.medium}, box-shadow ${({ theme }) => theme.transitions.medium};
  cursor: pointer;
  opacity: 0;
  animation: ${cardAppear} 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: ${({ $index }) => 0.06 + $index * 0.06}s;

  &:hover {
    border-color: ${({ $active, theme }) => $active ? theme.colors.state.active : 'rgba(0, 0, 0, 0.12)'};
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  }

  ${({ $active }) => $active && css`
    box-shadow: ${({ theme }) => theme.shadows.focusBlue};
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
  transition: opacity ${({ theme }) => theme.transitions.medium};
  z-index: 2;
  pointer-events: auto;
`;

const PreviewWrap = styled.div`
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  position: relative;
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
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
  color: ${({ $active, theme }) => $active ? theme.colors.state.active : theme.colors.text.primary};
  letter-spacing: -0.01em;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 18px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  background: rgba(255, 255, 255, 0.95);
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  letter-spacing: -0.01em;

  svg { width: 14px; height: 14px; }

  &:hover {
    background: ${({ theme }) => theme.colors.background.elevated};
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
  border-radius: ${({ theme }) => theme.radii.md};
  background: rgba(255, 255, 255, 0.95);
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  letter-spacing: -0.01em;

  svg { width: 13px; height: 13px; }

  &:hover {
    background: ${({ theme }) => theme.colors.background.elevated};
    color: ${({ theme }) => theme.colors.text.body};
  }
`;

/* ── Name Modal ── */

/* Input for the "Name your widget" form inside the shared <Modal>.
 * Kept local (not shared) because this is the only "Name" modal that
 * exists post-migration — WidgetStudioPage has its own NameModalInput
 * with the same styling. */
const ModalInput = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border: 1.5px solid rgba(0, 0, 0, 0.08);
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text.primary};
  outline: none;
  transition: all ${({ theme }) => theme.transitions.fast};
  letter-spacing: -0.01em;
  margin-bottom: 20px;

  &::placeholder { color: rgba(0, 0, 0, 0.25); }
  &:focus { border-color: rgba(51, 132, 244, 0.4); background: ${({ theme }) => theme.colors.background.elevated}; }
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

      <Modal
        open={!!nameModal}
        onClose={() => setNameModal(null)}
        eyebrow={nameModal ? `New ${categoryLabel.toLowerCase()}` : undefined}
        title="Name your widget"
        size="sm"
        hideClose
      >
        <ModalInput
          autoFocus
          placeholder="My awesome widget..."
          value={widgetName}
          onChange={(e) => setWidgetName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleConfirmEdit(); }}
        />
        <ModalFooter>
          <Button type="button" $variant="outline" $size="lg" onClick={() => setNameModal(null)}>Cancel</Button>
          <Button type="button" $variant="primary" $size="lg" onClick={handleConfirmEdit}>Create &amp; Edit</Button>
        </ModalFooter>
      </Modal>
    </PanelContainer>
  );
};
