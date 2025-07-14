import React, { useMemo } from 'react';
import { Widget } from '../../../domain/entities/Widget';
import { WeatherSettings } from '../../../domain/value-objects/WeatherSettings';
import { WeatherDetailedForecast } from './weather/styles/WeatherDetailedForecast';
import { WeatherMinimalInfo } from './weather/styles/WeatherMinimalInfo';
import { WeatherModern } from './weather/styles/WeatherModern';
import { useWeatherData } from '../../hooks/useWeatherData';
import { WeatherServiceImpl } from '../../../infrastructure/services/weather/WeatherServiceImpl';

interface WeatherWidgetProps {
  widget: Widget;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ widget }) => {
  const settings = widget.settings as WeatherSettings;
  const weatherService = useMemo(() => new WeatherServiceImpl(), []);
  const { weatherData, loading, error } = useWeatherData(weatherService, settings.location);

  switch (settings.style) {
    case 'detailed-forecast':
      return <WeatherDetailedForecast settings={settings} weatherData={weatherData || undefined} loading={loading} error={error} />;
    case 'minimal-info':
      return <WeatherMinimalInfo settings={settings} weatherData={weatherData?.current} loading={loading} error={error} />;
    case 'modern':
    default:
      return <WeatherModern settings={settings} weatherData={weatherData?.current} loading={loading} error={error} />;
  }
}; 