import React from 'react';
import styled from 'styled-components';
import { PrimaryButton, SecondaryButton } from '../shared/Button';

const CTASectionWrap = styled.section`
  width: 100%;
`;

const CTACard = styled.div`
  background: linear-gradient(150deg, rgba(237, 228, 255, 0.7) 0%, rgba(232, 237, 255, 0.65) 25%, rgba(238, 234, 255, 0.6) 50%, rgba(245, 235, 250, 0.65) 75%, rgba(255, 240, 245, 0.7) 100%);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border-radius: 0;
  padding: 265px 48px 245px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  @media (max-width: 768px) {
    padding: 80px 24px;
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
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
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
      <CTACard>
        <CTATitle>Start building your workspace.</CTATitle>
        <CTASubtitle>Everything you need to make Notion yours.</CTASubtitle>
        <ButtonRow>
          <PrimaryButton onClick={onBrowseTemplates}>
            Browse Templates
          </PrimaryButton>
          <SecondaryButton onClick={onExploreWidgets} style={{ background: '#fff' }}>Explore Widgets</SecondaryButton>
        </ButtonRow>
      </CTACard>
    </CTASectionWrap>
  );
};
