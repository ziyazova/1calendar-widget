import styled from 'styled-components';
import {
  filterChipTokens,
  filterChipSize,
  filterChipShape,
  filterChipTransition,
  FilterChipShape,
} from '../../themes/filterChipTokens';

export const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

interface FilterChipProps {
  $active: boolean;
  $shape?: FilterChipShape;
}

export const FilterChip = styled.button<FilterChipProps>`
  flex-shrink: 0;
  white-space: nowrap;
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  letter-spacing: -0.01em;
  transition: ${filterChipTransition};
  height: ${filterChipSize.height};
  padding: ${filterChipSize.padding};
  font-size: ${filterChipSize.fontSize};
  border-radius: ${({ $shape = 'rect' }) => filterChipShape[$shape]};

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
`;
