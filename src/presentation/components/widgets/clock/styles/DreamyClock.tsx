import React from 'react';
import { ClockSettings } from '../../../../../domain/value-objects/ClockSettings';
import { ClockWidgetContainer } from './ClockCommonStyles';
import styled, { keyframes } from 'styled-components';

const colonPulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
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
`;

const ColonSpan = styled.span`
  animation: ${colonPulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  display: inline-block;
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
    $isHovered ? $textColor : `${$textColor}60`};
  transition: color 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface DreamyClockProps {
  settings: ClockSettings;
  time: Date;
  textColor: string;
}

export const DreamyClock: React.FC<DreamyClockProps> = ({ settings, time, textColor }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const hours = settings.format24h
    ? time.getHours().toString().padStart(2, '0')
    : ((time.getHours() % 12) || 12).toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const weekday = time.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const month = time.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = time.getDate();

  const period = !settings.format24h ? ` ${time.getHours() >= 12 ? 'PM' : 'AM'}` : '';

  return (
    <ClockWidgetContainer
      $backgroundColor={settings.backgroundColor}
      $accentColor={settings.accentColor}
      $borderRadius={settings.borderRadius}
      $showBorder={settings.showBorder}
      $textColor={textColor}
      $style={settings.style}
      style={{ maxWidth: '288px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <TimeDisplay $fontSize={settings.fontSize} $textColor={textColor}>
        {hours}
        <ColonSpan>:</ColonSpan>
        {minutes}
        {settings.showSeconds && (
          <>
            <ColonSpan>:</ColonSpan>
            {seconds}
          </>
        )}
        {period}
      </TimeDisplay>

      {settings.showDate && (
        <DateLine $textColor={textColor} $isHovered={isHovered}>
          {weekday}, {month} {day}
        </DateLine>
      )}
    </ClockWidgetContainer>
  );
};
