import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DIContainer } from '../../infrastructure/di/DIContainer';
import { Widget } from '../../domain/entities/Widget';
import { CalendarSettings } from '../../domain/value-objects/CalendarSettings';
import { ClockSettings } from '../../domain/value-objects/ClockSettings';
import { Sidebar } from '../components/ui/sidebar/Sidebar';
import { Header } from '../components/layout/Header';
import { WidgetDisplay } from '../components/layout/WidgetDisplay';
import { CustomizationPanel } from '../components/ui/forms/CustomizationPanel';

interface StudioPageProps {
  diContainer: DIContainer;
}

const StudioContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background.secondary};
`;

const WorkspaceContainer = styled.div`
  display: flex;
  flex: 1;
  height: calc(100vh - 80px);
`;

const ContentArea = styled.div`
  display: flex;
  flex: 1;
  gap: ${({ theme }) => theme.spacing['8']};
  padding: ${({ theme }) => theme.spacing['8']} ${({ theme }) => theme.spacing['8']} 0;
  overflow: hidden;
  margin-left: 300px;
  height: calc(100vh - 80px);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-left: 0;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing['6']};
  }
`;

const WidgetArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.radii.card};
  height: calc(100vh - 80px - 64px);
  position: relative;
  overflow: hidden;
`;

export const StudioPage: React.FC<StudioPageProps> = ({ diContainer }) => {
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
        const settings = new CalendarSettings({ style: style as 'modern-grid' | 'modern-weekly' });
        updatedWidget = await diContainer.updateWidgetUseCase.execute(widget.id, settings);
      } else {
        const settings = new ClockSettings({ style: style as 'modern' | 'digital-minimal' | 'analog-classic' });
        updatedWidget = await diContainer.updateWidgetUseCase.execute(widget.id, settings);
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

  const handleSettingsChange = async (newSettings: Partial<CalendarSettings | ClockSettings>) => {
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
    <StudioContainer>
      <Header
        currentWidget={currentWidget}
        onCopyEmbedUrl={handleCopyEmbedUrl}
      />

      <WorkspaceContainer>
        <Sidebar
          availableWidgets={availableWidgets}
          currentWidget={currentWidgetKey}
          onWidgetChange={handleWidgetChange}
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
      </WorkspaceContainer>
    </StudioContainer>
  );
}; 