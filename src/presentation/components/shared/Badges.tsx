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

/* Compact plan badge — gradient Pro fill, neutral Free.
   $size: 'xs' (inline next to titles) | 'sm' (default, standalone). */
export const PlanBadge = styled.span<{ $pro?: boolean; $size?: 'xs' | 'sm' }>`
  display: inline-flex;
  align-items: center;
  height: ${({ $size = 'sm' }) => labelSizeTokens[$size].height};
  padding: ${({ $size = 'sm' }) => labelSizeTokens[$size].padding};
  border-radius: ${({ $size = 'sm' }) => labelSizeTokens[$size].radius};
  font-size: ${({ $size = 'sm' }) => labelSizeTokens[$size].fontSize};
  font-weight: ${({ $size = 'sm' }) => labelSizeTokens[$size].fontWeight};
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
export const Tag = styled.span<{ $accent?: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  /* $accent (logged-in studio cards) — airy translucent wash in deep
     indigo (#4F57C9) + same indigo at higher opacity for text, giving a
     muted-accent feel that harmonizes with the wash. No outline. Default
     — hairline border with body text. */
  background: ${({ $accent }) =>
    $accent ? 'rgba(79, 87, 201, 0.10)' : 'transparent'};
  border: 1px solid ${({ $accent, theme }) =>
    $accent ? 'transparent' : theme.colors.border.hairline};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ $accent, theme }) =>
    $accent ? 'rgba(79, 87, 201, 0.85)' : theme.colors.text.body};
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
