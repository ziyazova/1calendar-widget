import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'lg';

interface ButtonTransientProps {
  $variant?: ButtonVariant;
  $size?: ButtonSize;
}

const primaryStyles = css<ButtonTransientProps>`
  background: ${({ theme }) => theme.colors.text.primary};
  color: #ffffff;
  border: none;
`;

const secondaryStyles = css<ButtonTransientProps>`
  background: ${({ theme }) => theme.colors.background.surface};
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const ghostStyles = css<ButtonTransientProps>`
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  border: none;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`;

const smStyles = css`
  height: 36px;
  padding: 0 18px;
  border-radius: ${({ theme }) => theme.radii.button};
  font-size: 13px;
`;

const lgStyles = css`
  height: 44px;
  padding: 0 24px;
  border-radius: 14px;
  font-size: 14px;

  @media (max-width: 768px) {
    height: 44px;
    font-size: 14px;
    border-radius: ${({ theme }) => theme.radii.md};
  }
`;

const variantMap = {
  primary: primaryStyles,
  secondary: secondaryStyles,
  ghost: ghostStyles,
};

const sizeMap = {
  sm: smStyles,
  lg: lgStyles,
};

/* Hover per variant+size */
const primarySmHover = css`
  &:hover {
    background: #333;
  }
`;

const primaryLgHover = css`
  &:hover {
    background: #3384F4;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(51, 132, 244, 0.2);
  }
`;

const secondaryHover = css`
  &:hover {
    background: #EBEBEB;
    transform: translateY(-2px);
  }
`;

export const Button = styled.button<ButtonTransientProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  letter-spacing: -0.01em;
  transition: all 0.2s ease;
  white-space: nowrap;

  svg {
    width: 14px;
    height: 14px;
  }

  /* Size */
  ${({ $size = 'sm' }) => sizeMap[$size]}

  /* Variant */
  ${({ $variant = 'primary' }) => variantMap[$variant]}

  /* Hover combos */
  ${({ $variant = 'primary', $size = 'sm' }) => {
    if ($variant === 'primary' && $size === 'lg') return primaryLgHover;
    if ($variant === 'primary') return primarySmHover;
    if ($variant === 'secondary') return secondaryHover;
    return '';
  }}

  /* lg primary/secondary get gap 8px and svg 16px */
  ${({ $size = 'sm' }) =>
    $size === 'lg' &&
    css`
      gap: 8px;
      svg {
        width: 16px;
        height: 16px;
      }
    `}

  /* lg primary uses the faster cubic-bezier transition */
  ${({ $variant = 'primary', $size = 'sm' }) =>
    $variant === 'primary' &&
    $size === 'lg' &&
    css`
      transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    `}
`;

/** Pre-configured variant shortcuts for backward compatibility */
export const PrimaryButton = styled(Button).attrs({
  $variant: 'primary' as const,
  $size: 'lg' as const,
})``;

export const SecondaryButton = styled(Button).attrs({
  $variant: 'secondary' as const,
  $size: 'lg' as const,
})``;
