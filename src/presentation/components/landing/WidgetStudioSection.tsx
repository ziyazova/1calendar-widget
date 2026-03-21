import React from 'react';
import styled from 'styled-components';
import { ArrowRight } from 'lucide-react';
import { PinterestGallery } from './PinterestGallery';

const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px 60px;

  @media (max-width: 768px) {
    padding: 0 24px 60px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }

  @media (max-width: 380px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1F1F1F;
  letter-spacing: -0.03em;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0;
`;

const BrowseAllButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 18px;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  background: #1F1F1F;
  border: none;
  border-radius: ${({ theme }) => theme.radii.button};
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;

  &:hover {
    background: #333;
  }

  svg { width: 14px; height: 14px; }
  white-space: nowrap;

  @media (max-width: 768px) {
    height: 36px;
    padding: 0 14px;
    font-size: 12px;
    svg { width: 12px; height: 12px; }
  }
`;

interface WidgetStudioSectionProps {
  onNavigate: (path: string) => void;
}

export const WidgetStudioSection: React.FC<WidgetStudioSectionProps> = ({ onNavigate }) => {
  return (
    <Section data-ux="Widgets Section">
      <Header>
        <HeaderLeft>
          <Title data-ux="Section Title">Widget Studio</Title>
          <Subtitle>Set up your widget in seconds</Subtitle>
        </HeaderLeft>
        <BrowseAllButton onClick={() => onNavigate('/widgets')}>To studio <ArrowRight /></BrowseAllButton>
      </Header>
      <PinterestGallery />
    </Section>
  );
};
