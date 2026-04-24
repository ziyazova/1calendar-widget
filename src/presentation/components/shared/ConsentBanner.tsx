import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { Cookie } from 'lucide-react';
import { Button } from './Button';

const CONSENT_KEY = 'peachy_consent';

const slideUp = keyframes`
  from { opacity: 0; transform: translate(-50%, 16px); }
  to { opacity: 1; transform: translate(-50%, 0); }
`;

export const ConsentBannerWrap = styled.div`
  position: fixed;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  z-index: ${({ theme }) => theme.zIndex.overlay};
  width: min(560px, calc(100vw - 32px));
  background: ${({ theme }) => theme.colors.background.glassBright};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.floating};
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  animation: ${slideUp} 0.4s cubic-bezier(0.22, 1, 0.36, 1);

  @media (max-width: 520px) {
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
  }
`;

export const ConsentBannerIcon = styled.div`
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.gradients.softBanner};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 18px;
    height: 18px;
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const ConsentBannerMessage = styled.div`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text.body};
  line-height: 1.5;
  letter-spacing: -0.01em;

  strong { color: ${({ theme }) => theme.colors.text.primary}; font-weight: 600; }
`;

export const ConsentBannerPrivacyLink = styled(Link)`
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: none;
  border-bottom: 1px solid rgba(99, 102, 241, 0.25);
  &:hover { border-bottom-color: ${({ theme }) => theme.colors.accent}; }
`;

export const ConsentBannerActions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 520px) {
    justify-content: flex-end;
  }
`;

const getInitialConsent = (): boolean => {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'accepted';
  } catch {
    return true;
  }
};

export const ConsentBanner: React.FC = () => {
  const { pathname } = useLocation();
  const [accepted, setAccepted] = useState(() => getInitialConsent());

  useEffect(() => { setAccepted(getInitialConsent()); }, []);

  if (pathname.startsWith('/embed/')) return null;
  if (accepted) return null;

  const handleAccept = () => {
    try { localStorage.setItem(CONSENT_KEY, 'accepted'); } catch { /* ignore */ }
    setAccepted(true);
  };

  return (
    <ConsentBannerWrap role="dialog" aria-live="polite" aria-label="Storage notice">
      <ConsentBannerIcon><Cookie /></ConsentBannerIcon>
      <ConsentBannerMessage>
        We use cookies to keep you signed in and save your preferences. By continuing,
        you agree to our <ConsentBannerPrivacyLink to="/privacy">Privacy Policy</ConsentBannerPrivacyLink>.
      </ConsentBannerMessage>
      <ConsentBannerActions>
        <Button $variant="primary" $size="sm" onClick={handleAccept}>Accept</Button>
      </ConsentBannerActions>
    </ConsentBannerWrap>
  );
};
