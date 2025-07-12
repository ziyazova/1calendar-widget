import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { TestWidget } from '../components/widgets/TestWidget';

const GlobalEmbedStyles = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: transparent;
  }
  
  #root {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  * {
    box-sizing: border-box;
  }
`;

const EmbedContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  padding: 20px;
  box-sizing: border-box;
`;

export const TestEmbedPage: React.FC = () => {
  return (
    <>
      <GlobalEmbedStyles />
      <EmbedContainer>
        <TestWidget />
      </EmbedContainer>
    </>
  );
}; 