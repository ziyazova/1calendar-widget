import React from 'react';
import styled from 'styled-components';
import { Sparkles } from 'lucide-react';
import { Button } from './Button';

export type PlanUsageMode = 'free' | 'pro';
export type PlanUsageSize = 'wide' | 'compact';

interface PlanUsageCardProps {
  mode: PlanUsageMode;
  used?: number;
  limit?: number;
  $size?: PlanUsageSize;
  onUpgrade?: () => void;
  onManage?: () => void;
}

const Wrap = styled.div<{ $size: PlanUsageSize }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ $size }) => ($size === 'wide' ? '16px' : '10px')};
  padding: ${({ $size }) => ($size === 'wide' ? '10px 10px 10px 16px' : '0')};
  background: ${({ $size, theme }) => ($size === 'wide' ? theme.colors.background.surfaceAlt : 'transparent')};
  border: ${({ $size, theme }) => ($size === 'wide' ? `1px solid ${theme.colors.border.light}` : 'none')};
  border-radius: ${({ $size, theme }) => ($size === 'wide' ? theme.radii.lg : 'auto')};
`;

const Count = styled.div<{ $size: PlanUsageSize }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ $size }) => ($size === 'wide' ? '13px' : '12px')};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.subtle};
  white-space: nowrap;
  letter-spacing: -0.01em;
`;

const ProRow = styled.div<{ $size: PlanUsageSize }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ $size }) => ($size === 'wide' ? '13px' : '12px')};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.brand.indigoDark};
  letter-spacing: -0.01em;

  svg {
    width: 14px;
    height: 14px;
    color: ${({ theme }) => theme.colors.brand.indigo};
    fill: ${({ theme }) => theme.colors.brand.indigo};
  }
`;

interface UsageRingProps {
  used: number;
  limit: number;
  size?: number;
  stroke?: number;
}

const UsageRing: React.FC<UsageRingProps> = ({ used, limit, size = 28, stroke = 3 }) => {
  const r = (size - stroke) / 2;
  const c = size / 2;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(used / limit, 1);
  const overLimit = used >= limit;
  // Tailwind-esque colors: over-limit → destructive-soft (peach-red), under → brand.indigo.
  // We pick from hex directly since SVG stroke can't easily consume theme tokens.
  const activeColor = overLimit ? '#F49B8B' : '#6366F1';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="#EBEBEB" strokeWidth={stroke} />
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
  if (mode === 'pro') {
    return (
      <Wrap $size={$size}>
        <ProRow $size={$size}>
          <Sparkles fill="currentColor" strokeWidth={1.5} />
          Pro plan
        </ProRow>
        {onManage && (
          <Button type="button" $variant="link" $size="sm" onClick={onManage}>
            Manage
          </Button>
        )}
      </Wrap>
    );
  }

  const label = $size === 'wide' ? `${used} of ${limit} widgets` : `${used}/${limit}`;

  return (
    <Wrap $size={$size}>
      <Count $size={$size}>
        <UsageRing used={used} limit={limit} size={$size === 'wide' ? 28 : 24} stroke={3} />
        {label}
      </Count>
      <Button type="button" $variant="accent" $size="sm" onClick={onUpgrade}>
        Upgrade now
      </Button>
    </Wrap>
  );
};
