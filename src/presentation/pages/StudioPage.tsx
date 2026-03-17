import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Copy, Check, Pencil, LayoutGrid } from 'lucide-react';
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

const StudioContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
  font-family: ${({ theme }) => theme.typography.fonts.primary};
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
  overflow: hidden;
  margin-left: 270px;
  margin-right: ${({ $fullWidth }) => $fullWidth ? '0' : '290px'};
  height: 100vh;

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
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

const LiquidBlob = styled.div<{ $size: number; $color: string; $delay?: string }>`
  position: absolute;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  background: ${({ $color }) => $color};
  border-radius: 50%;
  filter: blur(0px);
  animation: blob 12s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay || '0s'};
  pointer-events: none;

  @keyframes blob {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(30px, -40px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
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
  transform: scale(${({ $zoom }) => $zoom});
  transform-origin: center center;
  transition: transform 0.15s ease;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* ── Floating Toolbar (Figma-style) ── */

const FloatingToolbar = styled.div`
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  padding: 6px 10px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
  z-index: 10;
`;

const ToolbarDivider = styled.div`
  width: 1px;
  height: 28px;
  background: rgba(0, 0, 0, 0.08);
  margin: 0 6px;
`;

const Tooltip = styled.span`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: #1a1a2e;
  color: #fff;
  font-size: 11px;
  font-weight: 500;
  padding: 5px 10px;
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
    border-top-color: #1a1a2e;
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
  background: ${({ $active }) => $active ? 'rgba(99, 102, 241, 0.12)' : 'transparent'};
  color: ${({ $active }) => $active ? '#6366f1' : '#64748b'};

  &:hover {
    background: ${({ $active }) => $active ? 'rgba(99, 102, 241, 0.15)' : 'rgba(0, 0, 0, 0.05)'};
    color: ${({ $active }) => $active ? '#6366f1' : '#334155'};
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


const ZoomControl = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  padding: 3px;
  z-index: 10;
`;

const ZoomSlider = styled.input`
  width: 80px;
  height: 3px;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.08);
  outline: none;
  -webkit-appearance: none;
  margin: 0 4px;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ffffff;
    border: 2px solid #6366f1;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
`;

const ZoomValue = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #1a1a2e;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  font-variant-numeric: tabular-nums;
  min-width: 44px;
  user-select: none;
`;

const ZoomLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  user-select: none;
  cursor: pointer;
  padding: 5px 8px;
  border-radius: 8px;
  transition: color 0.15s ease;

  &:hover {
    color: #334155;
  }
`;

const EmbedUrlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const EmbedUrlInput = styled.input`
  width: 180px;
  height: 32px;
  padding: 0 10px;
  border: none;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.04);
  font-size: 11px;
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  color: #64748b;
  letter-spacing: -0.01em;
  outline: none;

  &:focus {
    background: rgba(0, 0, 0, 0.06);
    color: #334155;
  }

  &::selection {
    background: rgba(99, 102, 241, 0.2);
  }
`;

const CopyButton = styled.button<{ $copied?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
  padding: 0 14px;
  border: none;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  flex-shrink: 0;
  background: ${({ $copied }) => $copied
    ? 'rgba(34, 197, 94, 0.12)'
    : 'linear-gradient(135deg, #6366f1, #8b5cf6)'};
  color: ${({ $copied }) => $copied ? '#16a34a' : '#fff'};

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: ${({ $copied }) => $copied
      ? 'none'
      : '0 2px 8px rgba(99, 102, 241, 0.3)'};
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
  background: #f8fafc;
  position: relative;
`;

export const StudioPage: React.FC<StudioPageProps> = ({ diContainer }) => {
  const [currentWidget, setCurrentWidget] = useState<Widget | null>(null);
  const [currentWidgetKey, setCurrentWidgetKey] = useState<string>('calendar-modern-grid-zoom-fixed');
  const [availableWidgets, setAvailableWidgets] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const [studioZoom, setStudioZoom] = useState(1.0);
  const [copied, setCopied] = useState(false);

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
    <StudioContainer>
      <WorkspaceContainer>
        <Sidebar
          availableWidgets={availableWidgets}
          currentWidget={currentWidgetKey}
          onWidgetChange={handleWidgetChange}
        />

        <ContentArea $fullWidth={viewMode === 'layout-check'}>
          {viewMode === 'editor' ? (
            <>
              <WidgetArea>
                <DotGrid />

                <ZoomableWidget $zoom={studioZoom}>
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

                <ZoomControl>
                  <ZoomLabel onClick={() => setStudioZoom(Math.max(0.5, studioZoom - 0.1))}>−</ZoomLabel>
                  <ZoomSlider
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={studioZoom}
                    onChange={(e) => setStudioZoom(parseFloat(e.target.value))}
                  />
                  <ZoomLabel onClick={() => setStudioZoom(Math.min(2.0, studioZoom + 0.1))}>+</ZoomLabel>
                  <ZoomValue>{Math.round(studioZoom * 100)}%</ZoomValue>
                </ZoomControl>
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
