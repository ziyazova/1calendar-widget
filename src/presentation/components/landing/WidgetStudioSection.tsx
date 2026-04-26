import React from 'react';
import styled from 'styled-components';
import { FeatureCardsSection } from './FeatureCardsSection';

const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 ${({ theme }) => theme.layout.mobile.gutter};
  }
`;

const Header = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    /* Header → cards = 16 (bodyToCards). Header internal gap unused
     * since TitleRow holds both Title and Subtitle. */
    margin-bottom: ${({ theme }) => theme.layout.mobile.bodyToCards};
    gap: 0;
  }
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  /* Mobile — Title → Subtitle = 8 (titleToBody), matching every other
   * section on the landing. Comment c_mog0zz5m (2026-04-26):
   * "у зедлайна и боди расстояние ни как у всех". */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.layout.mobile.titleToBody};
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
    font-size: ${({ theme }) => theme.typography.fluid.h2};
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.peach.muted};
  margin: 8px 0 0;
  text-align: center;
  letter-spacing: -0.01em;

  /* Mobile — reset margin-top so TitleRow's gap (12) is the only thing
   * controlling the headline → body distance. Avoids the gap+margin
   * stacking that made this section's spacing feel different. */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 14px;
    margin: 0;
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
