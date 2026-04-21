/**
 * Button tokens — single source of truth for every Button variant + size.
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │  Change a value here → every <Button> across the whole app updates.  │
 * │  That's the point. No more hunting styles in other files.            │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * ## Anatomy of a variant
 *
 * Each variant has three *states* — how it looks at rest (`base`), on hover,
 * and when pressed (`active`). For each state you can set any combination of:
 *
 *   bg         — background (solid color, gradient, or rgba)
 *   fg         — text color
 *   border     — full border shorthand (e.g. `1px solid rgba(0,0,0,0.08)`)
 *   shadow     — full box-shadow value (multi-liehffne OK)
 *   transform  — hover lift etc (e.g. `translateY(-0.5px)`)
 *   fontWeight — only on `base` — 500 for neutral, 600 for emphasis CTAs
 *
 * Only keys set on `hover`/`active` override the `base`. Omit a key to inherit.
 *
 * ## Anatomy of a size
 *
 * height · padding · radius · fontSize · iconSize — all in px strings.
 * Adjust once, ripples through every use-site.
 *
 * ## Adding a new variant
 *
 * 1. Add the literal string to `ButtonVariant` union in `Button.tsx`.
 * 2. Add a new entry to `buttonVariantTokens` below.
 * 3. (Optional) Add to `emphasisVariants` if it's a filled CTA that deserves
 *    semibold weight.
 *
 * That's it. No CSS to write in Button.tsx itself.
 *
 * ## Adding a new size
 *
 * Same pattern: extend `ButtonSize`, add an entry in `buttonSizeTokens`.
 *
 * ## Cheatsheet for common tweaks
 *
 * - Change the indigo-accent gradient:        `accent.base.bg` (and hover/active)
 * - Make primary less "carved":               tweak `primary.base.shadow`
 * - Unify radius at 12px everywhere:          bump `sm`/`md` radius to `'12px'`
 * - Soften danger red:                        `danger.base.fg` / `dangerStrong.base.fg`
 * - Add a tiny lift on ghost:                 `ghost.hover.transform`
 *
 * See original spec: `01-buttons.standalone.html` (Before/After) + HANDOFF-buttons.md.
 */

export type ButtonVariant =
  | 'primary'
  | 'accent'
  | 'upgrade'
  | 'blue'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'dangerStrong'
  | 'success'
  | 'link';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonStateTokens {
  bg?: string;
  fg?: string;
  border?: string;
  shadow?: string;
  transform?: string;
  fontWeight?: number;
}

export interface ButtonVariantTokens {
  base: ButtonStateTokens;
  hover?: ButtonStateTokens;
  active?: ButtonStateTokens;
}

export interface ButtonSizeTokens {
  height: string;
  padding: string;
  radius: string;
  fontSize: string;
  iconSize: string;
  gap?: string;
}

/* ────────────────────────────────────────────────────────────────
   SIZES
   ──────────────────────────────────────────────────────────────── */

export const buttonSizeTokens: Record<ButtonSize, ButtonSizeTokens> = {
  xs: { height: '28px', padding: '0 12px', radius: '8px',  fontSize: '12px', iconSize: '12px' },
  sm: { height: '32px', padding: '0 14px', radius: '10px', fontSize: '12px', iconSize: '14px' },
  md: { height: '36px', padding: '0 16px', radius: '10px', fontSize: '13px', iconSize: '14px' },
  lg: { height: '44px', padding: '0 20px', radius: '12px', fontSize: '14px', iconSize: '16px' },
  xl: { height: '48px', padding: '0 24px', radius: '12px', fontSize: '14px', iconSize: '16px' },
};

export const sizePxMap: Record<ButtonSize, number> = {
  xs: 28, sm: 32, md: 36, lg: 44, xl: 48,
};

/* ────────────────────────────────────────────────────────────────
   VARIANT PALETTES
   ──────────────────────────────────────────────────────────────── */

/** Primary — Apple-style carved black with top→bottom depth + inset highlights. */
const primary: ButtonVariantTokens = {
  base: {
    bg: 'linear-gradient(180deg, #2A2A2A 0%, #1F1F1F 100%)',
    fg: '#ffffff',
    shadow:
      'inset 0 1px 0 rgba(255, 255, 255, 0.1), ' +
      'inset 0 -1px 0 rgba(0, 0, 0, 0.3), ' +
      '0 1px 2px rgba(0, 0, 0, 0.08), ' +
      '0 2px 6px rgba(0, 0, 0, 0.08)',
    fontWeight: 600,
  },
  hover: {
    bg: 'linear-gradient(180deg, #333333 0%, #262626 100%)',
    transform: 'translateY(-0.5px)',
    shadow:
      'inset 0 1px 0 rgba(255, 255, 255, 0.12), ' +
      'inset 0 -1px 0 rgba(0, 0, 0, 0.3), ' +
      '0 2px 4px rgba(0, 0, 0, 0.1), ' +
      '0 6px 14px rgba(0, 0, 0, 0.12)',
  },
  active: {
    bg: 'linear-gradient(180deg, #1a1a1a 0%, #141414 100%)',
    transform: 'translateY(0)',
    shadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.06)',
  },
};

/** Accent — 3-stop indigo gradient with matching inset highlights. Pro/Upgrade CTA. */
const accent: ButtonVariantTokens = {
  base: {
    bg: 'linear-gradient(135deg, #6366F1 0%, #7079F4 50%, #818CF8 100%)',
    fg: '#ffffff',
    shadow:
      'inset 0 1px 0 rgba(255, 255, 255, 0.25), ' +
      'inset 0 -1px 0 rgba(79, 70, 229, 0.3), ' +
      '0 1px 2px rgba(99, 102, 241, 0.15), ' +
      '0 4px 12px rgba(99, 102, 241, 0.28)',
    fontWeight: 600,
  },
  hover: {
    bg: 'linear-gradient(135deg, #5558EE 0%, #6872F0 50%, #7984F6 100%)',
    transform: 'translateY(-0.5px)',
    shadow:
      'inset 0 1px 0 rgba(255, 255, 255, 0.28), ' +
      'inset 0 -1px 0 rgba(79, 70, 229, 0.35), ' +
      '0 2px 4px rgba(99, 102, 241, 0.2), ' +
      '0 8px 24px rgba(99, 102, 241, 0.4)',
  },
  active: {
    bg: 'linear-gradient(135deg, #4F46E5 0%, #5A5EE8 50%, #6B75ED 100%)',
    transform: 'translateY(0)',
    shadow: 'inset 0 1px 3px rgba(79, 70, 229, 0.3), 0 1px 2px rgba(99, 102, 241, 0.15)',
  },
};

/** Upgrade — outlined with sparkle. Lighter-weight Pro CTA for inline
 *  spots, toolbars, and cards. Use when `accent` filled would be too loud.
 *  Pair with a <Sparkles /> icon. */
const upgrade: ButtonVariantTokens = {
  base: {
    bg: 'rgba(99, 102, 241, 0.05)',
    fg: '#4F46E5',
    border: '1px solid #6366F1',
    shadow: '0 1px 2px rgba(99, 102, 241, 0.08)',
    fontWeight: 600,
  },
  hover: {
    bg: 'rgba(99, 102, 241, 0.11)',
    fg: '#4338CA',
    border: '1px solid #4F46E5',
    transform: 'translateY(-0.5px)',
    shadow: '0 3px 12px rgba(99, 102, 241, 0.18)',
  },
  active: {
    bg: 'rgba(99, 102, 241, 0.10)',
    transform: 'translateY(0)',
    shadow: '0 1px 2px rgba(99, 102, 241, 0.14)',
  },
};

/** Blue — solid sky blue with colored shadow. Copy/share CTA. */
const blue: ButtonVariantTokens = {
  base: {
    bg: '#60A5FA',
    fg: '#ffffff',
    shadow: '0 1px 2px rgba(96, 165, 250, 0.24), 0 4px 14px rgba(96, 165, 250, 0.32)',
    fontWeight: 600,
  },
  hover: {
    bg: '#4F97F5',
    transform: 'translateY(-0.5px)',
    shadow: '0 2px 4px rgba(96, 165, 250, 0.28), 0 8px 22px rgba(96, 165, 250, 0.42)',
  },
  active: {
    bg: '#3B86EA',
    transform: 'translateY(0)',
    shadow: '0 1px 2px rgba(96, 165, 250, 0.28)',
  },
};

/** Secondary — Notion-style paper gradient + hairline border + inset top highlight. */
const secondary: ButtonVariantTokens = {
  base: {
    bg: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)',
    fg: '#1F1F1F',
    border: '1px solid rgba(60, 60, 67, 0.08)',
    shadow: '0 1px 2px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
  },
  hover: {
    bg: 'linear-gradient(180deg, #FAFAFA 0%, #F5F5F5 100%)',
    border: '1px solid rgba(60, 60, 67, 0.15)',
    transform: 'translateY(-0.5px)',
    shadow: '0 2px 6px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
  },
  active: {
    bg: 'linear-gradient(180deg, #F0F0F0 0%, #EAEAEA 100%)',
    transform: 'translateY(0)',
    shadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
  },
};

/** Outline — transparent + border. Subtle lift on hover. */
const outline: ButtonVariantTokens = {
  base: {
    bg: 'transparent',
    fg: '#1F1F1F',
    border: '1px solid rgba(60, 60, 67, 0.15)',
  },
  hover: {
    bg: '#FAFAFA',
    border: '1px solid rgba(60, 60, 67, 0.25)',
    transform: 'translateY(-0.5px)',
  },
  active: {
    bg: '#F5F5F5',
    transform: 'translateY(0)',
  },
};

/** Ghost — subtle hover only. Notion-style restraint. */
const ghost: ButtonVariantTokens = {
  base: {
    bg: 'transparent',
    fg: '#555555',
  },
  hover: {
    bg: 'rgba(0, 0, 0, 0.04)',
    fg: '#1F1F1F',
  },
  active: {
    bg: 'rgba(0, 0, 0, 0.06)',
  },
};

/** Danger — muted wine outline for reversible destructive actions. */
const danger: ButtonVariantTokens = {
  base: {
    bg: 'transparent',
    fg: '#B85757',
    border: '1px solid rgba(184, 87, 87, 0.22)',
  },
  hover: {
    bg: 'rgba(184, 87, 87, 0.06)',
    border: '1px solid rgba(184, 87, 87, 0.38)',
    fg: '#A14848',
    transform: 'translateY(-0.5px)',
    shadow: '0 2px 8px rgba(184, 87, 87, 0.12)',
  },
  active: {
    bg: 'rgba(184, 87, 87, 0.1)',
    transform: 'translateY(0)',
    shadow: 'none',
  },
};

/** Danger-strong — saturated red for irreversible actions (Delete account, Log out). */
const dangerStrong: ButtonVariantTokens = {
  base: {
    bg: 'transparent',
    fg: '#DC2828',
    border: '1px solid rgba(220, 38, 38, 0.15)',
  },
  hover: {
    bg: 'rgba(220, 38, 38, 0.06)',
    transform: 'translateY(-0.5px)',
    shadow: '0 2px 8px rgba(220, 38, 38, 0.12)',
  },
  active: {
    transform: 'translateY(0)',
    shadow: 'none',
  },
};

/** Success — solid emerald with colored shadow. Confirm/success CTA. */
const success: ButtonVariantTokens = {
  base: {
    bg: '#10B981',
    fg: '#ffffff',
    shadow: '0 1px 2px rgba(16, 185, 129, 0.2), 0 4px 14px rgba(16, 185, 129, 0.28)',
    fontWeight: 600,
  },
  hover: {
    bg: '#0EA472',
    transform: 'translateY(-0.5px)',
    shadow: '0 2px 4px rgba(16, 185, 129, 0.24), 0 8px 22px rgba(16, 185, 129, 0.38)',
  },
  active: {
    bg: '#0B8D62',
    transform: 'translateY(0)',
    shadow: '0 1px 2px rgba(16, 185, 129, 0.24)',
  },
};

/** Link — text-styled, underline on hover. Used inline as a CTA text. */
const link: ButtonVariantTokens = {
  base: {
    bg: 'transparent',
    fg: '#1F1F1F',
  },
  // hover styling for link is handled specially in Button.tsx (text-decoration)
};

export const buttonVariantTokens: Record<ButtonVariant, ButtonVariantTokens> = {
  primary,
  accent,
  upgrade,
  blue,
  secondary,
  outline,
  ghost,
  danger,
  dangerStrong,
  success,
  link,
};

/** Variants that deserve font-weight: 600 even if not set per-variant. */
export const emphasisVariants: ReadonlySet<ButtonVariant> = new Set([
  'primary', 'accent', 'blue', 'success',
]);

/* ────────────────────────────────────────────────────────────────
   MOTION + FOCUS
   ──────────────────────────────────────────────────────────────── */

/** Apple-spring transitions across all interactive properties. */
export const buttonTransition =
  'background 0.2s cubic-bezier(0.22, 1, 0.36, 1), ' +
  'color 0.2s cubic-bezier(0.22, 1, 0.36, 1), ' +
  'box-shadow 0.25s cubic-bezier(0.22, 1, 0.36, 1), ' +
  'transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), ' +
  'border-color 0.2s cubic-bezier(0.22, 1, 0.36, 1), ' +
  'filter 0.2s cubic-bezier(0.22, 1, 0.36, 1)';

/** Accessible focus-visible double ring. First shadow = page bg spacer. */
export const buttonFocusRing =
  '0 0 0 2px #FFFFFF, 0 0 0 4px rgba(99, 102, 241, 0.5)';

/** Disabled state — shared across variants. */
export const buttonDisabled = {
  opacity: '0.5',
  cursor: 'not-allowed' as const,
};
