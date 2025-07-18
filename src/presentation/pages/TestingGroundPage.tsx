import React, { useState, useRef } from 'react';
import styled from 'styled-components';

const TestContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 40px 20px;
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  width: 100%;
  height: 100%;
`;

const TestHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 16px 0;
  font-size: 32px;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  font-size: 16px;
`;

const TestSection = styled.div`
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ControlPanel = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: 600;
`;

const ControlGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const IframeContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const IframeWrapper = styled.div<{ width: number; height: number }>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  margin: 0 auto;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
`;

const TestIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const UrlDisplay = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  word-break: break-all;
`;

export const TestingGroundPage: React.FC = () => {
  const [iframeWidth, setIframeWidth] = useState(400);
  const [iframeHeight, setIframeHeight] = useState(500);
  const [widgetType] = useState('calendar');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const baseUrl = window.location.origin;
  const embedUrl = `${baseUrl}/embed/${widgetType}`;

  // Функции для теста управления embed
  const postToIframe = (type: string) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type }, '*');
    }
  };

  return (
    <TestContainer>
      <TestHeader>
        <Title>Widget Testing Ground</Title>
        <Subtitle>Тестируйте как ваши виджеты выглядят в iframe различных размеров</Subtitle>
      </TestHeader>

      <TestSection>
        <ControlPanel>
          <SectionTitle>Настройки iframe</SectionTitle>

          <ControlGroup>
            <Label>Ширина (px)</Label>
            <Input
              type="number"
              value={iframeWidth}
              onChange={(e) => setIframeWidth(Number(e.target.value))}
              min="200"
              max="800"
            />
          </ControlGroup>

          <ControlGroup>
            <Label>Высота (px)</Label>
            <Input
              type="number"
              value={iframeHeight}
              onChange={(e) => setIframeHeight(Number(e.target.value))}
              min="200"
              max="800"
            />
          </ControlGroup>

          <ControlGroup>
            <Label>URL виджета</Label>
            <UrlDisplay>{embedUrl}</UrlDisplay>
          </ControlGroup>

          <ControlGroup>
            <Label>Тестовые действия</Label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" onClick={() => postToIframe('reload-embed')}>Reload embed</button>
              <button type="button" onClick={() => postToIframe('force-resize')}>Force resize</button>
              <button type="button" onClick={() => postToIframe('show-loader')}>Show loader</button>
              <button type="button" onClick={() => postToIframe('hide-loader')}>Hide loader</button>
            </div>
          </ControlGroup>
        </ControlPanel>

        <IframeContainer>
          <SectionTitle>Предварительный просмотр</SectionTitle>
          <IframeWrapper width={iframeWidth} height={iframeHeight}>
            <TestIframe
              ref={iframeRef}
              src={embedUrl}
              title="Widget Preview"
            />
          </IframeWrapper>
        </IframeContainer>
      </TestSection>
    </TestContainer>
  );
}; 