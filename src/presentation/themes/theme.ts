import { widgetColors } from './colors';

export const theme = {
  colors: {
    // Brand — real accent used across the app (indigo, not iOS blue).
    // `accent` kept as #6366F1 (indigo-500) — matches Studio/Badges/Login.
    accent: '#6366F1',
    accentLight: '#818CF8',         // indigo-400 (gradient partner)
    accentDark: '#4F46E5',          // indigo-600 (pressed state)
    accentHover: '#5457EE',

    // Semantic brand set — consolidates scattered #6366F1 / #818CF8 / #4F46E5
    brand: {
      indigo: '#6366F1',
      indigoLight: '#818CF8',
      indigoDark: '#4F46E5',
      blue: '#3384F4',              // secondary CTA (mobile copy btn)
      blueLight: '#5BA0F7',
    },

    // Semantic status — each gets bg/border/text for banners/buttons/pills
    success: '#22C55E',
    successFg: '#16A34A',           // text-on-light
    successDark: '#15803D',
    successBg: 'rgba(34, 197, 94, 0.08)',
    successBorder: 'rgba(34, 197, 94, 0.25)',
    successText: '#166534',

    warning: '#F59E0B',
    warningBg: 'rgba(245, 158, 11, 0.08)',
    warningBorder: 'rgba(245, 158, 11, 0.25)',
    warningText: '#92400E',

    destructive: '#DC2626',
    destructiveSoft: '#F49B8B',     // muted danger used in studio delete btn
    destructiveBg: 'rgba(220, 38, 38, 0.06)',
    destructiveBorder: 'rgba(220, 38, 38, 0.15)',
    destructiveText: '#DC2828',

    // Widget colors
    widgets: widgetColors,

    // Background system
    background: {
      page: '#FFFFFF',
      surface: '#F2F2F7',           // iOS systemGroupedBackground
      surfaceAlt: '#FAFAFA',        // the lightest neutral used in Login/Studio
      surfaceMuted: '#F5F5F5',      // TabBar, pills, ConfirmEmail bg
      surfaceCool: '#F8F8F7',       // artboard bg
      elevated: '#FFFFFF',
      glass: 'rgba(255, 255, 255, 0.72)',
      glassBright: 'rgba(255, 255, 255, 0.94)', // floating toolbar
      dark: '#1c1c1e',
      darkSecondary: '#2c2c2e',
      mesh: 'linear-gradient(135deg, #a8c0ff 0%, #c4a8ff 25%, #f0a8d0 50%, #ffb8c6 75%, #ffd4a8 100%)',
    },

    // Text system — iOS hierarchy, expanded with mid-tones used across pages
    text: {
      primary: '#1F1F1F',           // soft black (real primary)
      secondary: '#3C3C43',
      tertiary: '#8E8E93',
      muted: '#C7C7CC',
      subtle: '#999999',            // light grey labels (Studio counts)
      hint: '#777777',               // placeholder-ish
      body: '#555555',               // long-form text
      dim: '#666666',                // card meta, subtitles
      inverse: '#ffffff',
      accent: '#6366F1',
      link: '#6366F1',
    },

    // Border system
    border: {
      light: 'rgba(60, 60, 67, 0.08)',
      medium: 'rgba(60, 60, 67, 0.15)',
      subtle: 'rgba(0, 0, 0, 0.06)',
      focus: '#6366F1',
    },

    // Interactive states
    interactive: {
      hover: 'rgba(0, 0, 0, 0.04)',
      active: 'rgba(0, 0, 0, 0.06)',
      accentHover: 'rgba(99, 102, 241, 0.08)',
      accentActive: 'rgba(99, 102, 241, 0.12)',
      disabled: 'rgba(60, 60, 67, 0.18)',
    },

    // Gradients — covers every scattered linear-gradient in the codebase
    gradients: {
      primary: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
      indigo: 'linear-gradient(135deg, #6366F1, #818CF8)',
      indigoDeep: 'linear-gradient(135deg, #4F46E5, #6366F1)',
      blue: 'linear-gradient(135deg, #3384F4, #5BA0F7)',
      hero: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
      card: 'linear-gradient(145deg, #ffffff 0%, #faf9f7 100%)',
      softBanner: 'linear-gradient(135deg, rgba(237,228,255,0.6) 0%, rgba(232,237,255,0.5) 40%, rgba(245,235,250,0.55) 100%)',
      softBannerHover: 'linear-gradient(135deg, rgba(237,228,255,0.75) 0%, rgba(232,237,255,0.65) 40%, rgba(245,235,250,0.7) 100%)',
      templateCard: 'linear-gradient(180deg, #FAFAFC 0%, #F6F6FA 50%, #F0F0F8 100%)',
      glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
      avatar: 'linear-gradient(135deg, #EDE4FF, #E0E8FF)',
    },

    // Shadows that reference brand color (for accent buttons)
    accentShadow: {
      sm: '0 1px 4px rgba(99, 102, 241, 0.25)',
      md: '0 2px 8px rgba(99, 102, 241, 0.25)',
      lg: '0 8px 24px rgba(99, 102, 241, 0.35)',
    },
    blueShadow: {
      md: '0 2px 8px rgba(51, 132, 244, 0.3)',
    },
    successShadow: {
      md: '0 2px 8px rgba(34, 197, 94, 0.3)',
    },
  },

  // Typography
  typography: {
    fonts: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
      mono: "'JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', monospace",
    },

    // Full scale that matches real usage across pages.
    // Note: 10/11/12 are for pill/badge micro-text only.
    sizes: {
      '2xs': '10px',                 // CardBadge, MobileSectionTab
      xs: '11px',                    // Pro pill, CardBadge
      sm: '12px',                    // captions, muted labels
      md: '13px',                    // small body, buttons, filter chips
      base: '14px',                  // default body / CTA label
      lg: '15px',                    // emphasised body (SectionTitle sm)
      xl: '16px',                    // link text, navbar items
      '2xl': '18px',                 // section headlines
      '3xl': '20px',                 // SectionTitle
      '4xl': '22px',                 // large section
      '5xl': '26px',                 // mobile page title
      '6xl': '28px',                 // welcome h1
      '7xl': '32px',                 // hero / page title
      '8xl': '40px',                 // landing hero (if needed)
    },

    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },

    lineHeights: {
      tight: 1.2,
      snug: 1.3,
      normal: 1.5,
      relaxed: 1.6,
    },

    letterSpacing: {
      widest: '0.06em',              // UPPERCASE pills
      normal: '0',
      loose: '-0.005em',
      tight: '-0.01em',
      tighter: '-0.02em',
      tightest: '-0.03em',           // big headlines
    },
  },

  // Spacing — 4-point grid
  spacing: {
    '0': '0',
    '1': '4px',
    '2': '8px',
    '3': '12px',
    '4': '16px',
    '5': '20px',
    '6': '24px',
    '7': '28px',
    '8': '32px',
    '9': '36px',
    '10': '40px',
    '12': '48px',
    '14': '56px',
    '16': '64px',
    '20': '80px',
    '24': '96px',
  },

  // Border radius — consolidated (removed duplicate `button`; use `md`).
  // If you need the old `button` token, import `radii.md` — they were equal.
  radii: {
    xs: '4px',
    sm: '8px',
    md: '12px',                     // default for buttons, inputs, pills
    button: '12px',                 // alias of md — legacy; prefer `md` in new code
    lg: '16px',                     // cards
    xl: '20px',                     // large cards, sheets
    '2xl': '24px',                  // hero cards, carousel
    '3xl': '28px',
    full: '9999px',
  },

  // Shadows
  shadows: {
    form: '0 0.5px 1px rgba(0, 0, 0, 0.04), 0 0 0 0.5px rgba(0, 0, 0, 0.03)',
    subtle: '0 1px 3px rgba(0, 0, 0, 0.04), 0 0 0 0.5px rgba(0, 0, 0, 0.02)',
    card: '0 2px 12px rgba(0, 0, 0, 0.03)',
    cardHover: '0 4px 20px rgba(0, 0, 0, 0.05)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.08), 0 0 0 0.5px rgba(0, 0, 0, 0.02)',
    heavy: '0 16px 48px rgba(0, 0, 0, 0.12), 0 0 0 0.5px rgba(0, 0, 0, 0.04)',
    tab: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
    floating: '0 8px 40px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06)',
    modal: '0 32px 80px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.06)',
    sheet: '0 -8px 40px rgba(0, 0, 0, 0.1)',
  },

  // Breakpoints
  breakpoints: {
    xs: '380px',
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },

  // Z-index
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

  // Transitions
  transitions: {
    fast: '0.15s ease',
    base: '0.25s ease',
    smooth: '0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    spring: '0.28s cubic-bezier(0.22, 1, 0.36, 1)',
  },

  // Blur
  blur: {
    sm: '4px',
    base: '10px',
    md: '20px',
    lg: '40px',
  },

  // Button sizes — expanded to cover real usage
  buttons: {
    xs: { height: '28px', padding: '0 12px', radius: '8px', fontSize: '12px' },
    sm: { height: '32px', padding: '0 14px', radius: '10px', fontSize: '12px' },
    md: { height: '36px', padding: '0 16px', radius: '10px', fontSize: '13px' },
    lg: { height: '44px', padding: '0 20px', radius: '12px', fontSize: '14px' },
    xl: { height: '48px', padding: '0 24px', radius: '12px', fontSize: '14px' },
    icon: { size: '40px', radius: '10px' },
  },
} as const;

export type Theme = typeof theme;
