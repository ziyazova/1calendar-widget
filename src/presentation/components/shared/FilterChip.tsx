import styled from 'styled-components';
import {
  FilterChipSize,
  filterChipTokens,
  filterChipSizeTokens,
  filterChipTransition,
} from '../../themes/filterChipTokens';

export type { FilterChipSize };

export const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

interface FilterChipProps {
  $active: boolean;
  $size?: FilterChipSize;
}

export const FilterChip = styled.button<FilterChipProps>`
  flex-shrink: 0;
  white-space: nowrap;
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  letter-spacing: -0.01em;
  transition: ${filterChipTransition};

  ${({ $size = 'md' }) => {
    const s = filterChipSizeTokens[$size];
    return `
      height: ${s.height};
      padding: ${s.padding};
      font-size: ${s.fontSize};
      border-radius: ${s.radius};
    `;
  }}

  ${({ $active }) => {
    const state = $active ? filterChipTokens.active : filterChipTokens.inactive;
    const hoverState = $active ? filterChipTokens.activeHover : filterChipTokens.inactiveHover;
    return `
      background: ${state.bg};
      color: ${state.fg};
      border: ${state.border};

      &:hover {
        background: ${hoverState.bg};
        color: ${hoverState.fg};
        border: ${hoverState.border};
      }
    `;
  }}

  @media (max-width: 768px) {
    ${({ $size = 'md' }) => {
      if ($size !== 'md') return '';
      const sm = filterChipSizeTokens.sm;
      return `height: ${sm.height}; padding: ${sm.padding}; font-size: ${sm.fontSize};`;
    }}
  }
`;
