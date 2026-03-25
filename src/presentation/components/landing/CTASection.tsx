import React from 'react';
import styled from 'styled-components';
import { PrimaryButton, SecondaryButton } from '../shared/Button';

const CTASectionWrap = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;

  @media (max-width: 768px) {
    padding: 0 24px;
  }
`;

const CTACard = styled.div`
  background: linear-gradient(135deg, #F0E6FF 0%, #E8EDFF 50%, #FFF0F5 100%);
  border-radius: 24px;
  padding: 64px 48px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 48px 24px;
    border-radius: 20px;
  }
`;

const CTATitle = styled.h2`
  font-size: 42px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  margin: 0 0 16px;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const CTASubtitle = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 8px 0 32px;
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
      <CTACard>
        <CTATitle>Start building your workspace.</CTATitle>
        <CTASubtitle>Explore templates or build your own widgets.</CTASubtitle>
        <ButtonRow>
          <PrimaryButton onClick={onBrowseTemplates}>
            Browse Templates
          </PrimaryButton>
          <SecondaryButton onClick={onExploreWidgets}>Explore Widgets</SecondaryButton>
        </ButtonRow>
      </CTACard>
    </CTASectionWrap>
  );
};
