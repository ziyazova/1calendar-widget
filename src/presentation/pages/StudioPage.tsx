import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Logger } from '../../infrastructure/services/Logger';
import { DIContainer } from '../../infrastructure/di/DIContainer';
import { Widget } from '../../domain/entities/Widget';
import { CalendarSettings } from '../../domain/value-objects/CalendarSettings';
import { ClockSettings } from '../../domain/value-objects/ClockSettings';
import { Sidebar } from '../components/ui/sidebar/Sidebar';
import { Header } from '../components/layout/Header';
import { WidgetDisplay } from '../components/layout/WidgetDisplay';
import { CustomizationPanel } from '../components/ui/forms/CustomizationPanel';
import { LayoutCheck } from '../components/layout/LayoutCheck';

interface StudioPageProps {
  diContainer: DIContainer;
}

type ViewMode = 'editor' | 'layout-check';

const StudioContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background.secondary};
`;

const WorkspaceContainer = styled.div`
  display: flex;
  flex: 1;
  height: calc(100vh - 64px);
`;

const ContentArea = styled.div`
  display: flex;
  flex: 1;
  gap: 20px;
  padding: 20px;
  overflow: hidden;
  margin-left: 300px;
  height: calc(100vh - 64px);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-left: 0;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }
`;

const WidgetArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  height: calc(100vh - 64px - 40px);
  position: relative;
  overflow: hidden;
  background: #ffffff;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const LayoutCheckArea = styled.div`
  flex: 1;
  border-radius: 20px;
  height: calc(100vh - 64px - 40px);
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background.primary};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const StudioPage: React.FC<StudioPageProps> = ({ diContainer }) => {
  const [currentWidget, setCurrentWidget] = useState<Widget | null>(null);
  const [currentWidgetKey, setCurrentWidgetKey] = useState<string>('calendar-modern-grid-zoom-fixed');
  const [availableWidgets, setAvailableWidgets] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('editor');

  useEffect(() => {
    const types = diContainer.listAvailableWidgetsUseCase.execute();
    setAvailableWidgets(types);

    if (types.includes('calendar')) {
      createWidgetWithStyle('calendar', 'modern-grid-zoom-fixed');
    }
  }, [diContainer]);

  const createWidgetWithStyle = async (type: string, style: string) => {
    try {
      const widget = await diContainer.createWidgetUseCase.execute(type);

      let updatedWidget;
      if (type === 'calendar') {
        const settings = new CalendarSettings({ style: style as CalendarSettings['style'] });
        updatedWidget = await diContainer.updateWidgetUseCase.execute(widget.id, settings);
      } else {
        const settings = new ClockSettings({ style: style as 'modern' | 'analog-classic' });
        updatedWidget = await diContainer.updateWidgetUseCase.execute(widget.id, settings);
      }

      setCurrentWidget(updatedWidget);
      setCurrentWidgetKey(`${type}-${style}`);
    } catch (error) {
      Logger.error('StudioPage', 'Failed to create widget with style', error);
    }
  };

  const handleWidgetChange = async (type: string, style?: string) => {
    if (style) {
      await createWidgetWithStyle(type, style);
    } else {
      try {
        const widget = await diContainer.createWidgetUseCase.execute(type);
        setCurrentWidget(widget);
        setCurrentWidgetKey(type);
      } catch (error) {
        Logger.error('StudioPage', 'Failed to create widget', error);
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
      Logger.error('StudioPage', 'Failed to update widget', error);
    }
  };

  const handleCopyEmbedUrl = () => {
    if (!currentWidget) return;

    const embedUrl = diContainer.getWidgetEmbedUrlUseCase.execute(currentWidget);

    navigator.clipboard.writeText(embedUrl)
      .then(() => {
        Logger.info('StudioPage', 'Embed URL copied to clipboard');
      })
      .catch((err) => Logger.error('StudioPage', 'Failed to copy embed URL', err));
  };

  return (
    <StudioContainer>
      <Header
        currentWidget={currentWidget}
        onCopyEmbedUrl={handleCopyEmbedUrl}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <WorkspaceContainer>
        <Sidebar
          availableWidgets={availableWidgets}
          currentWidget={currentWidgetKey}
          onWidgetChange={handleWidgetChange}
        />

        <ContentArea>
          {viewMode === 'editor' ? (
            <>
              <WidgetArea>
                <WidgetDisplay widget={currentWidget} />
              </WidgetArea>

              <CustomizationPanel
                widget={currentWidget}
                onSettingsChange={handleSettingsChange}
              />
            </>
          ) : (
            <LayoutCheckArea>
              <LayoutCheck widget={currentWidget} />
            </LayoutCheckArea>
          )}
        </ContentArea>
      </WorkspaceContainer>
    </StudioContainer>
  );
};
