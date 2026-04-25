import { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Check, Info, AlertTriangle } from 'lucide-react';

/**
 * Toast — lightweight transient feedback pill.
 *
 * Usage:
 *   <Toast open={copied} tone="success" onClose={() => setCopied(false)}>
 *     Embed code copied
 *   </Toast>
 *
 * Auto-dismisses after `duration` ms (default 2000). Fixed to viewport
 * bottom-center. For permanent banners use <GradientBanner> instead.
 */

export type ToastTone = 'success' | 'info' | 'warning' | 'neutral';

interface ToastProps {
  open: boolean;
  onClose: () => void;
  tone?: ToastTone;
  duration?: number;
  icon?: React.ReactNode;
  /** Where the toast docks. Default `bottom`; `top` works in editors where
   *  bottom is busy (e.g. Studio's floating toolbar). */
  position?: 'top' | 'bottom';
  children: React.ReactNode;
}

const slideInBottom = keyframes`
  from { opacity: 0; transform: translate(-50%, 12px); }
  to   { opacity: 1; transform: translate(-50%, 0); }
`;

const slideInTop = keyframes`
  from { opacity: 0; transform: translate(-50%, -12px); }
  to   { opacity: 1; transform: translate(-50%, 0); }
`;

const toneMap: Record<ToastTone, { bg: string; fg: string; border: string; iconBg: string; iconFg: string }> = {
  success: {
    bg: 'rgba(16, 185, 129, 0.08)',
    fg: '#0B8D62',
    border: 'rgba(16, 185, 129, 0.22)',
    iconBg: 'rgba(16, 185, 129, 0.16)',
    iconFg: '#0B8D62',
  },
  info: {
    bg: 'rgba(51, 132, 244, 0.08)',
    fg: '#1F1F1F',
    border: 'rgba(51, 132, 244, 0.22)',
    iconBg: 'rgba(51, 132, 244, 0.16)',
    iconFg: '#1D4ED8',
  },
  warning: {
    bg: 'rgba(234, 179, 8, 0.1)',
    fg: '#713F12',
    border: 'rgba(234, 179, 8, 0.28)',
    iconBg: 'rgba(234, 179, 8, 0.18)',
    iconFg: '#854D0E',
  },
  neutral: {
    bg: 'rgba(0, 0, 0, 0.78)',
    fg: '#ffffff',
    border: 'transparent',
    iconBg: 'rgba(255, 255, 255, 0.12)',
    iconFg: '#ffffff',
  },
};

export const ToastShell = styled.div<{ $tone: ToastTone; $position?: 'top' | 'bottom' }>`
  position: fixed;
  left: 50%;
  ${({ $position }) =>
    $position === 'top'
      ? 'top: calc(16px + env(safe-area-inset-top));'
      : 'bottom: calc(32px + env(safe-area-inset-bottom));'}
  transform: translateX(-50%);
  z-index: ${({ theme }) => theme.zIndex.popover};
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 8px 16px 8px 8px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ $tone }) => toneMap[$tone].bg};
  color: ${({ $tone }) => toneMap[$tone].fg};
  border: 1px solid ${({ $tone }) => toneMap[$tone].border};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 8px 28px rgba(0, 0, 0, 0.12);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.01em;
  animation: ${({ $position }) => ($position === 'top' ? slideInTop : slideInBottom)} 0.22s cubic-bezier(0.22, 1, 0.36, 1);
`;

export const ToastIconBubble = styled.div<{ $tone: ToastTone }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ $tone }) => toneMap[$tone].iconBg};
  color: ${({ $tone }) => toneMap[$tone].iconFg};
  flex-shrink: 0;

  svg { width: 14px; height: 14px; }
`;

export const ToastMessage = styled.span`
  line-height: 1.3;
`;

const defaultIcon: Record<ToastTone, React.ReactNode> = {
  success: <Check />,
  info: <Info />,
  warning: <AlertTriangle />,
  neutral: <Info />,
};

export function Toast({ open, onClose, tone = 'success', duration = 2000, icon, position = 'bottom', children }: ToastProps) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [open, onClose, duration]);

  if (!open) return null;

  return (
    <ToastShell $tone={tone} $position={position} role="status" aria-live="polite">
      <ToastIconBubble $tone={tone}>{icon ?? defaultIcon[tone]}</ToastIconBubble>
      <ToastMessage>{children}</ToastMessage>
    </ToastShell>
  );
}

