import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { CalendarWidget } from '../components/widgets/CalendarWidget';
import { Widget } from '../../domain/entities/Widget';
import { CalendarSettings } from '../../domain/value-objects/CalendarSettings';
import { UrlCodecService } from '../../infrastructure/services/url-codec/UrlCodecService';

const GlobalEmbedStyles = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: transparent;
  }
  
  #root {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  /* Ensure proper responsive behavior in iframe contexts */
  * {
    box-sizing: border-box;
    max-width: 100%;
    max-height: 100%;
  }
  
  /* Disable viewport zooming that might interfere with embedding */
  body {
    touch-action: manipulation;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }
  
  /* Ensure text never overflows */
  * {
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
  }
  
  /* Prevent any element from growing beyond container */
  img, svg, video, canvas, audio, iframe, embed, object {
    max-width: 100% !important;
    max-height: 100% !important;
    width: auto !important;
    height: auto !important;
  }
  
  /* Ensure flex containers don't overflow */
  div, section, article, aside, main, header, footer, nav {
    min-width: 0;
    min-height: 0;
  }
`;

const EmbedContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
`;

const ScaledContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: center center;
  
  /* Используем CSS-переменную для динамического масштабирования */
  transform: scale(var(--dynamic-scale, 1));
  
  /* Автоматическое масштабирование контента */
  @media (max-width: 600px) {
    transform: scale(calc(var(--dynamic-scale, 1) * 0.9));
  }
  
  @media (max-width: 500px) {
    transform: scale(calc(var(--dynamic-scale, 1) * 0.8));
  }
  
  @media (max-width: 400px) {
    transform: scale(calc(var(--dynamic-scale, 1) * 0.7));
  }
  
  @media (max-width: 350px) {
    transform: scale(calc(var(--dynamic-scale, 1) * 0.6));
  }
  
  @media (max-width: 300px) {
    transform: scale(calc(var(--dynamic-scale, 1) * 0.5));
  }
  
  @media (max-width: 250px) {
    transform: scale(calc(var(--dynamic-scale, 1) * 0.4));
  }
  
  @media (max-height: 500px) {
    transform: scale(calc(var(--dynamic-scale, 1) * 0.9));
  }
  
  @media (max-height: 400px) {
    transform: scale(calc(var(--dynamic-scale, 1) * 0.8));
  }
  
  @media (max-height: 300px) {
    transform: scale(calc(var(--dynamic-scale, 1) * 0.7));
  }
  
  @media (max-height: 250px) {
    transform: scale(calc(var(--dynamic-scale, 1) * 0.6));
  }
  
  @media (max-height: 200px) {
    transform: scale(calc(var(--dynamic-scale, 1) * 0.5));
  }
  
  /* Комбинированное масштабирование для очень маленьких экранов */
  @media (max-width: 500px) and (max-height: 500px) {
    transform: scale(calc(var(--dynamic-scale, 1) * 0.75));
  }
  
  @media (max-width: 400px) and (max-height: 400px) {
    transform: scale(calc(var(--dynamic-scale, 1) * 0.6));
  }
  
  @media (max-width: 350px) and (max-height: 350px) {
    transform: scale(calc(var(--dynamic-scale, 1) * 0.5));
  }
  
  @media (max-width: 300px) and (max-height: 300px) {
    transform: scale(calc(var(--dynamic-scale, 1) * 0.4));
  }
  
  @media (max-width: 250px) and (max-height: 250px) {
    transform: scale(calc(var(--dynamic-scale, 1) * 0.35));
  }
  
  /* Плавное масштабирование */
  transition: transform 0.3s ease;
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

  // Динамическое масштабирование для очень маленьких экранов
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Дополнительное масштабирование для iframe контекста
      if (width < 200 || height < 200) {
        document.documentElement.style.setProperty('--dynamic-scale', '0.3');
      } else if (width < 250 || height < 250) {
        document.documentElement.style.setProperty('--dynamic-scale', '0.4');
      } else if (width < 300 || height < 300) {
        document.documentElement.style.setProperty('--dynamic-scale', '0.5');
      } else {
        document.documentElement.style.setProperty('--dynamic-scale', '1');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <>
        <GlobalEmbedStyles />
        <EmbedContainer>
          <ScaledContent>
            <LoadingState>Loading calendar...</LoadingState>
          </ScaledContent>
        </EmbedContainer>
      </>
    );
  }

  if (error || !widget) {
    return (
      <>
        <GlobalEmbedStyles />
        <EmbedContainer>
          <ScaledContent>
            <ErrorState>
              <h3>🚫 Error</h3>
              <p>{error || 'Failed to load calendar widget'}</p>
            </ErrorState>
          </ScaledContent>
        </EmbedContainer>
      </>
    );
  }

  return (
    <>
      <GlobalEmbedStyles />
      <EmbedContainer>
        <ScaledContent>
          <CalendarWidget widget={widget} />
        </ScaledContent>
      </EmbedContainer>
    </>
  );
}; 