import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CalendarWidget } from '../components/widgets/CalendarWidget';
import { Widget } from '../../domain/entities/Widget';
import { CalendarSettings } from '../../domain/value-objects/CalendarSettings';
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

export const CalendarEmbedPage: React.FC = () => {
  const [widget, setWidget] = useState<Widget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const codecService = new UrlCodecService();
      const config = codecService.extractConfigFromUrl();

      if (config) {
        // Проверяем новый компактный формат
        if (config.widgetType === 'calendar' || !config.widgetType) {
          const settings = new CalendarSettings(config.settings || config);
          const calendarWidget = Widget.createCalendar('embed-calendar', settings);
          setWidget(calendarWidget);
        } else {
          throw new Error('Invalid calendar widget configuration');
        }
      } else {
        // Default widget if no config provided
        const defaultSettings = new CalendarSettings();
        const defaultWidget = Widget.createCalendar('default-calendar', defaultSettings);
        setWidget(defaultWidget);
      }
    } catch (err) {
      console.error('Failed to load calendar widget:', err);
      setError('Failed to load calendar widget configuration');
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <EmbedContainer>
        <LoadingState>Loading calendar...</LoadingState>
      </EmbedContainer>
    );
  }

  if (error || !widget) {
    return (
      <EmbedContainer>
        <ErrorState>
          <h3>🚫 Error</h3>
          <p>{error || 'Failed to load calendar widget'}</p>
        </ErrorState>
      </EmbedContainer>
    );
  }

  return (
    <EmbedContainer>
      <CalendarWidget widget={widget} />
    </EmbedContainer>
  );
}; 