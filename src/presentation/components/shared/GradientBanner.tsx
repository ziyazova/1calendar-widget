import styled, { css } from 'styled-components';

/**
 * GradientBanner — upsell + hero CTA strip with two emphasis levels.
 *
 * Tones:
 *   indigo  — brand accent (default) · Pro upsell, annual-billing CTA
 *   blue    — informational
 *   soft    — neutral / warm (cream)
 *   sage    — success / published
 *
 * Emphasis:
 *   subtle  — low-opacity tint (sits inline inside a page section)
 *   strong  — filled hero gradient + white text (standalone CTA row)
 *
 * Visuals follow the `06-banners` mock: flatter, calmer — no pink
 * shift on indigo, no extra inner glow. Keeps the indigo look aligned
 * with the brand accent in the rest of the app.
 */

type BannerTone = 'indigo' | 'blue' | 'soft' | 'sage';
type BannerEmphasis = 'subtle' | 'strong';

interface BannerTransientProps {
  $tone?: BannerTone;
  $emphasis?: BannerEmphasis;
  $inline?: boolean;
}

/* Subtle — flat low-opacity tint + thin matching border. Keeps body
 * text at theme text colour so content stays readable. Indigo is now
 * a solid `indigo-50` wash (not a 3-stop gradient) to match the mock. */
const subtleMap: Record<BannerTone, ReturnType<typeof css>> = {
  indigo: css`
    background: #EEF0FF;
    border: 1px solid rgba(99, 102, 241, 0.18);
    color: ${({ theme }) => theme.colors.text.primary};
  `,
  blue: css`
    background: #EFF4FF;
    border: 1px solid rgba(37, 99, 235, 0.18);
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
    background: #ECFDF3;
    border: 1px solid rgba(5, 150, 105, 0.22);
    color: ${({ theme }) => theme.colors.text.primary};
  `,
};

/* Strong — filled gradient + white text, hero CTA feel. Indigo uses
 * the same 2-stop `#5B5FE8 → #7A6DF0` gradient as the mock so the hero
 * matches the subtle variant's family colour exactly. */
const strongMap: Record<BannerTone, ReturnType<typeof css>> = {
  indigo: css`
    background: linear-gradient(100deg, #5B5FE8 0%, #7A6DF0 100%);
    border: none;
    color: ${({ theme }) => theme.colors.text.inverse};
    box-shadow:
      0 14px 36px -14px rgba(79, 70, 229, 0.5),
      0 2px 6px rgba(79, 70, 229, 0.14);
  `,
  blue: css`
    background: linear-gradient(100deg, #2563EB 0%, #3B82F6 100%);
    border: none;
    color: ${({ theme }) => theme.colors.text.inverse};
    box-shadow:
      0 14px 36px -14px rgba(37, 99, 235, 0.5),
      0 2px 6px rgba(37, 99, 235, 0.14);
  `,
  soft: css`
    background:
      linear-gradient(135deg, #FFF5EC 0%, #FFE8D6 50%, #FFDAC2 100%);
    border: 1px solid rgba(230, 170, 140, 0.35);
    color: ${({ theme }) => theme.colors.text.primary};
  `,
  sage: css`
    background: linear-gradient(100deg, #059669 0%, #10B981 100%);
    border: none;
    color: ${({ theme }) => theme.colors.text.inverse};
    box-shadow:
      0 14px 36px -14px rgba(16, 185, 129, 0.5),
      0 2px 6px rgba(16, 185, 129, 0.14);
  `,
};

export const GradientBanner = styled.div<BannerTransientProps>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: ${({ $emphasis }) => ($emphasis === 'strong' ? '18px 18px 18px 20px' : '14px 14px 14px 16px')};
  border-radius: ${({ $emphasis }) => ($emphasis === 'strong' ? '16px' : '14px')};

  ${({ $tone = 'indigo', $emphasis = 'subtle' }) =>
    $emphasis === 'strong' ? strongMap[$tone] : subtleMap[$tone]}
`;

/* Icon chip — two looks depending on where the banner sits.
 *
 *   subtle  → filled gradient chip with white icon + soft shadow
 *             (matches spec's `.upsell .icon` indigo gradient)
 *   strong  → semi-transparent white chip on the hero gradient
 *             (matches spec's `.hero .icon` with backdrop-blur)
 */
export const BannerIcon = styled.div<{ $tone?: BannerTone; $emphasis?: BannerEmphasis }>`
  flex-shrink: 0;
  width: ${({ $emphasis }) => ($emphasis === 'strong' ? '40px' : '38px')};
  height: ${({ $emphasis }) => ($emphasis === 'strong' ? '40px' : '38px')};
  border-radius: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;

  svg {
    width: ${({ $emphasis }) => ($emphasis === 'strong' ? '19px' : '18px')};
    height: ${({ $emphasis }) => ($emphasis === 'strong' ? '19px' : '18px')};
    stroke-width: 2;
  }

  ${({ $emphasis = 'subtle', $tone = 'indigo' }) => {
    if ($emphasis === 'strong') {
      /* semi-transparent white pill sitting on the gradient hero */
      return css`
        background: rgba(255, 255, 255, 0.22);
        border: 1px solid rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
      `;
    }
    /* subtle — filled gradient chip, white icon */
    if ($tone === 'indigo') return css`
      background: linear-gradient(135deg, #818CF8 0%, #6366F1 50%, #4F46E5 100%);
      box-shadow: 0 2px 6px rgba(79, 70, 229, 0.22);
    `;
    if ($tone === 'blue') return css`
      background: linear-gradient(135deg, #60A5FA 0%, #2563EB 100%);
      box-shadow: 0 2px 6px rgba(37, 99, 235, 0.22);
    `;
    if ($tone === 'sage') return css`
      background: linear-gradient(135deg, #34D399 0%, #059669 100%);
      box-shadow: 0 2px 6px rgba(16, 185, 129, 0.22);
    `;
    /* soft — warm peach gradient */
    return css`
      background: linear-gradient(135deg, #FFD9B8 0%, #F4A672 100%);
      color: #5A3402;
      box-shadow: 0 2px 6px rgba(244, 166, 114, 0.3);
    `;
  }}
`;

export const BannerBody = styled.div`
  flex: 1;
  min-width: 0;
  line-height: 1.38;
`;

export const BannerTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  letter-spacing: -0.008em;
`;

export const BannerText = styled.div`
  font-size: 12.5px;
  opacity: 0.82;
  margin-top: 2px;
`;

export const BannerActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;
