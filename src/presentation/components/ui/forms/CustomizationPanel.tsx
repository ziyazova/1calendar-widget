import React from 'react';
import styled from 'styled-components';
import { Widget } from '../../../../domain/entities/Widget';
import { CalendarSettings } from '../../../../domain/value-objects/CalendarSettings';
import { ClockSettings } from '../../../../domain/value-objects/ClockSettings';
import { WeatherSettings } from '../../../../domain/value-objects/WeatherSettings';
import { ColorPicker } from '../ColorPicker';
import { getSuggestedColors } from '../../../themes/colors';

interface CustomizationPanelProps {
  widget: Widget | null;
  onSettingsChange: (settings: Partial<CalendarSettings | ClockSettings | WeatherSettings>) => void;
}

const PanelContainer = styled.div`
  width: 380px;
  height: 100%;
  background: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const PanelTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing['2xl']} 0;
  text-align: center;
  background: linear-gradient(45deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  padding: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.background.secondary}E6, 
    ${({ theme }) => theme.colors.background.tertiary}B3);
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 1px solid ${({ theme }) => theme.colors.border.secondary};
  backdrop-filter: blur(10px);
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: 2px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: 2px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Slider = styled.input`
  width: 100%;
  height: 8px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: linear-gradient(90deg, 
    ${({ theme }) => theme.colors.border.secondary}, 
    ${({ theme }) => theme.colors.primary}40);
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(45deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
    border: 2px solid ${({ theme }) => theme.colors.background.primary};
  }
  
  &::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
`;

const SliderValue = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  text-align: right;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.primary}15;
  border-radius: ${({ theme }) => theme.radii.md};
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.lg};
  transition: all 0.2s ease;
  background: ${({ theme }) => theme.colors.background.secondary}40;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary}10;
    border-color: ${({ theme }) => theme.colors.primary}40;
  }
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  accent-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radii.sm};
`;

const ColorPickerNote = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.background.tertiary}60;
  border-radius: ${({ theme }) => theme.radii.md};
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
`;

const EmptyState = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: ${({ theme }) => theme.spacing['4xl']} 0;
  
  h3 {
    font-size: ${({ theme }) => theme.typography.sizes.xl};
    margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
    background: linear-gradient(45deg, ${({ theme }) => theme.colors.text.secondary}, ${({ theme }) => theme.colors.text.tertiary});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    font-size: ${({ theme }) => theme.typography.sizes.md};
    margin: 0;
    line-height: 1.5;
  }
`;

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  widget,
  onSettingsChange,
}) => {
  if (!widget) {
    return (
      <PanelContainer>
        <EmptyState>
          <h3>✨ No Widget Selected</h3>
          <p>Choose a widget from the sidebar to start customizing its appearance and behavior with our advanced styling options</p>
        </EmptyState>
      </PanelContainer>
    );
  }

  const settings = widget.settings as CalendarSettings | ClockSettings | WeatherSettings;
  const suggestedColors = getSuggestedColors(settings.backgroundColor);

  return (
    <PanelContainer>
      <PanelTitle>🎨 Customize Widget</PanelTitle>

      <Section>
        <SectionTitle>🎨 Colors & Theme</SectionTitle>

        <FormGroup>
          <Label>Primary Color</Label>
          <ColorPicker
            selectedColor={settings.primaryColor}
            onColorChange={(color) => onSettingsChange({ primaryColor: color })}
            type="primary"
          />
          <ColorPickerNote>
            💡 Primary color is used for buttons, selections, and accents
          </ColorPickerNote>
        </FormGroup>

        <FormGroup>
          <Label>Background</Label>
          <ColorPicker
            selectedColor={settings.backgroundColor}
            onColorChange={(color) => onSettingsChange({ backgroundColor: color })}
            type="background"
          />
          <ColorPickerNote>
            🎯 Text color automatically adjusts for best contrast
          </ColorPickerNote>
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
        <SectionTitle>✨ Style & Appearance</SectionTitle>

        <FormGroup>
          <Label>Widget Style</Label>
          <Select
            value={settings.style}
            onChange={(e) => onSettingsChange({ style: e.target.value as any })}
          >
            {widget.type === 'calendar' && (
              <>
                <option value="detailed">📅 Detailed Calendar</option>
                <option value="compact">📋 Compact View</option>
                <option value="week">📆 Week View</option>
              </>
            )}
            {widget.type === 'clock' && (
              <>
                <option value="digital">🔢 Digital Clock</option>
                <option value="analog">⏰ Analog Clock</option>
                <option value="world">🌍 World Time</option>
              </>
            )}
            {widget.type === 'weather' && (
              <>
                <option value="current">☀️ Current Weather</option>
                <option value="forecast">📊 5-Day Forecast</option>
                <option value="minimal">🎯 Minimal View</option>
              </>
            )}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Opacity</Label>
          <SliderContainer>
            <Slider
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={settings.opacity}
              onChange={(e) => onSettingsChange({ opacity: parseFloat(e.target.value) })}
            />
            <SliderValue>{Math.round(settings.opacity * 100)}%</SliderValue>
          </SliderContainer>
        </FormGroup>

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

      {/* Calendar specific settings */}
      {widget.type === 'calendar' && (
        <Section>
          <SectionTitle>📅 Calendar Settings</SectionTitle>

          <FormGroup>
            <Label>Default View</Label>
            <Select
              value={(settings as CalendarSettings).defaultView}
              onChange={(e) => onSettingsChange({ defaultView: e.target.value as 'month' | 'week' | 'day' })}
            >
              <option value="month">📅 Month View</option>
              <option value="week">📆 Week View</option>
              <option value="day">📋 Day View</option>
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
          <SectionTitle>🕐 Clock Settings</SectionTitle>

          <FormGroup>
            <Label>Font Size</Label>
            <Select
              value={(settings as ClockSettings).fontSize}
              onChange={(e) => onSettingsChange({ fontSize: e.target.value as 'small' | 'medium' | 'large' })}
            >
              <option value="small">📱 Small</option>
              <option value="medium">💻 Medium</option>
              <option value="large">🖥️ Large</option>
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

      {/* Weather specific settings */}
      {widget.type === 'weather' && (
        <Section>
          <SectionTitle>🌤️ Weather Settings</SectionTitle>

          <FormGroup>
            <Label>Location</Label>
            <Input
              type="text"
              value={(settings as WeatherSettings).location}
              onChange={(e) => onSettingsChange({ location: e.target.value })}
              placeholder="Enter city name"
            />
          </FormGroup>

          <FormGroup>
            <Label>Temperature Unit</Label>
            <Select
              value={(settings as WeatherSettings).temperatureUnit}
              onChange={(e) => onSettingsChange({ temperatureUnit: e.target.value as 'celsius' | 'fahrenheit' })}
            >
              <option value="celsius">🌡️ Celsius (°C)</option>
              <option value="fahrenheit">🌡️ Fahrenheit (°F)</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <CheckboxContainer>
              <Checkbox
                type="checkbox"
                checked={(settings as WeatherSettings).showFeelsLike}
                onChange={(e) => onSettingsChange({ showFeelsLike: e.target.checked })}
              />
              Show "Feels Like" Temperature
            </CheckboxContainer>
          </FormGroup>

          <FormGroup>
            <CheckboxContainer>
              <Checkbox
                type="checkbox"
                checked={(settings as WeatherSettings).showHumidity}
                onChange={(e) => onSettingsChange({ showHumidity: e.target.checked })}
              />
              Show Humidity
            </CheckboxContainer>
          </FormGroup>
        </Section>
      )}
    </PanelContainer>
  );
}; 