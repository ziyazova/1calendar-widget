import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

/** Default reference size of the widget - used to calculate scale */
const DEFAULT_REF_WIDTH = 420;
const DEFAULT_REF_HEIGHT = 380;
const MIN_SCALE = 0.25;
const MAX_SCALE = 2.0;

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
  refWidth?: number;
  refHeight?: number;
}

/**
 * Wraps embed content and scales it to fit the viewport.
 * Scales both down and up within MIN_SCALE–MAX_SCALE bounds.
 */
export const EmbedScaleWrapper: React.FC<EmbedScaleWrapperProps> = ({
  children,
  refWidth = DEFAULT_REF_WIDTH,
  refHeight = DEFAULT_REF_HEIGHT,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w <= 0 || h <= 0) return;

      const scaleX = (w - 16) / refWidth;
      const scaleY = (h - 16) / refHeight;
      const newScale = Math.min(scaleX, scaleY, MAX_SCALE);
      setScale(Math.max(MIN_SCALE, newScale));
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
  }, [refWidth, refHeight]);

  return (
    <Wrapper ref={containerRef}>
      <ScaledInner $scale={scale}>{children}</ScaledInner>
    </Wrapper>
  );
};
