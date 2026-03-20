import styled from 'styled-components';

export const FilterRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

export const FilterChip = styled.button<{ $active: boolean }>`
  height: 32px;
  padding: 0 16px;
  border: none;
  flex-shrink: 0;
  white-space: nowrap;
  background: ${({ $active }) => $active ? '#1F1F1F' : 'rgba(0, 0, 0, 0.04)'};
  color: ${({ $active }) => $active ? '#ffffff' : '#6B6B6B'};
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.01em;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $active }) => $active ? '#1F1F1F' : 'rgba(0, 0, 0, 0.08)'};
    color: ${({ $active }) => $active ? '#ffffff' : '#1F1F1F'};
  }

  @media (max-width: 768px) {
    height: 30px;
    padding: 0 12px;
    font-size: 12px;
  }
`;
