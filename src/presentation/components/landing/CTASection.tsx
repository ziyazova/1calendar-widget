import React from 'react';
import styled from 'styled-components';

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
  color: #1F1F1F;
  letter-spacing: -0.03em;
  margin: 0 0 16px;
`;

const CTASubtitle = styled.p`
  font-size: 16px;
  color: #9A9A9A;
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

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  padding: 0 24px;
  background: #1F1F1F;
  color: #ffffff;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.01em;
  transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    background: #3384F4;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(51, 132, 244, 0.2);
  }

  svg { width: 16px; height: 16px; }

  @media (max-width: 768px) {
    height: 44px;
    font-size: 14px;
    border-radius: 12px;
  }
`;

const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0 24px;
  background: #F5F5F5;
  color: #1F1F1F;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.01em;
  transition: all 0.2s ease;

  &:hover {
    background: #EBEBEB;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    height: 44px;
    font-size: 14px;
    border-radius: 12px;
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
