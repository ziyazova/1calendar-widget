import React from 'react';
import styled from 'styled-components';
import { scrollUp } from '@/presentation/themes/animations';

/* ── Testimonials data ── */
const testimonials = {
  col1: [
    { name: 'Anna', initials: 'A', color: '#C4B5FD', text: 'Finally a widget tool that doesn\'t look like it\'s from 2015. The calendar fits perfectly into my Notion setup — clean, minimal, and actually aesthetic.' },
    { name: 'James', initials: 'J', color: '#93C5FD', text: 'We embed Peachy calendars across all our team dashboards in Notion. The dark mode support is flawless and it just works.' },
    { name: 'Sofia', initials: 'S', color: '#F9A8D4', text: 'I use the clock widget in my streaming setup and the calendar in my content planner. Both look premium and load instantly.' },
    { name: 'David', initials: 'D', color: '#6EE7B7', text: 'Replaced three different widget tools with Peachy. One studio for everything — calendars, clocks, all customizable. And it\'s free?' },
    { name: 'Lena', initials: 'L', color: '#FCD34D', text: 'The attention to typography and spacing is rare for a free tool. You can tell someone who cares about design built this.' },
  ],
  col2: [
    { name: 'Marcus', initials: 'M', color: '#DDD6FE', text: 'The Life OS template saved me an entire weekend of setup. Combined with Peachy widgets, my Notion workspace finally feels complete.' },
    { name: 'Yuki', initials: 'Y', color: '#A5F3FC', text: 'Our whole team switched to Peachy calendars in Notion. The embed URL system is brilliant — just paste and it works. No auth, no fuss.' },
    { name: 'Rachel', initials: 'R', color: '#FCA5A5', text: 'I\'ve tried every Notion widget out there. Peachy is the only one that matches the quality of my workspace design. Highly recommend.' },
    { name: 'Alex', initials: 'A', color: '#99F6E4', text: 'The student planner template + calendar widget combo is perfect. I can see my whole semester at a glance right in Notion.' },
    { name: 'Emma', initials: 'E', color: '#E9D5FF', text: 'Clean design, instant setup, zero maintenance. Exactly what our marketing team needed for our Notion dashboards.' },
  ],
  col3: [
    { name: 'Nina', initials: 'N', color: '#BAE6FD', text: 'We actually use Peachy widgets internally. The auto theme detection means they look great in both light and dark mode automatically.' },
    { name: 'Tom', initials: 'T', color: '#F5D0FE', text: 'The design language is Apple-level clean. Border radius, typography, color palette — everything is considered. Beautiful work.' },
    { name: 'Lisa', initials: 'L', color: '#FED7AA', text: 'I recommend Peachy to all my clients. The templates are thoughtfully structured and the widgets add that extra polish to any workspace.' },
    { name: 'Chris', initials: 'C', color: '#BBF7D0', text: 'We evaluated several widget solutions. Peachy won on design quality alone. The fact that it\'s free makes it an absolute no-brainer.' },
  ],
};

type Testimonial = typeof testimonials.col1[number];

/* ── Styled Components ── */

const Section = styled.section`
  background: transparent;
  padding: 0;
  overflow: hidden;
  position: relative;
`;

const Title = styled.h2`
  font-size: 36px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  text-align: center;
  margin: 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 28px;
    padding: 0 24px;
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  margin: 8px 0 100px;
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    margin: -20px 0 36px;
    padding: 0 24px;
  }
`;

const MarqueeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 80px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    padding: 0 36px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 0 24px;
  }
`;

const MarqueeColumn = styled.div`
  overflow: hidden;
  height: 600px;
  mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);

  @media (max-width: 1024px) {
    &:nth-child(3) {
      display: none;
    }
  }

  @media (max-width: 768px) {
    height: 400px;

    &:nth-child(n+2) {
      display: none;
    }
  }
`;

const MarqueeInner = styled.div<{ $duration: number; $reverse?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: ${scrollUp} ${({ $duration }) => $duration}s linear infinite;
  animation-direction: ${({ $reverse }) => $reverse ? 'reverse' : 'normal'};

  &:hover {
    animation-play-state: paused;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 24px;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
`;

const Stars = styled.div`
  display: flex;
  gap: 3px;
  margin-bottom: 14px;
  color: #F5A623;
  font-size: 12px;
`;

const Text = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.65;
  margin: 0 0 20px;
  letter-spacing: -0.01em;
  flex: 1;
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border.light};
  margin-bottom: 16px;
`;

const Author = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.div<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.5);
  flex-shrink: 0;
`;

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.01em;
`;

const Role = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

/* ── Star Icon ── */
const StarIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.5c.4 0 .8.2 1 .6l2.4 5 5.4.8c.5.1.9.4 1 .9.2.4 0 .9-.3 1.2l-3.9 3.8.9 5.4c.1.5-.1 1-.5 1.2-.4.3-.9.3-1.3.1L12 18.8l-4.7 2.7c-.4.2-.9.2-1.3-.1-.4-.3-.6-.7-.5-1.2l.9-5.4L2.5 11c-.3-.3-.5-.8-.3-1.2.2-.5.5-.8 1-.9l5.4-.8 2.4-5c.2-.4.6-.6 1-.6z" />
  </svg>
);

/* ── Testimonial Column ── */
const TestimonialColumn: React.FC<{
  items: Testimonial[];
  columnKey: string;
  duration: number;
  reverse?: boolean;
}> = ({ items, columnKey, duration, reverse }) => (
  <MarqueeColumn>
    <MarqueeInner $duration={duration} $reverse={reverse}>
      {[...items, ...items].map((t, i) => (
        <Card key={`${columnKey}-${i}`}>
          <Stars>
            {[...Array(5)].map((_, s) => <StarIcon key={s} />)}
          </Stars>
          <Text>{t.text}</Text>
          <Divider />
          <Author>
            <Avatar $color={t.color}>{t.initials}</Avatar>
            <Name>{t.name}</Name>
          </Author>
        </Card>
      ))}
    </MarqueeInner>
  </MarqueeColumn>
);

/* ── Exported Component ── */
export const TestimonialsSection: React.FC = () => (
  <Section data-ux="Testimonials Section">
    <Title>Loved by 10,000+ users</Title>
    <Subtitle>See what people are saying about Peachy</Subtitle>
    <MarqueeContainer>
      <TestimonialColumn items={testimonials.col1} columnKey="c1" duration={35} />
      <TestimonialColumn items={testimonials.col2} columnKey="c2" duration={40} reverse />
      <TestimonialColumn items={testimonials.col3} columnKey="c3" duration={45} />
    </MarqueeContainer>
  </Section>
);
