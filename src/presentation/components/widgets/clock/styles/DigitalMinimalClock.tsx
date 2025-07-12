import React from 'react';
import { ClockSettings } from '../../../../../domain/value-objects/ClockSettings';
import { getContrastColor } from '../../../../../presentation/themes/colors';
import { ClockWidgetContainer } from './ClockCommonStyles';
import styled from 'styled-components';

const ClassicTimeDisplay = styled.div<{
  $fontSize: 'small' | 'medium' | 'large';
  $textColor: string;
}>`
  font-size: ${({ $fontSize }) => {
    switch ($fontSize) {
      case 'small': return '1.8rem';
      case 'large': return '3.2rem';
      default: return '2.6rem';
    }
  }};
  font-weight: 400;
  color: ${({ $textColor }) => $textColor};
  font-family: 'SF Mono', 'Monaco', 'Menlo', monospace;
  margin-bottom: 16px;
  padding: 18px 22px;
  background: transparent;
  border: 2px solid ${({ $textColor }) => `${$textColor}20`};
  border-radius: 8px;
  white-space: nowrap;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${({ $textColor }) => `${$textColor}40`};
    background: ${({ $textColor }) => `${$textColor}05`};
  }
`;

const DateDisplay = styled.div<{
  $accentColor: string;
  $borderRadius: number;
  $showDate: boolean;
  $textColor: string;
  $style: string;
}>`
  font-size: 15px;
  color: ${({ $textColor }) => `${$textColor}80`};
  background: ${({ $accentColor, $style }) => {
    if ($style === 'gradient') {
      return `linear-gradient(135deg, ${$accentColor}30, ${$accentColor}15)`;
    }
    return `${$accentColor}20`;
  }};
  padding: 12px 18px;
  border-radius: ${({ $borderRadius }) => Math.min($borderRadius / 2, 12)}px;
  display: ${({ $showDate }) => $showDate ? 'block' : 'none'};
  font-weight: 500;
  backdrop-filter: blur(10px);
  border: 1px solid ${({ $accentColor }) => `${$accentColor}40`};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  letter-spacing: -0.01em;
`;

export const DigitalMinimalClock: React.FC<{ settings: ClockSettings; time: Date; textColor: string }> = ({ settings, time, textColor }) => {
  const formatTime = (date: Date) => {
    const hours = settings.format24h
      ? date.getHours().toString().padStart(2, '0')
      : ((date.getHours() % 12) || 12).toString().padStart(2, '0');

    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    let timeString = `${hours}:${minutes}`;

    if (settings.showSeconds) {
      timeString += `:${seconds}`;
    }

    if (!settings.format24h) {
      timeString += ` ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
    }

    return timeString;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <ClockWidgetContainer
      $backgroundColor={settings.backgroundColor}
      $accentColor={settings.accentColor}
      $borderRadius={settings.borderRadius}
      $showBorder={settings.showBorder}
      $textColor={textColor}
      $style={settings.style}
    >
      <ClassicTimeDisplay
        $fontSize={settings.fontSize}
        $textColor={textColor}
      >
        {formatTime(time)}
      </ClassicTimeDisplay>

      <DateDisplay
        $accentColor={settings.accentColor}
        $borderRadius={settings.borderRadius}
        $showDate={settings.showDate}
        $textColor={textColor}
        $style={settings.style}
      >
        {formatDate(time)}
      </DateDisplay>
    </ClockWidgetContainer>
  );
}; 