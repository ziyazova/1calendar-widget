import React, { useState } from 'react';
import styled from 'styled-components';

/* ── Feature Cards (stacked) ── */
const FeatureCardsSectionWrap = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px 40px;

  @media (max-width: 768px) {
    padding: 0 24px 60px;
  }
`;

const FeatureStack = styled.div`
  position: relative;
  height: 810px;

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

const FeatureCard = styled.div<{ $active: boolean; $index: number; $total: number; $activeIdx: number }>`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: ${({ theme }) => theme.radii['2xl']};
  overflow: hidden;
  border: none;
  box-shadow: ${({ $index, $activeIdx, $total }) => {
    const behind = ($index - $activeIdx + $total) % $total;
    return behind === 0
      ? '0 20px 56px rgba(0, 0, 0, 0.16), 0 6px 16px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.06)'
      : '0 14px 44px rgba(0, 0, 0, 0.13), 0 4px 14px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.05)';
  }};
  cursor: pointer;
  position: absolute;
  left: 0;
  right: 0;
  height: 644px;
  z-index: ${({ $index, $activeIdx, $total }) => {
    // circular distance behind active
    const behind = ($index - $activeIdx + $total) % $total;
    return behind === 0 ? $total + 1 : $total - behind;
  }};
  top: ${({ $index, $activeIdx, $total }) => {
    const behind = ($index - $activeIdx + $total) % $total;
    const base = ($total - 1) * 52;
    return `${base - behind * 52}px`;
  }};
  transform: ${({ $index, $activeIdx, $total }) => {
    const behind = ($index - $activeIdx + $total) % $total;
    if (behind === 0) return 'scale(1)';
    const scaleVal = 1 - behind * 0.04;
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
    return behind === 0 ? 1 : 1 - behind * 0.06;
  }};
  transition: top 0.5s cubic-bezier(0.22, 1, 0.36, 1), transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1), margin 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;

  &:hover {
    opacity: 1;
    box-shadow: ${({ $index, $activeIdx, $total }) => {
      const behind = ($index - $activeIdx + $total) % $total;
      return behind === 0 ? '0 24px 64px rgba(0, 0, 0, 0.18), 0 6px 16px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.06)' : '0 18px 48px rgba(0, 0, 0, 0.14), 0 4px 12px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.05)';
    }};
    top: ${({ $index, $activeIdx, $total }) => {
      const behind = ($index - $activeIdx + $total) % $total;
      const base = ($total - 1) * 52;
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
  padding: 10px 16px;
  background: ${({ $color, $intensity = 0.05 }) => {
    const hex = $color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${$intensity * 0.5})`;
  }};
  backdrop-filter: blur(12px) saturate(160%);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  border-bottom: 1px solid ${({ $color, $intensity = 0.05 }) => {
    const hex = $color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${$intensity * 0.4})`;
  }};
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.muted};
`;

const FeatureTabIcon = styled.span`
  font-size: 16px;
`;

const FeatureTabTitle = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  letter-spacing: -0.01em;
`;

const FeatureTabActions = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: 14px;
`;

const FeatureCardBody = styled.div`
  display: flex;
  align-items: center;
  gap: 36px;
  padding: 28px 40px 0;
  flex: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 24px 28px;
    gap: 24px;
  }
`;

const FeatureCardText = styled.div`
  flex: 0 0 40%;
`;

const FeatureCardTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  margin: 0 0 12px;
  line-height: 1.3;
`;

const FeatureCardDesc = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  margin: 0;
  letter-spacing: -0.01em;
`;

const FeatureCardImage = styled.div`
  flex: 1;
  min-width: 0;
  align-self: stretch;
  margin: 28px 40px 40px 20px;
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.03);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    margin: 0 20px 20px;
    min-height: 180px;
  }
`;

const FEATURE_CARDS = [
  {
    tab: 'Design',
    icon: '\u{1F3A8}',
    color: '#F59E0B',
    title: 'Pixel-perfect design',
    desc: 'Every widget is crafted with Apple-level attention to detail. Clean typography, balanced spacing, and premium color palettes.',
    image: '/widget-calendar.png',
  },
  {
    tab: 'Embed',
    icon: '\u{1F517}',
    color: '#3B82F6',
    title: 'One-click embed',
    desc: 'Copy the URL, paste into Notion. No accounts, no databases, no tracking. Everything is encoded in the URL.',
    image: '/template-main.png',
  },
  {
    tab: 'Themes',
    icon: '\u{1F319}',
    color: '#8B5CF6',
    title: 'Dark mode that just works',
    desc: 'Auto theme detection means your widgets adapt to Notion\'s light and dark mode seamlessly. No manual switching.',
    image: '/widget-clock2.png',
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
            onClick={() => setActiveFeature(i === activeFeature ? (i + 1) % FEATURE_CARDS.length : i)}
          >
            <FeatureCardTab $color={f.color} $intensity={i === activeFeature ? 0.48 : 0.32} data-ux="Feature Card Tab">
              <FeatureTabIcon>{f.icon}</FeatureTabIcon>
              <FeatureTabTitle>{f.tab}</FeatureTabTitle>
              <FeatureTabActions>{'\u22EF'}</FeatureTabActions>
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
