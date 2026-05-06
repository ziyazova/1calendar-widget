import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Cat } from 'lucide-react';
import { BRAND_DOMAIN } from '../../../config/brand';

/**
 * Placeholder shown by embed pages when the public_id lookup returns
 * not_found — i.e. the owner deleted or paused the widget. Designed to be
 * neutral (no error iconography, no red), so a viewer who didn't create the
 * widget doesn't think Notion or the platform is broken.
 *
 * Cute kitten softens the empty state; hostname strapline is sourced from
 * BRAND_DOMAIN so renaming the site only requires editing one env var.
 */

const wiggle = keyframes`
  0%, 100% { transform: translateY(0) rotate(-4deg); }
  50%      { transform: translateY(-3px) rotate(4deg); }
`;

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  color: #6b7280;
  text-align: center;
  background: transparent;
`;

const Kitten = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #f4a78b;
  animation: ${wiggle} 2.4s ease-in-out infinite;
  transform-origin: 50% 80%;
`;

const Title = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #4b5563;
`;

const Host = styled.div`
  font-size: 12px;
  color: #9ca3af;
  letter-spacing: 0.02em;
`;

export const WidgetUnavailable: React.FC = () => (
  <Wrap>
    <Kitten>
      <Cat size={48} strokeWidth={1.5} />
    </Kitten>
    <Title>Widget unavailable</Title>
    <Host>{BRAND_DOMAIN}</Host>
  </Wrap>
);
