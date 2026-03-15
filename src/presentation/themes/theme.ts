import { widgetColors } from './colors';

export const theme = {
  colors: {
    // Primary brand colors
    primary: '#6C63FF',
    primaryDark: '#5A52E0',
    secondary: '#5856D6',
    accent: '#F4845F',
    success: '#15803d',
    warning: '#de6d02',

    // Widget colors
    widgets: widgetColors,

    // Background system — cool neutrals
    background: {
      primary: '#f8f8f8',
      secondary: '#f2f2f2',
      tertiary: '#ebebeb',
      elevated: '#ffffff',
      glass: 'rgba(255, 255, 255, 0.72)',
      dark: '#1c1c1e',
      darkSecondary: '#2c2c2e',
      mesh: 'linear-gradient(135deg, #a8c0ff 0%, #c4a8ff 25%, #f0a8d0 50%, #ffb8c6 75%, #ffd4a8 100%)',
    },

    // Text system
    text: {
      primary: '#1d1d1f',
      secondary: '#6e6e73',
      tertiary: '#aeaeb2',
      inverse: '#ffffff',
      accent: '#6C63FF',
      link: '#6C63FF',
    },

    // Border system — neutral grays
    border: {
      primary: '#e5e5e7',
      secondary: '#f0f0f0',
      tertiary: '#f5f5f5',
      focus: '#6C63FF',
    },

    // Interactive states
    interactive: {
      hover: 'rgba(0, 0, 0, 0.03)',
      active: 'rgba(0, 0, 0, 0.05)',
      focus: 'rgba(108, 99, 255, 0.12)',
      disabled: 'rgba(60, 60, 67, 0.18)',
    },

    // Gradients
    gradients: {
      primary: 'linear-gradient(135deg, #6C63FF 0%, #9F7AEA 100%)',
      hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      card: 'linear-gradient(145deg, #ffffff 0%, #faf9f7 100%)',
      glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
      subtle: 'radial-gradient(at 27% 37%, rgba(108, 99, 255, 0.04) 0px, transparent 50%), radial-gradient(at 97% 21%, rgba(159, 122, 234, 0.03) 0px, transparent 50%)',
    },
  },

  // Typography — Inter
  typography: {
    fonts: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
      mono: "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace",
      display: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
    },

    sizes: {
      xs: '0.6875rem',   // 11px
      sm: '0.75rem',     // 12px
      md: '0.875rem',    // 14px
      lg: '1rem',        // 16px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
      '7xl': '4.5rem',   // 72px
    },

    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      heavy: 800,
    },

    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },

    letterSpacing: {
      tight: '-0.011em',
      normal: '0',
      wide: '0.04em',
    },
  },

  // Spacing — 8pt grid
  spacing: {
    px: '1px',
    '0.5': '0.125rem',   // 2px
    '1': '0.25rem',      // 4px
    '2': '0.5rem',       // 8px
    '3': '0.75rem',      // 12px
    '4': '1rem',         // 16px
    '5': '1.25rem',      // 20px
    '6': '1.5rem',       // 24px
    '8': '2rem',         // 32px
    '10': '2.5rem',      // 40px
    '12': '3rem',        // 48px
    '16': '4rem',        // 64px
    '20': '5rem',        // 80px
    '24': '6rem',        // 96px
    '32': '8rem',        // 128px

    // Legacy support
    xs: '0.25rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '2.5rem',
    '5xl': '3rem',
  },

  // Border radius — restrained
  radii: {
    none: '0',
    xs: '0.125rem',      // 2px
    sm: '0.25rem',       // 4px
    md: '0.5rem',        // 8px
    lg: '0.625rem',      // 10px
    xl: '0.75rem',       // 12px
    '2xl': '1.5rem',     // 24px
    '3xl': '2rem',       // 32px
    full: '9999px',

    // Semantic
    card: '0.75rem',     // 12px
    button: '0.5rem',    // 8px
    input: '0.5rem',     // 8px
  },

  // Shadows — very soft, minimal
  shadows: {
    xs: '0 1px 2px rgba(0,0,0,0.04)',
    sm: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
    md: '0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
    lg: '0 4px 16px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)',
    xl: '0 8px 24px rgba(0,0,0,0.06)',
    '2xl': '0 16px 48px rgba(0,0,0,0.08)',

    // Surface shadows
    card: '0 0 0 1px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.03)',
    button: '0 1px 2px rgba(0,0,0,0.06)',
    glass: '0 4px 24px rgba(0,0,0,0.06)',
    hero: '0 24px 48px rgba(0, 0, 0, 0.08)',

    // Inner shadows
    inset: 'inset 0 1px 2px rgba(0, 0, 0, 0.04)',
  },

  // Breakpoints
  breakpoints: {
    xs: '375px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    '3xl': '1920px',
  },

  // Z-index system
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1020,
    banner: 1030,
    overlay: 1040,
    modal: 1050,
    popover: 1060,
    skipLink: 1070,
    toast: 1080,
    tooltip: 1090,
  },

  // Transitions
  transitions: {
    fast: '120ms ease',
    base: '180ms ease',
    slow: '280ms ease',
    bounce: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',

    apple: '0.25s cubic-bezier(0.25, 0.1, 0.25, 1)',
    spring: '0.4s cubic-bezier(0.54, 1.5, 0.38, 1.11)',
    elastic: '0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  // Blur effects
  blur: {
    none: '0',
    sm: '4px',
    base: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '40px',
    '3xl': '64px',
  },
} as const;

export type Theme = typeof theme;
