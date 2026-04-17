import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { MailCheck, MailX, ArrowRight } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { PageWrapper, Footer } from '../components/shared';
import { useAuth } from '../context/AuthContext';

const Container = styled.div`
  max-width: 420px;
  margin: 0 auto;
  padding: 80px 24px 120px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 48px 20px 80px;
  }
`;

const IconWrap = styled.div<{ $ok: boolean }>`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: ${({ $ok }) => ($ok
    ? 'linear-gradient(135deg, rgba(34,197,94,0.14), rgba(16,185,129,0.10))'
    : 'linear-gradient(135deg, rgba(220,40,40,0.14), rgba(253,186,116,0.10))')};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;

  svg {
    width: 28px;
    height: 28px;
    color: ${({ $ok }) => ($ok ? '#16A34A' : '#DC2828')};
  }
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 600;
  text-align: center;
  color: #1F1F1F;
  letter-spacing: -0.03em;
  margin: 0 0 10px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #777;
  text-align: center;
  margin: 0 0 24px;
  line-height: 1.55;
`;

const SubmitBtn = styled.button`
  width: 100%;
  height: 48px;
  margin-top: 8px;
  background: #1F1F1F;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.15s;

  &:hover { background: #333; }
  svg { width: 16px; height: 16px; }
`;

type State = 'pending' | 'success' | 'expired';

export const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const { supabaseUser } = useAuth();
  const [state, setState] = useState<State>('pending');

  useEffect(() => {
    // Supabase puts the outcome on the URL hash after the user clicks the
    // confirmation link:
    //   #access_token=...&refresh_token=...&type=signup        (success)
    //   #error=access_denied&error_code=otp_expired&...        (expired / used)
    const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
    const params = new URLSearchParams(hash);
    const errorCode = params.get('error_code');
    const err = params.get('error');

    if (errorCode === 'otp_expired' || err === 'access_denied') {
      setState('expired');
      return;
    }

    // If we already have a session (Supabase auto-parsed the success hash),
    // jump straight to Studio. Otherwise wait a moment — detectSessionInUrl
    // runs asynchronously on page load.
    if (supabaseUser) {
      setState('success');
      return;
    }

    const t = setTimeout(() => {
      // Still no user after 2s and no error: treat as direct visit and send to login.
      navigate('/login', { replace: true });
    }, 2000);
    return () => clearTimeout(t);
  }, [supabaseUser, navigate]);

  // If the session appeared after mount (async), transition to success.
  useEffect(() => {
    if (state === 'pending' && supabaseUser) setState('success');
  }, [supabaseUser, state]);

  if (state === 'expired') {
    return (
      <PageWrapper>
        <TopNav logoSub="Verify email" />
        <Container>
          <IconWrap $ok={false}><MailX /></IconWrap>
          <Title>Link expired</Title>
          <Subtitle>
            This email confirmation link is invalid or has already been used.
            Head back to sign-in — if your account still needs confirmation,
            we can send a fresh link.
          </Subtitle>
          <SubmitBtn onClick={() => navigate('/login')}>
            Back to sign-in <ArrowRight />
          </SubmitBtn>
        </Container>
        <Footer />
      </PageWrapper>
    );
  }

  if (state === 'success') {
    return (
      <PageWrapper>
        <TopNav logoSub="Verify email" />
        <Container>
          <IconWrap $ok><MailCheck /></IconWrap>
          <Title>Email confirmed</Title>
          <Subtitle>Your account is ready to use. Jump into the Studio to build your first widget.</Subtitle>
          <SubmitBtn onClick={() => navigate('/studio', { replace: true })}>
            Go to Studio <ArrowRight />
          </SubmitBtn>
        </Container>
        <Footer />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <TopNav logoSub="Verify email" />
      <Container>
        <IconWrap $ok><MailCheck /></IconWrap>
        <Title>Verifying…</Title>
        <Subtitle>Hang tight while we confirm your email.</Subtitle>
      </Container>
      <Footer />
    </PageWrapper>
  );
};
