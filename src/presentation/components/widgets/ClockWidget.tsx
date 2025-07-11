import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Widget } from '../../../domain/entities/Widget';
import { ClockSettings } from '../../../domain/value-objects/ClockSettings';
import { getContrastColor } from '../../themes/colors';

interface ClockWidgetProps {
  widget: Widget;
}

// Animations
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

const ClockContainer = styled.div<{
  $backgroundColor: string;
  $accentColor: string;
  $borderRadius: number;
  $showBorder: boolean;
  $textColor: string;
  $style: string;
}>`
  width: 100%;
  max-width: 300px;
  min-height: 200px;
  padding: 24px;
  background: ${({ $backgroundColor, $style }) => {
    if ($style === 'gradient') {
      return `linear-gradient(-45deg, ${$backgroundColor}, ${$backgroundColor}CC, ${$backgroundColor}99, ${$backgroundColor}CC)`;
    }
    return $backgroundColor;
  }};
  background-size: ${({ $style }) => $style === 'gradient' ? '400% 400%' : 'auto'};
  animation: ${({ $style }) => $style === 'gradient' ? `${gradient} 6s ease infinite` : 'none'};
  border: ${({ $showBorder, $accentColor, $style }) => {
    if (!$showBorder) return 'none';
    if ($style === 'neon') return `2px solid ${$accentColor}`;
    return `1px solid ${$accentColor}40`;
  }};
  border-radius: ${({ $borderRadius }) => $borderRadius}px;
  text-align: center;
  backdrop-filter: blur(20px);
  box-shadow: ${({ $style, $accentColor }) => {
    switch ($style) {
      case 'neon':
        return `0 0 20px ${$accentColor}40, 0 8px 32px rgba(0, 0, 0, 0.1)`;
      case 'gradient':
        return `0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)`;
      default:
        return `0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)`;
    }
  }};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    animation: ${({ $style }) => $style === 'modern' ? `${pulse} 2s ease infinite` : 'none'};
  }

  ${({ $style }) => $style === 'neon' && `
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      border-radius: inherit;
      z-index: -1;
    }
  `}
`;

// Modern Digital Style
const ModernTimeDisplay = styled.div<{
  $primaryColor: string;
  $fontSize: 'small' | 'medium' | 'large';
  $borderRadius: number;
  $textColor: string;
  $style: string;
}>`
  font-size: ${({ $fontSize }) => {
    switch ($fontSize) {
      case 'small': return '2rem';
      case 'large': return '3.5rem';
      default: return '2.8rem';
    }
  }};
  font-weight: 700;
  color: ${({ $textColor }) => $textColor};
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  margin-bottom: 16px;
  padding: 20px 24px;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.02em;
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

// Classic Style (более консервативный)
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

// Analog Clock Components
const AnalogContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

const AnalogClock = styled.div<{ $primaryColor: string; $accentColor: string; $style: string }>`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  position: relative;
  background: ${({ $accentColor, $style }) => {
    if ($style === 'gradient') {
      return `radial-gradient(circle, ${$accentColor}30, ${$accentColor}10)`;
    }
    return `${$accentColor}20`;
  }};
  border: ${({ $primaryColor, $style }) => {
    if ($style === 'neon') {
      return `3px solid ${$primaryColor}`;
    }
    return `3px solid ${$primaryColor}40`;
  }};
  backdrop-filter: blur(10px);
  box-shadow: ${({ $style, $primaryColor }) => {
    if ($style === 'neon') {
      return `0 0 20px ${$primaryColor}30, inset 0 2px 4px rgba(0, 0, 0, 0.1)`;
    }
    return `inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)`;
  }};
  flex-shrink: 0;

  // Hour markers - более стильные
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 3px;
    height: 20px;
    background: ${({ $primaryColor }) => $primaryColor};
    border-radius: 2px;
    box-shadow: 
      0 72px 0 ${({ $primaryColor }) => $primaryColor},
      0 144px 0 ${({ $primaryColor }) => $primaryColor},
      72px 72px 0 ${({ $primaryColor }) => $primaryColor},
      -72px 72px 0 ${({ $primaryColor }) => $primaryColor};
  }
`;

const ClockHand = styled.div<{
  $length: number;
  $width: number;
  $rotation: number;
  $color: string;
  $style: string;
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${({ $width }) => $width}px;
  height: ${({ $length }) => $length}px;
  background: ${({ $color, $style }) => {
    if ($style === 'gradient') {
      return `linear-gradient(0deg, ${$color}, ${$color}CC)`;
    }
    return $color;
  }};
  transform-origin: 50% 100%;
  transform: translate(-50%, -100%) rotate(${({ $rotation }) => $rotation}deg);
  border-radius: ${({ $width }) => $width / 2}px;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${({ $style }) =>
    $style === 'neon' ? '0 0 10px currentColor' : '0 2px 4px rgba(0, 0, 0, 0.2)'};
`;

const ClockCenter = styled.div<{ $primaryColor: string; $style: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 12px;
  background: ${({ $primaryColor }) => $primaryColor};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  box-shadow: ${({ $style }) =>
    $style === 'neon' ? '0 0 15px currentColor' : '0 2px 4px rgba(0, 0, 0, 0.2)'};
`;

// World Clock Components
const WorldTimeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 100%;
`;

const WorldTimeItem = styled.div<{
  $primaryColor: string;
  $accentColor: string;
  $textColor: string;
  $borderRadius: number;
  $style: string;
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: ${({ $accentColor, $style }) => {
    if ($style === 'gradient') {
      return `linear-gradient(135deg, ${$accentColor}40, ${$accentColor}20)`;
    }
    return `${$accentColor}30`;
  }};
  border-radius: ${({ $borderRadius }) => Math.min($borderRadius / 2, 12)}px;
  backdrop-filter: blur(10px);
  border: 1px solid ${({ $primaryColor }) => `${$primaryColor}20`};
  min-height: 44px;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ $accentColor, $style }) => {
    if ($style === 'gradient') {
      return `linear-gradient(135deg, ${$accentColor}50, ${$accentColor}30)`;
    }
    return `${$accentColor}40`;
  }};
    transform: translateX(4px);
  }
`;

const CityName = styled.span<{ $textColor: string }>`
  font-weight: 600;
  color: ${({ $textColor }) => $textColor};
  font-size: 15px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
`;

const CityTime = styled.span<{ $textColor: string }>`
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  font-weight: 500;
  color: ${({ $textColor }) => `${$textColor}90`};
  font-size: 15px;
  letter-spacing: 0.02em;
`;

// Common Date Display
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

export const ClockWidget: React.FC<ClockWidgetProps> = ({ widget }) => {
  const settings = widget.settings as ClockSettings;
  const [time, setTime] = useState(new Date());

  const textColor = getContrastColor(settings.backgroundColor);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  const getTimeForTimezone = (offset: number) => {
    const utc = time.getTime() + (time.getTimezoneOffset() * 60000);
    const targetTime = new Date(utc + (offset * 3600000));
    return targetTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: !settings.format24h
    });
  };

  const renderClockContent = () => {
    switch (settings.style) {
      case 'analog-classic':
        const hours = time.getHours() % 12;
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();

        const hourRotation = (hours * 30) + (minutes * 0.5);
        const minuteRotation = minutes * 6;
        const secondRotation = seconds * 6;

        return (
          <AnalogContainer>
            <AnalogClock
              $primaryColor={settings.primaryColor}
              $accentColor={settings.accentColor}
              $style={settings.style}
            >
              <ClockHand
                $length={50}
                $width={4}
                $rotation={hourRotation}
                $color={settings.primaryColor}
                $style={settings.style}
              />
              <ClockHand
                $length={65}
                $width={3}
                $rotation={minuteRotation}
                $color={settings.primaryColor}
                $style={settings.style}
              />
              {settings.showSeconds && (
                <ClockHand
                  $length={70}
                  $width={1}
                  $rotation={secondRotation}
                  $color={settings.accentColor}
                  $style={settings.style}
                />
              )}
              <ClockCenter
                $primaryColor={settings.primaryColor}
                $style={settings.style}
              />
            </AnalogClock>

            <DateDisplay
              $accentColor={settings.accentColor}
              $borderRadius={settings.borderRadius}
              $showDate={settings.showDate}
              $textColor={textColor}
              $style={settings.style}
            >
              {formatDate(time)}
            </DateDisplay>
          </AnalogContainer>
        );

      case 'world-time':
        const worldCities = [
          { name: 'New York', offset: -5 },
          { name: 'London', offset: 0 },
          { name: 'Tokyo', offset: 9 },
        ];

        return (
          <WorldTimeContainer>
            {worldCities.map((city) => (
              <WorldTimeItem
                key={city.name}
                $primaryColor={settings.primaryColor}
                $accentColor={settings.accentColor}
                $textColor={textColor}
                $borderRadius={settings.borderRadius}
                $style={settings.style}
              >
                <CityName $textColor={textColor}>{city.name}</CityName>
                <CityTime $textColor={textColor}>
                  {getTimeForTimezone(city.offset)}
                </CityTime>
              </WorldTimeItem>
            ))}
          </WorldTimeContainer>
        );

      case 'digital-minimal':
        return (
          <>
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
          </>
        );

      default: // modern, neon, gradient
        return (
          <>
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
          </>
        );
    }
  };

  return (
    <ClockContainer
      $backgroundColor={settings.backgroundColor}
      $accentColor={settings.accentColor}
      $borderRadius={settings.borderRadius}
      $showBorder={settings.showBorder}
      $textColor={textColor}
      $style={settings.style}
    >
      {renderClockContent()}
    </ClockContainer>
  );
}; 