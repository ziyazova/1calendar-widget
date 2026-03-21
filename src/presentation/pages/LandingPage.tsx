import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';
import { HeroSection } from '../components/landing/HeroSection';
import { CategoriesMarquee } from '../components/landing/CategoriesMarquee';
import { TemplatesGallery } from '../components/landing/TemplatesGallery';
import { WidgetStudioSection } from '../components/landing/WidgetStudioSection';
import { FeatureCardsSection } from '../components/landing/FeatureCardsSection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { CTASection } from '../components/landing/CTASection';
import { BigFooter } from '../components/landing/BigFooter';

const Page = styled.div<{ $transitioning?: boolean }>`
  background: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow-x: hidden;
`;

const PageContent = styled.div<{ $transitioning?: boolean }>`
  opacity: ${({ $transitioning }) => $transitioning ? 0 : 1};
  transition: opacity 0.4s ease;
`;

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [transitioning] = useState(false);

  return (
    <Page>
      <TopNav logoPressed={transitioning} onLogoClick={() => navigate('/')} logoSub="Planners" />
      <PageContent $transitioning={transitioning}>
        <HeroSection onBrowseTemplates={() => navigate('/templates')} onExploreWidgets={() => navigate('/widgets')} />
        <CategoriesMarquee onNavigate={(path) => navigate(path)} />
        <TemplatesGallery onNavigate={(path) => navigate(path)} />
        <WidgetStudioSection onNavigate={(path) => navigate(path)} />
        <FeatureCardsSection />
        <TestimonialsSection />
        <CTASection onBrowseTemplates={() => navigate('/templates')} onExploreWidgets={() => navigate('/widgets')} />
        <BigFooter onNavigate={(path) => navigate(path)} />
      </PageContent>
    </Page>
  );
};
