import React, { useEffect, useMemo, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Logger } from '../../infrastructure/services/Logger';
import { ClockWidget } from '../components/widgets/ClockWidget';
import { EmbedScaleWrapper } from '../components/embed/EmbedScaleWrapper';
import { WidgetUnavailable } from '../components/embed/WidgetUnavailable';
import { Widget } from '../../domain/entities/Widget';
import { ClockSettings } from '../../domain/value-objects/ClockSettings';
import { UrlCodecService } from '../../infrastructure/services/url-codec/UrlCodecService';
import { EmbedController } from './EmbedController';
import { useResolvedTheme, NOTION_DARK_BG } from '../hooks/useResolvedTheme';
import { usePublicWidgetSync } from '../hooks/usePublicWidgetSync';

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
  border-radius: ${({ theme }) => theme.radii.sm};
  background: #fef2f2;
  border: 1px solid #fecaca;
  max-width: 400px;
`;

export const ClockEmbedPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [urlSettings, setUrlSettings] = useState<ClockSettings>(new ClockSettings());

  // Read public_id from URL once. If absent (legacy URL or guest-mode link),
  // sync hook stays idle and we render purely from URL settings.
  const publicId = useMemo(() => {
    const codec = new UrlCodecService();
    return codec.extractPublicId();
  }, []);

  useEffect(() => {
    try {
      const codecService = new UrlCodecService();
      const config = codecService.extractConfigFromUrl();

      Logger.info('ClockEmbed', 'Parsing URL config', { config, publicId });

      if (config) {
        if (config.widgetType === 'clock' || !config.widgetType) {
          const s = new ClockSettings(config.settings || config);
          setUrlSettings(s);
          Logger.info('ClockEmbed', 'Loaded settings', {
            embedWidth: s.embedWidth,
            embedHeight: s.embedHeight,
            style: s.style,
            theme: s.theme,
          });
        } else {
          throw new Error('Invalid clock widget configuration');
        }
      } else {
        setUrlSettings(new ClockSettings());
      }
    } catch (err) {
      Logger.error('ClockEmbed', 'Failed to load clock widget', err);
      setError('Failed to load clock widget configuration');
    } finally {
      setLoading(false);
    }
  }, [publicId]);

  const { liveSettings, unavailable } = usePublicWidgetSync(publicId);

  // Live settings (from Supabase) override URL settings once the RPC returns;
  // otherwise the page renders from URL — so a Supabase outage degrades to
  // "frozen settings" rather than a broken iframe.
  const effectiveSettings = unavailable
    ? null
    : (liveSettings ? new ClockSettings(liveSettings) : urlSettings);
  const widget = effectiveSettings
    ? Widget.createClock('embed-clock', effectiveSettings)
    : null;

  const notionTheme = useResolvedTheme('auto');
  const isTransparent = new URLSearchParams(window.location.search).has('nobg');
  const containerBg = isTransparent ? 'transparent' : (notionTheme === 'dark' ? NOTION_DARK_BG : '#ffffff');

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

  // Owner deleted/paused the widget → cute "unavailable" placeholder.
  // Sized to the URL-encoded dimensions so it doesn't reflow customer pages.
  if (unavailable) {
    return (
      <EmbedController>
        <GlobalEmbedStyles $bgColor={containerBg} />
        <EmbedContainer>
          <EmbedScaleWrapper
            refWidth={urlSettings.embedWidth}
            refHeight={urlSettings.embedHeight}
          >
            <WidgetUnavailable />
          </EmbedScaleWrapper>
        </EmbedContainer>
      </EmbedController>
    );
  }

  if (error || !widget || !effectiveSettings) {
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
    embedWidth: effectiveSettings.embedWidth,
    embedHeight: effectiveSettings.embedHeight,
  });

  return (
    <EmbedController>
      <GlobalEmbedStyles $bgColor={containerBg} />
      <EmbedContainer>
        <EmbedScaleWrapper
          refWidth={effectiveSettings.embedWidth}
          refHeight={effectiveSettings.embedHeight}
        >
          <ClockWidget widget={widget} />
        </EmbedScaleWrapper>
      </EmbedContainer>
    </EmbedController>
  );
}; 