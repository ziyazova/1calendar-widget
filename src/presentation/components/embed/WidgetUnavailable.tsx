import React from 'react';
import styled from 'styled-components';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import catAnimation from '../../assets/cat-unavailable.lottie?url';
import { BRAND_DOMAIN } from '../../../config/brand';

/**
 * Placeholder shown by embed pages when the public_id lookup returns
 * not_found — i.e. the owner deleted or paused the widget. Designed to be
 * neutral (no error iconography, no red), so a viewer who didn't create the
 * widget doesn't think Notion or the platform is broken.
 *
 * The kitten is a dotLottie animation imported via Vite's ?url suffix —
 * the runtime fetches the .lottie binary and DotLottieReact plays it on
 * loop. Hostname strapline is sourced from BRAND_DOMAIN so renaming the
 * site only requires editing one env var.
 */

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  color: #6b7280;
  text-align: center;
  background: transparent;
`;

const KittenStage = styled.div`
  width: 140px;
  height: 140px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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
    <KittenStage>
      <DotLottieReact
        src={catAnimation}
        loop
        autoplay
        style={{ width: '100%', height: '100%' }}
      />
    </KittenStage>
    <Title>Widget unavailable</Title>
    <Host>{BRAND_DOMAIN}</Host>
  </Wrap>
);
