import { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { X } from 'lucide-react';

/**
 * Modal — unified overlay + dialog.
 *
 * Usage:
 *   <Modal open={open} onClose={() => setOpen(false)} title="Title" size="md">
 *     <p>Body content</p>
 *     <ModalFooter>
 *       <Button>...</Button>
 *     </ModalFooter>
 *   </Modal>
 *
 * Handles: ESC to close, click-outside to close, body scroll lock, focus lock-lite.
 * Sizes: sm (400), md (480), lg (600), xl (800)
 */

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  /** Hide the X close button */
  hideClose?: boolean;
  /** Disable click-outside to close */
  lockOutside?: boolean;
}

const sizeMap = { sm: 400, md: 480, lg: 600, xl: 800 };

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(16px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndex.modal};
  padding: 20px;
  animation: ${fadeIn} 0.2s ease;
`;

const Dialog = styled.div<{ $size: 'sm' | 'md' | 'lg' | 'xl' }>`
  background: ${({ theme }) => theme.colors.background.elevated};
  border-radius: 20px;
  box-shadow: ${({ theme }) => theme.shadows.modal};
  width: 100%;
  max-width: ${({ $size }) => sizeMap[$size]}px;
  max-height: calc(100vh - 40px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.25s cubic-bezier(0.2, 0.9, 0.3, 1);
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 24px 0;
`;

const TitleWrap = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  letter-spacing: -0.01em;
`;

const Subtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.body};
  margin: 4px 0 0;
  line-height: 1.5;
`;

const CloseBtn = styled.button`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 12px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.body};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.interactive.hover};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const Body = styled.div`
  padding: 20px 24px 24px;
  overflow-y: auto;
  flex: 1;
`;

export const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
`;

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  size = 'md',
  children,
  hideClose = false,
  lockOutside = false,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (lockOutside) return;
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <Dialog $size={size} role="dialog" aria-modal="true" aria-label={title}>
        {(title || !hideClose) && (
          <Header>
            <TitleWrap>
              {title && <Title>{title}</Title>}
              {subtitle && <Subtitle>{subtitle}</Subtitle>}
            </TitleWrap>
            {!hideClose && (
              <CloseBtn onClick={onClose} aria-label="Close">
                <X size={18} />
              </CloseBtn>
            )}
          </Header>
        )}
        <Body>{children}</Body>
      </Dialog>
    </Overlay>
  );
}
