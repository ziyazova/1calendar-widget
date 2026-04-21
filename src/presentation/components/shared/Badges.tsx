import styled from 'styled-components';

/*
  Unified badge system — single source of truth for tier/state labels
  (Pro / New / Free / Limited / Popular / Plan).

  Rationale (mirrors the original DS commentary):
  • One geometry for every badge — same radius, height, padding, type.
  • Two color families: brand accent (purple) and ink-neutral.
  • Visual differentiation comes from *texture* not more colors:
    leading dots, subtle outlines, gentle gradients.
  • No aggressive solid fills. The loudest variant is a soft-accent
    solid with hairline inner highlight, used at most once per screen.
*/

// Brand accent — project's #6E7FF2 (softer than #6366F1 vivid).
export const BADGE_ACCENT = '#6E7FF2';
export const BADGE_ACCENT_SOFT_BG = 'rgba(110, 127, 242, 0.1)';
export const BADGE_ACCENT_TEXT = '#4F57C9';

// Ink-neutral.
export const BADGE_NEUTRAL_BG = 'rgba(31, 31, 31, 0.05)';
export const BADGE_NEUTRAL_FG = '#4A433D';
export const BADGE_OUTLINE = 'rgba(31, 31, 31, 0.12)';

// Sage (Free / non-pro plan).
export const BADGE_SAGE_BG = 'rgba(102, 168, 92, 0.14)';
export const BADGE_SAGE_TEXT = '#3E7A2F';

// Rose (New).
export const BADGE_ROSE_BG = 'rgba(232, 155, 155, 0.16)';
export const BADGE_ROSE_TEXT = '#A85B5B';

export const badgeBase = `
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px;
  height: 28px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  line-height: 1;
  text-transform: uppercase;
  border: 1px solid transparent;
  white-space: nowrap;
  transition: background 0.15s ease, border-color 0.15s ease;

  svg { width: 12px; height: 12px; }
`;

// Leading dot — small visual rhythm marker for tinted variants.
const dotBefore = `
  &::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
    opacity: 0.7;
  }
`;

/* Premium tier — accent tint, no dot (cleanest). "This is premium." */
export const ProPill = styled.span`
  ${badgeBase}
  background: ${BADGE_ACCENT_SOFT_BG};
  color: ${BADGE_ACCENT_TEXT};
`;

/* One-per-screen highlight — minimal solid accent fill + white text.
   Positioned absolute top-right by default (matches the pricing-card usage);
   override via inline style when needed. */
export const PopularPill = styled.span`
  ${badgeBase}
  position: absolute;
  top: 12px;
  right: 12px;
  background: ${BADGE_ACCENT};
  color: #fff;
`;

/* Recently added — rose tint. Different hue from Pro so "new" reads as
   fresh/warm, not premium/gated. */
export const NewPill = styled.span`
  ${badgeBase}
  ${dotBefore}
  background: ${BADGE_ROSE_BG};
  color: ${BADGE_ROSE_TEXT};
`;

/* Limited — slate-blue tint. Fourth hue; calm, archival feel — suits
   "limited edition / ending soon" without urgency-orange. */
export const LimitedPill = styled.span`
  ${badgeBase}
  ${dotBefore}
  background: rgba(143, 166, 200, 0.16);
  color: #556B8C;
`;

/* Free — pleasant regular green. Muted enough to feel calm. */
export const FreePill = styled.span`
  ${badgeBase}
  background: ${BADGE_SAGE_BG};
  color: ${BADGE_SAGE_TEXT};
`;

/* Plan indicator — Pro uses accent tint, Free uses sage.
   Shared language across tier badges. */
export const PlanPill = styled.span<{ $pro?: boolean }>`
  ${badgeBase}
  background: ${({ $pro }) => ($pro ? BADGE_ACCENT_SOFT_BG : BADGE_SAGE_BG)};
  color: ${({ $pro }) => ($pro ? BADGE_ACCENT_TEXT : BADGE_SAGE_TEXT)};
`;

/* Compact plan badge — smaller (22px), bolder (gradient fill on Pro, neutral gray on Free).
   Used inside cards (Settings profile card, avatar-dropdown Pro status row) where PlanPill
   would read too large. Visually distinct from PlanPill — it's a chip inside a compound row,
   not a standalone indicator. */
export const PlanBadge = styled.span<{ $pro?: boolean }>`
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  ${({ $pro }) => $pro
    ? `color: #fff; background: linear-gradient(135deg, #6366F1, #818CF8); border: none; box-shadow: 0 1px 4px rgba(99,102,241,0.25);`
    : `color: #6E6E73; background: #F2F2EF; border: 1px solid rgba(0, 0, 0, 0.04);`}
`;
