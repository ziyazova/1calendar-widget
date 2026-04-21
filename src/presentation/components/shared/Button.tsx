import styled, { css } from 'styled-components';

/**
 * Button — single source of truth for every CTA on the site.
 *
 * Variants cover real usage across Studio/Login/Templates/Landing:
 *   primary   — dark neutral (#1F1F1F) — default CTA
 *   accent    — indigo gradient (#6366F1 → #818CF8) — Pro/Upgrade
 *   blue      — blue gradient (#3384F4 → #5BA0F7) — Copy/mobile CTA
 *   secondary — light surface + border
 *   outline   — transparent + border (paired with social/auth)
 *   ghost     — no bg, no border — nav links, inline actions
 *   danger    — soft red outline — delete/destructive
 *   success   — green solid — confirm/success
 *   link      — text-styled button (underline on hover)
 *
 * Sizes: xs (28) / sm (32) / md (36) / lg (44) / xl (48)
 *
 * Modifiers:
 *   $fullWidth — width: 100%
 *   $pill      — radius: 9999px
 *   $iconOnly  — square, no horizontal padding
 *
 * Legacy shortcuts (PrimaryButton / SecondaryButton) kept for back-compat.
 */

type ButtonVariant =
  | 'primary'
  | 'accent'
  | 'blue'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
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

const primaryStyles = css`
  background: ${({ theme }) => theme.colors.text.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);

  &:hover:not(:disabled) {
    background: #333;
  }
  &:active:not(:disabled) {
    transform: scale(0.99);
  }
`;

const accentStyles = css`
  background: ${({ theme }) => theme.colors.gradients.indigo};
  color: ${({ theme }) => theme.colors.text.inverse};
  border: none;
  box-shadow: ${({ theme }) => theme.colors.accentShadow.md};

  &:hover:not(:disabled) {
    filter: brightness(1.05);
    box-shadow: ${({ theme }) => theme.colors.accentShadow.lg};
  }
  &:active:not(:disabled) {
    transform: scale(0.99);
  }
`;

const blueStyles = css`
  background: ${({ theme }) => theme.colors.gradients.blue};
  color: ${({ theme }) => theme.colors.text.inverse};
  border: none;
  box-shadow: ${({ theme }) => theme.colors.blueShadow.md};

  &:hover:not(:disabled) {
    filter: brightness(1.05);
  }
  &:active:not(:disabled) {
    transform: scale(0.99);
  }
`;

const secondaryStyles = css`
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.light};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.background.surfaceMuted};
  }
`;

const outlineStyles = css`
  background: ${({ theme }) => theme.colors.background.elevated};
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.medium};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.background.surfaceAlt};
  }
`;

const ghostStyles = css`
  background: transparent;
  color: ${({ theme }) => theme.colors.text.body};
  border: none;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.interactive.hover};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const dangerStyles = css`
  background: transparent;
  color: ${({ theme }) => theme.colors.destructiveSoft};
  border: 1px solid ${({ theme }) => theme.colors.destructiveBorder};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.destructiveBg};
  }
`;

const successStyles = css`
  background: ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.text.inverse};
  border: none;
  box-shadow: ${({ theme }) => theme.colors.successShadow.md};

  &:hover:not(:disabled) {
    filter: brightness(1.05);
  }
`;

const linkStyles = css`
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  border: none;
  padding: 0;
  height: auto;
  font-weight: ${({ theme }) => theme.typography.weights.medium};

  &:hover:not(:disabled) {
    text-decoration: underline;
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
  success: successStyles,
  link: linkStyles,
};

/* ── Sizes ── */

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
  gap: 6px;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
  transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease,
              transform 0.15s ease, filter 0.15s ease;
  white-space: nowrap;
  text-decoration: none;

  /* Size */
  ${({ $size = 'md' }) => sizeMap[$size]}

  /* Variant */
  ${({ $variant = 'primary' }) => variantMap[$variant]}

  /* Semibold for primary/accent/blue (emphasis CTA) */
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
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
