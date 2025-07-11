import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer } from 'lucide-react';
import { Widget } from '../../../domain/entities/Widget';
import { WeatherSettings } from '../../../domain/value-objects/WeatherSettings';
import { getContrastColor } from '../../themes/colors';

interface WeatherWidgetProps {
  widget: Widget;
}

// Mock weather data
const mockWeatherData = {
  current: {
    temperature: 22,
    feelsLike: 25,
    humidity: 65,
    condition: 'partly-cloudy',
    description: 'Partly Cloudy',
    windSpeed: 12,
  },
  forecast: [
    { day: 'Today', high: 24, low: 18, condition: 'sunny' },
    { day: 'Tomorrow', high: 26, low: 20, condition: 'cloudy' },
    { day: 'Wed', high: 21, low: 15, condition: 'rainy' },
    { day: 'Thu', high: 23, low: 17, condition: 'partly-cloudy' },
    { day: 'Fri', high: 25, low: 19, condition: 'sunny' },
  ]
};

const WeatherContainer = styled.div<{
  $backgroundColor: string;
  $accentColor: string;
  $opacity: number;
  $borderRadius: number;
  $showBorder: boolean;
  $textColor: string;
}>`
  width: 100%;
  max-width: 350px;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ $backgroundColor, $opacity }) =>
    $backgroundColor.includes('gradient')
      ? $backgroundColor
      : $opacity < 1
        ? `${$backgroundColor}${Math.round($opacity * 255).toString(16).padStart(2, '0')}`
        : $backgroundColor};
  border: ${({ $showBorder, $accentColor }) =>
    $showBorder ? `1px solid ${$accentColor}40` : 'none'};
  border-radius: ${({ $borderRadius }) => $borderRadius}px;
  color: ${({ $textColor }) => $textColor};
  backdrop-filter: blur(20px);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
`;

const LocationTitle = styled.h2<{ $textColor: string }>`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ $textColor }) => $textColor};
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  text-align: center;
`;

// Current Weather Style
const CurrentWeatherContainer = styled.div`
  text-align: center;
`;

const MainTemperature = styled.div<{ $primaryColor: string; $textColor: string }>`
  font-size: 4rem;
  font-weight: 700;
  color: ${({ $textColor }) => $textColor};
  margin: ${({ theme }) => theme.spacing.lg} 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const WeatherIcon = styled.div<{ $primaryColor: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  margin: 0 auto ${({ theme }) => theme.spacing.md};
  background: ${({ $primaryColor }) => `${$primaryColor}20`};
  border-radius: 50%;
  border: 2px solid ${({ $primaryColor }) => `${$primaryColor}40`};
  backdrop-filter: blur(10px);
  
  svg {
    color: ${({ $primaryColor }) => $primaryColor};
  }
`;

const WeatherDescription = styled.div<{ $textColor: string }>`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: 500;
  color: ${({ $textColor }) => `${$textColor}90`};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const WeatherDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const DetailItem = styled.div<{
  $accentColor: string;
  $borderRadius: number;
  $textColor: string;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ $accentColor }) => `${$accentColor}30`};
  border-radius: ${({ $borderRadius }) => Math.min($borderRadius / 2, 12)}px;
  backdrop-filter: blur(10px);
`;

const DetailIcon = styled.div<{ $accentColor: string }>`
  color: ${({ $accentColor }) => $accentColor};
`;

const DetailValue = styled.span<{ $textColor: string }>`
  font-weight: 600;
  color: ${({ $textColor }) => $textColor};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
`;

const DetailLabel = styled.span<{ $textColor: string }>`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ $textColor }) => `${$textColor}70`};
`;

// Forecast Style
const ForecastContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ForecastItem = styled.div<{
  $primaryColor: string;
  $accentColor: string;
  $textColor: string;
  $borderRadius: number;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ $accentColor }) => `${$accentColor}30`};
  border-radius: ${({ $borderRadius }) => Math.min($borderRadius / 2, 12)}px;
  backdrop-filter: blur(10px);
  border: 1px solid ${({ $primaryColor }) => `${$primaryColor}20`};
`;

const ForecastDay = styled.span<{ $textColor: string }>`
  font-weight: 600;
  color: ${({ $textColor }) => $textColor};
  min-width: 60px;
`;

const ForecastIconContainer = styled.div<{ $primaryColor: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${({ $primaryColor }) => `${$primaryColor}20`};
  border-radius: 50%;
  
  svg {
    color: ${({ $primaryColor }) => $primaryColor};
    width: 18px;
    height: 18px;
  }
`;

const ForecastTemp = styled.div<{ $textColor: string }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  font-weight: 500;
  color: ${({ $textColor }) => $textColor};
`;

const TempHigh = styled.span`
  color: inherit;
`;

const TempLow = styled.span<{ $textColor: string }>`
  color: ${({ $textColor }) => `${$textColor}60`};
`;

// Minimal Style
const MinimalContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
`;

const MinimalLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const MinimalTemp = styled.div<{ $textColor: string }>`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ $textColor }) => $textColor};
`;

const MinimalCondition = styled.div<{ $textColor: string }>`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ $textColor }) => `${$textColor}80`};
`;

const getWeatherIcon = (condition: string, size: number = 32) => {
  const props = { size };
  switch (condition) {
    case 'sunny':
      return <Sun {...props} />;
    case 'cloudy':
      return <Cloud {...props} />;
    case 'rainy':
      return <CloudRain {...props} />;
    case 'partly-cloudy':
    default:
      return <Cloud {...props} />;
  }
};

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ widget }) => {
  const settings = widget.settings as WeatherSettings;
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

  const renderWeatherContent = () => {
    switch (settings.style) {
      case 'forecast':
        return (
          <ForecastContainer>
            {mockWeatherData.forecast.map((day, index) => (
              <ForecastItem
                key={index}
                $primaryColor={settings.primaryColor}
                $accentColor={settings.accentColor}
                $textColor={textColor}
                $borderRadius={settings.borderRadius}
              >
                <ForecastDay $textColor={textColor}>{day.day}</ForecastDay>
                <ForecastIconContainer $primaryColor={settings.primaryColor}>
                  {getWeatherIcon(day.condition, 18)}
                </ForecastIconContainer>
                <ForecastTemp $textColor={textColor}>
                  <TempHigh>{convertTemperature(day.high)}{getTemperatureUnit()}</TempHigh>
                  <TempLow $textColor={textColor}>{convertTemperature(day.low)}{getTemperatureUnit()}</TempLow>
                </ForecastTemp>
              </ForecastItem>
            ))}
          </ForecastContainer>
        );

      case 'minimal':
        return (
          <MinimalContainer>
            <MinimalLeft>
              <MinimalTemp $textColor={textColor}>
                {convertTemperature(mockWeatherData.current.temperature)}{getTemperatureUnit()}
              </MinimalTemp>
              <MinimalCondition $textColor={textColor}>
                {mockWeatherData.current.description}
              </MinimalCondition>
            </MinimalLeft>
            <WeatherIcon $primaryColor={settings.primaryColor}>
              {getWeatherIcon(mockWeatherData.current.condition, 40)}
            </WeatherIcon>
          </MinimalContainer>
        );

      default: // current
        return (
          <CurrentWeatherContainer>
            <WeatherIcon $primaryColor={settings.primaryColor}>
              {getWeatherIcon(mockWeatherData.current.condition, 40)}
            </WeatherIcon>

            <MainTemperature $primaryColor={settings.primaryColor} $textColor={textColor}>
              {convertTemperature(mockWeatherData.current.temperature)}{getTemperatureUnit()}
            </MainTemperature>

            <WeatherDescription $textColor={textColor}>
              {mockWeatherData.current.description}
            </WeatherDescription>

            <WeatherDetails>
              {settings.showFeelsLike && (
                <DetailItem
                  $accentColor={settings.accentColor}
                  $borderRadius={settings.borderRadius}
                  $textColor={textColor}
                >
                  <DetailIcon $accentColor={settings.accentColor}>
                    <Thermometer size={16} />
                  </DetailIcon>
                  <DetailValue $textColor={textColor}>
                    {convertTemperature(mockWeatherData.current.feelsLike)}{getTemperatureUnit()}
                  </DetailValue>
                  <DetailLabel $textColor={textColor}>Feels like</DetailLabel>
                </DetailItem>
              )}

              {settings.showHumidity && (
                <DetailItem
                  $accentColor={settings.accentColor}
                  $borderRadius={settings.borderRadius}
                  $textColor={textColor}
                >
                  <DetailIcon $accentColor={settings.accentColor}>
                    <Droplets size={16} />
                  </DetailIcon>
                  <DetailValue $textColor={textColor}>
                    {mockWeatherData.current.humidity}%
                  </DetailValue>
                  <DetailLabel $textColor={textColor}>Humidity</DetailLabel>
                </DetailItem>
              )}

              <DetailItem
                $accentColor={settings.accentColor}
                $borderRadius={settings.borderRadius}
                $textColor={textColor}
              >
                <DetailIcon $accentColor={settings.accentColor}>
                  <Wind size={16} />
                </DetailIcon>
                <DetailValue $textColor={textColor}>
                  {mockWeatherData.current.windSpeed} km/h
                </DetailValue>
                <DetailLabel $textColor={textColor}>Wind</DetailLabel>
              </DetailItem>
            </WeatherDetails>
          </CurrentWeatherContainer>
        );
    }
  };

  return (
    <WeatherContainer
      $backgroundColor={settings.backgroundColor}
      $accentColor={settings.accentColor}
      $opacity={settings.opacity}
      $borderRadius={settings.borderRadius}
      $showBorder={settings.showBorder}
      $textColor={textColor}
    >
      <LocationTitle $textColor={textColor}>{settings.location}</LocationTitle>
      {renderWeatherContent()}
    </WeatherContainer>
  );
}; 