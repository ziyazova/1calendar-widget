import React, { useState } from 'react';
import styled from 'styled-components';

/* ── Feature Cards (stacked) ── */
const FeatureCardsSectionWrap = styled.section`
  max-width: 940px;
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: 768px) {
    padding: 0 24px;
  }
`;

const FeatureStack = styled.div`
  position: relative;
  height: 624px;

  @media (max-width: 768px) {
    height: auto;
    display: flex;
    gap: 16px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 8px;

    &::-webkit-scrollbar { display: none; }
    scrollbar-width: none;

    mask-image: linear-gradient(to right, black 0%, black 90%, transparent 100%);
    -webkit-mask-image: linear-gradient(to right, black 0%, black 90%, transparent 100%);
  }
`;

const FeatureCard = styled.div<{ $active: boolean; $index: number; $total: number; $activeIdx: number; $color: string }>`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: ${({ theme }) => theme.radii['2xl']};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  box-shadow: ${({ $index, $activeIdx, $total }) => {
    const behind = ($index - $activeIdx + $total) % $total;
    return behind === 0
      ? '0 4px 24px rgba(0, 0, 0, 0.06)'
      : '0 2px 16px rgba(0, 0, 0, 0.04)';
  }};
  cursor: pointer;
  position: absolute;
  left: 0;
  right: 0;
  height: 515px;
  z-index: ${({ $index, $activeIdx, $total }) => {
    // circular distance behind active
    const behind = ($index - $activeIdx + $total) % $total;
    return behind === 0 ? $total + 1 : $total - behind;
  }};
  top: ${({ $index, $activeIdx, $total }) => {
    const behind = ($index - $activeIdx + $total) % $total;
    const base = ($total - 1) * 50;
    return `${base - behind * 50}px`;
  }};
  transform: ${({ $index, $activeIdx, $total }) => {
    const behind = ($index - $activeIdx + $total) % $total;
    if (behind === 0) return 'scale(1)';
    const scaleVal = 1 - behind * 0.03;
    return `scale(${scaleVal})`;
  }};
  margin-left: ${({ $index, $activeIdx, $total }) => {
    const behind = ($index - $activeIdx + $total) % $total;
    return `${behind * 20}px`;
  }};
  margin-right: ${({ $index, $activeIdx, $total }) => {
    const behind = ($index - $activeIdx + $total) % $total;
    return `${behind * 20}px`;
  }};
  opacity: ${({ $index, $activeIdx, $total }) => {
    const behind = ($index - $activeIdx + $total) % $total;
    return behind === 0 ? 1 : 1 - behind * 0.03;
  }};
  transition: top 0.5s cubic-bezier(0.22, 1, 0.36, 1), transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1), margin 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;

  &:hover {
    opacity: 1;
    box-shadow: ${({ $index, $activeIdx, $total }) => {
      const behind = ($index - $activeIdx + $total) % $total;
      return behind === 0 ? '0 6px 28px rgba(0, 0, 0, 0.08)' : '0 4px 20px rgba(0, 0, 0, 0.05)';
    }};
    top: ${({ $index, $activeIdx, $total }) => {
      const behind = ($index - $activeIdx + $total) % $total;
      const base = ($total - 1) * 50;
      if (behind === 0) return `${base}px`;
      return `${base - behind * 52 - 14}px`;
    }};
  }

  @media (max-width: 768px) {
    position: static;
    flex-direction: column;
    flex-shrink: 0;
    width: 85%;
    height: auto;
    padding: 0;
    gap: 0;
    transform: none !important;
    top: auto !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    opacity: 1 !important;
    scroll-snap-align: start;
    overflow: clip;
    border-radius: ${({ theme }) => theme.radii.xl};
    border: 1px solid ${({ theme }) => theme.colors.border.light};
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06) !important;
  }
`;

const FeatureCardTab = styled.div<{ $color: string; $intensity?: number }>`
  padding: 14px 20px;
  background: ${({ $color, $intensity = 0.05 }) => {
    const hex = $color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${$intensity * 0.6})`;
  }};
  border-bottom: none;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FeatureTabDot = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const FeatureTabTitle = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.01em;
`;

const FeatureTabActions = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const FeatureCardBody = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 24px 0 0 36px;
  flex: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 24px 28px;
    gap: 24px;
  }
`;

const FeatureCardText = styled.div`
  flex: 0 0 32%;
  text-align: left;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const FeatureCardTitle = styled.h3`
  font-size: 22px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  margin: 0 0 12px;
  line-height: 1.2;
`;

const FeatureCardDesc = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  line-height: 1.6;
  margin: 0;
  letter-spacing: -0.01em;
`;

const FeatureCardImage = styled.div`
  flex: 1;
  min-width: 0;
  align-self: stretch;
  margin: 20px -1px -1px 0;
  border-radius: 16px 0 0 0;
  overflow: hidden;
  border: none;
  background: ${({ theme }) => theme.colors.background.surface};
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.06);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    transform: scale(1);
  }

  @media (max-width: 768px) {
    margin: 0 20px 20px;
    min-height: 180px;
  }
`;

const WhyTitle = styled.h2`
  font-size: 36px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  margin: 0 0 32px;

  @media (max-width: 768px) {
    font-size: 28px;
    margin: 0 0 24px;
  }
`;

const FEATURE_CARDS = [
  {
    tab: 'Functionality',
    color: '#3B82F6',
    title: 'Built to work.',
    desc: 'Automations, dashboards, pre-filled sections. Plus video guides so you\'re never stuck.',
    image: '/feature-functionality.png',
  },
  {
    tab: 'Design',
    color: '#8B5CF6',
    title: 'Clean by default.',
    desc: 'Open it and it just feels right. Everything where you\'d expect it to be.',
    image: '/feature-design.png',
  },
  {
    tab: 'Payment',
    color: '#E8926A',
    title: 'Pay once. Keep forever.',
    desc: 'Buy it once and it\'s yours — come back to it whenever you need, for as long as you want.',
    image: '/feature-pricing.png',
  },
];

export const FeatureCardsSection: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <FeatureCardsSectionWrap data-ux="Feature Cards Section">
      <FeatureStack data-ux="Feature Stack">
        {FEATURE_CARDS.map((f, i) => (
          <FeatureCard
            key={i}
            $active={activeFeature === i}
            $index={i}
            $total={FEATURE_CARDS.length}
            $activeIdx={activeFeature}
            $color={f.color}
            onClick={() => setActiveFeature(i === activeFeature ? (i + 1) % FEATURE_CARDS.length : i)}
          >
            <FeatureCardTab $color={f.color} $intensity={i === activeFeature ? 0.48 : 0.32} data-ux="Feature Card Tab">
              <FeatureTabDot $color={f.color} />
              <FeatureTabTitle>{f.tab}</FeatureTabTitle>
              <FeatureTabActions>
                <FeatureTabDot $color={f.color} style={{ width: 8, height: 8, opacity: 0.4 }} />
                <FeatureTabDot $color={f.color} style={{ width: 8, height: 8, opacity: 0.4 }} />
                <FeatureTabDot $color={f.color} style={{ width: 8, height: 8, opacity: 0.4 }} />
              </FeatureTabActions>
            </FeatureCardTab>
            <FeatureCardBody data-ux="Feature Card Body">
              <FeatureCardText>
                <FeatureCardTitle>{f.title}</FeatureCardTitle>
                <FeatureCardDesc>{f.desc}</FeatureCardDesc>
              </FeatureCardText>
              <FeatureCardImage>
                <img src={f.image} alt={f.title} />
              </FeatureCardImage>
            </FeatureCardBody>
          </FeatureCard>
        ))}
      </FeatureStack>
    </FeatureCardsSectionWrap>
  );
};
