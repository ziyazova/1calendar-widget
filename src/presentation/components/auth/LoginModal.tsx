import React from 'react';
import styled from 'styled-components';
import { Modal } from '@/presentation/components/shared';
import { LoginFlow } from './LoginFlow';

/**
 * LoginModal — <LoginFlow> embedded in a shared <Modal>. Use to gate an
 * action behind auth without redirecting away (e.g. Customize on a widget
 * card). On success, onAuthenticated fires and the modal closes; the caller
 * resumes the interrupted action.
 *
 * Width is constrained by Modal `size="sm"` (400px) — login forms read
 * better narrow. The inner wrapper resets the Modal body's flex gap so
 * LoginFlow's own margins drive the rhythm.
 */
interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onAuthenticated?: () => void;
  initialSignUp?: boolean;
}

/* Reset the Modal body's `gap: 16px` + `> * { margin: 0 }` rules. LoginFlow
   ships its own vertical spacing (Title margin-bottom, Subtitle margin-bottom,
   Divider margin, etc.) and is happiest left alone. */
const FlowWrap = styled.div`
  display: contents;

  /* Re-allow margins on direct children since the Modal body resets them */
  > * { margin: revert; }
`;

export const LoginModal: React.FC<LoginModalProps> = ({
  open,
  onClose,
  onAuthenticated,
  initialSignUp,
}) => {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <FlowWrap>
        <LoginFlow
          embedded
          initialSignUp={initialSignUp}
          onAuthenticated={() => {
            onAuthenticated?.();
            onClose();
          }}
        />
      </FlowWrap>
    </Modal>
  );
};
