import React from 'react';
import styled from 'styled-components';
import { ArrowLeft } from 'lucide-react';

const BackButtonWrap = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  /* Ghost + accent style now used on EVERY viewport (was a chipped pill
   * with grey border on desktop, ghost-accent on phone). Per user
   * "сделай Back на десктопе как на телефоне по стилю". The icon sits
   * flush with the H1's left edge below it. margin-bottom 28 keeps the
   * desktop Back→Title rhythm; mobile overrides to its own token. */
  color: ${({ theme }) => theme.colors.accent};
  background: transparent;
  border: 0;
  padding: 0;
  margin-left: 0;
  margin-bottom: 28px;
  cursor: pointer;
  font-family: inherit;
  transition: all ${({ theme }) => theme.transitions.fast};
  &:hover { opacity: 0.8; }
  svg { width: 14px; height: 14px; }

  /* Phone — base style is now identical to the old mobile variant; only
   * the Back→Title bottom gap differs (mobile uses the tokenized rhythm
   * shared with other catalog pages). */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-bottom: ${({ theme }) => theme.layout.mobile.backToTitle};
  }
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
