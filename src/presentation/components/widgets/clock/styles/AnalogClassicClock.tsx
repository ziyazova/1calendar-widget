import React, { useRef } from 'react';
import { ClockSettings } from '../../../../../domain/value-objects/ClockSettings';
import { getContrastColor } from '../../../../../presentation/themes/colors';
import { ClockWidgetContainer } from './ClockCommonStyles';
import styled from 'styled-components';

const AnalogContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

// Размеры часов и засечек
const CLOCK_SIZE = 160;
const CLOCK_BORDER = 3;
const MARK_LONG = 24;
const MARK_SHORT = 14;
const MARK_WIDTH = 2;
// Радиус до основания засечки (чтобы основание лежало на окружности)
const RADIUS = (CLOCK_SIZE / 2) - (CLOCK_BORDER / 2);

const HourMark = styled.div<{
  $angle: number;
  $length: number;
  $primaryColor: string;
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${MARK_WIDTH}px;
  height: ${({ $length }) => $length}px;
  background: ${({ $primaryColor }) => $primaryColor};
  border-radius: 2px;
  transform-origin: 50% 0%; /* Вращаем от основания */
  transform: rotate(${({ $angle }) => $angle}deg) translateY(-${RADIUS}px);
  opacity: ${({ $length }) => ($length === MARK_LONG ? 1 : 0.6)};
  box-shadow: none;
`;

const HourMarks: React.FC<{ primaryColor: string }> = ({ primaryColor }) => (
  <>
    {Array.from({ length: 12 }).map((_, i) => {
      const angle = i * 30;
      const isMain = i % 3 === 0;
      return (
        <HourMark
          key={i}
          $angle={angle}
          $length={isMain ? MARK_LONG : MARK_SHORT}
          $primaryColor={primaryColor}
        />
      );
    })}
  </>
);

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
`;

const ClockHand = styled.div<{
  $length: number;
  $width: number;
  $rotation: number;
  $color: string;
  $style: string;
  $transition?: string;
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
  transition: ${({ $transition }) => $transition || 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'};
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

export const AnalogClassicClock: React.FC<{ settings: ClockSettings; time: Date; textColor: string }> = ({ settings, time, textColor }) => {
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const prevSecondRef = useRef<number>(seconds);
  const prevSecond = prevSecondRef.current;
  React.useEffect(() => {
    prevSecondRef.current = seconds;
  }, [seconds]);

  const hourRotation = (hours * 30) + (minutes * 0.5);
  const minuteRotation = minutes * 6;
  const secondRotation = seconds * 6;

  // Определяем transition для секундной стрелки
  let secondHandTransition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
  if (prevSecond === 59 && seconds === 0) {
    secondHandTransition = 'none';
  }

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
      <AnalogContainer>
        <AnalogClock
          $primaryColor={settings.primaryColor}
          $accentColor={settings.accentColor}
          $style={settings.style}
        >
          <HourMarks primaryColor={settings.primaryColor} />
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
              $transition={secondHandTransition}
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
    </ClockWidgetContainer>
  );
}; 