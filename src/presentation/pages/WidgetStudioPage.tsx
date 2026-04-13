import React, { useState, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { ArrowRight, Calendar, Clock, Image, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';
import { PageWrapper, FilterRow, FilterChip, SectionHeader, BackButton } from '@/presentation/components/shared';
import { fadeUp } from '@/presentation/themes/animations';
import { BigFooter } from '@/presentation/components/landing/BigFooter';
import { HowItWorksSection } from '@/presentation/components/landing/HowItWorksSection';
import { PinterestGallery } from '@/presentation/components/landing/PinterestGallery';
import { useAuth } from '@/presentation/context/AuthContext';

const PageContent = styled.div<{ $hide?: boolean }>`
  opacity: ${({ $hide }) => $hide ? 0 : 1};
  transition: opacity 0.3s ease;
  pointer-events: ${({ $hide }) => $hide ? 'none' : 'auto'};
`;

/* ── Hero Card ── */
const HeroCard = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 48px;
  text-align: center;
  position: relative;
  z-index: 3;
  animation: ${fadeUp} 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;

  @media (max-width: 1024px) { padding: 60px 36px; }
  @media (max-width: 768px) { padding: 48px 24px; }
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
  border-radius: 14px;

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
  font-size: 56px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.035em;
  margin: 0 0 12px;
  line-height: 1.1;

  @media (max-width: 1024px) {
    font-size: 44px;
  }

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const HeroDesc = styled.p`
  font-size: 18px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.tertiary};
  line-height: 1.6;
  margin: 0 auto 40px;
  max-width: 500px;
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 32px;
  }
`;

const HeroButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 44px;
  padding: 0 20px;
  background: ${({ theme }) => theme.colors.text.primary};
  color: #ffffff;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.01em;
  transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    background: #333;
  }

  svg { width: 14px; height: 14px; }
`;

const EmailRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
`;

const EmailInput = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 16px;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 14px;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text.primary};
  background: #fff;
  outline: none;
  letter-spacing: -0.01em;
  transition: border-color 0.2s;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }

  &:focus {
    border-color: rgba(0, 0, 0, 0.16);
  }
`;

const AuthDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 320px;
  margin: 16px auto 16px;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 11px;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border.light};
  }
`;

const CodeError = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.destructive};
  text-align: center;
  margin-top: -4px;
`;

const AuthLink = styled.span`
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.15s ease;

  &:hover { color: ${({ theme }) => theme.colors.text.primary}; }
`;

const GoogleButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0 auto;
  height: 44px;
  padding: 0 24px;
  background: #ffffff;
  border: 1.5px solid rgba(200, 195, 230, 0.3);
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.01em;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.background.surface};
    border-color: rgba(0, 0, 0, 0.12);
  }

  svg { width: 16px; height: 16px; }
`;

/* ── Floating Widgets ── */
const float1 = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
`;
const float2 = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-16px); }
`;
const float3 = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const HeroScene = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;
  padding-bottom: 40px;

  @media (max-width: 768px) {
    padding: 0 24px 24px;
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

  img {
    width: 100%;
    display: block;
    filter: drop-shadow(0 12px 32px rgba(0, 0, 0, 0.2)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  }

  animation: ${({ $anim }) => $anim === 1 ? float1 : $anim === 2 ? float2 : float3} ${({ $anim }) => $anim === 1 ? '6s' : $anim === 2 ? '7s' : '5.5s'} ease-in-out infinite both;
  animation-delay: ${({ $delay }) => $delay};
  will-change: transform;

  img {
    width: 100%;
    display: block;
  }

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
  padding: 80px 48px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 48px 24px 0;
  }
`;

const WidgetGalleryTitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const WidgetGalleryTitle = styled.h2`
  font-size: 36px;
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

const WidgetGalleryBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 18px;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  background: ${({ theme }) => theme.colors.text.primary};
  border: none;
  border-radius: ${({ theme }) => theme.radii.button};
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover { background: #333; }
  svg { width: 14px; height: 14px; }
`;

const WidgetGalleryGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 48px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    padding: 16px 24px;
    gap: 16px;
  }
`;

const WidgetGalleryCardWrap = styled.div``;

const WidgetGalleryMeta = styled.div`
  padding: 10px 2px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const WidgetGalleryCardTitle = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.01em;
`;

const CustomizeBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 14px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  background: #fff;
  border: 1.5px solid rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.text.primary};
    color: #fff;
    border-color: ${({ theme }) => theme.colors.text.primary};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  svg { width: 14px; height: 14px; }
`;

const GalleryCardLabel = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(8px);
  padding: 4px 10px;
  border-radius: 8px;
  letter-spacing: -0.01em;
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
  padding: 80px 48px;
  text-align: center;

  @media (max-width: 768px) { padding: 48px 24px; }
`;

const PricingTitle = styled.h2`
  font-size: 36px;
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

const PricingBadge = styled.span`
  position: absolute;
  top: 16px;
  right: 16px;
  background: ${({ theme }) => theme.colors.text.primary};
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 999px;
`;

const PricingPlan = styled.div`
  font-size: 14px;
  font-weight: 500;
  opacity: 0.6;
  margin-bottom: 4px;
`;

const PricingPrice = styled.div`
  font-size: 42px;
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

const PricingBtn = styled.button<{ $primary?: boolean }>`
  width: 100%;
  height: 44px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  border: ${({ $primary }) => $primary ? 'none' : '1px solid rgba(0,0,0,0.1)'};
  background: ${({ $primary }) => $primary ? '#1F1F1F' : 'transparent'};
  color: ${({ $primary }) => $primary ? '#fff' : 'inherit'};

  &:hover { opacity: 0.85; }
`;

/* ── Bottom CTA ── */
const BottomCTA = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 48px;
  text-align: center;

  @media (max-width: 768px) { padding: 48px 24px; }
`;

const CTATitle = styled.h2`
  font-size: 36px;
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
  { key: 'all', label: 'Featured' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'clock', label: 'Clocks' },
  { key: 'boards', label: 'Boards' },
  { key: 'buttons', label: 'Buttons' },
];

const FEATURED_ITEMS: { image: string; title: string }[] = [
  { image: '/gallery-calendar-typewriter.png', title: 'Typewriter Calendar' },
  { image: '/gallery-clock-flower.png', title: 'Flower Clock' },
  { image: '/gallery-camera.png', title: 'Camera Widget' },
];

const GALLERY_ITEMS: { image: string; title: string; category: WidgetCategory }[] = [
  { image: '/gallery-calendar-classic.png', title: 'Classic Calendar', category: 'calendar' },
  { image: '/gallery-calendar-collage.png', title: 'Collage Calendar', category: 'calendar' },
  { image: '/gallery-calendar-typewriter.png', title: 'Typewriter Calendar', category: 'calendar' },
  { image: '/gallery-clock-digital.png', title: 'Digital Clock', category: 'clock' },
  { image: '/gallery-clock-flower.png', title: 'Flower Clock', category: 'clock' },
  { image: '/gallery-clock-alarm.png', title: 'Alarm Clock', category: 'clock' },
  { image: '/gallery-clock-flip.png', title: 'Flip Clock', category: 'clock' },
  { image: '/gallery-camera.png', title: 'Camera', category: 'boards' },
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

  const handleLaunch = useCallback(() => {
    setExpanding(true);
    setTimeout(() => navigate('/studio'), 450);
  }, [navigate]);

  // If already logged in, show "Go to Studio" instead of auto-redirect

  const handleCodeEntry = useCallback(() => {
    setCodeError('');
    if (loginWithCode(codeInput)) {
      handleLaunch();
    } else {
      setCodeError('Invalid code. Check and try again.');
    }
  }, [codeInput, loginWithCode, handleLaunch]);

  return (
    <PageWrapper>
      <TopNav activeLink="studio" />

      {/* Hero with floating widgets */}
      <HeroScene>
        {/* Floating widget PNGs with transparent bg */}
        <FloatingWidget $left="-20px" $top="48px" $delay="0s" $anim={1} data-float data-speed="1.2" style={{ width: 195 }}>
          <img src="/float-typewriter.png" alt="Typewriter Calendar" />
        </FloatingWidget>
        <FloatingWidget $right="-10px" $top="40px" $delay="0.5s" $anim={2} data-float data-speed="0.8" style={{ width: 196 }}>
          <img src="/float-collage.png" alt="Collage Calendar" />
        </FloatingWidget>
        <FloatingWidget $left="60px" $top="280px" $delay="1s" $anim={3} data-float data-speed="1.5" style={{ width: 224 }}>
          <img src="/float-clock.png" alt="Flower Clock" />
        </FloatingWidget>
        <FloatingWidget $right="20px" $top="280px" $delay="0.3s" $anim={1} data-float data-speed="1" style={{ width: 208 }}>
          <img src="/float-camera.png" alt="Camera Widget" />
        </FloatingWidget>

        <HeroCard>
            <HeroTitle>The widgets<br />your Notion is missing.</HeroTitle>
            <HeroDesc>Pick. Customize. Paste. That's it.</HeroDesc>
            {isLoggedIn ? (
              <EmailRow>
                <HeroButton onClick={handleLaunch}>
                  Open Studio <ArrowRight />
                </HeroButton>
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
                  <HeroButton onClick={(e) => { e.stopPropagation(); handleCodeEntry(); }}>
                    Try for free <ArrowRight />
                  </HeroButton>
                </EmailRow>
                {codeError && <CodeError>{codeError}</CodeError>}
                <AuthDivider>or sign up with</AuthDivider>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                  <GoogleButton onClick={() => loginWithGoogle()}>
                    <svg viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Google
                  </GoogleButton>
                  <AuthLink onClick={() => navigate('/login')} style={{ fontSize: 13 }}>Already have an account? Log in</AuthLink>
                </div>
              </>
            )}
        </HeroCard>
      </HeroScene>

      <PageContent $hide={expanding}>

      {/* Widget Gallery — horizontal scroll like Top Templates */}
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
            <WidgetGalleryBtn onClick={isLoggedIn ? handleLaunch : () => navigate('/login')} style={{ marginLeft: 'auto' }}>
              {isLoggedIn ? 'Open Studio' : 'Try for free'} <ArrowRight />
            </WidgetGalleryBtn>
          </WidgetGalleryFilterRow>
        </WidgetGalleryHeader>
        <WidgetGalleryGrid>
          {(activeFilter === 'all' ? GALLERY_ITEMS : GALLERY_ITEMS.filter(item => item.category === activeFilter)).map((item, i) => (
            <WidgetGalleryCardWrap key={`wg-${i}`}>
              <GalleryCard>
                <GalleryCardLabel>{item.category === 'calendar' ? 'Calendar' : item.category === 'clock' ? 'Clock' : item.category === 'boards' ? 'Board' : 'Widget'}</GalleryCardLabel>
                <GalleryImage src={item.image} alt={item.title} />
              </GalleryCard>
              <WidgetGalleryMeta>
                <WidgetGalleryCardTitle>{item.title}</WidgetGalleryCardTitle>
                <CustomizeBtn onClick={handleLaunch}>
                  <Wand2 /> Customize
                </CustomizeBtn>
              </WidgetGalleryMeta>
            </WidgetGalleryCardWrap>
          ))}
        </WidgetGalleryGrid>
      </WidgetGallerySection>

      {/* Built different — hidden for now */}

      {/* How it works */}
      <HowItWorksSection showTitle={true} variant="widgets" />

      {/* Pricing */}
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
            <PricingBtn onClick={handleLaunch}>Get started</PricingBtn>
          </PricingCard>
          <PricingCard $highlighted>
            <PricingBadge>Popular</PricingBadge>
            <PricingPlan>Pro</PricingPlan>
            <PricingPrice>$9</PricingPrice>
            <PricingPeriod>one-time</PricingPeriod>
            <PricingFeatures>
              <li>Unlimited widgets</li>
              <li>All widget types</li>
              <li>Full customization</li>
              <li>Exclusive widget styles</li>
            </PricingFeatures>
            <PricingBtn $primary onClick={handleLaunch}>Get Pro</PricingBtn>
          </PricingCard>
        </PricingGrid>
      </PricingSection>

      {/* Bottom CTA */}
      <BottomCTA>
        <CTATitle>Ready to build?</CTATitle>
        <CTADesc>Sign up and start creating widgets for your Notion.</CTADesc>
        <EmailRow>
          <EmailInput
            type="email"
            placeholder="Enter your email"
          />
          <HeroButton onClick={() => navigate('/login')}>
            Get started <ArrowRight />
          </HeroButton>
        </EmailRow>
      </BottomCTA>

      <BigFooter onNavigate={(path) => navigate(path)} />
      </PageContent>
    </PageWrapper>
  );
};
