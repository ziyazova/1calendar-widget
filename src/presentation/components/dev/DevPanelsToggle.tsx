import styled from 'styled-components';
import { ChevronsRight, ChevronsLeft } from 'lucide-react';
import { useDevPanelsHidden, toggleDevPanelsHidden } from './useDevPanelsHidden';

/**
 * Master show/hide toggle for dev panels (BranchSwitcher + ClaudeFeedback).
 * Always visible so the panels are never stuck off-screen.
 */
export function DevPanelsToggle() {
  const hidden = useDevPanelsHidden();
  return (
    <Toggle
      $hidden={hidden}
      onClick={toggleDevPanelsHidden}
      aria-label={hidden ? 'Show dev panels' : 'Hide dev panels'}
      title={hidden ? 'Show dev panels' : 'Hide dev panels'}
      data-dev-ui
    >
      {hidden ? <ChevronsLeft /> : <ChevronsRight />}
    </Toggle>
  );
}

const Toggle = styled.button<{ $hidden: boolean }>`
  position: fixed;
  bottom: 16px;
  right: 16px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: ${({ theme }) => theme.radii.sm};
  /* When dev panels are HIDDEN (collapsed) → light frosted-glass surface
   * so the toggle reads as a quiet, unintrusive marker on the page.
   * When SHOWN → dark glass to match BranchSwitcher / DevPanel chrome. */
  background: ${({ $hidden }) =>
    $hidden ? 'rgba(255, 255, 255, 0.72)' : 'rgba(22, 22, 24, 0.68)'};
  @supports not (backdrop-filter: blur(0)) {
    background: ${({ $hidden }) =>
      $hidden ? 'rgba(255, 255, 255, 0.96)' : 'rgba(22, 22, 24, 0.96)'};
  }
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid ${({ $hidden }) =>
    $hidden ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)'};
  color: ${({ $hidden }) =>
    $hidden ? 'rgba(0, 0, 0, 0.55)' : 'rgba(255, 255, 255, 0.75)'};
  cursor: pointer;
  z-index: 2147483646;
  transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
  box-shadow: 0 6px 16px -4px rgba(0, 0, 0, ${({ $hidden }) => ($hidden ? '0.12' : '0.35')});

  svg {
    width: 14px;
    height: 14px;
    stroke-width: 2;
  }

  &:hover {
    background: ${({ $hidden }) =>
      $hidden ? 'rgba(255, 255, 255, 0.92)' : 'rgba(32, 32, 36, 0.82)'};
    color: ${({ $hidden }) => ($hidden ? '#000' : '#fff')};
    border-color: ${({ $hidden }) =>
      $hidden ? 'rgba(0, 0, 0, 0.14)' : 'rgba(255, 255, 255, 0.14)'};
  }
`;
