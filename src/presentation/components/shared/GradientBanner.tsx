import styled, { css } from 'styled-components';

/**
 * GradientBanner — soft gradient info/upsell strips.
 * Used for: Pro upgrade nudges, "New" announcements, onboarding tips.
 *
 * Tones:
 *   indigo  — brand accent (default) — Pro upsell
 *   blue    — informational / copy embed ready
 *   soft    — white→cream wash — neutral info
 *   sage    — success / published
 *
 * Emphasis:
 *   subtle  — low-opacity gradient (default, for inline banners)
 *   strong  — full-color gradient + white text (for hero CTAs)
 */

type BannerTone = 'indigo' | 'blue' | 'soft' | 'sage';
type BannerEmphasis = 'subtle' | 'strong';

interface BannerTransientProps {
  $tone?: BannerTone;
  $emphasis?: BannerEmphasis;
  $inline?: boolean;
}

const subtleMap: Record<BannerTone, ReturnType<typeof css>> = {
  indigo: css`
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(129, 140, 248, 0.04));
    border: 1px solid rgba(99, 102, 241, 0.15);
    color: ${({ theme }) => theme.colors.text.primary};
  `,
  blue: css`
    background: linear-gradient(135deg, rgba(51, 132, 244, 0.08), rgba(91, 160, 247, 0.04));
    border: 1px solid rgba(51, 132, 244, 0.15);
    color: ${({ theme }) => theme.colors.text.primary};
  `,
  soft: css`
    background: ${({ theme }) => theme.colors.gradients.softBanner};
    border: 1px solid ${({ theme }) => theme.colors.border.light};
    color: ${({ theme }) => theme.colors.text.primary};
  `,
  sage: css`
    background: linear-gradient(135deg, rgba(102, 168, 92, 0.08), rgba(102, 168, 92, 0.04));
    border: 1px solid rgba(102, 168, 92, 0.2);
    color: ${({ theme }) => theme.colors.text.primary};
  `,
};

const strongMap: Record<BannerTone, ReturnType<typeof css>> = {
  indigo: css`
    background: ${({ theme }) => theme.colors.gradients.indigo};
    border: none;
    color: ${({ theme }) => theme.colors.text.inverse};
  `,
  blue: css`
    background: ${({ theme }) => theme.colors.gradients.blue};
    border: none;
    color: ${({ theme }) => theme.colors.text.inverse};
  `,
  soft: css`
    background: ${({ theme }) => theme.colors.background.elevated};
    border: 1px solid ${({ theme }) => theme.colors.border.medium};
    color: ${({ theme }) => theme.colors.text.primary};
  `,
  sage: css`
    background: ${({ theme }) => theme.colors.success};
    border: none;
    color: ${({ theme }) => theme.colors.text.inverse};
  `,
};

export const GradientBanner = styled.div<BannerTransientProps>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: ${({ $inline }) => ($inline ? '10px 14px' : '16px 20px')};
  border-radius: ${({ $inline }) => ($inline ? '12px' : '16px')};
  font-size: 13px;
  line-height: 1.5;

  ${({ $tone = 'indigo', $emphasis = 'subtle' }) =>
    $emphasis === 'strong' ? strongMap[$tone] : subtleMap[$tone]}
`;

export const BannerIcon = styled.div<{ $tone?: BannerTone }>`
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  ${({ $tone = 'indigo' }) =>
    $tone === 'indigo'
      ? css`
          background: rgba(99, 102, 241, 0.15);
          color: #6366F1;
        `
      : $tone === 'blue'
      ? css`
          background: rgba(51, 132, 244, 0.15);
          color: #3384F4;
        `
      : $tone === 'sage'
      ? css`
          background: rgba(102, 168, 92, 0.15);
          color: #3E7A2F;
        `
      : css`
          background: rgba(0, 0, 0, 0.05);
          color: ${({ theme }) => theme.colors.text.primary};
        `}
`;

export const BannerBody = styled.div`
  flex: 1;
  min-width: 0;
`;

export const BannerTitle = styled.div`
  font-weight: 600;
  font-size: 13px;
  letter-spacing: -0.01em;
`;

export const BannerText = styled.div`
  font-size: 12px;
  opacity: 0.85;
  margin-top: 2px;
`;

export const BannerActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;
