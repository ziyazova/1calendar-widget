import React from 'react';
import styled from 'styled-components';
import { Search, CreditCard, Copy, Palette, SlidersHorizontal, Code } from 'lucide-react';

const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 48px 80px;

  @media (max-width: 768px) {
    padding: 48px 24px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 36px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  margin: 0 0 24px;
`;

const SectionSubtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 8px 0 24px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

const Card = styled.div<{ $bg: string }>`
  background: ${({ $bg }) => $bg};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1.5px solid rgba(200, 195, 230, 0.3);
  border-radius: 20px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 220px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.03);

  @media (max-width: 768px) {
    padding: 22px 18px;
    min-height: 150px;
  }
`;

const IconWrap = styled.div<{ $bg: string; $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;

  svg {
    width: 22px;
    height: 22px;
    color: ${({ $color }) => $color};
    stroke-width: 1.8;
  }
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
  margin: 0 0 8px;
`;

const CardDesc = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  margin: 0;
  max-width: 240px;
`;

const TEMPLATE_STEPS = [
  { icon: Search, bg: 'linear-gradient(135deg, rgba(237,228,255,0.5) 0%, rgba(232,237,255,0.4) 50%, rgba(245,235,250,0.45) 100%)', iconBg: 'rgba(255,255,255,0.8)', iconColor: '#1F1F1F', title: 'Pick your template', desc: 'Browse the collection. Find the one that fits your life.' },
  { icon: CreditCard, bg: 'linear-gradient(135deg, rgba(232,237,255,0.5) 0%, rgba(237,228,255,0.4) 50%, rgba(252,228,236,0.45) 100%)', iconBg: 'rgba(255,255,255,0.8)', iconColor: '#1F1F1F', title: 'Buy & download', desc: 'One-time payment. Files arrive instantly.' },
  { icon: Copy, bg: 'linear-gradient(135deg, rgba(252,228,236,0.45) 0%, rgba(232,237,255,0.4) 50%, rgba(237,228,255,0.5) 100%)', iconBg: 'rgba(255,255,255,0.8)', iconColor: '#1F1F1F', title: 'Duplicate to Notion', desc: 'One click. It\'s in your workspace. Ready to use.' },
];

const WIDGET_STEPS = [
  { icon: Palette, bg: 'linear-gradient(135deg, rgba(237,228,255,0.5) 0%, rgba(232,237,255,0.4) 50%, rgba(245,235,250,0.45) 100%)', iconBg: 'rgba(255,255,255,0.8)', iconColor: '#1F1F1F', title: 'Pick a widget', desc: 'Calendar, clock, or board. Choose your style.' },
  { icon: SlidersHorizontal, bg: 'linear-gradient(135deg, rgba(232,237,255,0.5) 0%, rgba(237,228,255,0.4) 50%, rgba(252,228,236,0.45) 100%)', iconBg: 'rgba(255,255,255,0.8)', iconColor: '#1F1F1F', title: 'Customize it', desc: 'Colors, fonts, sizes. Make it match your workspace.' },
  { icon: Code, bg: 'linear-gradient(135deg, rgba(252,228,236,0.45) 0%, rgba(232,237,255,0.4) 50%, rgba(237,228,255,0.5) 100%)', iconBg: 'rgba(255,255,255,0.8)', iconColor: '#1F1F1F', title: 'Embed in Notion', desc: 'Copy the link. Paste in Notion. Done.' },
];

interface HowItWorksProps {
  showTitle?: boolean;
  variant?: 'templates' | 'widgets';
}

export const HowItWorksSection: React.FC<HowItWorksProps> = ({ showTitle = true, variant = 'templates' }) => {
  const steps = variant === 'widgets' ? WIDGET_STEPS : TEMPLATE_STEPS;
  return (
  <Section data-ux="How It Works">
    {showTitle && (
      <>
        <SectionTitle>How it works</SectionTitle>
        {/* subtitle removed */}
      </>
    )}
    <Grid>
      {steps.map(s => (
        <Card key={s.title} $bg={s.bg}>
          <IconWrap $bg={s.iconBg} $color={s.iconColor}><s.icon /></IconWrap>
          <div>
            <CardTitle>{s.title}</CardTitle>
            <CardDesc>{s.desc}</CardDesc>
          </div>
        </Card>
      ))}
    </Grid>
  </Section>
  );
};
