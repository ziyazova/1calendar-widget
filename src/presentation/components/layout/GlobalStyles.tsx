import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  /* CSS Reset & Base Styles */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fonts.primary};
    font-size: ${({ theme }) => theme.typography.sizes.md};
    font-weight: ${({ theme }) => theme.typography.weights.normal};
    line-height: ${({ theme }) => theme.typography.lineHeights.normal};
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.background.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.typography.fonts.display};
    font-weight: ${({ theme }) => theme.typography.weights.bold};
    line-height: ${({ theme }) => theme.typography.lineHeights.tight};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0;
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.sizes['4xl']};
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.sizes['3xl']};
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  }

  h4 {
    font-size: ${({ theme }) => theme.typography.sizes.xl};
  }

  h5 {
    font-size: ${({ theme }) => theme.typography.sizes.lg};
  }

  h6 {
    font-size: ${({ theme }) => theme.typography.sizes.md};
  }

  p {
    margin: 0;
    line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  }

  a {
    color: ${({ theme }) => theme.colors.text.link};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};
    
    &:hover {
      color: ${({ theme }) => theme.colors.primaryDark};
    }
    
    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.border.focus};
      outline-offset: 2px;
      border-radius: ${({ theme }) => theme.radii.xs};
    }
  }

  /* Form Elements */
  button {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    margin: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.apple};
    
    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.border.focus};
      outline-offset: 2px;
    }
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    margin: 0;
    border: 1px solid ${({ theme }) => theme.colors.border.primary};
    border-radius: ${({ theme }) => theme.radii.input};
    padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['3']};
    background: ${({ theme }) => theme.colors.background.primary};
    color: ${({ theme }) => theme.colors.text.primary};
    transition: border-color ${({ theme }) => theme.transitions.fast};
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.border.focus};
    }
    
    &::placeholder {
      color: ${({ theme }) => theme.colors.text.tertiary};
    }
  }

  /* Lists */
  ul, ol {
    list-style: none;
  }

  /* Media */
  img, svg, video, canvas, audio, iframe, embed, object {
    display: block;
    max-width: 100%;
    height: auto;
  }

  img {
    border-radius: ${({ theme }) => theme.radii.sm};
  }

  /* Scrollbars */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.secondary};
    border-radius: ${({ theme }) => theme.radii.full};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border.secondary};
    border-radius: ${({ theme }) => theme.radii.full};
    border: 2px solid ${({ theme }) => theme.colors.background.secondary};
    
    &:hover {
      background: ${({ theme }) => theme.colors.border.primary};
    }
  }

  /* Selection */
  ::selection {
    background: ${({ theme }) => theme.colors.interactive.focus};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  /* Focus visible */
  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  /* Utility Classes */
  .fade-in {
    animation: fadeIn 0.3s ${({ theme }) => theme.transitions.apple};
  }

  .slide-in {
    animation: slideIn 0.3s ${({ theme }) => theme.transitions.apple};
  }

  .scale-in {
    animation: scaleIn 0.3s ${({ theme }) => theme.transitions.apple};
  }

  .shimmer {
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.background.secondary} 0%,
      ${({ theme }) => theme.colors.background.tertiary} 50%,
      ${({ theme }) => theme.colors.background.secondary} 100%
    );
    background-size: 200px 100%;
    animation: shimmer 1.5s infinite;
  }

  .pulse {
    animation: pulse 2s infinite;
  }

  .bounce {
    animation: bounce 1s infinite;
  }

  /* Glass morphism effect */
  .glass {
    background: ${({ theme }) => theme.colors.background.glass};
    backdrop-filter: blur(${({ theme }) => theme.blur.md});
    -webkit-backdrop-filter: blur(${({ theme }) => theme.blur.md});
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  /* Card styles */
  .card {
    background: ${({ theme }) => theme.colors.background.elevated};
    border-radius: ${({ theme }) => theme.radii.card};
    box-shadow: ${({ theme }) => theme.shadows.card};
    border: 1px solid ${({ theme }) => theme.colors.border.primary};
    transition: all ${({ theme }) => theme.transitions.apple};
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${({ theme }) => theme.shadows.lg};
    }
  }

  /* Button styles */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing['2']};
    padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['4']};
    border-radius: ${({ theme }) => theme.radii.button};
    font-size: ${({ theme }) => theme.typography.sizes.md};
    font-weight: ${({ theme }) => theme.typography.weights.medium};
    transition: all ${({ theme }) => theme.transitions.apple};
    cursor: pointer;
    border: none;
    
    &:hover {
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  }

  .btn-primary {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.inverse};
    box-shadow: ${({ theme }) => theme.shadows.button};
    
    &:hover {
      background: ${({ theme }) => theme.colors.primaryDark};
      box-shadow: ${({ theme }) => theme.shadows.lg};
    }
  }

  .btn-secondary {
    background: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.primary};
    border: 1px solid ${({ theme }) => theme.colors.border.primary};
    
    &:hover {
      background: ${({ theme }) => theme.colors.background.tertiary};
      border-color: ${({ theme }) => theme.colors.border.secondary};
    }
  }

  /* Responsive utilities */
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    html {
      font-size: 14px;
    }
    
    .hide-mobile {
      display: none !important;
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    .hide-desktop {
      display: none !important;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    button, input, select, textarea {
      border: 2px solid currentColor;
    }
  }

  /* Dark mode support (for future implementation) */
  @media (prefers-color-scheme: dark) {
    /* Dark mode styles would go here */
  }
`; 