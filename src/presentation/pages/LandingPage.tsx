import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { ArrowRight, Calendar, Clock, Image, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div<{ $transitioning?: boolean }>`
  background: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow-x: hidden;
`;

const PageContent = styled.div<{ $transitioning?: boolean }>`
  opacity: ${({ $transitioning }) => $transitioning ? 0 : 1};
  transition: opacity 0.4s ease;
`;

/* Nav is now TopNav component */

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
const Hero = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 48px 120px;
  text-align: center;
  animation: ${fadeUp} 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (max-width: 768px) {
    padding: 60px 24px 80px;
  }
`;

const Badge = styled.span`
  display: inline-block;
  padding: 6px 16px;
  background: rgba(51, 132, 244, 0.06);
  color: #3384F4;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.02em;
  margin-bottom: 28px;
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

  @media (max-width: 768px) {
    font-size: 40px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 18px;
  font-weight: 400;
  color: #9A9A9A;
  line-height: 1.6;
  margin: 0 auto 40px;
  max-width: 480px;
  letter-spacing: -0.01em;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 24px;
  background: #1F1F1F;
  color: #ffffff;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.01em;
  transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    background: #3384F4;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(51, 132, 244, 0.2);
  }

  svg { width: 16px; height: 16px; }
`;

const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  height: 48px;
  padding: 0 24px;
  background: #F5F5F5;
  color: #1F1F1F;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.01em;
  transition: all 0.2s ease;

  &:hover {
    background: #EBEBEB;
    transform: translateY(-2px);
  }
`;

/* ── Templates Gallery (horizontal marquee) ── */
const scrollLeft = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const TemplatesGallery = styled.section`
  padding: 0 0 80px;
  margin-top: -32px;
  background: #ffffff;
`;

const TemplatesMarqueeWrap = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);

  @media (max-width: 768px) {
    padding: 0 24px;
  }
`;

const TemplatesGalleryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto 24px;
  padding: 0 48px;

  @media (max-width: 768px) {
    padding: 0 24px;
  }
`;

const TemplatesGalleryTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1F1F1F;
  letter-spacing: -0.02em;
`;

const TemplatesGalleryLink = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #9A9A9A;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #1F1F1F;
  }
`;

const TemplateMarqueeTrack = styled.div<{ $duration: number; $reverse?: boolean }>`
  display: flex;
  gap: 28px;
  padding: 10px 0;
  width: max-content;
  animation: ${scrollLeft} ${({ $duration }) => $duration}s linear infinite;
  animation-direction: ${({ $reverse }) => $reverse ? 'reverse' : 'normal'};
  margin-bottom: 16px;

  &:hover {
    animation-play-state: paused;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const TemplateCardWrap = styled.div`
  flex-shrink: 0;
  cursor: pointer;
`;

const TemplateCard = styled.div`
  width: 275px;
  height: 207px;
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);

  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);

  ${TemplateCardWrap}:hover & img {
    transform: scale(1.18);
  }
`;

const TemplateCardPreview = styled.div<{ $gradient: string }>`
  height: 160px;
  background: ${({ $gradient }) => $gradient};
  position: relative;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const PreviewLine = styled.div<{ $width?: string; $dark?: boolean }>`
  height: 6px;
  border-radius: 3px;
  width: ${({ $width }) => $width || '100%'};
  background: ${({ $dark }) => $dark ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.04)'};
`;

const PreviewBlock = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
`;

const PreviewSquare = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background: rgba(0,0,0,0.04);
`;

const TemplateCardMeta = styled.div`
  padding: 10px 4px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TemplateCardTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  letter-spacing: -0.01em;
`;

const TemplateCardPrice = styled.span<{ $free?: boolean }>`
  font-size: 13px;
  font-weight: 500;
  color: ${({ $free }) => $free ? '#22C55E' : '#9A9A9A'};
`;

const TemplateCardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 15%;
  position: absolute;
  top: 0;
  left: 0;
  transform: scale(1.08);
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
`;

const TemplateCardOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 28px 14px 10px;
  background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 100%);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  mask-image: linear-gradient(to bottom, transparent 0%, black 50%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 50%);
  display: flex;
  flex-direction: column;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${TemplateCard}:hover & {
    opacity: 1;
  }
`;

const TemplateCardTags = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: auto;
`;

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  Education: { bg: 'rgba(99, 102, 241, 0.07)', color: '#8B8FC7' },
  Productivity: { bg: 'rgba(245, 158, 11, 0.07)', color: '#C4A46A' },
  Personal: { bg: 'rgba(236, 72, 153, 0.07)', color: '#C48DA5' },
  Premium: { bg: 'rgba(139, 92, 246, 0.07)', color: '#9B8BBF' },
  Work: { bg: 'rgba(59, 130, 246, 0.07)', color: '#8AABC7' },
  Finance: { bg: 'rgba(16, 185, 129, 0.07)', color: '#7BB5A0' },
  Free: { bg: 'rgba(34, 197, 94, 0.07)', color: '#7BB58E' },
  Popular: { bg: 'rgba(245, 158, 11, 0.07)', color: '#C4A46A' },
};

const TemplateCardTag = styled.span<{ $bg?: string; $color?: string }>`
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 5px;
  background: ${({ $bg }) => $bg || 'rgba(0, 0, 0, 0.05)'};
  color: ${({ $color }) => $color || '#888'};
`;

const TEMPLATE_ROW_1 = [
  { image: '/template-main.png', title: 'Student Planner', price: '$3.99', tag: 'Education' },
  { image: '/template-main.png', title: 'Habit Tracker', price: 'Free', tag: 'Productivity' },
  { image: '/template-main.png', title: 'Weekly Planner', price: 'Free', tag: 'Productivity' },
  { image: '/template-main.png', title: 'Journal', price: 'Free', tag: 'Personal' },
];

const TEMPLATE_ROW_2 = [
  { image: '/template-assignments.png', title: 'Life OS', tags: ['Premium', '$7.99'] },
  { image: '/template-main.png', title: 'Project Roadmap', tags: ['Work', '$1.99'] },
  { image: '/template-assignments.png', title: 'Book Tracker', tags: ['Personal', '$2.99'] },
  { image: '/template-main.png', title: 'Budget Tracker', tags: ['Finance', 'Free'] },
];

const TrustLine = styled.p`
  font-size: 13px;
  font-weight: 400;
  color: #ABABAB;
  letter-spacing: -0.01em;
  margin: 24px 0 0;
`;

/* ── Widgets Section ── */
const WidgetsSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px 80px;

  @media (max-width: 768px) {
    padding: 0 24px 60px;
  }
`;

const WidgetGrid = styled.div`
  display: flex;
  gap: 20px;
`;

const WidgetCardWrap = styled.div`
  cursor: pointer;
  flex: 1;
`;

const WidgetCardBox = styled.div`
  width: 100%;
  height: 207px;
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);

  ${WidgetCardWrap}:hover & img {
    transform: scale(1.15);
  }
`;

const WidgetCardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  position: absolute;
  top: 0;
  left: 0;
  transform: scale(1.05);
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
`;

const WIDGET_DATA = [
  { image: '/widget-calendar.png', title: 'Calendar' },
  { image: '/widget-clock2.png', title: 'Clock' },
  { image: '/widget-calendar2.png', title: 'Classic Calendar' },
];

/* ── Bestsellers ── */
const Bestsellers = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px 80px;

  @media (max-width: 768px) {
    padding: 0 24px 60px;
  }
`;

const BestsellersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const BestsellersHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const BestsellersTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1F1F1F;
  letter-spacing: -0.03em;
  margin: 0;
`;

const BestsellersSubtitle = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: #9A9A9A;
  margin: 0;
`;

const BrowseAllButton = styled.button`
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 500;
  color: #1F1F1F;
  background: none;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
    border-color: rgba(0, 0, 0, 0.2);
  }
`;

const BestsellerGrid = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 4px;

  &::-webkit-scrollbar { display: none; }
  scrollbar-width: none;
`;

const BestsellerCard = styled.div`
  cursor: pointer;
  width: calc((100% - 60px) / 4);
  min-width: 220px;
  flex-shrink: 0;
  scroll-snap-align: start;
`;

const BestsellerImageWrap = styled.div`
  height: 280px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);

  ${BestsellerCard}:hover & {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
    transform: scale(1.02);
  }
`;

const BestsellerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 15%;
  display: block;
  transform: scale(1.15);
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);

  ${BestsellerCard}:hover & {
    transform: scale(1.18);
  }
`;

const BestsellerMeta = styled.div`
  padding: 12px 4px 0;
`;

const BestsellerTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1F1F1F;
  letter-spacing: -0.01em;
  margin-bottom: 4px;
`;

const BestsellerInfo = styled.div`
  font-size: 13px;
  color: #9A9A9A;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const BestsellerTag = TemplateCardTag;

const BESTSELLER_DATA = [
  { image: '/template-main.png', title: 'Life OS Template', price: '$7.99', tags: ['Premium', 'Popular'] },
  { image: '/template-assignments.png', title: 'Weekly Planner', price: 'Free', tags: ['Productivity'] },
  { image: '/template-main.png', title: 'Student Planner', price: '$3.99', tags: ['Education'] },
  { image: '/template-assignments.png', title: 'Budget Tracker', price: 'Free', tags: ['Finance'] },
];

/* ── Widget Studio Block ── */
const StudioBlock = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px 80px;

  @media (max-width: 768px) {
    padding: 0 24px 60px;
  }
`;

const StudioCard = styled.div`
  border-radius: 28px;
  padding: 64px 48px;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(51, 132, 244, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 60% 80%, rgba(236, 72, 153, 0.05) 0%, transparent 50%),
    #F8F8F7;
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.04);
    border-color: rgba(51, 132, 244, 0.08);
  }

  @media (max-width: 768px) {
    padding: 40px 24px;
    border-radius: 20px;
  }
`;

const StudioIcons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 28px;
`;

const StudioIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  svg { width: 22px; height: 22px; color: #6B6B6B; }
`;

const StudioTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: #1F1F1F;
  letter-spacing: -0.03em;
  margin: 0 0 10px;
`;

const StudioDesc = styled.p`
  font-size: 15px;
  color: #9A9A9A;
  line-height: 1.6;
  margin: 0 auto 28px;
  letter-spacing: -0.01em;
  max-width: 380px;
`;

/* ── (old Showcase kept for compat) ── */
const _Showcase = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px 120px;
  animation: ${fadeUp} 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;

  @media (max-width: 768px) {
    padding: 0 24px 80px;
  }
`;

const ShowcaseCard = styled.div`
  background: #F8F8F7;
  border-radius: 28px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  padding: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 32px;
    min-height: 280px;
  }
`;

const ShowcasePlaceholder = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  opacity: 0.4;

  svg { width: 48px; height: 48px; color: #9A9A9A; }
`;

/* ── Products ── */
const Products = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px 120px;

  @media (max-width: 768px) {
    padding: 0 24px 80px;
  }
`;

const SectionLabel = styled.h2`
  font-size: 11px;
  font-weight: 600;
  color: #ABABAB;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  margin: 0 0 32px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled.div`
  background: #F8F8F7;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  padding: 32px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06);
    border-color: rgba(51, 132, 244, 0.12);
  }
`;

const ProductIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(51, 132, 244, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  svg { width: 20px; height: 20px; color: #3384F4; }
`;

const ProductTitle = styled.h3`
  font-size: 17px;
  font-weight: 600;
  color: #1F1F1F;
  margin: 0 0 8px;
  letter-spacing: -0.02em;
`;

const ProductDesc = styled.p`
  font-size: 13px;
  font-weight: 400;
  color: #9A9A9A;
  line-height: 1.6;
  margin: 0 0 20px;
  letter-spacing: -0.01em;
`;

const ProductLink = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #3384F4;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  letter-spacing: -0.01em;

  svg { width: 14px; height: 14px; }
`;

/* ── Features ── */
const Features = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 48px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);

  @media (max-width: 768px) {
    padding: 60px 24px;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
`;

const FeatureItem = styled.div``;

const FeatureLabel = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #1F1F1F;
  margin: 0 0 6px;
  letter-spacing: -0.02em;
`;

const FeatureDesc = styled.p`
  font-size: 13px;
  font-weight: 400;
  color: #9A9A9A;
  line-height: 1.5;
  margin: 0;
  letter-spacing: -0.01em;
`;

/* ── Testimonials (dark marquee) ── */
const scrollUp = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
`;

const TestimonialsSection = styled.section`
  background: #F0F0F0;
  padding: 80px 0;
  overflow: hidden;
  position: relative;


  @media (max-width: 768px) {
    padding: 60px 0;
  }
`;

const TestimonialsTitle = styled.h2`
  font-size: 36px;
  font-weight: 600;
  color: #1F1F1F;
  letter-spacing: -0.03em;
  text-align: center;
  margin: 0 0 48px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 28px;
    margin: 0 0 36px;
    padding: 0 24px;
  }
`;

const TestimonialsSubtitle = styled.p`
  font-size: 15px;
  color: #9A9A9A;
  text-align: center;
  margin: -32px 0 48px;
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    margin: -20px 0 36px;
    padding: 0 24px;
  }
`;

const MarqueeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 0 24px;
  }
`;

const MarqueeColumn = styled.div`
  overflow: hidden;
  height: 600px;
  mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);

  @media (max-width: 768px) {
    height: 500px;
  }
`;

const MarqueeInner = styled.div<{ $duration: number; $reverse?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: ${scrollUp} ${({ $duration }) => $duration}s linear infinite;
  animation-direction: ${({ $reverse }) => $reverse ? 'reverse' : 'normal'};

  &:hover {
    animation-play-state: paused;
  }
`;

const TestimonialCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  flex-shrink: 0;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const TestimonialAvatar = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  flex-shrink: 0;
`;

const TestimonialInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const TestimonialName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #1F1F1F;
  letter-spacing: -0.01em;
`;

const TestimonialRole = styled.span`
  font-size: 12px;
  color: #9A9A9A;
  letter-spacing: -0.01em;

  strong {
    color: #9A9A9A;
    font-weight: 500;
  }
`;

const TestimonialText = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
  letter-spacing: -0.01em;
`;

/* ── CTA ── */
const CTASection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 48px 100px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 60px 24px 80px;
  }
`;

const CTATitle = styled.h2`
  font-size: 36px;
  font-weight: 600;
  color: #1F1F1F;
  letter-spacing: -0.03em;
  margin: 0 0 16px;
`;

const CTASubtitle = styled.p`
  font-size: 16px;
  color: #9A9A9A;
  margin: 0 0 32px;
  letter-spacing: -0.01em;
`;

/* ── Footer ── */
const Footer = styled.footer`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 48px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 24px;
    flex-direction: column;
    gap: 12px;
  }
`;

const FooterText = styled.span`
  font-size: 12px;
  color: #ABABAB;
  letter-spacing: -0.01em;
`;

/* ── Testimonials data ── */
const testimonials = {
  col1: [
    { name: 'Anna Kovacs', initials: 'AK', role: 'Product Designer', company: 'Figma', color: '#6366F1', text: 'Finally a widget tool that doesn\'t look like it\'s from 2015. The calendar fits perfectly into my Notion setup — clean, minimal, and actually aesthetic.' },
    { name: 'James Chen', initials: 'JC', role: 'Engineering Lead', company: 'Vercel', color: '#3B82F6', text: 'We embed Peachy calendars across all our team dashboards in Notion. The dark mode support is flawless and it just works.' },
    { name: 'Sofia Martinez', initials: 'SM', role: 'Content Creator', company: 'YouTube', color: '#EC4899', text: 'I use the clock widget in my streaming setup and the calendar in my content planner. Both look premium and load instantly.' },
    { name: 'David Park', initials: 'DP', role: 'Founder', company: 'IndieHacker', color: '#10B981', text: 'Replaced three different widget tools with Peachy. One studio for everything — calendars, clocks, all customizable. And it\'s free?' },
    { name: 'Lena Fischer', initials: 'LF', role: 'UX Researcher', company: 'Spotify', color: '#F59E0B', text: 'The attention to typography and spacing is rare for a free tool. You can tell someone who cares about design built this.' },
  ],
  col2: [
    { name: 'Marcus Thompson', initials: 'MT', role: 'Startup Founder', company: 'Arc', color: '#8B5CF6', text: 'The Life OS template saved me an entire weekend of setup. Combined with Peachy widgets, my Notion workspace finally feels complete.' },
    { name: 'Yuki Tanaka', initials: 'YT', role: 'Project Manager', company: 'Linear', color: '#06B6D4', text: 'Our whole team switched to Peachy calendars in Notion. The embed URL system is brilliant — just paste and it works. No auth, no fuss.' },
    { name: 'Rachel Kim', initials: 'RK', role: 'Freelance Designer', company: 'Dribbble', color: '#F43F5E', text: 'I\'ve tried every Notion widget out there. Peachy is the only one that matches the quality of my workspace design. Highly recommend.' },
    { name: 'Alex Rivera', initials: 'AR', role: 'Student', company: 'MIT', color: '#14B8A6', text: 'The student planner template + calendar widget combo is perfect. I can see my whole semester at a glance right in Notion.' },
    { name: 'Emma Wilson', initials: 'EW', role: 'Marketing Lead', company: 'Stripe', color: '#A855F7', text: 'Clean design, instant setup, zero maintenance. Exactly what our marketing team needed for our Notion dashboards.' },
  ],
  col3: [
    { name: 'Oliver Brown', initials: 'OB', role: 'Developer', company: 'GitHub', color: '#EF4444', text: 'As a dev, I appreciate that everything is URL-encoded — no accounts, no databases, no tracking. Pure client-side. Respect.' },
    { name: 'Nina Patel', initials: 'NP', role: 'Operations Manager', company: 'Notion', color: '#0EA5E9', text: 'We actually use Peachy widgets internally. The auto theme detection means they look great in both light and dark mode automatically.' },
    { name: 'Tom Anderson', initials: 'TA', role: 'Creative Director', company: 'Pentagram', color: '#D946EF', text: 'The design language is Apple-level clean. Border radius, typography, color palette — everything is considered. Beautiful work.' },
    { name: 'Lisa Chang', initials: 'LC', role: 'Productivity Coach', company: 'Skillshare', color: '#F97316', text: 'I recommend Peachy to all my clients. The templates are thoughtfully structured and the widgets add that extra polish to any workspace.' },
    { name: 'Chris Murphy', initials: 'CM', role: 'CEO', company: 'Calm', color: '#22C55E', text: 'We evaluated several widget solutions. Peachy won on design quality alone. The fact that it\'s free makes it an absolute no-brainer.' },
  ],
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [transitioning, setTransitioning] = useState(false);
  const [logoPos, setLogoPos] = useState({ x: 0, y: 0 });
  const logoRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
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

  const goToStudio = useCallback(() => {
    if (logoRef.current) {
      const rect = logoRef.current.getBoundingClientRect();
      setLogoPos({ x: rect.left, y: rect.top });
    }
    setTransitioning(true);
    setTimeout(() => navigate('/studio'), 450);
  }, [navigate]);

  return (
    <Page>
      <TopNav logoPressed={transitioning} onLogoClick={() => navigate('/')} />
      <PageContent $transitioning={transitioning}>

      <Hero>
{/*        <Badge>For Notion</Badge> */}
        <Title>
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
        <HeroSubtitle>
          Templates and widgets that turn it into a clear, structured system
          for life, work, business, and study.
        </HeroSubtitle>
        <ButtonRow>
          <PrimaryButton onClick={() => navigate('/templates')}>
            Browse Templates
          </PrimaryButton>
          <SecondaryButton onClick={() => navigate('/widgets')}>Explore Widgets</SecondaryButton>
        </ButtonRow>
{/*        <TrustLine>Trusted by 11,000+ users worldwide</TrustLine> */}
      </Hero>

      {/* ── Templates Gallery ── */}
      <TemplatesGallery>
        <BestsellersHeader style={{ maxWidth: 1200, margin: '0 auto 20px', padding: '0 48px', position: 'relative', zIndex: 2 }}>
          <BestsellersHeaderLeft>
            <BestsellersTitle>Top templates</BestsellersTitle>
            <BestsellersSubtitle>Top picks from our community</BestsellersSubtitle>
          </BestsellersHeaderLeft>
          <BrowseAllButton onClick={() => navigate('/templates')}>Explore all</BrowseAllButton>
        </BestsellersHeader>
        <TemplatesMarqueeWrap>
          <TemplateMarqueeTrack $duration={60}>
            {[...TEMPLATE_ROW_1, ...TEMPLATE_ROW_1, ...TEMPLATE_ROW_1].map((t, i) => (
              <TemplateCardWrap key={`tr1-${i}`} onClick={() => navigate('/templates')}>
                <TemplateCard>
                  <TemplateCardImage src={t.image} alt={t.title} />
                </TemplateCard>
                <TemplateCardMeta>
                  <TemplateCardTitle>{t.title}</TemplateCardTitle>
                  <TemplateCardTags>
                    <TemplateCardTag $bg={TAG_COLORS[t.tag]?.bg} $color={TAG_COLORS[t.tag]?.color}>{t.tag}</TemplateCardTag>
                    <span style={{ fontSize: 12, color: '#9A9A9A' }}>{t.price}</span>
                  </TemplateCardTags>
                </TemplateCardMeta>
              </TemplateCardWrap>
            ))}
          </TemplateMarqueeTrack>
        </TemplatesMarqueeWrap>
      </TemplatesGallery>

      {/* ── Widgets ── */}
      <WidgetsSection>
        <BestsellersHeader>
          <BestsellersHeaderLeft>
            <BestsellersTitle>Featured widgets</BestsellersTitle>
            <BestsellersSubtitle>Embed into Notion in seconds</BestsellersSubtitle>
          </BestsellersHeaderLeft>
          <BrowseAllButton onClick={() => navigate('/widgets')}>Explore all</BrowseAllButton>
        </BestsellersHeader>
        <WidgetGrid>
          {WIDGET_DATA.map((w, i) => (
            <WidgetCardWrap key={i} onClick={() => navigate('/widgets')}>
              <WidgetCardBox>
                <WidgetCardImage src={w.image} alt={w.title} />
              </WidgetCardBox>
              <TemplateCardMeta>
                <TemplateCardTitle>{w.title}</TemplateCardTitle>
              </TemplateCardMeta>
            </WidgetCardWrap>
          ))}
        </WidgetGrid>
      </WidgetsSection>



      {/* ── Testimonials ── */}
      <TestimonialsSection>
        <TestimonialsTitle>Loved by 10,000+ users</TestimonialsTitle>
        <TestimonialsSubtitle>See what people are saying about Peachy</TestimonialsSubtitle>
        <MarqueeContainer>
          {/* Column 1 — scrolls up */}
          <MarqueeColumn>
            <MarqueeInner $duration={35}>
              {[...testimonials.col1, ...testimonials.col1].map((t, i) => (
                <TestimonialCard key={`c1-${i}`}>
                  <TestimonialAuthor>
                    <TestimonialAvatar $color={t.color}>{t.initials}</TestimonialAvatar>
                    <TestimonialInfo>
                      <TestimonialName>{t.name}</TestimonialName>
                      <TestimonialRole>{t.role} at <strong>{t.company}</strong></TestimonialRole>
                    </TestimonialInfo>
                  </TestimonialAuthor>
                  <TestimonialText>{t.text}</TestimonialText>
                </TestimonialCard>
              ))}
            </MarqueeInner>
          </MarqueeColumn>

          {/* Column 2 — scrolls down */}
          <MarqueeColumn>
            <MarqueeInner $duration={40} $reverse>
              {[...testimonials.col2, ...testimonials.col2].map((t, i) => (
                <TestimonialCard key={`c2-${i}`}>
                  <TestimonialAuthor>
                    <TestimonialAvatar $color={t.color}>{t.initials}</TestimonialAvatar>
                    <TestimonialInfo>
                      <TestimonialName>{t.name}</TestimonialName>
                      <TestimonialRole>{t.role} at <strong>{t.company}</strong></TestimonialRole>
                    </TestimonialInfo>
                  </TestimonialAuthor>
                  <TestimonialText>{t.text}</TestimonialText>
                </TestimonialCard>
              ))}
            </MarqueeInner>
          </MarqueeColumn>

          {/* Column 3 — scrolls up */}
          <MarqueeColumn>
            <MarqueeInner $duration={45}>
              {[...testimonials.col3, ...testimonials.col3].map((t, i) => (
                <TestimonialCard key={`c3-${i}`}>
                  <TestimonialAuthor>
                    <TestimonialAvatar $color={t.color}>{t.initials}</TestimonialAvatar>
                    <TestimonialInfo>
                      <TestimonialName>{t.name}</TestimonialName>
                      <TestimonialRole>{t.role} at <strong>{t.company}</strong></TestimonialRole>
                    </TestimonialInfo>
                  </TestimonialAuthor>
                  <TestimonialText>{t.text}</TestimonialText>
                </TestimonialCard>
              ))}
            </MarqueeInner>
          </MarqueeColumn>
        </MarqueeContainer>
      </TestimonialsSection>

      <CTASection>
        <CTATitle>Ready to level up?</CTATitle>
        <CTASubtitle>Explore templates or build your own widgets — no sign up needed.</CTASubtitle>
        <ButtonRow>
          <PrimaryButton onClick={() => navigate('/templates')}>
            Browse Templates
          </PrimaryButton>
          <SecondaryButton onClick={() => navigate('/widgets')}>Explore Widgets</SecondaryButton>
        </ButtonRow>
      </CTASection>

      <Footer>
        <FooterText>Peachy Studio</FooterText>
        <FooterText>Widgets &middot; Planners &middot; Templates</FooterText>
      </Footer>
      </PageContent>
    </Page>
  );
};
