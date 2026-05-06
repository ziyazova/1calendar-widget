// Single source of truth for the brand's public-facing host.
//
// Derived from VITE_EMBED_BASE_URL so changing the embed domain (and the
// rest of the site) only requires editing one Vercel env var. The placeholder
// shown when a widget becomes unavailable reads BRAND_DOMAIN, so it always
// reflects the current live host.

const rawBase: string =
  (import.meta.env.VITE_EMBED_BASE_URL as string | undefined) ?? '';

export const BRAND_DOMAIN: string =
  rawBase
    .replace(/\s+/g, '')
    .replace(/^https?:\/\//, '')
    .replace(/\/+$/, '') || 'peachyplanner.vercel.app';
