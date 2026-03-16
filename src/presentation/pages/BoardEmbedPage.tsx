import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Logger } from '../../infrastructure/services/Logger';
import { BoardWidget } from '../components/widgets/BoardWidget';
import { Widget } from '../../domain/entities/Widget';
import { BoardSettings } from '../../domain/value-objects/BoardSettings';
import { UrlCodecService } from '../../infrastructure/services/url-codec/UrlCodecService';
import { EmbedController } from './EmbedController';

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

export const BoardEmbedPage: React.FC = () => {
  const [widget, setWidget] = useState<Widget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<BoardSettings>(new BoardSettings());

  useEffect(() => {
    try {
      const codecService = new UrlCodecService();
      const config = codecService.extractConfigFromUrl();

      Logger.info('BoardEmbed', 'Parsing URL config', config);

      if (config) {
        if (config.widgetType === 'board' || !config.widgetType) {
          const s = new BoardSettings(config.settings || config);
          setSettings(s);
          Logger.info('BoardEmbed', 'Loaded settings', {
            embedWidth: s.embedWidth,
            embedHeight: s.embedHeight,
            imageCount: s.imageUrls.length,
            theme: s.theme,
          });
          const boardWidget = Widget.createBoard('embed-board', s);
          setWidget(boardWidget);
        } else {
          throw new Error('Invalid board widget configuration');
        }
      } else {
        const defaultSettings = new BoardSettings();
        setSettings(defaultSettings);
        const defaultWidget = Widget.createBoard('default-board', defaultSettings);
        setWidget(defaultWidget);
      }
    } catch (err) {
      Logger.error('BoardEmbed', 'Failed to load board widget', err);
      setError('Failed to load board widget configuration');
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <EmbedController>
        <GlobalEmbedStyles $bgColor="transparent" />
        <EmbedContainer>
          <LoadingState>Loading board...</LoadingState>
        </EmbedContainer>
      </EmbedController>
    );
  }

  if (error || !widget) {
    return (
      <EmbedController>
        <GlobalEmbedStyles $bgColor="transparent" />
        <EmbedContainer>
          <ErrorState>
            <h3>Error</h3>
            <p>{error || 'Failed to load board widget'}</p>
          </ErrorState>
        </EmbedContainer>
      </EmbedController>
    );
  }

  return (
    <EmbedController>
      <GlobalEmbedStyles $bgColor="transparent" />
      <EmbedContainer>
        <BoardWidget widget={widget} />
      </EmbedContainer>
    </EmbedController>
  );
};
