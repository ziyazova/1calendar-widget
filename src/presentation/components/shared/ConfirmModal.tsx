import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal, ModalFooter } from './Modal';
import { Button } from './Button';

/**
 * ConfirmModal — generic confirmation dialog.
 *
 *   <ConfirmModal
 *     open={open}
 *     onClose={close}
 *     onConfirm={deleteWidget}
 *     eyebrow="Delete widget"
 *     tone="danger"
 *     title='Delete "Weekly Planner"?'
 *     message="The embed URL will stop working immediately. This can't be undone."
 *     confirmLabel="Delete"
 *   />
 *
 * Two modes:
 *  - simple     → Cancel + confirm button enabled
 *  - typeToConfirm="delete" → confirm button stays disabled until user types
 *                             the exact phrase. Used for account deletion.
 *
 * Tone `danger` paints the eyebrow red and uses the `dangerStrong` Button
 * variant for the confirm action. Tone `accent` (default) uses `primary`.
 */

export interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  eyebrow: string;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'accent' | 'danger';
  /** Require user to type this exact string to enable confirm (case-insensitive). */
  typeToConfirm?: string;
  /** Disable buttons while the action is running. */
  loading?: boolean;
  loadingLabel?: string;
}

const Message = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.body};
  line-height: 1.5;

  strong {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.weights.semibold};
  }
`;

const TypeInput = styled.input`
  width: 100%;
  height: 46px;
  padding: 0 14px;
  border: 1px solid ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
  outline: none;
  box-sizing: border-box;
  transition: border-color ${({ theme }) => theme.transitions.fast}, background ${({ theme }) => theme.transitions.fast};

  &::placeholder { color: ${({ theme }) => theme.colors.text.muted}; }
  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.background.elevated};
  }
`;

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  eyebrow,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'accent',
  typeToConfirm,
  loading = false,
  loadingLabel,
}) => {
  const [typed, setTyped] = useState('');

  // Reset the input whenever the modal (re)opens.
  useEffect(() => {
    if (open) setTyped('');
  }, [open]);

  const confirmVariant = tone === 'danger' ? 'dangerStrong' : 'primary';
  const canConfirm =
    !loading &&
    (!typeToConfirm || typed.trim().toLowerCase() === typeToConfirm.toLowerCase());

  return (
    <Modal
      open={open}
      onClose={() => !loading && onClose()}
      eyebrow={eyebrow}
      eyebrowTone={tone}
      title={title}
      size="sm"
      hideClose
    >
      <Message>{message}</Message>
      {typeToConfirm && (
        <TypeInput
          type="text"
          autoFocus
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder={`Type "${typeToConfirm}" to confirm`}
        />
      )}
      <ModalFooter>
        <Button type="button" $variant="outline" $size="lg" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          type="button"
          $variant={confirmVariant}
          $size="lg"
          onClick={onConfirm}
          disabled={!canConfirm}
        >
          {loading && loadingLabel ? loadingLabel : confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
