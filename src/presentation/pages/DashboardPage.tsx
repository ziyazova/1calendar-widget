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
  margin-left: 300px;
  
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
  const [currentWidgetKey, setCurrentWidgetKey] = useState<string>('calendar-modern-grid');
  const [availableWidgets, setAvailableWidgets] = useState<string[]>([]);

  useEffect(() => {
    // Initialize with available widgets
    const types = diContainer.listAvailableWidgetsUseCase.execute();
    setAvailableWidgets(types);

    // Create default calendar widget with modern-grid style
    if (types.includes('calendar')) {
      createWidgetWithStyle('calendar', 'modern-grid');
    }
  }, [diContainer]);

  const createWidgetWithStyle = async (type: string, style: string) => {
    try {
      const widget = await diContainer.createWidgetUseCase.execute(type);

      // Update widget with specific style
      let updatedWidget;
      if (type === 'calendar') {
        const settings = new CalendarSettings({ style: style as any });
        updatedWidget = await diContainer.updateWidgetUseCase.execute(widget.id, settings);
      } else if (type === 'clock') {
        const settings = new ClockSettings({ style: style as any });
        updatedWidget = await diContainer.updateWidgetUseCase.execute(widget.id, settings);
      } else if (type === 'weather') {
        const settings = new WeatherSettings({ style: style as any });
        updatedWidget = await diContainer.updateWidgetUseCase.execute(widget.id, settings);
      } else {
        updatedWidget = widget;
      }

      setCurrentWidget(updatedWidget);
      setCurrentWidgetKey(`${type}-${style}`);
    } catch (error) {
      console.error('Failed to create widget with style:', error);
    }
  };

  const handleWidgetChange = async (type: string, style?: string) => {
    if (style) {
      await createWidgetWithStyle(type, style);
    } else {
      // Fallback to basic widget creation
      try {
        const widget = await diContainer.createWidgetUseCase.execute(type);
        setCurrentWidget(widget);
        setCurrentWidgetKey(type);
      } catch (error) {
        console.error('Failed to create widget:', error);
      }
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
        currentWidget={currentWidgetKey}
        onWidgetChange={handleWidgetChange}
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