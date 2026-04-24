import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { X, GripVertical } from 'lucide-react';
import { getWidgetBadgeLabel } from '../widgetConfig';
import { Widget } from '../../../../domain/entities/Widget';
import { CalendarSettings } from '../../../../domain/value-objects/CalendarSettings';
import { ClockSettings } from '../../../../domain/value-objects/ClockSettings';
import { BoardSettings } from '../../../../domain/value-objects/BoardSettings';
import { ColorPicker } from '../ColorPicker';
import {
  ToggleRow,
  ToggleLabel,
  Switch,
  ToggleTabs,
  Input as SharedInput,
} from '@/presentation/components/shared';

export type PanelSection = 'style' | 'content' | 'color' | 'layout' | null;

interface CustomizationPanelProps {
  widget: Widget | null;
  onSettingsChange: (settings: Partial<CalendarSettings | ClockSettings | BoardSettings>) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  visibleSection?: PanelSection;
  widgetCount?: number;
  widgetLimit?: number;
  onUpgrade?: () => void;
}

const PanelContainer = styled.div<{ $mobileOpen?: boolean }>`
  width: 290px;
  height: 100vh;
  position: fixed;
  right: 0;
  top: 0;
  background: ${({ theme }) => theme.colors.background.elevated};
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
  border-left: none;
  z-index: ${({ theme }) => theme.zIndex.sticky};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: 240px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    height: 60vh;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 20px 20px 0 0;
    border-top: 1px solid ${({ theme }) => theme.colors.border.light};
    box-shadow: ${({ theme }) => theme.shadows.sheet};
    transform: ${({ $mobileOpen }) => $mobileOpen ? 'translateY(0)' : 'translateY(100%)'};
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }
`;

const PanelHeader = styled.div`
  min-height: 64px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  padding: 32px 32px 16px 12px;
  border-bottom: none;
`;

const PanelTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  letter-spacing: -0.02em;
`;

const WidgetBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: none;
  width: fit-content;

  svg {
    width: 14px;
    height: 14px;
    color: rgba(51, 132, 244, 0.6);
    flex-shrink: 0;
  }
`;

const WidgetBadgeText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accent};
  letter-spacing: -0.01em;
`;

const PanelContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 32px 32px 12px;

  &::-webkit-scrollbar {
    width: 0;
  }
`;

const Section = styled.div`
  padding: 16px 0 0;

  &:first-child {
    padding-top: 16px;
  }

  & + & {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  }
`;

const SectionTitle = styled.h3`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: -0.01em;
  margin: 0 0 18px 0;
`;

const MobilePanelContent = styled.div`
  padding: 0 20px 24px;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  ${SectionTitle} {
    display: none;
  }

  ${Section} {
    padding-top: 0;
    margin-top: 0;
    border-top: none;
  }
`;

const FormGroup = styled.div`
  & + & {
    margin-top: 16px;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 8px;
  letter-spacing: -0.01em;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) { font-size: 13px; }
`;

const Select = styled.select`
  width: 100%;
  height: 36px;
  padding: 0 12px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  background: rgba(0, 0, 0, 0.03);
  box-shadow: ${({ theme }) => theme.shadows.form};
  color: ${({ theme }) => theme.colors.text.primary};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) { height: 40px; font-size: 13px; }
  font-size: 13px;
  font-weight: 400;
  font-family: inherit;
  transition: all ${({ theme }) => theme.transitions.fast};
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 10px center;
  background-repeat: no-repeat;
  background-size: 14px;
  padding-right: 32px;

  &:hover {
    border-color: rgba(51, 132, 244, 0.3);
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: ${({ theme }) => theme.shadows.focusBlue};
  }
`;

const SliderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Slider = styled.input`
  flex: 1;
  height: 4px;
  border-radius: ${({ theme }) => theme.radii.xs};
  background: rgba(0, 0, 0, 0.03);
  box-shadow: ${({ theme }) => theme.shadows.form};
  outline: none;
  -webkit-appearance: none;
  margin: 0;
  padding: 0;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.background.elevated};
    border: 2px solid ${({ theme }) => theme.colors.accent};
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(99, 102, 241, 0.25);
    transition: all ${({ theme }) => theme.transitions.fast};
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.15);
    box-shadow: 0 3px 10px rgba(99, 102, 241, 0.35);
  }

  &::-webkit-slider-thumb:active {
    transform: scale(0.95);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    touch-action: none;
    height: 6px;

    &::-webkit-slider-thumb {
      width: 22px;
      height: 22px;
    }
  }
`;

const SliderValue = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.body};
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  min-width: 32px;
  text-align: right;
`;


const EmptyState = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.tertiary};
  padding: 64px 24px;

  h3 {
    font-size: 14px;
    font-weight: 500;
    margin: 0 0 4px 0;
    color: ${({ theme }) => theme.colors.text.body};
  }

  p {
    font-size: 13px;
    margin: 0;
    line-height: 1.5;
  }
`;

const TypewriterColorRow = styled.div`
  display: flex;
  gap: 8px;
  min-height: 26px;
  align-items: center;
  padding: 2px 0 0 0;
`;

const TypewriterColorDot = styled.button<{ $color: string; $active: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 30%;
  background: ${({ $color }) => $color};
  border: 1.5px solid transparent;
  box-shadow: ${({ $active, $color }) => {
    const darkBorder = `0 0 0 0.5px color-mix(in srgb, ${$color} 83%, #000)`;
    return $active
      ? `0 0 0 1.5px #fff, 0 0 0 2.5px rgba(51,132,244,0.5), ${darkBorder}`
      : darkBorder;
  }};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  flex-shrink: 0;
  padding: 0;

  &:active {
    transform: scale(0.9);
  }

  &:focus {
    outline: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 26px;
    height: 26px;
  }
`;

const FLOWER_CLOCK_COLORS: Record<string, { value: string; color: string; label: string }[]> = {
  flower: [
    { value: 'green', color: '#A8CEBA', label: 'Green' },
    { value: 'pink', color: '#DEB0BC', label: 'Pink' },
    { value: 'blue', color: '#A3C4D9', label: 'Blue' },
  ],
  alarm: [
    { value: 'red', color: '#D4A0A0', label: 'Red' },
    { value: 'mint', color: '#A0C4B8', label: 'Mint' },
    { value: 'cream', color: '#D9CEBD', label: 'Cream' },
  ],
  vintage: [
    { value: 'gold', color: '#C4B088', label: 'Gold' },
    { value: 'silver', color: '#B8BCC0', label: 'Silver' },
    { value: 'walnut', color: '#A08060', label: 'Walnut' },
  ],
};

const TYPEWRITER_COLORS = [
  { value: 'blue', color: '#A3C4D9', label: 'Blue' },
  { value: 'green', color: '#A8CEBA', label: 'Green' },
  { value: 'pink', color: '#DEB0BC', label: 'Pink' },
  { value: 'brown', color: '#BBA88A', label: 'Brown' },
  { value: 'beige', color: '#D9CEBD', label: 'Beige' },
] as const;

const ImageHint = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.body};
  margin: 0 0 12px 0;
  line-height: 1.5;
  letter-spacing: -0.01em;
`;

const ImageInputRow = styled.div`
  display: flex;
  gap: 8px;
`;


const AddButton = styled.button`
  height: 36px;
  padding: 0 16px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.state.active}, #5BA0F7);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  flex-shrink: 0;
  white-space: nowrap;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.colors.blueShadow.md};
  }

  &:active {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ImageCounter = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.body};
  font-weight: 500;
  margin-top: 8px;
  display: block;
  font-variant-numeric: tabular-nums;
`;

const ImageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 12px;
`;

const ImageItem = styled.div<{ $dragging?: boolean; $dragOver?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: ${({ $dragging, $dragOver }) =>
    $dragging ? 'rgba(51, 132, 244, 0.06)' :
    $dragOver ? 'rgba(51, 132, 244, 0.04)' :
    'rgba(0, 0, 0, 0.02)'};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.body};
  transition: background 0.12s ease, opacity 0.12s ease, border-color 0.12s ease;
  opacity: ${({ $dragging }) => $dragging ? 0.5 : 1};
  border: 1px solid ${({ $dragOver }) => $dragOver ? 'rgba(51, 132, 244, 0.2)' : 'transparent'};

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`;

const DragHandle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  color: ${({ theme }) => theme.colors.text.muted};
  flex-shrink: 0;
  padding: 4px 0;
  transition: color 0.12s ease;

  &:active {
    cursor: grabbing;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.text.body};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const ImageThumb = styled.img`
  width: 30px;
  height: 30px;
  border-radius: ${({ theme }) => theme.radii.sm};
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const ImageUrl = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: -0.01em;
`;

const RemoveButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.body};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.sm};
  flex-shrink: 0;
  padding: 0;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: rgba(239, 68, 68, 0.08);
    color: #ef4444;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const LayoutOption = styled.button<{ $active: boolean }>`
  flex: 1;
  height: 36px;
  border: none;
  background: ${({ $active, theme }) => $active ? theme.colors.interactive.accentHover : theme.colors.interactive.hover};
  box-shadow: ${({ $active, theme }) => $active ? `0 0 0 1px ${theme.colors.accent}` : theme.shadows.form};
  color: ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.text.body};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.01em;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.interactive.accentHover};
    color: ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.text.primary};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) { height: 40px; font-size: 13px; }
`;

const LayoutOptions = styled.div`
  display: flex;
  gap: 8px;
`;


export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  widget,
  onSettingsChange,
  mobileOpen,
  onMobileClose,
  visibleSection,
  widgetCount = 0,
  widgetLimit = 3,
  onUpgrade,
}) => {
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const dragCounter = useRef(0);

  const handleAddImage = () => {
    if (!widget || widget.type !== 'board' || !imageUrlInput.trim()) return;
    const boardSettings = widget.settings as BoardSettings;
    if (boardSettings.imageUrls.length >= 8) return;
    onSettingsChange({ imageUrls: [...boardSettings.imageUrls, imageUrlInput.trim()] });
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    if (!widget || widget.type !== 'board') return;
    const boardSettings = widget.settings as BoardSettings;
    const newUrls = boardSettings.imageUrls.filter((_, i) => i !== index);
    onSettingsChange({ imageUrls: newUrls });
  };

  const handleDragStart = (index: number) => {
    setDragIdx(index);
  };

  const handleDragEnter = (index: number) => {
    dragCounter.current++;
    setDragOverIdx(index);
  };

  const handleDragLeave = () => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverIdx(null);
    }
  };

  const handleDrop = (dropIndex: number) => {
    if (dragIdx === null || dragIdx === dropIndex || !widget || widget.type !== 'board') return;
    const boardSettings = widget.settings as BoardSettings;
    const newUrls = [...boardSettings.imageUrls];
    const [moved] = newUrls.splice(dragIdx, 1);
    newUrls.splice(dropIndex, 0, moved);
    onSettingsChange({ imageUrls: newUrls });
    setDragIdx(null);
    setDragOverIdx(null);
    dragCounter.current = 0;
  };

  const handleDragEnd = () => {
    setDragIdx(null);
    setDragOverIdx(null);
    dragCounter.current = 0;
  };

  const getWidgetInfo = () => {
    if (!widget) return null;
    const style = widget.type === 'calendar'
      ? (widget.settings as CalendarSettings).style
      : widget.type === 'clock'
        ? (widget.settings as ClockSettings).style
        : widget.type === 'board' ? 'grid' : '';
    return getWidgetBadgeLabel(widget.type, style);
  };

  if (!widget) {
    return (
      <PanelContainer $mobileOpen={mobileOpen}>
        <PanelHeader>
          <PanelTitle>Design</PanelTitle>
        </PanelHeader>
        <EmptyState>
          <h3>Nothing selected</h3>
          <p>Pick a widget to get started</p>
        </EmptyState>
      </PanelContainer>
    );
  }

  const settings = widget.settings as CalendarSettings | ClockSettings | BoardSettings;
  const isBoard = widget.type === 'board';
  const calStyle = widget.type === 'calendar' ? (settings as CalendarSettings).style : '';
  const clkStyle = widget.type === 'clock' ? (settings as ClockSettings).style : '';
  const isClassicStyle = calStyle === 'classic' || calStyle === 'collage' || calStyle === 'typewriter' || clkStyle === 'classic' || clkStyle === 'flower' || clkStyle === 'dreamy';
  const isCollageStyle = calStyle === 'collage' || calStyle === 'typewriter' || clkStyle === 'flower';
  const isTypewriterStyle = calStyle === 'typewriter';
  const isFlowerClockStyle = clkStyle === 'flower';
  const isDuoClockStyle = clkStyle === 'classic';

  const Wrapper = visibleSection ? MobilePanelContent : PanelContent;
  const panelContent = (
      <Wrapper>
        {/* ── 1. Style (flower clock or board only) ── */}
        {(!visibleSection || visibleSection === 'style') && isFlowerClockStyle && (
          <Section>
            <SectionTitle>Style</SectionTitle>
            <FormGroup>
              <LayoutOptions>
                <LayoutOption
                  $active={(settings as ClockSettings).clockFrame === 'flower'}
                  onClick={() => onSettingsChange({ clockFrame: 'flower' })}
                >
                  Bloom
                </LayoutOption>
                <LayoutOption
                  $active={(settings as ClockSettings).clockFrame === 'alarm'}
                  onClick={() => onSettingsChange({ clockFrame: 'alarm' })}
                >
                  Retro
                </LayoutOption>
                <LayoutOption
                  $active={(settings as ClockSettings).clockFrame === 'vintage'}
                  onClick={() => onSettingsChange({ clockFrame: 'vintage' })}
                >
                  Vintage
                </LayoutOption>
              </LayoutOptions>
            </FormGroup>
          </Section>
        )}

        {(!visibleSection || visibleSection === 'style') && isBoard && (
          <Section>
            <SectionTitle>Style</SectionTitle>
            <FormGroup>
              <LayoutOptions>
                <LayoutOption
                  $active={true}
                  onClick={() => {}}
                >
                  Grid
                </LayoutOption>
                <LayoutOption
                  $active={false}
                  onClick={() => {}}
                >
                  Masonry
                </LayoutOption>
                <LayoutOption
                  $active={false}
                  onClick={() => {}}
                >
                  Carousel
                </LayoutOption>
              </LayoutOptions>
            </FormGroup>
          </Section>
        )}

        {/* ── 2. Content (always present) ── */}
        {(!visibleSection || visibleSection === 'content') && <Section>
          <SectionTitle>Content</SectionTitle>

          {widget.type === 'calendar' && (
          <>
            <FormGroup>
              <ToggleRow as="div">
                <ToggleLabel>Week start</ToggleLabel>
                <ToggleTabs<'monday' | 'sunday'>
                  value={(settings as CalendarSettings).weekStart}
                  options={['monday', 'sunday']}
                  labels={['Mon', 'Sun']}
                  onChange={(v) => onSettingsChange({ weekStart: v })}
                />
              </ToggleRow>
            </FormGroup>

            <FormGroup>
              <ToggleRow>
                <ToggleLabel>Day grid</ToggleLabel>
                <Switch
                  checked={(settings as CalendarSettings).showDayBorders}
                  onChange={(v) => onSettingsChange({ showDayBorders: v })}
                  aria-label="Day grid"
                />
              </ToggleRow>
            </FormGroup>
          </>
          )}

          {widget.type === 'clock' && (
          <>
            {!isFlowerClockStyle && (
            <FormGroup>
              <ToggleRow as="div">
                <ToggleLabel>Format</ToggleLabel>
                <ToggleTabs<'12' | '24'>
                  value={(settings as ClockSettings).format24h ? '24' : '12'}
                  options={['12', '24']}
                  labels={['12h', '24h']}
                  onChange={(v) => onSettingsChange({ format24h: v === '24' })}
                />
              </ToggleRow>
            </FormGroup>
            )}

            {!isDuoClockStyle && (
            <FormGroup>
              <ToggleRow>
                <ToggleLabel>Seconds</ToggleLabel>
                <Switch
                  checked={(settings as ClockSettings).showSeconds}
                  onChange={(v) => onSettingsChange({ showSeconds: v })}
                  aria-label="Seconds"
                />
              </ToggleRow>
            </FormGroup>
            )}

            {!isFlowerClockStyle && (
            <FormGroup>
              <ToggleRow>
                <ToggleLabel>{isDuoClockStyle ? 'Weekdays' : 'Date'}</ToggleLabel>
                <Switch
                  checked={(settings as ClockSettings).showDate}
                  onChange={(v) => onSettingsChange({ showDate: v })}
                  aria-label={isDuoClockStyle ? 'Weekdays' : 'Date'}
                />
              </ToggleRow>
            </FormGroup>
            )}

            {!isClassicStyle && (
            <FormGroup>
              <Label>Size</Label>
              <Select
                value={(settings as ClockSettings).fontSize}
                onChange={(e) => onSettingsChange({ fontSize: e.target.value as 'small' | 'medium' | 'large' })}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </Select>
            </FormGroup>
            )}
          </>
          )}

          {isBoard && (
          <>
            <ImageHint>
              Paste direct image links from Pinterest, Imgur, Unsplash or any public URL
            </ImageHint>
            <FormGroup>
              <ImageInputRow>
                <SharedInput
                  type="text"
                  placeholder="https://..."
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddImage(); }}
                  style={{ flex: 1, minWidth: 0 }}
                />
                <AddButton
                  onClick={handleAddImage}
                  disabled={(settings as BoardSettings).imageUrls.length >= 8 || !imageUrlInput.trim()}
                >
                  Add
                </AddButton>
              </ImageInputRow>
              <ImageCounter>{(settings as BoardSettings).imageUrls.length} / 8</ImageCounter>
              {(settings as BoardSettings).imageUrls.length > 0 && (
                <ImageList>
                  {(settings as BoardSettings).imageUrls.map((url, i) => (
                    <ImageItem
                      key={`${i}-${url}`}
                      $dragging={dragIdx === i}
                      $dragOver={dragOverIdx === i && dragIdx !== i}
                      draggable
                      onDragStart={() => handleDragStart(i)}
                      onDragEnter={() => handleDragEnter(i)}
                      onDragLeave={handleDragLeave}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(i)}
                      onDragEnd={handleDragEnd}
                    >
                      <DragHandle>
                        <GripVertical />
                      </DragHandle>
                      <ImageThumb src={url} alt="" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      <ImageUrl>{url.split('/').pop() || url}</ImageUrl>
                      <RemoveButton onClick={() => handleRemoveImage(i)} title="Remove">
                        <X />
                      </RemoveButton>
                    </ImageItem>
                  ))}
                </ImageList>
              )}
            </FormGroup>
          </>
          )}
        </Section>}

        {/* ── 3. Color (hide for board) ── */}
        {(!visibleSection || visibleSection === 'color') && !isBoard && (
        <Section>
          <SectionTitle>Color</SectionTitle>

          {isTypewriterStyle ? (
          <>
          <FormGroup>
            <Label>Primary</Label>
            <ColorPicker
              selectedColor={settings.primaryColor}
              onColorChange={(color) => onSettingsChange({ primaryColor: color })}
              type="primary"
            />
          </FormGroup>

          <FormGroup>
            <Label>Background</Label>
            <TypewriterColorRow>
              {TYPEWRITER_COLORS.map((tc) => (
                <TypewriterColorDot
                  key={tc.value}
                  $color={tc.color}
                  $active={(settings as CalendarSettings).typewriterColor === tc.value}
                  title={tc.label}
                  onClick={() => onSettingsChange({ typewriterColor: tc.value })}
                />
              ))}
            </TypewriterColorRow>
          </FormGroup>
          </>
          ) : isFlowerClockStyle ? (
          <>
          <FormGroup>
            <Label>Primary</Label>
            <ColorPicker
              selectedColor={settings.primaryColor}
              onColorChange={(color) => onSettingsChange({ primaryColor: color })}
              type="primary"
            />
          </FormGroup>

          <FormGroup>
            <Label>Background</Label>
            <TypewriterColorRow>
              {(FLOWER_CLOCK_COLORS[(settings as ClockSettings).clockFrame] || FLOWER_CLOCK_COLORS.flower).map((tc) => (
                <TypewriterColorDot
                  key={tc.value}
                  $color={tc.color}
                  $active={(settings as ClockSettings).clockColor === tc.value}
                  title={tc.label}
                  onClick={() => onSettingsChange({ clockColor: tc.value })}
                />
              ))}
            </TypewriterColorRow>
          </FormGroup>
          </>
          ) : (
          <>
          <FormGroup>
            <Label>Primary</Label>
            <ColorPicker
              selectedColor={settings.primaryColor}
              onColorChange={(color) => onSettingsChange({ primaryColor: color })}
              type="primary"
            />
          </FormGroup>

          <FormGroup>
            <Label>Background</Label>
            <ColorPicker
              selectedColor={settings.backgroundColor}
              onColorChange={(color) => onSettingsChange({ backgroundColor: color })}
              type="background"
            />
          </FormGroup>

          {!isClassicStyle && (
          <FormGroup>
            <Label>Accent</Label>
            <ColorPicker
              selectedColor={settings.accentColor}
              onColorChange={(color) => onSettingsChange({ accentColor: color })}
              type="accent"
              showPresets={true}
            />
          </FormGroup>
          )}
          </>
          )}
        </Section>
        )}

        {/* ── 4. Layout (hide for board, hide for collage-only styles) ── */}
        {(!visibleSection || visibleSection === 'layout') && !isCollageStyle && !isBoard && (
        <Section>
          <SectionTitle>Layout</SectionTitle>

          <FormGroup>
            <Label>Corners</Label>
            <SliderRow>
              <Slider
                type="range"
                min="0"
                max="24"
                step="2"
                value={settings.borderRadius}
                onChange={(e) => onSettingsChange({ borderRadius: parseInt(e.target.value) })}
              />
              <SliderValue>{settings.borderRadius}px</SliderValue>
            </SliderRow>
          </FormGroup>

          <FormGroup>
            <ToggleRow>
              <ToggleLabel>Widget border</ToggleLabel>
              <Switch
                checked={settings.showBorder}
                onChange={(v) => onSettingsChange({ showBorder: v })}
                aria-label="Widget border"
              />
            </ToggleRow>
          </FormGroup>
        </Section>
        )}
      </Wrapper>
  );

  if (visibleSection) {
    return panelContent;
  }

  return (
    <PanelContainer $mobileOpen={mobileOpen}>
      <PanelHeader>
        <PanelTitle>Design</PanelTitle>
      </PanelHeader>
      {panelContent}
    </PanelContainer>
  );
};
