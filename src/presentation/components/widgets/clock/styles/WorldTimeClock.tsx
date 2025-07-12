import React from 'react';
import { ClockSettings } from '../../../../../domain/value-objects/ClockSettings';
import { getContrastColor } from '../../../../../presentation/themes/colors';
import { ClockWidgetContainer } from './ClockCommonStyles';
import styled from 'styled-components';

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

export const WorldTimeClock: React.FC<{ settings: ClockSettings; time: Date; textColor: string }> = ({ settings, time, textColor }) => {
  const worldCities = [
    { name: 'New York', offset: -5 },
    { name: 'London', offset: 0 },
    { name: 'Tokyo', offset: 9 },
  ];

  const getTimeForTimezone = (offset: number) => {
    const utc = time.getTime() + (time.getTimezoneOffset() * 60000);
    const targetTime = new Date(utc + (offset * 3600000));
    return targetTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: !settings.format24h
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
    </ClockWidgetContainer>
  );
}; 