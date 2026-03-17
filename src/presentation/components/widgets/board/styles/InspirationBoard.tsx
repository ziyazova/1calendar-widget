import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { BoardSettings } from '../../../../../domain/value-objects/BoardSettings';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface InspirationBoardProps {
  settings: BoardSettings;
}

// Design size of the camera frame
const DESIGN_WIDTH = 340;
const DESIGN_HEIGHT = 604;

// Outer wrapper fills the container, measures it, and scales content
const ScaleWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

// Fixed design-size container, scaled via transform
const CameraFrame = styled.div<{ $scale: number }>`
  position: relative;
  width: ${DESIGN_WIDTH}px;
  height: ${DESIGN_HEIGHT}px;
  flex-shrink: 0;
  transform: scale(${({ $scale }) => $scale});
  transform-origin: center center;
`;

const FrameImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  display: block;
  pointer-events: none;
  user-select: none;
`;

const ScreenArea = styled.div`
  position: absolute;
  top: calc(3% - 1px);
  left: 5.5%;
  width: calc(74% - 2.5px);
  height: calc(53% + 1px);
  border-radius: 16.8px;
  outline: 1px solid rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const SlideshowContainer = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SlideshowImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: ${fadeIn} 0.4s ease;
`;

const SlideButton = styled.button<{ $side: 'left' | 'right' }>`
  position: absolute;
  ${({ $side }) => $side}: 4px;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 1;
  }

  svg {
    width: 12px;
    height: 12px;
    color: #333;
  }
`;

const EmptyScreen = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bbb;
  font-size: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  text-align: center;
  padding: 12px;
  background: #f5f5f5;
`;

const DotIndicators = styled.div`
  position: absolute;
  bottom: 6px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 4px;
  pointer-events: none;
`;

const Dot = styled.div<{ $active: boolean; $color: string }>`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${({ $active, $color }) => $active ? $color : '#d1d1d6'};
  transition: background 0.2s ease;
`;

export const InspirationBoard: React.FC<InspirationBoardProps> = ({ settings }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scale, setScale] = useState(1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { imageUrls, primaryColor, backgroundColor } = settings;

  useEffect(() => {
    setCurrentSlide(0);
  }, [imageUrls.length]);

  // Measure container and compute scale
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const measure = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const scaleX = w / DESIGN_WIDTH;
      const scaleY = h / DESIGN_HEIGHT;
      setScale(Math.min(scaleX, scaleY, 1));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % imageUrls.length);
  }, [imageUrls.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + imageUrls.length) % imageUrls.length);
  }, [imageUrls.length]);

  return (
    <ScaleWrapper ref={wrapperRef}>
      <CameraFrame $scale={scale}>
        <FrameImage src="/camera-frame.png" alt="" />
        <ScreenArea>
          {imageUrls.length === 0 ? (
            <EmptyScreen>Add image URLs to create your inspiration board</EmptyScreen>
          ) : (
            <>
              <SlideshowContainer>
                <SlideshowImage
                  key={currentSlide}
                  src={imageUrls[currentSlide]}
                  alt=""
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                {imageUrls.length > 1 && (
                  <>
                    <SlideButton $side="left" onClick={prevSlide}>
                      <ChevronLeft />
                    </SlideButton>
                    <SlideButton $side="right" onClick={nextSlide}>
                      <ChevronRight />
                    </SlideButton>
                  </>
                )}
                {imageUrls.length > 1 && (
                  <DotIndicators>
                    {imageUrls.map((_, i) => (
                      <Dot key={i} $active={i === currentSlide} $color={primaryColor} />
                    ))}
                  </DotIndicators>
                )}
              </SlideshowContainer>
            </>
          )}
        </ScreenArea>
      </CameraFrame>
    </ScaleWrapper>
  );
};
