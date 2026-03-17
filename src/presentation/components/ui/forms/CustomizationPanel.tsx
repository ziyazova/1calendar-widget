import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { X, GripVertical, Calendar, CalendarDays, LayoutGrid, Type, Clock, Flower2, Sparkles, Image, Palette, SlidersHorizontal } from 'lucide-react';
import { Widget } from '../../../../domain/entities/Widget';
import { CalendarSettings } from '../../../../domain/value-objects/CalendarSettings';
import { ClockSettings } from '../../../../domain/value-objects/ClockSettings';
import { BoardSettings } from '../../../../domain/value-objects/BoardSettings';
import { ColorPicker } from '../ColorPicker';

interface CustomizationPanelProps {
  widget: Widget | null;
  onSettingsChange: (settings: Partial<CalendarSettings | ClockSettings | BoardSettings>) => void;
}

const PanelContainer = styled.div`
  width: 290px;
  height: 100vh;
  position: fixed;
  right: 0;
  top: 0;
  background: #ffffff;
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
  border-left: 1px solid rgba(0, 0, 0, 0.08);
  z-index: ${({ theme }) => theme.zIndex.sticky};
`;

const PanelHeader = styled.div`
  min-height: 64px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  border-bottom: none;
`;

const PanelTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  color: #1F1F1F;
  margin: 0;
  letter-spacing: -0.02em;
`;

const WidgetBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
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
  color: #3384F4;
  letter-spacing: -0.01em;
`;

const PanelContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 24px 32px;

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
    border-top: 1px solid rgba(0, 0, 0, 0.06);
  }
`;

const SectionTitle = styled.h3`
  font-size: 11px;
  font-weight: 600;
  color: #9A9A9A;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 18px 0;
  letter-spacing: -0.01em;
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
  color: #1F1F1F;
  margin-bottom: 8px;
  letter-spacing: -0.01em;
`;

const Select = styled.select`
  width: 100%;
  height: 36px;
  padding: 0 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  color: #1F1F1F;
  font-size: 13px;
  font-weight: 400;
  font-family: inherit;
  transition: all 0.15s ease;
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
    border-color: #3384F4;
    box-shadow: 0 0 0 3px rgba(51, 132, 244, 0.1);
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
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.06);
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #ffffff;
    border: 2px solid #3384F4;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(51, 132, 244, 0.25);
    transition: all 0.15s ease;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.15);
    box-shadow: 0 3px 10px rgba(51, 132, 244, 0.35);
  }

  &::-webkit-slider-thumb:active {
    transform: scale(0.95);
  }
`;

const SliderValue = styled.span`
  font-size: 12px;
  color: #6B6B6B;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  min-width: 32px;
  text-align: right;
`;

const Toggle = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 4px 0;
  border-radius: 4px;
  transition: opacity 0.12s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const ToggleText = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: #1F1F1F;
  letter-spacing: -0.01em;
`;

const ToggleSwitch = styled.div<{ $checked: boolean }>`
  width: 40px;
  height: 22px;
  border-radius: 11px;
  background: ${({ $checked }) => $checked
    ? 'linear-gradient(135deg, #3384F4, #5BA0F7)'
    : 'rgba(0, 0, 0, 0.12)'};
  position: relative;
  transition: background 0.25s ease;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ $checked }) => $checked ? '20px' : '2px'};
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
    transition: left 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

const EmptyState = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.tertiary};
  padding: 64px 24px;

  h3 {
    font-size: 14px;
    font-weight: 500;
    margin: 0 0 4px 0;
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  p {
    font-size: 13px;
    margin: 0;
    line-height: 1.5;
  }
`;

const ToggleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TypewriterColorRow = styled.div`
  display: flex;
  gap: 12px;
`;

const TypewriterColorDot = styled.button<{ $color: string; $active: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  border: 2px solid ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.12s ease;
  padding: 0;

  &:hover {
    transform: scale(1.1);
  }
`;

const TYPEWRITER_COLORS = [
  { value: 'blue', color: '#7a9bb5', label: 'Blue' },
  { value: 'green', color: '#7ba88e', label: 'Green' },
  { value: 'pink', color: '#c48a9a', label: 'Pink' },
  { value: 'brown', color: '#8b7355', label: 'Brown' },
  { value: 'beige', color: '#c4b39a', label: 'Beige' },
] as const;

const ImageHint = styled.p`
  font-size: 11px;
  color: #6B6B6B;
  margin: 0 0 12px 0;
  line-height: 1.5;
  letter-spacing: -0.01em;
`;

const ImageInputRow = styled.div`
  display: flex;
  gap: 8px;
`;

const ImageUrlInput = styled.input`
  flex: 1;
  height: 34px;
  padding: 0 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  color: #1F1F1F;
  font-size: 12px;
  font-family: inherit;
  transition: all 0.15s ease;

  &:hover {
    border-color: rgba(51, 132, 244, 0.3);
  }
  &:focus {
    outline: none;
    border-color: #3384F4;
    box-shadow: 0 0 0 3px rgba(51, 132, 244, 0.1);
  }
  &::placeholder {
    color: #6B6B6B;
  }
`;

const AddButton = styled.button`
  height: 34px;
  padding: 0 16px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #3384F4, #5BA0F7);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
  white-space: nowrap;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(51, 132, 244, 0.3);
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
  color: #6B6B6B;
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
  border-radius: 8px;
  font-size: 11px;
  color: #6B6B6B;
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
  color: #c8cdd3;
  flex-shrink: 0;
  padding: 4px 0;
  transition: color 0.12s ease;

  &:active {
    cursor: grabbing;
  }

  &:hover {
    color: #6B6B6B;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const ImageThumb = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid rgba(0, 0, 0, 0.06);
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
  color: #6B6B6B;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  flex-shrink: 0;
  padding: 0;
  transition: all 0.15s ease;

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
  padding: 8px 0;
  border: 1px solid ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.border.primary};
  background: ${({ $active, theme }) => $active ? `${theme.colors.primary}10` : '#fff'};
  color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.text.secondary};
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.12s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const LayoutOptions = styled.div`
  display: flex;
  gap: 8px;
`;

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  widget,
  onSettingsChange,
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

  const getWidgetInfo = (): { icon: React.FC; label: string } | null => {
    if (!widget) return null;
    if (widget.type === 'calendar') {
      const s = (widget.settings as CalendarSettings).style;
      const map: Record<string, { icon: React.FC; label: string }> = {
        'modern-grid-zoom-fixed': { icon: Calendar, label: 'Calendar \u2009·\u2009 Default' },
        'classic': { icon: CalendarDays, label: 'Calendar \u2009·\u2009 Classic' },
        'collage': { icon: LayoutGrid, label: 'Calendar \u2009·\u2009 Collage' },
        'typewriter': { icon: Type, label: 'Calendar \u2009·\u2009 Typewriter' },
      };
      return map[s] || { icon: Calendar, label: 'Calendar' };
    }
    if (widget.type === 'clock') {
      const s = (widget.settings as ClockSettings).style;
      const map: Record<string, { icon: React.FC; label: string }> = {
        'classic': { icon: Clock, label: 'Clock \u2009·\u2009 Classic' },
        'flower': { icon: Flower2, label: 'Clock \u2009·\u2009 Flower' },
        'dreamy': { icon: Sparkles, label: 'Clock \u2009·\u2009 Dreamy' },
      };
      return map[s] || { icon: Clock, label: 'Clock' };
    }
    if (widget.type === 'board') return { icon: Image, label: 'Board \u2009·\u2009 Moodboard' };
    return null;
  };

  if (!widget) {
    return (
      <PanelContainer>
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

  return (
    <PanelContainer>
      <PanelHeader>
        <PanelTitle>Design</PanelTitle>
        {getWidgetInfo() && (
          <WidgetBadge>
            {React.createElement(getWidgetInfo()!.icon)}
            <WidgetBadgeText>{getWidgetInfo()!.label}</WidgetBadgeText>
          </WidgetBadge>
        )}
      </PanelHeader>

      <PanelContent>
        {isTypewriterStyle && (
        <Section>
          <SectionTitle>Typewriter</SectionTitle>
          <FormGroup>
            <Label>Color</Label>
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
        </Section>
        )}

        {!isBoard && (
        <Section>
          <SectionTitle>Colors</SectionTitle>

          <FormGroup>
            <Label>Primary</Label>
            <ColorPicker
              selectedColor={settings.primaryColor}
              onColorChange={(color) => onSettingsChange({ primaryColor: color })}
              type="primary"
            />
          </FormGroup>

          {!isTypewriterStyle && (
          <FormGroup>
            <Label>Background</Label>
            <ColorPicker
              selectedColor={settings.backgroundColor}
              onColorChange={(color) => onSettingsChange({ backgroundColor: color })}
              type="background"
            />
          </FormGroup>
          )}

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
        </Section>
        )}

        {!isCollageStyle && !isBoard && (
        <Section>
          <SectionTitle>Layout</SectionTitle>

          <FormGroup>
            <Label>Radius</Label>
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
            <ToggleGroup>
              <Toggle>
                <ToggleText>Border</ToggleText>
                <ToggleSwitch $checked={settings.showBorder} />
                <HiddenCheckbox
                  type="checkbox"
                  checked={settings.showBorder}
                  onChange={(e) => onSettingsChange({ showBorder: e.target.checked })}
                />
              </Toggle>

              {widget.type === 'calendar' && (
                <Toggle>
                  <ToggleText>Day borders</ToggleText>
                  <ToggleSwitch $checked={(settings as CalendarSettings).showDayBorders} />
                  <HiddenCheckbox
                    type="checkbox"
                    checked={(settings as CalendarSettings).showDayBorders}
                    onChange={(e) => onSettingsChange({ showDayBorders: e.target.checked })}
                  />
                </Toggle>
              )}
            </ToggleGroup>
          </FormGroup>
        </Section>
        )}

        {isBoard && (
          <Section>
            <SectionTitle>Images</SectionTitle>
            <ImageHint>
              Paste direct image links from Pinterest, Imgur, Unsplash or any public URL
            </ImageHint>
            <FormGroup>
              <ImageInputRow>
                <ImageUrlInput
                  type="text"
                  placeholder="https://..."
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddImage(); }}
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
          </Section>
        )}

        {widget.type === 'clock' && (
          <Section>
            <SectionTitle>Clock</SectionTitle>

            {isFlowerClockStyle && (
            <FormGroup>
              <Label>Frame</Label>
              <Select
                value={(settings as ClockSettings).clockFrame}
                onChange={(e) => onSettingsChange({ clockFrame: e.target.value as 'flower' | 'alarm' })}
              >
                <option value="flower">Flower</option>
                <option value="alarm">Alarm Clock</option>
              </Select>
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

            <FormGroup>
              <ToggleGroup>
                <Toggle>
                  <ToggleText>Seconds</ToggleText>
                  <ToggleSwitch $checked={(settings as ClockSettings).showSeconds} />
                  <HiddenCheckbox
                    type="checkbox"
                    checked={(settings as ClockSettings).showSeconds}
                    onChange={(e) => onSettingsChange({ showSeconds: e.target.checked })}
                  />
                </Toggle>

                {!isFlowerClockStyle && (
                <Toggle>
                  <ToggleText>24h format</ToggleText>
                  <ToggleSwitch $checked={(settings as ClockSettings).format24h} />
                  <HiddenCheckbox
                    type="checkbox"
                    checked={(settings as ClockSettings).format24h}
                    onChange={(e) => onSettingsChange({ format24h: e.target.checked })}
                  />
                </Toggle>
                )}

                {!isFlowerClockStyle && (
                <Toggle>
                  <ToggleText>Date</ToggleText>
                  <ToggleSwitch $checked={(settings as ClockSettings).showDate} />
                  <HiddenCheckbox
                    type="checkbox"
                    checked={(settings as ClockSettings).showDate}
                    onChange={(e) => onSettingsChange({ showDate: e.target.checked })}
                  />
                </Toggle>
                )}
              </ToggleGroup>
            </FormGroup>
          </Section>
        )}
      </PanelContent>
    </PanelContainer>
  );
};
