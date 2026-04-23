import React from 'react';
import styled from 'styled-components';
import {
  sliderTrackTokens,
  sliderThumbTokens,
  sliderLabelTokens,
} from '@/presentation/themes/sliderTokens';

/**
 * Slider — tokenized range input with an optional label row and trailing
 * value pill (e.g. "Corners — 12px"). Single source of truth for every
 * slider in the studio customization panel and elsewhere.
 *
 * Usage:
 *   <Slider
 *     label="Corners"
 *     value={borderRadius}
 *     min={0} max={24} step={2}
 *     formatValue={(v) => `${v}px`}
 *     onChange={setBorderRadius}
 *   />
 *
 * Or headless (no label/value, just the track):
 *   <SliderInput type="range" value={v} onChange={...} />
 */

const FieldWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sliderLabelTokens.labelGap};
`;

const LabelRow = styled.label`
  display: block;
  font-size: ${sliderLabelTokens.fontSize};
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: ${sliderLabelTokens.letterSpacing};

  @media (max-width: 768px) {
    font-size: ${sliderLabelTokens.fontSizeMobile};
  }
`;

const TrackRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${sliderLabelTokens.valueGap};
`;

export const SliderInput = styled.input.attrs({ type: 'range' })`
  flex: 1;
  height: ${sliderTrackTokens.height};
  border-radius: ${sliderTrackTokens.radius};
  background: ${sliderTrackTokens.bg};
  box-shadow: ${sliderTrackTokens.innerShadow};
  outline: none;
  -webkit-appearance: none;
  margin: 0;
  padding: 0;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover { background: ${sliderTrackTokens.bgFocus}; }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: ${sliderThumbTokens.size};
    height: ${sliderThumbTokens.size};
    border-radius: 50%;
    background: ${sliderThumbTokens.bg};
    border: ${sliderThumbTokens.borderWidth} solid ${({ theme }) => theme.colors.accent};
    cursor: pointer;
    box-shadow: ${sliderThumbTokens.shadow};
    transition: ${sliderThumbTokens.transition};
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(${sliderThumbTokens.scaleHover});
    box-shadow: ${sliderThumbTokens.shadowHover};
  }

  &::-webkit-slider-thumb:active {
    transform: scale(${sliderThumbTokens.scaleActive});
  }

  &::-moz-range-thumb {
    width: ${sliderThumbTokens.size};
    height: ${sliderThumbTokens.size};
    border-radius: 50%;
    background: ${sliderThumbTokens.bg};
    border: ${sliderThumbTokens.borderWidth} solid ${({ theme }) => theme.colors.accent};
    cursor: pointer;
    box-shadow: ${sliderThumbTokens.shadow};
    transition: ${sliderThumbTokens.transition};
  }

  @media (max-width: 768px) {
    touch-action: none;
    height: ${sliderTrackTokens.heightMobile};

    &::-webkit-slider-thumb {
      width: ${sliderThumbTokens.sizeMobile};
      height: ${sliderThumbTokens.sizeMobile};
    }
    &::-moz-range-thumb {
      width: ${sliderThumbTokens.sizeMobile};
      height: ${sliderThumbTokens.sizeMobile};
    }
  }
`;

export const SliderValue = styled.span`
  font-size: ${sliderLabelTokens.fontSize};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${sliderLabelTokens.fontWeight};
  font-variant-numeric: tabular-nums;
  min-width: ${sliderLabelTokens.valueMinWidth};
  text-align: right;
`;

interface SliderProps {
  label?: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step?: number;
  /** Render the trailing value pill. Pass a formatter for units ("12px"). */
  formatValue?: (v: number) => string;
  onChange: (v: number) => void;
  /** Omit the label row entirely (for inline / custom layouts). */
  hideLabel?: boolean;
  id?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  formatValue,
  onChange,
  hideLabel,
  id,
}) => {
  const display = formatValue ? formatValue(value) : String(value);
  return (
    <FieldWrap>
      {!hideLabel && label && <LabelRow htmlFor={id}>{label}</LabelRow>}
      <TrackRow>
        <SliderInput
          id={id}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number((e.target as HTMLInputElement).value))}
        />
        {formatValue && <SliderValue>{display}</SliderValue>}
      </TrackRow>
    </FieldWrap>
  );
};
