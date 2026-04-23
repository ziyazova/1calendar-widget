import React from 'react';
import styled from 'styled-components';
import { ChevronDown } from 'lucide-react';

/**
 * Accordion — minimal collapsible row used by the FAQ section on
 * TemplateDetailPage. Controlled via `open` + `onToggle`. Kept small
 * until the full DS accordion is merged from design-experiment.
 */

interface AccordionProps {
  title: string;
  open?: boolean;
  onToggle?: (open: boolean) => void;
  children: React.ReactNode;
}

const Wrap = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const Header = styled.button<{ $open?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.01em;

  svg {
    width: 18px;
    height: 18px;
    color: ${({ theme }) => theme.colors.text.tertiary};
    transition: transform 0.2s ease;
    transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0)')};
  }
`;

const Body = styled.div<{ $open?: boolean }>`
  overflow: hidden;
  max-height: ${({ $open }) => ($open ? '400px' : '0')};
  transition: max-height 0.2s ease;
  padding: ${({ $open }) => ($open ? '0 0 16px' : '0')};
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const Accordion: React.FC<AccordionProps> = ({ title, open = false, onToggle, children }) => (
  <Wrap>
    <Header $open={open} onClick={() => onToggle?.(!open)}>
      <span>{title}</span>
      <ChevronDown />
    </Header>
    <Body $open={open}>{children}</Body>
  </Wrap>
);
