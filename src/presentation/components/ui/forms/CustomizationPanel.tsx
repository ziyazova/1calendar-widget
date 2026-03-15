import React from 'react';
import styled from 'styled-components';
import { Widget } from '../../../../domain/entities/Widget';
import { CalendarSettings } from '../../../../domain/value-objects/CalendarSettings';
import { ClockSettings } from '../../../../domain/value-objects/ClockSettings';
import { ColorPicker } from '../ColorPicker';

interface CustomizationPanelProps {
  widget: Widget | null;
  onSettingsChange: (settings: Partial<CalendarSettings | ClockSettings>) => void;
}

const PanelContainer = styled.div`
  width: 290px;
  height: 100vh;
  position: fixed;
  right: 0;
  top: 0;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
  border-left: 1px solid ${({ theme }) => theme.colors.border.primary};
  z-index: ${({ theme }) => theme.zIndex.sticky};
`;

const PanelHeader = styled.div`
  height: 72px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const PanelTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  letter-spacing: -0.02em;
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
  padding: 24px 0;

  &:first-child {
    padding-top: 20px;
  }

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
  }
`;

const SectionTitle = styled.h3`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 20px 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const FormGroup = styled.div`
  & + & {
    margin-top: 20px;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 10px;
  letter-spacing: -0.006em;
`;

const Select = styled.select`
  width: 100%;
  height: 34px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 8px;
  background: #ffffff;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 13px;
  font-weight: 400;
  font-family: inherit;
  transition: border-color 0.12s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23aeaeb2' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 10px center;
  background-repeat: no-repeat;
  background-size: 14px;
  padding-right: 32px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.tertiary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SliderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Slider = styled.input`
  flex: 1;
  height: 3px;
  border-radius: 2px;
  background: ${({ theme }) => theme.colors.border.primary};
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #ffffff;
    border: 2px solid ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    transition: transform 0.12s ease;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.1);
  }

  &::-webkit-slider-thumb:active {
    transform: scale(0.95);
  }
`;

const SliderValue = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 400;
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
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.006em;
`;

const ToggleSwitch = styled.div<{ $checked: boolean }>`
  width: 36px;
  height: 20px;
  border-radius: 10px;
  background: ${({ $checked, theme }) => $checked ? theme.colors.primary : '#d1d1d6'};
  position: relative;
  transition: background 0.2s ease;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ $checked }) => $checked ? '18px' : '2px'};
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    transition: left 0.2s ease;
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

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  widget,
  onSettingsChange,
}) => {
  if (!widget) {
    return (
      <PanelContainer>
        <PanelHeader>
          <PanelTitle>Customize</PanelTitle>
        </PanelHeader>
        <EmptyState>
          <h3>No Widget Selected</h3>
          <p>Choose a widget from the sidebar to customize</p>
        </EmptyState>
      </PanelContainer>
    );
  }

  const settings = widget.settings as CalendarSettings | ClockSettings;
  const calStyle = widget.type === 'calendar' ? (settings as CalendarSettings).style : '';
  const clkStyle = widget.type === 'clock' ? (settings as ClockSettings).style : '';
  const isClassicStyle = calStyle === 'classic' || calStyle === 'collage' || clkStyle === 'classic';
  const isCollageStyle = calStyle === 'collage';

  return (
    <PanelContainer>
      <PanelHeader>
        <PanelTitle>Customize</PanelTitle>
      </PanelHeader>

      <PanelContent>
        <Section>
          <SectionTitle>Appearance</SectionTitle>
          <FormGroup>
            <Label>Theme</Label>
            <Select
              value={(settings as CalendarSettings).theme || 'auto'}
              onChange={(e) => onSettingsChange({ theme: e.target.value as 'auto' | 'light' | 'dark' })}
            >
              <option value="auto">Auto (System)</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </Select>
          </FormGroup>
        </Section>

        <Section>
          <SectionTitle>Colors</SectionTitle>

          <FormGroup>
            <Label>Primary Color</Label>
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
            <Label>Accent Color</Label>
            <ColorPicker
              selectedColor={settings.accentColor}
              onColorChange={(color) => onSettingsChange({ accentColor: color })}
              type="accent"
              showPresets={true}
            />
          </FormGroup>
          )}
        </Section>

        {!isCollageStyle && (
        <Section>
          <SectionTitle>Layout</SectionTitle>

          <FormGroup>
            <Label>Border Radius</Label>
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
                <ToggleText>Show Border</ToggleText>
                <ToggleSwitch $checked={settings.showBorder} />
                <HiddenCheckbox
                  type="checkbox"
                  checked={settings.showBorder}
                  onChange={(e) => onSettingsChange({ showBorder: e.target.checked })}
                />
              </Toggle>

              {widget.type === 'calendar' && (
                <Toggle>
                  <ToggleText>Show Day Borders</ToggleText>
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

        {widget.type === 'clock' && (
          <Section>
            <SectionTitle>Clock</SectionTitle>

            {!isClassicStyle && (
            <FormGroup>
              <Label>Font Size</Label>
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
                  <ToggleText>Show Seconds</ToggleText>
                  <ToggleSwitch $checked={(settings as ClockSettings).showSeconds} />
                  <HiddenCheckbox
                    type="checkbox"
                    checked={(settings as ClockSettings).showSeconds}
                    onChange={(e) => onSettingsChange({ showSeconds: e.target.checked })}
                  />
                </Toggle>

                <Toggle>
                  <ToggleText>24 Hour Format</ToggleText>
                  <ToggleSwitch $checked={(settings as ClockSettings).format24h} />
                  <HiddenCheckbox
                    type="checkbox"
                    checked={(settings as ClockSettings).format24h}
                    onChange={(e) => onSettingsChange({ format24h: e.target.checked })}
                  />
                </Toggle>

                <Toggle>
                  <ToggleText>Show Date</ToggleText>
                  <ToggleSwitch $checked={(settings as ClockSettings).showDate} />
                  <HiddenCheckbox
                    type="checkbox"
                    checked={(settings as ClockSettings).showDate}
                    onChange={(e) => onSettingsChange({ showDate: e.target.checked })}
                  />
                </Toggle>
              </ToggleGroup>
            </FormGroup>
          </Section>
        )}
      </PanelContent>
    </PanelContainer>
  );
};
