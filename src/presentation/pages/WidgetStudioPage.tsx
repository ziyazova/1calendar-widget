import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { ArrowRight, Calendar, Clock, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';
import { PageWrapper, FilterRow, FilterChip, SectionHeader, BackButton } from '@/presentation/components/shared';
import { fadeUp } from '@/presentation/themes/animations';
import { BigFooter } from '@/presentation/components/landing/BigFooter';
import { FeatureCardsSection } from '@/presentation/components/landing/FeatureCardsSection';
import { PinterestGallery } from '@/presentation/components/landing/PinterestGallery';
import { HowItWorksSection } from '@/presentation/components/landing/HowItWorksSection';
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
  padding: 40px 48px 56px;
  animation: ${fadeUp} 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;

  @media (max-width: 1024px) { padding: 32px 36px 48px; }
  @media (max-width: 768px) { padding: 24px 24px 40px; }
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

const HeroTitle = styled.h2`
  font-size: 36px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  margin: 0 0 8px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const HeroDesc = styled.p`
  font-size: 16px;
  color: #555;
  line-height: 1.6;
  margin: 0 auto 24px;
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 24px;
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

/* ── Widget Gallery ── */
const GallerySection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 48px 80px;

  @media (max-width: 768px) {
    padding: 32px 24px 48px;
  }
`;

const GalleryFilterRow = styled(FilterRow)`
  margin-bottom: 24px;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const GalleryCard = styled.div`
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(150deg, rgba(237, 228, 255, 0.7) 0%, rgba(232, 237, 255, 0.65) 25%, rgba(238, 234, 255, 0.6) 50%, rgba(245, 235, 250, 0.65) 75%, rgba(255, 240, 245, 0.7) 100%);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border: 1.5px solid rgba(200, 195, 230, 0.3);

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
  transition: opacity 0.3s ease;
`;

const GalleryLabel = styled.span`
  position: absolute;
  bottom: 12px;
  left: 12px;
  font-size: 11px;
  font-weight: 500;
  color: #fff;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(8px);
  padding: 4px 10px;
  border-radius: 6px;
  letter-spacing: -0.01em;
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
  background: ${({ $highlighted }) => $highlighted ? '#1F1F1F' : '#fff'};
  color: ${({ $highlighted }) => $highlighted ? '#fff' : 'inherit'};
  border: 1px solid ${({ $highlighted, theme }) => $highlighted ? 'transparent' : theme.colors.border.light};
  border-radius: 20px;
  padding: 32px 28px;
  text-align: left;
  position: relative;
`;

const PricingBadge = styled.span`
  position: absolute;
  top: 16px;
  right: 16px;
  background: #1F1F1F;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
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
  background: ${({ $primary }) => $primary ? '#fff' : 'transparent'};
  color: ${({ $primary }) => $primary ? '#1F1F1F' : 'inherit'};

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

const GALLERY_ITEMS: { image: string; title: string; category: WidgetCategory }[] = [
  { image: '/widget-calendar.png', title: 'Calendar', category: 'calendar' },
  { image: '/widget-clock2.png', title: 'Analog Clock', category: 'clock' },
  { image: '/widget-calendar2.png', title: 'Classic Calendar', category: 'calendar' },
  { image: '/widget-clock.png', title: 'Digital Clock', category: 'clock' },
  { image: '/template-dashboard.png', title: 'Dashboard', category: 'boards' },
  { image: '/widget-typewriter.png', title: 'Typewriter', category: 'buttons' },
];

export const WidgetStudioPage: React.FC = () => {
  const navigate = useNavigate();
  const [expanding, setExpanding] = useState(false);
  const [activeFilter, setActiveFilter] = useState<WidgetCategory>('all');
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState('');
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

      {/* Hero */}
      <HeroCard>
        <BackButton onClick={() => navigate(-1)} label="Back" />
        <HeroInner $expanding={expanding}>
          <HeroTitle>The widgets<br />your Notion is missing.</HeroTitle>
          <HeroDesc>Pick. Customize. Paste. Done.</HeroDesc>
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
        </HeroInner>
      </HeroCard>

      <PageContent $hide={expanding}>

      {/* Gallery with filters */}
      <GallerySection>
        <SectionHeader title="Explore widgets" marginBottom="24px" />
        <GalleryFilterRow>
          {GALLERY_FILTERS.map(f => (
            <FilterChip key={f.key} $active={activeFilter === f.key} onClick={() => setActiveFilter(f.key)}>
              {f.label}
            </FilterChip>
          ))}
        </GalleryFilterRow>
        {activeFilter === 'all' ? (
          <PinterestGallery filter="Calendar" />
        ) : (
          <GalleryGrid>
            {GALLERY_ITEMS
              .filter(item => item.category === activeFilter)
              .map((item, i) => (
                <GalleryCard key={i}>
                  <GalleryImage src={item.image} alt={item.title} />
                  <GalleryLabel>{item.title}</GalleryLabel>
                </GalleryCard>
              ))}
          </GalleryGrid>
        )}
      </GallerySection>

      {/* How it works */}
      <HowItWorksSection showTitle={false} />

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
              <li>All widget types</li>
              <li>Customization</li>
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
              <li>New widgets first</li>
              <li>Early access to new widgets</li>
            </PricingFeatures>
            <PricingBtn $primary onClick={handleLaunch}>Get Pro</PricingBtn>
          </PricingCard>
        </PricingGrid>
      </PricingSection>

      {/* Bottom CTA */}
      <BottomCTA>
        <CTATitle>Ready to build?</CTATitle>
        <CTADesc>Enter your code and start creating.</CTADesc>
        <EmailRow>
          <EmailInput
            type="text"
            placeholder="Access code"
            value={codeInput}
            onChange={e => { setCodeInput(e.target.value); setCodeError(''); }}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleCodeEntry(); } }}
          />
          <HeroButton onClick={(e) => { e.stopPropagation(); handleCodeEntry(); }}>
            Start building <ArrowRight />
          </HeroButton>
        </EmailRow>
      </BottomCTA>

      <BigFooter onNavigate={(path) => navigate(path)} />
      </PageContent>
    </PageWrapper>
  );
};
