import React from 'react';
import styled from 'styled-components';

const TestContainer = styled.div`
  width: 320px;
  height: 320px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ChessBoard = styled.div`
  width: 280px;
  height: 280px;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  border: 2px solid #333;
  border-radius: 8px;
  overflow: hidden;
`;

const ChessSquare = styled.div<{ isBlack: boolean }>`
  background: ${({ isBlack }) => (isBlack ? '#8B5A2B' : '#F5DEB3')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: ${({ isBlack }) => (isBlack ? '#F5DEB3' : '#8B5A2B')};
  
  &:hover {
    background: ${({ isBlack }) => (isBlack ? '#A0522D' : '#DEB887')};
  }
`;

const Title = styled.div`
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18px;
  font-weight: bold;
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
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
      <Title>Test Widget</Title>
      <ChessBoard>
        {renderChessBoard()}
      </ChessBoard>
    </TestContainer>
  );
}; 