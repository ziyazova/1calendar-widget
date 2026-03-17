import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ClockSettings } from '../../../../../domain/value-objects/ClockSettings';

interface FlowerClockProps {
  settings: ClockSettings;
  time: Date;
  textColor: string;
}

const OuterWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: visible;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ZoomWrapper = styled.div<{ $zoom: number; $designSize: number; $aspectRatio: number }>`
  width: ${({ $designSize }) => $designSize}px;
  height: ${({ $designSize, $aspectRatio }) => $designSize / $aspectRatio}px;
  zoom: ${({ $zoom }) => $zoom};
`;

const FRAME_CONFIG = {
  flower: {
    image: '/flower-clock-green.png',
    aspectRatio: 1698 / 1614,
    designSize: 300,
    faceSize: '74%',
    faceOffsetX: 0,
    faceOffsetY: 11,
  },
  alarm: {
    image: '/alarm-clock-frame.png',
    aspectRatio: 1215 / 1650,
    designSize: 206,
    faceSize: '62%',
    faceOffsetX: 2,
    faceOffsetY: 28,
  },
} as const;

type FrameType = keyof typeof FRAME_CONFIG;

const SceneWrapper = styled.div<{ $frame: FrameType; $designSize: number }>`
  position: relative;
  width: ${({ $designSize }) => $designSize}px;
  margin-top: ${({ $frame }) => $frame === 'alarm' ? '-40px' : '0px'};
  aspect-ratio: ${({ $frame }) => FRAME_CONFIG[$frame].aspectRatio};
  background-image: url('${({ $frame }) => FRAME_CONFIG[$frame].image}');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

/* Clock face overlay — positioned at center of the frame */
const ClockFace = styled.div<{ $faceSize: string; $offsetX: number; $offsetY: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${({ $faceSize }) => $faceSize};
  height: ${({ $faceSize }) => $faceSize};
  transform: translate(calc(-50% + ${({ $offsetX }) => $offsetX}px), calc(-50% + ${({ $offsetY }) => $offsetY}px));
`;

/* Hour numbers */
const HourNumber = styled.div<{ $angle: number; $textColor: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  font-family: 'Poiret One', cursive;
  font-size: 18px;
  font-weight: 700;
  color: ${({ $textColor }) => $textColor};
  transform: translate(-50%, -50%)
    rotate(${({ $angle }) => $angle}deg)
    translateY(-62px)
    rotate(${({ $angle }) => -$angle}deg);
`;

/* Hour tick marks */
const TickMark = styled.div<{ $angle: number; $isHour: boolean; $primaryColor: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${({ $isHour }) => $isHour ? '2px' : '1px'};
  height: ${({ $isHour }) => $isHour ? '8px' : '4px'};
  background: ${({ $primaryColor }) => `${$primaryColor}40`};
  border-radius: 1px;
  transform-origin: 50% 0%;
  transform: translate(-50%, 0) rotate(${({ $angle }) => $angle}deg) translateY(-88px);
`;

/* Clock hands */
const Hand = styled.div<{
  $length: number;
  $width: number;
  $rotation: number;
  $color: string;
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${({ $width }) => $width}px;
  height: ${({ $length }) => $length}px;
  background: ${({ $color }) => $color};
  border-radius: ${({ $width }) => $width}px;
  transform: translate(-50%, -100%) rotate(${({ $rotation }) => $rotation}deg);
  transform-origin: 50% 100%;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
`;

/* Center dot */
const CenterDot = styled.div<{ $color: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: ${({ $color }) => $color};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
`;


const HOUR_NUMBERS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export const FlowerClock: React.FC<FlowerClockProps> = ({ settings, time, textColor }) => {
  const [zoom, setZoom] = useState(1);
  const outerRef = useRef<HTMLDivElement>(null);
  const frame = settings.clockFrame || 'flower';
  const frameConfig = FRAME_CONFIG[frame];

  const isEmbed = window.location.pathname.includes('/embed/');

  useEffect(() => {
    if (!outerRef.current) return;
    const maxZoom = isEmbed ? 2.0 : 1.0;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const parentWidth = entry.contentRect.width;
        setZoom(Math.min(maxZoom, Math.max(0.25, parentWidth / frameConfig.designSize)));
      }
    });
    ro.observe(outerRef.current);
    return () => ro.disconnect();
  }, [isEmbed]);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();


  // Track cumulative rotation to avoid snap-back at 59→0
  const totalRotationsRef = useRef(0);
  const prevSecondRef = useRef(seconds);

  if (seconds !== prevSecondRef.current) {
    if (prevSecondRef.current === 59 && seconds === 0) {
      totalRotationsRef.current += 1;
    }
    prevSecondRef.current = seconds;
  }

  const hourRotation = (hours * 30) + (minutes * 0.5);
  const minuteRotation = minutes * 6;
  const secondRotation = seconds * 6 + totalRotationsRef.current * 360;

  return (
    <OuterWrapper ref={outerRef}>
      <ZoomWrapper $zoom={zoom} $designSize={frameConfig.designSize} $aspectRatio={frameConfig.aspectRatio}>
        <SceneWrapper $frame={frame} $designSize={frameConfig.designSize}>
          <ClockFace $faceSize={frameConfig.faceSize} $offsetX={frameConfig.faceOffsetX} $offsetY={frameConfig.faceOffsetY}>
            {/* Hour numbers */}
            {HOUR_NUMBERS.map((num, i) => (
              <HourNumber
                key={num}
                $angle={i * 30}
                $textColor={textColor}
              >
                {num}
              </HourNumber>
            ))}

            {/* Hour hand */}
            <Hand
              $length={40}
              $width={5}
              $rotation={hourRotation}
              $color={`${textColor}90`}
            />

            {/* Minute hand */}
            <Hand
              $length={58}
              $width={3}
              $rotation={minuteRotation}
              $color={`${textColor}90`}
            />

            {/* Second hand */}
            {settings.showSeconds && (
              <Hand
                $length={62}
                $width={1}
                $rotation={secondRotation}
                $color={settings.primaryColor}
              />
            )}

            {/* Center */}
            <CenterDot $color={settings.primaryColor} />
          </ClockFace>
        </SceneWrapper>
      </ZoomWrapper>
    </OuterWrapper>
  );
};
