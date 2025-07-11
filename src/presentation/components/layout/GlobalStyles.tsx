import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    line-height: 1.5;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fonts.primary};
    background: ${({ theme }) => theme.colors.background.primary};
    color: ${({ theme }) => theme.colors.text.primary};
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
    
    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.interactive.focus};
      outline-offset: 2px;
    }
  }

  input, select, textarea {
    font-family: inherit;
    
    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.interactive.focus};
      outline-offset: 2px;
    }
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Better selection color */
  ::selection {
    background: ${({ theme }) => theme.colors.interactive.focus};
    color: ${({ theme }) => theme.colors.text.inverse};
  }
`; 