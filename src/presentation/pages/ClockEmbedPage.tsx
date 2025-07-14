import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ClockWidget } from '../components/widgets/ClockWidget';
import { Widget } from '../../domain/entities/Widget';
import { ClockSettings } from '../../domain/value-objects/ClockSettings';
import { UrlCodecService } from '../../infrastructure/services/url-codec/UrlCodecService';
import { EmbedController } from './EmbedController';

const EmbedContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  padding: 0;
  margin: 0;
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

export const ClockEmbedPage: React.FC = () => {
  const [widget, setWidget] = useState<Widget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const codecService = new UrlCodecService();
      const config = codecService.extractConfigFromUrl();

      if (config) {
        if (config.widgetType === 'clock' || !config.widgetType) {
          const settings = new ClockSettings(config.settings || config);
          const clockWidget = Widget.createClock('embed-clock', settings);
          setWidget(clockWidget);
        } else {
          throw new Error('Invalid clock widget configuration');
        }
      } else {
        // Default widget if no config provided
        const defaultSettings = new ClockSettings();
        const defaultWidget = Widget.createClock('default-clock', defaultSettings);
        setWidget(defaultWidget);
      }
    } catch (err) {
      console.error('Failed to load clock widget:', err);
      setError('Failed to load clock widget configuration');
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <EmbedController>
        <EmbedContainer>
          <LoadingState>Loading clock...</LoadingState>
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
            <p>{error || 'Failed to load clock widget'}</p>
          </ErrorState>
        </EmbedContainer>
      </EmbedController>
    );
  }

  return (
    <EmbedController>
      <EmbedContainer>
        <ClockWidget widget={widget} />
      </EmbedContainer>
    </EmbedController>
  );
}; 