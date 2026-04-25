export interface SegmentStateTokens {
  bg: string;
  fg: string;
  shadow: string;
}

export interface SegmentTokens {
  inactive: SegmentStateTokens;
  inactiveHover: SegmentStateTokens;
  active: SegmentStateTokens;
}

export const segmentTokens: SegmentTokens = {
  inactive: {
    bg: 'transparent',
    fg: '#8E8E93',
    shadow: 'none',
  },
  inactiveHover: {
    bg: 'transparent',
    fg: '#1F1F1F',
    shadow: 'none',
  },
  active: {
    bg: '#FFFFFF',
    fg: '#6366F1',
    shadow: '0 1px 2px rgba(99, 102, 241, 0.10), 0 1px 3px rgba(0, 0, 0, 0.05)',
  },
};


export const segmentSize = {
  height: '40px',
  padding: '0 36px',
  fontSize: '14px',
  innerRadius: '12px',
  gap: '4px',
} as const;

export const segmentGroupSize = {
  outerRadius: '12px',
  outerPadding: '4px',
  bg: '#EEEEEE',
} as const;

export const segmentTransition =
  'background 0.25s cubic-bezier(0.22, 1, 0.36, 1), ' +
  'color 0.25s cubic-bezier(0.22, 1, 0.36, 1), ' +
  'box-shadow 0.25s cubic-bezier(0.22, 1, 0.36, 1)';
