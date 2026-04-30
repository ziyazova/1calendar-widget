import React from 'react';
import styled, { useTheme } from 'styled-components';
import { Sparkle } from 'lucide-react';
import { Button } from './Button';

export type PlanUsageMode = 'free' | 'pro';
export type PlanUsageSize = 'wide' | 'compact' | 'inline';

interface PlanUsageCardProps {
  mode: PlanUsageMode;
  used?: number;
  limit?: number;
  $size?: PlanUsageSize;
  onUpgrade?: () => void;
  onManage?: () => void;
}

const Wrap = styled.div<{ $size: PlanUsageSize; $pro?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ $size, $pro }) => {
    if ($pro && $size === 'compact') return '14px';
    return $size === 'wide' ? '16px' : '10px';
  }};
  padding: ${({ $size, $pro }) => {
    if ($pro) return $size === 'wide' ? '10px 16px' : '8px 14px';
    return $size === 'wide' ? '12px 16px' : '8px 14px';
  }};
  /* Force the trailing button (Upgrade) flush against the right padding edge
     so left/right inner spacing reads symmetric. */
  & > button:last-child { margin-left: auto !important; }
  background: ${({ $pro, theme }) =>
    $pro ? 'rgba(99, 102, 241, 0.05)' : theme.colors.background.surfaceAlt};
  border: 1px solid
    ${({ $pro, theme }) => ($pro ? theme.colors.accent : theme.colors.border.light)};
  border-radius: ${({ theme }) => theme.radii.lg};
  ${({ $pro }) => $pro && 'box-shadow: 0 1px 2px rgba(99, 102, 241, 0.08);'}
  /* Free under/at-limit cards lock to the same width so they're pixel-
     identical (only the colour + label flip). Pro is its own narrower
     pill — single label, no button — fixed 50px tall per design. */
  width: ${({ $size, $pro }) => {
    if ($pro) return $size === 'wide' ? '200px' : '180px';
    return $size === 'wide' ? '325px' : '206px';
  }};
  ${({ $pro, $size }) => $pro && $size === 'compact' && 'height: 50px;'}
`;

const Label = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  white-space: nowrap;
`;

const Eyebrow = styled.div<{ $atLimit?: boolean }>`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ $atLimit, theme }) =>
    $atLimit ? theme.colors.danger.soft : theme.colors.text.tertiary};
  line-height: 1.2;
`;

const Usage = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  letter-spacing: -0.01em;
  line-height: 1.2;

  strong {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

/* Square bubble that mirrors the UsageRing footprint (40x40 wide, 24x24
   compact). Lets the Pro variant line up vertically with Free under/at-limit
   when stacked in lists or DS catalogues. */
const ProBubble = styled.div<{ $size: PlanUsageSize }>`
  flex-shrink: 0;
  width: ${({ $size }) => ($size === 'wide' ? '40px' : '32px')};
  height: ${({ $size }) => ($size === 'wide' ? '40px' : '32px')};
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(99, 102, 241, 0.12);

  svg {
    width: ${({ $size }) => ($size === 'wide' ? '18px' : '16px')};
    height: ${({ $size }) => ($size === 'wide' ? '18px' : '16px')};
    color: ${({ theme }) => theme.colors.accent};
    fill: ${({ theme }) => theme.colors.accent};
  }
`;

const ProLabel = styled.div<{ $size?: PlanUsageSize }>`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  letter-spacing: -0.01em;
  line-height: 1.2;

  strong {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.brand.indigoDark};
  }
`;

/* Inline variant — no card surface, no ring, no button. Used on mobile
   where space is precious and the ring + label + button stack reads as
   too heavy for what is just a secondary status signal. Renders as a
   single text line, tone shifts with usage:
     • Free, plenty (≥2 left):  "Free plan · 2 left"        — green tone
     • Free, low (1 left):      "Free plan · 1 left"        — amber/warning tone
     • Free, at limit:          "You've reached your limit · Upgrade to add more →" — accent, clickable
     • Pro:                     "Peachy Pro"                — neutral

   The tone gradient (green → amber → accent) gives the indicator more
   visual weight without bringing back the card surface — per "хочу чуть
   более акцентную эту штуку" (c_2026-04-29). */
type InlineTone = 'success' | 'warning' | 'accent' | 'info' | 'neutral';

const toneColor = (tone: InlineTone, theme: ReturnType<typeof useTheme>) => {
  switch (tone) {
    case 'success': return theme.colors.success.fg;
    case 'warning': return theme.colors.warning.text;
    case 'accent':  return theme.colors.accent;
    /* `info` = brand.indigoDark. Used for the Free-plan inline status
       on mobile — deeper indigo than `accent` so it stands out without
       reading as alarm; sits in the same brand family as the at-limit
       accent CTA so the indicator feels coherent across states.
       Iterated through state.active blue (didn't fit) per "голубой не
       нравится" (c_2026-04-29). */
    case 'info':    return theme.colors.brand.indigoDark;
    case 'neutral':
    default:        return theme.colors.text.tertiary;
  }
};

const InlineText = styled.span<{ $tone: InlineTone; $clickable?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  letter-spacing: -0.01em;
  line-height: 1.3;
  color: ${({ $tone, theme }) => toneColor($tone, theme)};
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};

  strong {
    font-weight: 600;
    /* Brand-accentuated label — picks up the tone color on success/
       warning/accent so "Free plan" / "You've reached your limit" reads
       as the headline of the inline status. Pro/neutral falls back to
       text.primary so it still reads as a label, not a tone. */
    color: ${({ $tone, theme }) =>
      $tone === 'neutral' ? theme.colors.text.primary : toneColor($tone, theme)};
  }

  ${({ $clickable, theme }) =>
    $clickable &&
    `
    &:hover {
      color: ${theme.colors.brand.indigoDark};
      strong { color: ${theme.colors.brand.indigoDark}; }
    }
  `}
`;

interface UsageRingProps {
  used: number;
  limit: number;
  size?: number;
  stroke?: number;
  showCount?: boolean;
}

const UsageRing: React.FC<UsageRingProps> = ({
  used,
  limit,
  size = 40,
  stroke = 3.5,
  showCount = true,
}) => {
  const theme = useTheme();
  const r = (size - stroke) / 2;
  const c = size / 2;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(used / limit, 1);
  const overLimit = used >= limit;
  // Under limit: green `success.fg` arc on a faint green track.
  // At limit: full ring filled in `danger.soft` (salmon) — track + arc same.
  const activeColor = overLimit ? theme.colors.danger.soft : theme.colors.success.fg;
  const trackColor = overLimit ? theme.colors.danger.soft : 'rgba(34, 197, 94, 0.16)';

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={c} cy={c} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke={activeColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${pct * circumference} ${circumference}`}
          style={{ transition: 'stroke-dasharray 0.3s' }}
        />
      </svg>
      {showCount && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size <= 28 ? 11 : 14,
            fontWeight: 600,
            color: overLimit ? theme.colors.danger.soft : theme.colors.text.body,
            letterSpacing: '-0.02em',
          }}
        >
          {used}
        </div>
      )}
    </div>
  );
};

export const PlanUsageCard: React.FC<PlanUsageCardProps> = ({
  mode,
  used = 0,
  limit = 3,
  $size = 'wide',
  onUpgrade,
  onManage,
}) => {
  /* Inline — text-only rendering for mobile slots where the card
     surface is too bulky. No ring, no button surface, just a single
     line that conveys plan + usage state.

     Tone hierarchy is brand-only — green/amber felt off-style and
     read as "alarm" on this surface (per "красный не в тему вообще
     тревогу дает", c_2026-04-29). Two states only:
       • Free, any room left → neutral (calm status line)
       • Free, at limit       → accent indigo + clickable (upgrade CTA)
       • Pro                  → accent indigo (brand mark) */
  if ($size === 'inline') {
    if (mode === 'pro') {
      return (
        <InlineText $tone="accent">
          <strong>Peachy Pro</strong>
        </InlineText>
      );
    }
    const atLimit = used >= limit;
    if (atLimit) {
      return (
        <InlineText $tone="accent" $clickable={!!onUpgrade} onClick={onUpgrade}>
          <strong>You've reached your limit</strong>
          <span aria-hidden="true">·</span>
          <span>Upgrade to add more →</span>
        </InlineText>
      );
    }
    const left = Math.max(limit - used, 0);
    return (
      <InlineText $tone="info">
        <strong>Free plan</strong>
        <span aria-hidden="true">·</span>
        <span>{left} {left === 1 ? 'widget' : 'widgets'} left</span>
      </InlineText>
    );
  }

  if (mode === 'pro') {
    return (
      <Wrap $size={$size} $pro>
        <ProBubble $size={$size}>
          <Sparkle fill="currentColor" strokeWidth={1.5} />
        </ProBubble>
        {$size === 'wide' ? (
          <Label>
            <Eyebrow>Plan</Eyebrow>
            <ProLabel $size={$size}><strong>Peachy Pro</strong></ProLabel>
          </Label>
        ) : (
          <ProLabel $size={$size}><strong>Peachy Pro</strong></ProLabel>
        )}
      </Wrap>
    );
  }

  if ($size === 'compact') {
    // Compact stays as a single inline row — no eyebrow stack.
    return (
      <Wrap $size={$size}>
        <UsageRing used={used} limit={limit} size={24} stroke={3} showCount={false} />
        <Usage>
          <strong>{used}</strong>/{limit}
        </Usage>
        <Button type="button" $variant="accent" $size="sm" onClick={onUpgrade}>
          Upgrade now
        </Button>
      </Wrap>
    );
  }

  const atLimit = used >= limit;

  return (
    <Wrap $size={$size}>
      <UsageRing used={used} limit={limit} size={40} stroke={3.5} />
      <Label>
        <Eyebrow $atLimit={atLimit}>{atLimit ? 'Limit reached' : 'Widgets'}</Eyebrow>
        <Usage>
          <strong>{used}</strong> of {limit} used
        </Usage>
      </Label>
      {onUpgrade && (
        <Button type="button" $variant="accent" $size="md" onClick={onUpgrade} style={{ marginLeft: 'auto' }}>
          Upgrade now
        </Button>
      )}
    </Wrap>
  );
};
