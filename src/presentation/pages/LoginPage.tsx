import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';
import { PageWrapper } from '@/presentation/components/shared';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/presentation/context/AuthContext';

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

  &:hover { background: #333; }
  &:active { transform: scale(0.99); }
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
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.destructive};
  text-align: center;
  padding: ${({ theme }) => theme.spacing['2']} 0;
`;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (auth.isRegistered) navigate('/studio');
  }, [auth.isRegistered, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isSignUp) {
        if (!name.trim() || !email.trim() || !password.trim()) {
          setError('Please fill in all fields');
          return;
        }
        const err = await auth.register(name, email, password);
        if (err) {
          setError(err);
        } else {
          navigate('/studio');
        }
      } else {
        if (!email.trim() || !password.trim()) {
          setError('Please fill in all fields');
          return;
        }
        const err = await auth.login(email, password);
        if (err) {
          setError(err);
        } else {
          navigate('/studio');
        }
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

        {error && <ErrorText>{error}</ErrorText>}

        <Form onSubmit={handleSubmit}>
          {isSignUp && (
            <InputWrap>
              <InputIcon><Mail /></InputIcon>
              <Input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
            </InputWrap>
          )}
          <InputWrap>
            <InputIcon><Mail /></InputIcon>
            <Input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
          </InputWrap>
          <InputWrap>
            <InputIcon><Lock /></InputIcon>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff /> : <Eye />}
            </PasswordToggle>
          </InputWrap>
          {!isSignUp && <ForgotLink type="button">Forgot password?</ForgotLink>}
          <SubmitBtn type="submit" disabled={submitting}>{submitting ? 'Loading...' : isSignUp ? 'Sign up' : 'Log in'}</SubmitBtn>
        </Form>

        <Divider>or</Divider>

        <SocialBtn onClick={() => auth.loginWithGoogle()}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </SocialBtn>

        <BottomText>
          {isSignUp
            ? <>Already have an account? <LinkBtn onClick={() => setIsSignUp(false)}>Log in</LinkBtn></>
            : <>Don't have an account? <LinkBtn onClick={() => setIsSignUp(true)}>Sign up</LinkBtn></>
          }
        </BottomText>
      </Container>
    </PageWrapper>
  );
};
