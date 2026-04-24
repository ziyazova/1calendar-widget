import React from 'react';
import styled from 'styled-components';
import { ArrowLeft } from 'lucide-react';

const BackButtonWrap = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.body};
  background: none;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: 6px 12px;
  cursor: pointer;
  font-family: inherit;
  margin-bottom: 20px;
  transition: all ${({ theme }) => theme.transitions.fast};
  &:hover { color: ${({ theme }) => theme.colors.text.primary}; border-color: rgba(0, 0, 0, 0.15); }
  svg { width: 14px; height: 14px; }
`;

interface BackButtonProps {
  label?: string;
  onClick: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ label = 'Home', onClick }) => (
  <BackButtonWrap onClick={onClick}>
    <ArrowLeft /> {label}
  </BackButtonWrap>
);
