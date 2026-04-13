import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';
import { HeroSection } from '../components/landing/HeroSection';
import { CategoriesMarquee } from '../components/landing/CategoriesMarquee';
import { TemplatesGallery } from '../components/landing/TemplatesGallery';
import { WidgetStudioSection } from '../components/landing/WidgetStudioSection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { CTASection } from '../components/landing/CTASection';
import { BigFooter } from '../components/landing/BigFooter';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';

const Page = styled.div`
  background: ${({ theme }) => theme.colors.background.page};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow-x: hidden;
`;

/* ── Consistent spacing: every section gets 80px top+bottom ── */

const Section = styled.div`
  padding: 80px 0;

  @media (max-width: 768px) {
    padding: 48px 0;
  }
`;

const SectionTinted = styled.div`
  background: #FAFAFA;
  padding: 80px 0 161px;

  @media (max-width: 768px) {
    padding: 64px 0;
  }
`;

const GroupHero = styled.div`
  background: linear-gradient(180deg, rgba(225, 230, 255, 0.55) 0%, rgba(235, 240, 255, 0.3) 50%, rgba(245, 245, 250, 0.06) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 0 0;
  gap: 64px;

  @media (max-width: 768px) {
    padding: 48px 0 32px;
    gap: 24px;
  }
`;

const GroupFooter = styled.div`
  background: #FAFAFA;
  padding: 64px 0 12px;

  @media (max-width: 768px) {
    padding: 64px 0 12px;
  }
`;

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Page>
      <TopNav logoPressed={false} onLogoClick={() => navigate('/')} logoSub="Planners" />

      <GroupHero>
        <HeroSection onBrowseTemplates={() => navigate('/templates')} onExploreWidgets={() => navigate('/widgets')} />
        <CategoriesMarquee onNavigate={(path) => navigate(path)} />
      </GroupHero>

      <Section style={{ padding: '120px 0 140px' }}>
        <TemplatesGallery onNavigate={(path) => navigate(path)} />
      </Section>

      <Section style={{ padding: '0' }}>
        <WidgetStudioSection onNavigate={(path) => navigate(path)} />
      </Section>

      <Section style={{ padding: '120px 0 140px' }}>
        <HowItWorksSection />
      </Section>

      <SectionTinted>
        <TestimonialsSection />
      </SectionTinted>

      <div style={{ background: '#FAFAFA' }}>
        <CTASection onBrowseTemplates={() => navigate('/templates')} onExploreWidgets={() => navigate('/widgets')} />
      </div>

      <GroupFooter>
        <BigFooter onNavigate={(path) => navigate(path)} noDivider />
      </GroupFooter>
    </Page>
  );
};
