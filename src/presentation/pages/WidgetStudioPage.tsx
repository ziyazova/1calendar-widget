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
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(51, 132, 244, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 60% 80%, rgba(236, 72, 153, 0.05) 0%, transparent 50%),
    #F8F8F7;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  transform: ${({ $expanding }) => $expanding ? 'scale(0.97)' : 'scale(1)'};
  opacity: ${({ $expanding }) => $expanding ? 0 : 1};

  &:hover {
    transform: ${({ $expanding }) => $expanding ? 'scale(0.97)' : 'none'};
    border-color: rgba(51, 132, 244, 0.08);
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
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  margin: 0 0 10px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const HeroDesc = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  line-height: 1.6;
  margin: 0 auto 28px;
  letter-spacing: -0.01em;
  max-width: 380px;

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
  max-width: 380px;
  margin: 12px auto 0;
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
  max-width: 380px;
  margin: 10px auto 0;
  height: 40px;
  padding: 0 24px;
  background: #fff;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.button};
  font-size: 13px;
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
  padding: 0 48px 60px;

  @media (max-width: 768px) {
    padding: 0 24px 40px;
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
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.border.light};

  @media (max-width: 768px) {
    border-radius: ${({ theme }) => theme.radii.md};
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
  opacity: 0.88;
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
  padding: 56px 48px;

  @media (max-width: 768px) { padding: 40px 24px; }
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
  padding: 56px 48px;
  text-align: center;

  @media (max-width: 768px) { padding: 40px 24px; }
`;

const PricingTitle = styled.h2`
  font-size: 36px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  margin: 0 0 8px;
`;

const PricingSubtitle = styled.p`
  font-size: 15px;
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
  background: ${({ theme }) => theme.colors.accent};
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
  padding: 56px 48px;
  text-align: center;

  @media (max-width: 768px) { padding: 40px 24px; }
`;

const CTATitle = styled.h2`
  font-size: 36px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  margin: 0 0 8px;
`;

const CTADesc = styled.p`
  font-size: 15px;
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
  const { loginWithCode } = useAuth();

  const handleLaunch = useCallback(() => {
    setExpanding(true);
    setTimeout(() => navigate('/studio'), 450);
  }, [navigate]);

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
        <BackButton onClick={() => navigate('/')} />
        <HeroInner $expanding={expanding}>
          <HeroTitle>The widgets your Notion is missing.</HeroTitle>
          <HeroDesc>Calendars, clocks, boards — fully customizable, embeddable in one click.</HeroDesc>
          <EmailRow>
            <EmailInput
              type="text"
              placeholder="Enter access code"
              value={codeInput}
              onChange={e => { setCodeInput(e.target.value); setCodeError(''); }}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleCodeEntry(); } }}
            />
            <HeroButton onClick={(e) => { e.stopPropagation(); handleCodeEntry(); }}>
              Open Studio <ArrowRight />
            </HeroButton>
          </EmailRow>
          {codeError && <CodeError>{codeError}</CodeError>}
          <AuthDivider>No code yet? <AuthLink onClick={() => navigate('/templates')}>Get a template</AuthLink> · <AuthLink>Contact us</AuthLink></AuthDivider>
        </HeroInner>
      </HeroCard>

      <PageContent $hide={expanding}>

      {/* Gallery with filters */}
      <GallerySection>
        <SectionHeader title="Explore widgets" subtitle="Find your perfect setup" marginBottom="24px" />
        <GalleryFilterRow>
          {GALLERY_FILTERS.map(f => (
            <FilterChip key={f.key} $active={activeFilter === f.key} onClick={() => setActiveFilter(f.key)}>
              {f.label}
            </FilterChip>
          ))}
        </GalleryFilterRow>
        <PinterestGallery filter={activeFilter === 'all' ? 'Featured' : activeFilter === 'calendar' ? 'Calendar' : activeFilter === 'clock' ? 'Clocks' : activeFilter === 'boards' ? 'Boards' : 'Featured'} />
      </GallerySection>

      {/* Features */}
      <FeaturesSection>
        <FeatureRow>
          <FeatureItem>
            <FeatureIcon style={{ background: '#F0E6FF' }}>🎨</FeatureIcon>
            <FeatureTitle>Customizable</FeatureTitle>
            <FeatureDesc>Colors, borders, layouts — make it yours.</FeatureDesc>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon style={{ background: '#FFF8E0' }}>✨</FeatureIcon>
            <FeatureTitle>Only on Peachy</FeatureTitle>
            <FeatureDesc>Widgets you won't find anywhere else.</FeatureDesc>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon style={{ background: '#E0F4E8' }}>🌗</FeatureIcon>
            <FeatureTitle>Built for both themes</FeatureTitle>
            <FeatureDesc>Auto-adapts to Notion light and dark mode.</FeatureDesc>
          </FeatureItem>
        </FeatureRow>
      </FeaturesSection>

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
              <li>Basic customization</li>
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
              <li>Priority support</li>
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
