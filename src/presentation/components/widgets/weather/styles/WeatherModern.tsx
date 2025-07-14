import React from 'react';
import styled from 'styled-components';
import { WeatherSettings } from '../../../../../domain/value-objects/WeatherSettings';
import { getContrastColor } from '../../../../../presentation/themes/colors';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, Loader2 } from 'lucide-react';
import { WeatherWidgetContainer } from './WeatherCommonStyles';
import { WeatherCurrent } from '../../../../../domain/entities/WeatherData';

const CurrentWeatherContainer = styled.div`
  text-align: center;
`;

const WeatherIcon = styled.div<{ $primaryColor: string; $style: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $style }) => $style === 'minimal' ? '60px' : '80px'};
  height: ${({ $style }) => $style === 'minimal' ? '60px' : '80px'};
  margin: ${({ $style }) => $style === 'minimal' ? '0 auto 16px' : '0 auto 20px'};
  background: ${({ $primaryColor, $style }) => {
    switch ($style) {
      case 'modern':
        return `linear-gradient(135deg, ${$primaryColor}20, ${$primaryColor}10)`;
      case 'card':
        return `${$primaryColor}25`;
      default:
        return `${$primaryColor}20`;
    }
  }};
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

const MainTemperature = styled.div<{ $primaryColor: string; $textColor: string; $style: string }>`
  font-size: ${({ $style }) => {
    switch ($style) {
      case 'minimal': return '3rem';
      case 'detailed': return '4.5rem';
      default: return '4rem';
    }
  }};
  font-weight: 700;
  color: ${({ $textColor }) => $textColor};
  margin: 20px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  letter-spacing: -0.02em;
`;

const WeatherDescription = styled.div<{ $textColor: string; $style: string }>`
  font-size: ${({ $style }) => $style === 'minimal' ? '14px' : '16px'};
  font-weight: 500;
  color: ${({ $textColor }) => `${$textColor}90`};
  margin-bottom: ${({ $style }) => $style === 'minimal' ? '16px' : '24px'};
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
`;

const WeatherDetails = styled.div<{ $style: string }>`
  display: grid;
  grid-template-columns: repeat(${({ $style }) => $style === 'minimal' ? '2' : '3'}, 1fr);
  gap: 12px;
  margin-top: 20px;
`;

const DetailItem = styled.div<{
  $accentColor: string;
  $borderRadius: number;
  $textColor: string;
  $style: string;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: ${({ $style }) => $style === 'minimal' ? '12px' : '16px'};
  background: ${({ $accentColor, $style }) => {
    switch ($style) {
      case 'modern':
        return `linear-gradient(135deg, ${$accentColor}30, ${$accentColor}20)`;
      case 'card':
        return `${$accentColor}35`;
      default:
        return `${$accentColor}30`;
    }
  }};
  border-radius: ${({ $borderRadius }) => Math.min($borderRadius / 2, 12)}px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background: ${({ $accentColor }) => `${$accentColor}40`};
    transform: translateY(-2px);
  }
`;

const DetailIcon = styled.div<{ $accentColor: string }>`
  color: ${({ $accentColor }) => $accentColor};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DetailValue = styled.span<{ $textColor: string; $style: string }>`
  font-weight: 600;
  color: ${({ $textColor }) => $textColor};
  font-size: ${({ $style }) => $style === 'minimal' ? '13px' : '14px'};
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
`;

const DetailLabel = styled.span<{ $textColor: string; $style: string }>`
  font-size: ${({ $style }) => $style === 'minimal' ? '11px' : '12px'};
  color: ${({ $textColor }) => `${$textColor}70`};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
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
    case 'wind':
      return <Wind {...props} />;
    default:
      return <Sun {...props} />;
  }
};

interface WeatherModernProps {
  settings: WeatherSettings;
  weatherData?: WeatherCurrent;
  loading?: boolean;
  error?: string | null;
}

export const WeatherModern: React.FC<WeatherModernProps> = ({ 
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
        <CurrentWeatherContainer>
          <Loader2 size={40} className="animate-spin" />
          <WeatherDescription $textColor={textColor} $style={settings.style}>
            Loading weather data...
          </WeatherDescription>
        </CurrentWeatherContainer>
      </WeatherWidgetContainer>
    );
  }

  if (error) {
    return (
      <WeatherWidgetContainer
        $backgroundColor={settings.backgroundColor}
        $accentColor={settings.accentColor}
        $borderRadius={settings.borderRadius}
        $showBorder={settings.showBorder}
        $textColor={textColor}
        $style={settings.style}
      >
        <CurrentWeatherContainer>
          <WeatherDescription $textColor={textColor} $style={settings.style}>
            Error: {error}
          </WeatherDescription>
        </CurrentWeatherContainer>
      </WeatherWidgetContainer>
    );
  }

  if (!weatherData) {
    return (
      <WeatherWidgetContainer
        $backgroundColor={settings.backgroundColor}
        $accentColor={settings.accentColor}
        $borderRadius={settings.borderRadius}
        $showBorder={settings.showBorder}
        $textColor={textColor}
        $style={settings.style}
      >
        <CurrentWeatherContainer>
          <WeatherDescription $textColor={textColor} $style={settings.style}>
            No weather data available
          </WeatherDescription>
        </CurrentWeatherContainer>
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
      <CurrentWeatherContainer>
        <WeatherIcon
          $primaryColor={settings.primaryColor}
          $style={settings.style}
        >
          {getWeatherIcon(weatherData.icon, 40)}
        </WeatherIcon>

        <MainTemperature
          $primaryColor={settings.primaryColor}
          $textColor={textColor}
          $style={settings.style}
        >
          {convertTemperature(weatherData.temp)}{getTemperatureUnit()}
        </MainTemperature>

        <WeatherDescription
          $textColor={textColor}
          $style={settings.style}
        >
          {weatherData.summary}
        </WeatherDescription>

        <WeatherDetails $style={settings.style}>
          {settings.showFeelsLike && (
            <DetailItem
              $accentColor={settings.accentColor}
              $borderRadius={settings.borderRadius}
              $textColor={textColor}
              $style={settings.style}
            >
              <DetailIcon $accentColor={settings.accentColor}>
                <Thermometer size={16} />
              </DetailIcon>
              <DetailValue
                $textColor={textColor}
                $style={settings.style}
              >
                {convertTemperature(weatherData.feelsLike)}{getTemperatureUnit()}
              </DetailValue>
              <DetailLabel
                $textColor={textColor}
                $style={settings.style}
              >
                Feels like
              </DetailLabel>
            </DetailItem>
          )}

          {settings.showHumidity && (
            <DetailItem
              $accentColor={settings.accentColor}
              $borderRadius={settings.borderRadius}
              $textColor={textColor}
              $style={settings.style}
            >
              <DetailIcon $accentColor={settings.accentColor}>
                <Droplets size={16} />
              </DetailIcon>
              <DetailValue
                $textColor={textColor}
                $style={settings.style}
              >
                {weatherData.humidity}%
              </DetailValue>
              <DetailLabel
                $textColor={textColor}
                $style={settings.style}
              >
                Humidity
              </DetailLabel>
            </DetailItem>
          )}

          <DetailItem
            $accentColor={settings.accentColor}
            $borderRadius={settings.borderRadius}
            $textColor={textColor}
            $style={settings.style}
          >
            <DetailIcon $accentColor={settings.accentColor}>
              <Wind size={16} />
            </DetailIcon>
            <DetailValue
              $textColor={textColor}
              $style={settings.style}
            >
              {weatherData.windSpeed} km/h
            </DetailValue>
            <DetailLabel
              $textColor={textColor}
              $style={settings.style}
            >
              Wind
            </DetailLabel>
          </DetailItem>
        </WeatherDetails>
      </CurrentWeatherContainer>
    </WeatherWidgetContainer>
  );
}; 