import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ClockSettings } from '../../../../../domain/value-objects/ClockSettings';

interface ClassicClockProps {
  settings: ClockSettings;
  time: Date;
  textColor: string;
}

const DESIGN_WIDTH = 300;

const OuterWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ZoomWrapper = styled.div<{ $zoom: number }>`
  width: ${DESIGN_WIDTH}px;
  zoom: ${({ $zoom }) => $zoom};
`;

const FlipContainer = styled.div`
  width: 100%;
  max-width: ${DESIGN_WIDTH}px;
  display: flex;
  gap: 7px;
  box-sizing: border-box;
`;

const FlipPanel = styled.div<{
  $bgColor: string;
  $borderRadius: number;
  $showBorder: boolean;
  $textColor: string;
}>`
  flex: 1;
  aspect-ratio: 0.67 / 1;
  background: ${({ $bgColor }) => $bgColor};
  border-radius: ${({ $borderRadius }) => $borderRadius}px;
  border: ${({ $showBorder, $textColor }) =>
    $showBorder ? `1px solid ${$textColor}25` : 'none'};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-sizing: border-box;
`;

const FlipLine = styled.div<{ $color: string }>`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1.6px;
  background: ${({ $color }) => $color};
  z-index: 2;
  transform: translateY(-50%);
`;

const FlipNumber = styled.span<{ $color: string }>`
  font-size: 120px;
  font-weight: 400;
  color: ${({ $color }) => $color};
  font-family: 'Bebas Neue', sans-serif;
  letter-spacing: 0.02em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  z-index: 1;
`;

const PanelLabel = styled.span<{ $color: string; $align: 'left' | 'right' }>`
  position: absolute;
  bottom: 10px;
  ${({ $align }) => $align === 'left' ? 'left: 12px;' : 'right: 12px;'}
  font-size: 20px;
  font-weight: 400;
  color: ${({ $color }) => $color};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-family: 'Bebas Neue', sans-serif;
  z-index: 3;
`;

const DAY_NAMES = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

export const ClassicClock: React.FC<ClassicClockProps> = ({ settings, time }) => {
  const [zoom, setZoom] = useState(1);
  const outerRef = useRef<HTMLDivElement>(null);

  const isEmbed = window.location.pathname.includes('/embed/');

  useEffect(() => {
    if (!outerRef.current) return;
    const maxZoom = isEmbed ? 2.0 : 1.0;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const parentWidth = entry.contentRect.width;
        setZoom(Math.min(maxZoom, Math.max(0.25, parentWidth / DESIGN_WIDTH)));
      }
    });
    ro.observe(outerRef.current);
    return () => ro.disconnect();
  }, [isEmbed]);

  const hours = settings.format24h
    ? time.getHours().toString().padStart(2, '0')
    : ((time.getHours() % 12) || 12).toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM';
  const dayName = DAY_NAMES[time.getDay()];

  const leftLabel = settings.format24h ? '' : ampm;
  const rightLabel = settings.showDate ? dayName : '';

  return (
    <OuterWrapper ref={outerRef}>
      <ZoomWrapper $zoom={zoom}>
        <FlipContainer>
          <FlipPanel
            $bgColor={settings.backgroundColor}
            $borderRadius={settings.borderRadius}
            $showBorder={settings.showBorder}
            $textColor={settings.primaryColor}
          >
            <FlipLine $color="transparent" />
            <FlipNumber $color={settings.primaryColor}>
              {hours}
            </FlipNumber>
            {leftLabel && (
              <PanelLabel $color={settings.primaryColor} $align="left">
                {leftLabel}
              </PanelLabel>
            )}
          </FlipPanel>

          <FlipPanel
            $bgColor={settings.backgroundColor}
            $borderRadius={settings.borderRadius}
            $showBorder={settings.showBorder}
            $textColor={settings.primaryColor}
          >
            <FlipLine $color="transparent" />
            <FlipNumber $color={settings.primaryColor}>
              {minutes}
            </FlipNumber>
            {rightLabel && (
              <PanelLabel $color={settings.primaryColor} $align="right">
                {rightLabel}
              </PanelLabel>
            )}
          </FlipPanel>
        </FlipContainer>
      </ZoomWrapper>
    </OuterWrapper>
  );
};
