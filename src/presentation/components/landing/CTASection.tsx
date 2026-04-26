import React from 'react';
import styled from 'styled-components';
import { PrimaryButton, SecondaryButton } from '../shared/Button';

const CTASectionWrap = styled.section`
  width: 100%;
`;

const CTACard = styled.div`
  /* Desktop — alphas bumped iteratively for contrast: 0.4 → 0.5 (+0.1)
   * → 0.56 (+0.06). Mobile reverts to original 0.4 alphas via @media
   * md so phone visuals stay frozen.
   * Comments: c_mogb4w3e ("на 10 процентов") + c_mogb9lg3 ("ещё
   * контрастнее на процентов 6"). */
  background: linear-gradient(150deg, rgba(237, 228, 255, 0.56) 0%, rgba(232, 237, 255, 0.52) 25%, rgba(238, 234, 255, 0.48) 50%, rgba(245, 235, 250, 0.52) 75%, rgba(255, 240, 245, 0.56) 100%);
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
    /* Mobile is frozen — keep the original gradient alphas (the
     * desktop +0.1 bump was a desktop-only ask). */
    background: linear-gradient(150deg, rgba(237, 228, 255, 0.4) 0%, rgba(232, 237, 255, 0.36) 25%, rgba(238, 234, 255, 0.32) 50%, rgba(245, 235, 250, 0.36) 75%, rgba(255, 240, 245, 0.4) 100%);
    padding: 56px ${({ theme }) => theme.layout.mobile.gutter};
    /* margin-bottom = sectionPaddingY (36). The visible CTA → Footer
     * gap is measured from the lavender BLOCK edge (not the inner
     * text) to the top of the footer's tinted band:
     *   CTACard.margin-bottom (36) + CTASection.padding-bottom (36) = 72.
     * Earlier 0 here gave only 36 — read as "less than 72" from the
     * block edge.
     * Last user note: "именно от блока не текста, тк щас кажется меньше". */
    margin: 0 ${({ theme }) => theme.layout.mobile.gutter}
      ${({ theme }) => theme.layout.mobile.sectionPaddingY};
    /* radii.xl (20) — "cardLg" tier for hero/CTA-level surfaces. Was
     * radii['2xl'] (24) which violated the mobile hierarchy invariant
     * (no element should exceed 20 except pills/avatars). Generic cards
     * stay at radii.lg (16); this big lavender block sits one notch
     * above. */
    border-radius: ${({ theme }) => theme.radii.xl};
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

/* Inline break — collapses to a single space on desktop (display: none
 * on a <br> renders nothing), drops the line on mobile so the two
 * sentences "20+ planners, ready to use." / "Starting from $8." stack.
 * Comment c_mog6zxpe: "сделай на телефоне каждое предложение с новой строки". */
const MobileBreak = styled.br`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    width: 100%;
    /* Drop max-width — full-width CTAs match Hero's xl-button pattern.
     * Bigger margin-top (20) gives the buttons real breathing room
     * above (subtitle's 20 below + this 20 = ~40 total air).
     * c_mog7znvh: "тут классические большие CTA как в хиро + мало
     * воздуха над ними". */
    margin: 20px 0 0;

    /* Hero-tier CTA size (xl): 44 height, 13 font, 12 radius. */
    & > * {
      width: 100%;
      height: 44px;
      padding: 0 20px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 12px;
    }

    /* "See Widgets" (secondary, nth-child 2) was white on a light
     * lavender card → blended into the background. Border + slightly
     * tinted bg gives it presence without competing with primary. */
    & > *:nth-child(2) {
      background: rgba(255, 255, 255, 0.8) !important;
      border: 1px solid rgba(0, 0, 0, 0.08);
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
        <CTASubtitle>
          20+ planners, ready to use.<MobileBreak />{' '}Starting from $8.
        </CTASubtitle>
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
