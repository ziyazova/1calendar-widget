import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 48px 40px;
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};

  @media (max-width: 768px) {
    padding: 48px 24px 32px;
  }
`;

const FooterInner = styled.div`
  display: flex;
  gap: 64px;
  margin-bottom: 48px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 32px;
  }
`;

const FooterBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

const FooterBrandName = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
`;

const FooterColumns = styled.div`
  display: flex;
  gap: 48px;
  flex: 1;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 32px 24px;
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 120px;

  @media (max-width: 768px) {
    min-width: 40%;
  }
`;

const FooterColumnTitle = styled.h4`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 4px;
  letter-spacing: -0.01em;
`;

const FooterLink = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  cursor: pointer;
  transition: color 0.15s ease;
  letter-spacing: -0.01em;

  &:hover { color: ${({ theme }) => theme.colors.text.primary}; }
`;

const FooterBottom = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
  padding-top: 32px;
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  letter-spacing: -0.01em;
`;

interface BigFooterProps {
  onNavigate: (path: string) => void;
}

export const BigFooter: React.FC<BigFooterProps> = ({ onNavigate }) => {
  return (
    <FooterWrapper>
      <FooterInner>
        <FooterBrand>
          <img src="/PeachyLogo.png" alt="Peachy" width="28" height="28" style={{ objectFit: 'contain' }} />
          <FooterBrandName>Peachy</FooterBrandName>
        </FooterBrand>
        <FooterColumns>
          <FooterColumn>
            <FooterColumnTitle>Resources</FooterColumnTitle>
            <FooterLink onClick={() => onNavigate('/templates')}>Notion Templates</FooterLink>
            <FooterLink onClick={() => onNavigate('/widgets')}>Widget Studio</FooterLink>
          </FooterColumn>
          <FooterColumn>
            <FooterColumnTitle>Social</FooterColumnTitle>
            <FooterLink>X (Twitter)</FooterLink>
          </FooterColumn>
          <FooterColumn>
            <FooterColumnTitle>Legal</FooterColumnTitle>
            <FooterLink>Privacy Policy</FooterLink>
            <FooterLink>Terms & Conditions</FooterLink>
          </FooterColumn>
          <FooterColumn>
            <FooterColumnTitle>Widgets</FooterColumnTitle>
            <FooterLink onClick={() => onNavigate('/widgets')}>Calendar Widgets</FooterLink>
            <FooterLink onClick={() => onNavigate('/widgets')}>Clock Widgets</FooterLink>
            <FooterLink onClick={() => onNavigate('/widgets')}>Canvas Widgets</FooterLink>
          </FooterColumn>
        </FooterColumns>
      </FooterInner>
      <FooterBottom>
        © {new Date().getFullYear()} Peachy Studio. All rights reserved.
      </FooterBottom>
    </FooterWrapper>
  );
};
