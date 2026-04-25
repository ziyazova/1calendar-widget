import { useEffect } from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';

/**
 * BottomSheet — mobile-first bottom-anchored sheet.
 *
 * Separate from <Modal> by design: different UX pattern (slides up from
 * bottom, prominent drag handle, sticks to viewport edge) and different
 * expectations (backdrop tap closes, but no focus lock / ESC handling
 * because it's typically used as a secondary surface on top of a fullscreen
 * mobile editor, not a modal dialog).
 *
 * Usage:
 *   <BottomSheet open={open} onClose={() => setOpen(false)} title="Customize">
 *     {children}
 *   </BottomSheet>
 *
 * Everything stays mounted (just translates off-screen when closed) so
 * transitions feel smooth both opening and closing.
 */

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** Cap on the sheet height; default 70vh. */
  maxHeight?: string;
  /** Capitalize the title (matches current Studio mobile-section usage). */
  capitalizeTitle?: boolean;
  /** Offset from the viewport bottom — useful when the page has a sticky
   *  bottom nav (e.g. Studio MobileSectionTabs) and the sheet should sit
   *  above it instead of covering it. Pass the tab bar height. */
  bottomOffset?: string;
  children: React.ReactNode;
}

const Backdrop = styled.div<{ $open: boolean; $bottomOffset: string }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  /* Stop the dim above any sticky bottom nav so tabs remain visible AND
     tappable while the sheet is open (tap a different tab → switches the
     sheet's content; tap the same tab → toggles closed). */
  bottom: ${({ $bottomOffset }) => $bottomOffset};
  background: rgba(0, 0, 0, 0.3);
  z-index: 39;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transition: opacity ${({ theme }) => theme.transitions.base};
`;

const Sheet = styled.div<{ $open: boolean; $maxHeight: string; $bottomOffset: string }>`
  position: fixed;
  left: 0;
  right: 0;
  bottom: ${({ $bottomOffset }) => $bottomOffset};
  max-height: ${({ $maxHeight }) => $maxHeight};
  background: ${({ theme }) => theme.colors.background.elevated};
  border-top: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 20px 20px 0 0;
  box-shadow: ${({ theme }) => theme.shadows.sheet};
  /* When closed we need to clear both the sheet's own height AND its
     bottom offset (otherwise on a sheet anchored above a tab bar the
     translation only hides the part above the tabs). */
  transform: ${({ $open, $bottomOffset }) =>
    $open ? 'translateY(0)' : `translateY(calc(100% + ${$bottomOffset}))`};
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 40;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* When anchored to viewport bottom (offset === 0), reserve safe-area
     padding ourselves. When sitting above a nav, the nav already handles
     its own safe-area, so we skip it. */
  padding-bottom: ${({ $bottomOffset }) => ($bottomOffset === '0px' ? 'env(safe-area-inset-bottom)' : '0')};
`;

const Handle = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 0 6px;
  flex-shrink: 0;

  &::after {
    content: '';
    width: 40px;
    height: 5px;
    border-radius: ${({ theme }) => theme.radii.xs};
    background: rgba(0, 0, 0, 0.15);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 20px 12px;
  flex-shrink: 0;
`;

const Title = styled.h3<{ $capitalize?: boolean }>`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
  ${({ $capitalize }) => $capitalize && 'text-transform: capitalize;'}
`;

const CloseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.interactive.hover};
  color: ${({ theme }) => theme.colors.text.hint};
  cursor: pointer;
  padding: 0;
  svg { width: 14px; height: 14px; }
`;

const Body = styled.div`
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
`;

export function BottomSheet({
  open,
  onClose,
  title,
  maxHeight = '70vh',
  capitalizeTitle = false,
  bottomOffset = '0px',
  children,
}: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      <Backdrop $open={open} $bottomOffset={bottomOffset} onClick={onClose} />
      <Sheet $open={open} $maxHeight={maxHeight} $bottomOffset={bottomOffset} aria-hidden={!open} role="dialog">
        <Handle />
        {title !== undefined && (
          <Header>
            <Title $capitalize={capitalizeTitle}>{title}</Title>
            <CloseBtn onClick={onClose} aria-label="Close">
              <X />
            </CloseBtn>
          </Header>
        )}
        <Body>{children}</Body>
      </Sheet>
    </>
  );
}
