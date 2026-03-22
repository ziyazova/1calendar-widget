import { widgetColors } from './colors';

export const theme = {
  colors: {
    // Brand
    accent: '#3384F4',
    accentLight: '#5BA0F7',
    success: '#22C55E',
    warning: '#F59E0B',
    destructive: '#DC2828',

    // Widget colors
    widgets: widgetColors,

    // Background system
    background: {
      page: '#FAFAFA',
      surface: '#F8F8F7',
      elevated: '#ffffff',
      glass: 'rgba(255, 255, 255, 0.72)',
      dark: '#1c1c1e',
      darkSecondary: '#2c2c2e',
      mesh: 'linear-gradient(135deg, #a8c0ff 0%, #c4a8ff 25%, #f0a8d0 50%, #ffb8c6 75%, #ffd4a8 100%)',
    },

    // Text system (4 levels only)
    text: {
      primary: '#1F1F1F',      // headings, labels, dark buttons
      secondary: '#6B6B6B',    // descriptions, icons
      tertiary: '#9A9A9A',     // placeholders, hints
      muted: '#ABABAB',        // footer, disabled, very subtle
      inverse: '#ffffff',
      accent: '#3384F4',
      link: '#3384F4',
    },

    // Border system (2 levels only)
    border: {
      light: 'rgba(0, 0, 0, 0.06)',    // cards, dividers, inputs
      medium: 'rgba(0, 0, 0, 0.12)',    // hover, active, scroll hints
      focus: '#3384F4',
    },

    // Interactive states
    interactive: {
      hover: 'rgba(0, 0, 0, 0.04)',
      active: 'rgba(0, 0, 0, 0.06)',
      accentHover: 'rgba(51, 132, 244, 0.08)',
      accentActive: 'rgba(51, 132, 244, 0.12)',
      disabled: 'rgba(60, 60, 67, 0.18)',
    },

    // Gradients
    gradients: {
      primary: 'linear-gradient(135deg, #3384F4 0%, #5BA0F7 100%)',
      hero: 'linear-gradient(135deg, #3384F4 0%, #1a6dd4 100%)',
      card: 'linear-gradient(145deg, #ffffff 0%, #faf9f7 100%)',
      glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
    },
  },

  // Typography — Inter
  typography: {
    fonts: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
      mono: "'JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', monospace",
    },

    // Simplified scale matching actual usage
    sizes: {
      xs: '11px',        // captions, badges, counters
      sm: '12px',        // small labels, slider values, tags
      md: '13px',        // buttons, nav links, form labels
      base: '14px',      // body text, descriptions, card titles
      lg: '16px',        // logo, pin titles, subtitles
      xl: '18px',        // section headings (H2)
      '2xl': '24px',     // feature card titles
      '3xl': '32px',     // page titles
      '4xl': '36px',     // CTA title, hero mobile
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

  // Spacing — 4/8pt grid
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

  // Border radius — 4 semantic levels
  radii: {
    sm: '8px',         // inputs, tags, small elements
    button: '10px',    // buttons, chips, nav items
    md: '12px',        // cards, popups, controls
    lg: '16px',        // medium cards, images
    xl: '20px',        // modals, sheets, mobile cards
    '2xl': '24px',     // large cards, hero cards, studio area
    full: '9999px',    // pills, avatars
  },

  // Shadows — 4 levels
  shadows: {
    form: '0 0.5px 1px rgba(0, 0, 0, 0.04)',          // inputs, selects, sliders
    subtle: '0 1px 4px rgba(0, 0, 0, 0.04)',           // cards at rest
    medium: '0 4px 16px rgba(0, 0, 0, 0.08)',          // hover states, popovers
    heavy: '0 8px 40px rgba(0, 0, 0, 0.12)',           // modals, floating toolbar, sheets
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

  // Transitions — 3 speeds + 1 curve
  transitions: {
    fast: '0.15s ease',                                  // micro interactions (hover, active)
    base: '0.2s ease',                                   // standard (color change, opacity)
    smooth: '0.3s cubic-bezier(0.22, 1, 0.36, 1)',      // layout shifts, slides, transforms
  },

  // Blur effects
  blur: {
    sm: '4px',
    base: '8px',
    md: '12px',
    lg: '24px',
  },

  // Button sizes
  buttons: {
    sm: { height: '36px', padding: '0 18px', radius: '10px', fontSize: '13px' },
    lg: { height: '44px', padding: '0 24px', radius: '12px', fontSize: '14px' },
    icon: { size: '40px', radius: '12px' },
  },
} as const;

export type Theme = typeof theme;
