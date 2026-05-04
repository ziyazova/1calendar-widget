import React, { useRef, useState } from 'react';
import styled from 'styled-components';

/* ── Feature Cards (stacked) ── */
const FeatureCardsSectionWrap = styled.section`
  max-width: 940px;
  margin: 0 auto;
  padding: 0 24px;

  /* Phone — break out of WidgetStudioSection's 20px gutter so the
   * carousel runs edge-to-edge (next card peeks at the right edge). */
  @media (max-width: 649px) {
    padding: 0;
    margin: 0 -20px;
    max-width: none;
  }

  /* Tablet — slightly narrower than desktop (880 vs 940) but wider
   * than the first-pass 720 which read as cramped per user feedback.
   * Cards keep desktop-like presence; text bumps already applied to
   * Title/Desc give them a little extra weight. */
  @media (min-width: calc(${({ theme }) => theme.breakpoints.md} + 1px))
    and (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    max-width: 880px;
  }
`;

const FeatureStack = styled.div`
  position: relative;
  /* aspect-ratio drives height so the stacked layout scales evenly
   * with width — at narrower desktop/tablet widths the stack shrinks
   * in lockstep with the cards instead of leaving a tall hollow box.
   * 892 (max card width inside the 940 wrap) × 720 — fits the active
   * card (892/560 aspect) plus the 2× peek-step (max(45px, 7.5%))
   * with a touch of breathing room below at desktop widths. */
  aspect-ratio: 892 / 720;

  @media (max-width: 649px) {
    /* Mobile uses horizontal scroll-snap, not the desktop stack —
     * reset the desktop aspect-ratio so flex children drive height. */
    aspect-ratio: auto;
    height: auto;
    display: flex;
    gap: 12px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    overscroll-behavior-x: contain;
    -webkit-overflow-scrolling: touch;
    /* stretch — every card matches the tallest sibling so the carousel
     * row reads as a uniform set (same width via min(90vw, 400px) on
     * the card; same height via this stretch). Per "они одной высоты
     * и ширины на телефонной версии". The earlier flex-start kept
     * shorter copy compact at the cost of a ragged row. */
    align-items: stretch;
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
  /* aspect-ratio drives height so the card scales evenly with width.
   * 892 × 560 — bumped from 515 so cards read a touch taller on
   * desktop/tablet per "по высоте чуть больше карточки". Mobile
   * branch resets aspect-ratio: auto since cards are content-driven
   * inside the horizontal scroll. */
  aspect-ratio: 892 / 560;
  z-index: ${({ $index, $activeIdx, $total }) => {
    // circular distance behind active
    const behind = ($index - $activeIdx + $total) % $total;
    return behind === 0 ? $total + 1 : $total - behind;
  }};
  /* Peek = 48px on desktop (≥650). Was 44 (FeatureCardTab nominal height)
   * but the tab's actual rendered height is ~48 (14 top pad + 14px line
   * × 1.5 line-height + 14 bottom pad ≈ 49) so the middle card's tab
   * strip was being covered by 2-4px on the bottom. 48 keeps the full
   * coloured strip visible without leaking body content. Mobile uses its
   * own scroll layout — this only affects the desktop stack. */
  top: ${({ $index, $activeIdx, $total }) => {
    const behind = ($index - $activeIdx + $total) % $total;
    const totalSteps = $total - 1;
    const stepsForThis = totalSteps - behind;
    return `${stepsForThis * 48}px`;
  }};
  transform: ${({ $index, $activeIdx, $total }) => {
    const behind = ($index - $activeIdx + $total) % $total;
    if (behind === 0) return 'scale(1)';
    const scaleVal = 1 - behind * 0.03;
    return `scale(${scaleVal})`;
  }};
  /* Per-step horizontal inset bumped from 2.25% → 4% so the width
   * difference between stacked cards reads clearly (back card sits
   * 8% in from each side at desktop, ~36px). Per "разница между
   * карточками по ширине более видимой когда друг за другом". */
  margin-left: ${({ $index, $activeIdx, $total }) => {
    const behind = ($index - $activeIdx + $total) % $total;
    return `${behind * 4}%`;
  }};
  margin-right: ${({ $index, $activeIdx, $total }) => {
    const behind = ($index - $activeIdx + $total) % $total;
    return `${behind * 4}%`;
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
      const totalSteps = $total - 1;
      const stepsForThis = totalSteps - behind;
      if (behind === 0) {
        return `${totalSteps * 48}px`;
      }
      /* On hover back cards lift 10px so the user sees a small "lift"
       * gesture, but the tab-only contract stays — no body leaks. */
      return `${stepsForThis * 48 - 10}px`;
    }};
  }

  @media (max-width: 649px) {
    position: static;
    flex-direction: column;
    flex-shrink: 0;
    /* Reset the desktop aspect-ratio — mobile cards are content-driven
     * (vertical stack of tab + body + image) and must auto-size. */
    aspect-ratio: auto;
    /* Card width — next card peeks ~4% on the right (was 6%, dropped
     * because at certain widths the next card was reading too prominent).
     * Formula: card = (vw − 32) / 1.04. 500px cap freezes look at ~545+. */
    width: min(calc((100vw - 32px) / 1.04), 500px);
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
    /* Mobile bumped to radii.xl (20) — softer corners per "углы более
     * скруглые у карточек" (telephone version). Desktop keeps
     * radii['2xl'] (24). */
    border-radius: ${({ theme }) => theme.radii.xl};
    /* Transparent fill — per "оставь прозрачным фон не заливай ничем".
     * The colored outline still reads against the page background. */
    background: transparent;
    /* Border picks up each card's tab color (Functionality / Design /
     * Payment) — same logic as desktop so the mobile outline echoes the
     * tab dot. Soft 0.35 alpha keeps it readable without shouting. */
    border: 1px solid ${({ $color }) => {
      const hex = $color.replace('#', '');
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, 0.35)`;
    }} !important;
    /* Quiet single-layer shadow — was a heavier mobileCard token that
     * fought with the new colored border. !important needed because
     * the desktop box-shadow above is itself a function of $index/
     * $activeIdx and would otherwise win specificity. */
    box-shadow: 0 1px 2px rgba(26, 22, 19, 0.03), 0 6px 16px -6px rgba(26, 22, 19, 0.06) !important;
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
  /* Tab label colour = per-card $color × 0.55 (darkened tone). Echoes
   * the coloured dot/strip without going pastel-light, and stays readable
   * over the soft tinted tab background. Applied at all viewports
   * (desktop + mobile) so the colour treatment is consistent — the back
   * cards in the desktop stack now read with their card-color label too,
   * not the global dark text. FeatureTabTitle inherits via color: inherit. */
  color: ${({ $color }) => {
    const hex = $color.replace('#', '');
    const r = Math.round(parseInt(hex.slice(0, 2), 16) * 0.55);
    const g = Math.round(parseInt(hex.slice(2, 4), 16) * 0.55);
    const b = Math.round(parseInt(hex.slice(4, 6), 16) * 0.55);
    return `rgb(${r}, ${g}, ${b})`;
  }};

  /* Mobile — fixed window-style header: 44 height, 16 horizontal. */
  @media (max-width: 649px) {
    height: 44px;
    padding: 0 16px;
    font-size: 12px;
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
  /* Inherit colour from FeatureCardTab — that ancestor sets the tab
   * label tone (per-card $color × 0.55) at every viewport, so the
   * label here picks up the darkened card colour on both desktop and
   * mobile instead of the previous global dark text on desktop. */
  color: inherit;
  letter-spacing: -0.01em;
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
  /* padding-left 40 (was 36, +4) — overall body content area shrinks
   * by 4px on desktop. Combined with the text column +4 below, image
   * area gives up 8px to text + outer trim. Mobile padding override
   * below stays untouched. */
  padding: 0 0 0 40px;
  flex: 1;

  /* Mobile — symmetric 20 padding box (top/right/bottom/left). */
  @media (max-width: 649px) {
    flex-direction: column;
    padding: 20px;
    gap: 0;
  }
`;

const FeatureCardText = styled.div`
  /* Text column iteratively widened on desktop: 48 → 44 → 38 (+10
   * from original). The body needed the room for "Automations,
   * dashboards, pre-filled sections. Ready the moment you open it."
   * to wrap better. Image flex:1 absorbs the lost width. */
  flex: 0 0 calc(36% - 38px);
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: center;

  /* Mobile — text sits flush left under the tab. max-width caps the
   * line length so on wider mobile cards the title/desc don't stretch
   * edge-to-edge. 24px padding all around. */
  @media (max-width: 649px) {
    flex: 0 1 auto;
    align-self: flex-start;
    width: 100%;
    max-width: 320px;
    padding: 24px;
  }
`;

const FeatureCardTitle = styled.h3`
  font-size: 22px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  margin: 0 0 12px;
  line-height: 1.2;

  /* Mobile — fixed 16px headline (locked, not clamped) so the heading
   * reads at the same size on every phone width. */
  @media (max-width: 649px) {
    font-size: 16px;
    font-weight: ${({ theme }) => theme.typography.mobile.cardHeadline.weight};
    line-height: ${({ theme }) => theme.typography.mobile.cardHeadline.lineHeight};
    margin: 0 0 8px 0;
  }

  /* Narrow desktop-stack range (650–770) — title smaller (22 → 18) so
   * it sits proportionally inside the narrower card column. */
  @media (min-width: 650px) and (max-width: 770px) {
    font-size: 18px;
  }
`;

const FeatureCardDesc = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  line-height: 1.65;
  margin: 0;
  letter-spacing: -0.01em;

  /* Mobile — fixed 14px body (locked, not clamped). Pairs with the 16px
   * locked headline above for a stable 16/14 hierarchy on every phone. */
  @media (max-width: 649px) {
    font-size: 14px;
    font-weight: ${({ theme }) => theme.typography.mobile.cardBody.weight};
    line-height: ${({ theme }) => theme.typography.mobile.cardBody.lineHeight};
    color: ${({ theme }) => theme.colors.text.body};
    margin: 0 0 8px 0;
  }

  /* Narrow desktop-stack range (650–770) — drop body 14 → 13 so it
   * stays in proportion with the smaller title. */
  @media (min-width: 650px) and (max-width: 770px) {
    font-size: 13px;
  }
`;

const FeatureCardImage = styled.div`
  flex: 1;
  min-width: 0;
  align-self: stretch;
  /* % values keep the image's offset proportional to card width, so
   * the picture stays in the same relative position as the card scales
   * across 650px → 1200px. 4.5% ≈ 40px at the 892px reference width. */
  margin: 2.25% 0 0 -4.5%;
  overflow: hidden;
  border: none;
  background: transparent;
  position: relative;
  border-radius: ${({ theme }) => theme.radii['2xl']} 0 0 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;

    @media (max-width: 649px) {
      transform: scale(1.06);
      transform-origin: center;
    }
  }

  /* Mobile — 4:3 (taller than 16:10) so the iPad-mockup screenshots
   * fit without the bottom getting cropped. Radius bumped md → lg
   * (16) per "больше скругления у картинок внутренних". */
  @media (max-width: 649px) {
    margin: 0 0 4px 0;
    flex: 0 0 auto;
    height: auto;
    aspect-ratio: 4 / 3;
    min-height: 0;
    border-radius: ${({ theme }) => theme.radii.lg};
    background: transparent;
  }
`;

/* Mobile-only pagination dots that sit below the card carousel.
 * Active dot widens into a pill, matching common iOS carousel patterns. */
const Dots = styled.div`
  display: none;

  @media (max-width: 649px) {
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

  @media (max-width: 649px) {
    font-size: ${({ theme }) => theme.typography.mobile.sectionHeadline.size};
    font-weight: ${({ theme }) => theme.typography.mobile.sectionHeadline.weight};
    line-height: ${({ theme }) => theme.typography.mobile.sectionHeadline.lineHeight};
    /* Solo title (no subtitle) → cards = 16 (bodyToCards). */
    margin: 0 0 ${({ theme }) => theme.layout.mobile.bodyToCards};
  }

  @media (min-width: calc(${({ theme }) => theme.breakpoints.md} + 1px))
    and (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 32px;
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
    image: '/feature-payment.png',
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
              <FeatureCardImage>
                <img src={f.image} alt={f.tab} loading="lazy" />
              </FeatureCardImage>
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
