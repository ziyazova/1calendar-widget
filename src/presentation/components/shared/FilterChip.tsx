import styled from 'styled-components';

export const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const FilterChip = styled.button<{ $active: boolean }>`
  height: 34px;
  padding: 0 16px;
  border: none;
  flex-shrink: 0;
  white-space: nowrap;
  background: ${({ $active }) => $active ? '#111' : '#FFFFFF'};
  color: ${({ $active }) => $active ? '#ffffff' : '#6B6B6B'};
  border: 1px solid ${({ $active }) => $active ? 'transparent' : 'rgba(0, 0, 0, 0.08)'};
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.01em;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $active }) => $active ? '#111' : '#F5F5F5'};
    color: ${({ $active }) => $active ? '#ffffff' : '#1F1F1F'};
  }

  @media (max-width: 768px) {
    height: 32px;
    padding: 0 12px;
    font-size: 12px;
  }
`;
