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
  $bleedTop?: boolean;
  $bleedBottom?: boolean;
}>`
  padding-top: ${({ $size = 'md', $bleedTop }) => ($bleedTop ? '0' : SECTION_Y[$size])};
  padding-bottom: ${({ $size = 'md', $bleedBottom }) => ($bleedBottom ? '0' : SECTION_Y[$size])};
  padding-left: 0;
  padding-right: 0;
  ${({ $tint, theme }) => $tint && `background: ${theme.colors.background.surfaceAlt};`}

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: ${({ $size = 'md', $bleedTop }) =>
      $bleedTop ? '0' : $size === 'flush' ? '0' : '48px'};
    padding-bottom: ${({ $size = 'md', $bleedBottom }) =>
      $bleedBottom ? '0' : $size === 'flush' ? '0' : '48px'};
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

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 72px 0 120px;
    gap: 24px;
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

      <Section $size="gap" $tint style={{ marginTop: '80px' }}>
        <TestimonialsSection />
      </Section>

      <Section $size="gap" $tint $bleedBottom>
        <CTASection onBrowseTemplates={goTemplates} onExploreWidgets={goWidgets} />
      </Section>

      <Section $size="gap" $tint $bleedTop $bleedBottom>
        <BigFooter onNavigate={(path) => navigate(path)} noDivider />
      </Section>
    </Page>
  );
};
