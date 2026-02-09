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
  align-items: flex-start;
  padding: 8px;
  box-sizing: border-box;
`;

const ScaledInner = styled.div<{ $scale: number; $width: number }>`
  width: ${({ $width }) => $width}px;
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
 *
 * CSS transform doesn't affect layout box, so we use a negative
 * margin-bottom on ScaledInner to shrink its layout box to match
 * the visual (scaled) height. This avoids setting explicit height
 * on the Wrapper which could create a feedback loop with ResizeObserver.
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
      // offsetHeight is the unscaled layout height — not affected by transform
      const innerH = inner.offsetHeight;

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
    // Only observe the container (for width changes).
    // Do NOT observe inner — that creates a feedback loop.
    const observer = new ResizeObserver(update);
    observer.observe(el);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [refWidth]);

  // Compensate for CSS transform not affecting layout box.
  // The layout box is contentHeight (unscaled). The visual height is
  // contentHeight * scale. The difference is contentHeight * (1 - scale).
  // A negative margin-bottom shrinks the layout box to match the visual.
  const marginCompensation = contentHeight > 0 ? contentHeight * (1 - scale) : 0;

  return (
    <Wrapper ref={containerRef}>
      <ScaledInner
        ref={innerRef}
        $scale={scale}
        $width={refWidth}
        style={{ marginBottom: `-${marginCompensation}px` }}
      >
        {children}
      </ScaledInner>
    </Wrapper>
  );
};
