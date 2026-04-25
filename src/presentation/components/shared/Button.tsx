import styled, { css } from 'styled-components';
import {
  ButtonVariant,
  ButtonSize,
  ButtonStateTokens,
  buttonVariantTokens,
  buttonSizeTokens,
  sizePxMap,
  emphasisVariants,
  buttonTransition,
  buttonFocusRing,
} from '../../themes/buttonTokens';

/**
 * Button — renders a variant/size combo from `buttonTokens.ts`.
 *
 * This component is intentionally thin. All colors / gradients / shadows /
 * motion live in `src/presentation/themes/buttonTokens.ts` so a single edit
 * there ripples through every button on the site.
 *
 *   <Button $variant="primary" $size="lg" $fullWidth>Save</Button>
 *
 * Variants: primary / accent / blue / secondary / outline / ghost /
 *           danger / dangerStrong / success / link
 * Sizes:    xs (28) / sm (32) / md (36) / lg (44) / xl (48)
 * Modifiers: $fullWidth, $iconOnly
 */

export type { ButtonVariant, ButtonSize };

interface ButtonTransientProps {
  $variant?: ButtonVariant;
  $size?: ButtonSize;
  $fullWidth?: boolean;
  $iconOnly?: boolean;
}

/** Apply a state's tokens as CSS declarations. Omitted keys inherit from base. */
function stateCss(tokens: ButtonStateTokens | undefined) {
  if (!tokens) return '';
  const parts: string[] = [];
  if (tokens.bg !== undefined) parts.push(`background: ${tokens.bg};`);
  if (tokens.fg !== undefined) parts.push(`color: ${tokens.fg};`);
  if (tokens.border !== undefined) parts.push(`border: ${tokens.border};`);
  if (tokens.shadow !== undefined) parts.push(`box-shadow: ${tokens.shadow};`);
  if (tokens.transform !== undefined) parts.push(`transform: ${tokens.transform};`);
  if (tokens.fontWeight !== undefined) parts.push(`font-weight: ${tokens.fontWeight};`);
  return parts.join(' ');
}

/** Build the full variant CSS block from tokens. */
function variantCss(variant: ButtonVariant) {
  const v = buttonVariantTokens[variant];
  const base = stateCss(v.base);
  const hover = stateCss(v.hover);
  const active = stateCss(v.active);

  // Link variant gets special text-decoration treatment on hover (no bg change)
  if (variant === 'link') {
    return `
      ${base}
      border: none;
      padding: 0;
      height: auto;
      font-weight: 500;
      &:hover:not(:disabled) {
        text-decoration: underline;
        text-decoration-thickness: 1.5px;
        text-underline-offset: 3px;
        text-decoration-color: rgba(31, 31, 31, 0.4);
      }
    `;
  }

  return `
    ${base}
    ${!v.base.border ? 'border: none;' : ''}
    ${hover ? `&:hover:not(:disabled) { ${hover} }` : ''}
    ${active ? `&:active:not(:disabled) { ${active} }` : ''}
  `;
}

function sizeCss(size: ButtonSize) {
  const s = buttonSizeTokens[size];
  return `
    height: ${s.height};
    padding: ${s.padding};
    border-radius: ${s.radius};
    font-size: ${s.fontSize};
    svg { width: ${s.iconSize}; height: ${s.iconSize}; }
  `;
}

export const Button = styled.button<ButtonTransientProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  font-family: inherit;
  font-weight: ${({ $variant = 'primary' }) => emphasisVariants.has($variant) ? 600 : 500};
  letter-spacing: -0.01em;
  white-space: nowrap;
  text-decoration: none;
  position: relative;
  outline: none;
  transition: ${buttonTransition};

  /* Size */
  ${({ $size = 'md' }) => sizeCss($size)}

  /* Variant (from tokens) */
  ${({ $variant = 'primary' }) => variantCss($variant)}

  /* Modifiers */
  ${({ $fullWidth }) => $fullWidth && css`width: 100%;`}
  ${({ $iconOnly, $size = 'md' }) => $iconOnly && css`
    width: ${sizePxMap[$size]}px;
    padding: 0;
  `}

  /* Accessibility — double focus ring (page bg spacer + indigo halo) */
  &:focus-visible {
    box-shadow: ${buttonFocusRing};
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
