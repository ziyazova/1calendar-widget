import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PurchaseService, type Purchase } from '@/infrastructure/services/PurchaseService';
import { SubscriptionService } from '@/infrastructure/services/SubscriptionService';
import { TEMPLATES, getTemplateEtsyId } from '@/presentation/data/templates';
import { Button as SharedButton } from '@/presentation/components/shared';
import { Logger } from '@/infrastructure/services/Logger';

/* Single source of truth for the "Purchases" surface — both the
   dedicated /studio (account → Purchases) view and the dashboard's
   inline "My Purchases" section render through PurchaseListItem +
   usePurchases here. Keeps card chrome, formatting, and data source
   identical across the two locations. */

export const PurchaseCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.hairline};
  border-radius: ${({ theme }) => theme.radii.lg};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.hairlineHover};
    box-shadow: ${({ theme }) => theme.shadows.card};
  }

  & + & { margin-top: 8px; }

  /* Mobile — surfaceAlt + mobileCard shadow matches /widgets gallery
     card chrome. flex-wrap drops the trailing Download button to its
     own full-width row (claims flex-basis:100% below). Per "слишком
     плотно, кнопку спихни на след строку" (c_2026-04-29). */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    background: ${({ theme }) => theme.colors.background.surfaceAlt};
    box-shadow: ${({ theme }) => theme.shadows.mobileCard};
    border-color: transparent;
    padding: 14px;
    gap: 12px;
    flex-wrap: wrap;
    align-items: center;

    &:hover {
      border-color: transparent;
      box-shadow: ${({ theme }) => theme.shadows.mobileCard};
    }

    & > button {
      flex-basis: 100%;
      width: 100%;
      justify-content: center;
    }
  }
`;

export const PurchaseImg = styled.div`
  /* Wider landscape frame (88×64) so portrait template screenshots fit
     without aggressive cropping. object-fit: contain shows the whole
     image; surfaceMuted fills the leftover space when the natural
     aspect doesn't match. Per "картинка не входит в рамку — увеличь
     рамку и адаптируй контент" (c_2026-04-29). */
  /* Bumped width 88 → 96 + smaller radius (md=12 → sm=8) so portrait
   * template screenshots show with less side-letterboxing while the
   * visible corner reads as a quieter, more confident frame. Per
   * "по ширине на пару пикселей больше + меньше скругления". */
  width: 96px;
  height: 76px;
  border-radius: ${({ theme }) => theme.radii.sm};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background.surfaceMuted};
  flex-shrink: 0;
  /* width/height 100% + object-fit: contain — image scales down to fit
     the box on whichever axis is constrained, and surfaceMuted fills
     the rest. !important guards against any descendant img reset
     coming in from global styles or shared Card chrome. */
  img {
    display: block;
    /* Pull the screenshot in by 6% on each side so the product reads
     * as a tile sitting inside the frame rather than filling it edge-
     * to-edge. Per "продукт слишком большой, чуть зум-аут" (c_2026-05-05). */
    width: 88% !important;
    height: 88% !important;
    margin: 6% auto !important;
    object-fit: contain !important;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 80px;
    height: 66px;
  }
`;

export const PurchaseDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

export const PurchaseTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const PurchaseMeta = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-top: 2px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 11px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const PurchasePriceTag = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-right: 8px;

  /* Hidden on phone — Download is the primary action and price is
     already in the receipt email + Polar portal. */
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }

  @media (min-width: 481px) and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 13px;
    margin-right: 4px;
  }
`;

const formatPrice = (cents: number | null, currency: string) => {
  if (cents == null) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100);
};

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

/* Joins a Polar purchase row with the local TEMPLATES catalogue so
   we can render image + title + slug. Polar products are named
   `{etsyId} {title}` so we extract the leading numeric id from
   `productName` and match it to a template by its Etsy listing URL.
   Falls back to a generic placeholder for legacy or newly-listed
   Polar products that aren't in the local catalogue yet. */
const enrich = (p: Purchase) => {
  const etsyId = p.productName?.match(/^(\d+)/)?.[1] ?? null;
  const template = etsyId
    ? TEMPLATES.find(t => getTemplateEtsyId(t) === etsyId)
    : null;
  return {
    image: template?.image ?? '/template-main.png',
    slug: template?.id,
    title: template?.title ?? p.productName ?? 'Template purchase',
  };
};

/* DEV-only fallback — when the real purchases table returns empty,
   inject one fake row so the UI is testable end-to-end without buying
   anything. Tied to import.meta.env.DEV so prod never sees it.
   `productName` mirrors the live Polar naming convention so the
   matching logic in `enrich` resolves it to a real template. */
const DEV_FAKE_PURCHASE: Purchase = {
  id: 'dev-fake-1',
  polarOrderId: 'DEV-PEACHY-1042',
  polarProductId: 'dev-product',
  productName: TEMPLATES[0]
    ? `${getTemplateEtsyId(TEMPLATES[0]) ?? 'unknown'} ${TEMPLATES[0].title}`
    : 'Weekly Planner',
  amountCents: 799,
  currency: 'USD',
  status: 'paid',
  createdAt: new Date().toISOString(),
};

export function usePurchases(): { purchases: Purchase[]; loading: boolean } {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const rows = await PurchaseService.getMyPurchases();
      if (cancelled) return;
      const next = rows.length === 0 && import.meta.env.DEV ? [DEV_FAKE_PURCHASE] : rows;
      setPurchases(next);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { purchases, loading };
}

const handleDownload = (e: React.MouseEvent) => {
  e.stopPropagation();
  // Download links live in the Polar email delivery. Open the Polar
  // customer portal where the buyer can redownload.
  void SubscriptionService.openCustomerPortal()
    .then(ok => {
      if (!ok) window.open('https://polar.sh', '_blank', 'noopener,noreferrer');
    })
    .catch(err => Logger.error('PurchaseList', 'openCustomerPortal failed', err));
};

interface PurchaseListItemProps {
  purchase: Purchase;
}

export const PurchaseListItem: React.FC<PurchaseListItemProps> = ({ purchase: p }) => {
  const navigate = useNavigate();
  const info = useMemo(() => enrich(p), [p]);

  return (
    <PurchaseCard
      style={{ cursor: info.slug ? 'pointer' : 'default' }}
      onClick={() => info.slug && navigate(`/templates/${info.slug}`)}
    >
      <PurchaseImg>
        <img src={info.image} alt={info.title} />
      </PurchaseImg>
      <PurchaseDetails>
        <PurchaseTitle>{info.title}</PurchaseTitle>
        <PurchaseMeta>
          #{p.polarOrderId.slice(-8)} · {formatDate(p.createdAt)}
          {p.status === 'refunded' ? ' · refunded' : ''}
        </PurchaseMeta>
      </PurchaseDetails>
      <PurchasePriceTag>{formatPrice(p.amountCents, p.currency)}</PurchasePriceTag>
      <SharedButton
        $variant="secondary"
        $size="sm"
        aria-label="Download"
        onClick={handleDownload}
      >
        <Download /> Download
      </SharedButton>
    </PurchaseCard>
  );
};
