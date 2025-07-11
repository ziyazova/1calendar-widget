import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { WeatherWidget } from '../components/widgets/WeatherWidget';
import { Widget } from '../../domain/entities/Widget';
import { WeatherSettings } from '../../domain/value-objects/WeatherSettings';
import { UrlCodecService } from '../../infrastructure/services/url-codec/UrlCodecService';

const EmbedContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  padding: 20px;
  box-sizing: border-box;
`;

const LoadingState = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  color: #666;
  text-align: center;
`;

const ErrorState = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  color: #ef4444;
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
`;

export const WeatherEmbedPage: React.FC = () => {
  const [widget, setWidget] = useState<Widget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const configParam = urlParams.get('config');

      if (configParam) {
        const codecService = new UrlCodecService();
        const decodedConfig = codecService.decode(configParam);

        if (decodedConfig && decodedConfig.widgetType === 'weather') {
          const settings = new WeatherSettings(decodedConfig.settings);
          const weatherWidget = Widget.createWeather('embed-weather', settings);
          setWidget(weatherWidget);
        } else {
          throw new Error('Invalid weather widget configuration');
        }
      } else {
        // Default widget if no config provided
        const defaultSettings = new WeatherSettings();
        const defaultWidget = Widget.createWeather('default-weather', defaultSettings);
        setWidget(defaultWidget);
      }
    } catch (err) {
      console.error('Failed to load weather widget:', err);
      setError('Failed to load weather widget configuration');
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <EmbedContainer>
        <LoadingState>Loading weather widget...</LoadingState>
      </EmbedContainer>
    );
  }

  if (error || !widget) {
    return (
      <EmbedContainer>
        <ErrorState>
          <h3>Error</h3>
          <p>{error || 'Failed to load weather widget'}</p>
        </ErrorState>
      </EmbedContainer>
    );
  }

  return (
    <EmbedContainer>
      <WeatherWidget widget={widget} />
    </EmbedContainer>
  );
}; 