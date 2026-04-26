import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';
// HeroSection (v1) временно скрыт — см. docs/ROADMAP.md "Hero V2 rollout".
// import { HeroSection } from '../components/landing/HeroSection';
import { HeroSectionV2 } from '../components/landing/HeroSectionV2';
import { TemplatesGallery } from '../components/landing/TemplatesGallery';
import { WidgetStudioSection } from '../components/landing/WidgetStudioSection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { CTASection } from '../components/landing/CTASection';
import { BigFooter } from '../components/landing/BigFooter';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';

/* ──────────────────────────────────────────────────────────────
   Vertical rhythm tokens. Единственный источник истины для
   вертикальных отступов секций лендинга. Меняешь здесь → везде.
   ────────────────────────────────────────────────────────────── */
const SECTION_Y = {
  flush: '0',
  sm: '48px',
  md: '80px',
  lg: '120px',
  /* gap: две соседние секции с $size="gap" дают 70+70 = 140px между контентом */
  gap: '70px',
} as const;

const Page = styled.div`
  background: ${({ theme }) => theme.colors.background.elevated};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow-x: hidden;
`;

const Section = styled.section<{
  $size?: keyof typeof SECTION_Y;
  $tint?: boolean;
  /* Soft lavender→peach gradient fill, applied on DESKTOP + TABLET
   * only. Used by Testimonials so the section reads as its own tonal
   * panel without committing to a hard $tint. Mobile stays transparent
   * (the tinted cards already define the band there). */
  $gradientFill?: boolean;
  /* $bleedTop / $bleedBottom — bleed on BOTH viewports (legacy).        */
  $bleedTop?: boolean;
  $bleedBottom?: boolean;
  /* $bleedTopDesktop / $bleedBottomDesktop — bleed on DESKTOP ONLY.
   * Mobile keeps its sectionPaddingY rhythm intact. Used when desktop
   * needs adjacent sections to flow seamlessly (e.g. CTA → Footer)
   * but mobile still needs the 72-gap rhythm. */
  $bleedTopDesktop?: boolean;
  $bleedBottomDesktop?: boolean;
  /* Optional desktop-only top margin. Used to push a section down on
   * desktop without disturbing the uniform mobile vertical rhythm. */
  $mtDesktop?: string;
}>`
  margin-top: ${({ $mtDesktop }) => $mtDesktop || '0'};
  padding-top: ${({ $size = 'md', $bleedTop, $bleedTopDesktop }) =>
    ($bleedTop || $bleedTopDesktop) ? '0' : SECTION_Y[$size]};
  padding-bottom: ${({ $size = 'md', $bleedBottom, $bleedBottomDesktop }) =>
    ($bleedBottom || $bleedBottomDesktop) ? '0' : SECTION_Y[$size]};
  padding-left: 0;
  padding-right: 0;
  ${({ $tint, theme }) => $tint && `background: ${theme.colors.background.surfaceAlt};`}
  ${({ $gradientFill }) => $gradientFill && `
    /* Faint lavender → peach panel — desktop + tablet only. Tuned soft
     * (alphas 0.08/0.06) so it reads as ambient tonal warmth, not a
     * coloured block. Applied to the OUTER section (this wrapper). */
    background: linear-gradient(
      180deg,
      rgba(198, 196, 245, 0.08) 0%,
      rgba(255, 218, 224, 0.06) 100%
    );
  `}

  /* Mobile — disable $gradientFill on phone (mobile is frozen). */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    ${({ $gradientFill }) => $gradientFill && `background: transparent;`}
  }

  /* Mobile vertical rhythm — single rule for ALL sections.
   * Both top and bottom = layout.mobile.sectionPaddingY (36) → adjacent
   * sections sum to 72. Hero's internal padding-bottom uses the same
   * token so Hero → first section also resolves to 72.
   * Only $bleedTop/$bleedBottom (BOTH-viewport bleeds) flatten to 0
   * here; $bleedTopDesktop/$bleedBottomDesktop are desktop-only and
   * deliberately do NOT affect mobile.
   * $mtDesktop is reset here so the desktop-only push doesn't leak. */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 0;
    padding-top: ${({ $size = 'md', $bleedTop, theme }) =>
      $bleedTop ? '0' : $size === 'flush' ? '0' : theme.layout.mobile.sectionPaddingY};
    padding-bottom: ${({ $size = 'md', $bleedBottom, theme }) =>
      $bleedBottom ? '0' : $size === 'flush' ? '0' : theme.layout.mobile.sectionPaddingY};
  }
`;

const Hero = styled.section<{ $v2?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0 80px;
  gap: 64px;
  overflow: hidden;
  ${({ $v2, theme }) => $v2 && `background: ${theme.colors.background.surfaceAlt};`}

  &::before {
    content: '';
    position: absolute;
    inset: -8%;
    background: ${({ $v2 }) =>
      $v2
        ? 'transparent'
        : `
      radial-gradient(ellipse 65% 55% at 15% 6%, rgba(255, 198, 212, 0.1) 0%, transparent 66%),
      radial-gradient(ellipse 55% 45% at 84% 16%, rgba(198, 196, 245, 0.09) 0%, transparent 68%),
      radial-gradient(ellipse 75% 55% at 50% 92%, rgba(188, 216, 240, 0.08) 0%, transparent 72%),
      linear-gradient(180deg, #FDFBFC 0%, #FDFCFB 55%, #FFFEFD 100%)`};
    -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 50%, transparent 100%);
    mask-image: linear-gradient(180deg, #000 0%, #000 50%, transparent 100%);
    pointer-events: none;
  }

  & > * {
    position: relative;
    z-index: 1;
  }

  /* Mobile — bottom padding 28 keeps the 56px gap rhythm with the first
   * Section (28 + 28 = 56). min-height 65vh adds breathing room around
   * the centered content (Eyebrow → Headline → Sub → CTAs) so the title
   * sits closer to the visual center of the tinted Hero zone instead
   * of crowding the top.
   * Comment c_mofyu744 (2026-04-26): "отцентруй контент в залитой зоне"
   * + follow-up "чуть больше воздуха в hero". */
  /* Mobile — outer wrapper gives full control to the inner
   * HeroSectionV2 styled section (its own padding box owns the entire
   * hero spacing). No padding/gap/min-height here so values don't
   * stack.
   * margin-bottom 20 → gap from Hero fill edge to Top Templates content
   * = 20 + 36 (Section padding-top) = 56. Iterated 72 → 52 → 20 → 56;
   * 20 read as cramped, 72 too loose, 56 sits as a comfortable middle.
   * One-off override; sectionPaddingY token (36) stays at 72-rhythm
   * for all other section→section pairs. */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0;
    gap: 0;
    min-height: 0;
    margin-bottom: 20px;
  }
`;

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const goTemplates = () => navigate('/templates');
  const goWidgets = () => navigate('/widgets');

  return (
    <Page>
      <TopNav logoPressed={false} onLogoClick={() => navigate('/')} logoSub="Planners" />

      <Hero $v2>
        <HeroSectionV2 onBrowseTemplates={goTemplates} onExploreWidgets={goWidgets} />
      </Hero>

      <Section $size="md">
        <TemplatesGallery onNavigate={(path) => navigate(path)} />
      </Section>

      {/* ниже — фиксированный ритм: 60+60 = 120px между соседними секциями */}
      <Section $size="gap">
        <WidgetStudioSection onNavigate={(path) => navigate(path)} />
      </Section>

      <Section $size="lg">
        <HowItWorksSection />
      </Section>

      <Section $size="gap" $mtDesktop="80px" $gradientFill>
        <TestimonialsSection />
      </Section>

      <Section $size="gap" $bleedTopDesktop $bleedBottomDesktop>
        <CTASection onBrowseTemplates={goTemplates} onExploreWidgets={goWidgets} />
      </Section>

      <Section $size="gap" $tint $bleedTopDesktop $bleedBottom>
        <BigFooter onNavigate={(path) => navigate(path)} noDivider />
      </Section>
    </Page>
  );
};
