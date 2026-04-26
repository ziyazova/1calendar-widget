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

  /* Mobile — turn the gradient strip into a self-contained card.
   * Horizontal margin (= gutter) + bottom margin (= rhythm) + rounded
   * corners pop the CTA out of the surrounding surfaceAlt fill instead
   * of running edge-to-edge into the footer.
   * Comment c_mofyxs51 (2026-04-26): "должна быть заливка у этого блока
   * тоже с отступами и скруглениями". */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 56px ${({ theme }) => theme.layout.mobile.gutter};
    margin: 0 ${({ theme }) => theme.layout.mobile.gutter} 28px;
    border-radius: ${({ theme }) => theme.radii['2xl']};
    overflow: hidden;
  }
`;

const CTATitle = styled.h2`
  font-size: 40px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  margin: 0 0 8px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.mobile.sectionHeadline.size};
    font-weight: ${({ theme }) => theme.typography.mobile.sectionHeadline.weight};
    line-height: ${({ theme }) => theme.typography.mobile.sectionHeadline.lineHeight};
    margin-bottom: 0;
  }
`;

const CTASubtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.peach.muted};
  margin: 8px 0 32px;
  letter-spacing: -0.01em;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.mobile.sectionBody.size};
    font-weight: ${({ theme }) => theme.typography.mobile.sectionBody.weight};
    line-height: ${({ theme }) => theme.typography.mobile.sectionBody.lineHeight};
    margin: ${({ theme }) => theme.layout.mobile.titleToBody} 0 ${({ theme }) => theme.layout.mobile.bodyToCards};
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    width: 100%;
    max-width: 320px;
    margin: 0 auto;

    /* Match the md button size used elsewhere on mobile landing
     * (Explore all, Hero CTAs). Overrides lg from PrimaryButton/SecondaryButton. */
    & > * {
      width: 100%;
      height: 36px;
      padding: 0 16px;
      font-size: 13px;
      border-radius: 10px;
    }
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
        <CTASubtitle>20+ planners, ready to use. Starting from $8.</CTASubtitle>
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
