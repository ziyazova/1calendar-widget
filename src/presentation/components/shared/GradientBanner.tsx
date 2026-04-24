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

/* 3-stop gradients with a subtle color shift give each tone depth and
   a bit of warmth — feels more modern than a single-hue fade. */
const subtleMap: Record<BannerTone, ReturnType<typeof css>> = {
  indigo: css`
    background:
      linear-gradient(135deg,
        rgba(139, 92, 246, 0.10) 0%,
        rgba(99, 102, 241, 0.07) 50%,
        rgba(236, 72, 153, 0.05) 100%);
    border: 1px solid rgba(99, 102, 241, 0.18);
    color: ${({ theme }) => theme.colors.text.primary};
  `,
  blue: css`
    background:
      linear-gradient(135deg,
        rgba(51, 132, 244, 0.10) 0%,
        rgba(91, 160, 247, 0.06) 55%,
        rgba(34, 211, 238, 0.05) 100%);
    border: 1px solid rgba(51, 132, 244, 0.18);
    color: ${({ theme }) => theme.colors.text.primary};
  `,
  soft: css`
    background:
      linear-gradient(135deg,
        rgba(255, 214, 196, 0.22) 0%,
        rgba(255, 240, 230, 0.12) 55%,
        rgba(255, 230, 220, 0.10) 100%);
    border: 1px solid rgba(230, 170, 140, 0.18);
    color: ${({ theme }) => theme.colors.text.primary};
  `,
  sage: css`
    background:
      linear-gradient(135deg,
        rgba(102, 168, 92, 0.10) 0%,
        rgba(134, 239, 172, 0.06) 50%,
        rgba(52, 211, 153, 0.05) 100%);
    border: 1px solid rgba(102, 168, 92, 0.22);
    color: ${({ theme }) => theme.colors.text.primary};
  `,
};

/* Strong = filled hero CTA. Add radial highlight + inset top-light to
   give the banner a soft "3D" feel rather than flat linear gradient. */
const strongMap: Record<BannerTone, ReturnType<typeof css>> = {
  indigo: css`
    background:
      radial-gradient(ellipse at top left, rgba(167, 139, 250, 0.45), transparent 60%),
      linear-gradient(135deg, #5B4EF2 0%, #7C3AED 50%, #C026D3 100%);
    border: none;
    color: ${({ theme }) => theme.colors.text.inverse};
    box-shadow:
      0 10px 28px rgba(99, 102, 241, 0.28),
      inset 0 1px 0 rgba(255, 255, 255, 0.18);
  `,
  blue: css`
    background:
      radial-gradient(ellipse at top left, rgba(125, 211, 252, 0.4), transparent 60%),
      linear-gradient(135deg, #2563EB 0%, #3B82F6 55%, #06B6D4 100%);
    border: none;
    color: ${({ theme }) => theme.colors.text.inverse};
    box-shadow:
      0 10px 28px rgba(37, 99, 235, 0.28),
      inset 0 1px 0 rgba(255, 255, 255, 0.18);
  `,
  soft: css`
    background:
      linear-gradient(135deg, #FFF5EC 0%, #FFE8D6 50%, #FFDAC2 100%);
    border: 1px solid rgba(230, 170, 140, 0.35);
    color: ${({ theme }) => theme.colors.text.primary};
  `,
  sage: css`
    background:
      radial-gradient(ellipse at top left, rgba(167, 243, 208, 0.4), transparent 60%),
      linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%);
    border: none;
    color: ${({ theme }) => theme.colors.text.inverse};
    box-shadow:
      0 10px 28px rgba(16, 185, 129, 0.26),
      inset 0 1px 0 rgba(255, 255, 255, 0.18);
  `,
};

export const GradientBanner = styled.div<BannerTransientProps>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: ${({ $inline }) => ($inline ? '12px 14px' : '16px 20px')};
  border-radius: ${({ $inline }) => ($inline ? '14px' : '16px')};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  line-height: 1.5;

  ${({ $tone = 'indigo', $emphasis = 'subtle' }) =>
    $emphasis === 'strong' ? strongMap[$tone] : subtleMap[$tone]}
`;

/* Icon chip — subtle internal gradient + inner highlight + soft outer glow
   in the tone's colour. Bigger (40px) with a rounded 14px radius. */
export const BannerIcon = styled.div<{ $tone?: BannerTone }>`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radii.lg};
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
    stroke-width: 2;
  }

  ${({ $tone = 'indigo' }) =>
    $tone === 'indigo'
      ? css`
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.28), rgba(99, 102, 241, 0.16));
          color: #5B4EF2;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.55),
            0 2px 8px rgba(99, 102, 241, 0.15);
        `
      : $tone === 'blue'
      ? css`
          background: linear-gradient(135deg, rgba(91, 160, 247, 0.28), rgba(51, 132, 244, 0.16));
          color: #2563EB;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.55),
            0 2px 8px rgba(51, 132, 244, 0.15);
        `
      : $tone === 'sage'
      ? css`
          background: linear-gradient(135deg, rgba(134, 239, 172, 0.32), rgba(102, 168, 92, 0.16));
          color: #059669;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.55),
            0 2px 8px rgba(16, 185, 129, 0.15);
        `
      : css`
          background: linear-gradient(135deg, rgba(255, 214, 196, 0.55), rgba(255, 230, 220, 0.32));
          color: #C2410C;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.7),
            0 2px 8px rgba(230, 170, 140, 0.15);
        `}
`;

export const BannerBody = styled.div`
  flex: 1;
  min-width: 0;
`;

export const BannerTitle = styled.div`
  font-weight: 600;
  font-size: ${({ theme }) => theme.typography.sizes.base};
  letter-spacing: -0.01em;
`;

export const BannerText = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  opacity: 0.75;
  margin-top: 2px;
`;

export const BannerActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;
