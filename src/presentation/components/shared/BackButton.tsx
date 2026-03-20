import React from 'react';
import styled from 'styled-components';
import { ArrowLeft } from 'lucide-react';

const BackButtonWrap = styled.button`
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

interface BackButtonProps {
  label?: string;
  onClick: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ label = 'Home', onClick }) => (
  <BackButtonWrap onClick={onClick}>
    <ArrowLeft /> {label}
  </BackButtonWrap>
);
