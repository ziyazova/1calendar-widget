export type InputSize = 'md' | 'lg';
export type InputState = 'default' | 'focused' | 'error' | 'success' | 'disabled';

export const inputSizeTokens: Record<InputSize, {
  height: string;
  padding: string;
  iconPadding: string;
  radius: string;
  fontSize: string;
  iconSize: string;
  iconLeft: string;
}> = {
  md: {
    height: '34px',
    padding: '0 12px',
    iconPadding: '0 12px 0 38px',
    radius: '12px',
    fontSize: '13px',
    iconSize: '14px',
    iconLeft: '12px',
  },
  lg: {
    height: '44px',
    padding: '0 16px',
    iconPadding: '0 16px 0 44px',
    radius: '12px',
    fontSize: '14px',
    iconSize: '18px',
    iconLeft: '16px',
  },
};

export const inputStateTokens: Record<InputState, {
  bg: string;
  border: string;
  fg: string;
  iconColor: string;
  shadow: string;
}> = {
  default: {
    bg: '#FFFFFF',
    border: '1px solid rgba(60, 60, 67, 0.15)',
    fg: '#1F1F1F',
    iconColor: '#8E8E93',
    shadow: 'none',
  },
  focused: {
    bg: '#FFFFFF',
    border: '1.5px solid #6366F1',
    fg: '#1F1F1F',
    iconColor: '#6366F1',
    shadow: '0 0 0 3px rgba(99, 102, 241, 0.12)',
  },
  error: {
    bg: '#FFFFFF',
    border: '1.5px solid #DC2828',
    fg: '#1F1F1F',
    iconColor: '#DC2828',
    shadow: 'none',
  },
  success: {
    bg: '#FFFFFF',
    border: '1.5px solid #10B981',
    fg: '#1F1F1F',
    iconColor: '#8E8E93',
    shadow: 'none',
  },
  disabled: {
    bg: '#F5F5F5',
    border: '1px solid rgba(60, 60, 67, 0.08)',
    fg: '#8E8E93',
    iconColor: '#C7C7CC',
    shadow: 'none',
  },
};

export const inputTextTokens = {
  placeholder: '#8E8E93',
  labelFontSize: '13px',
  labelFontWeight: 600,
  labelColor: '#1F1F1F',
  labelGap: '8px',
  hintFontSize: '12px',
  hintFontWeight: 500,
  hintColor: '#8E8E93',
  helperFontSize: '12px',
  helperColor: '#8E8E93',
  helperErrorColor: '#DC2828',
  helperSuccessColor: '#10B981',
  helperGap: '6px',
  transition: 'all 0.18s cubic-bezier(0.22, 1, 0.36, 1)',
};

// Legacy — kept for back-compat with existing Input callers.
// Prefer the size+state token maps above for new code.
export const inputTokens = {
  height: inputSizeTokens.md.height,
  padding: inputSizeTokens.md.padding,
  radius: inputSizeTokens.md.radius,
  fontSize: inputSizeTokens.md.fontSize,
  bg: 'rgba(255, 255, 255, 0.8)',
  border: inputStateTokens.default.border,
  borderHover: 'rgba(99, 102, 241, 0.3)',
  borderFocus: inputStateTokens.focused.border.replace('1.5px solid ', ''),
  focusRing: inputStateTokens.focused.shadow,
  color: inputStateTokens.default.fg,
  placeholder: inputTextTokens.placeholder,
  transition: inputTextTokens.transition,
};

export const inputLabelTokens = {
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase' as const,
  color: '#8E8E93',
  marginBottom: '8px',
};
