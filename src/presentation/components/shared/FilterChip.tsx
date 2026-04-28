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
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  /* Phone — switch to horizontal scroll instead of wrapping. Standard
   * iOS / Android pattern (Apple Music, App Store, Spotify): chips stay
   * on one line, user swipes to reveal more. flex-wrap: nowrap +
   * overflow-x: auto, scrollbar hidden. Snap-type x proximity gives
   * each chip a soft anchor without forcing a hard snap on every drag.
   * Right-edge fade mask (same recipe as TemplatesMarqueeWrap on the
   * main landing): the last chip softly dissolves into the gutter,
   * signaling "more to the right" — applied unconditionally since
   * chips that fit fully need no fade and the mask cuts only the bleed
   * past 92%. */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-x: contain;
    scroll-snap-type: x proximity;
    mask-image: linear-gradient(to right, black 0%, black 92%, transparent 100%);
    -webkit-mask-image: linear-gradient(to right, black 0%, black 92%, transparent 100%);

    & > * { scroll-snap-align: start; }

    &::-webkit-scrollbar { display: none; }
    scrollbar-width: none;
  }
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
