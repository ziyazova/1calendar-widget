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
  font-family: ${({ theme }) => theme.typography.fonts.primary};
`;

const WorkspaceContainer = styled.div`
  display: flex;
  flex: 1;
  height: calc(100vh - 72px);
`;

const ContentArea = styled.div`
  display: flex;
  flex: 1;
  gap: 0;
  padding: 0;
  overflow: hidden;
  margin-left: 270px;
  margin-right: 290px;
  height: calc(100vh - 72px);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-left: 0;
    margin-right: 0;
    flex-direction: column;
  }
`;

const WidgetArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 72px);
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background.secondary};
`;

const ZoomableWidget = styled.div<{ $zoom: number }>`
  transform: scale(${({ $zoom }) => $zoom});
  transform-origin: center center;
  transition: transform 0.15s ease;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ZoomControls = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  padding: 6px 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  z-index: 10;
`;

const ZoomSlider = styled.input`
  width: 100px;
  height: 3px;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.08);
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #ffffff;
    border: 2px solid #1d1d1f;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
`;

const ZoomLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.45);
  font-variant-numeric: tabular-nums;
  min-width: 36px;
  text-align: center;
  user-select: none;
`;

const LayoutCheckArea = styled.div`
  flex: 1;
  height: calc(100vh - 72px);
  overflow: hidden;
  background: #ffffff;
`;

export const StudioPage: React.FC<StudioPageProps> = ({ diContainer }) => {
  const [currentWidget, setCurrentWidget] = useState<Widget | null>(null);
  const [currentWidgetKey, setCurrentWidgetKey] = useState<string>('calendar-modern-grid-zoom-fixed');
  const [availableWidgets, setAvailableWidgets] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const [studioZoom, setStudioZoom] = useState(1.0);

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
                <ZoomableWidget $zoom={studioZoom}>
                  <WidgetDisplay widget={currentWidget} />
                </ZoomableWidget>
                {currentWidget && (
                  <ZoomControls>
                    <ZoomLabel>−</ZoomLabel>
                    <ZoomSlider
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={studioZoom}
                      onChange={(e) => setStudioZoom(parseFloat(e.target.value))}
                    />
                    <ZoomLabel>{Math.round(studioZoom * 100)}%</ZoomLabel>
                  </ZoomControls>
                )}
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
