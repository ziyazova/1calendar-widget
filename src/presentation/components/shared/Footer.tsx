import React from 'react';
import styled from 'styled-components';

const FooterWrap = styled.footer`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 48px;
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 24px;
    flex-direction: column;
    gap: 8px;
  }
`;

const FooterText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.muted};
  letter-spacing: -0.01em;
`;

interface FooterProps {
  left?: string;
  right?: string;
}

export const Footer: React.FC<FooterProps> = ({ left = 'Peachy Studio', right }) => (
  <FooterWrap>
    <FooterText>{left}</FooterText>
    {right && <FooterText>{right}</FooterText>}
  </FooterWrap>
);
