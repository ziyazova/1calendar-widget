import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ChevronDown, Eye, ShoppingCart, Check } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { PageWrapper } from '@/presentation/components/shared';
import { BigFooter } from '@/presentation/components/landing/BigFooter';
import { fadeUp } from '@/presentation/themes/animations';
import { TEMPLATES, FAQ_ITEMS } from '@/presentation/data/templates';
import { useCart } from '@/presentation/context/CartContext';

/* ── Layout ── */

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 48px 80px;
  animation: ${fadeUp} 0.35s ease both;
  overflow-x: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 24px 20px 60px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 16px 16px 100px;
  }
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  grid-template-rows: auto auto;
  gap: 48px;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr 280px;
    gap: 32px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
`;

const TopSection = styled.div`
  min-width: 0;
  max-width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    order: 1;
  }
`;

const RightCol = styled.div`
  position: sticky;
  top: calc(57px + 32px);
  grid-row: 1 / 3;
  grid-column: 2;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: static;
    order: 2;
    width: 100%;
  }
`;

const BottomSection = styled.div`
  min-width: 0;
  max-width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    order: 3;
  }
`;

/* ── Breadcrumb ── */

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-bottom: 16px;
    gap: 6px;
    font-size: ${({ theme }) => theme.typography.sizes.xs};
  }
`;

const BreadcrumbLink = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: inherit;
  font-family: inherit;
  cursor: pointer;
  padding: 0;
  letter-spacing: -0.01em;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover { color: ${({ theme }) => theme.colors.text.primary}; }
`;

const BreadcrumbCurrent = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    max-width: 140px;
  }
`;

/* ── Title area ── */

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.sizes['3xl']};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
  margin: 0 0 8px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 26px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 22px;
    margin: 0 0 6px;
  }
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  margin: 0 0 ${({ theme }) => theme.spacing['3']};
  word-break: break-word;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.sizes.md};
  }
`;

/* ── Image carousel ── */

const CarouselWrap = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 560 / 380;
  border-radius: ${({ theme }) => theme.radii['2xl']};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  margin-bottom: 12px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    aspect-ratio: 4 / 3;
    border-radius: ${({ theme }) => theme.radii.lg};
    margin-bottom: 12px;
  }
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const CarouselLabel = styled.div`
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.tertiary};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.sizes.sm};
  }
`;

const CarouselBtn = styled.button<{ $side: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${({ $side }) => $side}: 12px;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  color: ${({ theme }) => theme.colors.text.secondary};

  svg { width: 16px; height: 16px; }

  &:hover {
    background: ${({ theme }) => theme.colors.background.elevated};
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 28px;
    height: 28px;
    ${({ $side }) => $side}: 8px;
    svg { width: 14px; height: 14px; }
  }
`;

const Thumbnails = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar { display: none; }
  scrollbar-width: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: 8px;
    margin-bottom: 24px;
  }
`;

const Thumb = styled.button<{ $active: boolean }>`
  width: 96px;
  height: 68px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ $active, theme }) => $active ? theme.colors.text.primary : theme.colors.border.light};
  background: ${({ theme }) => theme.colors.background.surface};
  cursor: pointer;
  overflow: hidden;
  padding: 0;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.medium};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 64px;
    height: 46px;
  }
`;

/* ── Sections ── */

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
  margin: 0 0 ${({ theme }) => theme.spacing['3']};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.sizes.lg};
  }
`;

const OverviewText = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  margin: 0 0 ${({ theme }) => theme.spacing['8']};
  word-break: break-word;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.sizes.md};
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 ${({ theme }) => theme.spacing['8']};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['3']};
`;

const FeatureItem = styled.li`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  padding-left: 20px;
  position: relative;
  word-break: break-word;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 8px;
    width: 6px;
    height: 6px;
    border-radius: ${({ theme }) => theme.radii.full};
    background: ${({ theme }) => theme.colors.accent};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.sizes.md};
    padding-left: 16px;

    &::before {
      width: 5px;
      height: 5px;
      top: 7px;
    }
  }
`;

/* ── Sidebar cards ── */

const SidebarCard = styled.div`
  background: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 24px;
  margin-bottom: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 20px;
    margin-bottom: 12px;
    border-radius: ${({ theme }) => theme.radii.md};
  }
`;

const BenefitRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.primary};

  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.accent};
    flex-shrink: 0;
  }

  &:last-child { margin-bottom: 0; }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.sizes.md};
    gap: 8px;
    margin-bottom: 10px;
    svg { width: 14px; height: 14px; }
  }
`;

const BtnGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};

`;

const ActionBtn = styled.button<{ $variant: 'outline' | 'primary' | 'ghost' }>`
  width: 100%;
  height: 44px;
  border-radius: ${({ theme }) => theme.radii.button};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: -0.01em;
  transition: all ${({ theme }) => theme.transitions.base};
  white-space: nowrap;

  svg { width: 16px; height: 16px; }

  ${({ $variant, theme }) => {
    if ($variant === 'primary') return `
      background: ${theme.colors.text.primary};
      color: ${theme.colors.text.inverse};
      border: none;
      &:hover { background: #333; transform: translateY(-1px); }
    `;
    if ($variant === 'outline') return `
      background: ${theme.colors.background.elevated};
      color: ${theme.colors.text.primary};
      border: 1px solid ${theme.colors.border.light};
      &:hover { background: ${theme.colors.background.surface}; }
    `;
    return `
      background: transparent;
      color: ${theme.colors.text.accent};
      border: 1px solid ${theme.colors.border.light};
      &:hover { background: ${theme.colors.interactive.accentHover}; }
    `;
  }}
`;

const AddedBtn = styled(ActionBtn)`
  background: ${({ theme }) => theme.colors.success} !important;
  color: #fff !important;
  border: none !important;
  cursor: pointer;
  transition: all 0.2s ease;

  .added-label { display: inline-flex; align-items: center; gap: 8px; }
  .remove-label { display: none; align-items: center; gap: 8px; }

  &:hover {
    background: ${({ theme }) => theme.colors.destructive} !important;
    transform: none;
    .added-label { display: none; }
    .remove-label { display: inline-flex; }
  }
`;

/* Pages included */

const PagesList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: pages;
`;

const PagesItem = styled.li`
  counter-increment: pages;
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 6px 0;
  display: flex;
  gap: 8px;

  &::before {
    content: counter(pages) '.';
    color: ${({ theme }) => theme.colors.text.tertiary};
    min-width: 16px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.sizes.md};
    padding: 5px 0;
  }
`;

const ShowMoreLink = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
  padding: 4px 0 0;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover { color: ${({ theme }) => theme.colors.text.primary}; }
`;

/* Product description table */

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: ${({ theme }) => theme.typography.sizes.base};

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.sizes.md};
  }
`;

const InfoLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const InfoValue = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
`;

const CategoryTag = styled.span`
  display: inline-block;
  padding: 2px 10px;
  background: ${({ theme }) => theme.colors.background.surface};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

/* ── Related templates ── */

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  margin: ${({ theme }) => theme.spacing['8']} 0;
`;

const RelatedGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RelatedCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 0;
  cursor: pointer;
  position: relative;
`;

const RelatedThumb = styled.div`
  width: 140px;
  height: 96px;
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  flex-shrink: 0;
`;

const RelatedImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const RelatedPreview = styled.div`
  position: absolute;
  right: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%) scale(0.95);
  width: 320px;
  aspect-ratio: 4 / 3;
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  box-shadow: ${({ theme }) => theme.shadows.heavy};
  z-index: 20;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;

  ${RelatedCard}:hover & {
    opacity: 1;
    transform: translateY(-50%) scale(1);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transform: scale(1.1);
  }
`;

const RelatedInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const RelatedTitle = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.01em;
  display: block;
  margin-bottom: 2px;
`;

const RelatedPrice = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

/* ── FAQ ── */

const FaqItem = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: ${({ theme }) => theme.spacing['2']};
  background: ${({ theme }) => theme.colors.background.elevated};
  overflow: hidden;
`;

const FaqQuestion = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing['3']};
  padding: ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['5']};
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.01em;
  text-align: left;
  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.text.tertiary};
    transition: transform 0.2s ease;
    flex-shrink: 0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.sizes.md};
    padding: 14px 0;
  }
`;

const FaqAnswer = styled.div<{ $open: boolean }>`
  max-height: ${({ $open }) => $open ? '200px' : '0'};
  opacity: ${({ $open }) => $open ? 1 : 0};
  overflow: hidden;
  transition: max-height 0.35s ease, opacity 0.35s ease;
`;

const FaqAnswerInner = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  margin: 0;
  padding: 0 ${({ theme }) => theme.spacing['5']} ${({ theme }) => theme.spacing['4']};
  word-break: break-word;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.sizes.md};
  }
`;

/* ── Mobile sticky buy bar ── */

const MobileBuyBar = styled.div`
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: flex;
    gap: 8px;
  }
`;

const MobileBuyPrice = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 60px;
`;

const MobileBuyPriceValue = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
`;

const MobileBuyPriceLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const MobileBuyBtn = styled.button<{ $added?: boolean }>`
  flex: 1;
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.button};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: -0.01em;
  border: none;
  transition: all ${({ theme }) => theme.transitions.base};
  background: ${({ $added, theme }) => $added ? theme.colors.success : theme.colors.text.primary};
  color: #fff;

  svg { width: 16px; height: 16px; }

  &:active { transform: scale(0.98); }
`;

/* ── Component ── */

export const TemplateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, removeItem, hasItem } = useCart();
  const [activeSlide, setActiveSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showAllPages, setShowAllPages] = useState(false);
  const slides = [0, 1, 2, 3, 4, 5];

  const template = TEMPLATES.find(t => t.id === id);

  const related = useMemo(() => {
    if (!template) return [];
    return TEMPLATES
      .filter(t => t.id !== template.id && t.category.some(c => template.category.includes(c)))
      .slice(0, 4);
  }, [template]);

  if (!template) {
    return (
      <PageWrapper>
        <TopNav activeLink="templates" logoSub="Templates" />
        <Content>
          <Description>Template not found.</Description>
        </Content>
      </PageWrapper>
    );
  }

  const isFree = template.price === 'Free';
  const inCart = hasItem(template.id);

  const handleAddToCart = () => {
    addItem({
      id: template.id,
      title: template.title,
      price: template.price,
      image: template.image,
    });
  };

  return (
    <PageWrapper>
      <TopNav activeLink="templates" logoSub="Templates" />

      <Content>
        <Breadcrumb>
          <BreadcrumbLink onClick={() => navigate('/')}>Home</BreadcrumbLink>
          <span>/</span>
          <BreadcrumbLink onClick={() => navigate('/templates')}>Templates</BreadcrumbLink>
          <span>/</span>
          <BreadcrumbCurrent>{template.title}</BreadcrumbCurrent>
        </Breadcrumb>

        <TwoCol>
          <TopSection>
            <Title>{template.title}</Title>
            <Description>{template.description}</Description>

            {/* Carousel */}
            <CarouselWrap>
              <CarouselImage src={template.image} alt={`Preview ${activeSlide + 1}`} />
              <CarouselLabel>Preview {activeSlide + 1}</CarouselLabel>
              <CarouselBtn $side="left" onClick={() => setActiveSlide(i => i > 0 ? i - 1 : slides.length - 1)}>
                <ChevronLeft />
              </CarouselBtn>
              <CarouselBtn $side="right" onClick={() => setActiveSlide(i => i < slides.length - 1 ? i + 1 : 0)}>
                <ChevronRight />
              </CarouselBtn>
            </CarouselWrap>

            <Thumbnails>
              {slides.map(i => (
                <Thumb key={i} $active={activeSlide === i} onClick={() => setActiveSlide(i)} />
              ))}
            </Thumbnails>
          </TopSection>

          <BottomSection>
            {/* Template Overview */}
            <SectionTitle>Template Overview</SectionTitle>
            <OverviewText>{template.overview}</OverviewText>

            {/* Key Features */}
            <SectionTitle>Key Features</SectionTitle>
            <FeatureList>
              {template.features.map((f, i) => (
                <FeatureItem key={i}>{f}</FeatureItem>
              ))}
            </FeatureList>

            {/* FAQ */}
            <Divider />
            <SectionTitle>Frequently Asked Questions</SectionTitle>
            {FAQ_ITEMS.map((faq, i) => (
              <FaqItem key={i}>
                <FaqQuestion onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}
                  <ChevronDown style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)' }} />
                </FaqQuestion>
                <FaqAnswer $open={openFaq === i}>
                  <FaqAnswerInner>{faq.a}</FaqAnswerInner>
                </FaqAnswer>
              </FaqItem>
            ))}
          </BottomSection>

          {/* ── Right sidebar ── */}
          <RightCol>
            <SidebarCard>
              <BenefitRow><Check /> One-time Payment</BenefitRow>
              <BenefitRow><Check /> Commercial License</BenefitRow>
              <BenefitRow><Check /> Lifetime Support</BenefitRow>
              <BenefitRow><Check /> Source File Available</BenefitRow>

              <BtnGroup>
                <ActionBtn $variant="outline">
                  <Eye /> Live Preview
                </ActionBtn>
                {inCart ? (
                  <AddedBtn $variant="primary" onClick={() => removeItem(template.id)}>
                    <span className="added-label"><Check /> Added to Cart</span>
                    <span className="remove-label">Remove from Cart</span>
                  </AddedBtn>
                ) : (
                  <ActionBtn $variant="primary" onClick={handleAddToCart}>
                    <ShoppingCart />
                    {isFree ? 'Get for Free' : `Buy Now ${template.price}`}
                  </ActionBtn>
                )}
              </BtnGroup>
            </SidebarCard>

            <SidebarCard>
              <SectionTitle style={{ fontSize: '15px', marginBottom: '12px' }}>Pages Included</SectionTitle>
              <PagesList>
                {(showAllPages ? template.pagesIncluded : template.pagesIncluded.slice(0, 3)).map((p, i) => (
                  <PagesItem key={i}>{p}</PagesItem>
                ))}
              </PagesList>
              {template.pagesIncluded.length > 3 && !showAllPages && (
                <ShowMoreLink onClick={() => setShowAllPages(true)}>
                  +{template.pagesIncluded.length - 3} more pages
                </ShowMoreLink>
              )}
            </SidebarCard>

            <SectionTitle style={{ fontSize: '16px', marginTop: '24px', marginBottom: '16px' }}>Related Templates</SectionTitle>
            <RelatedGrid>
              {related.map(r => (
                <RelatedCard key={r.id} onClick={() => navigate(`/templates/${r.id}`)}>
                  <RelatedPreview><img src={r.image} alt={r.title} /></RelatedPreview>
                  <RelatedThumb>
                    <RelatedImg src={r.image} alt={r.title} />
                  </RelatedThumb>
                  <RelatedInfo>
                    <RelatedTitle>{r.title}</RelatedTitle>
                    <RelatedPrice>{r.price}</RelatedPrice>
                  </RelatedInfo>
                </RelatedCard>
              ))}
            </RelatedGrid>
          </RightCol>
        </TwoCol>
      </Content>

      <BigFooter onNavigate={(path) => navigate(path)} />

      {/* Mobile sticky buy bar */}
      <MobileBuyBar>
        <MobileBuyPrice>
          <MobileBuyPriceValue>{isFree ? 'Free' : template.price}</MobileBuyPriceValue>
          <MobileBuyPriceLabel>one-time</MobileBuyPriceLabel>
        </MobileBuyPrice>
        {inCart ? (
          <MobileBuyBtn $added onClick={() => removeItem(template.id)}>
            <Check /> Added
          </MobileBuyBtn>
        ) : (
          <MobileBuyBtn onClick={handleAddToCart}>
            <ShoppingCart />
            {isFree ? 'Get for Free' : 'Buy Now'}
          </MobileBuyBtn>
        )}
      </MobileBuyBar>
    </PageWrapper>
  );
};
