import styled from 'styled-components';
import { Sparkles, ArrowRight } from 'lucide-react';
import { PlanRing } from './PlanRing';

/**
 * PlanUpgradeBar — compact "X of Y widgets used · Upgrade" row.
 * Lives in the Studio sidebar / My Widgets header.
 *
 * Three modes:
 *   free     — shows usage ring + upgrade CTA (if over threshold)
 *   pro      — shows Pro badge + "Manage plan" link
 *   guest    — shows "Sign in to save" CTA
 */

interface PlanUpgradeBarProps {
  mode: 'free' | 'pro' | 'guest';
  used?: number;
  limit?: number;
  onUpgrade?: () => void;
  onSignIn?: () => void;
  onManage?: () => void;
}

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: 12px;
`;

const Meta = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Label = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.body};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const Value = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.01em;
`;

const CTA = styled.button`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 30px;
  padding: 0 12px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.gradients.indigo};
  color: ${({ theme }) => theme.colors.text.inverse};
  border: none;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.colors.accentShadow.sm};
  transition: filter 0.15s ease, transform 0.15s ease;

  &:hover {
    filter: brightness(1.05);
  }
  &:active {
    transform: scale(0.97);
  }
`;

const GhostLink = styled.button`
  flex-shrink: 0;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text.body};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 8px;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.interactive.hover};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export function PlanUpgradeBar({
  mode,
  used = 0,
  limit = 3,
  onUpgrade,
  onSignIn,
  onManage,
}: PlanUpgradeBarProps) {
  if (mode === 'pro') {
    return (
      <Wrap>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #6366F1, #818CF8)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            flexShrink: 0,
          }}
        >
          <Sparkles size={16} />
        </div>
        <Meta>
          <Label>Plan</Label>
          <Value>Peachy Pro</Value>
        </Meta>
        <GhostLink onClick={onManage}>Manage</GhostLink>
      </Wrap>
    );
  }

  if (mode === 'guest') {
    return (
      <Wrap>
        <Meta>
          <Label>Guest session</Label>
          <Value>Sign in to save widgets</Value>
        </Meta>
        <CTA onClick={onSignIn}>
          Sign in <ArrowRight size={12} />
        </CTA>
      </Wrap>
    );
  }

  // free
  const percent = Math.min(100, (used / limit) * 100);
  return (
    <Wrap>
      <PlanRing percent={percent} size="sm">
        {used}
      </PlanRing>
      <Meta>
        <Label>Widgets</Label>
        <Value>
          {used} of {limit} used
        </Value>
      </Meta>
      <CTA onClick={onUpgrade}>
        <Sparkles size={12} /> Upgrade
      </CTA>
    </Wrap>
  );
}
