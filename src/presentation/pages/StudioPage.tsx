import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Copy, Check, Pencil, LayoutGrid, Grip } from 'lucide-react';
import { Logger } from '../../infrastructure/services/Logger';
import { DIContainer } from '../../infrastructure/di/DIContainer';
import { Widget } from '../../domain/entities/Widget';
import { CalendarSettings } from '../../domain/value-objects/CalendarSettings';
import { ClockSettings } from '../../domain/value-objects/ClockSettings';
import { BoardSettings } from '../../domain/value-objects/BoardSettings';

type AnySettings = Partial<CalendarSettings | ClockSettings | BoardSettings>;
import { Sidebar } from '../components/ui/sidebar/Sidebar';
import { WidgetDisplay } from '../components/layout/WidgetDisplay';
import { CustomizationPanel } from '../components/ui/forms/CustomizationPanel';
import { LayoutCheck } from '../components/layout/LayoutCheck';

interface StudioPageProps {
  diContainer: DIContainer;
}

type ViewMode = 'editor' | 'layout-check';

const StudioContainer = styled.div<{ $transitioning?: boolean }>`
  display: flex;
  min-height: 100vh;
  background: #ffffff;
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  opacity: ${({ $transitioning }) => $transitioning ? 0 : 1};
  transition: opacity 0.4s ease;
`;

const WorkspaceContainer = styled.div`
  display: flex;
  flex: 1;
  height: 100vh;
`;

const ContentArea = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex: 1;
  gap: 0;
  padding: 0;
  overflow: visible;
  margin-left: 270px;
  margin-right: ${({ $fullWidth }) => $fullWidth ? '0' : '290px'};
  height: 100vh;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-left: 0;
    margin-right: 0;
    flex-direction: column;
  }
`;

const widgetAreaAppear = keyframes`
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const WidgetArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(51, 132, 244, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 60% 80%, rgba(236, 72, 153, 0.05) 0%, transparent 50%),
    #F8F8F7;
  border-radius: 28px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: none;
  margin: 12px 0 20px 0;
  animation: ${widgetAreaAppear} 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
`;


const TransitionOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: #ffffff;
  z-index: 9998;
  animation: fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  pointer-events: none;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const DotGrid = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.16) 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
`;

const ZoomableWidget = styled.div<{ $zoom: number }>`
  --zoom: ${({ $zoom }) => $zoom};
  transform: scale(var(--zoom)) translateY(-48px);
  transform-origin: center center;
  transition: transform 0.15s ease;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.08)) drop-shadow(0 2px 6px rgba(0, 0, 0, 0.04));
  animation: appear 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.28s both;

  @keyframes appear {
    from { opacity: 0; transform: scale(var(--zoom)) translateY(-44px); }
    to { opacity: 1; transform: scale(var(--zoom)) translateY(-48px); }
  }
`;

/* ── Floating Toolbar (Figma-style) ── */

const FloatingToolbar = styled.div`
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  padding: 8px 12px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
  z-index: 10;
`;

const ToolbarDivider = styled.div`
  width: 1px;
  height: 28px;
  background: rgba(0, 0, 0, 0.08);
  margin: 0 8px;
`;

const Tooltip = styled.span`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: #1F1F1F;
  color: #fff;
  font-size: 11px;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 8px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease, transform 0.15s ease;
  transform: translateX(-50%) translateY(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: #1F1F1F;
  }
`;

const ToolbarButton = styled.button<{ $active?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
  background: ${({ $active }) => $active ? 'rgba(51, 132, 244, 0.12)' : 'transparent'};
  color: ${({ $active }) => $active ? '#3384F4' : '#6B6B6B'};

  &:hover {
    background: ${({ $active }) => $active ? 'rgba(51, 132, 244, 0.15)' : 'rgba(0, 0, 0, 0.05)'};
    color: ${({ $active }) => $active ? '#3384F4' : '#1F1F1F'};
  }

  &:hover ${Tooltip} {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  &:active {
    transform: scale(0.92);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;


const TopRightControls = styled.div`
  position: absolute;
  top: 32px;
  right: 32px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
`;

const ZoomControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  background: #ffffff;
  border-radius: 12px;
  height: 36px;
  padding: 0 4px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`;

const ZoomSlider = styled.input`
  width: 100px;
  height: 3px;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.12);
  outline: none;
  -webkit-appearance: none;
  margin: 0 4px;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #3384F4;
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(51, 132, 244, 0.3);
    transition: transform 0.1s ease;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.15);
  }
`;

const ZoomValueDivider = styled.div`
  width: 1px;
  height: 20px;
  background: rgba(0, 0, 0, 0.1);
  margin: 0 4px 0 8px;
`;

const ZoomValue = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #6B6B6B;
  font-variant-numeric: tabular-nums;
  min-width: 42px;
  text-align: center;
  user-select: none;
  padding: 0 4px;
`;

const ZoomLabel = styled.span`
  font-size: 16px;
  font-weight: 400;
  color: #6B6B6B;
  user-select: none;
  cursor: pointer;
  padding: 0 10px;
  transition: color 0.15s ease;
  line-height: 36px;

  &:hover {
    color: #1F1F1F;
  }
`;

const GridToggle = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: #ffffff;
  color: ${({ $active }) => $active ? '#3384F4' : '#6B6B6B'};
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

  &:hover {
    color: ${({ $active }) => $active ? '#3384F4' : '#1F1F1F'};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const EmbedUrlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const EmbedUrlInput = styled.input`
  width: 180px;
  height: 32px;
  padding: 0 12px;
  border: none;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.04);
  font-size: 11px;
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  color: #6B6B6B;
  letter-spacing: -0.01em;
  outline: none;

  &:focus {
    background: rgba(0, 0, 0, 0.06);
    color: #1F1F1F;
  }

  &::selection {
    background: rgba(51, 132, 244, 0.2);
  }
`;

const CopyButton = styled.button<{ $copied?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 32px;
  padding: 0 16px;
  border: none;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  flex-shrink: 0;
  background: ${({ $copied }) => $copied
    ? 'rgba(34, 197, 94, 0.12)'
    : 'linear-gradient(135deg, #3384F4, #5BA0F7)'};
  color: ${({ $copied }) => $copied ? '#16a34a' : '#fff'};

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: ${({ $copied }) => $copied
      ? 'none'
      : '0 2px 8px rgba(51, 132, 244, 0.3)'};
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const LayoutCheckArea = styled.div`
  flex: 1;
  height: 100vh;
  overflow: hidden;
  background: #ffffff;
  position: relative;
`;

export const StudioPage: React.FC<StudioPageProps> = ({ diContainer }) => {
  const [currentWidget, setCurrentWidget] = useState<Widget | null>(null);
  const [currentWidgetKey, setCurrentWidgetKey] = useState<string>('calendar-modern-grid-zoom-fixed');
  const [availableWidgets, setAvailableWidgets] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const [studioZoom, setStudioZoom] = useState(1.0);
  const [showGrid, setShowGrid] = useState(false);
  const [copied, setCopied] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const navigate = useNavigate();

  const handleLogoClick = useCallback(() => {
    setTransitioning(true);
    setTimeout(() => navigate('/'), 400);
  }, [navigate]);

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
      } else if (type === 'board') {
        const settings = new BoardSettings({ layout: style as BoardSettings['layout'] });
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

  const handleSettingsChange = async (newSettings: AnySettings) => {
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

  const embedUrl = currentWidget
    ? diContainer.getWidgetEmbedUrlUseCase.execute(currentWidget)
    : '';

  const handleCopyEmbedUrl = () => {
    if (!currentWidget || !embedUrl) return;

    navigator.clipboard.writeText(embedUrl)
      .then(() => {
        Logger.info('StudioPage', 'Embed URL copied to clipboard');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => Logger.error('StudioPage', 'Failed to copy embed URL', err));
  };

  return (
    <StudioContainer $transitioning={transitioning}>
      <WorkspaceContainer>
        <Sidebar
          availableWidgets={availableWidgets}
          currentWidget={currentWidgetKey}
          onWidgetChange={handleWidgetChange}
          onLogoClick={handleLogoClick}
          logoPressed={transitioning}
        />

        <ContentArea $fullWidth={viewMode === 'layout-check'}>
          {viewMode === 'editor' ? (
            <>
              <WidgetArea>
                {showGrid && <DotGrid />}

                <ZoomableWidget key={currentWidgetKey} $zoom={studioZoom}>
                  <WidgetDisplay widget={currentWidget} />
                </ZoomableWidget>

                {currentWidget && (
                  <FloatingToolbar>
                    <ToolbarButton
                      $active={viewMode === 'editor'}
                      onClick={() => setViewMode('editor')}
                    >
                      <Pencil />
                      <Tooltip>Editor</Tooltip>
                    </ToolbarButton>
                    <ToolbarButton
                      $active={viewMode === 'layout-check' as ViewMode}
                      onClick={() => setViewMode('layout-check')}
                    >
                      <LayoutGrid />
                      <Tooltip>Preview</Tooltip>
                    </ToolbarButton>

                    <ToolbarDivider />

                    <EmbedUrlGroup>
                      <EmbedUrlInput
                        readOnly
                        value={embedUrl}
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                      />
                      <CopyButton onClick={handleCopyEmbedUrl} $copied={copied}>
                        {copied ? <><Check /> Copied</> : <><Copy /> Copy</>}
                      </CopyButton>
                    </EmbedUrlGroup>

                  </FloatingToolbar>
                )}

                <TopRightControls>
                  <ZoomControl>
                    <ZoomLabel onClick={() => setStudioZoom(Math.max(0.5, +(studioZoom - 0.1).toFixed(1)))}>−</ZoomLabel>
                    <ZoomSlider
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={studioZoom}
                      onChange={(e) => setStudioZoom(parseFloat(e.target.value))}
                    />
                    <ZoomLabel onClick={() => setStudioZoom(Math.min(2.0, +(studioZoom + 0.1).toFixed(1)))}>+</ZoomLabel>
                    <ZoomValueDivider />
                    <ZoomValue>{Math.round(studioZoom * 100)}%</ZoomValue>
                  </ZoomControl>
                  <GridToggle $active={showGrid} onClick={() => setShowGrid(!showGrid)}>
                    <Grip />
                  </GridToggle>
                </TopRightControls>
              </WidgetArea>

              <CustomizationPanel
                widget={currentWidget}
                onSettingsChange={handleSettingsChange}
              />
            </>
          ) : (
            <LayoutCheckArea>
              <LayoutCheck widget={currentWidget} />

              {currentWidget && (
                <FloatingToolbar style={{ left: 'calc(50% - 145px)' }}>
                  <ToolbarButton
                    onClick={() => setViewMode('editor')}
                  >
                    <Pencil />
                    <Tooltip>Editor</Tooltip>
                  </ToolbarButton>
                  <ToolbarButton
                    $active
                  >
                    <LayoutGrid />
                    <Tooltip>Preview</Tooltip>
                  </ToolbarButton>

                  <ToolbarDivider />

                  <EmbedUrlGroup>
                    <EmbedUrlInput
                      readOnly
                      value={embedUrl}
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <CopyButton onClick={handleCopyEmbedUrl} $copied={copied}>
                      {copied ? <><Check /> Copied</> : <><Copy /> Copy</>}
                    </CopyButton>
                  </EmbedUrlGroup>
                </FloatingToolbar>
              )}
            </LayoutCheckArea>
          )}
        </ContentArea>
      </WorkspaceContainer>
    </StudioContainer>
  );
};
