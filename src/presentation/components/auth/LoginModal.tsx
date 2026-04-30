import React from 'react';
import styled from 'styled-components';
import { Modal, BottomSheet } from '@/presentation/components/shared';
import { LoginFlow } from './LoginFlow';
import { useIsPhone } from '@/presentation/hooks/useIsMobile';

/**
 * LoginModal — <LoginFlow> embedded in a centered Modal on desktop, in
 * a BottomSheet on mobile. The bottom-sheet variant is the standard
 * mobile pattern (iOS/Android, Linear, Vercel, etc.) and avoids the
 * jumpy centered-modal-with-changing-content problem.
 *
 * Use to gate an action behind auth without redirecting away (e.g.
 * Customize on a widget card). On success, onAuthenticated fires and
 * the surface closes; the caller resumes the interrupted action.
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

/* Mobile sheet body — generous symmetric padding so LoginFlow content
   sits clear of the sheet edges. The sheet itself owns the bottom
   safe-area inset, so we only add horizontal + top padding here.
   Bottom 32 (was 24, +8) — extra breathing room below the bottom-most
   "Don't have an account? / Sign up" link before the sheet's edge. */
const SheetBody = styled.div`
  padding: 8px 24px 32px;
`;

export const LoginModal: React.FC<LoginModalProps> = ({
  open,
  onClose,
  onAuthenticated,
  initialSignUp,
}) => {
  const isPhone = useIsPhone();

  const handleAuth = () => {
    onAuthenticated?.();
    onClose();
  };

  if (isPhone) {
    return (
      <BottomSheet open={open} onClose={onClose} maxHeight="90vh">
        <SheetBody>
          <LoginFlow
            embedded
            initialSignUp={initialSignUp}
            onAuthenticated={handleAuth}
          />
        </SheetBody>
      </BottomSheet>
    );
  }

  return (
    <Modal open={open} onClose={onClose} size="md">
      <FlowWrap>
        <LoginFlow
          embedded
          initialSignUp={initialSignUp}
          onAuthenticated={handleAuth}
        />
      </FlowWrap>
    </Modal>
  );
};
