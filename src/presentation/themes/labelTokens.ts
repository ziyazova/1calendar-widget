export type LabelVariant =
  | 'pro'
  | 'free'
  | 'new'
  | 'limited'
  | 'popular'
  | 'neutral';

export type LabelSize = 'sm' | 'md';

export interface LabelStateTokens {
  bg: string;
  fg: string;
  border?: string;
  shadow?: string;
  dot?: boolean;
}

export const labelVariantTokens: Record<LabelVariant, LabelStateTokens> = {
  pro: {
    bg: 'rgba(110, 127, 242, 0.1)',
    fg: '#4F57C9',
  },
  free: {
    bg: 'rgba(102, 168, 92, 0.14)',
    fg: '#3E7A2F',
  },
  new: {
    bg: 'rgba(232, 155, 155, 0.16)',
    fg: '#A85B5B',
    dot: true,
  },
  limited: {
    bg: 'rgba(143, 166, 200, 0.16)',
    fg: '#556B8C',
    dot: true,
  },
  popular: {
    bg: '#6366F1',
    fg: '#FFFFFF',
  },
  neutral: {
    bg: 'rgba(31, 31, 31, 0.05)',
    fg: '#4A433D',
  },
};

export const labelSizeTokens: Record<LabelSize, {
  height: string;
  padding: string;
  fontSize: string;
  fontWeight: number;
  radius: string;
  iconSize: string;
  dotSize: string;
  gap: string;
}> = {
  sm: {
    height: '22px',
    padding: '0 10px',
    fontSize: '11px',
    fontWeight: 700,
    radius: '999px',
    iconSize: '11px',
    dotSize: '4px',
    gap: '5px',
  },
  md: {
    height: '28px',
    padding: '0 14px',
    fontSize: '11px',
    fontWeight: 500,
    radius: '999px',
    iconSize: '12px',
    dotSize: '5px',
    gap: '6px',
  },
};

export const labelLetterSpacing = '0.06em';

export const labelTransition =
  'background 0.15s ease, border-color 0.15s ease';

/** Plan badge — compact sm size with gradient fill on Pro. */
export const planBadgeTokens = {
  pro: {
    bg: 'linear-gradient(135deg, #6366F1, #818CF8)',
    fg: '#FFFFFF',
    shadow: '0 1px 4px rgba(99, 102, 241, 0.25)',
    border: 'none',
  },
  free: {
    bg: '#F2F2EF',
    fg: '#6E6E73',
    shadow: 'none',
    border: '1px solid rgba(0, 0, 0, 0.04)',
  },
};
