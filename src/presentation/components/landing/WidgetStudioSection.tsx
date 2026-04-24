import React from 'react';
import styled from 'styled-components';
import { FeatureCardsSection } from './FeatureCardsSection';

const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 24px;
  }
`;

const Header = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-bottom: 20px;
  }
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const Title = styled.h2`
  font-size: 40px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  margin: 0;
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 28px;
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.peach.muted};
  margin: 0;
  text-align: center;
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
