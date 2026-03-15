import React, { useRef, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';

const MIN_ZOOM = 0.5;

const Wrapper = styled.div<{ $debug?: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden;
  ${({ $debug }) => $debug && `
    outline: 3px dashed red;
    outline-offset: -3px;
  `}
`;

const DebugInfo = styled.div`
  position: fixed;
  top: 4px;
  left: 4px;
  font-size: 10px;
  font-family: monospace;
  background: rgba(0,0,0,0.8);
  color: #0f0;
  padding: 6px 8px;
  border-radius: 4px;
  z-index: 9999;
  line-height: 1.6;
  pointer-events: none;
  white-space: pre;
`;

interface EmbedScaleWrapperProps {
  children: React.ReactNode;
  refWidth?: number;
  refHeight?: number;
}

/**
 * Wraps embed content and shrinks it proportionally when the container
 * is smaller than the widget's design size. Uses CSS zoom so the
 * layout box and visual size stay in sync.
 *
 * ZoomBox shrink-wraps to the widget (display:inline-block) so its
 * outline always matches the widget's outline — no extra space.
 */
export const EmbedScaleWrapper: React.FC<EmbedScaleWrapperProps> = ({
  children,
  refWidth = 280,
  refHeight = 320,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [debugInfo, setDebugInfo] = useState('');
  const [debug, setDebug] = useState(false);

  // Listen for debug toggle from parent (simulator)
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data === 'toggle-debug') setDebug(prev => !prev);
      if (e.data === 'debug-on') setDebug(true);
      if (e.data === 'debug-off') setDebug(false);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const update = useCallback(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;

    const availW = wrapper.clientWidth;
    const availH = wrapper.clientHeight;
    if (availW <= 0 || availH <= 0) return;

    // Get the widget's natural (unzoomed) dimensions
    const currentZoom = parseFloat(inner.style.zoom) || 1;
    const naturalW = inner.offsetWidth / currentZoom;
    const naturalH = inner.offsetHeight / currentZoom;
    const contentW = naturalW > 0 ? naturalW : refWidth;
    const contentH = naturalH > 0 ? naturalH : refHeight;

    const zoomX = availW < contentW ? availW / contentW : 1;
    const zoomY = availH < contentH ? availH / contentH : 1;
    const newZoom = Math.max(MIN_ZOOM, Math.min(zoomX, zoomY));

    setZoom(newZoom);

    // Tell the parent frame the widget's minimum embed size
    const minW = Math.ceil(contentW * MIN_ZOOM);
    const minH = Math.ceil(contentH * MIN_ZOOM);
    window.parent.postMessage({
      type: 'embed-min-size',
      minWidth: minW,
      minHeight: minH,
    }, '*');

    // Set min dimensions on the document so the iframe itself
    // can't be smaller than the widget at MIN_ZOOM.
    // Notion/browsers respect iframe content intrinsic size.
    document.documentElement.style.minWidth = minW + 'px';
    document.documentElement.style.minHeight = minH + 'px';

    setDebugInfo(
      `Wrapper:    ${availW} × ${availH}\n` +
      `ZoomBox:    ${inner.offsetWidth} × ${inner.offsetHeight}\n` +
      `Natural:    ${Math.round(contentW)} × ${Math.round(contentH)}\n` +
      `ZoomX:      ${zoomX.toFixed(3)}\n` +
      `ZoomY:      ${zoomY.toFixed(3)}\n` +
      `Zoom:       ${newZoom.toFixed(3)}\n` +
      `Visual:     ${Math.round(contentW * newZoom)} × ${Math.round(contentH * newZoom)}`
    );
  }, [refWidth, refHeight]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [update]);

  return (
    <Wrapper ref={wrapperRef} $debug={debug}>
      {debug && <DebugInfo>{debugInfo}</DebugInfo>}
      <div
        ref={innerRef}
        style={{
          zoom,
          display: 'inline-block',
          boxSizing: 'border-box',
          outline: debug ? '2px solid cyan' : 'none',
        }}
      >
        {children}
      </div>
    </Wrapper>
  );
};
