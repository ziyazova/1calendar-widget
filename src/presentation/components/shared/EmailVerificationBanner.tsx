import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { ShieldCheck, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/presentation/context/AuthContext';

/**
 * Shown on authenticated pages when the registered user has an email but
 * has not clicked the confirmation link yet. Gives them a one-click Resend.
 * Dismissal is per-session (not persisted) so it reappears after reload —
 * by design, since an unverified email is a real security gap.
 *
 * Visual spec — `06-banners` HTML mock (amber variant). Card form with
 * rounded 14px corners + subtle amber border + shield+check icon; sits
 * inside a page-edge container so it doesn't stretch to full viewport
 * width.
 */

/* Page-edge container: gives the card breathing room from viewport
 * edges and caps its width to the same 1040px the mock uses. */
export const EmailVerificationWrap = styled.div`
  width: 100%;
  padding: 16px 24px 0;
  display: flex;
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) { padding: 12px 16px 0; }
`;

/* Amber card — exact colours from the 06-banners mock. Kept local
 * (not in theme.colors) because this is a one-off warm-amber palette
 * used ONLY on the verify banner. */
export const EmailVerificationBar = styled.div`
  width: 100%;
  max-width: 1040px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: #FFF7E8;
  border: 1px solid rgba(194, 114, 12, 0.22);
  border-radius: 14px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  letter-spacing: -0.005em;

  @media (max-width: 520px) {
    flex-wrap: wrap;
    row-gap: 10px;
  }
`;

/* Amber icon chip — shield+check in lucide's ShieldCheck. */
export const EmailVerificationIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(194, 114, 12, 0.10);
  border: 1px solid rgba(194, 114, 12, 0.28);
  color: #8A4F03;

  svg { width: 17px; height: 17px; }
`;

export const EmailVerificationBody = styled.div`
  flex: 1;
  min-width: 0;
  line-height: 1.38;
`;

export const EmailVerificationTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #5A3402;
  letter-spacing: -0.008em;
`;

export const EmailVerificationSub = styled.div`
  font-size: 12.5px;
  color: #7A4503;
  margin-top: 2px;

  strong { color: #5A3402; font-weight: 600; }
`;

/* Legacy export name — kept so existing DS-v2 mirror imports still work. */
export const EmailVerificationText = EmailVerificationSub;
export const EmailVerificationInner = EmailVerificationBody;

export const EmailVerificationActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

export const EmailVerificationResendBtn = styled.button`
  height: 30px;
  padding: 7px 13px;
  background: #fff;
  border: 1px solid rgba(138, 79, 3, 0.45);
  border-radius: 10px;
  font-size: 12.5px;
  font-weight: 600;
  font-family: inherit;
  color: #6B3D02;
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast}, border-color ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;

  &:hover:not(:disabled) { background: #FFFBF2; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const EmailVerificationCloseBtn = styled.button`
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: rgba(138, 79, 3, 0.55);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background ${({ theme }) => theme.transitions.fast}, color ${({ theme }) => theme.transitions.fast};

  &:hover { background: rgba(194, 114, 12, 0.1); color: #8A4F03; }
  svg { width: 14px; height: 14px; }
`;

export const EmailVerificationBanner: React.FC = () => {
  const theme = useTheme();
  const { isRegistered, isEmailVerified, user, resendVerificationForCurrent } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentAt, setSentAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isRegistered || isEmailVerified || dismissed) return null;

  const handleResend = async () => {
    setSending(true);
    setError(null);
    const err = await resendVerificationForCurrent();
    if (err) {
      setError(err.toLowerCase().includes('rate') || err.toLowerCase().includes('only request')
        ? 'Please wait a minute before trying again.'
        : 'Could not resend right now.');
    } else {
      setSentAt(Date.now());
    }
    setSending(false);
  };

  return (
    <EmailVerificationWrap>
      <EmailVerificationBar role="status" aria-live="polite">
        <EmailVerificationIcon><ShieldCheck /></EmailVerificationIcon>
        <EmailVerificationBody>
          <EmailVerificationTitle>
            {sentAt ? 'Verification email sent' : 'Verify your email'}
          </EmailVerificationTitle>
          <EmailVerificationSub>
            {sentAt ? (
              <>
                <CheckCircle2 style={{ width: 13, height: 13, verticalAlign: -2, marginRight: 4, color: theme.colors.success.fg }} />
                Sent to <strong>{user?.email}</strong>. Check your inbox.
              </>
            ) : error ? (
              <span style={{ color: theme.colors.danger.strong }}>{error}</span>
            ) : (
              <>Needed to save widgets and publish embeds.</>
            )}
          </EmailVerificationSub>
        </EmailVerificationBody>
        <EmailVerificationActions>
          {!sentAt && (
            <EmailVerificationResendBtn onClick={handleResend} disabled={sending}>
              {sending ? 'Sending…' : 'Resend link'}
            </EmailVerificationResendBtn>
          )}
          <EmailVerificationCloseBtn onClick={() => setDismissed(true)} aria-label="Dismiss">
            <X />
          </EmailVerificationCloseBtn>
        </EmailVerificationActions>
      </EmailVerificationBar>
    </EmailVerificationWrap>
  );
};
