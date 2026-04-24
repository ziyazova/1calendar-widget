import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 24px;
  }
`;
