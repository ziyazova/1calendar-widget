import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

/** Reference size of the widget - used to calculate scale */
const WIDGET_REF_WIDTH = 420;
const WIDGET_REF_HEIGHT = 380;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  box-sizing: border-box;
  overflow: auto;
`;

const ScaledInner = styled.div<{ $scale: number }>`
  transform-origin: center center;
  transform: scale(${({ $scale }) => $scale});
  flex-shrink: 0;
`;

interface EmbedScaleWrapperProps {
  children: React.ReactNode;
}

/**
 * Wraps embed content and scales it to fit the viewport.
 * Prevents widgets from being cut off in small iframes (e.g. Notion).
 */
export const EmbedScaleWrapper: React.FC<EmbedScaleWrapperProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w <= 0 || h <= 0) return;

      const scaleX = (w - 16) / WIDGET_REF_WIDTH;
      const scaleY = (h - 16) / WIDGET_REF_HEIGHT;
      const newScale = Math.min(scaleX, scaleY, 1);
      setScale(Math.max(0.25, newScale));
    };

    const rafId = requestAnimationFrame(updateScale);
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    window.addEventListener('resize', updateScale);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  return (
    <Wrapper ref={containerRef}>
      <ScaledInner $scale={scale}>{children}</ScaledInner>
    </Wrapper>
  );
};
