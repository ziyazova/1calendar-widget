import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Logger } from '../../infrastructure/services/Logger';
import { ClockWidget } from '../components/widgets/ClockWidget';
import { EmbedScaleWrapper } from '../components/embed/EmbedScaleWrapper';
import { Widget } from '../../domain/entities/Widget';
import { ClockSettings } from '../../domain/value-objects/ClockSettings';
import { UrlCodecService } from '../../infrastructure/services/url-codec/UrlCodecService';
import { EmbedController } from './EmbedController';
import { useResolvedTheme, NOTION_DARK_BG } from '../hooks/useResolvedTheme';

const GlobalEmbedStyles = createGlobalStyle<{ $bgColor: string }>`
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: ${({ $bgColor }) => $bgColor};
  }
  #root {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  * {
    box-sizing: border-box;
  }
  body {
    touch-action: manipulation;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }
`;

const EmbedContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
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
  const [settings, setSettings] = useState<ClockSettings>(new ClockSettings());

  useEffect(() => {
    try {
      const codecService = new UrlCodecService();
      const config = codecService.extractConfigFromUrl();

      Logger.info('ClockEmbed', 'Parsing URL config', config);

      if (config) {
        if (config.widgetType === 'clock' || !config.widgetType) {
          const s = new ClockSettings(config.settings || config);
          setSettings(s);
          Logger.info('ClockEmbed', 'Loaded settings', {
            embedWidth: s.embedWidth,
            embedHeight: s.embedHeight,
            style: s.style,
            theme: s.theme,
          });
          const clockWidget = Widget.createClock('embed-clock', s);
          setWidget(clockWidget);
        } else {
          throw new Error('Invalid clock widget configuration');
        }
      } else {
        const defaultSettings = new ClockSettings();
        setSettings(defaultSettings);
        const defaultWidget = Widget.createClock('default-clock', defaultSettings);
        setWidget(defaultWidget);
      }
    } catch (err) {
      Logger.error('ClockEmbed', 'Failed to load clock widget', err);
      setError('Failed to load clock widget configuration');
    } finally {
      setLoading(false);
    }
  }, []);

  const notionTheme = useResolvedTheme('auto');
  const containerBg = notionTheme === 'dark' ? NOTION_DARK_BG : 'transparent';

  if (loading) {
    return (
      <EmbedController>
        <GlobalEmbedStyles $bgColor={containerBg} />
        <EmbedContainer>
          <EmbedScaleWrapper>
            <LoadingState>Loading clock...</LoadingState>
          </EmbedScaleWrapper>
        </EmbedContainer>
      </EmbedController>
    );
  }

  if (error || !widget) {
    return (
      <EmbedController>
        <GlobalEmbedStyles $bgColor={containerBg} />
        <EmbedContainer>
          <EmbedScaleWrapper>
            <ErrorState>
              <h3>Error</h3>
              <p>{error || 'Failed to load clock widget'}</p>
            </ErrorState>
          </EmbedScaleWrapper>
        </EmbedContainer>
      </EmbedController>
    );
  }

  Logger.debug('ClockEmbed', 'Rendering with embed size', {
    embedWidth: settings.embedWidth,
    embedHeight: settings.embedHeight,
  });

  return (
    <EmbedController>
      <GlobalEmbedStyles $bgColor={containerBg} />
      <EmbedContainer>
        <EmbedScaleWrapper
          refWidth={settings.embedWidth}
          refHeight={settings.embedHeight}
        >
          <ClockWidget widget={widget} />
        </EmbedScaleWrapper>
      </EmbedContainer>
    </EmbedController>
  );
}; 