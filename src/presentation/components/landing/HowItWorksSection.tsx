import React from 'react';
import styled from 'styled-components';
import { Search, CreditCard, Copy } from 'lucide-react';

const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;

  @media (max-width: 768px) {
    padding: 0 24px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 36px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  margin: 0;
`;

const SectionSubtitle = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 8px 0 24px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

const Card = styled.div<{ $accent: string }>`
  background: #FAFAFA;
  border: 1.5px solid ${({ $accent }) => {
    const hex = $accent.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.2)`;
  }};
  border-radius: 16px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 190px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04), 0 0 0 0.5px rgba(0, 0, 0, 0.02);

  @media (max-width: 768px) {
    padding: 22px 18px;
    min-height: 150px;
  }
`;

const IconCircle = styled.div<{ $bg: string; $color: string }>`
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ $bg }) => $bg};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;

  svg {
    width: 24px;
    height: 24px;
    color: ${({ $color }) => $color};
    stroke-width: 1.5;
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
`;

const STEPS = [
  { icon: Search, iconBg: '#EDE9FE', iconColor: '#7C3AED', bg: 'linear-gradient(135deg, #F5F0FF 0%, #FFF0F5 100%)', title: 'Pick your template', desc: 'Browse the collection. Find the one that fits your life.' },
  { icon: CreditCard, iconBg: '#DBEAFE', iconColor: '#2563EB', bg: 'linear-gradient(135deg, #F0F4FF 0%, #F5F0FF 100%)', title: 'Buy & download', desc: 'One-time payment. Your files arrive instantly.' },
  { icon: Copy, iconBg: '#D1FAE5', iconColor: '#059669', bg: 'linear-gradient(135deg, #F0FFF5 0%, #F0F9FF 100%)', title: 'Duplicate to Notion', desc: 'One click. It\'s in your workspace. Ready to use.' },
];

export const HowItWorksSection: React.FC = () => (
  <Section data-ux="How It Works">
    <SectionTitle>How it works</SectionTitle>
    <SectionSubtitle>Three steps. No learning curve.</SectionSubtitle>
    <Grid>
      {STEPS.map(s => (
        <Card key={s.title} $accent={s.iconColor}>
          <IconCircle $bg={s.iconBg} $color={s.iconColor}><s.icon /></IconCircle>
          <div>
            <CardTitle>{s.title}</CardTitle>
            <CardDesc>{s.desc}</CardDesc>
          </div>
        </Card>
      ))}
    </Grid>
  </Section>
);
