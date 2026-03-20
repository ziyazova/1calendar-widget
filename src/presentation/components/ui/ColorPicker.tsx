import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { X, Pipette, Pencil } from 'lucide-react';
import { colors, getContrastColor } from '../../themes/colors';

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
  height: 30px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.03);
  box-shadow: 0 0.5px 1px rgba(0, 0, 0, 0.04);
  padding: 0 10px 0 5px;

  @media (max-width: 768px) {
    height: 34px;
    border-radius: 10px;
    padding: 0 10px 0 4px;
  }
`;

const ColorSwatch = styled.div<{ $color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 30%;
  background-color: ${({ $color }) => $color};
  cursor: pointer;
  flex-shrink: 0;
  margin: 4px 6px 4px 0;
  border: 1px solid rgba(0,0,0,0.06);
  transition: all 0.15s ease;
  position: relative;

  &:hover {
    border-color: rgba(0,0,0,0.15);
  }

  &:hover .swatch-icon {
    opacity: 1;
  }

  @media (max-width: 768px) {
    width: 26px;
    height: 26px;
  }
`;

const SwatchIcon = styled.div<{ $light: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border-radius: 30%;
  opacity: 0;
  transition: opacity 0.15s ease;

  @media (max-width: 768px) {
    opacity: 0.6;
  }
  pointer-events: none;

  svg {
    width: 11px;
    height: 11px;
    color: ${({ $light }) => $light ? '#1F1F1F' : '#F9F9F8'};
  }
`;

const HexInput = styled.input`
  width: 70px;
  height: 20px;
  border: none;
  border-radius: 0;
  padding: 0;
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 12px;
  font-weight: 400;
  color: #6B6B6B;
  background: transparent;
  outline: none;
  flex-shrink: 0;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  line-height: 20px;
  transition: color 0.15s ease;

  &:focus {
    color: #1F1F1F;
  }

  @media (max-width: 768px) {
    font-size: 13px;
    height: 26px;
    line-height: 26px;
  }
`;

const PresetGroup = styled.div`
  display: flex;
  gap: 6px;
  margin-left: auto;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const ColorOption = styled.button<{ $color: string; $selected: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 30%;
  border: 1.5px solid transparent;
  box-shadow: ${({ $selected, $color }) => {
    const darkBorder = `0 0 0 0.5px color-mix(in srgb, ${$color} 88%, #000)`;
    return $selected
      ? `0 0 0 1.5px #fff, 0 0 0 2.5px rgba(51,132,244,0.5), ${darkBorder}`
      : darkBorder;
  }};
  background-color: ${({ $color }) => $color};
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
  padding: 0;

  &:active {
    transform: scale(0.9);
  }

  &:focus {
    outline: none;
  }

  @media (max-width: 768px) {
    width: 26px;
    height: 26px;
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
  border-radius: 16px;
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
  border-radius: 10px;
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
  border-radius: 12px;
  cursor: default;
  display: block;
  touch-action: none;

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const HueSliderTrack = styled.div`
  width: 216px;
  height: 12px;
  border-radius: 10px;
  background: linear-gradient(to right,
    #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000
  );
  position: relative;
  cursor: pointer;
  touch-action: none;

  @media (max-width: 768px) {
    width: 100%;
    height: 16px;
  }
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
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;
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
  border-radius: 10px;
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
  border-radius: 30%;
  background: ${({ $color }) => $color};
  border: 1px solid rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
`;

const PickerHexInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 28px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
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

const MobilePickerOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 59;
`;

const MobilePickerHandleArea = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 0 0;
  margin-bottom: -12px;
`;

const MobilePickerHandle = styled.div`
  width: 40px;
  height: 5px;
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.15);
`;

const MobilePickerWrap = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.12);
  z-index: 60;
  padding: 0 20px 32px;
  padding-bottom: calc(32px + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MobilePickerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 14px;
`;

const MobilePickerBack = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(0, 0, 0, 0.04);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #9A9A9A;

  svg { width: 14px; height: 14px; }
`;

const MobilePickerTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1F1F1F;
  letter-spacing: -0.02em;
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
  const hsvRef = useRef(hsv);
  hsvRef.current = hsv;
  const onColorChangeRef = useRef(onColorChange);
  onColorChangeRef.current = onColorChange;
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

    const rect = canvas.getBoundingClientRect();
    const w = Math.round(rect.width) || 216;
    const h = Math.round(rect.height) || 180;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

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

  const updateFromSatCanvas = useCallback((e: React.MouseEvent | MouseEvent | React.TouchEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    const newHsv: [number, number, number] = [hsvRef.current[0], x, 1 - y];
    setHsv(newHsv);
    const hex = hsvToHex(...newHsv);
    setHexInput(hex);
    onColorChangeRef.current(hex);
  }, []);

  const updateFromHue = useCallback((e: React.MouseEvent | MouseEvent | React.TouchEvent | TouchEvent) => {
    const target = (e.currentTarget || e.target) as HTMLElement;
    const track = target.closest('[data-hue-track]') as HTMLElement || target;
    const rect = track.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newH = x * 360;
    const newHsv: [number, number, number] = [newH, hsvRef.current[1], hsvRef.current[2]];
    setHsv(newHsv);
    const hex = hsvToHex(...newHsv);
    setHexInput(hex);
    onColorChangeRef.current(hex);
  }, []);

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
        const newHsv: [number, number, number] = [hsvRef.current[0], x, 1 - y];
        setHsv(newHsv);
        const hex = hsvToHex(...newHsv);
        setHexInput(hex);
        onColorChangeRef.current(hex);
      }
      if (draggingHue.current) {
        const track = document.querySelector('[data-hue-track]') as HTMLElement;
        if (!track) return;
        const rect = track.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const newH = x * 360;
        const newHsv: [number, number, number] = [newH, hsvRef.current[1], hsvRef.current[2]];
        setHsv(newHsv);
        const hex = hsvToHex(...newHsv);
        setHexInput(hex);
        onColorChangeRef.current(hex);
      }
    };

    const handleUp = () => {
      draggingSat.current = false;
      draggingHue.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (draggingSat.current) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (touch.clientY - rect.top) / rect.height));
        const newHsv: [number, number, number] = [hsvRef.current[0], x, 1 - y];
        setHsv(newHsv);
        const hex = hsvToHex(...newHsv);
        setHexInput(hex);
        onColorChangeRef.current(hex);
      }
      if (draggingHue.current) {
        const track = document.querySelector('[data-hue-track]') as HTMLElement;
        if (!track) return;
        const rect = track.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
        const newH = x * 360;
        const newHsv: [number, number, number] = [newH, hsvRef.current[1], hsvRef.current[2]];
        setHsv(newHsv);
        const hex = hsvToHex(...newHsv);
        setHexInput(hex);
        onColorChangeRef.current(hex);
      }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [open]);

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

  const satX = hsv[1] * 100;
  const satY = (1 - hsv[2]) * 100;

  return (
    <ColorPickerContainer>
      <FigmaColorRow>
        <ColorSwatch
          ref={swatchRef}
          $color={hexInput}
          onClick={() => {
            if (!open && swatchRef.current) {
              const rect = swatchRef.current.getBoundingClientRect();
              const isMobile = window.innerWidth <= 768;
              setPopupPos({
                top: isMobile ? Math.min(rect.bottom + 8, window.innerHeight - 320) : rect.bottom - 18,
                left: isMobile ? Math.max(8, (window.innerWidth - 240) / 2) : Math.max(8, rect.left - 240 - 28),
              });
            }
            setOpen(!open);
          }}
        >
          <SwatchIcon className="swatch-icon" $light={getContrastColor(hexInput) === '#000000'}>
            <Pencil />
          </SwatchIcon>
        </ColorSwatch>
        <HexInput
          ref={hexRef}
          value={hexInput.replace('#', '')}
          onChange={handleHexChange}
          onBlur={handleHexBlur}
          onFocus={(e) => e.target.select()}
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

      {open && (typeof window !== 'undefined' && window.innerWidth <= 768 ? createPortal(
        <>
        <MobilePickerOverlay onClick={() => setOpen(false)} />
        <MobilePickerWrap>
          <MobilePickerHandleArea>
            <MobilePickerHandle />
          </MobilePickerHandleArea>
          <MobilePickerHeader>
            <MobilePickerTitle>Pick color</MobilePickerTitle>
            <MobilePickerBack onClick={() => setOpen(false)}>
              <X />
            </MobilePickerBack>
          </MobilePickerHeader>

          <SatCanvasWrap>
            <SaturationCanvas
              ref={canvasRef}
              onMouseDown={(e) => { draggingSat.current = true; updateFromSatCanvas(e); }}
              onTouchStart={(e) => { draggingSat.current = true; updateFromSatCanvas(e); }}
            />
            <SatThumb $x={satX} $y={satY} />
          </SatCanvasWrap>

          <HueSliderTrack
            data-hue-track
            onMouseDown={(e) => { draggingHue.current = true; updateFromHue(e); }}
            onTouchStart={(e) => { draggingHue.current = true; updateFromHue(e); }}
          >
            <HueThumb $pos={(hsv[0] / 360) * 100} />
          </HueSliderTrack>

          <PickerBottomRow>
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
        </MobilePickerWrap>
        </>,
        document.body
      ) : createPortal(
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
      ))}
    </ColorPickerContainer>
  );
};
