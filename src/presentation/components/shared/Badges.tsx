import styled from 'styled-components';
import {
  labelVariantTokens,
  labelSizeTokens,
  labelLetterSpacing,
  labelTransition,
  planBadgeTokens,
  LabelVariant,
  LabelSize,
} from '../../themes/labelTokens';

export type { LabelVariant, LabelSize };

function baseCss(size: LabelSize) {
  const s = labelSizeTokens[size];
  return `
    display: inline-flex;
    align-items: center;
    gap: ${s.gap};
    height: ${s.height};
    padding: ${s.padding};
    border-radius: ${s.radius};
    font-size: ${s.fontSize};
    font-weight: ${s.fontWeight};
    letter-spacing: ${labelLetterSpacing};
    line-height: 1;
    text-transform: uppercase;
    border: 1px solid transparent;
    white-space: nowrap;
    transition: ${labelTransition};

    svg { width: ${s.iconSize}; height: ${s.iconSize}; }
  `;
}

function variantCss(variant: LabelVariant) {
  const v = labelVariantTokens[variant];
  const parts = [
    `background: ${v.bg};`,
    `color: ${v.fg};`,
  ];
  if (v.border) parts.push(`border: ${v.border};`);
  if (v.shadow) parts.push(`box-shadow: ${v.shadow};`);
  if (v.dot) {
    parts.push(`
      &::before {
        content: '';
        width: ${labelSizeTokens.md.dotSize};
        height: ${labelSizeTokens.md.dotSize};
        border-radius: 50%;
        background: currentColor;
        flex-shrink: 0;
        opacity: 0.7;
      }
    `);
  }
  return parts.join('\n');
}

/** Generic label — pick any variant from the token system. */
export const Label = styled.span<{ $variant?: LabelVariant; $size?: LabelSize }>`
  ${({ $size = 'md' }) => baseCss($size)}
  ${({ $variant = 'neutral' }) => variantCss($variant)}
`;

/* Named shortcuts — semantic wrappers for the variants used across the app. */

export const ProPill = styled(Label).attrs({ $variant: 'pro' as const })``;

export const FreePill = styled(Label).attrs({ $variant: 'free' as const })``;

export const NewPill = styled(Label).attrs({ $variant: 'new' as const })``;

export const LimitedPill = styled(Label).attrs({ $variant: 'limited' as const })``;

export const PopularPill = styled(Label).attrs({ $variant: 'popular' as const })`
  position: absolute;
  top: 12px;
  right: 12px;
`;

/* Plan indicator — Pro tints accent, Free tints sage. */
export const PlanPill = styled.span<{ $pro?: boolean }>`
  ${baseCss('md')}
  ${({ $pro }) => variantCss($pro ? 'pro' : 'free')}
`;

/* Compact plan badge — smaller (22px), gradient Pro fill, neutral Free. */
export const PlanBadge = styled.span<{ $pro?: boolean }>`
  display: inline-flex;
  align-items: center;
  height: ${labelSizeTokens.sm.height};
  padding: ${labelSizeTokens.sm.padding};
  border-radius: ${labelSizeTokens.sm.radius};
  font-size: ${labelSizeTokens.sm.fontSize};
  font-weight: ${labelSizeTokens.sm.fontWeight};
  letter-spacing: ${labelLetterSpacing};
  text-transform: uppercase;

  ${({ $pro }) => {
    const t = $pro ? planBadgeTokens.pro : planBadgeTokens.free;
    return `
      background: ${t.bg};
      color: ${t.fg};
      border: ${t.border};
      box-shadow: ${t.shadow};
    `;
  }}
`;

/* Tag — subtle inline category/metadata chip (lowercase, surface bg).
   Use for taxonomy markers like "planners", "student", "productivity" —
   NOT tier indicators (those use <Label $variant>). */
export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  background: ${({ theme }) => theme.colors.background.surface};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.01em;
  white-space: nowrap;
`;

/* OverlayBadge — glass chip pinned top-left of card art (e.g., "New"
   on a template card). Absolute-positioned, transparent white bg
   with backdrop blur. Use on top of images/previews. */
export const OverlayBadge = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 3px 8px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: 6px;
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  letter-spacing: -0.01em;
  white-space: nowrap;
`;

/* ── Legacy constants — re-exported for call-sites that still reference them. ── */

export const BADGE_ACCENT = '#6366F1';
export const BADGE_ACCENT_SOFT_BG = labelVariantTokens.pro.bg;
export const BADGE_ACCENT_TEXT = labelVariantTokens.pro.fg;
export const BADGE_NEUTRAL_BG = labelVariantTokens.neutral.bg;
export const BADGE_NEUTRAL_FG = labelVariantTokens.neutral.fg;
export const BADGE_OUTLINE = 'rgba(31, 31, 31, 0.12)';
export const BADGE_SAGE_BG = labelVariantTokens.free.bg;
export const BADGE_SAGE_TEXT = labelVariantTokens.free.fg;
export const BADGE_ROSE_BG = labelVariantTokens.new.bg;
export const BADGE_ROSE_TEXT = labelVariantTokens.new.fg;

export const badgeBase = baseCss('md');
