import React from 'react';
import styled from 'styled-components';
import {
  switchTokens,
  switchVariantTokens,
  toggleTabsTokens,
  toggleRowTokens,
} from '../../themes/toggleTokens';

export const ToggleRow = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: ${toggleRowTokens.padding};
  border-radius: ${({ theme }) => theme.radii.xs};
  transition: ${toggleRowTokens.transition};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${toggleRowTokens.paddingMobile};
  }

  &:hover {
    opacity: ${toggleRowTokens.hoverOpacity};
  }
`;

export const ToggleLabel = styled.span`
  font-size: ${toggleRowTokens.textFontSize};
  font-weight: ${toggleRowTokens.textFontWeight};
  color: ${toggleRowTokens.textColor};
  letter-spacing: ${toggleRowTokens.textLetterSpacing};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) { font-size: 13px; }
`;

const SwitchTrack = styled.div<{ $checked: boolean }>`
  width: ${switchTokens.width};
  height: ${switchTokens.height};
  border-radius: ${switchTokens.radius};
  position: relative;
  flex-shrink: 0;
  transition: ${switchTokens.transition};

  background: ${({ $checked }) => $checked ? switchVariantTokens.on.bg : switchVariantTokens.off.bg};
  box-shadow: ${({ $checked }) => $checked ? switchVariantTokens.on.shadow : switchVariantTokens.off.shadow};

  &::after {
    content: '';
    position: absolute;
    top: ${switchTokens.thumbOffset};
    left: ${switchTokens.thumbOffset};
    width: ${switchTokens.thumbSize};
    height: ${switchTokens.thumbSize};
    border-radius: 50%;
    background: ${switchVariantTokens.on.thumbBg};
    box-shadow: ${switchTokens.thumbShadow};
    transition: ${switchTokens.transition};
    transform: ${({ $checked }) => $checked ? 'translateX(18px)' : 'translateX(0)'};
  }
`;

export const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  'aria-label'?: string;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, ...rest }) => (
  <>
    <HiddenCheckbox
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      {...rest}
    />
    <SwitchTrack $checked={checked} />
  </>
);

const ToggleTabsContainer = styled.div`
  width: ${toggleTabsTokens.containerWidth};
  height: ${toggleTabsTokens.containerHeight};
  border-radius: ${toggleTabsTokens.containerRadius};
  background: ${toggleTabsTokens.containerBg};
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) { width: 108px; height: 32px; }
`;

const ToggleTabsSlider = styled.div<{ $activeIndex: number }>`
  position: absolute;
  top: 2px;
  left: ${({ $activeIndex }) => $activeIndex === 0 ? '2px' : `calc(100% - ${toggleTabsTokens.sliderWidth} - 2px)`};
  width: ${toggleTabsTokens.sliderWidth};
  height: calc(100% - 4px);
  border-radius: ${toggleTabsTokens.sliderRadius};
  background: ${toggleTabsTokens.sliderBg};
  box-shadow: ${toggleTabsTokens.sliderShadow};
  transition: ${toggleTabsTokens.sliderTransition};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 52px;
    left: ${({ $activeIndex }) => $activeIndex === 0 ? '2px' : 'calc(100% - 52px - 2px)'};
  }
`;

const ToggleTabsOption = styled.button<{ $active: boolean }>`
  flex: 1;
  height: 100%;
  border: none;
  background: transparent;
  color: ${({ $active }) => $active ? toggleTabsTokens.optionActiveColor : toggleTabsTokens.optionInactiveColor};
  font-size: ${toggleTabsTokens.optionFontSize};
  font-weight: ${toggleTabsTokens.optionFontWeight};
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.01em;
  position: relative;
  z-index: 1;
  transition: ${toggleTabsTokens.optionTransition};
  padding: 0;
  line-height: 21px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) { font-size: 13px; }
`;

interface ToggleTabsProps<T extends string> {
  value: T;
  options: [T, T];
  labels: [string, string];
  onChange: (v: T) => void;
}

export function ToggleTabs<T extends string>({ value, options, labels, onChange }: ToggleTabsProps<T>) {
  const activeIndex = value === options[0] ? 0 : 1;
  return (
    <ToggleTabsContainer onClick={() => onChange(value === options[0] ? options[1] : options[0])}>
      <ToggleTabsSlider $activeIndex={activeIndex} />
      <ToggleTabsOption $active={value === options[0]} onClick={(e) => { e.stopPropagation(); onChange(options[0]); }}>
        {labels[0]}
      </ToggleTabsOption>
      <ToggleTabsOption $active={value === options[1]} onClick={(e) => { e.stopPropagation(); onChange(options[1]); }}>
        {labels[1]}
      </ToggleTabsOption>
    </ToggleTabsContainer>
  );
}
