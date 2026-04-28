import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { ArrowRight } from 'lucide-react';
import { FilterChip, Button as SharedButton, TemplateMockupCard, TemplateMockupImage } from '../shared';
import { TEMPLATES, type Category } from '@/presentation/data/templates';
import { media } from '@/presentation/themes/media';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* ── Templates Gallery (horizontal marquee) ── */
const TemplatesGallerySection = styled.section`
  padding: 0;
  position: relative;

  /* Mobile — 12px extra bottom padding inside the section so the gap
   * to the next section is 40 (Section wrapper 28 + this 12) instead
   * of 28. Stops the next section from "приклеиваясь". */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 0 12px;
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
    /* padding-top: 0 — header→marquee gap is fully owned by GalleryHeader's
     * margin-bottom (= bodyToCards). No stacking. */
    padding: 0 ${({ theme }) => theme.layout.mobile.gutter} 0;
  }

  /* Mobile — native swipe with snap. overscroll-behavior contains the
   * swipe so it doesn't trigger pull-to-refresh / browser back-gesture. */
  ${media.mobile`
    scroll-snap-type: x mandatory;
    overscroll-behavior-x: contain;
    scroll-padding-left: 20px;
  `}
`;

const GalleryHeader = styled.div`
  max-width: 1200px;
  margin: 0 auto 4px;
  padding: 0 48px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 ${({ theme }) => theme.layout.mobile.gutter};
    gap: ${({ theme }) => theme.layout.mobile.titleToBody};
    /* Solo title (no subtitle) → titleToCards (28 = titleToBody 8 +
     * bodyToCards 20). Visual descent matches sections that have a
     * subtitle. */
    margin-bottom: ${({ theme }) => theme.layout.mobile.titleToCards};
    /* Center the title row on mobile to match WidgetStudio /
     * Testimonials / CTA. Last user note: "выровни контент". */
    text-align: center;
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
    font-size: ${({ theme }) => theme.typography.mobile.sectionHeadline.size};
    font-weight: ${({ theme }) => theme.typography.mobile.sectionHeadline.weight};
    line-height: ${({ theme }) => theme.typography.mobile.sectionHeadline.lineHeight};
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
    justify-content: flex-end;
    padding: 28px ${({ theme }) => theme.layout.mobile.gutter} 0;

    & > * { width: 100%; }
  }

  /* Wide phones / phablets (481-768): cap at 318 and stick to the
   * right edge of the content column. On narrower phones (≤ 480) the
   * cap doesn't kick in — button stays full-width and the flex-end
   * justification has no slack to act on. Per "пусть растягивается до
   * определённого размера телефона, дальше становится меньше по ширине
   * у огромных телефонов и стикается справа". */
  @media (min-width: calc(${({ theme }) => theme.breakpoints.sm} + 1px))
    and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    & > * { max-width: 318px; }
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

  /* Tablet — narrower card so 3 cards + a teaser of the 4th fit in
   * the marquee viewport (was jumping straight from 300 to 200). */
  ${media.tablet`
    width: 240px;
  `}

  /* Mobile — width 75vw so the next card peeks ~25% at the right
   * edge (peek = scroll affordance). Snap-align start keeps the
   * focused card flush to the section gutter.
   * Hover scale disabled — on phone the desktop &:hover rule fires on
   * tap and pulses the entire card, which reads as "the card was
   * pressed" rather than "the content responded".
   * Comment c_mog84l4d: "у телефона при нажатии увеличивается вся
   * карточка, убери это". */
  ${media.mobile`
    width: 75vw;
    scroll-snap-align: start;

    &:hover {
      transform: none;
    }
  `}
`;

/* Spacing wrapper around the shared <TemplateMockupCard> so the card has
   the same bottom gap as other cards in the marquee. Visual chrome comes
   from templateCardTokens. */
const TemplateCardSlot = styled.div`
  margin-bottom: 12px;
`;

const TemplateCardMeta = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 6px;

  /* Mobile — same row layout as desktop: title left, price right.
   * Title ellipsizes if needed (white-space: nowrap on the title). */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
    padding: 0 4px;
  }
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

  /* Mobile — title 14/500. Synced with /templates' 2-col CardTitle —
   * weight came down 600 → 500 per "текст менее жирный". */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.mobile.cardBody.size};
    font-weight: 500;
    line-height: ${({ theme }) => theme.typography.mobile.cardBody.lineHeight};
  }
`;

const TemplateCardPrice = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.body};
  letter-spacing: -0.01em;
  line-height: 1.3;
  flex-shrink: 0;

  /* Mobile — price 13/500 (sizes.md). Same recipe as /templates' 2-col
   * Price: tighter than title (14/600) so price reads as secondary in
   * the row. Color recedes to text.tertiary (Apple-style). */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.sizes.md};
    font-weight: 500;
    line-height: ${({ theme }) => theme.typography.mobile.cardBody.lineHeight};
    color: ${({ theme }) => theme.colors.text.tertiary};
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
        {/* Mobile size = md (36px). Was bumped to lg in 96df7a3 after
         * c_mofz84kz suggested it should be bigger, but c_mog0zawt reads
         * the lg version as "огромная" — reverted. The 320px width (set
         * by MobileExploreRow's child rule) gives a comfortable tap area
         * even at 36px height. */}
        <SharedButton $variant="primary" $size="md" onClick={() => onNavigate('/templates')}>
          Explore all <ArrowRight />
        </SharedButton>
      </MobileExploreRow>
    </TemplatesGallerySection>
  );
};
