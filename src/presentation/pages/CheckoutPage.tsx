import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, CreditCard, Trash2 } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { PageWrapper } from '@/presentation/components/shared';
import { useCart } from '@/presentation/context/CartContext';

const Content = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['8']} ${({ theme }) => theme.spacing['12']} ${({ theme }) => theme.spacing['20']};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing['6']} ${({ theme }) => theme.spacing['6']} ${({ theme }) => theme.spacing['16']};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['12']};
  }
`;

const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text.tertiary};
  padding: 0;
  margin-bottom: ${({ theme }) => theme.spacing['6']};
  transition: color ${({ theme }) => theme.transitions.fast};

  svg { width: 14px; height: 14px; }

  &:hover { color: ${({ theme }) => theme.colors.text.primary}; }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.sizes['3xl']};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
  margin: 0 0 ${({ theme }) => theme.spacing['8']};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 22px;
  }
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: ${({ theme }) => theme.spacing['10']};
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing['8']};
  }
`;

const LeftCol = styled.div``;

const RightCol = styled.div`
  position: sticky;
  top: calc(57px + 32px);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: static;
    order: -1;
  }
`;

/* ── Form ── */

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing['8']};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
  margin: 0 0 ${({ theme }) => theme.spacing['4']};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing['3']};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div<{ $full?: boolean }>`
  grid-column: ${({ $full }) => $full ? '1 / -1' : 'auto'};
`;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing['1']};
`;

const Input = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 ${({ theme }) => theme.spacing['3']};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.background.elevated};
  outline: none;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &::placeholder { color: ${({ theme }) => theme.colors.text.muted}; }
  &:focus { border-color: ${({ theme }) => theme.colors.accent}; }
`;

const CardInputWrap = styled.div`
  position: relative;

  svg {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.text.muted};
  }
`;

/* ── Order Summary ── */

const SummaryCard = styled.div`
  background: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
`;

const SummaryHeader = styled.div`
  padding: ${({ theme }) => theme.spacing['5']};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SummaryItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']};
  padding: ${({ theme }) => theme.spacing['3']} ${({ theme }) => theme.spacing['5']};

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  }
`;

const SummaryThumb = styled.div`
  width: 48px;
  height: 36px;
  border-radius: 6px;
  overflow: hidden;
  background: linear-gradient(180deg, #FAFAFC 0%, #F6F6FA 50%, #F0F0F8 100%);
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  flex-shrink: 0;
  position: relative;

  img { width: 80%; height: 80%; object-fit: contain; position: absolute; inset: 0; margin: auto; }
`;

const SummaryInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const SummaryName = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  display: block;
`;

const SummaryPrice = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const SummaryRemove = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.muted};
  display: flex;
  padding: 4px;
  border-radius: 4px;
  transition: all ${({ theme }) => theme.transitions.fast};

  svg { width: 14px; height: 14px; }

  &:hover {
    color: ${({ theme }) => theme.colors.destructive};
    background: rgba(220, 40, 40, 0.06);
  }
`;

const PromoWrap = styled.div`
  display: flex;
  gap: 8px;
  padding: ${({ theme }) => theme.spacing['3']} ${({ theme }) => theme.spacing['5']};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const PromoInput = styled.input`
  flex: 1;
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing['3']};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.background.page};
  outline: none;

  &::placeholder { color: ${({ theme }) => theme.colors.text.muted}; }
  &:focus { border-color: ${({ theme }) => theme.colors.accent}; }
`;

const PromoBtn = styled.button`
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing['4']};
  background: ${({ theme }) => theme.colors.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover { background: ${({ theme }) => theme.colors.interactive.hover}; }
`;

const SummaryFooter = styled.div`
  padding: ${({ theme }) => theme.spacing['5']};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const SummaryRow = styled.div<{ $bold?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ $bold, theme }) => $bold ? theme.typography.sizes.lg : theme.typography.sizes.base};
  font-weight: ${({ $bold, theme }) => $bold ? theme.typography.weights.semibold : theme.typography.weights.normal};
  color: ${({ theme }) => theme.colors.text.primary};

  &:not(:last-child) { margin-bottom: ${({ theme }) => theme.spacing['2']}; }
`;

const SummaryLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const PayBtn = styled.button`
  width: 100%;
  height: 52px;
  margin-top: ${({ theme }) => theme.spacing['4']};
  background: ${({ theme }) => theme.colors.text.primary};
  color: #fff;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing['2']};
  letter-spacing: -0.01em;
  transition: all ${({ theme }) => theme.transitions.base};

  svg { width: 16px; height: 16px; }

  &:hover { background: #333; }
  &:active { transform: scale(0.99); }
`;

const SecureNote = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: ${({ theme }) => theme.spacing['3']};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.muted};

  svg { width: 12px; height: 12px; }
`;

const GuestNote = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0 0 ${({ theme }) => theme.spacing['6']};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};

  a {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.weights.medium};
    text-decoration: none;
    cursor: pointer;

    &:hover { text-decoration: underline; }
  }
`;

const SupportCard = styled.div`
  margin-top: ${({ theme }) => theme.spacing['8']};
  padding: ${({ theme }) => theme.spacing['5']};
  background: ${({ theme }) => theme.colors.background.surface};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const SupportTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing['2']};
`;

const SupportText = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text.tertiary};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  margin: 0;
`;

const SupportLink = styled.a`
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  cursor: pointer;

  &:hover { text-decoration: underline; }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['16']} 0;
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography.sizes.base};
`;

const EmptyBtn = styled.button`
  margin-top: ${({ theme }) => theme.spacing['4']};
  height: 44px;
  padding: 0 ${({ theme }) => theme.spacing['6']};
  background: ${({ theme }) => theme.colors.text.primary};
  color: #fff;
  border: none;
  border-radius: ${({ theme }) => theme.radii.button};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  font-family: inherit;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover { background: #333; }
`;

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeItem } = useCart();
  const [paymentMethod] = useState<'card' | 'paypal'>('card');

  const subtotal = items.reduce((sum, item) => {
    const num = parseFloat(item.price.replace('$', ''));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  if (items.length === 0) {
    return (
      <PageWrapper>
        <TopNav logoSub="Checkout" />
        <Content>
          <EmptyState>
            Your cart is empty
            <br />
            <EmptyBtn onClick={() => navigate('/templates')}>Browse Templates</EmptyBtn>
          </EmptyState>
        </Content>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <TopNav logoSub="Checkout" />

      <Content>
        <BackBtn onClick={() => navigate(-1)}>
          <ArrowLeft /> Back
        </BackBtn>
        <Title>Checkout</Title>

        <TwoCol>
          <LeftCol>
            <Section>
              <SectionTitle>Contact Information</SectionTitle>
              <FormGrid>
                <FormGroup>
                  <Label>First name</Label>
                  <Input placeholder="John" />
                </FormGroup>
                <FormGroup>
                  <Label>Last name</Label>
                  <Input placeholder="Doe" />
                </FormGroup>
                <FormGroup $full>
                  <Label>Email</Label>
                  <Input type="email" placeholder="john@example.com" />
                </FormGroup>
              </FormGrid>
            </Section>

            {paymentMethod === 'card' && subtotal > 0 && (
              <Section>
                <SectionTitle>Payment</SectionTitle>
                <FormGrid>
                  <FormGroup $full>
                    <Label>Card number</Label>
                    <CardInputWrap>
                      <Input placeholder="1234 5678 9012 3456" />
                      <CreditCard />
                    </CardInputWrap>
                  </FormGroup>
                  <FormGroup>
                    <Label>Expiry date</Label>
                    <Input placeholder="MM / YY" />
                  </FormGroup>
                  <FormGroup>
                    <Label>CVC</Label>
                    <Input placeholder="123" />
                  </FormGroup>
                </FormGrid>
              </Section>
            )}
            <SupportCard>
              <SupportTitle>Need help?</SupportTitle>
              <SupportText>
                Didn't receive your download link? Check your spam folder first.
                Still having issues? Contact us at <SupportLink href="mailto:support@peachy.studio">support@peachy.studio</SupportLink> and
                we'll sort it out within 24 hours.
              </SupportText>
            </SupportCard>
          </LeftCol>

          <RightCol>
            <SummaryCard>
              <SummaryHeader>Order Summary</SummaryHeader>
              {items.map(item => (
                <SummaryItem key={item.id}>
                  <SummaryThumb>
                    <img src={item.image} alt={item.title} />
                  </SummaryThumb>
                  <SummaryInfo>
                    <SummaryName>{item.title}</SummaryName>
                    <SummaryPrice>{item.price}</SummaryPrice>
                  </SummaryInfo>
                  <SummaryRemove onClick={() => removeItem(item.id)} aria-label="Remove">
                    <Trash2 />
                  </SummaryRemove>
                </SummaryItem>
              ))}
              <PromoWrap>
                <PromoInput placeholder="Promo code" />
                <PromoBtn>Apply</PromoBtn>
              </PromoWrap>
              <SummaryFooter>
                <SummaryRow>
                  <SummaryLabel>Subtotal</SummaryLabel>
                  <span>{subtotal === 0 ? 'Free' : `$${subtotal.toFixed(2)}`}</span>
                </SummaryRow>
                <SummaryRow>
                  <SummaryLabel>Tax</SummaryLabel>
                  <span>$0.00</span>
                </SummaryRow>
                <SummaryRow $bold>
                  <span>Total</span>
                  <span>{subtotal === 0 ? 'Free' : `$${subtotal.toFixed(2)}`}</span>
                </SummaryRow>
                <PayBtn>
                  <Lock /> {subtotal === 0 ? 'Get for Free' : `Pay $${subtotal.toFixed(2)}`}
                </PayBtn>
                <SecureNote>
                  <Lock /> Secure checkout powered by Stripe
                </SecureNote>
              </SummaryFooter>
            </SummaryCard>
          </RightCol>
        </TwoCol>
      </Content>
    </PageWrapper>
  );
};
