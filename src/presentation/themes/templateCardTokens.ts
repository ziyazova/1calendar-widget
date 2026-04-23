/**
 * Template card tokens — shared visual language for every place we show
 * a template/product mockup on a soft cloudy backdrop:
 *
 *   - Landing → "Top templates" marquee
 *   - /templates grid
 *   - /templates/:id → carousel + related templates
 *   - Studio → "My Purchases" (future)
 *
 * All three sizes share the same gradient + image treatment so adding a
 * new placement is just picking a size preset rather than re-authoring
 * the look.
 */

/** Cloudy light-purple wash — same everywhere the mockup appears. */
export const templateCardGradient =
  'linear-gradient(180deg, #FAFAFC 0%, #F6F6FA 50%, #F0F0F8 100%)';

/** Inner highlight + resting shadow — matches landing marquee. */
export const templateCardShadow =
  'inset 0 1px 0 rgba(255, 255, 255, 0.7), ' +
  '0 2px 6px rgba(43, 35, 32, 0.04), ' +
  '0 12px 28px -16px rgba(43, 35, 32, 0.12)';

/** Lifted shadow when card is hovered (used on interactive variants). */
export const templateCardShadowHover =
  'inset 0 1px 0 rgba(255, 255, 255, 0.7), ' +
  '0 4px 10px rgba(43, 35, 32, 0.06), ' +
  '0 20px 44px -18px rgba(43, 35, 32, 0.2)';

export const templateCardBorder = '1px solid rgba(43, 35, 32, 0.06)';
export const templateCardBorderHover = '1px solid rgba(43, 35, 32, 0.12)';

/** Drop-shadow under the product image itself. Two presets — tighter for
    grid thumbnails, looser for the big carousel hero. */
export const templateImageShadowTight =
  'drop-shadow(0 6px 16px rgba(0, 0, 0, 0.1))';
export const templateImageShadowLoose =
  'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.12))';

/** Size presets — each one owns its aspect, image scale, and radius.
    Add a new entry here instead of forking the styled-component. */
export type TemplateCardSize = 'grid' | 'marquee' | 'hero' | 'thumb';

export const templateCardSizeTokens: Record<
  TemplateCardSize,
  {
    aspect: string;
    aspectMobile?: string;
    imageScale: string;
    imageShadow: string;
    radius: keyof typeof radiiKeys;
    radiusMobile?: keyof typeof radiiKeys;
  }
> = {
  /** /templates page — 3-column grid card. */
  grid: {
    aspect: '288 / 228',
    imageScale: '80%',
    imageShadow: templateImageShadowLoose,
    radius: '2xl',
    radiusMobile: 'lg',
  },
  /** Landing "Top templates" horizontal marquee. */
  marquee: {
    aspect: '288 / 220',
    imageScale: '80%',
    imageShadow: templateImageShadowTight,
    radius: '2xl',
    radiusMobile: 'md',
  },
  /** /templates/:id — big carousel hero slide. */
  hero: {
    aspect: '560 / 380',
    aspectMobile: '4 / 3',
    imageScale: '70%',
    imageShadow: templateImageShadowLoose,
    radius: '2xl',
    radiusMobile: 'lg',
  },
  /** Related templates rail — compact thumbnail. */
  thumb: {
    aspect: '1 / 1',
    imageScale: '80%',
    imageShadow: templateImageShadowTight,
    radius: 'md',
  },
};

/* Type-check against the theme's radii keys so the sizes above stay in
   sync if someone renames a radius. This is a compile-time guard only. */
const radiiKeys = { sm: 0, md: 0, lg: 0, xl: 0, '2xl': 0, '3xl': 0, full: 0 } as const;
