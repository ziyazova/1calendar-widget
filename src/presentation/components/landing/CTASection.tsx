import React from 'react';
import styled from 'styled-components';
import { PrimaryButton, SecondaryButton } from '../shared/Button';

const CTASectionWrap = styled.section`
  width: 100%;
`;

const CTACard = styled.div`
  background: linear-gradient(150deg, rgba(237, 228, 255, 0.4) 0%, rgba(232, 237, 255, 0.36) 25%, rgba(238, 234, 255, 0.32) 50%, rgba(245, 235, 250, 0.36) 75%, rgba(255, 240, 245, 0.4) 100%);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border-radius: 0;
  padding: 170px 48px 170px;
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
        <CTATitle>Your Notion is waiting.</CTATitle>
        <CTASubtitle>50+ templates, ready to use. Starting from $8.</CTASubtitle>
        <ButtonRow>
          <PrimaryButton onClick={onBrowseTemplates}>
            Shop Templates
          </PrimaryButton>
          <SecondaryButton onClick={onExploreWidgets} style={{ background: '#fff' }}>See Widgets</SecondaryButton>
        </ButtonRow>
      </CTACard>
    </CTASectionWrap>
  );
};
