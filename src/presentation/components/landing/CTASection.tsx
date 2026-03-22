import React from 'react';
import styled from 'styled-components';
import { PrimaryButton, SecondaryButton } from '../shared/Button';

const CTASectionWrap = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 48px 100px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 60px 24px 80px;
  }
`;

const CTATitle = styled.h2`
  font-size: 36px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  margin: 0 0 16px;
`;

const CTASubtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0 0 32px;
  letter-spacing: -0.01em;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
  }
`;


interface CTASectionProps {
  onBrowseTemplates: () => void;
  onExploreWidgets: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onBrowseTemplates, onExploreWidgets }) => {
  return (
    <CTASectionWrap data-ux="CTA Section">
      <CTATitle>Ready to level up?</CTATitle>
      <CTASubtitle>Explore templates or build your own widgets — no sign up needed.</CTASubtitle>
      <ButtonRow>
        <PrimaryButton onClick={onBrowseTemplates}>
          Browse Templates
        </PrimaryButton>
        <SecondaryButton onClick={onExploreWidgets}>Explore Widgets</SecondaryButton>
      </ButtonRow>
    </CTASectionWrap>
  );
};
