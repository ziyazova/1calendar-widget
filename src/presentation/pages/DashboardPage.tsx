import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DIContainer } from '../../infrastructure/di/DIContainer';
import { Widget } from '../../domain/entities/Widget';
import { CalendarSettings } from '../../domain/value-objects/CalendarSettings';
import { ClockSettings } from '../../domain/value-objects/ClockSettings';
import { WeatherSettings } from '../../domain/value-objects/WeatherSettings';
import { Sidebar } from '../components/ui/sidebar/Sidebar';
import { Header } from '../components/layout/Header';
import { WidgetDisplay } from '../components/layout/WidgetDisplay';
import { CustomizationPanel } from '../components/ui/forms/CustomizationPanel';

interface DashboardPageProps {
  diContainer: DIContainer;
}

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 280px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-left: 0;
  }
`;

const ContentArea = styled.div`
  display: flex;
  flex: 1;
  gap: ${({ theme }) => theme.spacing['2xl']};
  padding: ${({ theme }) => theme.spacing['2xl']};
  overflow: hidden;
`;

const WidgetArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
`;

export const DashboardPage: React.FC<DashboardPageProps> = ({ diContainer }) => {
  const [currentWidget, setCurrentWidget] = useState<Widget | null>(null);
  const [availableWidgets, setAvailableWidgets] = useState<string[]>([]);

  useEffect(() => {
    // Initialize with available widgets
    const types = diContainer.listAvailableWidgetsUseCase.execute();
    setAvailableWidgets(types);

    // Create default calendar widget
    if (types.includes('calendar')) {
      diContainer.createWidgetUseCase.execute('calendar')
        .then(widget => setCurrentWidget(widget))
        .catch(console.error);
    }
  }, [diContainer]);

  const handleWidgetTypeChange = async (type: string) => {
    try {
      const widget = await diContainer.createWidgetUseCase.execute(type);
      setCurrentWidget(widget);
    } catch (error) {
      console.error('Failed to create widget:', error);
    }
  };

  const handleSettingsChange = async (newSettings: Partial<CalendarSettings | ClockSettings | WeatherSettings>) => {
    if (!currentWidget) return;

    try {
      const updatedWidget = await diContainer.updateWidgetUseCase.execute(
        currentWidget.id,
        newSettings
      );
      setCurrentWidget(updatedWidget);
    } catch (error) {
      console.error('Failed to update widget:', error);
    }
  };

  const handleCopyEmbedUrl = () => {
    if (!currentWidget) return;

    const embedUrl = diContainer.getWidgetEmbedUrlUseCase.execute(currentWidget);

    navigator.clipboard.writeText(embedUrl)
      .then(() => {
        // Show success feedback
        console.log('Embed URL copied to clipboard');
      })
      .catch(console.error);
  };

  return (
    <DashboardContainer>
      <Sidebar
        availableWidgets={availableWidgets}
        currentWidget={currentWidget?.type || 'calendar'}
        onWidgetChange={handleWidgetTypeChange}
      />

      <MainContent>
        <Header
          currentWidget={currentWidget}
          onCopyEmbedUrl={handleCopyEmbedUrl}
        />

        <ContentArea>
          <WidgetArea>
            <WidgetDisplay widget={currentWidget} />
          </WidgetArea>

          <CustomizationPanel
            widget={currentWidget}
            onSettingsChange={handleSettingsChange}
          />
        </ContentArea>
      </MainContent>
    </DashboardContainer>
  );
}; 