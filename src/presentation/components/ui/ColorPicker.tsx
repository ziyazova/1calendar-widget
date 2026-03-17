import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { X, Pipette } from 'lucide-react';
import { colors } from '../../themes/colors';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  type?: 'primary' | 'background' | 'accent';
  label?: string;
  showPresets?: boolean;
}

// ── HSV ↔ HEX helpers ──

function hexToHsv(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + 6) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  const s = max === 0 ? 0 : d / max;
  return [h, s, max];
}

function hsvToHex(h: number, s: number, v: number): string {
  const c = v * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ── Styled Components ──

const ColorPickerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
`;

const FigmaColorRow = styled.div`
  display: flex;
  align-items: center;
  height: 26px;
  border-radius: 6px;
  border: none;
  background: transparent;
  padding: 0;
  overflow: hidden;
`;

const ColorSwatch = styled.div<{ $color: string }>`
  width: 22px;
  height: 22px;
  border-radius: 5px;
  background-color: ${({ $color }) => $color};
  cursor: pointer;
  flex-shrink: 0;
  margin: 4px 6px 4px 0;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: border-color 0.12s ease;

  &:hover {
    border-color: rgba(0, 0, 0, 0.2);
  }
`;

const HexInput = styled.input`
  width: 80px;
  height: 28px;
  border: none;
  border-radius: 0;
  padding: 0 8px 0 0;
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 13px;
  font-weight: 400;
  color: #6B6B6B;
  background: transparent;
  outline: none;
  flex-shrink: 0;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  text-align: left;
  transition: color 0.15s ease;

  &:focus {
    color: #6B6B6B;
  }
`;

const PresetGroup = styled.div`
  display: flex;
  gap: 4px;
  margin-left: auto;
`;

const ColorOption = styled.button<{ $color: string; $selected: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 4px;
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

// ── Popup Picker ──

const PickerOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1050;
`;

const PickerPopup = styled.div`
  position: fixed;
  width: 240px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.06);
  z-index: 1060;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
`;

const PickerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PickerTitle = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #1F1F1F;
  letter-spacing: -0.01em;
`;

const CloseButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: #9A9A9A;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: 0;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #6B6B6B;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const SaturationCanvas = styled.canvas`
  width: 216px;
  height: 180px;
  border-radius: 8px;
  cursor: default;
  display: block;
`;

const HueSliderTrack = styled.div`
  width: 216px;
  height: 12px;
  border-radius: 8px;
  background: linear-gradient(to right,
    #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000
  );
  position: relative;
  cursor: pointer;
`;

const HueThumb = styled.div<{ $pos: number }>`
  position: absolute;
  top: -2px;
  left: ${({ $pos }) => $pos}%;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  transform: translateX(-50%);
  pointer-events: none;
`;

const SatThumb = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  left: ${({ $x }) => $x}px;
  top: ${({ $y }) => $y}px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const SatCanvasWrap = styled.div`
  position: relative;
`;

const PickerBottomRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const EyedropperButton = styled.button`
  width: 28px;
  height: 28px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  background: #f8f8f8;
  color: #6B6B6B;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0;
  transition: all 0.15s ease;

  &:hover {
    background: #f0f0f0;
    color: #1F1F1F;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const PickerColorPreview = styled.div<{ $color: string }>`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: ${({ $color }) => $color};
  border: 1px solid rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
`;

const PickerHexInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 28px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  padding: 0 8px;
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 12px;
  font-weight: 400;
  color: #1F1F1F;
  background: #f8f8f8;
  outline: none;
  text-transform: uppercase;
  letter-spacing: 0.02em;

  &:focus {
    border-color: #3384F4;
    box-shadow: 0 0 0 2px rgba(51, 132, 244, 0.1);
    color: #1F1F1F;
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
  const [open, setOpen] = useState(false);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const hexRef = useRef<HTMLInputElement>(null);
  const swatchRef = useRef<HTMLDivElement>(null);

  // HSV state for picker
  const [hsv, setHsv] = useState<[number, number, number]>(() => hexToHsv(selectedColor));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draggingSat = useRef(false);
  const draggingHue = useRef(false);

  useEffect(() => {
    const isHexFocused = document.activeElement === hexRef.current;
    if (!isHexFocused) {
      setHexInput(selectedColor);
    }
  }, [selectedColor]);

  // Sync HSV when color changes externally
  useEffect(() => {
    if (!open) {
      setHsv(hexToHsv(selectedColor));
    }
  }, [selectedColor, open]);

  // Draw saturation canvas
  useEffect(() => {
    if (!open || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 216, h = 180;
    canvas.width = w;
    canvas.height = h;

    // Base hue color
    const hueColor = hsvToHex(hsv[0], 1, 1);

    // White → hue horizontal
    const gradH = ctx.createLinearGradient(0, 0, w, 0);
    gradH.addColorStop(0, '#ffffff');
    gradH.addColorStop(1, hueColor);
    ctx.fillStyle = gradH;
    ctx.fillRect(0, 0, w, h);

    // Black vertical
    const gradV = ctx.createLinearGradient(0, 0, 0, h);
    gradV.addColorStop(0, 'rgba(0,0,0,0)');
    gradV.addColorStop(1, '#000000');
    ctx.fillStyle = gradV;
    ctx.fillRect(0, 0, w, h);
  }, [open, hsv[0]]);

  const updateFromSatCanvas = useCallback((e: React.MouseEvent | MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    const newHsv: [number, number, number] = [hsv[0], x, 1 - y];
    setHsv(newHsv);
    const hex = hsvToHex(...newHsv);
    setHexInput(hex);
    onColorChange(hex);
  }, [hsv, onColorChange]);

  const updateFromHue = useCallback((e: React.MouseEvent | MouseEvent) => {
    const target = (e.currentTarget || e.target) as HTMLElement;
    const track = target.closest('[data-hue-track]') as HTMLElement || target;
    const rect = track.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newH = x * 360;
    const newHsv: [number, number, number] = [newH, hsv[1], hsv[2]];
    setHsv(newHsv);
    const hex = hsvToHex(...newHsv);
    setHexInput(hex);
    onColorChange(hex);
  }, [hsv, onColorChange]);

  // Global mouse handlers for dragging
  useEffect(() => {
    if (!open) return;

    const handleMove = (e: MouseEvent) => {
      if (draggingSat.current) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
        const newHsv: [number, number, number] = [hsv[0], x, 1 - y];
        setHsv(newHsv);
        const hex = hsvToHex(...newHsv);
        setHexInput(hex);
        onColorChange(hex);
      }
      if (draggingHue.current) {
        const track = document.querySelector('[data-hue-track]') as HTMLElement;
        if (!track) return;
        const rect = track.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const newH = x * 360;
        const newHsv: [number, number, number] = [newH, hsv[1], hsv[2]];
        setHsv(newHsv);
        const hex = hsvToHex(...newHsv);
        setHexInput(hex);
        onColorChange(hex);
      }
    };

    const handleUp = () => {
      draggingSat.current = false;
      draggingHue.current = false;
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [open, hsv, onColorChange]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace('#', '');
    setHexInput('#' + value);
    if (isValidHex('#' + value)) {
      onColorChange('#' + value);
      setHsv(hexToHsv('#' + value));
    }
  };

  const handleHexBlur = () => {
    if (!isValidHex(hexInput)) {
      setHexInput(selectedColor);
    }
  };

  const satX = hsv[1] * 216;
  const satY = (1 - hsv[2]) * 180;

  return (
    <ColorPickerContainer>
      <FigmaColorRow>
        <ColorSwatch
          ref={swatchRef}
          $color={hexInput}
          onClick={() => {
            if (!open && swatchRef.current) {
              const rect = swatchRef.current.getBoundingClientRect();
              setPopupPos({
                top: rect.bottom - 18,
                left: Math.max(8, rect.left - 240 - 28),
              });
            }
            setOpen(!open);
          }}
        />
        <HexInput
          ref={hexRef}
          value={hexInput.replace('#', '')}
          onChange={handleHexChange}
          onBlur={handleHexBlur}
          placeholder="000000"
          maxLength={6}
          spellCheck={false}
        />
      </FigmaColorRow>
      {showPresets && (
        <PresetGroup>
          {colorOptions.slice(0, 3).map((color) => (
            <ColorOption
              key={color.value}
              $color={color.value}
              $selected={selectedColor.toLowerCase() === color.value.toLowerCase()}
              onClick={() => {
                onColorChange(color.value);
                setHexInput(color.value);
                setHsv(hexToHsv(color.value));
              }}
              title={color.name}
            />
          ))}
        </PresetGroup>
      )}

      {open && createPortal(
        <>
          <PickerOverlay onClick={() => setOpen(false)} />
          <PickerPopup style={{ top: popupPos.top, left: popupPos.left }}>
            <PickerHeader>
              <PickerTitle>Pick color</PickerTitle>
              <CloseButton onClick={() => setOpen(false)}>
                <X />
              </CloseButton>
            </PickerHeader>

            <SatCanvasWrap>
              <SaturationCanvas
                ref={canvasRef}
                onMouseDown={(e) => {
                  draggingSat.current = true;
                  updateFromSatCanvas(e);
                }}
              />
              <SatThumb $x={satX} $y={satY} />
            </SatCanvasWrap>

            <HueSliderTrack
              data-hue-track
              onMouseDown={(e) => {
                draggingHue.current = true;
                updateFromHue(e);
              }}
            >
              <HueThumb $pos={(hsv[0] / 360) * 100} />
            </HueSliderTrack>

            <PickerBottomRow>
              <EyedropperButton
                onClick={async () => {
                  if ('EyeDropper' in window) {
                    try {
                      const eyeDropper = new (window as any).EyeDropper();
                      const result = await eyeDropper.open();
                      const color = result.sRGBHex;
                      setHexInput(color);
                      onColorChange(color);
                      setHsv(hexToHsv(color));
                    } catch {}
                  }
                }}
                title="Eyedropper"
              >
                <Pipette />
              </EyedropperButton>
              <PickerColorPreview $color={hsvToHex(...hsv)} />
              <PickerHexInput
                value={hexInput.replace('#', '')}
                onChange={(e) => {
                  const val = e.target.value.replace('#', '');
                  setHexInput('#' + val);
                  if (isValidHex('#' + val)) {
                    onColorChange('#' + val);
                    setHsv(hexToHsv('#' + val));
                  }
                }}
                onBlur={() => {
                  if (!isValidHex(hexInput)) setHexInput(hsvToHex(...hsv));
                }}
                placeholder="000000"
                maxLength={6}
                spellCheck={false}
              />
            </PickerBottomRow>
          </PickerPopup>
        </>,
        document.body
      )}
    </ColorPickerContainer>
  );
};
