import React, { useState } from 'react';
import styled from 'styled-components';
import { colors } from '../../themes/colors';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  type?: 'primary' | 'background';
  label?: string;
  showPresets?: boolean;
}

const ColorPickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
`;

const ColorOption = styled.button<{ $color: string; $selected: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 2px solid ${({ $selected, theme }) =>
    $selected ? theme.colors.primary : 'transparent'};
  background-color: ${({ $color }) => $color};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:hover {
    transform: scale(1.05);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::after {
    content: '';
    position: absolute;
    inset: 4px;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    pointer-events: none;
  }
`;

const CustomColorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NativePickerButton = styled.label<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: ${({ $color }) => $color};
  border: 2px dashed ${({ theme }) => theme.colors.border.primary};
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.md};
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
  flex: 1;
  height: 32px;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 8px;
  padding: 0 10px;
  font-family: monospace;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.background.secondary};
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
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
  const colorOptions = type === 'background' ? colors.backgrounds : colors.complementary;
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

  // Sync external changes
  if (isValidHex(selectedColor) && selectedColor !== hexInput && document.activeElement?.tagName !== 'INPUT') {
    // Will sync on next render via state
  }

  return (
    <ColorPickerContainer>
      {showPresets && (
        <ColorGrid>
          {colorOptions.map((color) => (
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
        </ColorGrid>
      )}

      <CustomColorRow>
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
      </CustomColorRow>
    </ColorPickerContainer>
  );
};
