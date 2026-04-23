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
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.background.surfaceMuted};
  border: 1px solid transparent;
  color: ${({ $open, theme }) => $open ? theme.colors.text.primary : theme.colors.text.secondary};
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
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.background.page},
                0 0 0 4px rgba(99, 102, 241, 0.5);
  }

  @media (max-width: 768px) {
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
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), color 0.2s;
  transform: ${({ $open }) => $open ? 'rotate(180deg)' : 'rotate(0)'};
  stroke-width: ${({ $open }) => $open ? 2.2 : 2};
`;

const avatarDropIn = keyframes`
  from { opacity: 0; transform: translateY(-10px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

export const AccountDropdown = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: -8px;
  z-index: 100;
  width: 264px;
  padding: 10px;
  background: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.floating};
  display: flex;
  flex-direction: column;
  gap: 0;
  animation: ${avatarDropIn} 0.28s cubic-bezier(0.22, 1, 0.36, 1);
`;

export const DropdownUserRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px 14px;
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
  color: ${({ theme }) => theme.colors.text.subtle};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const DropdownDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border.light};
  margin: 4px -2px 12px;
`;

export const DropdownSpacer = styled.div`
  height: 12px;
`;

export const DropdownMenuGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const ProPlanRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border-radius: 12px;
  background: rgba(99, 102, 241, 0.05);
  border: 1px solid ${({ theme }) => theme.colors.brand.indigo};
  box-shadow: 0 1px 2px rgba(99, 102, 241, 0.08);
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
    color: ${({ theme }) => theme.colors.brand.indigo};
    fill: ${({ theme }) => theme.colors.brand.indigo};
  }
`;

export const ProManageLink = styled.a`
  font-size: 13px;
  font-weight: 600;
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
  color: rgba(255, 255, 255, 0.88);
  letter-spacing: 0.01em;
`;
