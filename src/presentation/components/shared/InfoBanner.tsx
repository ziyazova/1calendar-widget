import styled, { css } from 'styled-components';

/**
 * InfoBanner — neutral white card with a colored icon chip on the left.
 * Used for status messages that don't warrant a full GradientBanner
 * (embed copied, widget saved, Notion cache warning, etc).
 *
 * Tone changes ONLY the icon chip — body text stays theme-primary on a
 * white surface. Matches the `.banner.blue / .sage / .mute` rows from
 * the `06-banners` design mock.
 *
 *   <InfoBanner>
 *     <InfoBannerIcon $tone="sage"><Check /></InfoBannerIcon>
 *     <InfoBannerBody>
 *       <InfoBannerTitle>Widget saved</InfoBannerTitle>
 *       <InfoBannerSub>Synced to your account</InfoBannerSub>
 *     </InfoBannerBody>
 *   </InfoBanner>
 */

type InfoBannerTone = 'blue' | 'sage' | 'mute';

export const InfoBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  border-radius: 14px;
  padding: 14px 16px;
  background: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.hairline};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const toneStyles: Record<InfoBannerTone, ReturnType<typeof css>> = {
  blue: css`
    background: rgba(37, 99, 235, 0.10);
    border: 1px solid rgba(37, 99, 235, 0.28);
    color: #2563EB;
  `,
  sage: css`
    background: rgba(5, 150, 105, 0.10);
    border: 1px solid rgba(5, 150, 105, 0.28);
    color: #059669;
  `,
  mute: css`
    background: rgba(85, 96, 110, 0.08);
    border: 1px solid rgba(85, 96, 110, 0.22);
    color: #55606E;
  `,
};

export const InfoBannerIcon = styled.div<{ $tone?: InfoBannerTone }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg { width: 17px; height: 17px; stroke-width: 2; }

  ${({ $tone = 'blue' }) => toneStyles[$tone]}
`;

export const InfoBannerBody = styled.div`
  flex: 1;
  min-width: 0;
  line-height: 1.38;
`;

export const InfoBannerTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.008em;
`;

export const InfoBannerSub = styled.div`
  font-size: 12.5px;
  color: ${({ theme }) => theme.colors.text.body};
  margin-top: 2px;
`;
