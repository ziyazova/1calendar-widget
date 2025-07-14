import React, { useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalEmbedStyles = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: visible;
    background: transparent;
  }
  #root {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    box-sizing: border-box;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
  overflow-x: hidden;
`;

const TestContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ChessBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  aspect-ratio: 1;
  border: 2px solid #8B5A2B;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ChessSquare = styled.div<{ isBlack: boolean }>`
  background: ${({ isBlack }) => (isBlack ? '#8B5A2B' : '#F5DEB3')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(10px, 2vw, 14px);
  font-weight: bold;
  color: ${({ isBlack }) => (isBlack ? '#F5DEB3' : '#8B5A2B')};
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${({ isBlack }) => (isBlack ? '#A0522D' : '#DEB887')};
  }
`;

function useNotionAutoHeight() {
  useEffect(() => {
    // Подключаем iframeResizer для автоматической высоты
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/iframe-resizer/js/iframeResizer.contentWindow.min.js';
    script.async = true;
    document.body.appendChild(script);

    function sendHeight() {
      const height = document.documentElement.scrollHeight;
      window.parent.postMessage({ type: 'embed-size', height }, '*');
    }
    sendHeight();
    window.addEventListener('load', sendHeight);
    const interval = setInterval(sendHeight, 500);
    return () => {
      window.removeEventListener('load', sendHeight);
      clearInterval(interval);
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);
}

export const TestWidget: React.FC = () => {
  useNotionAutoHeight();
  const renderChessBoard = () => {
    const squares = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isBlack = (row + col) % 2 === 1;
        const squareId = `${String.fromCharCode(97 + col)}${8 - row}`;
        squares.push(
          <ChessSquare key={`${row}-${col}`} isBlack={isBlack}>
            {row === 0 || row === 7 || col === 0 || col === 7 ? squareId : ''}
          </ChessSquare>
        );
      }
    }
    return squares;
  };

  return (
    <>
      <GlobalEmbedStyles />
      <Wrapper>
        <TestContainer>
          <ChessBoard>
            {renderChessBoard()}
          </ChessBoard>
        </TestContainer>
      </Wrapper>
    </>
  );
}; 