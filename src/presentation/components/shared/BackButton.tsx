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
  /* Pull the button -10px left so the icon aligns optically with the H1's
     left edge below it (the H1 has no padding, so default placement looks
     inset). */
  margin-left: -10px;
  margin-bottom: 28px;
  transition: all ${({ theme }) => theme.transitions.fast};
  &:hover { color: ${({ theme }) => theme.colors.text.primary}; border-color: rgba(0, 0, 0, 0.15); }
  svg { width: 14px; height: 14px; }

  /* Phone — ghost variant with our indigo accent. No border / no chip
   * background; the button reads as a quiet inline link with the brand
   * accent. Padding 0 + margin-left 0 so the icon sits flush with the
   * H1's left edge below it. Margin-bottom tightened (28 → 16) to suit
   * the denser mobile header rhythm.
   * Per "Back button — токенизируй для телефона — ghost стайл с
   * акцентным цветом нашим". */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    color: ${({ theme }) => theme.colors.accent};
    background: transparent;
    border: 0;
    padding: 0;
    margin-left: 0;
    /* Back → Title gap = layout.mobile.backToTitle (40px). Tokenized
     * because the BackButton repeats on /templates, /templates/:id and
     * other catalog-style pages — single source so every page's nav→H1
     * rhythm stays in sync. Comment c_moh6iv7m: "снизу отступ до текста
     * больше и токенизируй т.к. навигация такая на других страницах". */
    margin-bottom: ${({ theme }) => theme.layout.mobile.backToTitle};

    &:hover {
      color: ${({ theme }) => theme.colors.accent};
      border: 0;
      opacity: 0.8;
    }
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
