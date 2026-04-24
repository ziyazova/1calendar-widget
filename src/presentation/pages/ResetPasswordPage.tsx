import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { PageWrapper, Footer, Button } from '../components/shared';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@/infrastructure/services/supabase';

const Container = styled.div`
  max-width: 420px;
  margin: 0 auto;
  padding: 80px 24px 120px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 48px 20px 80px;
  }
`;

const IconWrap = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: linear-gradient(135deg, rgba(99,102,241,0.12), rgba(236,72,153,0.08));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;

  svg { width: 26px; height: 26px; color: ${({ theme }) => theme.colors.accent}; }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.sizes['3xl']};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
  margin: 0 0 8px;
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.hint};
  text-align: center;
  margin: 0 0 ${({ theme }) => theme.spacing['8']};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InputWrap = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.hint};
  display: flex;
  svg { width: 16px; height: 16px; }
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 44px;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.background.elevated};
  outline: none;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus { border-color: ${({ theme }) => theme.colors.accent}; }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.hint};
  display: flex;
  padding: 0;
  svg { width: 16px; height: 16px; }
  &:hover { color: ${({ theme }) => theme.colors.text.body}; }
`;

const RequirementsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  background: rgba(0,0,0,0.02);
  border-radius: ${({ theme }) => theme.radii.md};
`;

const Requirement = styled.div<{ $met: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ $met, theme }) => ($met ? theme.colors.success.fg : theme.colors.text.hint)};
  transition: color ${({ theme }) => theme.transitions.fast};
  svg { width: 12px; height: 12px; flex-shrink: 0; }
`;

const ErrorText = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.danger.strong};
  background: ${({ theme }) => theme.colors.danger.bg};
  border: 1px solid ${({ theme }) => theme.colors.danger.border};
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: ${({ theme }) => theme.spacing['2']};
`;

const SuccessCard = styled.div`
  text-align: center;
  padding: 8px 0;

  svg { color: ${({ theme }) => theme.colors.success.fg}; }
`;

const SuccessIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.success.bg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  svg { width: 28px; height: 28px; color: ${({ theme }) => theme.colors.success.fg}; }
`;

const getChecks = (pw: string) => [
  { label: 'At least 8 characters', met: pw.length >= 8 },
  { label: 'Contains a letter', met: /[a-zA-Z]/.test(pw) },
  { label: 'Contains a number', met: /\d/.test(pw) },
];

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { updatePassword, logoutOthers } = useAuth();

  const [ready, setReady] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  // Supabase may redirect here with error params on the URL hash when the
  // recovery link is expired or already consumed, e.g.
  //   #error=access_denied&error_code=otp_expired&error_description=...
  // Parse it first so we can show the right message without waiting for the
  // (doomed) PASSWORD_RECOVERY event.
  useEffect(() => {
    const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
    const params = new URLSearchParams(hash);
    const errCode = params.get('error_code');
    const err = params.get('error');
    if (errCode === 'otp_expired' || err === 'access_denied') {
      setInvalidLink(true);
      return;
    }

    // Supabase parses the recovery token from the URL hash automatically when
    // detectSessionInUrl is enabled (default). We confirm a PASSWORD_RECOVERY
    // event or a session before rendering the form.
    let settled = false;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        settled = true;
        setReady(true);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) { settled = true; setReady(true); }
    });
    const timer = setTimeout(() => {
      if (!settled) setInvalidLink(true);
    }, 2500);
    return () => { subscription.unsubscribe(); clearTimeout(timer); };
  }, []);

  const checks = useMemo(() => getChecks(password), [password]);
  const valid = checks.every(c => c.met) && password === confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) {
      setError('Passwords must match and meet the requirements.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const err = await updatePassword(password);
      if (err) {
        setError(err.toLowerCase().includes('same as') ? 'New password must be different from the current one.' : err);
        return;
      }
      // Invalidate sessions on all other devices so a stolen token can't
      // survive the reset. The current device keeps its (new) session.
      try { await logoutOthers(); } catch { /* ignore — best-effort */ }
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (invalidLink) {
    return (
      <PageWrapper>
        <TopNav logoSub="Reset password" />
        <Container>
          <IconWrap><Lock /></IconWrap>
          <Title>Link expired</Title>
          <Subtitle>This password reset link is invalid or has expired. Please request a new one from the login page.</Subtitle>
          <Button $variant="primary" $size="xl" $fullWidth onClick={() => navigate('/login')}>
            Back to login <ArrowRight />
          </Button>
        </Container>
      </PageWrapper>
    );
  }

  if (done) {
    return (
      <PageWrapper>
        <TopNav logoSub="Reset password" />
        <Container>
          <SuccessCard>
            <SuccessIcon><CheckCircle2 /></SuccessIcon>
            <Title>Password updated</Title>
            <Subtitle>You can now log in with your new password.</Subtitle>
            <Button $variant="primary" $size="xl" $fullWidth onClick={() => navigate('/login')}>
              Go to login <ArrowRight />
            </Button>
          </SuccessCard>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <TopNav logoSub="Reset password" />
      <Container>
        <IconWrap><ShieldCheck /></IconWrap>
        <Title>Set a new password</Title>
        <Subtitle>Choose a strong password you haven't used before.</Subtitle>

        {!ready ? (
          <Subtitle>Verifying link…</Subtitle>
        ) : (
          <Form onSubmit={handleSubmit} noValidate>
            {error && <ErrorText>{error}</ErrorText>}
            <InputWrap>
              <InputIcon><Lock /></InputIcon>
              <Input
                type={showPw ? 'text' : 'password'}
                placeholder="New password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
              />
              <PasswordToggle type="button" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff /> : <Eye />}
              </PasswordToggle>
            </InputWrap>
            <InputWrap>
              <InputIcon><Lock /></InputIcon>
              <Input
                type={showPw ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                autoComplete="new-password"
                minLength={8}
              />
            </InputWrap>

            {password.length > 0 && (
              <RequirementsList>
                {checks.map(c => (
                  <Requirement key={c.label} $met={c.met}>
                    {c.met ? <CheckCircle2 /> : <Check style={{ opacity: 0.3 }} />}
                    {c.label}
                  </Requirement>
                ))}
                <Requirement $met={confirm.length > 0 && password === confirm}>
                  {confirm.length > 0 && password === confirm ? <CheckCircle2 /> : <Check style={{ opacity: 0.3 }} />}
                  Passwords match
                </Requirement>
              </RequirementsList>
            )}

            <Button
              type="submit"
              $variant="primary"
              $size="xl"
              $fullWidth
              disabled={submitting || !valid}
              style={{ marginTop: 8 }}
            >
              {submitting ? 'Updating…' : 'Update password'}
            </Button>
          </Form>
        )}
      </Container>
      <Footer />
    </PageWrapper>
  );
};
