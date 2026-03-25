import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';
import { Check } from 'lucide-react';
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
  currentWidget: string;
  onWidgetChange: (type: string, style?: string) => void;
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

const PanelGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 8px 0 4px;
`;

const CardOuter = styled.button<{ $active: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  padding: 0;
  border: 1.5px solid ${({ $active }) => $active ? '#3384F4' : 'rgba(0, 0, 0, 0.06)'};
  border-radius: 12px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
  font-family: inherit;

  &:hover {
    border-color: ${({ $active }) => $active ? '#3384F4' : 'rgba(0, 0, 0, 0.12)'};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.97);
  }

  ${({ $active }) => $active && css`
    box-shadow: 0 0 0 3px rgba(51, 132, 244, 0.12);
  `}
`;

const PreviewWrap = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 10px 10px 0 0;
  position: relative;
  background: #FAFAFA;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const PreviewScale = styled.div`
  transform: scale(0.22);
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

const CardLabel = styled.div<{ $active: boolean }>`
  width: 100%;
  padding: 8px 10px;
  font-size: 12px;
  font-weight: ${({ $active }) => $active ? 500 : 400};
  color: ${({ $active }) => $active ? '#3384F4' : '#1F1F1F'};
  letter-spacing: -0.01em;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
`;

const CheckIcon = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3384F4;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;

  svg {
    width: 10px;
    height: 10px;
  }
`;

/* ── Component ── */

export const StylePickerPanel: React.FC<StylePickerPanelProps> = ({
  styles,
  widgetType,
  currentWidget,
  onWidgetChange,
}) => {
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
    <PanelGrid>
      {styles.map((s) => {
        const isActive = currentWidget === `${widgetType}-${s.value}`;
        return (
          <CardOuter
            key={s.value}
            $active={isActive}
            onClick={() => onWidgetChange(widgetType, s.value)}
          >
            <PreviewWrap>
              {renderPreview(s.value)}
            </PreviewWrap>
            <CardLabel $active={isActive}>
              {s.label}
              {isActive && (
                <CheckIcon>
                  <Check />
                </CheckIcon>
              )}
            </CardLabel>
          </CardOuter>
        );
      })}
    </PanelGrid>
  );
};
