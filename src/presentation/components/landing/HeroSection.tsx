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
  top: 54%;
  transform: translateY(-50%);
  height: 1.02em;
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
  background: ${({ $color }) => $color.includes('gradient') ? $color : 'none'};
  -webkit-background-clip: ${({ $color }) => $color.includes('gradient') ? 'text' : 'unset'};
  -webkit-text-fill-color: ${({ $color }) => $color.includes('gradient') ? 'transparent' : 'unset'};
  color: ${({ $color }) => $color.includes('gradient') ? 'transparent' : $color};
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
  { text: 'beautiful', bg: 'rgba(99, 102, 241, 0.1)', color: '#6366F1', radius: '14px' },
  { text: 'complete', bg: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', radius: '50px' },
  { text: 'easy', bg: 'rgba(16, 185, 129, 0.1)', color: '#10B981', radius: '8px' },
  { text: 'yours', bg: 'rgba(245, 158, 11, 0.1)', color: 'linear-gradient(90deg, #F5C76A, #EFAF3A)', radius: '50px' },
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
  padding: 0 48px;
  text-align: center;
  animation: ${fadeUp} 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (max-width: 768px) {
    padding: 0 24px;
  }
`;

const SocialBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 5px 14px 5px 5px;
  background: rgba(255, 255, 255, 0.44);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 999px;
  margin: -40px auto 40px;

  @media (max-width: 768px) {
    margin-top: -16px;
  }
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.45),
    0 1px 2px rgba(20, 20, 40, 0.03),
    0 4px 12px -4px rgba(20, 20, 40, 0.05);

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const AvatarStack = styled.div`
  display: inline-flex;
  align-items: center;
`;

const Avatar = styled.div<{ $bg: string; $i: number }>`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${({ $bg }) => $bg};
  border: 1.5px solid #fff;
  margin-left: ${({ $i }) => ($i === 0 ? '0' : '-7px')};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  line-height: 1;
  z-index: ${({ $i }) => 10 - $i};
`;

const BadgeDivider = styled.span`
  width: 1px;
  height: 12px;
  background: rgba(0, 0, 0, 0.1);
`;

const BadgeStars = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 1px;
  color: #8B7FD6;
  font-size: 11px;
  line-height: 1;
  letter-spacing: 0.5px;
`;

const BadgeText = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  letter-spacing: -0.005em;
  white-space: nowrap;

  strong {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: 600;
  }
`;

const Title = styled.h1`
  font-size: 56px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.2;
  letter-spacing: -0.03em;
  margin: 0 auto 24px;
  max-width: 760px;

  @media (max-width: 1024px) {
    font-size: 56px;
  }

  @media (max-width: 768px) {
    font-size: 40px;
    line-height: 1.2;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.tertiary};
  line-height: 1.65;
  margin: 0 auto 32px;
  max-width: 540px;
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 24px;
  }
`;

const HeroPrimary = styled(PrimaryButton)`
  height: 48px;
  border-radius: 16px;
  background: #1A1A1E;
  padding: 0 26px;
  font-size: 14px;
  font-weight: 500;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.12) inset,
    0 1px 2px rgba(20, 20, 40, 0.08),
    0 8px 24px -10px rgba(20, 20, 40, 0.28);
  transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    background: #2A2A30;
    transform: translateY(-1px);
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.14) inset,
      0 2px 4px rgba(20, 20, 40, 0.1),
      0 12px 32px -10px rgba(20, 20, 40, 0.32);
  }
`;

const TrustRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  margin-top: 32px;
  font-size: 13px;
  color: rgba(60, 60, 75, 0.38);
  letter-spacing: -0.005em;

  @media (max-width: 540px) {
    flex-wrap: wrap;
    gap: 10px 16px;
    font-size: 12px;
  }
`;

const TrustItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
`;

const TrustDot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.35;
  flex-shrink: 0;
`;

const GhostButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0 26px;
  background: #ffffff;
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid rgba(0, 0, 0, 0.14);
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  line-height: 1;
  cursor: pointer;
  letter-spacing: -0.01em;
  transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    border-color: rgba(0, 0, 0, 0.32);
    background: rgba(0, 0, 0, 0.02);
    transform: translateY(-1px);
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 8px;

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
      <SocialBadge data-ux="Hero Social Proof">
        <AvatarStack>
          <Avatar $bg="linear-gradient(135deg, #FFD6E0, #FFB0C4)" $i={0} />
          <Avatar $bg="linear-gradient(135deg, #DDD4FF, #B8A9FF)" $i={1} />
          <Avatar $bg="linear-gradient(135deg, #CFEFE0, #A8E0C4)" $i={2} />
        </AvatarStack>
        <BadgeStars aria-hidden>★★★★★</BadgeStars>
        <BadgeDivider aria-hidden />
        <BadgeText>
          Loved by <strong>11,000+</strong> people
        </BadgeText>
      </SocialBadge>
      <Title data-ux="Hero Title">
        Notion that finally<br />
        feels{'\u00A0\u00A0'}
        <RotatingLine $width={textWidth}>
          <MeasureSpan ref={measureRef}>{measureText}</MeasureSpan>
          <RotatingWordWrap>
            <MorphBlob $bg={blobWord.bg} $radius={blobWord.radius} />
            <RotatingText $state={wordState} $color={rotatingWord.color}>
              {rotatingWord.text}
            </RotatingText>
          </RotatingWordWrap>
        </RotatingLine>
      </Title>
      <HeroSubtitle data-ux="Hero Subtitle">
        Templates and widgets designed to make your Notion
        feel calm, clear, and a little more yours.
      </HeroSubtitle>
      <ButtonRow>
        <HeroPrimary onClick={onBrowseTemplates}>
          Browse Templates
        </HeroPrimary>
        <GhostButton onClick={onExploreWidgets}>Start for free</GhostButton>
      </ButtonRow>
      <TrustRow data-ux="Hero Trust Row">
        <TrustItem>Works instantly in Notion</TrustItem>
        <TrustDot aria-hidden />
        <TrustItem>No sign-up required</TrustItem>
        <TrustDot aria-hidden />
        <TrustItem>Easy to customize</TrustItem>
      </TrustRow>
    </Hero>
  );
};
