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
  width: 320px;
  height: calc(100vh - 64px - 40px);
  background: #ffffff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const PanelHeader = styled.div`
  padding: 24px 24px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.secondary};
`;

const PanelTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  letter-spacing: -0.03em;
`;

const PanelContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 24px 24px;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border.primary};
    border-radius: 10px;
  }
`;

const Section = styled.div`
  padding: 20px 0;

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border.secondary};
  }
`;

const SectionTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 16px 0;
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
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-bottom: 8px;
  letter-spacing: 0;
`;

const Select = styled.select`
  width: 100%;
  height: 38px;
  padding: 0 14px;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 13px;
  font-weight: 400;
  font-family: inherit;
  transition: border-color 0.15s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 14px;
  padding-right: 36px;

  &:hover {
    border-color: #ccc;
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
  height: 4px;
  border-radius: 2px;
  background: ${({ theme }) => theme.colors.border.primary};
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
    transition: transform 0.15s ease;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.15);
  }

  &::-webkit-slider-thumb:active {
    transform: scale(0.95);
  }
`;

const SliderValue = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  min-width: 36px;
  text-align: right;
`;

const Toggle = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 2px 0;
  transition: color 0.15s ease;
`;

const ToggleText = styled.span`
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.01em;
`;

const ToggleSwitch = styled.div<{ $checked: boolean }>`
  width: 38px;
  height: 22px;
  border-radius: 11px;
  background: ${({ $checked, theme }) => $checked ? theme.colors.primary : theme.colors.border.primary};
  position: relative;
  transition: background 0.2s ease;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ $checked }) => $checked ? '18px' : '2px'};
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
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
  padding: 60px 20px;

  h3 {
    font-size: 15px;
    font-weight: 600;
    margin: 0 0 6px 0;
    color: ${({ theme }) => theme.colors.text.primary};
    letter-spacing: -0.02em;
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
  gap: 14px;
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

  return (
    <PanelContainer>
      <PanelHeader>
        <PanelTitle>Customize</PanelTitle>
      </PanelHeader>

      <PanelContent>
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

          <FormGroup>
            <Label>Accent Color</Label>
            <ColorPicker
              selectedColor={settings.accentColor}
              onColorChange={(color) => onSettingsChange({ accentColor: color })}
              type="primary"
              showPresets={false}
            />
          </FormGroup>
        </Section>

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

        {widget.type === 'clock' && (
          <Section>
            <SectionTitle>Clock</SectionTitle>

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
