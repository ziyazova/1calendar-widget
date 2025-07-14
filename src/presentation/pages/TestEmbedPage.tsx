import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { TestWidget } from '../components/widgets/TestWidget';
import { EmbedController } from './EmbedController';

const GlobalEmbedStyles = createGlobalStyle`
  html, body {
    overflow: hidden;
    background: transparent;
  }
`;

const EmbedContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  padding: 20px;
  box-sizing: border-box;
`;

export const TestEmbedPage: React.FC = () => {
  return (
    <EmbedController>
      <GlobalEmbedStyles />
      <EmbedContainer>
        <TestWidget />
      </EmbedContainer>
    </EmbedController>
  );
}; 