import React from 'react';
import styled from 'styled-components';
import { PinterestGallery } from './PinterestGallery';
import { SectionHeader } from '../shared';

const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px 60px;

  @media (max-width: 768px) {
    padding: 0 24px 60px;
  }
`;

interface WidgetStudioSectionProps {
  onNavigate: (path: string) => void;
}

export const WidgetStudioSection: React.FC<WidgetStudioSectionProps> = ({ onNavigate }) => {
  return (
    <Section data-ux="Widgets Section">
      <SectionHeader
        title="Widget Studio"
        subtitle="Set up your widget in seconds"
        actionLabel="To studio"
        onAction={() => onNavigate('/widgets')}
        titleUx="Section Title"
        marginBottom="32px"
        mobileMarginBottom="20px"
      />
      <PinterestGallery />
    </Section>
  );
};
