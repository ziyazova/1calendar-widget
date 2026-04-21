import styled, { css } from 'styled-components';

/**
 * Button — single source of truth for every CTA on the site.
 *
 * Polish pass (owner + design-claude, standalone spec 01-buttons):
 *   - Apple spring cubic-bezier(0.22, 1, 0.36, 1) @ 0.2s for all transitions
 *   - Carved-depth primary (gradient + inset highlights top/bottom)
 *   - 3-stop indigo gradient on accent with inset highlights
 *   - Notion-style paper gradient on secondary
 *   - Solid colored-shadow on blue (#60A5FA) and success (#10B981)
 *   - Muted wine danger (#B85757), editorial restraint
 *   - Focus-visible ring for accessibility (double-ring pattern)
 *
 * Variants:
 *   primary      — carved black gradient, depth layered shadow — default CTA
 *   accent       — 3-stop indigo gradient, premium Pro/Upgrade CTA
 *   blue         — solid sky blue with colored shadow — copy/share
 *   secondary    — Notion paper gradient — neutral CTA
 *   outline      — transparent + border — paired with social/auth
 *   ghost        — subtle hover only — nav links, inline actions
 *   danger       — muted wine outline — reversible destructive
 *   dangerStrong — saturated red outline — irreversible (Delete account)
 *   success      — emerald fill + colored shadow — confirm/success
 *   link         — refined underline on hover
 *
 * Sizes: xs (28) / sm (32) / md (36) / lg (44) / xl (48)
 * Modifiers: $fullWidth, $pill, $iconOnly
 */

type ButtonVariant =
  | 'primary'
  | 'accent'
  | 'blue'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'dangerStrong'
  | 'success'
  | 'link';

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonTransientProps {
  $variant?: ButtonVariant;
  $size?: ButtonSize;
  $fullWidth?: boolean;
  $pill?: boolean;
  $iconOnly?: boolean;
}

/* ── Variants ── */

/* Primary — Apple-style carved black: top→bottom gradient + inset highlights
   (light on top, shadow on bottom) + layered outer depth shadow */
const primaryStyles = css`
  background: linear-gradient(180deg, #2A2A2A 0%, #1F1F1F 100%);
  color: ${({ theme }) => theme.colors.text.inverse};
  border: none;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3),
    0 1px 2px rgba(0, 0, 0, 0.08),
    0 2px 6px rgba(0, 0, 0, 0.08);

  &:hover:not(:disabled) {
    background: linear-gradient(180deg, #333333 0%, #262626 100%);
    transform: translateY(-0.5px);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.12),
      inset 0 -1px 0 rgba(0, 0, 0, 0.3),
      0 2px 4px rgba(0, 0, 0, 0.1),
      0 6px 14px rgba(0, 0, 0, 0.12);
  }
  &:active:not(:disabled) {
    background: linear-gradient(180deg, #1a1a1a 0%, #141414 100%);
    transform: translateY(0);
    box-shadow:
      inset 0 1px 2px rgba(0, 0, 0, 0.2),
      0 1px 2px rgba(0, 0, 0, 0.06);
  }
`;

/* Accent — 3-stop indigo gradient with matching inset highlights */
const accentStyles = css`
  background: linear-gradient(135deg, #6366F1 0%, #7079F4 50%, #818CF8 100%);
  color: ${({ theme }) => theme.colors.text.inverse};
  border: none;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.25),
    inset 0 -1px 0 rgba(79, 70, 229, 0.3),
    0 1px 2px rgba(99, 102, 241, 0.15),
    0 4px 12px rgba(99, 102, 241, 0.28);

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #5558EE 0%, #6872F0 50%, #7984F6 100%);
    transform: translateY(-0.5px);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.28),
      inset 0 -1px 0 rgba(79, 70, 229, 0.35),
      0 2px 4px rgba(99, 102, 241, 0.2),
      0 8px 24px rgba(99, 102, 241, 0.4);
  }
  &:active:not(:disabled) {
    background: linear-gradient(135deg, #4F46E5 0%, #5A5EE8 50%, #6B75ED 100%);
    transform: translateY(0);
    box-shadow:
      inset 0 1px 3px rgba(79, 70, 229, 0.3),
      0 1px 2px rgba(99, 102, 241, 0.15);
  }
`;

/* Blue — solid sky blue #60A5FA with colored shadow (modern, clean,
   no faux-3D edge). Matches Success treatment for visual family. */
const blueStyles = css`
  background: #60A5FA;
  color: #ffffff;
  border: none;
  box-shadow:
    0 1px 2px rgba(96, 165, 250, 0.24),
    0 4px 14px rgba(96, 165, 250, 0.32);

  &:hover:not(:disabled) {
    background: #4F97F5;
    transform: translateY(-0.5px);
    box-shadow:
      0 2px 4px rgba(96, 165, 250, 0.28),
      0 8px 22px rgba(96, 165, 250, 0.42);
  }
  &:active:not(:disabled) {
    background: #3B86EA;
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(96, 165, 250, 0.28);
  }
`;

/* Secondary — Notion paper gradient + hairline border + inset top highlight */
const secondaryStyles = css`
  background: linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%);
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);

  &:hover:not(:disabled) {
    background: linear-gradient(180deg, #FAFAFA 0%, #F5F5F5 100%);
    border-color: ${({ theme }) => theme.colors.border.medium};
    transform: translateY(-0.5px);
    box-shadow:
      0 2px 6px rgba(0, 0, 0, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }
  &:active:not(:disabled) {
    background: linear-gradient(180deg, #F0F0F0 0%, #EAEAEA 100%);
    transform: translateY(0);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
  }
`;

/* Outline — transparent with border. Subtle lift on hover. */
const outlineStyles = css`
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.medium};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.background.surfaceAlt};
    border-color: rgba(60, 60, 67, 0.25);
    transform: translateY(-0.5px);
  }
  &:active:not(:disabled) {
    background: ${({ theme }) => theme.colors.background.surfaceMuted};
    transform: translateY(0);
  }
`;

/* Ghost — subtle hover only. Notion-style restraint. */
const ghostStyles = css`
  background: transparent;
  color: ${({ theme }) => theme.colors.text.body};
  border: none;

  &:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.04);
    color: ${({ theme }) => theme.colors.text.primary};
  }
  &:active:not(:disabled) {
    background: rgba(0, 0, 0, 0.06);
  }
`;

/* Danger — muted wine outline, editorial restraint */
const dangerStyles = css`
  background: transparent;
  color: #B85757;
  border: 1px solid rgba(184, 87, 87, 0.22);

  &:hover:not(:disabled) {
    background: rgba(184, 87, 87, 0.06);
    border-color: rgba(184, 87, 87, 0.38);
    color: #A14848;
    transform: translateY(-0.5px);
    box-shadow: 0 2px 8px rgba(184, 87, 87, 0.12);
  }
  &:active:not(:disabled) {
    background: rgba(184, 87, 87, 0.1);
    transform: translateY(0);
    box-shadow: none;
  }
`;

/* dangerStrong — saturated red for irreversible actions
   (Delete account, Delete widget, Log out). Preserved from SIMPLIFICATION_PLAN §2.1. */
const dangerStrongStyles = css`
  background: transparent;
  color: ${({ theme }) => theme.colors.danger.strong};
  border: 1px solid ${({ theme }) => theme.colors.danger.border};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.danger.bg};
    transform: translateY(-0.5px);
    box-shadow: 0 2px 8px rgba(220, 38, 38, 0.12);
  }
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: none;
  }
`;

/* Success — solid emerald with colored shadow (mirrors blue treatment) */
const successStyles = css`
  background: #10B981;
  color: #ffffff;
  border: none;
  box-shadow:
    0 1px 2px rgba(16, 185, 129, 0.2),
    0 4px 14px rgba(16, 185, 129, 0.28);

  &:hover:not(:disabled) {
    background: #0EA472;
    transform: translateY(-0.5px);
    box-shadow:
      0 2px 4px rgba(16, 185, 129, 0.24),
      0 8px 22px rgba(16, 185, 129, 0.38);
  }
  &:active:not(:disabled) {
    background: #0B8D62;
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(16, 185, 129, 0.24);
  }
`;

/* Link — refined underline on hover */
const linkStyles = css`
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  border: none;
  padding: 0;
  height: auto;
  font-weight: ${({ theme }) => theme.typography.weights.medium};

  &:hover:not(:disabled) {
    text-decoration: underline;
    text-decoration-thickness: 1.5px;
    text-underline-offset: 3px;
    text-decoration-color: rgba(31, 31, 31, 0.4);
  }
`;

const variantMap: Record<ButtonVariant, ReturnType<typeof css>> = {
  primary: primaryStyles,
  accent: accentStyles,
  blue: blueStyles,
  secondary: secondaryStyles,
  outline: outlineStyles,
  ghost: ghostStyles,
  danger: dangerStyles,
  dangerStrong: dangerStrongStyles,
  success: successStyles,
  link: linkStyles,
};

/* ── Sizes ── */
/* Radii match the standalone spec: sm/md = 10px, lg/xl = 12px, xs = 8px. */

const xsStyles = css`
  height: 28px;
  padding: 0 12px;
  border-radius: 8px;
  font-size: 12px;
  svg { width: 12px; height: 12px; }
`;

const smStyles = css`
  height: 32px;
  padding: 0 14px;
  border-radius: 10px;
  font-size: 12px;
  svg { width: 14px; height: 14px; }
`;

const mdStyles = css`
  height: 36px;
  padding: 0 16px;
  border-radius: 10px;
  font-size: 13px;
  svg { width: 14px; height: 14px; }
`;

const lgStyles = css`
  height: 44px;
  padding: 0 20px;
  border-radius: 12px;
  font-size: 14px;
  svg { width: 16px; height: 16px; }
`;

const xlStyles = css`
  height: 48px;
  padding: 0 24px;
  border-radius: 12px;
  font-size: 14px;
  svg { width: 16px; height: 16px; }
`;

const sizeMap: Record<ButtonSize, ReturnType<typeof css>> = {
  xs: xsStyles,
  sm: smStyles,
  md: mdStyles,
  lg: lgStyles,
  xl: xlStyles,
};

const sizePxMap: Record<ButtonSize, number> = {
  xs: 28, sm: 32, md: 36, lg: 44, xl: 48,
};

/* ── Component ── */

export const Button = styled.button<ButtonTransientProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
  /* Apple-spring transitions — smoother than linear ease */
  transition:
    background 0.2s cubic-bezier(0.22, 1, 0.36, 1),
    color 0.2s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.2s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.2s cubic-bezier(0.22, 1, 0.36, 1);
  white-space: nowrap;
  text-decoration: none;
  position: relative;
  outline: none;

  /* Size */
  ${({ $size = 'md' }) => sizeMap[$size]}

  /* Variant */
  ${({ $variant = 'primary' }) => variantMap[$variant]}

  /* Semibold for filled emphasis variants */
  ${({ $variant = 'primary' }) =>
    ($variant === 'primary' || $variant === 'accent' || $variant === 'blue' || $variant === 'success') &&
    css`font-weight: 600;`}

  /* Full width */
  ${({ $fullWidth }) => $fullWidth && css`width: 100%;`}

  /* Pill */
  ${({ $pill }) => $pill && css`border-radius: 9999px;`}

  /* Icon-only square */
  ${({ $iconOnly, $size = 'md' }) => $iconOnly && css`
    width: ${sizePxMap[$size]}px;
    padding: 0;
  `}

  /* Focus-visible — accessible double ring */
  &:focus-visible {
    box-shadow:
      0 0 0 2px ${({ theme }) => theme.colors.background.page},
      0 0 0 4px rgba(99, 102, 241, 0.5);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none;
  }
`;

/* ── Legacy shortcuts (back-compat) ── */

export const PrimaryButton = styled(Button).attrs({
  $variant: 'primary' as const,
  $size: 'lg' as const,
})``;

export const SecondaryButton = styled(Button).attrs({
  $variant: 'secondary' as const,
  $size: 'lg' as const,
})``;
