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

export const WeatherEmbedPage: React.FC = () => {
  const [widget, setWidget] = useState<Widget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Функция для уведомления родительского окна о размере
  const notifyParentOfSize = () => {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: "embed-size",
        height: document.documentElement.scrollHeight
      }, "*");
    }
  };

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

  // ResizeObserver для автоматического обновления размера
  useEffect(() => {
    // Уведомляем о размере при загрузке
    notifyParentOfSize();

    // Создаем ResizeObserver для отслеживания изменений размера
    const observer = new ResizeObserver(() => {
      notifyParentOfSize();
    });

    // Наблюдаем за изменениями размера body
    observer.observe(document.body);

    // Fallback через setTimeout на случай, если ResizeObserver не сработал
    const fallbackTimer = setTimeout(() => {
      notifyParentOfSize();
    }, 1000);

    // Очистка при размонтировании
    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, []);

  if (loading) {
    return (
      <EmbedContainer>
        <LoadingState>Loading weather...</LoadingState>
      </EmbedContainer>
    );
  }

  if (error || !widget) {
    return (
      <EmbedContainer>
        <ErrorState>
          <h3>🚫 Error</h3>
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