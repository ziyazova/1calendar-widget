import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { ArrowRight } from 'lucide-react';
import { FilterChip } from '../shared';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* ── Templates Gallery (horizontal marquee) ── */
const TemplatesGallerySection = styled.section`
  padding: 0;
  position: relative;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const TemplatesMarqueeWrap = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 48px;
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

const GalleryHeader = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 0 24px 16px;
  }
`;

const GalleryTitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const GalleryTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const GalleryTitle = styled.h2`
  font-size: 36px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const GallerySubtitle = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const ExploreBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 18px;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  background: ${({ theme }) => theme.colors.text.primary};
  border: none;
  border-radius: ${({ theme }) => theme.radii.button};
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover { background: #333; }
  svg { width: 14px; height: 14px; }
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;


const TEMPLATE_CATEGORIES = [
  { label: 'All', tag: '' },
  { label: 'Life', tag: 'life' },
  { label: 'Student', tag: 'students' },
  { label: 'Wellness', tag: 'bestsellers' },
];

const TemplateMarqueeTrack = styled.div<{ $duration: number; $reverse?: boolean }>`
  display: flex;
  gap: 24px;
  padding: 0;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const TemplatesScrollHint = styled.div`
  position: absolute;
  right: 80px;
  bottom: 130px;
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
    svg { color: ${({ theme }) => theme.colors.text.primary}; }
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;


const TemplateCardWrap = styled.div`
  flex-shrink: 0;
  cursor: pointer;
  width: 300px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.06);
    z-index: 2;
  }

  @media (max-width: 768px) {
    width: 200px;
  }
`;

const TemplateCard = styled.div`
  width: 100%;
  aspect-ratio: 288 / 220;
  position: relative;
  border-radius: ${({ theme }) => theme.radii['2xl']};
  overflow: hidden;
  cursor: pointer;
  border: 1.5px solid rgba(200, 195, 230, 0.25);
  background: linear-gradient(180deg, #FAFAFC 0%, #F6F6FA 50%, #F0F0F8 100%);
  margin-bottom: 8px;

  @media (max-width: 768px) {
    border-radius: ${({ theme }) => theme.radii.md};
    margin-bottom: 6px;
  }
`;

const TemplateCardImage = styled.img`
  width: 80%;
  height: 80%;
  object-fit: contain;
  display: block;
  position: absolute;
  inset: 0;
  margin: auto;
  filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.1));
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);

  ${TemplateCardWrap}:hover & {
    transform: scale(1.06);
  }
`;

const TemplateCardMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px 0;
`;

const TemplateCardTitle = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const TemplateCardPrice = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const TEMPLATE_ROW_1 = [
  { id: '1', image: '/template-cherry-planner.png', title: 'Ultimate Life Planner', price: '$18.99', tags: ['bestsellers', 'life'] },
  { id: '2', image: '/template-wellness.png', title: 'Ultimate Wellness Planner', price: '$14.99', tags: ['bestsellers', 'life'] },
  { id: '6', image: '/template-mystic.png', title: 'Mystic Life Planner', price: '$16.99', tags: ['life'] },
  { id: '8', image: '/template-glowup.png', title: 'Glow Up Planner', price: '$12.99', tags: ['bestsellers', 'life'] },
  { id: '3', image: '/template-academic-dark.png', title: 'Academic Planner Dark', price: '$9.99', tags: ['students'] },
  { id: '7', image: '/template-academia-light.png', title: 'Light Academia Planner', price: '$11.99', tags: ['students'] },
  { id: '12', image: '/template-dark-academia.png', title: 'Dark Academia Student', price: '$11.99', tags: ['students'] },
  { id: '10', image: '/template-cherub.png', title: 'Cherub Planner', price: '$12.99', tags: ['life'] },
  { id: '4', image: '/template-green-life.png', title: 'Green Life Planner', price: '$14.99', tags: ['life'] },
  { id: '9', image: '/template-life-olive.png', title: 'Olive Life Planner', price: '$14.99', tags: ['life'] },
  { id: '11', image: '/template-minimalist-green.png', title: 'Minimalist Green Planner', price: '$13.99', tags: ['life'] },
  { id: '13', image: '/template-university-dark.png', title: 'University Planner', price: '$9.99', tags: ['students'] },
  { id: '5', image: '/template-student-light.png', title: 'Student Planner Light', price: '$8.99', tags: ['students'] },
];

interface TemplatesGalleryProps {
  onNavigate: (path: string) => void;
}

export const TemplatesGallery: React.FC<TemplatesGalleryProps> = ({ onNavigate }) => {
  const [templateScrolled, setTemplateScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState('');
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const templateWrapRef = useRef<HTMLDivElement>(null);

  const filteredTemplates = activeFilter
    ? TEMPLATE_ROW_1.filter(t => t.tags.includes(activeFilter))
    : TEMPLATE_ROW_1;

  return (
    <TemplatesGallerySection data-ux="Templates Gallery">
      <GalleryHeader>
        <GalleryTitleRow>
          <GalleryTitleGroup>
            <GalleryTitle>Top templates</GalleryTitle>
          </GalleryTitleGroup>
        </GalleryTitleRow>
        <FilterRow>
          {TEMPLATE_CATEGORIES.map(c => (
            <FilterChip
              key={c.label}
              $active={activeFilter === c.tag}
              onClick={() => setActiveFilter(c.tag)}
            >
              {c.label}
            </FilterChip>
          ))}
          <ExploreBtn onClick={() => onNavigate('/templates')} style={{ marginLeft: 'auto' }}>
            Explore all <ArrowRight />
          </ExploreBtn>
        </FilterRow>
      </GalleryHeader>
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
          {[...filteredTemplates, ...filteredTemplates].map((t, i) => (
            <TemplateCardWrap key={`tr1-${i}`} onClick={() => onNavigate(`/templates/${t.id}`)}>
              <TemplateCard data-ux="Template Card">
                <TemplateCardImage src={t.image} alt={t.title} />
              </TemplateCard>
              <TemplateCardMeta>
                <TemplateCardTitle>{t.title}</TemplateCardTitle>
                <TemplateCardPrice>{t.price}</TemplateCardPrice>
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
