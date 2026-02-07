import React, { useState } from 'react';
import styled from 'styled-components';
import { Widget } from '../../../../domain/entities/Widget';
import { CalendarSettings } from '../../../../domain/value-objects/CalendarSettings';
import { ClockSettings } from '../../../../domain/value-objects/ClockSettings';
import { ColorPicker } from '../ColorPicker';
import { Logger } from '../../../../infrastructure/services/Logger';

interface CustomizationPanelProps {
  widget: Widget | null;
  onSettingsChange: (settings: Partial<CalendarSettings | ClockSettings>) => void;
}

const PanelContainer = styled.div`
  width: 320px;
  height: calc(100vh - 80px - 64px);
  background: #fafbfc;
  border-left: 1px solid #e1e5e9;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
  flex-shrink: 0;
`;

const PanelHeader = styled.div`
  padding: 24px 20px 16px;
  border-bottom: 1px solid #e1e5e9;
  background: #ffffff;
`;

const PanelTitle = styled.h2`
  font-size: 17px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
  letter-spacing: -0.022em;
`;

const PanelContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #d2d2d7;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a1a1aa;
  }
`;

const Section = styled.div`
  margin-bottom: 32px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 16px 0;
  letter-spacing: -0.016em;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #6e6e73;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
`;

const Select = styled.select`
  width: 100%;
  height: 44px;
  padding: 0 16px;
  border: 1px solid #d2d2d7;
  border-radius: 12px;
  background: #ffffff;
  color: #1d1d1f;
  font-size: 15px;
  font-weight: 400;
  font-family: inherit;
  transition: border-color 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 16px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 48px;
  
  &:hover {
    border-color: #a1a1aa;
  }
  
  &:focus {
    outline: none;
    border-color: #007aff;
  }
`;

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Slider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e5e5ea;
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #007aff;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
  }
  
  &::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
  }
  
  &::-webkit-slider-thumb:active {
    transform: scale(0.95);
  }
`;

const SliderValue = styled.span`
  font-size: 13px;
  color: #6e6e73;
  font-weight: 500;
  text-align: right;
  font-variant-numeric: tabular-nums;
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  color: #1d1d1f;
  padding: 12px 0;
  font-size: 15px;
  font-weight: 400;
  transition: all 0.2s ease;
  
  &:hover {
    color: #007aff;
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1.5px solid #d2d2d7;
  background: #ffffff;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  
  &:checked {
    background: #007aff;
    border-color: #007aff;
  }
  
  &:checked::after {
    content: '✓';
    position: absolute;
    color: white;
    font-size: 12px;
    font-weight: 600;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #6e6e73;
  padding: 60px 20px;
  
  h3 {
    font-size: 17px;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: #1d1d1f;
  }
  
  p {
    font-size: 15px;
    margin: 0;
    line-height: 1.4;
  }
`;

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  widget,
  onSettingsChange,
}) => {
  if (!widget) {
    return (
      <PanelContainer>
        <PanelHeader>
          <PanelTitle>Customization</PanelTitle>
        </PanelHeader>
        <EmptyState>
          <h3>No Widget Selected</h3>
          <p>Choose a widget from the sidebar to start customizing its appearance and behavior</p>
        </EmptyState>
      </PanelContainer>
    );
  }

  const settings = widget.settings as CalendarSettings | ClockSettings;

  return (
    <PanelContainer>
      <PanelHeader>
        <PanelTitle>Customization</PanelTitle>
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
            />
          </FormGroup>
        </Section>

        <Section>
          <SectionTitle>Layout</SectionTitle>

          <FormGroup>
            <Label>Border Radius</Label>
            <SliderContainer>
              <Slider
                type="range"
                min="0"
                max="32"
                step="2"
                value={settings.borderRadius}
                onChange={(e) => onSettingsChange({ borderRadius: parseInt(e.target.value) })}
              />
              <SliderValue>{settings.borderRadius}px</SliderValue>
            </SliderContainer>
          </FormGroup>

          <FormGroup>
            <CheckboxContainer>
              <Checkbox
                type="checkbox"
                checked={settings.showBorder}
                onChange={(e) => onSettingsChange({ showBorder: e.target.checked })}
              />
              Show Border
            </CheckboxContainer>
          </FormGroup>
        </Section>

        <Section>
          <SectionTitle>Embed Size</SectionTitle>

          <FormGroup>
            <Label>Width</Label>
            <SliderContainer>
              <Slider
                type="range"
                min="200"
                max={widget.type === 'calendar' ? '800' : '600'}
                step="10"
                value={(settings as unknown as { embedWidth: number }).embedWidth}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  Logger.info('CustomizationPanel', 'Embed width changed', { embedWidth: val });
                  onSettingsChange({ embedWidth: val });
                }}
              />
              <SliderValue>{(settings as unknown as { embedWidth: number }).embedWidth}px</SliderValue>
            </SliderContainer>
          </FormGroup>

          <FormGroup>
            <Label>Height</Label>
            <SliderContainer>
              <Slider
                type="range"
                min="200"
                max="600"
                step="10"
                value={(settings as unknown as { embedHeight: number }).embedHeight}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  Logger.info('CustomizationPanel', 'Embed height changed', { embedHeight: val });
                  onSettingsChange({ embedHeight: val });
                }}
              />
              <SliderValue>{(settings as unknown as { embedHeight: number }).embedHeight}px</SliderValue>
            </SliderContainer>
          </FormGroup>
        </Section>

        {/* Calendar specific settings */}
        {widget.type === 'calendar' && (
          <Section>
            <SectionTitle>Calendar Options</SectionTitle>

            <FormGroup>
              <Label>Default View</Label>
              <Select
                value={(settings as CalendarSettings).defaultView}
                onChange={(e) => onSettingsChange({ defaultView: e.target.value as 'month' | 'week' | 'day' })}
              >
                <option value="month">Month View</option>
                <option value="week">Week View</option>
                <option value="day">Day View</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  checked={(settings as CalendarSettings).showWeekends}
                  onChange={(e) => onSettingsChange({ showWeekends: e.target.checked })}
                />
                Show Weekends
              </CheckboxContainer>
            </FormGroup>
          </Section>
        )}

        {/* Clock specific settings */}
        {widget.type === 'clock' && (
          <Section>
            <SectionTitle>Clock Options</SectionTitle>

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
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  checked={(settings as ClockSettings).showSeconds}
                  onChange={(e) => onSettingsChange({ showSeconds: e.target.checked })}
                />
                Show Seconds
              </CheckboxContainer>
            </FormGroup>

            <FormGroup>
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  checked={(settings as ClockSettings).format24h}
                  onChange={(e) => onSettingsChange({ format24h: e.target.checked })}
                />
                24 Hour Format
              </CheckboxContainer>
            </FormGroup>

            <FormGroup>
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  checked={(settings as ClockSettings).showDate}
                  onChange={(e) => onSettingsChange({ showDate: e.target.checked })}
                />
                Show Date
              </CheckboxContainer>
            </FormGroup>
          </Section>
        )}

      </PanelContent>
    </PanelContainer>
  );
}; 