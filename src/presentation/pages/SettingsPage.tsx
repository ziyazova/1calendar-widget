import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  User as UserIcon,
  Mail,
  Lock,
  Shield,
  Sparkles,
  Download,
  FileText,
  LogOut,
  Trash2,
  Eye,
  EyeOff,
  Check,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/shared/Footer';
import { EmailVerificationBanner } from '../components/shared/EmailVerificationBanner';
import { useAuth } from '../context/AuthContext';
import { useUpgradeModal } from '../context/UpgradeModalContext';
import { AccountService } from '@/infrastructure/services/AccountService';
import { SubscriptionService } from '@/infrastructure/services/SubscriptionService';
import {
  PlanBadge,
  Modal as SharedModal,
  ModalFooter,
  Button as SharedButton,
} from '@/presentation/components/shared';

const formatDate = (iso: string | null): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const humanisePasswordError = (raw: string, isFirstTimeSet: boolean): string => {
  const m = raw.toLowerCase();
  if (m.includes('same as') || m.includes('should be different')) {
    return isFirstTimeSet
      ? 'This password cannot be used. Please choose another one.'
      : 'New password must be different from your current one.';
  }
  if (m.includes('weak') || m.includes('password should be') || m.includes('password must')) {
    return 'Password is too weak. Use at least 8 characters with a letter and a number.';
  }
  if (m.includes('reauthenticat')) {
    return 'For security, please log out and log back in before changing your password.';
  }
  if (m.includes('rate limit') || m.includes('only request this') || m.includes('too many')) {
    return 'Too many attempts. Please wait a minute and try again.';
  }
  if (m.includes('network') || m.includes('fetch')) {
    return 'Network error. Check your connection and try again.';
  }
  return 'We could not update your password. Please try again.';
};

/* ────────────────── Page shell ────────────────── */

const Page = styled.div`
  min-height: 100vh;
  background: #FBFAF7;
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const HeroBg = styled.div`
  position: absolute;
  inset: 0 0 auto 0;
  height: 320px;
  background:
    radial-gradient(ellipse 800px 360px at 50% -20%, rgba(255, 205, 178, 0.45), transparent 70%),
    radial-gradient(ellipse 600px 280px at 80% 10%, rgba(232, 218, 255, 0.35), transparent 70%);
  pointer-events: none;
  z-index: 0;
`;

const Shell = styled.main`
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 24px 64px;

  @media (max-width: 600px) {
    padding: 24px 16px 48px;
  }
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.03em;
  margin: 0 0 4px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const PageSubtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0 0 24px;
  letter-spacing: -0.01em;
`;

/* ────────────────── Profile header card ────────────────── */

const ProfileCard = styled.section`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  margin-bottom: 16px;

  @media (max-width: 520px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    padding: 16px;
  }
`;

const Avatar = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD4B8 0%, #FFB3A0 40%, #E8B4E3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.02em;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(255, 160, 140, 0.22);
`;

const ProfileMeta = styled.div`
  flex: 1;
  min-width: 0;
`;

const ProfileName = styled.div`
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 2px;
`;

const ProfileEmail = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  letter-spacing: -0.005em;
  margin: 0 0 8px;
`;

/* ────────────────── Section cards ────────────────── */

const Section = styled.section`
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  padding: 18px 20px;
  margin-bottom: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const SectionIcon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.background.surfaceMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.text.tertiary};
    stroke-width: 1.75;
  }
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const SectionSub = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  letter-spacing: -0.005em;
  margin: 2px 0 0;
  line-height: 1.5;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 10px;

  &:last-child { margin-bottom: 0; }
`;

const Label = styled.label`
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.tertiary};
  letter-spacing: 0;
`;

const Input = styled.input`
  height: 38px;
  padding: 0 12px;
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
  font-size: 13px;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text.primary};
  outline: none;
  transition: border-color 0.15s ease, background 0.15s ease;

  &:focus {
    border-color: rgba(0, 0, 0, 0.18);
    background: #fff;
  }

  &[readonly] {
    color: ${({ theme }) => theme.colors.text.tertiary};
    background: ${({ theme }) => theme.colors.background.surfaceMuted};
    cursor: default;
  }
`;

const SectionActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
`;

/* Row-style for security / privacy / subscription / danger sections */

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 11px 0;

  & + & { border-top: 1px solid rgba(0, 0, 0, 0.04); }
  &:first-of-type { padding-top: 2px; }
  &:last-of-type { padding-bottom: 2px; }

  @media (max-width: 520px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
`;

const RowLabel = styled.div`
  flex: 1;
  min-width: 0;
`;

const RowTitle = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.005em;
`;

const RowDesc = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-top: 2px;
  line-height: 1.5;
  letter-spacing: 0;
`;

/* ────────────────── Buttons ────────────────── */

const Button = styled.button<{ $variant?: 'primary' | 'ghost' | 'danger' | 'dangerSolid' | 'upgrade' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  letter-spacing: -0.005em;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease, opacity 0.15s ease, transform 0.1s ease;

  ${({ $variant }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: #1F1F1F;
          color: #fff;
          border: 1px solid #1F1F1F;
          &:hover:not(:disabled) { background: #000; border-color: #000; }
        `;
      case 'danger':
        return `
          background: #fff;
          color: #DC2828;
          border: 1px solid rgba(220, 40, 40, 0.22);
          &:hover:not(:disabled) { background: rgba(220, 40, 40, 0.04); border-color: rgba(220, 40, 40, 0.35); }
        `;
      case 'dangerSolid':
        return `
          background: #DC2828;
          color: #fff;
          border: 1px solid #DC2828;
          &:hover:not(:disabled) { background: #B91C1C; border-color: #B91C1C; }
        `;
      case 'upgrade':
        return `
          background: linear-gradient(135deg, #EEF0FF 0%, #E2E7FF 100%);
          color: #4F46E5;
          border: 1px solid rgba(99, 102, 241, 0.22);
          font-weight: 600;
          &:hover:not(:disabled) {
            border-color: rgba(99, 102, 241, 0.38);
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.16);
            transform: translateY(-0.5px);
          }
          svg { color: #6366F1; }
        `;
      case 'ghost':
      default:
        return `
          background: #fff;
          color: #1F1F1F;
          border: 1px solid rgba(0, 0, 0, 0.1);
          &:hover:not(:disabled) { background: rgba(0, 0, 0, 0.03); border-color: rgba(0, 0, 0, 0.14); }
        `;
    }
  }}

  &:disabled { opacity: 0.5; cursor: not-allowed; }
  svg { width: 13px; height: 13px; stroke-width: 1.75; }
`;

/* ────────────────── Modal form internals ────────────────── */
/* All three modals (password/email/delete) use the shared <Modal> shell;
   these styled-components are just the form body bits inside them. */

const ModalText = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 20px;
`;

const ModalInputWrap = styled.div`
  position: relative;
  margin-bottom: 10px;

  svg.lead {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
  button.toggle {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text.tertiary};
    padding: 4px;
    display: flex;
    align-items: center;
  }
`;

const ModalInput = styled.input`
  width: 100%;
  height: 46px;
  padding: 0 44px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s ease, background 0.15s ease;

  &:focus { border-color: rgba(0, 0, 0, 0.18); background: #fff; }
`;

const PwChecks = styled.div`
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  padding: 10px 12px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PwCheck = styled.div<{ $met: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${({ $met }) => ($met ? '#16A34A' : '#8E8E93')};

  svg { width: 12px; height: 12px; opacity: ${({ $met }) => ($met ? 1 : 0.35)}; }
`;

const ErrorText = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.destructiveText};
  background: rgba(220, 40, 40, 0.06);
  border: 1px solid rgba(220, 40, 40, 0.15);
  padding: 10px 12px;
  border-radius: 12px;
  margin-bottom: 12px;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;

  > button { flex: 1; height: 44px; }
`;

/* ────────────────── Component ────────────────── */

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    user, isRegistered, loading, logout, supabaseUser, updatePassword, updateProfile,
    verifyPassword, updateEmail,
    logoutOthers, linkGoogle, unlinkGoogle,
    hasPasswordLogin: ctxHasPasswordLogin, hasGoogleLogin,
    plan, isPro, refreshPlan,
  } = useAuth();
  const { open: openUpgrade } = useUpgradeModal();
  const [searchParams, setSearchParams] = useSearchParams();
  const [justUpgraded, setJustUpgraded] = useState(false);

  // Coming back from Polar checkout? Re-fetch plan and show a confirmation.
  // The webhook is the source of truth — but this gives the user instant
  // feedback while the webhook catches up.
  useEffect(() => {
    if (searchParams.get('upgraded') !== '1') return;
    setJustUpgraded(true);
    void refreshPlan();
    const next = new URLSearchParams(searchParams);
    next.delete('upgraded');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams, refreshPlan]);

  // Local banners for Security section
  const [otherSignOutState, setOtherSignOutState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [otherSignOutError, setOtherSignOutError] = useState<string | null>(null);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  // Profile form
  const [name, setName] = useState(user?.name || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSavedAt, setProfileSavedAt] = useState<number | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password modal
  const [showPwModal, setShowPwModal] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwSubmitting, setPwSubmitting] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [showPw, setShowPw] = useState(false);

  // Change-email modal
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailStep, setEmailStep] = useState<'verify' | 'new' | 'sent'>('verify');
  const [emailCurrentPw, setEmailCurrentPw] = useState('');
  const [emailShowPw, setEmailShowPw] = useState(false);
  const [emailNew, setEmailNew] = useState('');
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Delete modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Export
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!loading && !isRegistered) navigate('/login');
  }, [loading, isRegistered, navigate]);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  if (loading || !isRegistered || !user) return null;

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : (user.email?.[0] || 'U').toUpperCase();

  // Prefer context value but fall back to direct identities read if the context
  // hasn't refreshed after a link/unlink action yet.
  const hasPasswordLogin = ctxHasPasswordLogin || Boolean(
    supabaseUser?.identities?.some(i => i.provider === 'email'),
  );

  const pwChecks = [
    { label: 'At least 8 characters', met: newPw.length >= 8 },
    { label: 'Contains a letter', met: /[a-zA-Z]/.test(newPw) },
    { label: 'Contains a number', met: /\d/.test(newPw) },
    { label: 'Passwords match', met: confirmPw.length > 0 && newPw === confirmPw },
  ];
  const pwValid = pwChecks.every(c => c.met);
  const nameDirty = name.trim() !== (user.name || '').trim() && name.trim().length > 0;

  const handleSaveProfile = async () => {
    if (!nameDirty) return;
    setSavingProfile(true);
    setProfileError(null);
    try {
      const err = await updateProfile({ name: name.trim() });
      if (err) {
        setProfileError(err.toLowerCase().includes('network') || err.toLowerCase().includes('fetch')
          ? 'Network error. Check your connection and try again.'
          : 'Could not save profile. Please try again.');
        return;
      }
      setProfileSavedAt(Date.now());
    } finally {
      setSavingProfile(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const payload = await AccountService.buildExportPayload();
      if (!payload) return;
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const date = new Date().toISOString().slice(0, 10);
      a.download = `peachy-export-${date}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const handleSignOutOthers = async () => {
    setOtherSignOutState('loading');
    setOtherSignOutError(null);
    const err = await logoutOthers();
    if (err) {
      setOtherSignOutError(err.toLowerCase().includes('rate')
        ? 'Please wait a minute and try again.'
        : 'Could not sign out other devices. Please try again.');
      setOtherSignOutState('error');
      return;
    }
    setOtherSignOutState('done');
    setTimeout(() => setOtherSignOutState('idle'), 4000);
  };

  const handleLinkGoogle = async () => {
    setGoogleBusy(true);
    setGoogleError(null);
    const err = await linkGoogle();
    if (err) {
      setGoogleError(err.toLowerCase().includes('identity is already linked')
        ? 'Google is already connected to this account.'
        : err.toLowerCase().includes('different email') || err.toLowerCase().includes('does not match')
          ? "The Google account email doesn't match your current email. Use the Google account with the same email."
          : 'Could not connect Google right now.');
      setGoogleBusy(false);
    }
    // On success, Supabase redirects out — no need to reset busy state.
  };

  const handleUnlinkGoogle = async () => {
    if (!hasPasswordLogin) {
      setGoogleError('Set a password first so you don\'t lose access to your account.');
      return;
    }
    setGoogleBusy(true);
    setGoogleError(null);
    const err = await unlinkGoogle();
    if (err) {
      setGoogleError(err);
    }
    setGoogleBusy(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    const err = await AccountService.deleteOwnAccount();
    if (err) {
      setDeleteError(err);
      setDeleting(false);
      return;
    }
    navigate('/login?deleted=1', { replace: true });
  };

  return (
    <Page>
      <TopNav logoSub="Settings" activeLink="studio" />
      <EmailVerificationBanner />
      <HeroBg />
      <Shell>
        <PageTitle>Settings</PageTitle>
        <PageSubtitle>Manage your account, security and preferences</PageSubtitle>

        {justUpgraded && (
          <div style={{
            marginBottom: 16, padding: '12px 14px',
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.22)',
            borderRadius: 12, color: '#4F46E5',
            fontSize: 13, letterSpacing: '-0.005em',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <span><strong>Welcome to Pro.</strong> Your subscription is active — enjoy unlimited widgets and all styles.</span>
            <button
              onClick={() => setJustUpgraded(false)}
              style={{ background: 'none', border: 'none', color: '#4F46E5', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Profile header */}
        <ProfileCard>
          <Avatar>{initials}</Avatar>
          <ProfileMeta>
            <ProfileName>{user.name || 'Peachy member'}</ProfileName>
            <ProfileEmail>{user.email}</ProfileEmail>
            <PlanBadge $pro={isPro}>{isPro ? 'Pro' : 'Free'}</PlanBadge>
          </ProfileMeta>
          {!isPro && (
            <Button $variant="upgrade" onClick={openUpgrade}>
              <ArrowUpRight /> Upgrade
            </Button>
          )}
        </ProfileCard>

        {/* Profile details */}
        <Section>
          <SectionHeader>
            <SectionIcon><UserIcon /></SectionIcon>
            <div>
              <SectionTitle>Profile</SectionTitle>
              <SectionSub>Your display name and email address</SectionSub>
            </div>
          </SectionHeader>
          <Field>
            <Label htmlFor="settings-name">Name</Label>
            <Input
              id="settings-name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
            />
          </Field>
          <Field>
            <Label htmlFor="settings-email">Email</Label>
            <Input id="settings-email" value={user.email} readOnly />
          </Field>
          <SectionActions>
            {profileError && (
              <span style={{ alignSelf: 'center', fontSize: 12, color: '#DC2828', marginRight: 4 }}>
                {profileError}
              </span>
            )}
            {!profileError && profileSavedAt && !nameDirty && (
              <span style={{ alignSelf: 'center', fontSize: 12, color: '#16A34A', marginRight: 4 }}>
                <Check style={{ width: 12, height: 12, verticalAlign: -1, marginRight: 2 }} />
                Saved
              </span>
            )}
            <Button
              $variant="primary"
              onClick={handleSaveProfile}
              disabled={!nameDirty || savingProfile}
            >
              {savingProfile ? 'Saving…' : 'Save changes'}
            </Button>
          </SectionActions>
        </Section>

        {/* Security */}
        <Section>
          <SectionHeader>
            <SectionIcon><Shield /></SectionIcon>
            <div>
              <SectionTitle>Security</SectionTitle>
              <SectionSub>Password and sign-in methods</SectionSub>
            </div>
          </SectionHeader>
          <Row>
            <RowLabel>
              <RowTitle>Password</RowTitle>
              <RowDesc>
                {hasPasswordLogin
                  ? 'Change the password you use to sign in with email.'
                  : "You signed up with Google. Set a password to also sign in with email."}
              </RowDesc>
            </RowLabel>
            <Button
              onClick={() => {
                setShowPwModal(true);
                setCurrentPw(''); setNewPw(''); setConfirmPw(''); setPwError(null); setPwSuccess(false);
              }}
            >
              <Lock /> {hasPasswordLogin ? 'Change password' : 'Set password'}
            </Button>
          </Row>
          <Row>
            <RowLabel>
              <RowTitle>Google</RowTitle>
              <RowDesc>
                {hasGoogleLogin
                  ? 'Signed-in with Google is connected to this account.'
                  : 'Connect your Google account for faster sign-in next time.'}
                {googleError && (
                  <div style={{ color: '#DC2828', marginTop: 4 }}>{googleError}</div>
                )}
              </RowDesc>
            </RowLabel>
            {hasGoogleLogin ? (
              <Button
                onClick={handleUnlinkGoogle}
                disabled={googleBusy || !hasPasswordLogin}
                title={!hasPasswordLogin ? 'Set a password first so you don\'t lose access.' : undefined}
              >
                {googleBusy ? 'Working…' : 'Disconnect Google'}
              </Button>
            ) : (
              <Button onClick={handleLinkGoogle} disabled={googleBusy}>
                <svg width="14" height="14" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                {googleBusy ? 'Redirecting…' : 'Connect Google'}
              </Button>
            )}
          </Row>
          <Row>
            <RowLabel>
              <RowTitle>Active sessions</RowTitle>
              <RowDesc>
                Sign out of every other device where you're logged in. You'll stay signed in on this one.
                {otherSignOutState === 'done' && (
                  <div style={{ color: '#16A34A', marginTop: 4 }}>
                    <Check style={{ width: 12, height: 12, verticalAlign: -1, marginRight: 2 }} />
                    All other sessions signed out.
                  </div>
                )}
                {otherSignOutState === 'error' && otherSignOutError && (
                  <div style={{ color: '#DC2828', marginTop: 4 }}>{otherSignOutError}</div>
                )}
              </RowDesc>
            </RowLabel>
            <Button onClick={handleSignOutOthers} disabled={otherSignOutState === 'loading'}>
              <LogOut /> {otherSignOutState === 'loading' ? 'Signing out…' : 'Sign out other devices'}
            </Button>
          </Row>
          <Row>
            <RowLabel>
              <RowTitle>Email address</RowTitle>
              <RowDesc>
                Signed in as {user.email}.
                {!hasPasswordLogin && (
                  <> Set a password first — we require it to verify email changes.</>
                )}
              </RowDesc>
            </RowLabel>
            <Button
              disabled={!hasPasswordLogin}
              onClick={() => {
                setShowEmailModal(true);
                setEmailStep('verify');
                setEmailCurrentPw('');
                setEmailNew('');
                setEmailError(null);
              }}
              title={!hasPasswordLogin ? 'Set a password first so we can verify email changes.' : undefined}
            >
              <Mail /> Change email
            </Button>
          </Row>
        </Section>

        {/* Subscription */}
        <Section>
          <SectionHeader>
            <SectionIcon><Sparkles /></SectionIcon>
            <div>
              <SectionTitle>Subscription</SectionTitle>
              <SectionSub>Your current plan and billing</SectionSub>
            </div>
          </SectionHeader>
          {isPro ? (
            <Row>
              <RowLabel>
                <RowTitle>Pro plan · $4 / month</RowTitle>
                <RowDesc>
                  {plan.status === 'canceled'
                    ? <>Cancelled — access continues until {formatDate(plan.currentPeriodEnd)}.</>
                    : plan.currentPeriodEnd
                      ? <>Next billing on {formatDate(plan.currentPeriodEnd)}. Unlimited widgets, all styles, full customization.</>
                      : <>Unlimited widgets, all styles, full customization.</>
                  }
                </RowDesc>
              </RowLabel>
              <Button onClick={async () => {
                // Billing + cancellation live in Polar's customer portal. The
                // Edge Function mints a signed portal URL for this specific
                // user; fall back to polar.sh if the call fails so the button
                // never becomes a dead-end.
                const ok = await SubscriptionService.openCustomerPortal();
                if (!ok) window.open('https://polar.sh', '_blank', 'noopener,noreferrer');
              }}>
                Cancel or manage subscription
              </Button>
            </Row>
          ) : (
            <Row>
              <RowLabel>
                <RowTitle>Free plan</RowTitle>
                <RowDesc>3 widgets, basic customization. Upgrade for unlimited widgets and premium styles.</RowDesc>
              </RowLabel>
              <Button $variant="upgrade" onClick={openUpgrade}>
                <ArrowUpRight /> Upgrade to Pro
              </Button>
            </Row>
          )}
        </Section>

        {/* Privacy & data */}
        <Section>
          <SectionHeader>
            <SectionIcon><FileText /></SectionIcon>
            <div>
              <SectionTitle>Privacy &amp; data</SectionTitle>
              <SectionSub>Export your data or review our policies</SectionSub>
            </div>
          </SectionHeader>
          <Row>
            <RowLabel>
              <RowTitle>Download my data</RowTitle>
              <RowDesc>Export your profile and saved widgets as a JSON file.</RowDesc>
            </RowLabel>
            <Button onClick={handleExport} disabled={exporting}>
              <Download /> {exporting ? 'Preparing…' : 'Download JSON'}
            </Button>
          </Row>
          <Row>
            <RowLabel>
              <RowTitle>Privacy policy</RowTitle>
              <RowDesc>Read how we collect, store and process your data.</RowDesc>
            </RowLabel>
            <Button onClick={() => navigate('/privacy')}>
              Read policy
            </Button>
          </Row>
        </Section>

        {/* Danger zone */}
        <Section>
          <SectionHeader>
            <SectionIcon style={{ background: 'rgba(220, 40, 40, 0.08)' }}>
              <Trash2 style={{ color: '#B91C1C' }} />
            </SectionIcon>
            <div>
              <SectionTitle style={{ color: '#B91C1C' }}>Danger zone</SectionTitle>
              <SectionSub>Actions here cannot be undone. Proceed carefully.</SectionSub>
            </div>
          </SectionHeader>
          <Row>
            <RowLabel>
              <RowTitle>Log out</RowTitle>
              <RowDesc>End your session on this device.</RowDesc>
            </RowLabel>
            <Button $variant="danger" onClick={async () => { await logout(); navigate('/'); }}>
              <LogOut /> Log out
            </Button>
          </Row>
          <Row>
            <RowLabel>
              <RowTitle>Delete account</RowTitle>
              <RowDesc>Permanently remove your profile and all widgets. This cannot be undone.</RowDesc>
            </RowLabel>
            <Button
              $variant="danger"
              onClick={() => { setShowDeleteConfirm(true); setDeleteConfirmText(''); setDeleteError(null); }}
            >
              <Trash2 /> Delete account
            </Button>
          </Row>
        </Section>
      </Shell>

      <Footer />

      {/* Password modal — migrated to shared <Modal>. Form body stays page-local. */}
      <SharedModal
        open={showPwModal}
        onClose={() => !pwSubmitting && setShowPwModal(false)}
        title={pwSuccess ? 'Password updated' : (hasPasswordLogin ? 'Change password' : 'Set a password')}
        size="sm"
        hideClose={pwSubmitting}
      >
        {pwSuccess ? (
          <>
            <ModalText>
              You can use your new password the next time you sign in with email.
              Other devices where you were signed in have been logged out.
            </ModalText>
            <SharedButton
              $variant="primary"
              $size="lg"
              $fullWidth
              onClick={() => setShowPwModal(false)}
            >
              Done
            </SharedButton>
          </>
        ) : (
          <>
            <ModalText>Choose a strong password you haven't used before.</ModalText>
            {pwError && <ErrorText>{pwError}</ErrorText>}
            <form
              onSubmit={async e => {
                e.preventDefault();
                setPwError(null);
                if (!pwValid) {
                  setPwError('Password does not meet the requirements or does not match.');
                  return;
                }
                setPwSubmitting(true);
                try {
                  // Re-auth with current password so a stolen session can't
                  // change the password without knowing it. Only applies
                  // when the user already has a password — Google-only
                  // users are "setting" a password for the first time.
                  if (hasPasswordLogin) {
                    if (currentPw.length === 0) {
                      setPwError('Enter your current password.');
                      return;
                    }
                    const verifyErr = await verifyPassword(currentPw);
                    if (verifyErr) {
                      setPwError(verifyErr.toLowerCase().includes('invalid')
                        ? 'Current password is incorrect.'
                        : humanisePasswordError(verifyErr, false));
                      return;
                    }
                  }
                  const err = await updatePassword(newPw);
                  if (err) {
                    setPwError(humanisePasswordError(err, !hasPasswordLogin));
                    return;
                  }
                  // Invalidate sessions on other devices so a stolen token
                  // can't survive the password change. Current device stays.
                  await logoutOthers();
                  setPwSuccess(true);
                } finally {
                  setPwSubmitting(false);
                }
              }}
            >
              {hasPasswordLogin && (
                <ModalInputWrap>
                  <Lock className="lead" />
                  <ModalInput
                    type={showPw ? 'text' : 'password'}
                    autoFocus
                    placeholder="Current password"
                    value={currentPw}
                    onChange={e => setCurrentPw(e.target.value)}
                    autoComplete="current-password"
                  />
                </ModalInputWrap>
              )}
              <ModalInputWrap>
                <Lock className="lead" />
                <ModalInput
                  type={showPw ? 'text' : 'password'}
                  autoFocus={!hasPasswordLogin}
                  placeholder="New password"
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                />
                <button
                  type="button"
                  className="toggle"
                  onClick={() => setShowPw(v => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </ModalInputWrap>
              <ModalInputWrap style={{ marginBottom: 14 }}>
                <Lock className="lead" />
                <ModalInput
                  type={showPw ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                />
              </ModalInputWrap>

              {newPw.length > 0 && (
                <PwChecks>
                  {pwChecks.map(c => (
                    <PwCheck key={c.label} $met={c.met}>
                      {c.met ? <CheckCircle2 /> : <Check />}
                      {c.label}
                    </PwCheck>
                  ))}
                </PwChecks>
              )}

              <ModalFooter style={{ marginLeft: -24, marginRight: -24, marginBottom: -24, marginTop: 16 }}>
                <SharedButton
                  type="button"
                  $variant="secondary"
                  $size="lg"
                  onClick={() => setShowPwModal(false)}
                  disabled={pwSubmitting}
                >
                  Cancel
                </SharedButton>
                <SharedButton
                  type="submit"
                  $variant="primary"
                  $size="lg"
                  disabled={pwSubmitting || !pwValid}
                >
                  {pwSubmitting ? 'Updating…' : 'Update password'}
                </SharedButton>
              </ModalFooter>
            </form>
          </>
        )}
      </SharedModal>

      {/* Change-email modal — migrated to shared <Modal>. Multi-step form stays page-local. */}
      <SharedModal
        open={showEmailModal}
        onClose={() => !emailSubmitting && setShowEmailModal(false)}
        title={
          emailStep === 'sent'
            ? 'Confirm your new email'
            : emailStep === 'verify'
              ? 'Verify your password'
              : 'New email address'
        }
        size="sm"
        hideClose={emailSubmitting}
      >
        {emailStep === 'sent' ? (
          <>
            <ModalText>
              We sent a confirmation link to <strong>{emailNew}</strong>.
              Click the link in that email to finish the change — your address
              will stay <strong>{user.email}</strong> until you do.
            </ModalText>
            <SharedButton
              $variant="primary"
              $size="lg"
              $fullWidth
              onClick={() => setShowEmailModal(false)}
            >
              Done
            </SharedButton>
          </>
        ) : emailStep === 'verify' ? (
          <>
            <ModalText>For your security, enter your current password before changing the email on your account.</ModalText>
            {emailError && <ErrorText>{emailError}</ErrorText>}
            <form onSubmit={async e => {
              e.preventDefault();
              setEmailError(null);
              if (emailCurrentPw.length === 0) {
                setEmailError('Enter your current password.');
                return;
              }
              setEmailSubmitting(true);
              try {
                const err = await verifyPassword(emailCurrentPw);
                if (err) {
                  setEmailError(err.toLowerCase().includes('invalid')
                    ? 'Current password is incorrect.'
                    : 'Could not verify your password. Please try again.');
                  return;
                }
                setEmailStep('new');
              } finally {
                setEmailSubmitting(false);
              }
            }}>
              <ModalInputWrap style={{ marginBottom: 14 }}>
                <Lock className="lead" />
                <ModalInput
                  type={emailShowPw ? 'text' : 'password'}
                  autoFocus
                  placeholder="Current password"
                  value={emailCurrentPw}
                  onChange={e => setEmailCurrentPw(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle"
                  onClick={() => setEmailShowPw(v => !v)}
                  aria-label={emailShowPw ? 'Hide password' : 'Show password'}
                >
                  {emailShowPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </ModalInputWrap>
              <ModalFooter style={{ marginLeft: -24, marginRight: -24, marginBottom: -24, marginTop: 16 }}>
                <SharedButton
                  type="button"
                  $variant="secondary"
                  $size="lg"
                  onClick={() => setShowEmailModal(false)}
                  disabled={emailSubmitting}
                >
                  Cancel
                </SharedButton>
                <SharedButton
                  type="submit"
                  $variant="primary"
                  $size="lg"
                  disabled={emailSubmitting}
                >
                  {emailSubmitting ? 'Verifying…' : 'Continue'}
                </SharedButton>
              </ModalFooter>
            </form>
          </>
        ) : (
          <>
            <ModalText>
              We'll send a confirmation link to the new address. Your email stays{' '}
              <strong>{user.email}</strong> until you click it.
            </ModalText>
            {emailError && <ErrorText>{emailError}</ErrorText>}
            <form onSubmit={async e => {
              e.preventDefault();
              setEmailError(null);
              const trimmed = emailNew.trim();
              if (!trimmed || !trimmed.includes('@') || !trimmed.includes('.')) {
                setEmailError('Please enter a valid email address.');
                return;
              }
              if (trimmed.toLowerCase() === (user.email || '').toLowerCase()) {
                setEmailError('That is already your email.');
                return;
              }
              setEmailSubmitting(true);
              try {
                const err = await updateEmail(trimmed);
                if (err) {
                  const m = err.toLowerCase();
                  setEmailError(m.includes('already') || m.includes('taken') || m.includes('registered')
                    ? 'This email is already in use by another account.'
                    : m.includes('rate') || m.includes('only request')
                      ? 'Please wait a minute before trying again.'
                      : 'Could not update email. Please try again.');
                  return;
                }
                setEmailStep('sent');
              } finally {
                setEmailSubmitting(false);
              }
            }}>
              <ModalInputWrap style={{ marginBottom: 14 }}>
                <Mail className="lead" />
                <ModalInput
                  type="email"
                  autoFocus
                  placeholder="new@example.com"
                  value={emailNew}
                  onChange={e => setEmailNew(e.target.value)}
                  autoComplete="email"
                />
              </ModalInputWrap>
              <ModalFooter style={{ marginLeft: -24, marginRight: -24, marginBottom: -24, marginTop: 16 }}>
                <SharedButton
                  type="button"
                  $variant="secondary"
                  $size="lg"
                  onClick={() => setShowEmailModal(false)}
                  disabled={emailSubmitting}
                >
                  Cancel
                </SharedButton>
                <SharedButton
                  type="submit"
                  $variant="primary"
                  $size="lg"
                  disabled={emailSubmitting}
                >
                  {emailSubmitting ? 'Sending…' : 'Send confirmation'}
                </SharedButton>
              </ModalFooter>
            </form>
          </>
        )}
      </SharedModal>

      {/* Delete modal — migrated to shared <Modal>. Form input stays page-local. */}
      <SharedModal
        open={showDeleteConfirm}
        onClose={() => !deleting && setShowDeleteConfirm(false)}
        title="Delete account?"
        size="sm"
      >
        <ModalText>
          We'll permanently remove your profile and all saved widgets from our servers. You can always sign up again later with the same email. To confirm, please type <strong>delete</strong> below.
        </ModalText>
        <ModalInputWrap style={{ marginBottom: deleteError ? 8 : 20 }}>
          <ModalInput
            style={{ padding: '0 14px' }}
            type="text"
            autoFocus
            value={deleteConfirmText}
            onChange={e => setDeleteConfirmText(e.target.value)}
            placeholder='Type "delete" to confirm'
          />
        </ModalInputWrap>
        {deleteError && <ErrorText style={{ marginBottom: 16 }}>{deleteError}</ErrorText>}
        <ModalFooter style={{ marginLeft: -24, marginRight: -24, marginBottom: -20, marginTop: 16 }}>
          <SharedButton
            type="button"
            $variant="secondary"
            $size="lg"
            onClick={() => setShowDeleteConfirm(false)}
            disabled={deleting}
          >
            Cancel
          </SharedButton>
          <SharedButton
            type="button"
            $variant="danger"
            $size="lg"
            onClick={handleDelete}
            disabled={deleting || deleteConfirmText.trim().toLowerCase() !== 'delete'}
          >
            <Trash2 /> {deleting ? 'Deleting…' : 'Delete forever'}
          </SharedButton>
        </ModalFooter>
      </SharedModal>
    </Page>
  );
};
