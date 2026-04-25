import { widgetColors } from './colors';

export const theme = {
  colors: {
    // Brand — real accent used across the app (indigo, not iOS blue).
    // `accent` kept as #6366F1 (indigo-500) — matches Studio/Badges/Login.
    accent: '#6366F1',

    // Darker indigo shade (hover / pressed state partner for `accent`).
    brand: {
      indigoDark: '#4F46E5',
    },

    // State indicators — "active" / "selected" etc. `state.active` is the
    // blue used on active filter chips, mobile tabs, ready-to-copy buttons.
    // Semantically NOT brand — it's a signal of UI state.
    state: {
      active: '#3384F4',
      // 8% tint of `state.active` — used as "selected/active" wash on
      // filter chips, mobile tabs, ready-to-copy buttons.
      activeWash: 'rgba(51, 132, 244, 0.08)',
    },

    // Semantic status — nested objects so the shape matches `danger.*`.
    //   success.base  — the vivid 500-hue for filled pills / icons on dark bg
    //   success.fg    — the 600-hue for "text on light" (check icons, helper)
    //   success.dark  — the 700-hue for emphasised dark-green headlines
    //   success.bg    — 8% tinted background for inline banners
    success: {
      base: '#22C55E',
      fg: '#16A34A',
      dark: '#15803D',
      bg: 'rgba(34, 197, 94, 0.08)',
    },

    warning: {
      bg: 'rgba(245, 158, 11, 0.08)',
      border: 'rgba(245, 158, 11, 0.25)',
      text: '#92400E',
    },

    // Unified danger palette — source of truth.
    //   soft   = reversible destructive (cancel subscription, remove from cart)
    //   strong = irreversible destructive (delete account/widget, logout)
    danger: {
      soft: '#F49B8B',
      strong: '#DC2828',
      bg: 'rgba(220, 38, 38, 0.06)',
      border: 'rgba(220, 38, 38, 0.15)',
    },

    // Widget colors
    widgets: widgetColors,

    // Background system. `surfaceCool/Warm` were merged into `surfaceAlt`
    // (they differed by 1-3 value points — indistinguishable on a monitor).
    // If you need a clearly warm/cool surface later, pick a bolder tint.
    background: {
      surface: '#F2F2F7',           // iOS systemGroupedBackground
      surfaceAlt: '#FAFAFA',        // lightest neutral (Login, Studio artboard, Settings page)
      surfaceMuted: '#F5F5F5',      // TabBar, pills, ConfirmEmail bg
      elevated: '#FFFFFF',
      glassBright: 'rgba(255, 255, 255, 0.94)', // floating toolbar, cookie banner
    },

    // Text system — 6-shade hierarchy. Merges done during 2026-04-24 audit:
    //   `subtle` (#999) → `tertiary` (#8E8E93) — 11pt diff, invisible.
    //   `dim` (#666)    → `hint` (#777)        — 17pt diff, invisible.
    //   `secondary` (#3C3C43) → `body` (#555)  — 25pt diff, "mid" shade now
    //     unified across paragraphs + sidebar labels + landing subtitles.
    text: {
      primary: '#1F1F1F',           // soft black (real primary)
      body: '#555555',               // paragraphs, sidebar labels, subtitles
      hint: '#777777',               // placeholder, card meta, helper
      tertiary: '#8E8E93',          // iOS tertiaryLabel (muted label role)
      muted: '#C7C7CC',             // most-faded / disabled
      inverse: '#ffffff',
    },

    // Peach / warm palette — used on /widgets landing (WidgetStudioPage).
    // Warmer, beige-tinted alternative to the cool grey `text.*` set.
    // Do NOT use these in the app-internal UI (Studio / Dashboard / Settings).
    peach: {
      deep: '#2B2320',              // warm near-black — HeroTitle, EmailInput text
      inkSoft: '#4A433D',           // warm mid-brown — secondary headings on warm bg
      muted: '#9B9790',             // warm body grey — HeroDesc
      hint: '#B5B1A9',              // warm placeholder — EmailInput placeholder, AuthDivider
      light: '#FFD9B8',             // soft peach accent — hero blob / card bg
      deepWarm: '#F4A672',          // orange-peach — hero CTA / template tag
      rose: '#F3C6C6',              // dusty rose — secondary hero accent
    },

    // Border system. `hairline` is the ubiquitous 6% black line used for
    // cards / dividers (ex `rgba(0,0,0,0.06)`). `hairlineHover` is the
    // 10% version used on card hover.
    border: {
      light: 'rgba(60, 60, 67, 0.08)',
      medium: 'rgba(60, 60, 67, 0.15)',
      subtle: 'rgba(0, 0, 0, 0.06)',
      hairline: 'rgba(0, 0, 0, 0.06)',
      hairlineHover: 'rgba(0, 0, 0, 0.1)',
    },

    // Interactive states — hover/active overlays
    interactive: {
      hover: 'rgba(0, 0, 0, 0.04)',
      active: 'rgba(0, 0, 0, 0.06)',
      accentHover: 'rgba(99, 102, 241, 0.08)',
    },

    // Gradients — only what's actually used in the codebase.
    // Orphans removed 2026-04-24 (primary/indigoDeep/hero/card/glass/
    // softBannerHover/templateCard). Re-add if a new use-case needs them.
    gradients: {
      indigo: 'linear-gradient(135deg, #6366F1, #818CF8)',
      blue: 'linear-gradient(135deg, #3384F4, #5BA0F7)',
      softBanner: 'linear-gradient(135deg, rgba(237,228,255,0.6) 0%, rgba(232,237,255,0.5) 40%, rgba(245,235,250,0.55) 100%)',
      softBannerLarge: 'linear-gradient(150deg, rgba(237, 228, 255, 0.7) 0%, rgba(232, 237, 255, 0.65) 25%, rgba(238, 234, 255, 0.6) 50%, rgba(245, 235, 250, 0.65) 75%, rgba(255, 240, 245, 0.7) 100%)',
      avatarPeach: 'linear-gradient(135deg, #FFD4BE 0%, #FDB8AE 45%, #F8A2B0 100%)',
    },

    // Shadows that reference brand color (for accent buttons)
    accentShadow: {
      sm: '0 1px 4px rgba(99, 102, 241, 0.25)',
    },
    blueShadow: {
      md: '0 2px 8px rgba(51, 132, 244, 0.3)',
    },
    avatarPeachShadow:
      'inset 0 1px 0 rgba(255, 255, 255, 0.45), ' +
      '0 1px 2px rgba(180, 100, 140, 0.2), ' +
      '0 2px 10px rgba(180, 100, 140, 0.22)',
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

  // Shadows — 11 elevation tiers from form-field hairline to modal float.
  // `medium` and `tab` removed: medium (0 4px 16px / 0.08) merged into
  // cardHover (0 4px 20px / 0.05), tab was unused. Stay close to a preset
  // when adding new — don't duplicate near-identical values.
  shadows: {
    form: '0 0.5px 1px rgba(0, 0, 0, 0.04), 0 0 0 0.5px rgba(0, 0, 0, 0.03)',
    subtle: '0 1px 3px rgba(0, 0, 0, 0.04), 0 0 0 0.5px rgba(0, 0, 0, 0.02)',
    cardFlat: '0 1px 2px rgba(0, 0, 0, 0.02)',  // near-invisible hairline — calm flat surfaces (Settings Section)
    card: '0 2px 12px rgba(0, 0, 0, 0.03)',
    cardHover: '0 4px 20px rgba(0, 0, 0, 0.05)',
    heavy: '0 16px 48px rgba(0, 0, 0, 0.12), 0 0 0 0.5px rgba(0, 0, 0, 0.04)',
    floating: '0 8px 40px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06)',
    modal: '0 32px 80px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.06)',
    sheet: '0 -8px 40px rgba(0, 0, 0, 0.1)',
    // Dropdown / popover — sidebar account menu, style picker popover.
    popover: '0 4px 24px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04)',
    // Focus ring on blue inputs/tabs (secondary state).
    focusBlue: '0 0 0 3px rgba(51, 132, 244, 0.1)',
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

  // Transitions — 4 motion presets. `smooth` (0.35s gentle slide) was
  // removed for being unused; pick the closest preset before writing
  // a custom timing.
  transitions: {
    fast: '0.15s ease',      // micro-interactions: hover, color fade
    medium: '0.2s ease',     // mid-speed hover, padding shift
    base: '0.25s ease',      // default — card hover, panel open
    spring: '0.28s cubic-bezier(0.22, 1, 0.36, 1)',  // punchy pop — popovers, dropdowns
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
