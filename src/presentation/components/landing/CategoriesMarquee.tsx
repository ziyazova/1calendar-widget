import React from 'react';
import styled from 'styled-components';
import { scrollLeft } from '@/presentation/themes/animations';

/* ── Categories Marquee ── */
const CategoriesWrap = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);

  @media (max-width: 768px) {
    padding: 0 24px;
  }
`;

const CategoriesSection = styled.section`
  padding: 16px 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const CategoriesTrack = styled.div<{ $duration: number; $reverse?: boolean }>`
  display: flex;
  gap: 12px;
  width: max-content;
  animation: ${scrollLeft} ${({ $duration }) => $duration}s linear infinite;
  animation-direction: ${({ $reverse }) => $reverse ? 'reverse' : 'normal'};

  &:hover {
    animation-play-state: paused;
  }
`;

const CategoryChip = styled.div<{ $color: string }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: ${({ $color }) => {
    const hex = $color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.08)`;
  }};
  border: 1px solid ${({ $color }) => {
    const hex = $color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.12)`;
  }};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  letter-spacing: -0.01em;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.25s ease;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 3px;
    background: ${({ $color }) => $color};
    flex-shrink: 0;
    transition: transform 0.25s ease;
  }

  &:hover {
    background: ${({ $color }) => {
      const hex = $color.replace('#', '');
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, 0.08)`;
    }};
    transform: scale(1.04);
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:active {
    transform: scale(0.97);
  }
`;

const CATEGORY_CHIPS_ROW1 = [
  { label: 'Life Planners', color: '#F59E0B' },
  { label: 'Productivity Systems', color: '#6366F1' },
  { label: 'Health & Wellness', color: '#10B981' },
  { label: 'Student Planner', color: '#8B5CF6' },
  { label: 'Finance', color: '#3B82F6' },
];

const CATEGORY_CHIPS_ROW2 = [
  { label: 'Student Planner', color: '#8B5CF6' },
  { label: 'Finance', color: '#3B82F6' },
  { label: 'Life Planners', color: '#F59E0B' },
  { label: 'Health & Wellness', color: '#10B981' },
  { label: 'Productivity Systems', color: '#6366F1' },
];

interface CategoriesMarqueeProps {
  onNavigate: (path: string) => void;
}

export const CategoriesMarquee: React.FC<CategoriesMarqueeProps> = ({ onNavigate }) => {
  return (
    <CategoriesWrap>
      <CategoriesSection data-ux="Categories Marquee">
        <CategoriesTrack $duration={50}>
          {[...CATEGORY_CHIPS_ROW1, ...CATEGORY_CHIPS_ROW1, ...CATEGORY_CHIPS_ROW1].map((c, i) => (
            <CategoryChip key={`cr1-${i}`} $color={c.color} onClick={() => c.label === 'Widget Studio' ? onNavigate('/widgets') : onNavigate(`/templates?cat=${c.label.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`)}>{c.label}</CategoryChip>
          ))}
        </CategoriesTrack>
        <CategoriesTrack $duration={55} $reverse>
          {[...CATEGORY_CHIPS_ROW2, ...CATEGORY_CHIPS_ROW2, ...CATEGORY_CHIPS_ROW2].map((c, i) => (
            <CategoryChip key={`cr2-${i}`} $color={c.color} onClick={() => onNavigate(`/templates?cat=${c.label.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`)}>{c.label}</CategoryChip>
          ))}
        </CategoriesTrack>
      </CategoriesSection>
    </CategoriesWrap>
  );
};
