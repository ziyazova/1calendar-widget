export const switchTokens = {
  width: '40px',
  height: '22px',
  radius: '12px',
  thumbSize: '16px',
  thumbOffset: '3px',
  thumbShadow: '0 1px 3px rgba(0, 0, 0, 0.15)',
  transition: 'background ${({ theme }) => theme.transitions.base}, transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
};

export const switchVariantTokens = {
  off: {
    bg: 'rgba(0, 0, 0, 0.08)',
    shadow: '0 0.5px 1px rgba(0, 0, 0, 0.04), 0 0 0 0.5px rgba(0, 0, 0, 0.03)',
    thumbBg: '#FFFFFF',
  },
  on: {
    bg: 'linear-gradient(135deg, #6366F1, #818CF8)',
    shadow: 'none',
    thumbBg: '#FFFFFF',
  },
};

export const toggleTabsTokens = {
  containerWidth: '96px',
  containerHeight: '27px',
  containerRadius: '16px',
  containerBg: 'rgba(0, 0, 0, 0.08)',
  sliderWidth: '45px',
  sliderRadius: '12px',
  sliderBg: '#FFFFFF',
  sliderShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  sliderTransition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  optionFontSize: '12px',
  optionFontWeight: 500,
  optionActiveColor: '#6366F1',
  optionInactiveColor: '#3C3C43',
  optionTransition: 'color 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
};

export const toggleRowTokens = {
  textFontSize: '12px',
  textFontWeight: 400,
  textColor: '#1F1F1F',
  textLetterSpacing: '-0.01em',
  padding: '4px 0',
  paddingMobile: '6px 0',
  hoverOpacity: 0.8,
  transition: 'opacity 0.12s ease',
};
