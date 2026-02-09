import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Logger } from '../../../infrastructure/services/Logger';

/** Default reference width of the widget - used to calculate scale */
const DEFAULT_REF_WIDTH = 420;
const MIN_SCALE = 0.25;
const MAX_SCALE = 2.0;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 8px;
  box-sizing: border-box;
  overflow: hidden;
`;

const ScaledInner = styled.div<{ $scale: number }>`
  transform-origin: top center;
  transform: scale(${({ $scale }) => $scale});
  flex-shrink: 0;
`;

interface EmbedScaleWrapperProps {
  children: React.ReactNode;
  refWidth?: number;
}

/**
 * Wraps embed content and scales it to fit the viewport.
 * Scales both down and up within MIN_SCALE–MAX_SCALE bounds.
 */
export const EmbedScaleWrapper: React.FC<EmbedScaleWrapperProps> = ({
  children,
  refWidth = DEFAULT_REF_WIDTH,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(0);

  Logger.debug('EmbedScaleWrapper', 'Render with ref width', { refWidth });

  useEffect(() => {
    const el = containerRef.current;
    const inner = innerRef.current;
    if (!el || !inner) return;

    Logger.info('EmbedScaleWrapper', 'Mounting scale observer', { refWidth });

    const update = () => {
      const w = el.clientWidth;
      if (w <= 0) return;

      const scaleX = (w - 16) / refWidth;
      const newScale = Math.min(Math.max(MIN_SCALE, scaleX), MAX_SCALE);
      const innerH = inner.scrollHeight;

      Logger.debug('EmbedScaleWrapper', 'Scale calculation', {
        containerWidth: w,
        refWidth,
        contentHeight: innerH,
        scaleX: scaleX.toFixed(3),
        finalScale: newScale.toFixed(3),
      });

      setScale(newScale);
      setContentHeight(innerH);
    };

    const rafId = requestAnimationFrame(update);
    const containerObserver = new ResizeObserver(update);
    const innerObserver = new ResizeObserver(update);
    containerObserver.observe(el);
    innerObserver.observe(inner);

    return () => {
      cancelAnimationFrame(rafId);
      containerObserver.disconnect();
      innerObserver.disconnect();
    };
  }, [refWidth]);

  // CSS transform doesn't affect layout box, so set wrapper height
  // explicitly to match the visual (scaled) height of the content.
  const visualHeight = contentHeight * scale + 16;

  return (
    <Wrapper ref={containerRef} style={{ height: visualHeight > 16 ? `${visualHeight}px` : 'auto' }}>
      <ScaledInner ref={innerRef} $scale={scale}>{children}</ScaledInner>
    </Wrapper>
  );
};
