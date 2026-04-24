import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { ChevronDown } from 'lucide-react';

/**
 * Accordion — collapsible section used in settings panels.
 *
 * Animated height via ref measurement (no layout shift on resize).
 * Controlled via $defaultOpen, or externally via $open + onToggle.
 */

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  /** External control */
  open?: boolean;
  onToggle?: (open: boolean) => void;
  /** Optional right-side content (count, badge, etc.) */
  right?: React.ReactNode;
  /** Visual weight */
  variant?: 'default' | 'subtle';
}

const Wrap = styled.div<{ $variant: 'default' | 'subtle' }>`
  border: ${({ $variant, theme }) =>
    $variant === 'default' ? `1px solid ${theme.colors.border.light}` : 'none'};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $variant, theme }) =>
    $variant === 'default' ? theme.colors.background.elevated : 'transparent'};
  overflow: hidden;
`;

const Trigger = styled.button<{ $open: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.interactive.hover};
  }

  svg.chevron {
    flex-shrink: 0;
    transition: transform ${({ theme }) => theme.transitions.medium};
    transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
    color: ${({ theme }) => theme.colors.text.body};
  }
`;

const Right = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  color: ${({ theme }) => theme.colors.text.body};
  font-size: 12px;
  font-weight: 400;
`;

const Content = styled.div<{ $h: number }>`
  overflow: hidden;
  transition: max-height ${({ theme }) => theme.transitions.base};
  max-height: ${({ $h }) => $h}px;
`;

const Inner = styled.div`
  padding: 4px 16px 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
`;

export function Accordion({
  title,
  children,
  defaultOpen = false,
  open,
  onToggle,
  right,
  variant = 'default',
}: AccordionProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!innerRef.current) return;
    const ro = new ResizeObserver(() => {
      if (innerRef.current) setHeight(innerRef.current.scrollHeight);
    });
    ro.observe(innerRef.current);
    setHeight(innerRef.current.scrollHeight);
    return () => ro.disconnect();
  }, [isOpen]);

  const toggle = () => {
    const next = !isOpen;
    if (!isControlled) setInternalOpen(next);
    onToggle?.(next);
  };

  return (
    <Wrap $variant={variant}>
      <Trigger $open={isOpen} onClick={toggle} aria-expanded={isOpen}>
        <span>{title}</span>
        {right && <Right>{right}</Right>}
        <ChevronDown className="chevron" size={16} />
      </Trigger>
      <Content $h={isOpen ? height : 0} aria-hidden={!isOpen}>
        <Inner ref={innerRef}>{children}</Inner>
      </Content>
    </Wrap>
  );
}

export const AccordionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
