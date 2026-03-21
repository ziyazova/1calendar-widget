import React from 'react';
import styled from 'styled-components';
import { scrollUp } from '@/presentation/themes/animations';

/* ── Testimonials data ── */
const testimonials = {
  col1: [
    { name: 'Anna Kovacs', initials: 'AK', role: 'Product Designer', company: 'Figma', color: '#6366F1', text: 'Finally a widget tool that doesn\'t look like it\'s from 2015. The calendar fits perfectly into my Notion setup — clean, minimal, and actually aesthetic.' },
    { name: 'James Chen', initials: 'JC', role: 'Engineering Lead', company: 'Vercel', color: '#3B82F6', text: 'We embed Peachy calendars across all our team dashboards in Notion. The dark mode support is flawless and it just works.' },
    { name: 'Sofia Martinez', initials: 'SM', role: 'Content Creator', company: 'YouTube', color: '#EC4899', text: 'I use the clock widget in my streaming setup and the calendar in my content planner. Both look premium and load instantly.' },
    { name: 'David Park', initials: 'DP', role: 'Founder', company: 'IndieHacker', color: '#10B981', text: 'Replaced three different widget tools with Peachy. One studio for everything — calendars, clocks, all customizable. And it\'s free?' },
    { name: 'Lena Fischer', initials: 'LF', role: 'UX Researcher', company: 'Spotify', color: '#F59E0B', text: 'The attention to typography and spacing is rare for a free tool. You can tell someone who cares about design built this.' },
  ],
  col2: [
    { name: 'Marcus Thompson', initials: 'MT', role: 'Startup Founder', company: 'Arc', color: '#8B5CF6', text: 'The Life OS template saved me an entire weekend of setup. Combined with Peachy widgets, my Notion workspace finally feels complete.' },
    { name: 'Yuki Tanaka', initials: 'YT', role: 'Project Manager', company: 'Linear', color: '#06B6D4', text: 'Our whole team switched to Peachy calendars in Notion. The embed URL system is brilliant — just paste and it works. No auth, no fuss.' },
    { name: 'Rachel Kim', initials: 'RK', role: 'Freelance Designer', company: 'Dribbble', color: '#F43F5E', text: 'I\'ve tried every Notion widget out there. Peachy is the only one that matches the quality of my workspace design. Highly recommend.' },
    { name: 'Alex Rivera', initials: 'AR', role: 'Student', company: 'MIT', color: '#14B8A6', text: 'The student planner template + calendar widget combo is perfect. I can see my whole semester at a glance right in Notion.' },
    { name: 'Emma Wilson', initials: 'EW', role: 'Marketing Lead', company: 'Stripe', color: '#A855F7', text: 'Clean design, instant setup, zero maintenance. Exactly what our marketing team needed for our Notion dashboards.' },
  ],
  col3: [
    { name: 'Oliver Brown', initials: 'OB', role: 'Developer', company: 'GitHub', color: '#EF4444', text: 'As a dev, I appreciate that everything is URL-encoded — no accounts, no databases, no tracking. Pure client-side. Respect.' },
    { name: 'Nina Patel', initials: 'NP', role: 'Operations Manager', company: 'Notion', color: '#0EA5E9', text: 'We actually use Peachy widgets internally. The auto theme detection means they look great in both light and dark mode automatically.' },
    { name: 'Tom Anderson', initials: 'TA', role: 'Creative Director', company: 'Pentagram', color: '#D946EF', text: 'The design language is Apple-level clean. Border radius, typography, color palette — everything is considered. Beautiful work.' },
    { name: 'Lisa Chang', initials: 'LC', role: 'Productivity Coach', company: 'Skillshare', color: '#F97316', text: 'I recommend Peachy to all my clients. The templates are thoughtfully structured and the widgets add that extra polish to any workspace.' },
    { name: 'Chris Murphy', initials: 'CM', role: 'CEO', company: 'Calm', color: '#22C55E', text: 'We evaluated several widget solutions. Peachy won on design quality alone. The fact that it\'s free makes it an absolute no-brainer.' },
  ],
};

type Testimonial = typeof testimonials.col1[number];

/* ── Styled Components ── */

const Section = styled.section`
  background: #F0F0F0;
  padding: 80px 0;
  overflow: hidden;
  position: relative;


  @media (max-width: 768px) {
    padding: 60px 0;
  }
`;

const Title = styled.h2`
  font-size: 36px;
  font-weight: 700;
  background: linear-gradient(135deg, #6E3FF3, #3B82F6, #EC4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.03em;
  text-align: center;
  margin: 0 0 48px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 28px;
    margin: 0 0 36px;
    padding: 0 24px;
  }
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-align: center;
  margin: -32px 0 48px;
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
  padding: 0 48px;

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
  background: #ffffff;
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 24px;
  flex-shrink: 0;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
`;

const Author = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const Avatar = styled.div<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  flex-shrink: 0;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Name = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #1F1F1F;
  letter-spacing: -0.01em;
`;

const Stars = styled.div`
  display: flex;
  gap: 3px;
  margin-bottom: 12px;
  color: #F5A623;
  font-size: 12px;
`;

const Text = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  margin: 0;
  letter-spacing: -0.01em;
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
          <Author>
            <Avatar $color={t.color}>{t.initials}</Avatar>
            <Info>
              <Name>{t.name}</Name>
            </Info>
          </Author>
          <Stars>
            {[...Array(5)].map((_, s) => <StarIcon key={s} />)}
          </Stars>
          <Text>{t.text}</Text>
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
