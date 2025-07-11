import React from 'react';
import styled from 'styled-components';
import { colors } from '../../themes/colors';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  type?: 'primary' | 'background';
  label?: string;
}

const ColorPickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ColorOption = styled.button<{ $color: string; $selected: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radii.md};
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
    border-radius: ${({ theme }) => theme.radii.sm};
    border: 1px solid rgba(0, 0, 0, 0.1);
    pointer-events: none;
  }
`;

const ColorPreview = styled.div<{ $color: string }>`
  width: 100%;
  height: 24px;
  background-color: ${({ $color }) => $color};
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ColorValue = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: monospace;
`;

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorChange,
  type = 'primary',
  label
}) => {
  const colorOptions = type === 'background' ? colors.backgrounds : colors.complementary;

  return (
    <ColorPickerContainer>
      <ColorPreview $color={selectedColor} />
      <ColorValue>{selectedColor}</ColorValue>

      <ColorGrid>
        {colorOptions.map((color) => (
          <ColorOption
            key={color.value}
            $color={color.value}
            $selected={selectedColor === color.value}
            onClick={() => onColorChange(color.value)}
            title={color.name}
          />
        ))}
      </ColorGrid>
    </ColorPickerContainer>
  );
}; 