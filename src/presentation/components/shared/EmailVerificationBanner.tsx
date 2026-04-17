import React, { useState } from 'react';
import styled from 'styled-components';
import { Mail, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/presentation/context/AuthContext';

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: linear-gradient(90deg, #FFF4E6 0%, #FFE8D1 100%);
  border-bottom: 1px solid rgba(180, 98, 58, 0.18);
  color: #6B3A1F;
  font-size: 13px;
  line-height: 1.5;
  letter-spacing: -0.005em;

  svg.lead { width: 16px; height: 16px; color: #B4623A; flex-shrink: 0; }
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Text = styled.div`
  flex: 1;
  min-width: 0;
  strong { color: #4A2712; font-weight: 600; }
`;

const ResendBtn = styled.button`
  height: 30px;
  padding: 0 14px;
  background: #fff;
  border: 1px solid rgba(180, 98, 58, 0.28);
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  color: #6B3A1F;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  white-space: nowrap;

  &:hover:not(:disabled) { background: #FFF9F2; border-color: rgba(180, 98, 58, 0.42); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  padding: 4px;
  color: #6B3A1F;
  opacity: 0.6;
  cursor: pointer;
  display: flex;

  &:hover { opacity: 1; }
  svg { width: 14px; height: 14px; }
`;

/**
 * Shown on authenticated pages when the registered user has an email but
 * has not clicked the confirmation link yet. Gives them a one-click Resend.
 * Dismissal is per-session (not persisted) so it reappears after reload —
 * by design, since an unverified email is a real security gap.
 */
export const EmailVerificationBanner: React.FC = () => {
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
    <Bar role="status">
      <Inner>
        <Mail className="lead" />
        <Text>
          <strong>Verify your email.</strong>{' '}
          {sentAt ? (
            <>
              <CheckCircle2 style={{ width: 14, height: 14, verticalAlign: -2, marginRight: 2, color: '#16A34A' }} />
              Verification email sent to {user?.email}. Check your inbox.
            </>
          ) : error ? (
            <span style={{ color: '#B91C1C' }}>{error}</span>
          ) : (
            <>Click the link we sent to <strong>{user?.email}</strong> to confirm your address.</>
          )}
        </Text>
        {!sentAt && (
          <ResendBtn onClick={handleResend} disabled={sending}>
            {sending ? 'Sending…' : 'Resend'}
          </ResendBtn>
        )}
        <CloseBtn onClick={() => setDismissed(true)} aria-label="Dismiss">
          <X />
        </CloseBtn>
      </Inner>
    </Bar>
  );
};
