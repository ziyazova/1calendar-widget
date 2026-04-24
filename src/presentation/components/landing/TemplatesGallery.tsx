import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { ArrowRight } from 'lucide-react';
import { FilterChip, Button as SharedButton, TemplateMockupCard, TemplateMockupImage } from '../shared';
import { TEMPLATES, type Category } from '@/presentation/data/templates';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* ── Templates Gallery (horizontal marquee) ── */
const TemplatesGallerySection = styled.section`
  padding: 0;
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
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

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 8px 16px 0;
  }
`;

const GalleryHeader = styled.div`
  max-width: 1200px;
  margin: 0 auto 4px;
  padding: 0 48px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 24px;
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
  font-size: 40px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 28px;
  }
`;

const GallerySubtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.peach.muted};
  margin: 8px 0 0;
  letter-spacing: -0.01em;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 14px;
  }
`;

/* ExploreBtn replaced by shared <Button $variant="primary" $size="md"> */

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  /* Phone — hide the whole filter row. Mobile users get a clean "here
   * is a preview → tap Explore all to see everything" flow, and they
   * can filter on the real /templates page. Less decision fatigue. */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

/* Wraps the inline "Explore all" button inside FilterRow on desktop.
 * On mobile the button hides here and re-appears below the marquee
 * as its own centered row (MobileExploreRow). */
const DesktopExploreSlot = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

/* Mobile-only CTA row that sits under the marquee. Centered full-width
 * button, natural reading order: user scrolls through the preview then
 * taps "Explore all" to see the whole catalog. */
const MobileExploreRow = styled.div`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    justify-content: center;
    padding: 16px 24px 0;

    & > * { width: 100%; max-width: 320px; }
  }
`;


// Filter chips for the "Top templates" row. Each chip maps to a Category
// from `data/templates.ts`, so filtering is derived from the same source of
// truth as the full shop at `/templates` — no duplicate data.
const TEMPLATE_CATEGORIES: { label: string; category: Category | null }[] = [
  { label: 'All', category: null },
  { label: 'Life', category: 'planners' },
  { label: 'Student', category: 'student' },
  { label: 'Wellness', category: 'health' },
];

// Curated presentation order for the landing marquee. IDs reference
// `TEMPLATES` — no duplicated card data lives in this file.
const LANDING_TEMPLATE_IDS = ['1', '2', '6', '8', '3', '7', '12', '10', '4', '9', '11', '13', '5'];
const LANDING_TEMPLATES = LANDING_TEMPLATE_IDS
  .map(id => TEMPLATES.find(t => t.id === id))
  .filter((t): t is NonNullable<typeof t> => Boolean(t));

const TemplateMarqueeTrack = styled.div<{ $duration: number; $reverse?: boolean }>`
  display: flex;
  gap: 24px;
  padding: 0;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
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
  transition: all ${({ theme }) => theme.transitions.medium};

  svg {
    width: 14px;
    height: 14px;
    color: ${({ theme }) => theme.colors.text.body};
  }

  &:hover {
    background: rgba(0, 0, 0, 0.04);
    border-color: rgba(0, 0, 0, 0.2);
    svg { color: ${({ theme }) => theme.colors.text.primary}; }
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
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

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 200px;
  }
`;

/* Spacing wrapper around the shared <TemplateMockupCard> so the card has
   the same bottom gap as other cards in the marquee. Visual chrome comes
   from templateCardTokens. */
const TemplateCardSlot = styled.div`
  margin-bottom: 12px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) { margin-bottom: 8px; }
`;

const TemplateCardMeta = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 6px;
`;

const TemplateCardTitle = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.01em;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 13px;
    /* On phone the card is 200px wide — long titles like "Dark Academia
     * Study" were ellipsis-clipped. Allow 2-line wrap instead. */
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const TemplateCardPrice = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.body};
  letter-spacing: -0.01em;
  line-height: 1.3;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 13px;
  }
`;

// TEMPLATE_ROW_1 previously held a hand-maintained copy of the catalog that
// drifted from data/templates.ts over time. All rendering now derives from
// LANDING_TEMPLATES (above), which references TEMPLATES directly.

interface TemplatesGalleryProps {
  onNavigate: (path: string) => void;
}

export const TemplatesGallery: React.FC<TemplatesGalleryProps> = ({ onNavigate }) => {
  const [templateScrolled, setTemplateScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState<Category | null>(null);
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const templateWrapRef = useRef<HTMLDivElement>(null);

  // A template with multi-category assignment would otherwise render twice
  // if its id were in the array twice; LANDING_TEMPLATE_IDS is unique by
  // construction, but we keep a Set-based dedupe on the filtered output to
  // be explicit about intent.
  const filteredTemplates = (() => {
    const base = activeFilter
      ? LANDING_TEMPLATES.filter(t => t.category.includes(activeFilter))
      : LANDING_TEMPLATES;
    const seen = new Set<string>();
    return base.filter(t => {
      if (seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    });
  })();

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
              $active={activeFilter === c.category}
              onClick={() => setActiveFilter(c.category)}
            >
              {c.label}
            </FilterChip>
          ))}
          <DesktopExploreSlot>
            <SharedButton $variant="primary" $size="md" onClick={() => onNavigate('/templates')}>
              Explore all <ArrowRight />
            </SharedButton>
          </DesktopExploreSlot>
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
          {filteredTemplates.map((t) => (
            <TemplateCardWrap key={t.id} onClick={() => onNavigate(`/templates/${t.id}`)}>
              <TemplateCardSlot>
                <TemplateMockupCard $size="marquee" $interactive data-ux="Template Card">
                  <TemplateMockupImage $size="marquee" src={t.image} alt={t.title} />
                </TemplateMockupCard>
              </TemplateCardSlot>
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
      <MobileExploreRow>
        <SharedButton $variant="primary" $size="lg" onClick={() => onNavigate('/templates')}>
          Explore all <ArrowRight />
        </SharedButton>
      </MobileExploreRow>
    </TemplatesGallerySection>
  );
};
