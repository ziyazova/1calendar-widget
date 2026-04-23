import styled from 'styled-components';

/**
 * Card — minimal surface used by TemplateDetailPage. Accepts $variant,
 * $padding, $radius props. Kept intentionally small until the full DS
 * card spec is merged from the design-experiment branch.
 */

type CardVariant = 'flat' | 'outlined' | 'elevated';
type CardPadding = 'sm' | 'md' | 'lg';
type CardRadius = 'sm' | 'md' | 'lg' | 'xl';

const paddingMap: Record<CardPadding, string> = {
  sm: '12px',
  md: '16px',
  lg: '24px',
};

const radiusMap: Record<CardRadius, string> = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
};

export const Card = styled.div<{
  $variant?: CardVariant;
  $padding?: CardPadding;
  $radius?: CardRadius;
}>`
  background: ${({ theme }) => theme.colors.background.elevated};
  padding: ${({ $padding = 'md' }) => paddingMap[$padding]};
  border-radius: ${({ $radius = 'md' }) => radiusMap[$radius]};
  border: ${({ $variant = 'outlined', theme }) =>
    $variant === 'outlined' ? `1px solid ${theme.colors.border.light}` : 'none'};
  box-shadow: ${({ $variant = 'outlined', theme }) =>
    $variant === 'elevated' ? theme.shadows.medium : 'none'};
`;
