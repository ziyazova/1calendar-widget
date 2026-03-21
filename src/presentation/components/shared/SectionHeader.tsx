import React from 'react';
import styled from 'styled-components';
import { ArrowRight } from 'lucide-react';

const HeaderWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;

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
  letter-spacing: -0.02em;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0;
  letter-spacing: -0.01em;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  background: #1F1F1F;
  border: none;
  border-radius: ${({ theme }) => theme.radii.button};
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover { background: #333; }
  svg { width: 14px; height: 14px; }

  @media (max-width: 768px) {
    height: 34px;
    padding: 0 14px;
    font-size: 12px;
    svg { width: 12px; height: 12px; }
  }
`;

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  showArrow?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, actionLabel, onAction, showArrow = true }) => (
  <HeaderWrap>
    <HeaderLeft>
      <Title>{title}</Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </HeaderLeft>
    {actionLabel && onAction && (
      <ActionButton onClick={onAction}>
        {actionLabel} {showArrow && <ArrowRight />}
      </ActionButton>
    )}
  </HeaderWrap>
);
