import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { Cookie } from 'lucide-react';

const CONSENT_KEY = 'peachy_consent';

const slideUp = keyframes`
  from { opacity: 0; transform: translate(-50%, 16px); }
  to { opacity: 1; transform: translate(-50%, 0); }
`;

const Wrap = styled.div`
  position: fixed;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  z-index: 150;
  width: min(560px, calc(100vw - 32px));
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 18px;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
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

const IconWrap = styled.div`
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(237,228,255,0.7), rgba(232,237,255,0.5));
  display: flex;
  align-items: center;
  justify-content: center;

  svg { width: 18px; height: 18px; color: #6366F1; }
`;

const Message = styled.div`
  flex: 1;
  font-size: 13px;
  color: #444;
  line-height: 1.5;
  letter-spacing: -0.01em;

  strong { color: #1F1F1F; font-weight: 600; }
`;

const PrivacyLink = styled(Link)`
  color: #6366F1;
  text-decoration: none;
  border-bottom: 1px solid rgba(99,102,241,0.25);
  &:hover { border-bottom-color: #6366F1; }
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 520px) {
    justify-content: flex-end;
  }
`;

const AcceptBtn = styled.button`
  height: 34px;
  padding: 0 16px;
  border: none;
  border-radius: 10px;
  background: #1F1F1F;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
  letter-spacing: -0.01em;

  &:hover { background: #333; }
`;

const getInitialConsent = (): boolean => {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'accepted';
  } catch {
    return true; // if storage unavailable, don't block UI
  }
};

export const ConsentBanner: React.FC = () => {
  const { pathname } = useLocation();
  const [accepted, setAccepted] = useState(() => getInitialConsent());

  // Avoid hydration flashes when navigating between routes.
  useEffect(() => { setAccepted(getInitialConsent()); }, []);

  // Never show the banner inside iframes used for Notion embeds.
  if (pathname.startsWith('/embed/')) return null;
  if (accepted) return null;

  const handleAccept = () => {
    try { localStorage.setItem(CONSENT_KEY, 'accepted'); } catch { /* ignore */ }
    setAccepted(true);
  };

  return (
    <Wrap role="dialog" aria-live="polite" aria-label="Storage notice">
      <IconWrap><Cookie /></IconWrap>
      <Message>
        We use cookies to keep you signed in and save your preferences. By continuing,
        you agree to our <PrivacyLink to="/privacy">Privacy Policy</PrivacyLink>.
      </Message>
      <Actions>
        <AcceptBtn onClick={handleAccept}>Accept</AcceptBtn>
      </Actions>
    </Wrap>
  );
};
