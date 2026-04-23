/**
 * FilterChip tokens — companion to buttonTokens.
 *
 * Same philosophy: edit here, every filter chip across the site updates at once.
 *
 * Used by:
 *   - <FilterChip> in shared
 *   - TemplatesPage / TemplatesGallery filters
 *   - WidgetStudioPage category filters
 *
 * ## Anatomy
 *
 * A chip has TWO states driven by an `$active` boolean prop:
 *   inactive  — resting (white bg, muted fg)
 *   active    — selected (dark bg, white fg)
 *
 * Plus a hover for each state. One single size — 32px tall.
 */

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
   SIZE — single 32px chip to align with Button $size="sm".
   ──────────────────────────────────────────────────────────────── */

export const filterChipSize = {
  height: '32px',
  padding: '0 14px',
  fontSize: '12px',
  radius: '10px',
} as const;

/* ────────────────────────────────────────────────────────────────
   SHAPE — choose per use-site via <FilterChip $shape="rect"|"pill">.
     rect  — rounded square (default). Use when chips sit in a toolbar /
             filter row inside a card; reads as a disclosed group.
     pill  — fully pill-rounded. Use when chips float on bare canvas or
             need a softer "Notion-embed" feel. Same height, same palette.
   Single source — edit here, every FilterChip call-site follows.
   ──────────────────────────────────────────────────────────────── */

export type FilterChipShape = 'rect' | 'pill';

export const filterChipShape: Record<FilterChipShape, string> = {
  rect: '10px',
  pill: '999px',
};

/* ────────────────────────────────────────────────────────────────
   MOTION
   ──────────────────────────────────────────────────────────────── */

export const filterChipTransition =
  'background 0.18s cubic-bezier(0.22, 1, 0.36, 1), ' +
  'color 0.18s cubic-bezier(0.22, 1, 0.36, 1), ' +
  'border-color 0.18s cubic-bezier(0.22, 1, 0.36, 1)';
