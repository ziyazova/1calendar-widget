import React from 'react';
import { ClockSettings } from '../../../../../domain/value-objects/ClockSettings';
import { getContrastColor } from '../../../../../presentation/themes/colors';
import { ClockWidgetContainer } from './ClockCommonStyles';
import styled, { keyframes } from 'styled-components';

const glow = keyframes`
  0%, 100% { text-shadow: 0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor; }
  50% { text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor; }
`;

const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const ModernTimeDisplay = styled.div<{
  $primaryColor: string;
  $fontSize: 'small' | 'medium' | 'large';
  $borderRadius: number;
  $textColor: string;
  $style: string;
}>`
  font-size: ${({ $fontSize }) => {
    switch ($fontSize) {
      case 'small': return 'clamp(1.4rem, 5vw, 2.2rem)';
      case 'large': return 'clamp(2rem, 7vw, 3.8rem)';
      default: return 'clamp(1.8rem, 6vw, 3rem)';
    }
  }};
  font-weight: 700;
  color: ${({ $textColor }) => $textColor};
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  margin-bottom: clamp(12px, 3vw, 20px);
  padding: clamp(12px, 3vw, 24px) clamp(16px, 4vw, 28px);
  background: ${({ $primaryColor, $style }) => {
    switch ($style) {
      case 'neon':
        return `linear-gradient(135deg, ${$primaryColor}20, ${$primaryColor}10)`;
      case 'gradient':
        return `linear-gradient(135deg, ${$primaryColor}25, ${$primaryColor}15, ${$primaryColor}25)`;
      default:
        return `${$primaryColor}15`;
    }
  }};
  border-radius: ${({ $borderRadius }) => Math.min($borderRadius, 20)}px;
  backdrop-filter: blur(10px);
  border: 1px solid ${({ $primaryColor, $style }) =>
    $style === 'neon' ? `${$primaryColor}60` : `${$primaryColor}30`};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: -0.02em;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: ${({ $style }) =>
    $style === 'neon' ? '0 0 10px currentColor' : '0 2px 4px rgba(0, 0, 0, 0.1)'};
  animation: ${({ $style }) => $style === 'neon' ? `${glow} 2s ease-in-out infinite` : 'none'};
  
  &:hover {
    background: ${({ $primaryColor, $style }) => {
    switch ($style) {
      case 'neon':
        return `linear-gradient(135deg, ${$primaryColor}30, ${$primaryColor}20)`;
      case 'gradient':
        return `linear-gradient(135deg, ${$primaryColor}35, ${$primaryColor}25, ${$primaryColor}35)`;
      default:
        return `${$primaryColor}25`;
    }
  }};
    transform: scale(1.02);
    ${({ $style }) => $style === 'neon' && `
      box-shadow: 0 0 20px currentColor;
    `}
  }

  ${({ $style }) => $style === 'gradient' && `
    background-size: 200% 100%;
    background-position: 0% 50%;
    animation: ${gradient} 3s ease infinite;
  `}
`;

const DateDisplay = styled.div<{
  $accentColor: string;
  $borderRadius: number;
  $showDate: boolean;
  $textColor: string;
  $style: string;
}>`
  font-size: clamp(12px, 2.5vw, 16px);
  color: ${({ $textColor }) => `${$textColor}80`};
  background: ${({ $accentColor, $style }) => {
    if ($style === 'gradient') {
      return `linear-gradient(135deg, ${$accentColor}30, ${$accentColor}15)`;
    }
    return `${$accentColor}20`;
  }};
  padding: clamp(8px, 2vw, 14px) clamp(12px, 3vw, 20px);
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

export const ModernClock: React.FC<{ settings: ClockSettings; time: Date; textColor: string }> = ({ settings, time, textColor }) => {
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
      <ModernTimeDisplay
        $primaryColor={settings.primaryColor}
        $fontSize={settings.fontSize}
        $borderRadius={settings.borderRadius}
        $textColor={textColor}
        $style={settings.style}
      >
        {formatTime(time)}
      </ModernTimeDisplay>

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