import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { Check } from 'lucide-react';
import { SubscriptionService } from '@/infrastructure/services/SubscriptionService';
import { useAuth } from '@/presentation/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/presentation/hooks/useIsMobile';
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
  const isMobile = useIsMobile();
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
    <div style={{ position: 'fixed', inset: 0, zIndex: theme.zIndex.modal, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
      />
      <div style={{
        position: 'relative', background: '#fff',
        borderRadius: isMobile ? 20 : 28,
        padding: isMobile ? '28px 18px 20px' : '48px 40px 40px',
        width: 650,
        maxWidth: isMobile ? 'calc(100vw - 24px)' : '92vw',
        boxShadow: '0 32px 80px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)',
        animation: 'upgradeModalIn 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
      }}>
        <style>{`@keyframes upgradeModalIn { from { opacity: 0; transform: scale(0.96) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: isMobile ? 12 : 20,
            right: isMobile ? 12 : 20,
            width: isMobile ? 32 : 36,
            height: isMobile ? 32 : 36,
            border: 'none',
            background: 'rgba(0,0,0,0.04)', borderRadius: 12, cursor: 'pointer',
            fontSize: isMobile ? 18 : 20,
            color: '#bbb',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >×</button>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 20 : 36 }}>
          <div style={{
            fontSize: isMobile ? 22 : 28,
            fontWeight: 700,
            color: theme.colors.text.primary,
            letterSpacing: '-0.03em',
          }}>Upgrade to Pro</div>
          <div style={{
            fontSize: isMobile ? 13 : 15,
            color: theme.colors.text.tertiary,
            marginTop: isMobile ? 6 : 8,
          }}>Unlock all styles and unlimited widgets</div>

          {/* Phone-only "You're on Free" pill — replaces the redundant Free
             card below by acknowledging the user's current plan inline. */}
          {isMobile && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 12,
              padding: '4px 10px',
              borderRadius: 999,
              background: 'rgba(0,0,0,0.04)',
              fontSize: 11,
              fontWeight: 500,
              color: theme.colors.text.tertiary,
              letterSpacing: '0.02em',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: theme.colors.text.muted,
              }} />
              Currently on Free
            </div>
          )}
        </div>

        {/* Pricing grid — desktop shows side-by-side Free + Pro for direct
           comparison. Phone (≤480) shows ONLY the Pro card; the Free state
           is conveyed by the pill in the header above. Pattern matches what
           Linear / Notion / Apple do on mobile upsells — drop redundant
           "current plan" card to halve the scroll height. */}
        <PricingGrid>
          {!isMobile && (
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
          )}
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
              style={{ marginTop: isMobile ? 16 : 24 }}
            >
              {submitting ? 'Redirecting…' : isRegistered ? 'Get Pro' : 'Sign up to continue'}
            </Button>
            {isMobile && (
              <Button
                $variant="ghost"
                $size="md"
                $fullWidth
                onClick={onClose}
                style={{ marginTop: 6 }}
              >
                Maybe later
              </Button>
            )}
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
