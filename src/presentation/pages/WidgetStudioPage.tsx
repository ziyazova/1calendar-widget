import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { ArrowRight, Calendar, Clock, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';
import { PageWrapper, FilterRow, FilterChip, SectionHeader, BackButton } from '@/presentation/components/shared';
import { fadeUp } from '@/presentation/themes/animations';

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
  color: #1F1F1F;
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
  gap: 6px;
  width: 100%;
  height: 44px;
  padding: 0 20px;
  background: #1F1F1F;
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
  gap: 10px;
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
  color: #1F1F1F;
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
  color: #1F1F1F;
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

  const handleLaunch = useCallback(() => {
    setExpanding(true);
    setTimeout(() => navigate('/studio'), 450);
  }, [navigate]);

  return (
    <PageWrapper>
      <TopNav activeLink="studio" />

      <HeroCard>
        <BackButton onClick={() => navigate('/')} />
        <HeroInner $expanding={expanding}>
          <HeroIcons>
            <HeroIcon $delay="0.15s"><Calendar /></HeroIcon>
            <HeroIcon $delay="0.25s"><Clock /></HeroIcon>
            <HeroIcon $delay="0.35s"><Image /></HeroIcon>
          </HeroIcons>
          <HeroTitle>Pick a widget, customize it,<br />embed in Notion with one click.</HeroTitle>
          <HeroDesc>No coding. No setup. No headaches.</HeroDesc>
          <EmailRow>
            <EmailInput type="email" placeholder="Enter your email" />
            <HeroButton onClick={(e) => { e.stopPropagation(); handleLaunch(); }}>
              Sign up <ArrowRight />
            </HeroButton>
          </EmailRow>
          <AuthDivider>Or, sign up with</AuthDivider>
          <GoogleButton>
            <svg viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google
          </GoogleButton>
        </HeroInner>
      </HeroCard>

      <PageContent $hide={expanding}>
      <GallerySection>
        <SectionHeader title="Explore widgets" subtitle="Get inspired and find your perfect setup" />
        <GalleryFilterRow>
          {GALLERY_FILTERS.map(f => (
            <FilterChip key={f.key} $active={activeFilter === f.key} onClick={() => setActiveFilter(f.key)}>
              {f.label}
            </FilterChip>
          ))}
        </GalleryFilterRow>
        <GalleryGrid>
          {GALLERY_ITEMS
            .filter(item => activeFilter === 'all' || item.category === activeFilter)
            .map((item, i) => (
              <GalleryCard key={i}>
                <GalleryImage src={item.image} alt={item.title} />
                <GalleryLabel>{item.title}</GalleryLabel>
              </GalleryCard>
            ))}
        </GalleryGrid>
      </GallerySection>
      </PageContent>
    </PageWrapper>
  );
};
