import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useLocation } from 'react-router-dom';

const pageEnter = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.97);
    filter: blur(4px);
  }
  60% {
    opacity: 1;
    filter: blur(0);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
`;

const Wrapper = styled.div`
  animation: ${pageEnter} 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  will-change: opacity, transform, filter;
`;

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  return <Wrapper key={location.pathname}>{children}</Wrapper>;
};
