import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '../shared';

/* ── Templates Gallery (horizontal marquee) ── */
const TemplatesGallerySection = styled.section`
  padding: 40px 0 80px;
  background: #ffffff;
  position: relative;

  @media (max-width: 768px) {
    padding: 0 0 60px;
  }
`;

const TemplatesMarqueeWrap = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;

  &::-webkit-scrollbar { display: none; }
  scrollbar-width: none;

  &[data-scrolled="false"] {
    mask-image: linear-gradient(to right, black 0%, black 88%, transparent 100%);
    -webkit-mask-image: linear-gradient(to right, black 0%, black 88%, transparent 100%);
  }

  &[data-scrolled="true"] {
    mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
  }

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const StyledSectionHeader = styled(SectionHeader)`
  max-width: 1200px;
  margin: 0 auto 24px;
  padding: 0 48px;

  @media (max-width: 768px) {
    padding: 0 24px;
  }
`;

const TemplateMarqueeTrack = styled.div<{ $duration: number; $reverse?: boolean }>`
  display: flex;
  gap: 24px;
  padding: 10px 0;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const TemplatesScrollHint = styled.div`
  position: absolute;
  right: 106px;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: none;
  border: 1px solid rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
  transition: all 0.2s;

  svg {
    width: 14px;
    height: 14px;
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  &:hover {
    background: rgba(0, 0, 0, 0.04);
    border-color: rgba(0, 0, 0, 0.2);
    transform: translateY(-50%);
    svg { color: #1F1F1F; }
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const TemplateCardWrap = styled.div`
  flex-shrink: 0;
  cursor: pointer;
`;

const TemplateCard = styled.div`
  width: 288px;
  height: 228px;
  position: relative;
  border-radius: ${({ theme }) => theme.radii['2xl']};
  overflow: clip;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  ${TemplateCardWrap}:hover & img {
    transform: scale(1.22);
  }

  @media (max-width: 768px) {
    width: 160px;
    height: 126px;
    border-radius: ${({ theme }) => theme.radii.lg};
  }
`;

const TemplateCardImage = styled.img`
  width: calc(100% + 36px);
  height: calc(100% + 28px);
  object-fit: cover;
  object-position: center 15%;
  position: absolute;
  top: -14px;
  left: -18px;
  transform: scale(1.15);
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
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
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.01em;
`;

const TemplateCardTags = styled.div`
  display: flex;
  gap: 8px;
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
  color: ${({ $color, theme }) => $color || theme.colors.text.tertiary};
`;

const TEMPLATE_ROW_1 = [
  { image: '/template-main.png', title: 'Student Planner', price: '$3.99', tag: 'Education' },
  { image: '/template-main.png', title: 'Habit Tracker', price: 'Free', tag: 'Productivity' },
  { image: '/template-main.png', title: 'Weekly Planner', price: 'Free', tag: 'Productivity' },
  { image: '/template-main.png', title: 'Journal', price: 'Free', tag: 'Personal' },
];

interface TemplatesGalleryProps {
  onNavigate: (path: string) => void;
}

export const TemplatesGallery: React.FC<TemplatesGalleryProps> = ({ onNavigate }) => {
  const [templateScrolled, setTemplateScrolled] = useState(false);
  const templateWrapRef = useRef<HTMLDivElement>(null);

  return (
    <TemplatesGallerySection data-ux="Templates Gallery">
      <StyledSectionHeader
        title="Top templates"
        subtitle="Top picks from our community"
        actionLabel="Explore all"
        onAction={() => onNavigate('/templates')}
        titleUx="Section Title"
        marginBottom="0px"
      />
      <TemplatesMarqueeWrap
        data-ux="Marquee Wrap"
        data-scrolled={templateScrolled ? 'true' : 'false'}
        ref={templateWrapRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          setTemplateScrolled(el.scrollLeft > 10);
        }}
      >
        <TemplateMarqueeTrack $duration={60}>
          {[...TEMPLATE_ROW_1, ...TEMPLATE_ROW_1].map((t, i) => (
            <TemplateCardWrap key={`tr1-${i}`} onClick={() => onNavigate('/templates')}>
              <TemplateCard data-ux="Template Card">
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
      <TemplatesScrollHint onClick={() => {
        if (templateWrapRef.current) templateWrapRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      }}>
        <ArrowRight />
      </TemplatesScrollHint>
    </TemplatesGallerySection>
  );
};
