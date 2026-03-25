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

const Page = styled.div<{ $transitioning?: boolean }>`
  background: ${({ theme }) => theme.colors.background.page};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow-x: hidden;
`;

const PageContent = styled.div<{ $transitioning?: boolean }>`
  opacity: ${({ $transitioning }) => $transitioning ? 0 : 1};
  transition: opacity 0.4s ease;
`;

/* ── Section Groups ── */
/* Each group controls spacing between its children */

const GroupHero = styled.div`
  background: #FAFAFA;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/* Single variable controls all section spacing */
const SectionGroup = styled.div`
  padding: 56px 0;

  @media (max-width: 768px) {
    padding: 36px 0;
  }
`;

const SectionGroupTinted = styled.div`
  background: transparent;
  padding: 40px 0;
  margin: 36px 0;
  overflow: visible;

  @media (max-width: 768px) {
    padding: 20px 0;
    margin: 20px 0;
  }
`;

const BottomTinted = styled.div`
  background: #FAFAFA;
`;

const GroupFooter = styled.div`
  padding-top: 48px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    padding-top: 32px;
  }
`;

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [transitioning] = useState(false);

  return (
    <Page>
      <TopNav logoPressed={transitioning} onLogoClick={() => navigate('/')} logoSub="Planners" />
      <PageContent $transitioning={transitioning}>

        <GroupHero>
          <HeroSection onBrowseTemplates={() => navigate('/templates')} onExploreWidgets={() => navigate('/widgets')} />
          <CategoriesMarquee onNavigate={(path) => navigate(path)} />
        </GroupHero>

        <SectionGroupTinted>
          <TemplatesGallery onNavigate={(path) => navigate(path)} />
        </SectionGroupTinted>

        <SectionGroup>
          <WidgetStudioSection onNavigate={(path) => navigate(path)} />
        </SectionGroup>

        <SectionGroup>
          <HowItWorksSection />
        </SectionGroup>

        <BottomTinted>
          <SectionGroup>
            <TestimonialsSection />
          </SectionGroup>
        </BottomTinted>

        <SectionGroup>
          <CTASection onBrowseTemplates={() => navigate('/templates')} onExploreWidgets={() => navigate('/widgets')} />
        </SectionGroup>

        <GroupFooter>
          <BigFooter onNavigate={(path) => navigate(path)} />
        </GroupFooter>

      </PageContent>
    </Page>
  );
};
