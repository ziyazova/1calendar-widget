import React, { useState } from 'react';
import styled from 'styled-components';
import { colors } from '../../themes/colors';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  type?: 'primary' | 'background' | 'accent';
  label?: string;
  showPresets?: boolean;
}

const ColorPickerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NativePickerButton = styled.label<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: ${({ $color }) => $color};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  transition: all 0.12s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.tertiary};
  }

  input[type="color"] {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
  }
`;

const HexInput = styled.input`
  width: 80px;
  height: 32px;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 8px;
  padding: 0 10px;
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
  background: ${({ theme }) => theme.colors.background.tertiary};
  outline: none;
  flex-shrink: 0;
  transition: border-color 0.12s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const PresetGroup = styled.div`
  display: flex;
  gap: 4px;
  margin-left: auto;
`;

const ColorOption = styled.button<{ $color: string; $selected: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 5px;
  border: 1.5px solid ${({ $selected }) =>
    $selected ? 'rgba(0,0,0,0.25)' : 'transparent'};
  background-color: ${({ $color }) => $color};
  cursor: pointer;
  transition: all 0.12s ease;
  position: relative;
  flex-shrink: 0;
  padding: 0;

  &:hover {
    transform: scale(1.1);
  }

  &:focus {
    outline: none;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 3px;
    border: 1px solid rgba(0, 0, 0, 0.06);
    pointer-events: none;
  }
`;

const isValidHex = (value: string): boolean =>
  /^#[0-9A-Fa-f]{6}$/.test(value);

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorChange,
  type = 'primary',
  showPresets = true,
}) => {
  const colorOptions = type === 'background' ? colors.backgrounds : type === 'accent' ? colors.accents : colors.complementary;
  const [hexInput, setHexInput] = useState(selectedColor);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith('#')) value = '#' + value;
    setHexInput(value);
    if (isValidHex(value)) {
      onColorChange(value);
    }
  };

  const handleHexBlur = () => {
    if (!isValidHex(hexInput)) {
      setHexInput(selectedColor);
    }
  };

  const handleNativePicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHexInput(value);
    onColorChange(value);
  };

  if (isValidHex(selectedColor) && selectedColor !== hexInput && document.activeElement?.tagName !== 'INPUT') {
    // Will sync on next render via state
  }

  return (
    <ColorPickerContainer>
      <NativePickerButton $color={selectedColor}>
        <input
          type="color"
          value={selectedColor}
          onChange={handleNativePicker}
        />
      </NativePickerButton>
      <HexInput
        value={hexInput}
        onChange={handleHexChange}
        onBlur={handleHexBlur}
        placeholder="#000000"
        maxLength={7}
        spellCheck={false}
      />
      {showPresets && (
        <PresetGroup>
          {colorOptions.slice(0, 3).map((color) => (
            <ColorOption
              key={color.value}
              $color={color.value}
              $selected={selectedColor === color.value}
              onClick={() => {
                onColorChange(color.value);
                setHexInput(color.value);
              }}
              title={color.name}
            />
          ))}
        </PresetGroup>
      )}
    </ColorPickerContainer>
  );
};
