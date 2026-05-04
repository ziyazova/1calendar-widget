import styled, { keyframes } from 'styled-components';
import { ChevronDown } from 'lucide-react';

export const AccountPillWrap = styled.div`
  position: relative;
`;

export const AccountPill = styled.button<{ $open: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  padding: 4px 14px 4px 4px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.background.surfaceMuted};
  border: 1px solid transparent;
  color: ${({ $open, theme }) => $open ? theme.colors.text.primary : theme.colors.text.body};
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.01em;
  transition: ${({ theme }) => theme.transitions.spring};
  outline: none;

  &:hover {
    background: ${({ theme }) => theme.colors.interactive.active};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.background.elevated},
                0 0 0 4px rgba(99, 102, 241, 0.5);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 3px 12px 3px 3px;
    height: 36px;
  }
`;

export const PeachAvatar = styled.div<{ $size: number; $fontSize: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: ${({ $fontSize }) => $fontSize}px;
  font-weight: 700;
  letter-spacing: 0.02em;
  background: ${({ theme }) => theme.colors.gradients.avatarPeach};
  box-shadow: ${({ theme }) => theme.colors.avatarPeachShadow};
`;

export const PillChevron = styled(ChevronDown)<{ $open: boolean }>`
  width: 14px;
  height: 14px;
  color: ${({ $open, theme }) => $open ? theme.colors.text.hint : theme.colors.text.muted};
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), color ${({ theme }) => theme.transitions.medium};
  transform: ${({ $open }) => $open ? 'rotate(180deg)' : 'rotate(0)'};
  stroke-width: ${({ $open }) => $open ? 2.2 : 2};
`;

const avatarDropIn = keyframes`
  from { opacity: 0; transform: translateY(-10px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

export const AccountDropdown = styled.div`
  position: absolute;
  /* Tighter to the pill (8px gap) and flush-right with it — was
     right:-8px which pushed the panel past the pill's edge and read as
     misaligned. Now sits squarely under the right edge of the avatar. */
  top: calc(100% + 8px);
  right: 0;
  z-index: 100;
  width: 280px;
  /* Tight outer padding so rows breathe inside without the panel feeling
     bulky overall; rows define their own internal padding. */
  padding: 6px;
  background: ${({ theme }) => theme.colors.background.elevated};
  /* Hairline border + crisp three-layer shadow — quiet contact line,
     mid ambient, soft long shadow. Replaces the heavier popover token
     to match Linear / Vercel-style menu surfaces. */
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 8px 24px -4px rgba(0, 0, 0, 0.08),
    0 20px 40px -12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 0;
  animation: ${avatarDropIn} 0.24s cubic-bezier(0.22, 1, 0.36, 1);
`;

export const DropdownUserRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  /* Balanced padding — was 8px/10px/14px (extra-fat bottom). Now
     symmetric so the user row sits cleanly between top edge and the
     first divider. */
  padding: 10px;
`;

export const DropdownUserText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const DropdownName = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const DropdownEmail = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const DropdownDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border.hairline};
  margin: 8px 0;
`;

export const DropdownSpacer = styled.div`
  height: 8px;
`;

export const DropdownMenuGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

/* Clean row for the desktop avatar dropdown — mirrors the mobile menu's
   MobileLink (Linear / Notion / Vercel feel). Plain icon + label,
   subtle hover fill, no borders / gradients / chevrons. Replaces the
   <Button $variant="ghost"> usage that carried more chrome than needed. */
export const DropdownItem = styled.button<{ $active?: boolean; $danger?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ $active, $danger, theme }) =>
    $danger ? theme.colors.danger.strong
    : $active ? theme.colors.text.primary
    : theme.colors.text.body};
  background: ${({ $active }) => $active ? 'rgba(0,0,0,0.04)' : 'none'};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.015em;
  text-align: left;
  transition: background 140ms ease;

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    color: ${({ $danger, theme }) => $danger ? theme.colors.danger.strong : theme.colors.text.tertiary};
    stroke-width: 1.75;
  }

  &:hover {
    background: ${({ $danger }) => $danger ? 'rgba(220, 40, 40, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
  }
`;

/* Pro pill — flat, no accent border/bg/shadow. Reads as a quiet badge
   row, not a CTA. Manage link sits right-aligned. */
export const ProPlanRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.radii.md};
`;

export const ProPlanLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.brand.indigoDark};

  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.accent};
    fill: ${({ theme }) => theme.colors.accent};
  }
`;

export const ProManageLink = styled.a`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.brand.indigoDark};
  text-decoration: none;
  cursor: pointer;

  &:hover { text-decoration: underline; }
`;

export const UpgradeInner = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 12px;

  svg { width: 16px; height: 16px; }
`;

export const UpgradePrice = styled.span`
  font-size: 13px;
  font-weight: 600;
  /* Inherit text colour from the button variant (was hardcoded white,
     which disappeared when the dropdown switched from $variant="accent"
     to $variant="upgrade" — translucent indigo + white text became
     unreadable on a near-white background). */
  color: currentColor;
  opacity: 0.88;
  letter-spacing: 0.01em;
`;
