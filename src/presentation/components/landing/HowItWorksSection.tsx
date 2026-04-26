import React from 'react';
import styled from 'styled-components';
import { Search, CreditCard, Copy, Palette, SlidersHorizontal, Code } from 'lucide-react';
import { theme as peachyTheme } from '@/presentation/themes/theme';

const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 ${({ theme }) => theme.layout.mobile.gutter};
  }
`;

const SectionTitle = styled.h2`
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

const SectionSubtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.peach.muted};
  margin: 8px 0 24px;
  letter-spacing: -0.01em;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.mobile.sectionBody.size};
    font-weight: ${({ theme }) => theme.typography.mobile.sectionBody.weight};
    line-height: ${({ theme }) => theme.typography.mobile.sectionBody.lineHeight};
    /* Title → Subtitle = 8 (titleToBody); Subtitle → cards = 16. */
    margin: ${({ theme }) => theme.layout.mobile.titleToBody} 0 ${({ theme }) => theme.layout.mobile.bodyToCards};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.layout.mobile.cardGap};
  }
`;

const Card = styled.div<{ $bg: string }>`
  position: relative;
  background: ${({ $bg }) => $bg};
  background-size: 180% 180%;
  background-position: 50% 50%;
  backdrop-filter: blur(24px) saturate(140%);
  -webkit-backdrop-filter: blur(24px) saturate(140%);
  border: 1px solid rgba(150, 145, 175, 0.28);
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 220px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.6),
    inset 0 -1px 0 rgba(255, 255, 255, 0.2),
    0 2px 8px rgba(0, 0, 0, 0.03),
    0 12px 32px -12px rgba(0, 0, 0, 0.08);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 120% 80% at 20% 0%, rgba(255, 255, 255, 0.45) 0%, transparent 55%);
    pointer-events: none;
  }

  /* Mobile — list-row layout: icon left, text right.
   * Was vertical (icon-on-top, text-below); switched after c_mog2od8x
   * ("выровни слева а текст справа"). Reads as a compact step-list
   * rather than a stack of square tiles — the typical mobile pattern
   * for "How it works" sections.
   * - flex-direction: row + align-items: center
   * - min-height drops to auto (content drives it)
   * - radius radii.lg (16) per the earlier mobile-radii audit. */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    /* flex-start so the icon top-edge aligns with the title cap-line
     * instead of vertically centering against the desc-tail. */
    align-items: flex-start;
    /* 18 vertical (was 14) — adds a touch of breathing room around the
     * row content. Comment c_mog2y... ("карточки по высоте немного больше"). */
    padding: 18px 16px;
    min-height: 0;
    border-radius: ${({ theme }) => theme.radii.lg};
    gap: 14px;
  }
`;

const IconWrap = styled.div<{ $bg: string; $color: string }>`
  position: relative;
  z-index: 1;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;

  svg {
    width: 22px;
    height: 22px;
    color: ${({ $color }) => $color};
    stroke-width: 1.8;
  }

  /* Mobile — original 36×36 icon (was bumped to 52, looked heavy
   * against the short text block). Card keeps align-items: flex-start
   * so the 36 icon sits flush with the title cap-line, not floating
   * between title and desc. */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 36px;
    height: 36px;
    border-radius: ${({ theme }) => theme.radii.md};
    margin-top: 0;
    margin-bottom: 0;
    flex-shrink: 0;

    svg { width: 16px; height: 16px; }
  }
`;

const StepContent = styled.div`
  position: relative;
  z-index: 1;

  /* Mobile — flex 1 (fills row to right of icon), min-width 0 lets
   * the title ellipsize cleanly, padding-top 2 nudges text down so
   * the icon's top edge optically aligns with title cap-height. */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex: 1;
    min-width: 0;
    padding-top: 2px;
  }
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
  margin: 0 0 8px;

  /* Mobile — cardHeadline token (16/700/1.35). */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.mobile.cardHeadline.size};
    font-weight: ${({ theme }) => theme.typography.mobile.cardHeadline.weight};
    line-height: ${({ theme }) => theme.typography.mobile.cardHeadline.lineHeight};
  }
`;

const CardDesc = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.body};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  margin: 0;
  max-width: 240px;

  /* Mobile — cardBody token (14/400/1.5). */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.mobile.cardBody.size};
    font-weight: ${({ theme }) => theme.typography.mobile.cardBody.weight};
    line-height: ${({ theme }) => theme.typography.mobile.cardBody.lineHeight};
  }
`;

const CTA_GRADIENT = peachyTheme.colors.gradients.softBannerLarge;
const GRADIENTS = [CTA_GRADIENT, CTA_GRADIENT, CTA_GRADIENT];

const TEMPLATE_STEPS = [
  { icon: Search, bg: GRADIENTS[0], iconBg: 'rgba(255,255,255,0.9)', iconColor: '#1F1F1F', title: 'Pick your template', desc: 'Browse the collection. Find the one that fits your life.' },
  { icon: CreditCard, bg: GRADIENTS[1], iconBg: 'rgba(255,255,255,0.9)', iconColor: '#1F1F1F', title: 'Buy & download', desc: 'One-time payment. Files arrive instantly.' },
  { icon: Copy, bg: GRADIENTS[2], iconBg: 'rgba(255,255,255,0.9)', iconColor: '#1F1F1F', title: 'Duplicate to Notion', desc: 'One click. It\'s in your workspace. Ready to use.' },
];

const WIDGET_STEPS = [
  { icon: Palette, bg: GRADIENTS[0], iconBg: 'rgba(255,255,255,0.9)', iconColor: '#1F1F1F', title: 'Pick a widget', desc: 'Calendar, clock, or board. Choose your style.' },
  { icon: SlidersHorizontal, bg: GRADIENTS[1], iconBg: 'rgba(255,255,255,0.9)', iconColor: '#1F1F1F', title: 'Customize it', desc: 'Colors, fonts, sizes. Make it match your workspace.' },
  { icon: Code, bg: GRADIENTS[2], iconBg: 'rgba(255,255,255,0.9)', iconColor: '#1F1F1F', title: 'Embed in Notion', desc: 'Copy the link. Paste in Notion. Done.' },
];

interface HowItWorksProps {
  showTitle?: boolean;
  variant?: 'templates' | 'widgets';
}

export const HowItWorksSection: React.FC<HowItWorksProps> = ({ showTitle = true, variant = 'templates' }) => {
  const steps = variant === 'widgets' ? WIDGET_STEPS : TEMPLATE_STEPS;
  return (
  <Section data-ux="How It Works">
    {showTitle && (
      <>
        <SectionTitle>How it works</SectionTitle>
        <SectionSubtitle>Easy as that.</SectionSubtitle>
      </>
    )}
    <Grid>
      {steps.map(s => (
        <Card key={s.title} $bg={s.bg}>
          <IconWrap $bg={s.iconBg} $color={s.iconColor}><s.icon /></IconWrap>
          <StepContent>
            <CardTitle>{s.title}</CardTitle>
            <CardDesc>{s.desc}</CardDesc>
          </StepContent>
        </Card>
      ))}
    </Grid>
  </Section>
  );
};
