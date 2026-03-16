import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { BoardSettings } from '../../../../../domain/value-objects/BoardSettings';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface InspirationBoardProps {
  settings: BoardSettings;
}

// The whole camera scales as one unit from the container height
const CameraFrame = styled.div`
  position: relative;
  height: calc(100% - 26px);
  aspect-ratio: 736 / 1308;
  margin: 0 auto;
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

// Screen area — all % relative to CameraFrame, scales together
const ScreenArea = styled.div`
  position: absolute;
  top: 3%;
  left: 5.5%;
  width: 68%;
  height: 49.5%;
  border-radius: 2.8% / 1.8%;
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
  display: flex;
  justify-content: center;
  gap: 4px;
  padding: 4px 0;
  background: rgba(255, 255, 255, 0.6);
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
  const { imageUrls, primaryColor } = settings;

  useEffect(() => {
    setCurrentSlide(0);
  }, [imageUrls.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % imageUrls.length);
  }, [imageUrls.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + imageUrls.length) % imageUrls.length);
  }, [imageUrls.length]);

  return (
    <CameraFrame>
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
            </SlideshowContainer>
            {imageUrls.length > 1 && (
              <DotIndicators>
                {imageUrls.map((_, i) => (
                  <Dot key={i} $active={i === currentSlide} $color={primaryColor} />
                ))}
              </DotIndicators>
            )}
          </>
        )}
      </ScreenArea>
    </CameraFrame>
  );
};
