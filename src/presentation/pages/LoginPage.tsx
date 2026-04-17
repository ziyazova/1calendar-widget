import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';
import { PageWrapper, Footer } from '@/presentation/components/shared';
import { Mail, Lock, Eye, EyeOff, Check, CheckCircle2, MailCheck, LogOut, ArrowRight, KeyRound } from 'lucide-react';
import { useAuth } from '@/presentation/context/AuthContext';
import { hasSupabaseEnv } from '@/infrastructure/services/supabase';

const Container = styled.div`
  max-width: 420px;
  margin: 0 auto;
  padding: 80px 24px 120px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 48px 20px 80px;
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.sizes['3xl']};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
  text-align: center;
  margin: 0 0 ${({ theme }) => theme.spacing['2']};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-align: center;
  margin: 0 0 ${({ theme }) => theme.spacing['8']};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['3']};
`;

const InputWrap = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.muted};
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

  &::placeholder { color: ${({ theme }) => theme.colors.text.muted}; }
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
  color: ${({ theme }) => theme.colors.text.muted};
  display: flex;
  padding: 0;
  svg { width: 16px; height: 16px; }

  &:hover { color: ${({ theme }) => theme.colors.text.secondary}; }
`;

const SubmitBtn = styled.button`
  width: 100%;
  height: 48px;
  margin-top: ${({ theme }) => theme.spacing['2']};
  background: ${({ theme }) => theme.colors.text.primary};
  color: #fff;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  font-family: inherit;
  cursor: pointer;
  letter-spacing: -0.01em;
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover:not(:disabled) { background: #333; }
  &:active:not(:disabled) { transform: scale(0.99); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['4']};
  margin: ${({ theme }) => theme.spacing['6']} 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.sizes.sm};

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border.light};
  }
`;

const SocialBtn = styled.button`
  width: 100%;
  height: 48px;
  background: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing['2']};
  letter-spacing: -0.01em;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover { background: ${({ theme }) => theme.colors.background.surface}; }

  &:not(:last-child) { margin-bottom: ${({ theme }) => theme.spacing['2']}; }
`;

const BottomText = styled.p`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing['8']};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const LegalNotice = styled.p`
  text-align: center;
  margin: 16px 0 0;
  font-size: 12px;
  line-height: 1.55;
  color: #999;
  letter-spacing: -0.005em;

  a {
    color: #555;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
    text-decoration-color: rgba(0,0,0,0.2);
  }
  a:hover { color: #1F1F1F; text-decoration-color: #1F1F1F; }
`;

const LinkBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
  padding: 0;

  &:hover { text-decoration: underline; }
`;

const ForgotLink = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-family: inherit;
  cursor: pointer;
  padding: 0;
  margin-top: ${({ theme }) => theme.spacing['1']};
  align-self: flex-end;

  &:hover { color: ${({ theme }) => theme.colors.text.primary}; }
`;

const ErrorText = styled.div`
  font-size: 13px;
  color: #DC2828;
  background: rgba(220,40,40,0.06);
  border: 1px solid rgba(220,40,40,0.15);
  padding: 10px 12px;
  border-radius: 10px;
  margin-bottom: 8px;
  line-height: 1.4;
`;

const RequirementsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  background: rgba(0,0,0,0.02);
  border-radius: 10px;
  margin-top: -4px;
`;

const Requirement = styled.div<{ $met: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${({ $met }) => $met ? '#16A34A' : '#999'};
  transition: color 0.15s;

  svg { width: 12px; height: 12px; flex-shrink: 0; }
`;

/* ── Check your email view ── */

const ConfirmCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 8px 0;
`;

const ConfirmIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(99,102,241,0.12), rgba(236,72,153,0.08));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  svg { width: 28px; height: 28px; color: #6366F1; }
`;

const ConfirmEmail = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #1F1F1F;
  background: #F5F5F5;
  padding: 8px 14px;
  border-radius: 10px;
  margin: 12px 0 24px;
  letter-spacing: -0.01em;
  word-break: break-all;
`;

const ResendBtn = styled.button`
  height: 42px;
  padding: 0 18px;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  color: #333;
  cursor: pointer;
  transition: background 0.15s;

  &:hover:not(:disabled) { background: #FAFAFA; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

/* ── Already signed in card ── */

const SignedInCard = styled.div`
  text-align: center;
  padding: 32px 24px;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 16px;
  background: #fff;
`;

const SignedInAvatar = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, #EDE4FF, #E0E8FF);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 600;
  color: #6366F1;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const PrimaryBtn = styled.button`
  width: 100%;
  height: 46px;
  background: #1F1F1F;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.15s;
  margin-top: 16px;

  &:hover { background: #333; }
  svg { width: 16px; height: 16px; }
`;

const SecondaryBtn = styled.button`
  width: 100%;
  height: 46px;
  background: #fff;
  color: #555;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.15s;
  margin-top: 8px;

  &:hover { background: #FAFAFA; }
  svg { width: 14px; height: 14px; }
`;

/* ── Helpers ── */

const humaniseError = (raw: string, mode: 'login' | 'signup'): string => {
  const m = raw.toLowerCase();
  if (m.includes('user already registered') || m.includes('already exists')) {
    return 'This email is already in use. Try logging in instead.';
  }
  if (m.includes('invalid login credentials') || m.includes('invalid credentials')) {
    return 'Email or password is incorrect.';
  }
  if (m.includes('email not confirmed')) {
    return 'Please confirm your email first. Check your inbox.';
  }
  if (m.includes('password should be') || m.includes('password must')) {
    return 'Password must be at least 8 characters.';
  }
  if (m.includes('rate limit')) {
    return "Too many attempts. Please wait a minute before trying again.";
  }
  if (m.includes('network')) {
    return 'Network error. Check your connection and try again.';
  }
  // Fallback
  return mode === 'signup'
    ? 'We could not create your account. Please try again.'
    : 'We could not sign you in. Please try again.';
};

type PasswordCheck = { label: string; met: boolean };
const getPasswordChecks = (pw: string): PasswordCheck[] => [
  { label: 'At least 8 characters', met: pw.length >= 8 },
  { label: 'Contains a letter', met: /[a-zA-Z]/.test(pw) },
  { label: 'Contains a number', met: /\d/.test(pw) },
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const auth = useAuth();
  const prefill = location.state as { email?: string; signup?: boolean } | null;

  const justDeleted = searchParams.get('deleted') === '1';

  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(Boolean(prefill?.signup));
  const [error, setError] = useState('');
  const [deletedNotice, setDeletedNotice] = useState(justDeleted);

  useEffect(() => {
    if (justDeleted) {
      // Strip the query param so the notice doesn't come back on refresh.
      const next = new URLSearchParams(searchParams);
      next.delete('deleted');
      setSearchParams(next, { replace: true });
    }
  }, [justDeleted, searchParams, setSearchParams]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState(prefill?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Check-your-email view state
  const [confirmationSentTo, setConfirmationSentTo] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  // Forgot password modal state
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSentTo, setForgotSentTo] = useState<string | null>(null);

  // Hint shown when login fails — the account may be Google-linked only.
  const [showGoogleHint, setShowGoogleHint] = useState(false);

  const passwordChecks = useMemo(() => getPasswordChecks(password), [password]);
  const passwordValid = passwordChecks.every(c => c.met);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const canSubmitSignup = name.trim().length > 0 && email.trim().length > 0 && passwordValid && passwordsMatch;
  const canSubmitLogin = email.trim().length > 0 && password.length > 0;

  // Countdown tick for resend throttle.
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setTimeout(() => setResendCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  // If the user is already signed in with a Supabase session and is NOT in the confirm-email flow,
  // show the "already signed in" card instead of silently redirecting.
  if (auth.isRegistered && !confirmationSentTo) {
    const displayName = auth.user?.name || 'there';
    const initials = (auth.user?.name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    return (
      <PageWrapper>
        <TopNav logoSub="Account" />
        <Container>
          <SignedInCard>
            <SignedInAvatar>
              {auth.user?.avatarUrl ? (
                <img src={auth.user.avatarUrl} alt="" referrerPolicy="no-referrer" />
              ) : initials}
            </SignedInAvatar>
            <div style={{ fontSize: 20, fontWeight: 600, color: '#1F1F1F', letterSpacing: '-0.02em', marginBottom: 4 }}>
              You're already signed in
            </div>
            <div style={{ fontSize: 14, color: '#999' }}>
              Signed in as <strong style={{ color: '#1F1F1F' }}>{displayName}</strong> ({auth.user?.email})
            </div>
            <PrimaryBtn onClick={() => navigate('/studio')}>
              Go to Studio <ArrowRight />
            </PrimaryBtn>
            <SecondaryBtn onClick={async () => { await auth.logout(); }}>
              <LogOut /> Log out
            </SecondaryBtn>
          </SignedInCard>
        </Container>
        <Footer />
      </PageWrapper>
    );
  }

  // Check-your-email view after a successful signup that requires email confirmation.
  if (confirmationSentTo) {
    const handleResend = async () => {
      setResendMessage(null);
      const err = await auth.resendConfirmation(confirmationSentTo);
      if (err) {
        setResendMessage(humaniseError(err, 'signup'));
      } else {
        setResendMessage('Email sent. Check your inbox again.');
        setResendCountdown(60);
      }
    };
    return (
      <PageWrapper>
        <TopNav logoSub="Account" />
        <Container>
          <ConfirmCard>
            <ConfirmIcon><MailCheck /></ConfirmIcon>
            <div style={{ fontSize: 22, fontWeight: 600, color: '#1F1F1F', letterSpacing: '-0.02em' }}>
              Check your email
            </div>
            <div style={{ fontSize: 14, color: '#666', marginTop: 8, lineHeight: 1.5, maxWidth: 340 }}>
              We sent a confirmation link to:
            </div>
            <ConfirmEmail>{confirmationSentTo}</ConfirmEmail>
            <div style={{ fontSize: 13, color: '#999', maxWidth: 320, lineHeight: 1.55 }}>
              Click the link in the email to activate your account. You can close this page.
            </div>

            <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              <ResendBtn onClick={handleResend} disabled={resendCountdown > 0}>
                {resendCountdown > 0 ? `Resend email in ${resendCountdown}s` : 'Resend email'}
              </ResendBtn>
              {resendMessage && (
                <div style={{ fontSize: 12, color: '#16A34A' }}>{resendMessage}</div>
              )}
              <button
                type="button"
                onClick={() => { setConfirmationSentTo(null); setResendMessage(null); setResendCountdown(0); }}
                style={{
                  background: 'none', border: 'none', color: '#999',
                  fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', marginTop: 8,
                }}
              >
                Use a different email
              </button>
            </div>
          </ConfirmCard>
        </Container>
        <Footer />
      </PageWrapper>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isSignUp) {
        if (!canSubmitSignup) {
          setError(
            !passwordsMatch && passwordValid
              ? 'Passwords do not match.'
              : 'Please fill in all fields and meet the password requirements.',
          );
          return;
        }
        const result = await auth.register(name.trim(), email.trim(), password);
        if (result.error) {
          setError(humaniseError(result.error, 'signup'));
          return;
        }
        if (result.needsConfirmation) {
          setConfirmationSentTo(email.trim());
          setResendCountdown(60); // initial throttle — Supabase recently sent the email
          return;
        }
        // Session granted (e.g. auto-confirm enabled) → go to studio.
        navigate('/studio');
      } else {
        if (!canSubmitLogin) {
          setError('Please enter your email and password.');
          return;
        }
        const err = await auth.login(email.trim(), password);
        if (err) {
          setError(humaniseError(err, 'login'));
          // Hint users that their account might be linked only to Google.
          if (err.toLowerCase().includes('invalid login credentials')) {
            setShowGoogleHint(true);
          }
          return;
        }
        navigate('/studio');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <TopNav logoSub="Account" />

      <Container>
        <Title>{isSignUp ? 'Create account' : 'Welcome back'}</Title>
        <Subtitle>{isSignUp ? 'Start your Peachy journey' : 'Log in to your Peachy account'}</Subtitle>

        {!hasSupabaseEnv && (
          <div style={{
            fontSize: 13,
            color: '#92400E',
            background: 'rgba(253,186,116,0.18)',
            border: '1px solid rgba(194,120,3,0.35)',
            padding: '12px 14px',
            borderRadius: 12,
            marginBottom: 12,
            lineHeight: 1.5,
          }}>
            <strong>Auth is not configured.</strong>{' '}
            Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in your
            <code> .env.local</code>, then restart the dev server. Sign-in and sign-up won't work until then.
          </div>
        )}

        {deletedNotice && (
          <div style={{
            fontSize: 13,
            color: '#166534',
            background: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.2)',
            padding: '12px 14px',
            borderRadius: 12,
            marginBottom: 12,
            lineHeight: 1.5,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}>
            <CheckCircle2 style={{ width: 16, height: 16, flexShrink: 0, color: '#16A34A', marginTop: 1 }} />
            <div>
              <strong style={{ color: '#14532D' }}>Your account has been deleted.</strong>{' '}
              Your profile, widgets and all local data have been removed from this device.
              You can sign up again any time with the same email.
              <button
                type="button"
                onClick={() => setDeletedNotice(false)}
                style={{
                  marginLeft: 8, background: 'none', border: 'none',
                  color: '#166534', fontSize: 12, fontFamily: 'inherit',
                  cursor: 'pointer', textDecoration: 'underline', padding: 0,
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {error && <ErrorText>{error}</ErrorText>}
        {showGoogleHint && !isSignUp && (
          <div style={{
            fontSize: 12, color: '#555',
            background: 'rgba(99,102,241,0.06)',
            border: '1px solid rgba(99,102,241,0.15)',
            padding: '10px 12px', borderRadius: 10, marginBottom: 8, lineHeight: 1.45,
          }}>
            Did you sign up with Google? This email may not have a password set. Try{' '}
            <button
              type="button"
              onClick={() => auth.loginWithGoogle()}
              style={{ background: 'none', border: 'none', color: '#6366F1', fontWeight: 600, fontFamily: 'inherit', fontSize: 12, padding: 0, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Continue with Google
            </button>
            .
          </div>
        )}

        <Form onSubmit={handleSubmit} noValidate>
          {isSignUp && (
            <InputWrap>
              <InputIcon><Mail /></InputIcon>
              <Input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
              />
            </InputWrap>
          )}
          <InputWrap>
            <InputIcon><Mail /></InputIcon>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              spellCheck={false}
              autoCapitalize="off"
            />
          </InputWrap>
          <InputWrap>
            <InputIcon><Lock /></InputIcon>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              minLength={isSignUp ? 8 : undefined}
            />
            <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff /> : <Eye />}
            </PasswordToggle>
          </InputWrap>

          {isSignUp && (
            <InputWrap>
              <InputIcon><Lock /></InputIcon>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
              />
            </InputWrap>
          )}

          {isSignUp && password.length > 0 && (
            <RequirementsList>
              {passwordChecks.map(c => (
                <Requirement key={c.label} $met={c.met}>
                  {c.met ? <CheckCircle2 /> : <Check style={{ opacity: 0.3 }} />}
                  {c.label}
                </Requirement>
              ))}
              <Requirement $met={passwordsMatch}>
                {passwordsMatch ? <CheckCircle2 /> : <Check style={{ opacity: 0.3 }} />}
                Passwords match
              </Requirement>
            </RequirementsList>
          )}

          {!isSignUp && (
            <ForgotLink
              type="button"
              onClick={() => { setForgotOpen(true); setForgotEmail(email); setForgotError(''); setForgotSentTo(null); }}
            >
              Forgot password?
            </ForgotLink>
          )}

          <SubmitBtn
            type="submit"
            disabled={submitting || (isSignUp ? !canSubmitSignup : !canSubmitLogin)}
          >
            {submitting ? 'Loading…' : isSignUp ? 'Create account' : 'Log in'}
          </SubmitBtn>
          {isSignUp && (
            <LegalNotice>
              By creating an account, you agree to Peachy's{' '}
              <Link to="/terms">Terms of Use</Link> and{' '}
              <Link to="/privacy">Privacy Policy</Link>.
            </LegalNotice>
          )}
        </Form>

        <Divider>or</Divider>

        <SocialBtn onClick={() => auth.loginWithGoogle()}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </SocialBtn>
        {isSignUp && (
          <LegalNotice>
            By continuing with Google, you also agree to our{' '}
            <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>.
          </LegalNotice>
        )}

        <BottomText>
          {isSignUp
            ? <>Already have an account? <LinkBtn onClick={() => { setIsSignUp(false); setError(''); }}>Log in</LinkBtn></>
            : <>Don't have an account? <LinkBtn onClick={() => { setIsSignUp(true); setError(''); }}>Sign up</LinkBtn></>
          }
        </BottomText>
      </Container>

      {forgotOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            onClick={() => !forgotSubmitting && setForgotOpen(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          />
          <div style={{
            position: 'relative', background: '#fff', borderRadius: 24, padding: '32px 28px 28px',
            width: 420, maxWidth: '92vw',
            boxShadow: '0 32px 80px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)',
          }}>
            {forgotSentTo ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 600, color: '#1F1F1F', letterSpacing: '-0.02em', marginBottom: 8 }}>
                  Check your email
                </div>
                <div style={{ fontSize: 14, color: '#666', lineHeight: 1.5, marginBottom: 20 }}>
                  If an account exists for <strong style={{ color: '#1F1F1F' }}>{forgotSentTo}</strong>,
                  we sent a password reset link. Click the link in the email to set a new password.
                </div>
                <button
                  onClick={() => { setForgotOpen(false); setForgotSentTo(null); setForgotEmail(''); }}
                  style={{
                    width: '100%', height: 44, background: '#1F1F1F', color: '#fff',
                    border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600,
                    fontFamily: 'inherit', cursor: 'pointer',
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 20, fontWeight: 600, color: '#1F1F1F', letterSpacing: '-0.02em', marginBottom: 6 }}>
                  Reset your password
                </div>
                <div style={{ fontSize: 14, color: '#777', lineHeight: 1.5, marginBottom: 14 }}>
                  Enter the email associated with your account and we'll send you a link to set a new password.
                </div>
                <div style={{
                  fontSize: 12,
                  color: '#555',
                  background: 'rgba(99,102,241,0.06)',
                  border: '1px solid rgba(99,102,241,0.15)',
                  padding: '10px 12px',
                  borderRadius: 10,
                  marginBottom: 14,
                  lineHeight: 1.45,
                }}>
                  Signed up with Google? You don't have a password — just click{' '}
                  <button
                    type="button"
                    onClick={() => { setForgotOpen(false); auth.loginWithGoogle(); }}
                    style={{ background: 'none', border: 'none', color: '#6366F1', fontWeight: 600, fontFamily: 'inherit', fontSize: 12, padding: 0, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Continue with Google
                  </button>{' '}
                  on the login page.
                </div>
                {forgotError && (
                  <div style={{
                    fontSize: 13, color: '#DC2828',
                    background: 'rgba(220,40,40,0.06)',
                    border: '1px solid rgba(220,40,40,0.15)',
                    padding: '10px 12px', borderRadius: 10, marginBottom: 12,
                  }}>{forgotError}</div>
                )}
                <form onSubmit={async e => {
                  e.preventDefault();
                  setForgotError('');
                  const trimmed = forgotEmail.trim();
                  if (!trimmed || !trimmed.includes('@')) {
                    setForgotError('Please enter a valid email address.');
                    return;
                  }
                  setForgotSubmitting(true);
                  try {
                    const err = await auth.sendPasswordReset(trimmed);
                    if (err) {
                      setForgotError(humaniseError(err, 'login'));
                      return;
                    }
                    setForgotSentTo(trimmed);
                  } finally {
                    setForgotSubmitting(false);
                  }
                }}>
                  <input
                    type="email"
                    autoFocus
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    style={{
                      width: '100%', height: 46, padding: '0 14px',
                      border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12,
                      fontSize: 14, fontFamily: 'inherit', color: '#1F1F1F',
                      background: '#FAFAFA', outline: 'none', marginBottom: 16,
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => setForgotOpen(false)}
                      disabled={forgotSubmitting}
                      style={{
                        flex: 1, height: 44, background: '#fff', color: '#555',
                        border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12,
                        fontSize: 14, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={forgotSubmitting}
                      style={{
                        flex: 1, height: 44, background: '#1F1F1F', color: '#fff',
                        border: 'none', borderRadius: 12,
                        fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
                        opacity: forgotSubmitting ? 0.5 : 1,
                      }}
                    >
                      {forgotSubmitting ? 'Sending…' : 'Send reset link'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
      <Footer />
    </PageWrapper>
  );
};
