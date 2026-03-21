import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { PrimaryButton, SecondaryButton } from '../shared/Button';

/* ── Rotating text ── */
const RotatingLine = styled.span<{ $width: number }>`
  display: inline-block;
  vertical-align: bottom;
  position: relative;
  width: ${({ $width }) => $width}px;
  transition: width 0.35s cubic-bezier(0.22, 1, 0.36, 1);
`;

const RotatingWordWrap = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 100%;
`;

const MorphBlob = styled.span<{ $bg: string; $radius: string }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 1.1em;
  left: -0.25em;
  right: -0.25em;
  background-color: ${({ $bg }) => $bg};
  border-radius: ${({ $radius }) => $radius};
  transition: background-color 0.35s cubic-bezier(0.22, 1, 0.36, 1),
              border-radius 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: -1;
`;

const RotatingText = styled.span<{ $state: 'in' | 'out' | 'idle'; $color: string }>`
  display: inline-flex;
  align-items: center;
  color: ${({ $color }) => $color};
  position: relative;
  z-index: 1;
  transition: opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
              filter 0.35s cubic-bezier(0.22, 1, 0.36, 1),
              color 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  opacity: ${({ $state }) => $state === 'out' ? 0 : 1};
  transform: ${({ $state }) => $state === 'out' ? 'scale(0.92)' : 'scale(1)'};
  filter: ${({ $state }) => $state === 'out' ? 'blur(2px)' : 'blur(0)'};
  white-space: nowrap;
`;

/* Hidden span to measure text width */
const MeasureSpan = styled.span`
  position: absolute;
  visibility: hidden;
  white-space: nowrap;
  pointer-events: none;
`;

const ROTATING_WORDS = [
  { text: 'better', bg: 'rgba(99, 102, 241, 0.1)', color: '#6366F1', radius: '14px' },
  { text: 'smarter', bg: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', radius: '50px' },
  { text: 'faster', bg: 'rgba(16, 185, 129, 0.1)', color: '#10B981', radius: '8px' },
  { text: 'easier', bg: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', radius: '50px' },
];

const useRotatingWord = () => {
  const [index, setIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(0);
  const [state, setState] = useState<'in' | 'out' | 'idle'>('idle');

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (index + 1) % ROTATING_WORDS.length;
      setNextIndex(next);
      setState('out');
      setTimeout(() => {
        setIndex(next);
        setState('in');
      }, 250);
    }, 2000);
    return () => clearInterval(interval);
  }, [index]);

  return { word: ROTATING_WORDS[index], nextWord: ROTATING_WORDS[nextIndex], state };
};

/* ── Hero ── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Hero = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 48px 88px;
  text-align: center;
  animation: ${fadeUp} 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (max-width: 768px) {
    padding: 60px 24px 80px;
  }
`;

const Title = styled.h1`
  font-size: 64px;
  font-weight: 600;
  color: #1F1F1F;
  line-height: 1.2;
  letter-spacing: -0.035em;
  margin: 0 0 24px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 1024px) {
    font-size: 52px;
  }

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 18px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.tertiary};
  line-height: 1.6;
  margin: 0 auto 40px;
  max-width: 480px;
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 32px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
  }
`;


interface HeroSectionProps {
  onBrowseTemplates: () => void;
  onExploreWidgets: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onBrowseTemplates, onExploreWidgets }) => {
  const { word: rotatingWord, nextWord, state: wordState } = useRotatingWord();
  const measureRef = useRef<HTMLSpanElement>(null);
  const [textWidth, setTextWidth] = useState(0);

  // Measure width: when 'out' — measure next word, when 'in' — measure current
  useEffect(() => {
    if (measureRef.current) {
      setTextWidth(measureRef.current.offsetWidth);
    }
  }, [rotatingWord.text, nextWord.text, wordState]);

  // The blob should morph to the NEXT shape/color as soon as 'out' starts
  const blobWord = wordState === 'out' ? nextWord : rotatingWord;
  const measureText = wordState === 'out' ? nextWord.text : rotatingWord.text;

  return (
    <Hero data-ux="Hero">
      <Title data-ux="Hero Title">
        Make Notion work<br />
        <RotatingLine $width={textWidth}>
          <MeasureSpan ref={measureRef}>{measureText}</MeasureSpan>
          <RotatingWordWrap>
            <MorphBlob $bg={blobWord.bg} $radius={blobWord.radius} />
            <RotatingText $state={wordState} $color={rotatingWord.color}>
              {rotatingWord.text}
            </RotatingText>
          </RotatingWordWrap>
        </RotatingLine>{'\u00A0\u00A0'}for you.
      </Title>
      <HeroSubtitle data-ux="Hero Subtitle">
        Templates and widgets that turn it into a clear, structured system
        for life, work, business, and study.
      </HeroSubtitle>
      <ButtonRow>
        <PrimaryButton onClick={onBrowseTemplates}>
          Browse Templates
        </PrimaryButton>
        <SecondaryButton onClick={onExploreWidgets}>Explore Widgets</SecondaryButton>
      </ButtonRow>
    </Hero>
  );
};
