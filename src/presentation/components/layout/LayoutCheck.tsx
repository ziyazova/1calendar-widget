import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { Widget } from '../../../domain/entities/Widget';
import { CalendarSettings } from '../../../domain/value-objects/CalendarSettings';
import { ClockSettings } from '../../../domain/value-objects/ClockSettings';
import { BoardSettings } from '../../../domain/value-objects/BoardSettings';

interface LayoutCheckProps {
  widget: Widget | null;
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 24px;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border.primary};
    border-radius: 10px;
  }
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 4px 0;
  letter-spacing: -0.02em;

  span {
    display: inline-block;
    padding: 3px 10px;
    font-size: 11px;
    font-weight: 600;
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    border-radius: 4px;
    margin-left: 8px;
    vertical-align: middle;
    letter-spacing: 0;
  }
`;

const Subtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0 0 20px 0;
`;

const Controls = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const ControlLabel = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ControlSlider = styled.input`
  width: 140px;
  height: 4px;
  border-radius: 2px;
  background: ${({ theme }) => theme.colors.border.primary};
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
`;

const ControlValue = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  min-width: 42px;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
`;

const ControlSelect = styled.select`
  padding: 5px 28px 5px 10px;
  font-size: 13px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  background: #fff;
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: inherit;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 6px center;
  background-repeat: no-repeat;
  background-size: 14px;

  &:hover { border-color: #ccc; }
`;

const DebugButton = styled.button<{ $active: boolean }>`
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  border-radius: 6px;
  border: 1px solid ${({ $active }) => $active ? '#e74c3c' : '#ddd'};
  background: ${({ $active }) => $active ? '#e74c3c' : '#fff'};
  color: ${({ $active }) => $active ? '#fff' : '#666'};
  cursor: pointer;
  transition: all 0.15s ease;
  margin-left: 8px;

  &:hover {
    background: ${({ $active }) => $active ? '#c0392b' : '#f5f5f5'};
  }
`;

const DebugLegend = styled.div<{ $visible: boolean }>`
  display: ${({ $visible }) => $visible ? 'flex' : 'none'};
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
  padding: 10px 16px;
  background: #1a1a2e;
  border-radius: 8px;
  font-size: 12px;
  font-family: monospace;
  color: #ccc;
  flex-wrap: wrap;
`;

const Swatch = styled.span<{ $border: string }>`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 2px;
  vertical-align: middle;
  margin-right: 4px;
  border: ${({ $border }) => $border};
`;

const Presets = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
`;

const PresetsLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-right: 4px;
`;

const PresetButton = styled.button`
  padding: 4px 10px;
  font-size: 11px;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  background: #fff;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  font-family: inherit;
  transition: all 0.12s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background.tertiary};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const EmbedContainer = styled.div`
  background: #fff;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 8px;
  overflow: hidden;
  resize: both;
  position: relative;
  margin-bottom: 8px;
`;

const EmbedIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  display: block;
`;

const SizeLabel = styled.span`
  position: absolute;
  bottom: 4px;
  right: 8px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  pointer-events: none;
  background: rgba(255,255,255,0.85);
  padding: 2px 6px;
  border-radius: 3px;
  font-variant-numeric: tabular-nums;
`;

const Hint = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0 0 32px 0;
`;

const ComparisonTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 4px 0;
  letter-spacing: -0.02em;
`;

const ComparisonSubtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0 0 20px 0;
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
`;

const GridItem = styled.div``;

const GridItemLabel = styled.h4`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 8px 0;
`;

const GridEmbedContainer = styled.div`
  background: #fff;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 8px;
  overflow: hidden;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: 14px;
`;

const CALENDAR_STYLES = [
  { value: 'modern-grid-zoom-fixed', label: 'CSS Zoom Fixed' },
  { value: 'classic', label: 'Classic Calendar' },
  { value: 'collage', label: 'Collage' },
  { value: 'typewriter', label: 'Typewriter' },
];

const CLOCK_STYLES = [
  { value: 'classic', label: 'Clock' },
  { value: 'flower', label: 'Flower' },
  { value: 'dreamy', label: 'Dreamy' },
];

const BOARD_STYLES = [
  { value: 'grid', label: 'Inspiration Board' },
];

const PRESET_SIZES = [
  { w: 150, h: 150, label: '150x150 (tiny)' },
  { w: 200, h: 200, label: '200x200 (min)' },
  { w: 256, h: 300, label: '256x300 (design)' },
  { w: 320, h: 320, label: '320x320 (Notion small)' },
  { w: 420, h: 380, label: '420x380 (default)' },
  { w: 500, h: 400, label: '500x400 (Notion medium)' },
  { w: 700, h: 500, label: '700x500 (Notion wide)' },
  { w: 800, h: 600, label: '800x600 (max)' },
];

const COMPARISON_SIZES = [
  { w: 200, h: 200, label: '200 x 200 (minimum)' },
  { w: 256, h: 300, label: '256 x 300 (design size)' },
  { w: 320, h: 320, label: '320 x 320 (Notion small)' },
  { w: 420, h: 380, label: '420 x 380 (default)' },
  { w: 700, h: 500, label: '700 x 500 (wide)' },
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
  const [displaySize, setDisplaySize] = useState('420 x 380');
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const gridIframesRef = useRef<HTMLIFrameElement[]>([]);

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

  const sendDebugToAll = useCallback((msg: string) => {
    try { iframeRef.current?.contentWindow?.postMessage(msg, '*'); } catch {}
    gridIframesRef.current.forEach(f => {
      try { f?.contentWindow?.postMessage(msg, '*'); } catch {}
    });
  }, []);

  // Send debug state when iframes load or debug changes
  useEffect(() => {
    if (debug) {
      const t = setTimeout(() => sendDebugToAll('debug-on'), 500);
      return () => clearTimeout(t);
    } else {
      sendDebugToAll('debug-off');
    }
  }, [debug, style, sendDebugToAll]);

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
        <EmptyState>Select a widget to check its layout</EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Title>
        Notion Embed Simulator
        <span>{currentStyleLabel}</span>
      </Title>
      <Subtitle>Test how the widget looks inside a Notion-style iframe at different sizes. Drag the bottom-right corner to resize.</Subtitle>

      <Controls>
        <ControlLabel>Width:</ControlLabel>
        <ControlSlider
          type="range"
          min="150"
          max="900"
          value={width}
          onChange={(e) => applySize(parseInt(e.target.value), height)}
        />
        <ControlValue>{width}px</ControlValue>

        <ControlLabel>Height:</ControlLabel>
        <ControlSlider
          type="range"
          min="150"
          max="700"
          value={height}
          onChange={(e) => applySize(width, parseInt(e.target.value))}
        />
        <ControlValue>{height}px</ControlValue>

        <ControlLabel>Style:</ControlLabel>
        <ControlSelect value={style} onChange={(e) => setStyle(e.target.value)}>
          {styles.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </ControlSelect>

        <DebugButton $active={debug} onClick={() => setDebug(!debug)}>
          Debug
        </DebugButton>
      </Controls>

      <DebugLegend $visible={debug}>
        <span><Swatch $border="2px dashed red" /> Wrapper (flex container, 100%x100%)</span>
        <span><Swatch $border="2px solid cyan" /> SVG foreignObject (viewBox scaling)</span>
        <span><Swatch $border="2px solid lime" /> GridContainer (calendar card)</span>
      </DebugLegend>

      <Presets>
        <PresetsLabel>Presets:</PresetsLabel>
        {PRESET_SIZES.map(p => (
          <PresetButton key={p.label} onClick={() => applySize(p.w, p.h)}>
            {p.label}
          </PresetButton>
        ))}
      </Presets>

      <EmbedContainer
        ref={containerRef}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <EmbedIframe ref={iframeRef} src={embedUrl} />
        <SizeLabel>{displaySize}</SizeLabel>
      </EmbedContainer>
      <Hint>Drag the corner to resize freely, or use the sliders / presets above.</Hint>

      <ComparisonTitle>Size Comparison</ComparisonTitle>
      <ComparisonSubtitle>Same widget at common Notion embed sizes.</ComparisonSubtitle>

      <ComparisonGrid>
        {COMPARISON_SIZES.map((size, i) => (
          <GridItem key={size.label}>
            <GridItemLabel>{size.label}</GridItemLabel>
            <GridEmbedContainer style={{ width: `${Math.min(size.w, 680)}px`, height: `${size.h}px` }}>
              <EmbedIframe
                ref={(el) => { if (el) gridIframesRef.current[i] = el; }}
                src={embedUrl}
              />
            </GridEmbedContainer>
          </GridItem>
        ))}
      </ComparisonGrid>
    </Container>
  );
};
