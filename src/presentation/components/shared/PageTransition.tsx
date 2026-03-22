import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useLocation } from 'react-router-dom';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.995);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const Wrapper = styled.div<{ $visible: boolean }>`
  opacity: ${({ $visible }) => $visible ? 1 : 0};
  animation: ${fadeIn} 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
  will-change: opacity, transform;
`;

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, [location.pathname]);

  return <Wrapper key={location.pathname} $visible={visible}>{children}</Wrapper>;
};
