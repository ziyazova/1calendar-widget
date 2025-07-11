import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Widget } from '../../../domain/entities/Widget';
import { ClockSettings } from '../../../domain/value-objects/ClockSettings';
import { getContrastColor } from '../../themes/colors';

interface ClockWidgetProps {
  widget: Widget;
}

const ClockContainer = styled.div<{
  $backgroundColor: string;
  $accentColor: string;
  $opacity: number;
  $borderRadius: number;
  $showBorder: boolean;
  $textColor: string;
}>`
  width: 100%;
  max-width: 300px;
  min-height: 200px;
  padding: 24px;
  background: ${({ $backgroundColor, $opacity }) =>
    $backgroundColor.includes('gradient')
      ? $backgroundColor
      : $opacity < 1
        ? `${$backgroundColor}${Math.round($opacity * 255).toString(16).padStart(2, '0')}`
        : $backgroundColor};
  border: ${({ $showBorder, $accentColor }) =>
    $showBorder ? `1px solid ${$accentColor}40` : 'none'};
  border-radius: ${({ $borderRadius }) => $borderRadius}px;
  text-align: center;
  backdrop-filter: blur(20px);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
`;

// Digital Clock Components
const DigitalTimeDisplay = styled.div<{
  $primaryColor: string;
  $fontSize: 'small' | 'medium' | 'large';
  $borderRadius: number;
  $textColor: string;
}>`
  font-size: ${({ $fontSize }) => {
    switch ($fontSize) {
      case 'small': return '1.8rem';
      case 'large': return '3rem';
      default: return '2.4rem';
    }
  }};
  font-weight: 700;
  color: ${({ $textColor }) => $textColor};
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  margin-bottom: 16px;
  padding: 16px 20px;
  background: ${({ $primaryColor }) => `${$primaryColor}15`};
  border-radius: ${({ $borderRadius }) => Math.min($borderRadius, 16)}px;
  backdrop-filter: blur(10px);
  border: 1px solid ${({ $primaryColor }) => `${$primaryColor}30`};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  &:hover {
    background: ${({ $primaryColor }) => `${$primaryColor}25`};
    transform: scale(1.02);
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

const AnalogClock = styled.div<{ $primaryColor: string; $accentColor: string }>`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  position: relative;
  background: ${({ $accentColor }) => `${$accentColor}20`};
  border: 3px solid ${({ $primaryColor }) => `${$primaryColor}40`};
  backdrop-filter: blur(10px);
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;

  // Hour markers
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 16px;
    background: ${({ $primaryColor }) => $primaryColor};
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
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${({ $width }) => $width}px;
  height: ${({ $length }) => $length}px;
  background: ${({ $color }) => $color};
  transform-origin: 50% 100%;
  transform: translate(-50%, -100%) rotate(${({ $rotation }) => $rotation}deg);
  border-radius: ${({ $width }) => $width / 2}px;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const ClockCenter = styled.div<{ $primaryColor: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  background: ${({ $primaryColor }) => $primaryColor};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: ${({ $accentColor }) => `${$accentColor}30`};
  border-radius: ${({ $borderRadius }) => Math.min($borderRadius / 2, 12)}px;
  backdrop-filter: blur(10px);
  border: 1px solid ${({ $primaryColor }) => `${$primaryColor}20`};
  min-height: 40px;
`;

const CityName = styled.span<{ $textColor: string }>`
  font-weight: 600;
  color: ${({ $textColor }) => $textColor};
  font-size: 0.9rem;
`;

const CityTime = styled.span<{ $textColor: string }>`
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  font-weight: 500;
  color: ${({ $textColor }) => `${$textColor}90`};
  font-size: 0.9rem;
`;

// Common Date Display
const DateDisplay = styled.div<{
  $accentColor: string;
  $borderRadius: number;
  $showDate: boolean;
  $textColor: string;
}>`
  font-size: 1rem;
  color: ${({ $textColor }) => `${$textColor}80`};
  background: ${({ $accentColor }) => `${$accentColor}20`};
  padding: 12px 16px;
  border-radius: ${({ $borderRadius }) => Math.min($borderRadius / 2, 12)}px;
  display: ${({ $showDate }) => $showDate ? 'block' : 'none'};
  font-weight: 500;
  backdrop-filter: blur(10px);
  border: 1px solid ${({ $accentColor }) => `${$accentColor}40`};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
      case 'analog':
        const hours = time.getHours() % 12;
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();

        const hourRotation = (hours * 30) + (minutes * 0.5);
        const minuteRotation = minutes * 6;
        const secondRotation = seconds * 6;

        return (
          <AnalogContainer>
            <AnalogClock $primaryColor={settings.primaryColor} $accentColor={settings.accentColor}>
              <ClockHand
                $length={50}
                $width={4}
                $rotation={hourRotation}
                $color={settings.primaryColor}
              />
              <ClockHand
                $length={65}
                $width={3}
                $rotation={minuteRotation}
                $color={settings.primaryColor}
              />
              {settings.showSeconds && (
                <ClockHand
                  $length={70}
                  $width={1}
                  $rotation={secondRotation}
                  $color={settings.accentColor}
                />
              )}
              <ClockCenter $primaryColor={settings.primaryColor} />
            </AnalogClock>

            <DateDisplay
              $accentColor={settings.accentColor}
              $borderRadius={settings.borderRadius}
              $showDate={settings.showDate}
              $textColor={textColor}
            >
              {formatDate(time)}
            </DateDisplay>
          </AnalogContainer>
        );

      case 'world':
        const worldCities = [
          { name: 'NYC', offset: -5 },
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
              >
                <CityName $textColor={textColor}>{city.name}</CityName>
                <CityTime $textColor={textColor}>
                  {getTimeForTimezone(city.offset)}
                </CityTime>
              </WorldTimeItem>
            ))}
          </WorldTimeContainer>
        );

      default: // digital
        return (
          <>
            <DigitalTimeDisplay
              $primaryColor={settings.primaryColor}
              $fontSize={settings.fontSize}
              $borderRadius={settings.borderRadius}
              $textColor={textColor}
            >
              {formatTime(time)}
            </DigitalTimeDisplay>

            <DateDisplay
              $accentColor={settings.accentColor}
              $borderRadius={settings.borderRadius}
              $showDate={settings.showDate}
              $textColor={textColor}
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
      $opacity={settings.opacity}
      $borderRadius={settings.borderRadius}
      $showBorder={settings.showBorder}
      $textColor={textColor}
    >
      {renderClockContent()}
    </ClockContainer>
  );
}; 