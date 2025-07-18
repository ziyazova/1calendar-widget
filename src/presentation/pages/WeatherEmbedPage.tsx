import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { WeatherWidget } from '../components/widgets/WeatherWidget';
import { Widget } from '../../domain/entities/Widget';
import { WeatherSettings } from '../../domain/value-objects/WeatherSettings';
import { UrlCodecService } from '../../infrastructure/services/url-codec/UrlCodecService';
import { EmbedController } from './EmbedController';

const EmbedContainer = styled.div`
  width: 100%;
  height: auto;
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  padding: 20px;
  box-sizing: border-box;
`;

const LoadingState = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  color: #667EEA;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  
  &::before {
    content: '';
    width: 24px;
    height: 24px;
    border: 2px solid #667EEA;
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorState = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  color: #ef4444;
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  max-width: 400px;
`;

function useNotionAutoHeight() {
  useEffect(() => {
    function sendHeight() {
      const height = document.documentElement.scrollHeight;
      window.parent.postMessage({ type: 'embed-size', height }, '*');
    }
    sendHeight();
    window.addEventListener('resize', sendHeight);
    const interval = setInterval(sendHeight, 500);
    return () => {
      window.removeEventListener('resize', sendHeight);
      clearInterval(interval);
    };
  }, []);
}

export const WeatherEmbedPage: React.FC = () => {
  useNotionAutoHeight();
  const [widget, setWidget] = useState<Widget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const codecService = new UrlCodecService();
      const config = codecService.extractConfigFromUrl();

      if (config) {
        if (config.widgetType === 'weather' || !config.widgetType) {
          const settings = new WeatherSettings(config.settings || config);
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
      <EmbedController>
        <EmbedContainer>
          <LoadingState>Loading weather...</LoadingState>
        </EmbedContainer>
      </EmbedController>
    );
  }

  if (error || !widget) {
    return (
      <EmbedController>
        <EmbedContainer>
          <ErrorState>
            <h3>🚫 Error</h3>
            <p>{error || 'Failed to load weather widget'}</p>
          </ErrorState>
        </EmbedContainer>
      </EmbedController>
    );
  }

  return (
    <EmbedController>
      <EmbedContainer>
        <WeatherWidget widget={widget} />
      </EmbedContainer>
    </EmbedController>
  );
}; 