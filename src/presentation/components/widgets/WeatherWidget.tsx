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
  $borderRadius: number;
  $showBorder: boolean;
  $textColor: string;
  $style: string;
}>`
  width: 100%;
  max-width: 350px;
  padding: 24px;
  background: ${({ $backgroundColor }) => $backgroundColor};
  border: ${({ $showBorder, $accentColor }) =>
    $showBorder ? `1px solid ${$accentColor}40` : 'none'};
  border-radius: ${({ $borderRadius }) => $borderRadius}px;
  color: ${({ $textColor }) => $textColor};
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
`;

const LocationTitle = styled.h2<{ $textColor: string; $style: string }>`
  font-size: ${({ $style }) => $style === 'minimal' ? '16px' : '18px'};
  font-weight: 600;
  color: ${({ $textColor }) => $textColor};
  margin: 0 0 20px 0;
  text-align: center;
  letter-spacing: -0.016em;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
`;

// Current Weather Style
const CurrentWeatherContainer = styled.div`
  text-align: center;
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

// Forecast Style
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
      case 'detailed-forecast':
        return (
          <ForecastContainer>
            {mockWeatherData.forecast.map((day, index) => (
              <ForecastItem
                key={index}
                $primaryColor={settings.primaryColor}
                $accentColor={settings.accentColor}
                $textColor={textColor}
                $borderRadius={settings.borderRadius}
                $style={settings.style}
              >
                <ForecastDay $textColor={textColor}>{day.day}</ForecastDay>
                <ForecastIconContainer
                  $primaryColor={settings.primaryColor}
                  $style={settings.style}
                >
                  {getWeatherIcon(day.condition, 20)}
                </ForecastIconContainer>
                <ForecastTemp $textColor={textColor}>
                  <TempHigh>{convertTemperature(day.high)}{getTemperatureUnit()}</TempHigh>
                  <TempLow $textColor={textColor}>{convertTemperature(day.low)}{getTemperatureUnit()}</TempLow>
                </ForecastTemp>
              </ForecastItem>
            ))}
          </ForecastContainer>
        );

      case 'minimal-info':
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
            <WeatherIcon
              $primaryColor={settings.primaryColor}
              $style={settings.style}
            >
              {getWeatherIcon(mockWeatherData.current.condition, 40)}
            </WeatherIcon>
          </MinimalContainer>
        );

      default: // modern, detailed, card
        return (
          <CurrentWeatherContainer>
            <WeatherIcon
              $primaryColor={settings.primaryColor}
              $style={settings.style}
            >
              {getWeatherIcon(mockWeatherData.current.condition, 40)}
            </WeatherIcon>

            <MainTemperature
              $primaryColor={settings.primaryColor}
              $textColor={textColor}
              $style={settings.style}
            >
              {convertTemperature(mockWeatherData.current.temperature)}{getTemperatureUnit()}
            </MainTemperature>

            <WeatherDescription
              $textColor={textColor}
              $style={settings.style}
            >
              {mockWeatherData.current.description}
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
                    {convertTemperature(mockWeatherData.current.feelsLike)}{getTemperatureUnit()}
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
                    {mockWeatherData.current.humidity}%
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
                  {mockWeatherData.current.windSpeed} km/h
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
        );
    }
  };

  return (
    <WeatherContainer
      $backgroundColor={settings.backgroundColor}
      $accentColor={settings.accentColor}
      $borderRadius={settings.borderRadius}
      $showBorder={settings.showBorder}
      $textColor={textColor}
      $style={settings.style}
    >
      <LocationTitle
        $textColor={textColor}
        $style={settings.style}
      >
        {settings.location}
      </LocationTitle>
      {renderWeatherContent()}
    </WeatherContainer>
  );
}; 