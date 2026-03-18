import React, { useState, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { ArrowRight, ArrowLeft, Calendar, Clock, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div<{ $transitioning?: boolean }>`
  min-height: 100vh;
  background: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const PageContent = styled.div<{ $hide?: boolean }>`
  opacity: ${({ $hide }) => $hide ? 0 : 1};
  transition: opacity 0.3s ease;
  pointer-events: ${({ $hide }) => $hide ? 'none' : 'auto'};
`;

const HeroContent = styled.div<{ $hide?: boolean }>`
  opacity: ${({ $hide }) => $hide ? 0 : 1};
  transition: opacity 0.25s ease;
`;

const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 48px 0;
  animation: ${fadeUp} 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (max-width: 768px) { padding: 32px 24px 0; }
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 400;
  color: #9A9A9A;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  margin-bottom: 16px;
  transition: color 0.15s ease;
  &:hover { color: #1F1F1F; }
  svg { width: 13px; height: 13px; }
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: #1F1F1F;
  letter-spacing: -0.03em;
  margin: 0 0 6px;
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: #9A9A9A;
  margin: 0 0 48px;
  letter-spacing: -0.01em;
  max-width: 460px;
`;

/* ── Hero Card ── */
const HeroCard = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px 56px;
  animation: ${fadeUp} 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;

  @media (max-width: 768px) { padding: 0 24px 40px; }
`;

const HeroInner = styled.div<{ $expanding?: boolean }>`
  border-radius: 28px;
  padding: 64px 48px;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(51, 132, 244, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 60% 80%, rgba(236, 72, 153, 0.05) 0%, transparent 50%),
    #F8F8F7;
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  transform: ${({ $expanding }) => $expanding ? 'scale(0.97)' : 'scale(1)'};
  opacity: ${({ $expanding }) => $expanding ? 0 : 1};

  &:hover {
    transform: ${({ $expanding }) => $expanding ? 'scale(0.97)' : 'translateY(-3px)'};
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.04);
    border-color: rgba(51, 132, 244, 0.08);
  }

  @media (max-width: 768px) {
    padding: 40px 24px;
    border-radius: 20px;
  }
`;

const HeroIcons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 28px;
`;

const HeroIcon = styled.div<{ $delay: string }>`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeUp} 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${({ $delay }) => $delay} both;

  svg { width: 22px; height: 22px; color: #6B6B6B; }
`;

const HeroTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: #1F1F1F;
  letter-spacing: -0.03em;
  margin: 0 0 10px;
`;

const HeroDesc = styled.p`
  font-size: 15px;
  color: #9A9A9A;
  line-height: 1.6;
  margin: 0 auto 28px;
  letter-spacing: -0.01em;
  max-width: 380px;
`;

const HeroButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 28px;
  background: #1F1F1F;
  color: #ffffff;
  border: none;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.01em;
  transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    background: #3384F4;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(51, 132, 244, 0.2);
  }

  svg { width: 15px; height: 15px; }
`;

/* ── Widgets Grid ── */
const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px 80px;
  animation: ${fadeUp} 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;

  @media (max-width: 768px) { padding: 0 24px 60px; }
`;

const SectionTitle = styled.h2`
  font-size: 11px;
  font-weight: 600;
  color: #ABABAB;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  margin: 0 0 20px;
`;

const WidgetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const WidgetCard = styled.div`
  background: #F8F8F7;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(51, 132, 244, 0.1);
  }
`;

const WidgetPreview = styled.div<{ $gradient: string }>`
  height: 180px;
  background: ${({ $gradient }) => $gradient};
  display: flex;
  align-items: center;
  justify-content: center;

  svg { width: 40px; height: 40px; color: rgba(0, 0, 0, 0.15); }
`;

const WidgetBody = styled.div`
  padding: 20px;
`;

const WidgetName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1F1F1F;
  letter-spacing: -0.02em;
  margin: 0 0 4px;
`;

const WidgetDesc = styled.p`
  font-size: 13px;
  color: #9A9A9A;
  line-height: 1.5;
  margin: 0 0 16px;
  letter-spacing: -0.01em;
`;

const WidgetStyles = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const StyleTag = styled.span`
  padding: 3px 10px;
  background: rgba(0, 0, 0, 0.04);
  color: #6B6B6B;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: -0.01em;
`;

/* ── Features ── */
const Features = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 48px 80px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  animation: ${fadeUp} 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;

  @media (max-width: 768px) { padding: 32px 24px 60px; }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
`;

const FeatureItem = styled.div``;

const FeatureTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #1F1F1F;
  margin: 0 0 4px;
  letter-spacing: -0.02em;
`;

const FeatureDesc = styled.p`
  font-size: 12px;
  color: #9A9A9A;
  line-height: 1.5;
  margin: 0;
  letter-spacing: -0.01em;
`;

/* ── Footer ── */
const Footer = styled.footer`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 48px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FooterText = styled.span`
  font-size: 12px;
  color: #ABABAB;
  letter-spacing: -0.01em;
`;

export const WidgetStudioPage: React.FC = () => {
  const navigate = useNavigate();
  const [expanding, setExpanding] = useState(false);

  const handleLaunch = useCallback(() => {
    setExpanding(true);
    setTimeout(() => navigate('/studio'), 450);
  }, [navigate]);

  return (
    <Page>
      <TopNav activeLink="studio" />
      <PageContent $hide={expanding}>
        <Header>
          <BackButton onClick={() => navigate('/')}>
            <ArrowLeft /> Home
          </BackButton>
          <Title>Widget Studio</Title>
          <Subtitle>
            Create beautiful, customizable widgets for your Notion workspace. No code required.
          </Subtitle>
        </Header>
      </PageContent>

      <HeroCard>
        <HeroInner $expanding={expanding} onClick={handleLaunch}>
          <HeroIcons>
            <HeroIcon $delay="0.15s"><Calendar /></HeroIcon>
            <HeroIcon $delay="0.25s"><Clock /></HeroIcon>
            <HeroIcon $delay="0.35s"><Image /></HeroIcon>
          </HeroIcons>
          <HeroTitle>Your workspace, your style</HeroTitle>
          <HeroDesc>
            Pick a widget, customize everything, embed in Notion with one click.
          </HeroDesc>
          <HeroButton>
            Launch Studio <ArrowRight />
          </HeroButton>
        </HeroInner>
      </HeroCard>

      <PageContent $hide={expanding}>
      <Section>
        <SectionTitle>Available Widgets</SectionTitle>
        <WidgetGrid>
          <WidgetCard onClick={() => navigate('/studio')}>
            <WidgetPreview $gradient="linear-gradient(135deg, #E8EDFF 0%, #F0E6FF 100%)">
              <Calendar />
            </WidgetPreview>
            <WidgetBody>
              <WidgetName>Calendar</WidgetName>
              <WidgetDesc>Month view calendar with customizable colors, borders, and week start day.</WidgetDesc>
              <WidgetStyles>
                <StyleTag>Core</StyleTag>
                <StyleTag>Soft</StyleTag>
                <StyleTag>Collage</StyleTag>
                <StyleTag>Letterpress</StyleTag>
              </WidgetStyles>
            </WidgetBody>
          </WidgetCard>

          <WidgetCard onClick={() => navigate('/studio')}>
            <WidgetPreview $gradient="linear-gradient(135deg, #FFE8E0 0%, #FFD6E8 100%)">
              <Clock />
            </WidgetPreview>
            <WidgetBody>
              <WidgetName>Clock</WidgetName>
              <WidgetDesc>Digital and analog clocks with 12/24h format, seconds, and date display.</WidgetDesc>
              <WidgetStyles>
                <StyleTag>Duo</StyleTag>
                <StyleTag>Analog</StyleTag>
                <StyleTag>Buddy</StyleTag>
              </WidgetStyles>
            </WidgetBody>
          </WidgetCard>

          <WidgetCard onClick={() => navigate('/studio')}>
            <WidgetPreview $gradient="linear-gradient(135deg, #E0F4E8 0%, #D6F0FF 100%)">
              <Image />
            </WidgetPreview>
            <WidgetBody>
              <WidgetName>Moodboard</WidgetName>
              <WidgetDesc>Image collage widget with drag-and-drop reordering and multiple layouts.</WidgetDesc>
              <WidgetStyles>
                <StyleTag>Grid</StyleTag>
                <StyleTag>Masonry</StyleTag>
                <StyleTag>Carousel</StyleTag>
              </WidgetStyles>
            </WidgetBody>
          </WidgetCard>
        </WidgetGrid>
      </Section>

      <Features>
        <SectionTitle>How it works</SectionTitle>
        <FeatureGrid>
          <FeatureItem>
            <FeatureTitle>1. Pick a widget</FeatureTitle>
            <FeatureDesc>Choose from calendars, clocks, and moodboards.</FeatureDesc>
          </FeatureItem>
          <FeatureItem>
            <FeatureTitle>2. Customize</FeatureTitle>
            <FeatureDesc>Adjust colors, style, layout, and size in real time.</FeatureDesc>
          </FeatureItem>
          <FeatureItem>
            <FeatureTitle>3. Copy URL</FeatureTitle>
            <FeatureDesc>One-click copy of the embed link from the toolbar.</FeatureDesc>
          </FeatureItem>
          <FeatureItem>
            <FeatureTitle>4. Paste in Notion</FeatureTitle>
            <FeatureDesc>Use /embed in Notion and paste your URL. Done.</FeatureDesc>
          </FeatureItem>
        </FeatureGrid>
      </Features>

      <Footer>
        <FooterText>Peachy Studio</FooterText>
        <FooterText>Free forever</FooterText>
      </Footer>
      </PageContent>
    </Page>
  );
};
