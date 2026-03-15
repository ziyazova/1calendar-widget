import { widgetColors } from './colors';

export const theme = {
  colors: {
    // Primary brand colors
    primary: '#6C63FF',
    primaryDark: '#5A52E0',
    secondary: '#5856D6',
    accent: '#FF3B30',
    success: '#15803d',
    warning: '#de6d02',

    // Widget colors
    widgets: widgetColors,

    // Background system — warm neutrals
    background: {
      primary: '#faf9f7',
      secondary: '#f5f3f0',
      tertiary: '#edeae6',
      elevated: '#ffffff',
      glass: 'rgba(255, 255, 255, 0.72)',
      dark: '#1c1c1e',
      darkSecondary: '#2c2c2e',
      mesh: 'linear-gradient(135deg, #a8c0ff 0%, #c4a8ff 25%, #f0a8d0 50%, #ffb8c6 75%, #ffd4a8 100%)',
    },

    // Text system
    text: {
      primary: '#1a1a1a',
      secondary: '#5c5c5c',
      tertiary: '#8a8a8a',
      inverse: '#ffffff',
      accent: '#6C63FF',
      link: '#6C63FF',
    },

    // Border system — warm grays
    border: {
      primary: '#e8e5e1',
      secondary: '#f0ede9',
      tertiary: '#f5f3f0',
      focus: '#6C63FF',
    },

    // Interactive states
    interactive: {
      hover: 'rgba(108, 99, 255, 0.04)',
      active: 'rgba(108, 99, 255, 0.08)',
      focus: 'rgba(108, 99, 255, 0.15)',
      disabled: 'rgba(60, 60, 67, 0.3)',
    },

    // Gradients
    gradients: {
      primary: 'linear-gradient(135deg, #6C63FF 0%, #9F7AEA 100%)',
      hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      card: 'linear-gradient(145deg, #ffffff 0%, #faf9f7 100%)',
      glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
      subtle: 'radial-gradient(at 27% 37%, rgba(108, 99, 255, 0.06) 0px, transparent 50%), radial-gradient(at 97% 21%, rgba(159, 122, 234, 0.04) 0px, transparent 50%)',
    },
  },

  // Typography - Apple San Francisco inspired
  typography: {
    fonts: {
      primary: "'Geist', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
      mono: "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace",
      display: "'Geist', -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
    },

    sizes: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      md: '1rem',         // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
      '6xl': '3.75rem',   // 60px
      '7xl': '4.5rem',    // 72px
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
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },

    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
    },
  },

  // Spacing - Apple's 8px grid system
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

  // Border radius - Apple's rounded corners
  radii: {
    none: '0',
    xs: '0.125rem',      // 2px
    sm: '0.25rem',       // 4px
    md: '0.5rem',        // 8px
    lg: '0.75rem',       // 12px
    xl: '1rem',          // 16px
    '2xl': '1.5rem',     // 24px
    '3xl': '2rem',       // 32px
    full: '9999px',

    // Apple-specific
    card: '1.25rem',     // 20px - Apple card radius
    button: '0.5rem',    // 8px - Apple button radius
    input: '0.75rem',    // 12px - Apple input radius
  },

  // Shadows — multi-layer with inset borders (Lovable-style)
  shadows: {
    xs: '0 0 0 0.5px rgba(0,0,0,0.08), 0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px rgba(0,0,0,0.04)',
    sm: '0 0 0 0.5px rgba(0,0,0,0.08), 0 2px 4px -1px rgba(0,0,0,0.06), 0 4px 6px -2px rgba(0,0,0,0.05), inset 0 -1px 0 0 rgba(0,0,0,0.06)',
    md: '0 0 0 0.5px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.1), 0 10px 15px -3px rgba(0,0,0,0.08), inset 0 -1px 0 0 rgba(0,0,0,0.06)',
    lg: '0 0 0 0.5px rgba(0,0,0,0.08), 0 10px 15px -3px rgba(0,0,0,0.08), 0 20px 25px -5px rgba(0,0,0,0.06), inset 0 -1px 0 0 rgba(0,0,0,0.06)',
    xl: '0 0 0 0.5px rgba(0,0,0,0.08), 0 20px 25px -5px rgba(0,0,0,0.1), 0 25px 50px -12px rgba(0,0,0,0.06)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

    // Surface shadows
    card: '0 0 0 0.5px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08), inset 0 -1px 0 0 rgba(0,0,0,0.04)',
    button: '0 0 0 0.5px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.15)',
    glass: '0 0 0 0.5px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.1)',
    hero: '0 32px 64px rgba(0, 0, 0, 0.12)',

    // Inner shadows
    inset: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
  },

  // Breakpoints - Apple's responsive breakpoints
  breakpoints: {
    xs: '375px',         // iPhone SE
    sm: '640px',         // Small tablets
    md: '768px',         // iPad
    lg: '1024px',        // iPad Pro
    xl: '1280px',        // Desktop
    '2xl': '1536px',     // Large desktop
    '3xl': '1920px',     // Ultra-wide
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

  // Transitions - Apple's easing curves
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',

    // Lovable-style
    apple: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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