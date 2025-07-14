import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { TestWidget } from '../components/widgets/TestWidget';
import { EmbedController } from './EmbedController';

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
    max-width: 100%;
    max-height: 100%;
  }
  body {
    touch-action: manipulation;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }
  * {
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
  }
  img, svg, video, canvas, audio, iframe, embed, object {
    max-width: 100% !important;
    max-height: 100% !important;
    width: auto !important;
    height: auto !important;
  }
  div, section, article, aside, main, header, footer, nav {
    min-width: 0;
    min-height: 0;
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