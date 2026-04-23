import styled from 'styled-components';
import {
  segmentTokens,
  segmentSize,
  segmentGroupSize,
  segmentTransition,
} from '../../themes/segmentTokens';

export const SegmentGroup = styled.div`
  display: inline-flex;
  gap: ${segmentSize.gap};
  padding: ${segmentGroupSize.outerPadding};
  background: ${segmentGroupSize.bg};
  border-radius: ${segmentGroupSize.outerRadius};
`;

export interface SegmentProps {
  $active: boolean;
}

export const Segment = styled.button<SegmentProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: ${segmentSize.height};
  padding: ${segmentSize.padding};
  border: none;
  border-radius: ${segmentSize.innerRadius};
  font-size: ${segmentSize.fontSize};
  font-weight: 600;
  font-family: inherit;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: ${segmentTransition};
  white-space: nowrap;

  ${({ $active }) => {
    const state = $active ? segmentTokens.active : segmentTokens.inactive;
    const hoverState = $active ? segmentTokens.active : segmentTokens.inactiveHover;
    return `
      background: ${state.bg};
      color: ${state.fg};
      box-shadow: ${state.shadow};

      &:hover {
        background: ${hoverState.bg};
        color: ${hoverState.fg};
        box-shadow: ${hoverState.shadow};
      }
    `;
  }}
`;
