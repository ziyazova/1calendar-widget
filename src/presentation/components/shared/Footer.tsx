import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterWrap = styled.footer`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 48px;
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
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

const FooterLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 540px) {
    gap: 14px;
    justify-content: center;
  }
`;

const FooterLink = styled(Link)`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.muted};
  letter-spacing: -0.01em;
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};
  &:hover { color: ${({ theme }) => theme.colors.text.body}; }
`;

interface FooterProps {
  left?: string;
  right?: string;
}

export const Footer: React.FC<FooterProps> = ({ left = 'Peachy Studio', right }) => {
  return (
    <FooterWrap>
      <FooterText>{left}</FooterText>
      <FooterLinks>
        <FooterLink to="/privacy">Privacy</FooterLink>
        <FooterLink to="/terms">Terms</FooterLink>
        <FooterLink to="/refund">Refund</FooterLink>
        <FooterLink to="/legal">Imprint</FooterLink>
        {right && <FooterText>{right}</FooterText>}
      </FooterLinks>
    </FooterWrap>
  );
};
