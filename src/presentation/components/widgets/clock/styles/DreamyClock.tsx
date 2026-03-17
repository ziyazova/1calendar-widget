import React, { useRef, useEffect, useState } from 'react';
import { useRive } from '@rive-app/react-canvas';
import { ClockSettings } from '../../../../../domain/value-objects/ClockSettings';
import styled, { keyframes } from 'styled-components';
import { getEffectiveTextColor } from '../../../../themes/colors';

const DESIGN_WIDTH = 288;

// Dino base hue is ~100 (green). Calculate rotation to match primaryColor.
function hexToHue(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  if (d === 0) return 0;
  let h = 0;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return ((h * 60) + 360) % 360;
}

const DINO_BASE_HUE = 100; // green

const colonPulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

const OuterWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: visible;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ZoomWrapper = styled.div<{ $zoom: number }>`
  width: ${DESIGN_WIDTH}px;
  zoom: ${({ $zoom }) => $zoom};
`;

const Container = styled.div<{
  $backgroundColor: string;
  $borderRadius: number;
  $showBorder: boolean;
  $accentColor: string;
  $textColor: string;
}>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px;
  background: ${({ $backgroundColor }) => $backgroundColor};
  border: ${({ $showBorder, $accentColor }) =>
    $showBorder ? `1.5px solid ${$accentColor}40` : `1px solid ${$accentColor}20`};
  border-radius: ${({ $borderRadius }) => $borderRadius}px;
  color: ${({ $textColor }) => $textColor};
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  box-sizing: border-box;
  position: relative;
  overflow: visible;
`;

const TimeDisplay = styled.div<{
  $fontSize: 'small' | 'medium' | 'large';
  $textColor: string;
}>`
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
  font-size: ${({ $fontSize }) => {
    switch ($fontSize) {
      case 'small': return 'clamp(1.6rem, 6vw, 2.2rem)';
      case 'large': return 'clamp(2.4rem, 9vw, 3.6rem)';
      default: return 'clamp(2rem, 7.5vw, 3rem)';
    }
  }};
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.04em;
  color: ${({ $textColor }) => $textColor};
  user-select: none;
  line-height: 1;
  position: relative;
  z-index: 1;
  margin-top: 20px;
`;

const ColonSpan = styled.span`
  animation: ${colonPulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  display: inline-block;
`;

const PeriodSpan = styled.span`
  font-size: 0.3em;
  font-weight: 400;
  letter-spacing: 0.05em;
  margin-left: 3px;
  opacity: 0.4;
  vertical-align: baseline;
`;

const DateLine = styled.div<{
  $textColor: string;
  $isHovered: boolean;
}>`
  margin-top: clamp(12px, 3vw, 20px);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  font-size: clamp(8px, 2vw, 11px);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 400;
  color: ${({ $textColor, $isHovered }) =>
    $isHovered ? `${$textColor}90` : `${$textColor}35`};
  transition: color 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  z-index: 1;
`;

const RiveWrapper = styled.div<{ $hue: number }>`
  width: 165%;
  height: 110px;
  margin-top: -10px;
  margin-bottom: -20px;
  overflow: hidden;
  filter: hue-rotate(${({ $hue }) => $hue}deg);
`;

interface DreamyClockProps {
  settings: ClockSettings;
  time: Date;
  textColor: string;
}

export const DreamyClock: React.FC<DreamyClockProps> = ({ settings, time, textColor }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [zoom, setZoom] = useState(1);
  const outerRef = useRef<HTMLDivElement>(null);

  const isEmbed = window.location.pathname.includes('/embed/');

  useEffect(() => {
    if (!outerRef.current) return;
    const maxZoom = isEmbed ? 2.0 : 1.2;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const parentWidth = entry.contentRect.width;
        setZoom(Math.min(maxZoom, Math.max(0.25, parentWidth / DESIGN_WIDTH)));
      }
    });
    ro.observe(outerRef.current);
    return () => ro.disconnect();
  }, [isEmbed]);

  const { rive, RiveComponent } = useRive({
    src: '/dreamy-dino.riv',
    stateMachines: 'State Machine 1',
    autoplay: true,
    artboard: 'Artboard',
  });

  React.useEffect(() => {
    if (rive) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const r = rive as any;
        if ('disableArtboardBackground' in r) {
          r.disableArtboardBackground = true;
        } else if (r.artboard?.nativeArtboard) {
          r.artboard.nativeArtboard.backgroundColor = 0x00000000;
        }
      } catch { /* ignore */ }
    }
  }, [rive]);

  const hours = settings.format24h
    ? time.getHours().toString().padStart(2, '0')
    : ((time.getHours() % 12) || 12).toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const weekday = time.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const month = time.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = time.getDate();

  const period = !settings.format24h ? (time.getHours() >= 12 ? 'PM' : 'AM') : '';

  const effectiveTextColor = getEffectiveTextColor(settings.primaryColor, settings.backgroundColor);

  const targetHue = hexToHue(settings.primaryColor);
  const hueRotation = targetHue - DINO_BASE_HUE;

  return (
    <OuterWrapper ref={outerRef}>
      <ZoomWrapper $zoom={zoom}>
        <Container
          $backgroundColor={settings.backgroundColor}
          $accentColor={settings.accentColor}
          $borderRadius={settings.borderRadius}
          $showBorder={settings.showBorder}
          $textColor={textColor}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <TimeDisplay $fontSize={settings.fontSize} $textColor={effectiveTextColor}>
            {hours}
            <ColonSpan>:</ColonSpan>
            {minutes}
            {settings.showSeconds && (
              <>
                <ColonSpan>:</ColonSpan>
                {seconds}
              </>
            )}
            {period && <PeriodSpan>{period}</PeriodSpan>}
          </TimeDisplay>

          {settings.showDate && (
            <DateLine $textColor={effectiveTextColor} $isHovered={isHovered}>
              {weekday}, {month} {day}
            </DateLine>
          )}

          <RiveWrapper $hue={hueRotation}>
            <RiveComponent style={{ background: 'transparent' }} />
          </RiveWrapper>
        </Container>
      </ZoomWrapper>
    </OuterWrapper>
  );
};
