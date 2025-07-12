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
    /* background: transparent; */
  }
`;

const EmbedContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  padding: 20px;
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