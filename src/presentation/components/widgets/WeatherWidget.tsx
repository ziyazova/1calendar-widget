import React from 'react';
import { Widget } from '../../../domain/entities/Widget';
import { WeatherSettings } from '../../../domain/value-objects/WeatherSettings';
import { WeatherDetailedForecast } from './weather/styles/WeatherDetailedForecast';
import { WeatherMinimalInfo } from './weather/styles/WeatherMinimalInfo';
import { WeatherModern } from './weather/styles/WeatherModern';

interface WeatherWidgetProps {
  widget: Widget;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ widget }) => {
  const settings = widget.settings as WeatherSettings;

  switch (settings.style) {
    case 'detailed-forecast':
      return <WeatherDetailedForecast settings={settings} />;
    case 'minimal-info':
      return <WeatherMinimalInfo settings={settings} />;
    default:
      return <WeatherModern settings={settings} />;
  }
}; 