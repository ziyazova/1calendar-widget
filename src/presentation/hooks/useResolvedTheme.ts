import { useState, useEffect } from 'react';
import { getLuminance } from '../themes/colors';

type ThemeSetting = 'auto' | 'light' | 'dark';
type ResolvedTheme = 'light' | 'dark';

// Notion dark mode background
export const NOTION_DARK_BG = '#191919';

export function useResolvedTheme(theme: ThemeSetting): ResolvedTheme {
  const [systemDark, setSystemDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    if (theme !== 'auto') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  if (theme === 'light') return 'light';
  if (theme === 'dark') return 'dark';
  return systemDark ? 'dark' : 'light';
}

// Light → Dark color mappings for backgrounds (matching Notion dark theme)
const BG_DARK_MAP: Record<string, string> = {
  '#ffffff': NOTION_DARK_BG,
  '#f7f7f5': '#1E1E1C',
  '#eef1f5': '#1A1D21',
  '#f1f5f9': '#1A1E24',
  '#f8fafc': '#1B1B1B',
  '#e2e8f0': '#1D2129',
};

// Light → Dark accent mappings (subtle tints on dark surfaces)
const ACCENT_DARK_MAP: Record<string, string> = {
  '#f1f5f9': '#1F2937',
  '#e8edff': '#1E2340',
  '#eee8fa': '#261E35',
  '#fbe9e1': '#2D2220',
};

export function adaptColorForDarkMode(
  color: string,
  type: 'background' | 'accent'
): string {
  const normalized = color.toLowerCase();
  const map = type === 'background' ? BG_DARK_MAP : ACCENT_DARK_MAP;

  if (map[normalized]) return map[normalized];

  // For unknown colors, check luminance — if light, darken
  const luminance = getLuminance(color);
  if (luminance > 0.5) {
    return type === 'background' ? NOTION_DARK_BG : '#1F2937';
  }

  // Already dark — use as-is
  return color;
}
