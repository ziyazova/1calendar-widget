import React from 'react';
import styled from 'styled-components';
import { FeatureCardsSection } from './FeatureCardsSection';

const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;

  /* Mobile — inner padding 12 stacks on the outer Section's 28 to
   * give the spec'd 40 total vertical (28 + 12). Horizontal: 20
   * gutter token. Result reads as a 40/20 box around content. */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 12px ${({ theme }) => theme.layout.mobile.gutter};
  }
`;

const Header = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    /* Header bottom = 0; Subtitle's margin-bottom (28) drives Header
     * → cards. Title margin-bottom (12) drives Title → Subtitle. */
    margin-bottom: 0;
    gap: 0;
  }
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  /* Mobile — gap zeroed; spacing comes from Title margin-bottom (12)
   * and Subtitle margin-bottom (28). */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 0;
  }
`;

const Title = styled.h2`
  font-size: 40px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  margin: 0;
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.mobile.sectionHeadline.size};
    font-weight: ${({ theme }) => theme.typography.mobile.sectionHeadline.weight};
    line-height: ${({ theme }) => theme.typography.mobile.sectionHeadline.lineHeight};
    /* Title → Subtitle = 8 (titleToBody) — unified with the rest of
     * the landing (HowItWorks/Testimonials/CTA all use 8). */
    margin: 0 0 ${({ theme }) => theme.layout.mobile.titleToBody} 0;
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.peach.muted};
  margin: 8px 0 0;
  text-align: center;
  letter-spacing: -0.01em;

  /* Mobile — sectionBody token + bodyToCards margin-bottom for the
   * gap to the carousel. Unified with the rest of the landing. */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.mobile.sectionBody.size};
    font-weight: ${({ theme }) => theme.typography.mobile.sectionBody.weight};
    line-height: ${({ theme }) => theme.typography.mobile.sectionBody.lineHeight};
    margin: 0 0 ${({ theme }) => theme.layout.mobile.bodyToCards} 0;
  }
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const WIDGET_CATS = ['Featured', 'Calendar', 'Clocks', 'Boards', 'Buttons'];

interface WidgetStudioSectionProps {
  onNavigate: (path: string) => void;
}

export const WidgetStudioSection: React.FC<WidgetStudioSectionProps> = ({ onNavigate }) => {
  return (
    <Section data-ux="Widgets Section">
      <Header>
        <TitleRow>
          <Title>Why people love Peachy</Title>
          <Subtitle>Aesthetic and organized. Finally, both.</Subtitle>
        </TitleRow>
      </Header>
      <FeatureCardsSection />
    </Section>
  );
};
