import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

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

interface EmbedScaleWrapperProps {
  children: React.ReactNode;
  refWidth?: number;
  refHeight?: number;
}

/**
 * SVG viewBox-based scaling — same technique as github-widgetbox.
 *
 * The widget renders at its natural design size inside an SVG foreignObject.
 * The SVG viewBox + preserveAspectRatio handles all proportional scaling:
 * - Container wider than widget → widget stays at design size, centered
 * - Container smaller → widget shrinks proportionally, nothing clipped
 *
 * No JS zoom, no ResizeObserver, no postMessage. Pure SVG scaling.
 */
export const EmbedScaleWrapper: React.FC<EmbedScaleWrapperProps> = ({
  children,
  refWidth = 280,
  refHeight = 320,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(refHeight);
  const [debug, setDebug] = useState(false);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data === 'toggle-debug') setDebug(prev => !prev);
      if (e.data === 'debug-on') setDebug(true);
      if (e.data === 'debug-off') setDebug(false);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Measure actual content height once rendered
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const measure = () => {
      const h = el.scrollHeight;
      if (h > 0) setContentHeight(h);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Wrapper $debug={debug}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${refWidth} ${contentHeight}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ maxHeight: contentHeight }}
      >
        <foreignObject width={refWidth} height={contentHeight}>
          <div
            ref={contentRef}
            style={{
              width: refWidth,
              boxSizing: 'border-box',
              outline: debug ? '2px solid cyan' : 'none',
            }}
          >
            {children}
          </div>
        </foreignObject>
      </svg>
    </Wrapper>
  );
};
