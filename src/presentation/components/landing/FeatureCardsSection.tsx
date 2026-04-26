import React, { useRef, useState } from 'react';
import styled from 'styled-components';

/* ── Feature Cards (stacked) ── */
const FeatureCardsSectionWrap = styled.section`
  max-width: 940px;
  margin: 0 auto;
  padding: 0 24px;

  /* Phone — break out of WidgetStudioSection's 20px gutter so the
   * carousel runs edge-to-edge (next card peeks at the right edge). */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0;
    margin: 0 -20px;
    max-width: none;
  }
`;

const FeatureStack = styled.div`
  position: relative;
  height: 624px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: auto;
    display: flex;
    gap: 12px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    overscroll-behavior-x: contain;
    -webkit-overflow-scrolling: touch;
    /* Carousel matches TemplatesGallery: gutter on both sides of the
     * scroll port + scroll-padding-left so the snap rest position lines
     * up with the gutter (otherwise mandatory snap pulls the first
     * card flush to the viewport edge — "съезжает справа"). */
    padding: 0 20px;
    scroll-padding-left: 20px;

    &::-webkit-scrollbar { display: none; }
    scrollbar-width: none;
  }
`;

const FeatureCard = styled.div<{ $active: boolean; $index: number; $total: number; $activeIdx: number; $color: string }>`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  overflow: hidden;
  border: 1px solid ${({ $color }) => {
    const hex = $color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.35)`;
  }};
  box-shadow: ${({ $index, $activeIdx, $total }) => {
    const behind = ($index - $activeIdx + $total) % $total;
    return behind === 0
      ? '0 2px 4px rgba(26, 22, 19, 0.04), 0 12px 32px -8px rgba(26, 22, 19, 0.12), 0 28px 56px -16px rgba(26, 22, 19, 0.18)'
      : '0 1px 3px rgba(26, 22, 19, 0.03), 0 8px 20px -6px rgba(26, 22, 19, 0.08), 0 18px 40px -16px rgba(26, 22, 19, 0.1)';
  }};
  cursor: pointer;
  position: absolute;
  left: 0;
  right: 0;
  height: 515px;
  z-index: ${({ $index, $activeIdx, $total }) => {
    // circular distance behind active
    const behind = ($index - $activeIdx + $total) % $total;
    return behind === 0 ? $total + 1 : $total - behind;
  }};
  top: ${({ $index, $activeIdx, $total }) => {
    const behind = ($index - $activeIdx + $total) % $total;
    const base = ($total - 1) * 50;
    const offset = behind === 0 ? ($index === 0 ? -2 : -5) : 0;
    return `${base - behind * 50 + offset}px`;
  }};
  transform: ${({ $index, $activeIdx, $total }) => {
    const behind = ($index - $activeIdx + $total) % $total;
    if (behind === 0) return 'scale(1)';
    const scaleVal = 1 - behind * 0.03;
    return `scale(${scaleVal})`;
  }};
  margin-left: ${({ $index, $activeIdx, $total }) => {
    const behind = ($index - $activeIdx + $total) % $total;
    return `${behind * 20}px`;
  }};
  margin-right: ${({ $index, $activeIdx, $total }) => {
    const behind = ($index - $activeIdx + $total) % $total;
    return `${behind * 20}px`;
  }};
  opacity: ${({ $index, $activeIdx, $total }) => {
    const behind = ($index - $activeIdx + $total) % $total;
    return behind === 0 ? 1 : 1 - behind * 0.03;
  }};
  transition: top 0.5s cubic-bezier(0.22, 1, 0.36, 1), transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1), margin 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;

  &:hover {
    opacity: 1;
    box-shadow: ${({ $index, $activeIdx, $total }) => {
      const behind = ($index - $activeIdx + $total) % $total;
      return behind === 0
        ? '0 2px 6px rgba(26, 22, 19, 0.05), 0 16px 40px -10px rgba(26, 22, 19, 0.16), 0 36px 72px -20px rgba(26, 22, 19, 0.22)'
        : '0 1px 4px rgba(26, 22, 19, 0.04), 0 10px 24px -8px rgba(26, 22, 19, 0.1), 0 22px 48px -18px rgba(26, 22, 19, 0.14)';
    }};
    top: ${({ $index, $activeIdx, $total }) => {
      const behind = ($index - $activeIdx + $total) % $total;
      const base = ($total - 1) * 50;
      if (behind === 0) return `${base}px`;
      return `${base - behind * 52 - 14}px`;
    }};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: static;
    flex-direction: column;
    flex-shrink: 0;
    /* 90vw card — wider focused card with a small (~10%) peek of the
     * next card to signal scrollability without dominating. */
    width: 90vw;
    height: auto;
    padding: 0;
    gap: 0;
    transform: none !important;
    top: auto !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    opacity: 1 !important;
    scroll-snap-align: start;
    overflow: hidden;
    /* Mobile uses radii.lg (16) — generic content card token, same as
     * HowItWorks step card and Testimonials card so all phone-card
     * surfaces share one corner radius. Desktop keeps radii['2xl'] (24)
     * unchanged. */
    border-radius: ${({ theme }) => theme.radii.lg};
    /* Card fill = background.surfaceAlt — same DS tint that Testimonials
     * cards use on phone (and the footer). Without it, white-on-white
     * card-on-section blended into one block.
     * Comment c_mog9wiit: "карточку выделить, сливается — мб залить в
     * цвет футера". */
    background: ${({ theme }) => theme.colors.background.surfaceAlt};
    border: 1px solid ${({ theme }) => theme.colors.border.light};
    /* Mobile-card shadow token — unified with HowItWorks / Testimonials
     * so all three landing card families read as one on phone.
     * !important needed because the desktop box-shadow above is itself
     * a function of $index/$activeIdx and would otherwise win specificity. */
    box-shadow: ${({ theme }) => theme.shadows.mobileCard} !important;
  }
`;

const FeatureCardTab = styled.div<{ $color: string; $intensity?: number }>`
  padding: 14px 20px;
  background: ${({ $color, $intensity = 0.05 }) => {
    const hex = $color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${$intensity * 0.6})`;
  }};
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};

  /* Mobile — fixed window-style header: 44 height, 16 horizontal.
   * Tab title text uses base body color (dark, but not too dark) —
   * the dot still carries the per-card $color identity (FeatureTabDot
   * reads $color directly). Reverted from per-card-colored title.
   * Comment c_mogaqemw: "тeкст всё-таки тёмный базовый, но не сильно
   * тёмный". */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 44px;
    padding: 0 16px;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.text.body};
    min-width: 0;

    > *:first-of-type ~ * {
      min-width: 0;
    }
  }
`;

const FeatureTabDot = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const FeatureTabTitle = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.01em;

  /* Mobile — inherit color from FeatureCardTab (now per-card $color) so
   * each tab label echoes its dot. Weight 500 — slightly bolder than
   * 400 so the per-card color reads with intent without competing with
   * the card title.
   * Comments: c_mog6wo8p ("приглушить") + c_mog9ycm3 ("чуть жирнее"). */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    color: inherit;
    font-weight: 500;
  }
`;

const FeatureTabActions = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const FeatureCardBody = styled.div`
  display: flex;
  align-items: stretch;
  gap: 68px;
  padding: 0 0 0 36px;
  flex: 1;

  /* Mobile — symmetric 20 padding box (top/right/bottom/left). */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    padding: 20px;
    gap: 0;
  }
`;

const FeatureCardText = styled.div`
  flex: 0 0 calc(36% - 48px);
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: center;
`;

const FeatureCardTitle = styled.h3`
  font-size: 22px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  margin: 0 0 12px;
  line-height: 1.2;

  /* Mobile — cardHeadline token (16/700/1.35). Tight 8 below for
   * title→desc pair. */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.mobile.cardHeadline.size};
    font-weight: ${({ theme }) => theme.typography.mobile.cardHeadline.weight};
    line-height: ${({ theme }) => theme.typography.mobile.cardHeadline.lineHeight};
    margin: 0 0 8px 0;
  }
`;

const FeatureCardDesc = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  line-height: 1.65;
  margin: 0;
  letter-spacing: -0.01em;

  /* Mobile — cardBody token (14/400/1.5). 24 below sets desc → image. */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.mobile.cardBody.size};
    font-weight: ${({ theme }) => theme.typography.mobile.cardBody.weight};
    line-height: ${({ theme }) => theme.typography.mobile.cardBody.lineHeight};
    color: ${({ theme }) => theme.colors.text.body};
    margin: 0 0 24px 0;
  }
`;

const FeatureCardImage = styled.div`
  flex: 1;
  min-width: 0;
  align-self: stretch;
  margin: 40px 0 0 0;
  overflow: hidden;
  border: none;
  background: ${({ theme }) => theme.colors.background.surfaceMuted};
  position: relative;
  border-radius: ${({ theme }) => theme.radii['2xl']} 0 0 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  /* Mobile — 4:3 aspect (taller than 16:10), media-radius token (md=12)
   * so the image is one notch tighter than its parent card (lg=16) per
   * the hierarchy invariant: media radius < card radius. */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 0;
    flex: 0 0 auto;
    height: auto;
    aspect-ratio: 4 / 3;
    min-height: 0;
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.background.surfaceMuted};
  }
`;

/* Mobile-only pagination dots that sit below the card carousel.
 * Active dot widens into a pill, matching common iOS carousel patterns. */
const Dots = styled.div`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    /* margin-top 20 — cards → dots; margin-bottom 0 — section
     * controls the bottom rhythm. */
    margin: 20px 0 0;
    padding: 0;
  }
`;

const Dot = styled.button<{ $active: boolean; $color: string }>`
  appearance: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  width: ${({ $active }) => ($active ? '20px' : '8px')};
  height: 8px;
  border-radius: ${({ theme }) => theme.radii.xs};
  /* Active dot picks up its card's $color (Functionality=blue,
   * Design=green, Payment=orange) so the indicator carries the same
   * visual identity as the tab/title. Inactive stays soft grey.
   * Opacity 0.65 keeps the active bar from reading as a solid hard
   * stripe — softer indicator, more Apple-y.
   * Comment c_moga1lrn: "переключатель когда активный менялся в цвет
   * карточки". */
  background: ${({ $active, $color, theme }) =>
    $active ? $color : theme.colors.border.medium};
  opacity: ${({ $active }) => ($active ? 0.65 : 1)};
  transition: width 0.25s ease, background 0.25s ease, opacity 0.25s ease;
`;

const WhyTitle = styled.h2`
  font-size: 40px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  margin: 0 0 32px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.mobile.sectionHeadline.size};
    font-weight: ${({ theme }) => theme.typography.mobile.sectionHeadline.weight};
    line-height: ${({ theme }) => theme.typography.mobile.sectionHeadline.lineHeight};
    /* Solo title (no subtitle) → cards = 16 (bodyToCards). */
    margin: 0 0 ${({ theme }) => theme.layout.mobile.bodyToCards};
  }
`;

const FEATURE_CARDS = [
  {
    tab: 'Functionality',
    /* Swapped with Design — green now lives on Functionality
     * (greens read as "running / working" → fits "automations,
     * dashboards"). Single source of truth, applies across desktop
     * and mobile (tab bg, dot, mobile title color, carousel pagination
     * active color all read from this $color). */
    color: '#7FA96B',
    title: 'Built just for you.',
    desc: 'Automations, dashboards, pre-filled sections. Ready the moment you open it.',
    image: '/feature-functionality.png',
  },
  {
    tab: 'Design',
    color: '#3B82F6',
    title: 'Looks just right.',
    desc: 'Clean, aesthetic, thoughtful. Open it and it just feels right.',
    image: '/feature-design.png',
  },
  {
    tab: 'Payment',
    color: '#F4A672',
    title: 'Pay once. Yours forever.',
    desc: 'One payment. It lives in your Notion for as long as you need.',
    image: '/feature-pricing.png',
  },
];

export const FeatureCardsSection: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [stackScrolled, setStackScrolled] = useState(false);
  const [scrollIdx, setScrollIdx] = useState(0);
  const stackRef = useRef<HTMLDivElement>(null);

  const onStackScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    setStackScrolled(el.scrollLeft > 10);
    const step = el.scrollWidth / FEATURE_CARDS.length;
    const idx = Math.min(FEATURE_CARDS.length - 1, Math.max(0, Math.round(el.scrollLeft / step)));
    setScrollIdx(idx);
  };

  const scrollToCard = (i: number) => {
    const el = stackRef.current;
    if (!el) return;
    const step = el.scrollWidth / FEATURE_CARDS.length;
    el.scrollTo({ left: i * step, behavior: 'smooth' });
  };

  return (
    <FeatureCardsSectionWrap data-ux="Feature Cards Section">
      <FeatureStack
        data-ux="Feature Stack"
        data-scrolled={stackScrolled ? 'true' : 'false'}
        ref={stackRef}
        onScroll={onStackScroll}
      >
        {FEATURE_CARDS.map((f, i) => (
          <FeatureCard
            key={i}
            $active={activeFeature === i}
            $index={i}
            $total={FEATURE_CARDS.length}
            $activeIdx={activeFeature}
            $color={f.color}
            onClick={() => setActiveFeature(i === activeFeature ? (i + 1) % FEATURE_CARDS.length : i)}
          >
            <FeatureCardTab $color={f.color} $intensity={i === activeFeature ? 0.43 : 0.29} data-ux="Feature Card Tab">
              <FeatureTabDot $color={f.color} />
              <FeatureTabTitle>{f.tab}</FeatureTabTitle>
              <FeatureTabActions>
                <FeatureTabDot $color={f.color} style={{ width: 8, height: 8, opacity: 0.4 }} />
                <FeatureTabDot $color={f.color} style={{ width: 8, height: 8, opacity: 0.4 }} />
                <FeatureTabDot $color={f.color} style={{ width: 8, height: 8, opacity: 0.4 }} />
              </FeatureTabActions>
            </FeatureCardTab>
            <FeatureCardBody data-ux="Feature Card Body">
              <FeatureCardText>
                <FeatureCardTitle>{f.title}</FeatureCardTitle>
                <FeatureCardDesc>{f.desc}</FeatureCardDesc>
              </FeatureCardText>
              <FeatureCardImage />
            </FeatureCardBody>
          </FeatureCard>
        ))}
      </FeatureStack>
      <Dots aria-hidden="true">
        {FEATURE_CARDS.map((f, i) => (
          <Dot
            key={i}
            $active={i === scrollIdx}
            $color={f.color}
            onClick={() => scrollToCard(i)}
            type="button"
          />
        ))}
      </Dots>
    </FeatureCardsSectionWrap>
  );
};
