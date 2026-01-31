import React from 'react';
import styled from 'styled-components';
import { ArrowRight, Sparkles, Zap, Palette, Code2, Check, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background.secondary};
`;

const HeroSection = styled.section`
  padding: ${({ theme }) => theme.spacing['20']} ${({ theme }) => theme.spacing['8']};
  background: ${({ theme }) => theme.colors.gradients.hero};
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ theme }) => theme.colors.gradients.glass};
    backdrop-filter: blur(${({ theme }) => theme.blur.xl});
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.sizes['7xl']};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  margin: 0 0 ${({ theme }) => theme.spacing['6']} 0;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
  font-family: ${({ theme }) => theme.typography.fonts.display};
  color: white;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.sizes['5xl']};
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  margin: 0 0 ${({ theme }) => theme.spacing['12']} 0;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  color: white;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.sizes.xl};
  }
`;

const HeroButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['2']};
  padding: ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['8']};
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: ${({ theme }) => theme.radii.button};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.apple};
  backdrop-filter: blur(${({ theme }) => theme.blur.md});
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
`;

const FeatureSection = styled.section`
  padding: ${({ theme }) => theme.spacing['20']} ${({ theme }) => theme.spacing['8']};
  background: ${({ theme }) => theme.colors.background.primary};
`;

const FeatureGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing['8']};
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: ${({ theme }) => theme.spacing['8']};
  box-shadow: ${({ theme }) => theme.shadows.card};
  text-align: center;
  transition: all ${({ theme }) => theme.transitions.apple};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: ${({ theme }) => theme.colors.gradients.primary};
  border-radius: ${({ theme }) => theme.radii.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing['4']};
  box-shadow: ${({ theme }) => theme.shadows.button};
  
  svg {
    color: white;
  }
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing['3']} 0;
`;

const FeatureDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.sizes['5xl']};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin: 0 0 ${({ theme }) => theme.spacing['12']} 0;
  font-family: ${({ theme }) => theme.typography.fonts.display};
`;

const PricingSection = styled.section`
  padding: ${({ theme }) => theme.spacing['20']} ${({ theme }) => theme.spacing['8']};
  background: ${({ theme }) => theme.colors.background.secondary};
`;

const PricingContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const PricingCard = styled.div`
  background: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: ${({ theme }) => theme.spacing['12']};
  box-shadow: ${({ theme }) => theme.shadows.hero};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  max-width: 500px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ theme }) => theme.colors.gradients.primary};
  }
`;

const PricingBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['2']};
  background: ${({ theme }) => theme.colors.success};
  color: white;
  padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['4']};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  margin-bottom: ${({ theme }) => theme.spacing['6']};
`;

const PricingTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.sizes['3xl']};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing['4']} 0;
  font-family: ${({ theme }) => theme.typography.fonts.display};
`;

const PricingPrice = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes['6xl']};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 ${({ theme }) => theme.spacing['6']} 0;
  font-family: ${({ theme }) => theme.typography.fonts.display};
`;

const PricingDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 ${({ theme }) => theme.spacing['8']} 0;
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`;

const FeaturesList = styled.ul`
  list-style: none;
  margin: 0 0 ${({ theme }) => theme.spacing['8']} 0;
  padding: 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']};
  padding: ${({ theme }) => theme.spacing['3']} 0;
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text.primary};
  
  svg {
    color: ${({ theme }) => theme.colors.success};
    flex-shrink: 0;
  }
`;

const CTAButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing['2']};
  padding: ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['8']};
  background: ${({ theme }) => theme.colors.gradients.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.button};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.apple};
  box-shadow: ${({ theme }) => theme.shadows.button};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const TestimonialSection = styled.section`
  padding: ${({ theme }) => theme.spacing['20']} ${({ theme }) => theme.spacing['8']};
  background: ${({ theme }) => theme.colors.background.primary};
`;

const TestimonialCard = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: ${({ theme }) => theme.spacing['12']};
  box-shadow: ${({ theme }) => theme.shadows.card};
  text-align: center;
  position: relative;
  
  &::before {
    content: '"';
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 80px;
    color: ${({ theme }) => theme.colors.primary};
    font-family: serif;
    line-height: 1;
  }
`;

const TestimonialText = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing['6']} 0;
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  font-style: italic;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing['3']};
`;

const AuthorAvatar = styled.div`
  width: 50px;
  height: 50px;
  background: ${({ theme }) => theme.colors.gradients.primary};
  border-radius: ${({ theme }) => theme.radii.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: white;
`;

const AuthorInfo = styled.div`
  text-align: left;
`;

const AuthorName = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const AuthorTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StarsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing['1']};
  margin-bottom: ${({ theme }) => theme.spacing['4']};
  justify-content: center;
`;

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/studio');
  };

  return (
    <LandingContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>
            Beautiful Widgets
            <br />
            for Notion
          </HeroTitle>
          <HeroSubtitle>
            Create stunning, customizable widgets that seamlessly integrate with your Notion workspace.
            No coding required.
          </HeroSubtitle>
          <HeroButton onClick={handleGetStarted}>
            Get Started
            <ArrowRight size={20} />
          </HeroButton>
        </HeroContent>
      </HeroSection>

      <FeatureSection>
        <SectionTitle>Why Choose Widget Studio?</SectionTitle>
        <FeatureGrid>
          <FeatureCard>
            <FeatureIcon>
              <Sparkles size={28} />
            </FeatureIcon>
            <FeatureTitle>Beautiful Design</FeatureTitle>
            <FeatureDescription>
              Apple-inspired design system with smooth animations and modern aesthetics that complement your Notion pages perfectly.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <Palette size={28} />
            </FeatureIcon>
            <FeatureTitle>Fully Customizable</FeatureTitle>
            <FeatureDescription>
              Customize colors, styles, and layouts in real-time. See your changes instantly with our live preview system.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <Zap size={28} />
            </FeatureIcon>
            <FeatureTitle>One-Click Embed</FeatureTitle>
            <FeatureDescription>
              Copy embed URLs with one click and paste directly into Notion. No complex setup or configuration needed.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <Code2 size={28} />
            </FeatureIcon>
            <FeatureTitle>No Code Required</FeatureTitle>
            <FeatureDescription>
              Built for everyone. Create professional widgets without writing a single line of code. Just point, click, and customize.
            </FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </FeatureSection>

      <PricingSection>
        <PricingContainer>
          <SectionTitle>Simple, Transparent Pricing</SectionTitle>
          <PricingCard>
            <PricingBadge>
              <Star size={16} />
              Most Popular
            </PricingBadge>
            <PricingTitle>Widget Studio Pro</PricingTitle>
            <PricingPrice>Free</PricingPrice>
            <PricingDescription>
              Everything you need to create beautiful widgets for your Notion workspace
            </PricingDescription>
            <FeaturesList>
              <FeatureItem>
                <Check size={20} />
                Unlimited widget creation
              </FeatureItem>
              <FeatureItem>
                <Check size={20} />
                Calendar & Clock widgets
              </FeatureItem>
              <FeatureItem>
                <Check size={20} />
                Real-time customization
              </FeatureItem>
              <FeatureItem>
                <Check size={20} />
                Apple-style design system
              </FeatureItem>
              <FeatureItem>
                <Check size={20} />
                One-click embed URLs
              </FeatureItem>
              <FeatureItem>
                <Check size={20} />
                Mobile responsive widgets
              </FeatureItem>
            </FeaturesList>
            <CTAButton onClick={handleGetStarted}>
              Start Creating Widgets
              <ArrowRight size={20} />
            </CTAButton>
          </PricingCard>
        </PricingContainer>
      </PricingSection>

      <TestimonialSection>
        <TestimonialCard>
          <StarsContainer>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={20} fill="currentColor" color="#FFD700" />
            ))}
          </StarsContainer>
          <TestimonialText>
            Widget Studio has completely transformed how I organize my Notion workspace.
            The widgets are beautiful, easy to customize, and integrate seamlessly.
            It's like having a personal design team for my productivity setup!
          </TestimonialText>
          <TestimonialAuthor>
            <AuthorAvatar>SM</AuthorAvatar>
            <AuthorInfo>
              <AuthorName>Sarah Mitchell</AuthorName>
              <AuthorTitle>Product Designer at TechCorp</AuthorTitle>
            </AuthorInfo>
          </TestimonialAuthor>
        </TestimonialCard>
      </TestimonialSection>
    </LandingContainer>
  );
}; 