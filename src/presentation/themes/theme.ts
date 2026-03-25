import { widgetColors } from './colors';

export const theme = {
  colors: {
    // Brand
    accent: '#007AFF',              // iOS blue
    accentLight: '#5AC8FA',
    success: '#34C759',             // iOS green
    warning: '#FF9F0A',             // iOS orange
    destructive: '#FF3B30',         // iOS red

    // Widget colors
    widgets: widgetColors,

    // Background system
    background: {
      page: '#FFFFFF',
      surface: '#F2F2F7',           // iOS systemGroupedBackground
      elevated: '#FFFFFF',
      glass: 'rgba(255, 255, 255, 0.72)',
      dark: '#1c1c1e',
      darkSecondary: '#2c2c2e',
      mesh: 'linear-gradient(135deg, #a8c0ff 0%, #c4a8ff 25%, #f0a8d0 50%, #ffb8c6 75%, #ffd4a8 100%)',
    },

    // Text system — iOS hierarchy
    text: {
      primary: '#1F1F1F',           // soft black
      secondary: '#3C3C43',         // iOS secondaryLabel (with opacity in iOS, solid here)
      tertiary: '#8E8E93',          // iOS tertiaryLabel
      muted: '#C7C7CC',             // iOS separator-level
      inverse: '#ffffff',
      accent: '#007AFF',
      link: '#007AFF',
    },

    // Border system — iOS separator style
    border: {
      light: 'rgba(60, 60, 67, 0.08)',    // iOS separator
      medium: 'rgba(60, 60, 67, 0.15)',    // iOS opaqueSeparator
      focus: '#007AFF',
    },

    // Interactive states
    interactive: {
      hover: 'rgba(0, 0, 0, 0.04)',
      active: 'rgba(0, 0, 0, 0.06)',
      accentHover: 'rgba(0, 122, 255, 0.08)',
      accentActive: 'rgba(0, 122, 255, 0.12)',
      disabled: 'rgba(60, 60, 67, 0.18)',
    },

    // Gradients
    gradients: {
      primary: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
      hero: 'linear-gradient(135deg, #007AFF 0%, #0055D4 100%)',
      card: 'linear-gradient(145deg, #ffffff 0%, #faf9f7 100%)',
      glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
    },
  },

  // Typography — SF Pro / Inter
  typography: {
    fonts: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
      mono: "'JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', monospace",
    },

    sizes: {
      xs: '11px',
      sm: '12px',
      md: '13px',
      base: '14px',
      lg: '16px',
      xl: '18px',
      '2xl': '22px',
      '3xl': '28px',
      '4xl': '34px',
    },

    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },

    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.6,
    },

    letterSpacing: {
      tight: '-0.02em',
      normal: '-0.01em',
      none: '0',
    },
  },

  // Spacing — 8pt grid (iOS standard)
  spacing: {
    '1': '4px',
    '2': '8px',
    '3': '12px',
    '4': '16px',
    '5': '20px',
    '6': '24px',
    '8': '32px',
    '10': '40px',
    '12': '48px',
    '16': '64px',
    '20': '80px',
  },

  // Border radius — iOS style (smaller, tighter)
  radii: {
    sm: '8px',
    button: '12px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    full: '9999px',
  },

  // Shadows — iOS layered style
  shadows: {
    form: '0 0.5px 1px rgba(0, 0, 0, 0.04), 0 0 0 0.5px rgba(0, 0, 0, 0.03)',
    subtle: '0 1px 3px rgba(0, 0, 0, 0.04), 0 0 0 0.5px rgba(0, 0, 0, 0.02)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.08), 0 0 0 0.5px rgba(0, 0, 0, 0.02)',
    heavy: '0 16px 48px rgba(0, 0, 0, 0.12), 0 0 0 0.5px rgba(0, 0, 0, 0.04)',
  },

  // Breakpoints
  breakpoints: {
    xs: '380px',
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },

  // Z-index system
  zIndex: {
    base: 0,
    docked: 10,
    sticky: 1020,
    overlay: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1090,
    debug: 99999,
  },

  // Transitions — iOS-style spring
  transitions: {
    fast: '0.15s ease',
    base: '0.25s ease',
    smooth: '0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',    // iOS spring
  },

  // Blur effects — iOS vibrancy
  blur: {
    sm: '4px',
    base: '10px',
    md: '20px',
    lg: '40px',
  },

  // Button sizes
  buttons: {
    sm: { height: '36px', padding: '0 16px', radius: '12px', fontSize: '13px' },
    lg: { height: '44px', padding: '0 20px', radius: '12px', fontSize: '15px' },
    icon: { size: '40px', radius: '12px' },
  },
} as const;

export type Theme = typeof theme;
