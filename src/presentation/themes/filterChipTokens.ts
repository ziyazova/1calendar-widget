/**
 * FilterChip tokens — companion to buttonTokens.
 *
 * Same philosophy: edit here, every filter chip / tab toggle / pill-button
 * across the site updates at once.
 *
 * Used by:
 *   - <FilterChip> in shared
 *   - TemplatesPage / TemplatesGallery filters ("All · Life · Student · …")
 *   - DashboardViews widget-category filter
 *   - future dashboard sort/category pills
 *
 * ## Anatomy
 *
 * A chip has TWO states driven by an `$active` boolean prop:
 *   inactive  — resting (white bg, muted fg)
 *   active    — selected (dark bg, white fg)
 *
 * Plus hover per state.
 *
 * Sizes — match buttonTokens scale so chips align in rows with buttons:
 *   sm (32) / md (36)  — default is `md`
 */

export type FilterChipSize = 'sm' | 'md';

export interface ChipStateTokens {
  bg: string;
  fg: string;
  border: string;
}

export interface FilterChipTokens {
  inactive: ChipStateTokens;
  inactiveHover: ChipStateTokens;
  active: ChipStateTokens;
  activeHover: ChipStateTokens;
}

export interface FilterChipSizeTokens {
  height: string;
  padding: string;
  fontSize: string;
  radius: string;
}

/* ────────────────────────────────────────────────────────────────
   PALETTE
   ──────────────────────────────────────────────────────────────── */

export const filterChipTokens: FilterChipTokens = {
  inactive: {
    bg: '#FFFFFF',
    fg: '#6B6B6B',
    border: '1px solid rgba(0, 0, 0, 0.08)',
  },
  inactiveHover: {
    bg: '#F5F5F5',
    fg: '#1F1F1F',
    border: '1px solid rgba(0, 0, 0, 0.14)',
  },
  active: {
    bg: '#1F1F1F',
    fg: '#FFFFFF',
    border: '1px solid transparent',
  },
  activeHover: {
    bg: '#111111',
    fg: '#FFFFFF',
    border: '1px solid transparent',
  },
};

/* ────────────────────────────────────────────────────────────────
   SIZES
   ──────────────────────────────────────────────────────────────── */

export const filterChipSizeTokens: Record<FilterChipSize, FilterChipSizeTokens> = {
  sm: { height: '32px', padding: '0 12px', fontSize: '12px', radius: '10px' },
  md: { height: '34px', padding: '0 16px', fontSize: '13px', radius: '12px' },
};

/* ────────────────────────────────────────────────────────────────
   MOTION
   ──────────────────────────────────────────────────────────────── */

export const filterChipTransition =
  'background 0.18s cubic-bezier(0.22, 1, 0.36, 1), ' +
  'color 0.18s cubic-bezier(0.22, 1, 0.36, 1), ' +
  'border-color 0.18s cubic-bezier(0.22, 1, 0.36, 1)';
