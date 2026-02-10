import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Logger } from '../../../infrastructure/services/Logger';

/** Default reference width — widget renders at this width, then gets scaled */
const DEFAULT_REF_WIDTH = 420;
const MIN_SCALE = 0.25;
const MAX_SCALE = 2.0;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden;
`;

const ScaledInner = styled.div`
  transform-origin: top center;
  flex-shrink: 0;
`;

interface EmbedScaleWrapperProps {
  children: React.ReactNode;
  refWidth?: number;
}

/**
 * Wraps embed content and scales it to fit the container width.
 * Compensates height via negative margin so iframe borders match widget borders.
 */
export const EmbedScaleWrapper: React.FC<EmbedScaleWrapperProps> = ({
  children,
  refWidth = DEFAULT_REF_WIDTH,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [marginBottom, setMarginBottom] = useState(0);

  Logger.debug('EmbedScaleWrapper', 'Render with ref width', { refWidth });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => {
      const w = container.clientWidth;
      if (w <= 0) return;

      const newScale = Math.max(MIN_SCALE, Math.min(w / refWidth, MAX_SCALE));
      setScale(newScale);

      // Measure inner element and compensate margin after render
      requestAnimationFrame(() => {
        const inner = innerRef.current;
        if (!inner) return;
        const naturalHeight = inner.offsetHeight;
        const compensation = -(naturalHeight * (1 - newScale));

        Logger.debug('EmbedScaleWrapper', 'Scale calculation', {
          containerWidth: w,
          refWidth,
          scale: newScale.toFixed(3),
          naturalHeight,
          marginBottom: compensation.toFixed(1),
        });

        setMarginBottom(compensation);
      });
    };

    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    requestAnimationFrame(updateScale);

    return () => observer.disconnect();
  }, [refWidth]);

  return (
    <Wrapper ref={containerRef}>
      <ScaledInner
        ref={innerRef}
        style={{
          width: `${refWidth}px`,
          transform: `scale(${scale})`,
          marginBottom: `${marginBottom}px`,
        }}
      >
        {children}
      </ScaledInner>
    </Wrapper>
  );
};
