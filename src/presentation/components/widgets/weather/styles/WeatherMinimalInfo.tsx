import React from 'react';
import styled from 'styled-components';
import { WeatherSettings } from '../../../../../domain/value-objects/WeatherSettings';
import { getContrastColor } from '../../../../../presentation/themes/colors';
import { Sun, Cloud, CloudRain, Loader2 } from 'lucide-react';
import { WeatherWidgetContainer } from './WeatherCommonStyles';
import { WeatherCurrent } from '../../../../../domain/entities/WeatherData';

const MinimalContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
`;

const MinimalLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MinimalTemp = styled.div<{ $textColor: string }>`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ $textColor }) => $textColor};
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  letter-spacing: -0.02em;
`;

const MinimalCondition = styled.div<{ $textColor: string }>`
  font-size: 15px;
  color: ${({ $textColor }) => `${$textColor}80`};
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
`;

const WeatherIcon = styled.div<{ $primaryColor: string; $style: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
  background: ${({ $primaryColor }) => `${$primaryColor}20`};
  border-radius: 50%;
  border: 2px solid ${({ $primaryColor }) => `${$primaryColor}40`};
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  svg {
    color: ${({ $primaryColor }) => $primaryColor};
  }

  &:hover {
    transform: scale(1.05);
    background: ${({ $primaryColor }) => `${$primaryColor}30`};
  }
`;

const getWeatherIcon = (icon: string, size: number = 32) => {
  const props = { size };
  switch (icon) {
    case 'clear-day':
      return <Sun {...props} />;
    case 'clear-night':
      return <Sun {...props} />;
    case 'cloudy':
      return <Cloud {...props} />;
    case 'partly-cloudy-day':
    case 'partly-cloudy-night':
      return <Cloud {...props} />;
    case 'rain':
    case 'sleet':
      return <CloudRain {...props} />;
    case 'snow':
      return <CloudRain {...props} />;
    case 'fog':
      return <Cloud {...props} />;
    default:
      return <Sun {...props} />;
  }
};

interface WeatherMinimalInfoProps {
  settings: WeatherSettings;
  weatherData?: WeatherCurrent;
  loading?: boolean;
  error?: string | null;
}

export const WeatherMinimalInfo: React.FC<WeatherMinimalInfoProps> = ({ 
  settings, 
  weatherData, 
  loading = false, 
  error = null 
}) => {
  const textColor = getContrastColor(settings.backgroundColor);

  const convertTemperature = (celsius: number) => {
    if (settings.temperatureUnit === 'fahrenheit') {
      return Math.round((celsius * 9 / 5) + 32);
    }
    return celsius;
  };

  const getTemperatureUnit = () => {
    return settings.temperatureUnit === 'fahrenheit' ? '°F' : '°C';
  };

  if (loading) {
    return (
      <WeatherWidgetContainer
        $backgroundColor={settings.backgroundColor}
        $accentColor={settings.accentColor}
        $borderRadius={settings.borderRadius}
        $showBorder={settings.showBorder}
        $textColor={textColor}
        $style={settings.style}
      >
        <MinimalContainer>
          <Loader2 size={40} className="animate-spin" />
        </MinimalContainer>
      </WeatherWidgetContainer>
    );
  }

  if (error || !weatherData) {
    return (
      <WeatherWidgetContainer
        $backgroundColor={settings.backgroundColor}
        $accentColor={settings.accentColor}
        $borderRadius={settings.borderRadius}
        $showBorder={settings.showBorder}
        $textColor={textColor}
        $style={settings.style}
      >
        <MinimalContainer>
          <MinimalCondition $textColor={textColor}>
            {error || 'No weather data'}
          </MinimalCondition>
        </MinimalContainer>
      </WeatherWidgetContainer>
    );
  }

  return (
    <WeatherWidgetContainer
      $backgroundColor={settings.backgroundColor}
      $accentColor={settings.accentColor}
      $borderRadius={settings.borderRadius}
      $showBorder={settings.showBorder}
      $textColor={textColor}
      $style={settings.style}
    >
      <MinimalContainer>
        <MinimalLeft>
          <MinimalTemp $textColor={textColor}>
            {convertTemperature(weatherData.temp)}{getTemperatureUnit()}
          </MinimalTemp>
          <MinimalCondition $textColor={textColor}>
            {weatherData.summary}
          </MinimalCondition>
        </MinimalLeft>
        <WeatherIcon
          $primaryColor={settings.primaryColor}
          $style={settings.style}
        >
          {getWeatherIcon(weatherData.icon, 40)}
        </WeatherIcon>
      </MinimalContainer>
    </WeatherWidgetContainer>
  );
}; 