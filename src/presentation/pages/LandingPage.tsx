import React, { useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { ArrowRight, Calendar, Clock, Image, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { CTASection } from '../components/landing/CTASection';
import { PinterestGallery } from '../components/landing/PinterestGallery';
import { FeatureCardsSection } from '../components/landing/FeatureCardsSection';
import { CategoriesMarquee } from '../components/landing/CategoriesMarquee';
import { HeroSection } from '../components/landing/HeroSection';
import { TemplatesGallery } from '../components/landing/TemplatesGallery';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div<{ $transitioning?: boolean }>`
  background: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow-x: hidden;
`;

const PageContent = styled.div<{ $transitioning?: boolean }>`
  opacity: ${({ $transitioning }) => $transitioning ? 0 : 1};
  transition: opacity 0.4s ease;
`;

/* Nav is now TopNav component */

/* ── Widgets Section ── */
const WidgetsSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px 60px;

  @media (max-width: 768px) {
    padding: 0 24px 60px;
  }
`;

const WidgetGrid = styled.div`
  display: flex;
  gap: 20px;
`;

const WidgetCardWrap = styled.div`
  cursor: pointer;
  flex: 1;
`;

const WidgetCardBox = styled.div`
  width: 100%;
  height: 207px;
  position: relative;
  border-radius: ${({ theme }) => theme.radii['2xl']};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);

  ${WidgetCardWrap}:hover & img {
    transform: scale(1.15);
  }
`;

const WidgetCardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  position: absolute;
  top: 0;
  left: 0;
  transform: scale(1.05);
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
`;

const WIDGET_DATA = [
  { image: '/widget-calendar.png', title: 'Calendar' },
  { image: '/widget-clock2.png', title: 'Clock' },
  { image: '/widget-calendar2.png', title: 'Classic Calendar' },
];

/* ── Big Footer ── */
const BigFooter = styled.footer`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 48px 40px;
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};

  @media (max-width: 768px) {
    padding: 48px 24px 32px;
  }
`;

const FooterInner = styled.div`
  display: flex;
  gap: 64px;
  margin-bottom: 48px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 32px;
  }
`;

const FooterBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

const FooterBrandName = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #1F1F1F;
  letter-spacing: -0.02em;
`;

const FooterColumns = styled.div`
  display: flex;
  gap: 48px;
  flex: 1;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 32px 24px;
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 120px;

  @media (max-width: 768px) {
    min-width: 40%;
  }
`;

const FooterColumnTitle = styled.h4`
  font-size: 13px;
  font-weight: 600;
  color: #1F1F1F;
  margin: 0 0 4px;
  letter-spacing: -0.01em;
`;

const FooterLink = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  cursor: pointer;
  transition: color 0.15s ease;
  letter-spacing: -0.01em;

  &:hover { color: #1F1F1F; }
`;

const FooterBottom = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
  padding-top: 32px;
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  letter-spacing: -0.01em;
`;

/* ── Bestsellers ── */
const Bestsellers = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px 80px;

  @media (max-width: 768px) {
    padding: 0 24px 60px;
  }
`;

const BestsellersHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }

  @media (max-width: 380px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const BestsellersHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const BestsellersTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1F1F1F;
  letter-spacing: -0.03em;
  margin: 0;
`;

const BestsellersSubtitle = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0;
`;

const BrowseAllButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 18px;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  background: #1F1F1F;
  border: none;
  border-radius: ${({ theme }) => theme.radii.button};
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;

  &:hover {
    background: #333;
  }

  svg { width: 14px; height: 14px; }
  white-space: nowrap;

  @media (max-width: 768px) {
    height: 36px;
    padding: 0 14px;
    font-size: 12px;
    svg { width: 12px; height: 12px; }
  }
`;

const BestsellerGrid = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 4px;

  &::-webkit-scrollbar { display: none; }
  scrollbar-width: none;
`;

const BestsellerCard = styled.div`
  cursor: pointer;
  width: calc((100% - 60px) / 4);
  min-width: 220px;
  flex-shrink: 0;
  scroll-snap-align: start;
`;

const BestsellerImageWrap = styled.div`
  height: 280px;
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);

  ${BestsellerCard}:hover & {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
    transform: scale(1.02);
  }
`;

const BestsellerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 15%;
  display: block;
  transform: scale(1.15);
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);

  ${BestsellerCard}:hover & {
    transform: scale(1.18);
  }
`;

const BestsellerMeta = styled.div`
  padding: 12px 4px 0;
`;

const BestsellerTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1F1F1F;
  letter-spacing: -0.01em;
  margin-bottom: 4px;
`;

const BestsellerInfo = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const TemplateCardTag = styled.span<{ $bg?: string; $color?: string }>`
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 5px;
  background: ${({ $bg }) => $bg || 'rgba(0, 0, 0, 0.05)'};
  color: ${({ $color, theme }) => $color || theme.colors.text.tertiary};
`;

const BestsellerTag = TemplateCardTag;

const BESTSELLER_DATA = [
  { image: '/template-main.png', title: 'Life OS Template', price: '$7.99', tags: ['Premium', 'Popular'] },
  { image: '/template-assignments.png', title: 'Weekly Planner', price: 'Free', tags: ['Productivity'] },
  { image: '/template-main.png', title: 'Student Planner', price: '$3.99', tags: ['Education'] },
  { image: '/template-assignments.png', title: 'Budget Tracker', price: 'Free', tags: ['Finance'] },
];

/* ── Widget Studio Block ── */
const StudioBlock = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px 80px;

  @media (max-width: 768px) {
    padding: 0 24px 60px;
  }
`;

const StudioCard = styled.div`
  border-radius: ${({ theme }) => theme.radii['3xl']};
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
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.04);
    border-color: rgba(51, 132, 244, 0.08);
  }

  @media (max-width: 768px) {
    padding: 40px 24px;
    border-radius: ${({ theme }) => theme.radii.xl};
  }
`;

const StudioIcons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 28px;
`;

const StudioIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  svg { width: 22px; height: 22px; color: ${({ theme }) => theme.colors.text.secondary}; }
`;

const StudioTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: #1F1F1F;
  letter-spacing: -0.03em;
  margin: 0 0 10px;
`;

const StudioDesc = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  line-height: 1.6;
  margin: 0 auto 28px;
  letter-spacing: -0.01em;
  max-width: 380px;
`;

/* ── (old Showcase kept for compat) ── */
const _Showcase = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px 120px;
  animation: ${fadeUp} 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;

  @media (max-width: 768px) {
    padding: 0 24px 80px;
  }
`;

const ShowcaseCard = styled.div`
  background: ${({ theme }) => theme.colors.background.surface};
  border-radius: ${({ theme }) => theme.radii['3xl']};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  padding: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 32px;
    min-height: 280px;
  }
`;

const ShowcasePlaceholder = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  opacity: 0.4;

  svg { width: 48px; height: 48px; color: ${({ theme }) => theme.colors.text.tertiary}; }
`;

/* ── Products ── */
const Products = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px 120px;

  @media (max-width: 768px) {
    padding: 0 24px 80px;
  }
`;

const SectionLabel = styled.h2`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: -0.01em;
  margin: 0 0 32px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled.div`
  background: ${({ theme }) => theme.colors.background.surface};
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  padding: 32px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06);
    border-color: rgba(51, 132, 244, 0.12);
  }
`;

const ProductIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: rgba(51, 132, 244, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  svg { width: 20px; height: 20px; color: #3384F4; }
`;

const ProductTitle = styled.h3`
  font-size: 17px;
  font-weight: 600;
  color: #1F1F1F;
  margin: 0 0 8px;
  letter-spacing: -0.02em;
`;

const ProductDesc = styled.p`
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.tertiary};
  line-height: 1.6;
  margin: 0 0 20px;
  letter-spacing: -0.01em;
`;

const ProductLink = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #3384F4;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  letter-spacing: -0.01em;

  svg { width: 14px; height: 14px; }
`;

/* ── Features ── */
const Features = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 48px;
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};

  @media (max-width: 768px) {
    padding: 60px 24px;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
`;

const FeatureItem = styled.div``;

const FeatureLabel = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #1F1F1F;
  margin: 0 0 6px;
  letter-spacing: -0.02em;
`;

const FeatureDesc = styled.p`
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.tertiary};
  line-height: 1.5;
  margin: 0;
  letter-spacing: -0.01em;
`;




/* ── Footer ── */
const Footer = styled.footer`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 48px;
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 24px;
    flex-direction: column;
    gap: 12px;
  }
`;

const FooterText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.muted};
  letter-spacing: -0.01em;
`;


export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [transitioning, setTransitioning] = useState(false);

  return (
    <Page>
      <TopNav logoPressed={transitioning} onLogoClick={() => navigate('/')} logoSub="Planners" />
      <PageContent $transitioning={transitioning}>

      <HeroSection onBrowseTemplates={() => navigate('/templates')} onExploreWidgets={() => navigate('/widgets')} />

      {/* ── Categories Marquee ── */}
      <CategoriesMarquee onNavigate={(path) => navigate(path)} />

      {/* ── Templates Gallery ── */}
      <TemplatesGallery onNavigate={(path) => navigate(path)} />

      {/* ── Widgets ── */}
      <WidgetsSection data-ux="Widgets Section">
        <BestsellersHeader>
          <BestsellersHeaderLeft>
            <BestsellersTitle data-ux="Section Title">Widget Studio</BestsellersTitle>
            <BestsellersSubtitle>Set up your widget in seconds</BestsellersSubtitle>
          </BestsellersHeaderLeft>
          <BrowseAllButton onClick={() => navigate('/widgets')}>To studio <ArrowRight /></BrowseAllButton>
        </BestsellersHeader>
        <PinterestGallery />
      </WidgetsSection>

      <FeatureCardsSection />

      {/* ── Testimonials ── */}
      <TestimonialsSection />

      <CTASection onBrowseTemplates={() => navigate('/templates')} onExploreWidgets={() => navigate('/widgets')} />

      <BigFooter>
        <FooterInner>
          <FooterBrand>
            <img src="/PeachyLogo.png" alt="Peachy" width="28" height="28" style={{ objectFit: 'contain' }} />
            <FooterBrandName>Peachy</FooterBrandName>
          </FooterBrand>
          <FooterColumns>
            <FooterColumn>
              <FooterColumnTitle>Resources</FooterColumnTitle>
              <FooterLink onClick={() => navigate('/templates')}>Notion Templates</FooterLink>
              <FooterLink onClick={() => navigate('/widgets')}>Widget Studio</FooterLink>
            </FooterColumn>
            <FooterColumn>
              <FooterColumnTitle>Social</FooterColumnTitle>
              <FooterLink>X (Twitter)</FooterLink>
            </FooterColumn>
            <FooterColumn>
              <FooterColumnTitle>Legal</FooterColumnTitle>
              <FooterLink>Privacy Policy</FooterLink>
              <FooterLink>Terms & Conditions</FooterLink>
            </FooterColumn>
            <FooterColumn>
              <FooterColumnTitle>Widgets</FooterColumnTitle>
              <FooterLink onClick={() => navigate('/widgets')}>Calendar Widgets</FooterLink>
              <FooterLink onClick={() => navigate('/widgets')}>Clock Widgets</FooterLink>
              <FooterLink onClick={() => navigate('/widgets')}>Canvas Widgets</FooterLink>
            </FooterColumn>
          </FooterColumns>
        </FooterInner>
        <FooterBottom>
          © {new Date().getFullYear()} Peachy Studio. All rights reserved.
        </FooterBottom>
      </BigFooter>
      </PageContent>
    </Page>
  );
};
