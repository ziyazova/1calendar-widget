import React from 'react';
import styled from 'styled-components';

const TestContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 300px;
`;

const ChessBoard = styled.div`
  width: 100%;
  max-width: 400px;
  height: 100%;
  max-height: 400px;
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

const Title = styled.div`
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(14px, 3vw, 18px);
  font-weight: bold;
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const TestWidget: React.FC = () => {
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
    <TestContainer>
      <Title>Chess Board</Title>
      <ChessBoard>
        {renderChessBoard()}
      </ChessBoard>
    </TestContainer>
  );
}; 