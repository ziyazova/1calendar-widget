import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { Sun, Moon, Bug } from 'lucide-react';
import { Widget } from '../../../domain/entities/Widget';
import { CalendarSettings } from '../../../domain/value-objects/CalendarSettings';
import { ClockSettings } from '../../../domain/value-objects/ClockSettings';
import { BoardSettings } from '../../../domain/value-objects/BoardSettings';

interface LayoutCheckProps {
  widget: Widget | null;
}

/* ── Layout ── */

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  background: #ffffff;
`;

const RightPanel = styled.div`
  width: 290px;
  height: 100vh;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #ffffff;
`;

const PanelHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 24px 8px;
`;

const PanelContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 24px 32px;

  &::-webkit-scrollbar {
    width: 0;
  }
`;

const PanelSection = styled.div`
  padding: 12px 0 0;

  & + & {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
  }
`;

const PanelSectionTitle = styled.h3`
  font-size: 11px;
  font-weight: 600;
  color: #ABABAB;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  margin: 0 0 12px 0;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #1F1F1F;
  margin: 0;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StyleBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 600;
  background: linear-gradient(135deg, #3384F4, #5BA0F7);
  color: #fff;
  border-radius: 8px;
  letter-spacing: 0;
`;

const Subtitle = styled.p`
  font-size: 12px;
  color: #6B6B6B;
  margin: 0 0 16px 0;
  letter-spacing: -0.01em;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

/* ── Controls ── */

const ControlsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 0;
  flex-shrink: 0;
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ControlLabel = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: #6B6B6B;
  letter-spacing: -0.01em;
`;

const ControlSlider = styled.input`
  width: 120px;
  height: 4px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.06);
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #ffffff;
    border: 2px solid #3384F4;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(51, 132, 244, 0.25);
    transition: all 0.15s ease;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.15);
    box-shadow: 0 3px 10px rgba(51, 132, 244, 0.35);
  }
`;

const ControlValue = styled.span`
  font-size: 11px;
  color: #6B6B6B;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  min-width: 36px;
`;

const ControlSelect = styled.select`
  padding: 8px 24px 8px 12px;
  font-size: 12px;
  font-weight: 400;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.8);
  color: #1F1F1F;
  font-family: inherit;
  cursor: pointer;
  appearance: none;
  transition: all 0.15s ease;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 8px center;
  background-repeat: no-repeat;
  background-size: 14px;

  &:hover {
    border-color: rgba(51, 132, 244, 0.3);
  }

  &:focus {
    outline: none;
    border-color: #3384F4;
    box-shadow: 0 0 0 3px rgba(51, 132, 244, 0.1);
  }
`;

/* ── Theme Toggle ── */

const ThemeToggle = styled.div`
  display: flex;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.04);
  padding: 2px;
  gap: 2px;
`;

const ThemeToggleButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  background: ${({ $active }) => $active ? '#fff' : 'transparent'};
  color: ${({ $active }) => $active ? '#1F1F1F' : '#6B6B6B'};
  box-shadow: ${({ $active }) => $active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'};

  &:hover {
    color: ${({ $active }) => $active ? '#1F1F1F' : '#6B6B6B'};
  }

  svg {
    width: 13px;
    height: 13px;
  }
`;

const DebugButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  background: ${({ $active }) => $active ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 0, 0, 0.04)'};
  color: ${({ $active }) => $active ? '#ef4444' : '#6B6B6B'};

  &:hover {
    background: ${({ $active }) => $active ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 0, 0, 0.06)'};
    color: ${({ $active }) => $active ? '#ef4444' : '#6B6B6B'};
  }

  svg {
    width: 15px;
    height: 15px;
  }
`;

const DebugLegend = styled.div<{ $visible: boolean }>`
  display: ${({ $visible }) => $visible ? 'flex' : 'none'};
  gap: 16px;
  align-items: center;
  margin: 16px 0 0;
  padding: 12px 16px;
  background: #1F1F1F;
  border-radius: 12px;
  font-size: 11px;
  font-family: monospace;
  color: #6B6B6B;
  flex-wrap: wrap;
`;

const Swatch = styled.span<{ $border: string }>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  vertical-align: middle;
  margin-right: 4px;
  border: ${({ $border }) => $border};
`;

/* ── Presets ── */

const PresetsRow = styled.div`
  display: flex;
  gap: 4px;
  padding: 16px 0;
  flex-wrap: wrap;
  align-items: center;
  flex-shrink: 0;
`;

const PresetButton = styled.button`
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.8);
  color: #6B6B6B;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s ease;
  letter-spacing: -0.01em;

  &:hover {
    background: rgba(51, 132, 244, 0.04);
    border-color: rgba(51, 132, 244, 0.15);
    color: #3384F4;
  }
`;

/* ── Embed Area ── */

const EmbedArea = styled.div<{ $dark?: boolean }>`
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding-top: 3%;
  padding-left: 5%;
  position: relative;
  overflow: hidden;
  min-height: 0;
  background: ${({ $dark }) => $dark ? '#191919' : '#F8F8F7'};
  border-radius: 28px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  margin: 12px 0 20px 0;
  transition: background 0.3s ease;
`;

const EmbedTopRight = styled.div`
  position: absolute;
  top: 32px;
  right: 32px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 2;
`;

const DotGrid = styled.div<{ $dark?: boolean }>`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, ${({ $dark }) => $dark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.16)'} 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
`;

const darkContainerStyles = css`
  background: #191919;
  border-color: #333;
`;

const lightContainerStyles = css`
  background: #fff;
`;

const EmbedContainer = styled.div<{ $dark?: boolean }>`
  ${({ $dark }) => $dark ? darkContainerStyles : lightContainerStyles};
  border: 1px solid ${({ $dark }) => $dark ? '#333' : 'rgba(0, 0, 0, 0.08)'};
  border-radius: 12px;
  overflow: hidden;
  resize: both;
  position: relative;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04);
  z-index: 1;
`;

const EmbedIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  display: block;
`;

const SizeLabel = styled.span<{ $dark?: boolean }>`
  position: absolute;
  bottom: 6px;
  right: 10px;
  font-size: 10px;
  font-weight: 500;
  color: ${({ $dark }) => $dark ? '#666' : '#6B6B6B'};
  pointer-events: none;
  background: ${({ $dark }) => $dark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.9)'};
  padding: 2px 8px;
  border-radius: 8px;
  font-variant-numeric: tabular-nums;
  backdrop-filter: blur(8px);
  letter-spacing: -0.01em;
`;

/* ── Empty ── */

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 24px;
  color: #6B6B6B;
  font-size: 14px;
  font-weight: 500;
`;

/* ── Data ── */

const CALENDAR_STYLES = [
  { value: 'modern-grid-zoom-fixed', label: 'Default' },
  { value: 'classic', label: 'Classic' },
  { value: 'collage', label: 'Collage' },
  { value: 'typewriter', label: 'Typewriter' },
];

const CLOCK_STYLES = [
  { value: 'classic', label: 'Clock' },
  { value: 'flower', label: 'Flower' },
  { value: 'dreamy', label: 'Dreamy' },
];

const BOARD_STYLES = [
  { value: 'grid', label: 'Moodboard' },
];

const PRESET_SIZES = [
  { w: 200, h: 200, label: 'Tiny' },
  { w: 320, h: 320, label: 'Small' },
  { w: 420, h: 380, label: 'Default' },
  { w: 500, h: 400, label: 'Medium' },
  { w: 700, h: 500, label: 'Wide' },
  { w: 800, h: 600, label: 'Max' },
];

function makeEmbedUrl(widgetType: 'calendar' | 'clock' | 'board', style: string): string {
  const config = btoa(JSON.stringify({ style }));
  const base = window.location.origin;
  return `${base}/embed/${widgetType}?config=${config}`;
}

export const LayoutCheck: React.FC<LayoutCheckProps> = ({ widget }) => {
  const widgetType: 'calendar' | 'clock' | 'board' = widget?.type === 'clock' ? 'clock' : widget?.type === 'board' ? 'board' : 'calendar';
  const styles = widgetType === 'clock' ? CLOCK_STYLES : widgetType === 'board' ? BOARD_STYLES : CALENDAR_STYLES;
  const defaultStyle = widgetType === 'clock' ? 'classic' : widgetType === 'board' ? 'grid' : 'modern-grid-zoom-fixed';

  const [width, setWidth] = useState(420);
  const [height, setHeight] = useState(380);
  const [style, setStyle] = useState(defaultStyle);
  const [debug, setDebug] = useState(false);
  const [simDark, setSimDark] = useState(false);
  const [displaySize, setDisplaySize] = useState('420 x 380');
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync style from current widget
  useEffect(() => {
    if (widget && widget.type === 'calendar') {
      const s = (widget.settings as CalendarSettings).style;
      if (s) setStyle(s);
    } else if (widget && widget.type === 'clock') {
      const s = (widget.settings as ClockSettings).style;
      if (s) setStyle(s);
    } else if (widget && widget.type === 'board') {
      const s = (widget.settings as BoardSettings).layout;
      if (s) setStyle(s);
    }
  }, [widget]);

  const embedUrl = makeEmbedUrl(widgetType, style);

  const sendDebug = useCallback((msg: string) => {
    try { iframeRef.current?.contentWindow?.postMessage(msg, '*'); } catch {}
  }, []);

  useEffect(() => {
    if (debug) {
      const t = setTimeout(() => sendDebug('debug-on'), 500);
      return () => clearTimeout(t);
    } else {
      sendDebug('debug-off');
    }
  }, [debug, style, sendDebug]);

  // Track resize of the main embed container
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => {
      if (!containerRef.current) return;
      const w = Math.round(containerRef.current.offsetWidth);
      const h = Math.round(containerRef.current.offsetHeight);
      setDisplaySize(`${w} x ${h}`);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const applySize = (w: number, h: number) => {
    setWidth(w);
    setHeight(h);
    if (containerRef.current) {
      containerRef.current.style.width = `${w}px`;
      containerRef.current.style.height = `${h}px`;
    }
  };

  const currentStyleLabel = styles.find(s => s.value === style)?.label || style;

  if (!widget) {
    return (
      <Container>
        <EmptyState>Pick a widget to preview</EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <EmbedArea $dark={simDark}>
        <DotGrid $dark={simDark} />
        <EmbedTopRight>
          <ThemeToggle>
            <ThemeToggleButton $active={!simDark} onClick={() => setSimDark(false)}>
              <Sun /> Light
            </ThemeToggleButton>
            <ThemeToggleButton $active={simDark} onClick={() => setSimDark(true)}>
              <Moon /> Dark
            </ThemeToggleButton>
          </ThemeToggle>
          <DebugButton $active={debug} onClick={() => setDebug(!debug)} title="Debug overlay">
            <Bug />
          </DebugButton>
        </EmbedTopRight>
        <EmbedContainer
          ref={containerRef}
          $dark={simDark}
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <EmbedIframe ref={iframeRef} src={embedUrl} />
          <SizeLabel $dark={simDark}>{displaySize}</SizeLabel>
        </EmbedContainer>
      </EmbedArea>

      <RightPanel>
        <PanelHeader>
          <Title>Preview</Title>
          <Subtitle>Test how your widget adapts</Subtitle>
        </PanelHeader>

        <PanelContent>
          <PanelSection>
            <PanelSectionTitle>Widget</PanelSectionTitle>
            <ControlGroup>
              <ControlSelect value={style} onChange={(e) => setStyle(e.target.value)}>
                {styles.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </ControlSelect>
            </ControlGroup>
          </PanelSection>

          <PanelSection>
            <PanelSectionTitle>Size</PanelSectionTitle>
            <ControlsRow>
              <ControlGroup>
                <ControlLabel>W</ControlLabel>
                <ControlSlider
                  type="range"
                  min="150"
                  max="900"
                  value={width}
                  onChange={(e) => applySize(parseInt(e.target.value), height)}
                />
                <ControlValue>{width}px</ControlValue>
              </ControlGroup>

              <ControlGroup>
                <ControlLabel>H</ControlLabel>
                <ControlSlider
                  type="range"
                  min="150"
                  max="700"
                  value={height}
                  onChange={(e) => applySize(width, parseInt(e.target.value))}
                />
                <ControlValue>{height}px</ControlValue>
              </ControlGroup>
            </ControlsRow>

            <PresetsRow>
              {PRESET_SIZES.map(p => (
                <PresetButton key={p.label} onClick={() => applySize(p.w, p.h)}>
                  {p.label}
                </PresetButton>
              ))}
            </PresetsRow>
          </PanelSection>

          <DebugLegend $visible={debug}>
            <span><Swatch $border="2px dashed red" /> Wrapper</span>
            <span><Swatch $border="2px solid cyan" /> SVG foreignObject</span>
            <span><Swatch $border="2px solid lime" /> GridContainer</span>
          </DebugLegend>
        </PanelContent>
      </RightPanel>
    </Container>
  );
};
