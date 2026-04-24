import styled, { css } from 'styled-components';

/**
 * Card — unified surface container.
 *
 * Variants:
 *   flat      — no border, no shadow. For grouped lists.
 *   outlined  — 1px border, no shadow. Default.
 *   elevated  — 1px border + soft shadow. Pricing cards, modals.
 *   subtle    — surfaceAlt bg, no border. Settings sections.
 *   interactive — outlined + hover lift. Template cards, clickable tiles.
 *
 * Padding tokens: none / sm (16) / md (20) / lg (24) / xl (32)
 * Radius tokens:  sm (10) / md (14) / lg (16) / xl (20)
 */

type CardVariant = 'flat' | 'outlined' | 'elevated' | 'subtle' | 'interactive';
type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';
type CardRadius = 'sm' | 'md' | 'lg' | 'xl';

interface CardTransientProps {
  $variant?: CardVariant;
  $padding?: CardPadding;
  $radius?: CardRadius;
  $fullWidth?: boolean;
}

const paddingMap: Record<CardPadding, string> = {
  none: '0',
  sm: '16px',
  md: '20px',
  lg: '24px',
  xl: '32px',
};

const radiusMap: Record<CardRadius, number> = {
  sm: 10,
  md: 14,
  lg: 16,
  xl: 20,
};

const flatStyles = css`
  background: ${({ theme }) => theme.colors.background.elevated};
  border: none;
`;

const outlinedStyles = css`
  background: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const elevatedStyles = css`
  background: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const subtleStyles = css`
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
  border: none;
`;

const interactiveStyles = css`
  background: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.medium}, box-shadow ${({ theme }) => theme.transitions.medium}, border-color ${({ theme }) => theme.transitions.medium};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
    border-color: ${({ theme }) => theme.colors.border.medium};
  }
`;

const variantMap: Record<CardVariant, ReturnType<typeof css>> = {
  flat: flatStyles,
  outlined: outlinedStyles,
  elevated: elevatedStyles,
  subtle: subtleStyles,
  interactive: interactiveStyles,
};

export const Card = styled.div<CardTransientProps>`
  border-radius: ${({ $radius = 'md' }) => radiusMap[$radius]}px;
  padding: ${({ $padding = 'md' }) => paddingMap[$padding]};
  ${({ $variant = 'outlined' }) => variantMap[$variant]}
  ${({ $fullWidth }) => $fullWidth && css`width: 100%;`}
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  letter-spacing: -0.01em;
`;

export const CardSubtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.body};
  margin: 4px 0 0;
  line-height: 1.5;
`;

export const CardSection = styled.div`
  & + & {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  }
`;
