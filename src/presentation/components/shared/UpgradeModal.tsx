import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { Check } from 'lucide-react';
import { SubscriptionService } from '@/infrastructure/services/SubscriptionService';
import { useAuth } from '@/presentation/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, PlanBadge } from '@/presentation/components/shared';
import {
  PricingGrid,
  PricingCard,
  PricingPlanRow,
  PricingPlan,
  PricingPriceRow,
  PricingPrice,
  PricingPeriod,
  PricingFeatures,
} from '@/presentation/pages/WidgetStudioPage';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Single source of truth for the Pro upgrade modal. The Free/Pro card grid
 * is rendered with the same exported styled-components used on /widgets,
 * so the modal and the landing's pricing block stay 1:1 visually.
 */
export const UpgradeModal: React.FC<UpgradeModalProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const { isRegistered } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleGetPro = async () => {
    setError(null);
    if (!isRegistered) {
      onClose();
      navigate('/login', { state: { signup: true } });
      return;
    }
    setSubmitting(true);
    try {
      await SubscriptionService.startCheckout();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
      />
      <div style={{
        position: 'relative', background: '#fff', borderRadius: 28, padding: '48px 40px 40px',
        width: 650, maxWidth: '92vw',
        boxShadow: '0 32px 80px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)',
        animation: 'upgradeModalIn 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
      }}>
        <style>{`@keyframes upgradeModalIn { from { opacity: 0; transform: scale(0.96) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: 20, right: 20, width: 36, height: 36, border: 'none',
            background: 'rgba(0,0,0,0.04)', borderRadius: 12, cursor: 'pointer', fontSize: 20, color: '#bbb',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >×</button>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 48, height: 48, borderRadius: 16,
            /* Outline + airy translucent accent wash so the bubble feels
               filled but stays light. */
            background: 'rgba(99, 102, 241, 0.10)',
            border: `1.5px solid ${theme.colors.accent}`,
            color: theme.colors.accent,
            marginBottom: 16,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
            </svg>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: theme.colors.text.primary, letterSpacing: '-0.03em' }}>Upgrade to Pro</div>
          <div style={{ fontSize: 15, color: theme.colors.text.tertiary, marginTop: 8 }}>Unlock all styles and unlimited widgets</div>
        </div>

        {/* Pricing grid — same styled components used on /widgets so the
            cards stay 1:1 with the landing's pricing block. */}
        <PricingGrid>
          <PricingCard>
            <PricingPlanRow>
              <PricingPlan>Free</PricingPlan>
            </PricingPlanRow>
            <PricingPriceRow>
              <PricingPrice>$0</PricingPrice>
              <PricingPeriod>forever</PricingPeriod>
            </PricingPriceRow>
            <PricingFeatures>
              <li><Check /> Up to 3 widgets</li>
              <li><Check /> Calendar &amp; Clock only</li>
              <li><Check /> Basic colors &amp; layout</li>
              <li><Check /> Embed in Notion</li>
            </PricingFeatures>
            <Button $variant="outline" $size="lg" $fullWidth onClick={onClose} style={{ marginTop: 24 }}>
              Current plan
            </Button>
          </PricingCard>
          <PricingCard $highlighted>
            <PricingPlanRow>
              <PricingPlan $highlighted>Pro</PricingPlan>
              <PlanBadge $pro $size="xs">Popular</PlanBadge>
            </PricingPlanRow>
            <PricingPriceRow>
              <PricingPrice>$4</PricingPrice>
              <PricingPeriod>monthly</PricingPeriod>
            </PricingPriceRow>
            <PricingFeatures $highlighted>
              <li><Check /> Unlimited widgets</li>
              <li><Check /> All widget types</li>
              <li><Check /> Full customization</li>
              <li><Check /> Exclusive widget styles</li>
            </PricingFeatures>
            <Button
              $variant="primary"
              $size="lg"
              $fullWidth
              disabled={submitting}
              onClick={handleGetPro}
              style={{ marginTop: 24 }}
            >
              {submitting ? 'Redirecting…' : isRegistered ? 'Get Pro' : 'Sign up to continue'}
            </Button>
            {error && (
              <div style={{ marginTop: 10, fontSize: 12, color: theme.colors.danger.soft, textAlign: 'center' }}>
                {error}
              </div>
            )}
          </PricingCard>
        </PricingGrid>
      </div>
    </div>
  );
};
