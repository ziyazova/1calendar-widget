import React from 'react';
import styled from 'styled-components';
import { WeatherSettings } from '../../../../../domain/value-objects/WeatherSettings';
import { getContrastColor } from '../../../../../presentation/themes/colors';
import { Sun, Cloud, CloudRain, Loader2 } from 'lucide-react';
import { WeatherWidgetContainer } from './WeatherCommonStyles';
import { WeatherApiResponse } from '../../../../../domain/entities/WeatherData';

const ForecastContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ForecastItem = styled.div<{
  $primaryColor: string;
  $accentColor: string;
  $textColor: string;
  $borderRadius: number;
  $style: string;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  background: ${({ $accentColor, $style }) => {
    switch ($style) {
      case 'modern':
        return `linear-gradient(135deg, ${$accentColor}35, ${$accentColor}25)`;
      case 'card':
        return `${$accentColor}40`;
      default:
        return `${$accentColor}30`;
    }
  }};
  border-radius: ${({ $borderRadius }) => Math.min($borderRadius / 2, 12)}px;
  backdrop-filter: blur(10px);
  border: 1px solid ${({ $primaryColor }) => `${$primaryColor}20`};
  transition: all 0.3s ease;

  &:hover {
    background: ${({ $accentColor }) => `${$accentColor}45`};
    transform: translateX(4px);
  }
`;

const ForecastDay = styled.span<{ $textColor: string }>`
  font-weight: 600;
  color: ${({ $textColor }) => $textColor};
  min-width: 70px;
  font-size: 15px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
`;

const ForecastIconContainer = styled.div<{ $primaryColor: string; $style: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: ${({ $primaryColor, $style }) => {
    switch ($style) {
      case 'modern':
        return `linear-gradient(135deg, ${$primaryColor}25, ${$primaryColor}15)`;
      default:
        return `${$primaryColor}20`;
    }
  }};
  border-radius: 50%;
  
  svg {
    color: ${({ $primaryColor }) => $primaryColor};
    width: 20px;
    height: 20px;
  }
`;

const ForecastTemp = styled.div<{ $textColor: string }>`
  display: flex;
  gap: 12px;
  font-weight: 500;
  color: ${({ $textColor }) => $textColor};
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
`;

const TempHigh = styled.span`
  color: inherit;
  font-weight: 600;
`;

const TempLow = styled.span<{ $textColor: string }>`
  color: ${({ $textColor }) => `${$textColor}60`};
  font-weight: 400;
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

interface WeatherDetailedForecastProps {
  settings: WeatherSettings;
  weatherData?: WeatherApiResponse;
  loading?: boolean;
  error?: string | null;
}

export const WeatherDetailedForecast: React.FC<WeatherDetailedForecastProps> = ({ 
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
        <ForecastContainer>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Loader2 size={40} className="animate-spin" />
            <div style={{ marginTop: '10px', color: textColor }}>Loading forecast...</div>
          </div>
        </ForecastContainer>
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
        <ForecastContainer>
          <div style={{ textAlign: 'center', padding: '20px', color: textColor }}>
            {error || 'No forecast data available'}
          </div>
        </ForecastContainer>
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
      <ForecastContainer>
        {weatherData.forecast.slice(0, 5).map((day, index) => (
          <ForecastItem
            key={index}
            $primaryColor={settings.primaryColor}
            $accentColor={settings.accentColor}
            $textColor={textColor}
            $borderRadius={settings.borderRadius}
            $style={settings.style}
          >
            <ForecastDay $textColor={textColor}>{day.dayShort}</ForecastDay>
            <ForecastIconContainer
              $primaryColor={settings.primaryColor}
              $style={settings.style}
            >
              {getWeatherIcon(day.icon, 20)}
            </ForecastIconContainer>
            <ForecastTemp $textColor={textColor}>
              <TempHigh>{convertTemperature(day.maxTemp)}{getTemperatureUnit()}</TempHigh>
              <TempLow $textColor={textColor}>{convertTemperature(day.minTemp)}{getTemperatureUnit()}</TempLow>
            </ForecastTemp>
          </ForecastItem>
        ))}
      </ForecastContainer>
    </WeatherWidgetContainer>
  );
}; 