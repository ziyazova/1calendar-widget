import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ChevronDown, Eye, ShoppingCart, Check } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { PageWrapper, BackButton, Button, Card, Accordion, TemplateMockupCard, TemplateMockupImage } from '@/presentation/components/shared';
import { BigFooter } from '@/presentation/components/landing/BigFooter';
import { fadeUp } from '@/presentation/themes/animations';
import { TEMPLATES, FAQ_ITEMS } from '@/presentation/data/templates';
import { useCart } from '@/presentation/context/CartContext';
import { useAuth } from '@/presentation/context/AuthContext';
import { SubscriptionService } from '@/infrastructure/services/SubscriptionService';
import { FEATURES } from '@/config/features';

/* ── Layout ── */

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 48px 0;
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
  font-size: ${({ theme }) => theme.typography.sizes['7xl']};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
  margin: 0 0 6px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.sizes['5xl']};
  }
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.body};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  margin: 0 0 ${({ theme }) => theme.spacing['3']};
  word-break: break-word;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.sizes.md};
  }
`;

/* ── Image carousel ── (card surface now comes from shared TemplateMockupCard) */

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
  color: ${({ theme }) => theme.colors.text.body};

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
  color: ${({ theme }) => theme.colors.text.body};
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
  color: ${({ theme }) => theme.colors.text.body};
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

const AddedBtn = styled(Button).attrs({ $variant: 'success' as const, $size: 'lg' as const, $fullWidth: true })`
  .added-label { display: inline-flex; align-items: center; gap: 8px; }
  .remove-label { display: none; align-items: center; gap: 8px; }

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.danger.strong};
    filter: none;
    .added-label { display: none; }
    .remove-label { display: inline-flex; }
  }
`;

const EtsyDisclosure = styled.p`
  margin: 10px 0 0;
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-align: center;
`;

const ErrorDisclosure = styled.p`
  margin: 10px 0 0;
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.danger.strong};
  text-align: center;
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
  color: ${({ theme }) => theme.colors.text.body};
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

/* Fixed-width wrapper so the shared <TemplateMockupCard $size="thumb"> (aspect
   35/24) sits at exactly 140×96 in the Related rail. */
const RelatedThumbSlot = styled.div`
  width: 140px;
  flex-shrink: 0;
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
  background: linear-gradient(180deg, #FAFAFC 0%, #F4F4FA 40%, #EEEEF8 100%);
  z-index: 20;
  opacity: 0;
  pointer-events: none;
  transition: opacity ${({ theme }) => theme.transitions.medium}, transform ${({ theme }) => theme.transitions.medium};

  ${RelatedCard}:hover & {
    opacity: 1;
    transform: translateY(-50%) scale(1);
  }

  img {
    width: 75%;
    height: 75%;
    object-fit: contain;
    display: block;
    margin: auto;
    position: absolute;
    inset: 0;
    filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.1));
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
  color: ${({ theme }) => theme.colors.text.body};
`;

/* ── FAQ (uses shared <Accordion>; just a vertical stack) ── */

const FaqList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2']};
`;

// Shared <Accordion> renders its children raw — style the FAQ answer here so
// it matches the old size/color instead of inheriting body defaults.
const FaqAnswerText = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.body};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  margin: 0;
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

/* MobileBuyBtn replaced by shared <Button $variant="primary|success" $size="xl">. */

/* ── Component ── */

export const TemplateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, removeItem, hasItem } = useCart();
  const { isRegistered } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showAllPages, setShowAllPages] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [buying, setBuying] = useState(false);
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

  const handleBuyNow = async () => {
    if (!template.polarProductId) return;
    // Guests can buy too — Polar collects the email on its checkout page,
    // the webhook records the purchase by email, and the buyer can link it
    // to an account later (AuthContext back-fills on sign-in).
    setBuyError(null);
    setBuying(true);
    try {
      await SubscriptionService.startCheckout({
        productId: template.polarProductId,
        successPath: `/studio?purchased=${template.polarProductId}`,
      });
    } catch (e) {
      setBuyError(e instanceof Error ? e.message : 'Checkout failed. Please try again.');
      setBuying(false);
    }
  };

  return (
    <PageWrapper>
      <TopNav activeLink="templates" logoSub="Templates" />

      <Content>
        <BackButton label="Templates" onClick={() => navigate('/templates')} />

        <TwoCol>
          <TopSection>
            <Title>{template.title}</Title>
            <Description>{template.description}</Description>

            {/* Carousel — shared TemplateMockupCard (hero size) +
                carousel chevrons layered on top. */}
            <TemplateMockupCard $size="hero" style={{ marginBottom: 12 }}>
              <TemplateMockupImage $size="hero" $hoverZoom={false} src={template.image} alt={template.title} />
              <CarouselBtn $side="left" onClick={() => setActiveSlide(i => i > 0 ? i - 1 : slides.length - 1)}>
                <ChevronLeft />
              </CarouselBtn>
              <CarouselBtn $side="right" onClick={() => setActiveSlide(i => i < slides.length - 1 ? i + 1 : 0)}>
                <ChevronRight />
              </CarouselBtn>
            </TemplateMockupCard>

            {/* Thumbnails hidden until real images are added
            <Thumbnails>
              {slides.map(i => (
                <Thumb key={i} $active={activeSlide === i} onClick={() => setActiveSlide(i)} />
              ))}
            </Thumbnails>
            */}
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
            <SectionTitle style={{ marginTop: '32px' }}>FAQ</SectionTitle>
            <FaqList>
              {FAQ_ITEMS.map((faq, i) => (
                <Accordion
                  key={i}
                  title={faq.q}
                  open={openFaq === i}
                  onToggle={(open) => setOpenFaq(open ? i : null)}
                >
                  <FaqAnswerText>{faq.a}</FaqAnswerText>
                </Accordion>
              ))}
            </FaqList>
          </BottomSection>

          {/* ── Right sidebar ── */}
          <RightCol>
            <Card $variant="outlined" $padding="lg" $radius="lg" style={{ marginBottom: 16 }}>
              <BenefitRow><Check /> One-time Payment</BenefitRow>
              <BenefitRow><Check /> Instant Download</BenefitRow>
              <BenefitRow><Check /> Video Setup Guides</BenefitRow>
              <BenefitRow><Check /> Customization Guide</BenefitRow>
              <BenefitRow><Check /> Lifetime Updates</BenefitRow>

              <BtnGroup>
                {template.polarProductId && !isFree && (
                  <Button
                    $variant="primary"
                    $size="lg"
                    $fullWidth
                    onClick={handleBuyNow}
                    disabled={buying}
                  >
                    {buying ? 'Opening checkout…' : `Buy Now · ${template.price}`}
                  </Button>
                )}
                {/* Free download still uses the cart/Add-to-Cart path */}
                {isFree && FEATURES.ENABLE_LOCAL_CHECKOUT && (
                  inCart ? (
                    <AddedBtn onClick={() => removeItem(template.id)}>
                      <span className="added-label"><Check /> Added</span>
                      <span className="remove-label">Remove</span>
                    </AddedBtn>
                  ) : (
                    <Button $variant="primary" $size="lg" $fullWidth onClick={handleAddToCart}>
                      <ShoppingCart /> Get for Free
                    </Button>
                  )
                )}
                {buyError && (
                  <ErrorDisclosure>{buyError}</ErrorDisclosure>
                )}
                {template.etsyUrl && (
                  <>
                    <Button
                      as="a"
                      href={template.etsyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      $variant="outline"
                      $size="lg"
                      $fullWidth
                    >
                      Buy on Etsy
                    </Button>
                    <EtsyDisclosure>
                      Etsy is an alternative if you prefer — prices may vary by location and their terms apply.
                    </EtsyDisclosure>
                  </>
                )}
              </BtnGroup>
            </Card>

            <Card $variant="outlined" $padding="lg" $radius="lg" style={{ marginBottom: 16 }}>
              <SectionTitle style={{ fontSize: '14px', marginBottom: '12px' }}>Pages Included</SectionTitle>
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
            </Card>

            <SectionTitle style={{ fontSize: '16px', marginTop: '24px', marginBottom: '16px' }}>Related Templates</SectionTitle>
            <RelatedGrid>
              {related.map(r => (
                <RelatedCard key={r.id} onClick={() => navigate(`/templates/${r.id}`)}>
                  <RelatedPreview><img src={r.image} alt={r.title} /></RelatedPreview>
                  <RelatedThumbSlot>
                    <TemplateMockupCard $size="thumb" $interactive>
                      <TemplateMockupImage $size="thumb" src={r.image} alt={r.title} />
                    </TemplateMockupCard>
                  </RelatedThumbSlot>
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

      {/* Mobile sticky buy bar — only rendered when we have somewhere to send
          the buyer (Etsy URL, or local checkout is enabled post-Polar). */}
      {(template.polarProductId || template.etsyUrl || FEATURES.ENABLE_LOCAL_CHECKOUT) && (
        <MobileBuyBar>
          <MobileBuyPrice>
            <MobileBuyPriceValue>{isFree ? 'Free' : template.price}</MobileBuyPriceValue>
            <MobileBuyPriceLabel>one-time</MobileBuyPriceLabel>
          </MobileBuyPrice>
          {FEATURES.ENABLE_LOCAL_CHECKOUT && inCart ? (
            <Button $variant="success" $size="xl" onClick={() => removeItem(template.id)} style={{ flex: 1 }}>
              <Check /> Added
            </Button>
          ) : template.polarProductId && !isFree ? (
            <Button $variant="primary" $size="xl" onClick={handleBuyNow} disabled={buying} style={{ flex: 1 }}>
              {buying ? 'Opening…' : 'Buy Now'}
            </Button>
          ) : template.etsyUrl ? (
            <Button
              $variant="primary"
              $size="xl"
              as="a"
              href={template.etsyUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ flex: 1 }}
            >
              {isFree ? 'Get for Free' : 'Buy on Etsy'}
            </Button>
          ) : (
            <Button $variant="primary" $size="xl" onClick={handleAddToCart} style={{ flex: 1 }}>
              {isFree ? 'Get for Free' : 'Add to Cart'}
            </Button>
          )}
        </MobileBuyBar>
      )}
    </PageWrapper>
  );
};
