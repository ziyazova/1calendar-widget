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
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  padding: 0;
  margin: 0;
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