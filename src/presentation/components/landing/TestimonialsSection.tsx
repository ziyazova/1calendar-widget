import React from 'react';
import styled from 'styled-components';
import { scrollUp } from '@/presentation/themes/animations';

/* ── Testimonials data ── */
const testimonials = {
  col1: [
    { name: 'Amber', initials: 'A', color: '#FFD9B8', text: 'This one.... THIS one is incredible. If you are someone that likes everything to have a place and home in a very organized way, where every block is even and nestled perfectly, this will be perfect for you. This shop always produces the best templates with the prettiest vibes and aesthetic. I am SOO SO SO SO SO happy.' },
    { name: 'Audrey', initials: 'A', color: '#EDE4FF', text: 'Amazing, somehow manages to do everything I\'ve been using 12 different planners for all in one. GET IT!!! Cannot recommend enough. It\'s well worth the price. I wish I\'d have saved myself some time and bought it ages ago! Easily the best I have ever come across.' },
    { name: 'Alyssa', initials: 'A', color: '#FBE9E1', text: 'An absolute game changer in my daily life.' },
    { name: 'Donna', initials: 'D', color: '#E8EDFF', text: 'This is so fantastically comprehensive and detailed, I honestly think it should cost three times as much! The amount of work that has gone into this is incredible. Also, the customer service is top notch!' },
    { name: 'Rana', initials: 'R', color: '#F3C6C6', text: 'I highly recommend this.. its sooo pretty.. fun to use.. the seller was very helpful and friendly. Most templates are boring or ugly lol hers are soo cute that it makes you want to use them. Keep up the great work!' },
  ],
  col2: [
    { name: 'Misty', initials: 'M', color: '#DDEBD4', text: 'This is everything and more! This is actually my second time purchasing from this shop. It helps me stay organized with raging ADHD. I looove how there\'s options for phone or tablet layouts. 10/10 worth every penny.' },
    { name: 'Hedge', initials: 'H', color: '#FCE3DE', text: 'This is THE BEST All in One I\'ve purchased! The pages are super detailed and the integration is mind blowing! I simply love it!! Thank you so very much for making this available for us!' },
    { name: 'Lorraine', initials: 'L', color: '#EEE4F7', text: 'SUPER CUTE!! Absolutely love it!' },
    { name: 'Evan', initials: 'E', color: '#FFE5D4', text: 'I\'ve been looking for an aesthetically pleasing and comprehensive all-in-one planner for so long, and this one is absolutely perfect for my needs! It\'s detailed without being cluttered. I would absolutely recommend this, thank you for making my life just a little bit easier!' },
    { name: 'Abby', initials: 'A', color: '#D8E6F5', text: 'I\'m obsessed with this. It is absolutely perfect. I will be using this to organize multiple aspects of my life. It is great value for the price as well!' },
  ],
  col3: [
    { name: 'jessdufour', initials: 'J', color: '#E6DDFF', text: 'The amount of time and effort that has gone into this product is blowing my mind. Every time I click somewhere and discover a new detail I am floored. It feels like no stone has been left unturned. I\'ll be buying one for my daughter for college!' },
    { name: 'Grace', initials: 'G', color: '#F8D4D4', text: 'This ticks ALL the boxes for what I was looking for. It\'s better than I could\'ve asked for to build on my own. Absolutely recommend for the organizational girlies. :)' },
    { name: 'Natasha', initials: 'N', color: '#FFEDD8', text: 'Very cute! Will def come back for more!' },
    { name: 'Alexandra', initials: 'A', color: '#E5F0D4', text: 'After 3 months of using this, I love it! It is so aesthetically pleasing, and the creator has added so many details to help the user. Thank you so much!!' },
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
  font-size: 40px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  text-align: center;
  margin: 0;
  line-height: 1.2;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.sizes['4xl']};
    padding: 0 24px;
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.peach.muted};
  text-align: center;
  margin: 8px 0 100px;
  letter-spacing: -0.01em;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 14px;
    margin: 8px 0 24px;
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

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
    padding: 0 36px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    padding: 0 24px;
  }
`;

const MarqueeColumn = styled.div`
  overflow: hidden;
  height: 600px;
  mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    &:nth-child(3) {
      display: none;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 340px;

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
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 24px;
  flex-shrink: 0;
  border: 1px solid rgba(43, 35, 32, 0.06);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.7),
    0 2px 6px rgba(43, 35, 32, 0.04),
    0 12px 28px -16px rgba(43, 35, 32, 0.1);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 16px;
  }
`;

const Stars = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 14px;
  color: #F5A623;
  font-size: 12px;
`;

const Text = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.body};
  line-height: 1.65;
  margin: 0 0 20px;
  letter-spacing: -0.01em;
  flex: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 13px;
    line-height: 1.55;
    margin: 0 0 14px;
  }
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
