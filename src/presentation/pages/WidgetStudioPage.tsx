import React, { useState, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { ArrowRight, Calendar, Clock, Image, Pencil, Lock, Star, Sparkle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';
import { PageWrapper, FilterRow, FilterChip, SectionHeader, BackButton, ProPill, PopularPill, Button as SharedButton, GoogleIcon, Modal, ModalFooter, OverlayBadge } from '@/presentation/components/shared';
import { fadeUp } from '@/presentation/themes/animations';
import { BigFooter } from '@/presentation/components/landing/BigFooter';
import { HowItWorksSection } from '@/presentation/components/landing/HowItWorksSection';
import { PinterestGallery } from '@/presentation/components/landing/PinterestGallery';
import { useAuth } from '@/presentation/context/AuthContext';
import { useUpgradeModal } from '@/presentation/context/UpgradeModalContext';
import { useWidgetQuota } from '@/presentation/hooks/useWidgetQuota';

const PageContent = styled.div<{ $hide?: boolean }>`
  opacity: ${({ $hide }) => $hide ? 0 : 1};
  transition: opacity 0.3s ease;
  pointer-events: ${({ $hide }) => $hide ? 'none' : 'auto'};
`;

/* Name-your-widget text input inside the shared <Modal>. Theme-driven so
   it matches SettingsPage modal inputs visually. */
const NameModalInput = styled.input`
  width: 100%;
  height: 46px;
  padding: 0 14px;
  border: 1px solid ${({ theme }) => theme.colors.border.medium};
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s ease, background 0.15s ease;

  &::placeholder { color: ${({ theme }) => theme.colors.text.muted}; }
  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.background.elevated};
  }
`;

/* ── Hero Card ── */
const HeroCard = styled.div`
  max-width: 920px;
  margin: 8px auto 0;
  padding: 16px 48px 40px;
  text-align: center;
  position: relative;
  z-index: 3;
  animation: ${fadeUp} 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;

  @media (max-width: 900px) {
    margin-top: 116px;
    padding: 12px 20px 24px;
  }
`;

const HeroInner = styled.div<{ $expanding?: boolean }>`
  border-radius: ${({ theme }) => theme.radii['2xl']};
  padding: 64px 48px;
  text-align: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(150deg, rgba(237, 228, 255, 0.5) 0%, rgba(232, 237, 255, 0.45) 25%, rgba(238, 234, 255, 0.4) 50%, rgba(245, 235, 250, 0.45) 75%, rgba(255, 240, 245, 0.5) 100%);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border: 1.5px solid rgba(200, 195, 230, 0.3);
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  transform: ${({ $expanding }) => $expanding ? 'scale(0.97)' : 'scale(1)'};
  opacity: ${({ $expanding }) => $expanding ? 0 : 1};

  &:hover {
    transform: ${({ $expanding }) => $expanding ? 'scale(0.97)' : 'none'};
    border-color: rgba(200, 195, 230, 0.45);
  }

  @media (max-width: 768px) {
    padding: 36px 24px;
    border-radius: ${({ theme }) => theme.radii.xl};
  }
`;

const HeroIcons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 28px;
`;

const HeroIcon = styled.div<{ $delay: string }>`
  width: 48px;
  height: 48px;
  border-radius: 16px;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    border-radius: ${({ theme }) => theme.radii.md};
    svg { width: 18px !important; height: 18px !important; }
  }
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeUp} 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${({ $delay }) => $delay} both;

  svg { width: 22px; height: 22px; color: ${({ theme }) => theme.colors.text.secondary}; }
`;

const HeroTitle = styled.h1`
  font-family: 'Inter', sans-serif;
  font-size: clamp(42px, 5.6vw, 74px);
  font-weight: 600;
  color: #2B2320;
  letter-spacing: -0.03em;
  margin: 0;
  line-height: 1.2;

  em {
    font-style: normal;
    font-weight: 600;
    color: #2B2320;
  }
`;

const HeroDesc = styled.p`
  margin: 22px auto 32px;
  font-size: 16px;
  font-weight: 400;
  color: #9B9790;
  line-height: 1.65;
  max-width: 440px;
  letter-spacing: -0.005em;
`;

/* HeroButton — replaced by shared <Button $variant="primary" $size="xl" $fullWidth> */

const EmailRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
`;

const EmailInput = styled.input`
  width: 100%;
  height: 52px;
  padding: 0 18px;
  border: 1px solid rgba(26, 22, 19, 0.14);
  border-radius: 16px;
  font-size: 14px;
  font-family: inherit;
  color: #2B2320;
  background: #fff;
  outline: none;
  letter-spacing: -0.005em;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.9) inset, 0 4px 12px rgba(26, 22, 19, 0.04);
  transition: border-color 0.2s, box-shadow 0.2s;

  &::placeholder {
    color: #B5B1A9;
  }

  &:focus {
    border-color: rgba(26, 22, 19, 0.32);
    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.9) inset, 0 4px 14px rgba(26, 22, 19, 0.08);
  }
`;

const AuthDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  max-width: 380px;
  margin: 20px auto;
  color: #B5B1A9;
  font-size: 12px;
  letter-spacing: 0.02em;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(26, 22, 19, 0.08);
  }
`;

const CodeError = styled.div`
  font-size: 13px;
  color: #E07060;
  text-align: center;
  margin-top: 8px;
  font-weight: 500;
  letter-spacing: -0.01em;
`;


/* ── Floating Widgets ── */
const float1 = keyframes`
  0%   { transform: translateX(0px) rotate(-5deg); }
  50%  { transform: translateX(8px) rotate(-2deg); }
  100% { transform: translateX(0px) rotate(-5deg); }
`;
const float2 = keyframes`
  0%   { transform: translateX(0px) rotate(6deg); }
  50%  { transform: translateX(-10px) rotate(3deg); }
  100% { transform: translateX(0px) rotate(6deg); }
`;
const float3 = keyframes`
  0%   { transform: translateX(5px) rotate(-4deg); }
  50%  { transform: translateX(-5px) rotate(-7deg); }
  100% { transform: translateX(5px) rotate(-4deg); }
`;
const float4 = keyframes`
  0%   { transform: translateX(-4px) rotate(5deg); }
  50%  { transform: translateX(6px) rotate(8deg); }
  100% { transform: translateX(-4px) rotate(5deg); }
`;

/* ──────────────────────────────────────────────────────────────
   Те же token'ы вертикального ритма что и на главном лендинге.
   Одно место на всю страницу.
   ────────────────────────────────────────────────────────────── */
const SECTION_Y = {
  flush: '0',
  sm: '48px',
  md: '80px',
  lg: '120px',
  gap: '70px', // 70 + 70 = 140px между соседями
} as const;

const Section = styled.section<{
  $size?: keyof typeof SECTION_Y;
  $tint?: boolean;
  $bleedTop?: boolean;
  $bleedBottom?: boolean;
}>`
  padding-top: ${({ $size = 'md', $bleedTop }) => ($bleedTop ? '0' : SECTION_Y[$size])};
  padding-bottom: ${({ $size = 'md', $bleedBottom }) => ($bleedBottom ? '0' : SECTION_Y[$size])};
  ${({ $tint, theme }) => $tint && `background: ${theme.colors.background.surfaceAlt};`}

  @media (max-width: 768px) {
    padding-top: ${({ $size = 'md', $bleedTop }) =>
      $bleedTop ? '0' : $size === 'flush' ? '0' : '48px'};
    padding-bottom: ${({ $size = 'md', $bleedBottom }) =>
      $bleedBottom ? '0' : $size === 'flush' ? '0' : '48px'};
  }
`;

/* Заливка hero — тот же surfaceAlt что и на /?hero=v2 */
const Hero = styled.div`
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
`;

const HeroScene = styled.div`
  position: relative;
  max-width: 1200px;
  min-height: 728px;
  margin: 0 auto;
  padding: 88px 48px 49px;
  background: ${({ theme }) => theme.colors.background.surfaceAlt};

  @media (max-width: 768px) {
    min-height: 0;
    padding: 64px 24px 49px;
  }
`;

const FloatingWidget = styled.div<{ $left?: string; $right?: string; $top: string; $delay: string; $anim: number }>`
  position: absolute;
  ${({ $left }) => $left && `left: ${$left};`}
  ${({ $right }) => $right && `right: ${$right};`}
  top: ${({ $top }) => $top};
  width: 180px;
  border-radius: 0;
  overflow: visible;
  box-shadow: none;
  border: none;
  background: transparent;
  z-index: 2;
  pointer-events: auto;
  cursor: pointer;
  transition: filter 0.4s cubic-bezier(0.22, 1, 0.36, 1);

  img {
    width: 100%;
    display: block;
    filter: drop-shadow(0 24px 48px rgba(0, 0, 0, 0.08)) drop-shadow(0 8px 16px rgba(0, 0, 0, 0.04));
    transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), filter 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &:hover {
    animation-play-state: paused;
    z-index: 4;
  }
  &:hover img {
    transform: scale(1.06);
    filter: drop-shadow(0 32px 56px rgba(0, 0, 0, 0.12)) drop-shadow(0 12px 24px rgba(0, 0, 0, 0.06));
  }

  animation: ${({ $anim }) => $anim === 1 ? float1 : $anim === 2 ? float2 : $anim === 3 ? float3 : float4}
    ${({ $anim }) => $anim === 1 ? '7.3s' : $anim === 2 ? '10.7s' : $anim === 3 ? '9.1s' : '8.6s'}
    ease-in-out infinite both;
  animation-delay: ${({ $delay }) => $delay};
  will-change: transform;

  @media (max-width: 1024px) {
    width: 140px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

/* ── Widget Gallery (horizontal scroll) ── */
const WidgetGallerySection = styled.section`
  padding: 0;
  position: relative;
`;

const WidgetGalleryHeader = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 0 24px;
  }
`;

const WidgetGalleryTitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const WidgetGalleryTitle = styled.h2`
  font-size: 40px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const WidgetGalleryFilterRow = styled(FilterRow)`
  margin-bottom: 0;
`;

/* WidgetGalleryBtn — replaced by shared <Button $variant="primary" $size="md"> */

const WidgetGalleryGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 48px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    padding: 16px 24px;
    gap: 16px;
  }
`;

const widgetCardAppear = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const WidgetGalleryCardWrap = styled.div<{ $i?: number }>`
  background: #fff;
  border: 1.5px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.2s;
  animation: ${widgetCardAppear} 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${({ $i }) => 0.05 + ($i || 0) * 0.04}s both;

  &:hover {
    border-color: rgba(0, 0, 0, 0.1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }
`;

const WidgetGalleryMeta = styled.div`
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
`;

const WidgetGalleryCardTitle = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.01em;
`;

/* CustomizeBtn — replaced by shared <Button $variant="primary|outline" $size="sm"> */

/* Overlay badge — glass white + accent text. Sits on card thumbnails.
   Matches the unified badge system defined in /dev → Labels & Badges. */
const GalleryProBadgeSlot = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1;
`;

const GalleryCard = styled.div`
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(150deg, rgba(237,228,255,0.45) 0%, rgba(232,237,255,0.35) 30%, rgba(245,235,250,0.3) 60%, rgba(255,240,245,0.4) 100%);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
  border: 1px solid rgba(200, 195, 230, 0.2);

  @media (max-width: 768px) {
    border-radius: 16px;
  }
  position: relative;
  aspect-ratio: 4 / 3;

  &:hover img {
    opacity: 1;
  }
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  opacity: 1;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
`;

const GallerySection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 48px 80px;

  @media (max-width: 768px) {
    padding: 48px 24px 48px;
  }
`;

/* ── Features ── */
const FeaturesSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 48px;

  @media (max-width: 768px) { padding: 48px 24px; }
`;

const FeatureRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 768px) { grid-template-columns: 1fr; gap: 16px; }
`;

const FeatureItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
`;

const FeatureTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  letter-spacing: -0.02em;
`;

const FeatureDesc = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0;
  line-height: 1.5;
`;

/* ── Pricing ── */
const PricingSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;
  text-align: center;

  @media (max-width: 768px) { padding: 0 24px; }
`;

const PricingTitle = styled.h2`
  font-size: 40px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  margin: 0 0 8px;
`;

const PricingSubtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 40px;
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-width: 680px;
  margin: 0 auto;

  @media (max-width: 768px) { grid-template-columns: 1fr; max-width: 360px; }
`;

const PricingCard = styled.div<{ $highlighted?: boolean }>`
  background: ${({ $highlighted }) => $highlighted ? 'linear-gradient(150deg, #F8F6FF 0%, #F0F4FF 50%, #FFF6F8 100%)' : '#fff'};
  color: inherit;
  border: 1px solid ${({ $highlighted, theme }) => $highlighted ? 'rgba(130, 120, 200, 0.2)' : theme.colors.border.light};
  border-radius: 20px;
  padding: 32px 28px;
  text-align: left;
  position: relative;
  ${({ $highlighted }) => $highlighted && 'box-shadow: 0 6px 32px rgba(100, 80, 200, 0.08);'}
`;

const PricingPlan = styled.div`
  font-size: 14px;
  font-weight: 500;
  opacity: 0.6;
  margin-bottom: 4px;
`;

const PricingPrice = styled.div`
  font-size: 40px;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
`;

const PricingPeriod = styled.div`
  font-size: 13px;
  opacity: 0.5;
  margin-bottom: 24px;
`;

const PricingFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 14px;
  opacity: 0.8;

  li::before {
    content: '✓ ';
    margin-right: 4px;
  }
`;

/* PricingBtn — replaced by shared <Button $variant="primary|outline" $size="lg" $fullWidth> */

/* Kill FooterOuter's 120px margin-top for flush layout */
const FooterFlush = styled.div`
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
  & > div:first-child { margin-top: 0; }
`;

/* ── Bottom CTA ── */
const BottomCTA = styled.section`
  width: 100%;
  min-height: 560px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(150deg, rgba(237, 228, 255, 0.7) 0%, rgba(232, 237, 255, 0.65) 25%, rgba(238, 234, 255, 0.6) 50%, rgba(245, 235, 250, 0.65) 75%, rgba(255, 240, 245, 0.7) 100%);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  padding: 96px 48px;
  text-align: center;

  @media (max-width: 768px) {
    min-height: 440px;
    padding: 72px 24px;
  }
`;

const CTATitle = styled.h2`
  font-size: 40px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  margin: 0 0 8px;
`;

const CTADesc = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 28px;
`;

type WidgetCategory = 'all' | 'calendar' | 'clock' | 'boards' | 'buttons';

const GALLERY_FILTERS: { key: WidgetCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'clock', label: 'Clocks' },
  { key: 'boards', label: 'Boards' },
];

const FEATURED_ITEMS: { image: string; title: string }[] = [
  { image: '/gallery-calendar-typewriter.png', title: 'Typewriter Calendar' },
  { image: '/gallery-clock-flower.png', title: 'Flower Clock' },
  { image: '/gallery-camera.png', title: 'Camera Widget' },
];

const GALLERY_ITEMS: { image: string; title: string; category: WidgetCategory; type: string; style: string; pro?: boolean }[] = [
  { image: '/gallery-calendar-classic.png', title: 'Classic Calendar', category: 'calendar', type: 'calendar', style: 'classic' },
  { image: '/gallery-calendar-collage.png', title: 'Collage Calendar', category: 'calendar', type: 'calendar', style: 'collage' },
  { image: '/gallery-calendar-typewriter.png', title: 'Typewriter Calendar', category: 'calendar', type: 'calendar', style: 'typewriter', pro: true },
  { image: '/gallery-clock-digital.png', title: 'Digital Clock', category: 'clock', type: 'clock', style: 'classic' },
  { image: '/gallery-clock-flower.png', title: 'Flower Clock', category: 'clock', type: 'clock', style: 'flower', pro: true },
  { image: '/gallery-clock-flip.png', title: 'Flip Clock', category: 'clock', type: 'clock', style: 'classic' },
  { image: '/gallery-camera.png', title: 'Camera', category: 'boards', type: 'board', style: 'grid' },
];

export const WidgetStudioPage: React.FC = () => {
  const navigate = useNavigate();
  const sceneRef = useRef<HTMLDivElement>(null);
  const [expanding, setExpanding] = useState(false);
  const [activeFilter, setActiveFilter] = useState<WidgetCategory>('all');
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState('');
  const [galleryScrolled, setGalleryScrolled] = useState(false);
  const galleryScrollRef = useRef<HTMLDivElement>(null);
  const { loginWithCode, login, loginWithGoogle, isLoggedIn } = useAuth();
  const { open: openUpgrade } = useUpgradeModal();
  const quota = useWidgetQuota();
  const [nameModal, setNameModal] = useState<{ title: string; category: string; type: string; style: string } | null>(null);
  const [widgetName, setWidgetName] = useState('');

  const handleLaunch = useCallback(() => {
    setExpanding(true);
    setTimeout(() => navigate('/studio'), 450);
  }, [navigate]);

  // If already logged in, show "Go to Studio" instead of auto-redirect

  const handleCodeEntry = useCallback(() => {
    setCodeError('');
    const trimmed = codeInput.trim();
    if (!trimmed) {
      setCodeError('Please enter your email to continue.');
      return;
    }
    // Secret beta access code still works for internal testing.
    if (trimmed.toUpperCase() === 'PEACHY2026' && loginWithCode(trimmed)) {
      handleLaunch();
      return;
    }
    // Otherwise treat input as an email and send the user to signup with it prefilled.
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (isEmail) {
      navigate('/login', { state: { email: trimmed, signup: true } });
      return;
    }
    setCodeError("That doesn't look like an email address. Please check and try again.");
  }, [codeInput, loginWithCode, handleLaunch, navigate]);

  // Logged-in view — clean gallery matching /templates layout
  if (isLoggedIn) {
    return (
      <PageWrapper>
        <TopNav activeLink="studio" logoSub="Widgets" />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 48px 0' }}>
          <BackButton onClick={() => navigate(-1 as any)} label="Back" />
          <h1 style={{ fontSize: 32, fontWeight: 600, color: '#1F1F1F', letterSpacing: '-0.03em', margin: '0 0 10px' }}>Notion Widgets</h1>
          <p style={{ fontSize: 14, color: '#999', margin: '0 0 36px', letterSpacing: '-0.01em' }}>Browse styles, customize and embed in your Notion workspace</p>
          <FilterRow>
            {GALLERY_FILTERS.map(f => (
              <FilterChip key={f.key} $active={activeFilter === f.key} onClick={() => setActiveFilter(f.key)}>
                {f.label}
              </FilterChip>
            ))}
          </FilterRow>
        </div>
        <WidgetGalleryGrid>
          {(activeFilter === 'all' ? GALLERY_ITEMS.slice(0, 6) : GALLERY_ITEMS.filter(item => item.category === activeFilter)).map((item, i) => (
            <WidgetGalleryCardWrap key={`${activeFilter}-${i}`} $i={i}>
              <div style={{ aspectRatio: '4/3', overflow: 'hidden', position: 'relative', background: '#FAFAF9' }}>
                <OverlayBadge $tone="accent">{item.category === 'calendar' ? 'Calendar' : item.category === 'clock' ? 'Clock' : 'Board'}</OverlayBadge>
                {item.pro && <GalleryProBadgeSlot><ProPill><Star fill="currentColor" strokeWidth={0} /><span>Pro</span></ProPill></GalleryProBadgeSlot>}
                <GalleryImage src={item.image} alt={item.title} />
              </div>
              <WidgetGalleryMeta>
                <WidgetGalleryCardTitle>{item.title}</WidgetGalleryCardTitle>
                {(item.pro && !quota.isPro) || quota.atLimit ? (
                  <SharedButton $variant="upgrade" $size="sm" onClick={openUpgrade}><Sparkle /> Upgrade</SharedButton>
                ) : (
                  <SharedButton $variant="primary" $size="sm" onClick={() => { setNameModal({ title: item.title, category: item.category, type: item.type, style: item.style }); setWidgetName(item.title); }}><Pencil /> Customize</SharedButton>
                )}
              </WidgetGalleryMeta>
            </WidgetGalleryCardWrap>
          ))}
        </WidgetGalleryGrid>
        <BigFooter onNavigate={(path) => navigate(path)} />

        {/* Name Modal — uses shared <Modal> so it matches the Delete confirmation dialog. */}
        <Modal
          open={!!nameModal}
          onClose={() => setNameModal(null)}
          title="Name your widget"
          subtitle={nameModal ? `New ${nameModal.category === 'calendar' ? 'Calendar' : nameModal.category === 'clock' ? 'Clock' : 'Board'}` : undefined}
          size="sm"
        >
          <NameModalInput
            autoFocus
            value={widgetName}
            onChange={e => setWidgetName(e.target.value)}
            placeholder="My awesome widget..."
            onKeyDown={e => {
              if (e.key === 'Enter' && widgetName.trim() && nameModal) {
                const data = { name: widgetName, type: nameModal.type, style: nameModal.style };
                setNameModal(null);
                navigate('/studio', { state: { newWidget: data } });
              }
            }}
          />
          <ModalFooter style={{ marginLeft: -24, marginRight: -24, marginBottom: -20, marginTop: 16 }}>
            <SharedButton type="button" $variant="secondary" $size="lg" onClick={() => setNameModal(null)}>
              Cancel
            </SharedButton>
            <SharedButton
              type="button"
              $variant="primary"
              $size="lg"
              onClick={() => {
                if (widgetName.trim() && nameModal) {
                  const data = { name: widgetName, type: nameModal.type, style: nameModal.style };
                  setNameModal(null);
                  navigate('/studio', { state: { newWidget: data } });
                }
              }}
            >
              Create &amp; Edit
            </SharedButton>
          </ModalFooter>
        </Modal>

        {/* Upgrade Modal */}
      </PageWrapper>
    );
  }

  // Non-logged-in view — full landing
  return (
    <PageWrapper>
      <TopNav activeLink="studio" />

      {/* Hero with floating widgets — фон #FAFAFA как на /?hero=v2 */}
      <Hero>
      <HeroScene>
        {/* Floating widget PNGs with transparent bg */}
        <FloatingWidget $left="-104px" $top="64px" $delay="0s" $anim={1} data-float data-speed="1.2" style={{ width: 256 }}>
          <img src="/float-typewriter.png" alt="Typewriter Calendar" />
        </FloatingWidget>
        <FloatingWidget $right="-94px" $top="74px" $delay="-3.4s" $anim={2} data-float data-speed="0.8" style={{ width: 296 }}>
          <img src="/float-collage.png" alt="Collage Calendar" />
        </FloatingWidget>
        <FloatingWidget $left="-44px" $top="380px" $delay="-5.8s" $anim={3} data-float data-speed="1.5" style={{ width: 307 }}>
          <img src="/float-clock.png" alt="Flower Clock" />
        </FloatingWidget>
        <FloatingWidget $right="-46px" $top="396px" $delay="-2.1s" $anim={4} data-float data-speed="1" style={{ width: 279 }}>
          <img src="/float-camera.png" alt="Camera Widget" />
        </FloatingWidget>

        <HeroCard>
            <HeroTitle>The <em>widgets</em> your<br />Notion is missing</HeroTitle>
            <HeroDesc>Pick a widget you love. Tweak it until it feels like yours. Paste the link into Notion. That's it.</HeroDesc>
            {isLoggedIn ? (
              <EmailRow>
                <SharedButton $variant="primary" $size="xl" $fullWidth onClick={handleLaunch}>
                  Open Studio <ArrowRight />
                </SharedButton>
              </EmailRow>
            ) : (
              <>
                <EmailRow>
                  <EmailInput
                    type="email"
                    placeholder="Enter your email"
                    value={codeInput}
                    onChange={e => { setCodeInput(e.target.value); setCodeError(''); }}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleCodeEntry(); } }}
                  />
                  <SharedButton $variant="primary" $size="xl" $fullWidth onClick={(e) => { e.stopPropagation(); handleCodeEntry(); }}>
                    Try for free <ArrowRight />
                  </SharedButton>
                </EmailRow>
                {codeError && <CodeError>{codeError}</CodeError>}
                <AuthDivider>or</AuthDivider>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <SharedButton type="button" $variant="primary" $size="md" onClick={() => navigate('/login')}>
                    Already have an account? Log in
                  </SharedButton>
                  <SharedButton $variant="secondary" $size="md" onClick={() => loginWithGoogle()}>
                    <GoogleIcon />
                    Continue with Google
                  </SharedButton>
                </div>
              </>
            )}
        </HeroCard>
      </HeroScene>
      </Hero>

      <PageContent $hide={expanding}>

      {/* Widget Gallery — horizontal scroll like Top Templates */}
      <Section $size="gap" style={{ paddingTop: 80 }}>
      <WidgetGallerySection>
        <WidgetGalleryHeader>
          <WidgetGalleryTitleRow>
            <WidgetGalleryTitle>
              {activeFilter === 'all' ? 'Explore widgets' : GALLERY_FILTERS.find(f => f.key === activeFilter)?.label || 'Widgets'}
            </WidgetGalleryTitle>
          </WidgetGalleryTitleRow>
          <WidgetGalleryFilterRow>
            {GALLERY_FILTERS.map(f => (
              <FilterChip key={f.key} $active={activeFilter === f.key} onClick={() => setActiveFilter(f.key)}>
                {f.label}
              </FilterChip>
            ))}
            <SharedButton $variant="primary" $size="md" onClick={isLoggedIn ? handleLaunch : () => navigate('/login')} style={{ marginLeft: 'auto' }}>
              {isLoggedIn ? 'Open Studio' : 'Try for free'} <ArrowRight />
            </SharedButton>
          </WidgetGalleryFilterRow>
        </WidgetGalleryHeader>
        <WidgetGalleryGrid>
          {(activeFilter === 'all' ? GALLERY_ITEMS.slice(0, 6) : GALLERY_ITEMS.filter(item => item.category === activeFilter)).map((item, i) => (
            <WidgetGalleryCardWrap key={`${activeFilter}-${i}`} $i={i}>
              <div style={{ aspectRatio: '4/3', overflow: 'hidden', position: 'relative', background: '#FAFAF9' }}>
                <OverlayBadge $tone="accent">{item.category === 'calendar' ? 'Calendar' : item.category === 'clock' ? 'Clock' : 'Board'}</OverlayBadge>
                {item.pro && <GalleryProBadgeSlot><ProPill><Star fill="currentColor" strokeWidth={0} /><span>Pro</span></ProPill></GalleryProBadgeSlot>}
                <GalleryImage src={item.image} alt={item.title} />
              </div>
              <WidgetGalleryMeta>
                <WidgetGalleryCardTitle>{item.title}</WidgetGalleryCardTitle>
                {/* Not-logged-in users see Customize on pro widgets too — the
                     upgrade wall only appears once they have an account. The
                     PRO badge sets the expectation without blocking try-outs. */}
                <SharedButton $variant="primary" $size="sm" onClick={() => { setNameModal({ title: item.title, category: item.category, type: item.type, style: item.style }); setWidgetName(item.title); }}><Pencil /> Customize</SharedButton>
              </WidgetGalleryMeta>
            </WidgetGalleryCardWrap>
          ))}
        </WidgetGalleryGrid>
      </WidgetGallerySection>
      </Section>

      {/* Show How it works, Pricing, CTA only for non-logged-in users */}
      {!isLoggedIn && (
        <>
          <Section $size="gap">
            <HowItWorksSection showTitle={true} variant="widgets" />
          </Section>

          <Section $size="gap" style={{ paddingTop: 80, paddingBottom: 160 }}>
          <PricingSection>
            <PricingTitle>Simple pricing</PricingTitle>
            <PricingSubtitle>Start free. Upgrade when you need more.</PricingSubtitle>
            <PricingGrid>
              <PricingCard>
                <PricingPlan>Free</PricingPlan>
                <PricingPrice>$0</PricingPrice>
                <PricingPeriod>forever</PricingPeriod>
                <PricingFeatures>
                  <li>3 widgets</li>
                  <li>Basic widget types</li>
                  <li>Limited customization</li>
                  <li>Embed in Notion</li>
                </PricingFeatures>
                <SharedButton $variant="outline" $size="lg" $fullWidth onClick={handleLaunch}>Get started</SharedButton>
              </PricingCard>
              <PricingCard $highlighted>
                <PopularPill>Popular</PopularPill>
                <PricingPlan>Pro</PricingPlan>
                <PricingPrice>$4</PricingPrice>
                <PricingPeriod>monthly</PricingPeriod>
                <PricingFeatures>
                  <li>Unlimited widgets</li>
                  <li>All widget types</li>
                  <li>Full customization</li>
                  <li>Exclusive widget styles</li>
                </PricingFeatures>
                <SharedButton $variant="primary" $size="lg" $fullWidth onClick={handleLaunch}>Get Pro</SharedButton>
              </PricingCard>
            </PricingGrid>
          </PricingSection>
          </Section>

          <BottomCTA>
            <CTATitle>Ready to build?</CTATitle>
            <CTADesc>Sign up and start creating widgets for your Notion.</CTADesc>
            <EmailRow>
              <EmailInput
                type="email"
                placeholder="Enter your email"
              />
              <SharedButton $variant="primary" $size="xl" $fullWidth onClick={() => navigate('/login')}>
                Get started <ArrowRight />
              </SharedButton>
            </EmailRow>
          </BottomCTA>
        </>
      )}

      <Section $size="gap" $bleedTop $bleedBottom style={{ background: '#FAFAFA' }}>
        <FooterFlush>
          <BigFooter onNavigate={(path) => navigate(path)} />
        </FooterFlush>
      </Section>
      </PageContent>
    </PageWrapper>
  );
};
