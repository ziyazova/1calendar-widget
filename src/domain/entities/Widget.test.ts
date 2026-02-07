import { Widget } from './Widget';
import { CalendarSettings } from '../value-objects/CalendarSettings';
import { ClockSettings } from '../value-objects/ClockSettings';

describe('Widget', () => {
  describe('factory methods', () => {
    it('createCalendar creates a calendar widget', () => {
      const settings = new CalendarSettings();
      const widget = Widget.createCalendar('cal-1', settings);

      expect(widget.id).toBe('cal-1');
      expect(widget.type).toBe('calendar');
      expect(widget.settings).toBe(settings);
    });

    it('createClock creates a clock widget', () => {
      const settings = new ClockSettings();
      const widget = Widget.createClock('clk-1', settings);

      expect(widget.id).toBe('clk-1');
      expect(widget.type).toBe('clock');
      expect(widget.settings).toBe(settings);
    });
  });

  describe('updateSettings', () => {
    it('returns a new Widget instance', () => {
      const settings = new CalendarSettings();
      const widget = Widget.createCalendar('cal-1', settings);
      const updated = widget.updateSettings({ primaryColor: '#FF0000' });

      expect(updated).not.toBe(widget);
      expect(updated.id).toBe(widget.id);
      expect(updated.type).toBe(widget.type);
    });

    it('merges settings without mutating original', () => {
      const settings = new CalendarSettings();
      const widget = Widget.createCalendar('cal-1', settings);
      const updated = widget.updateSettings({ primaryColor: '#FF0000' });

      expect(updated.settings.primaryColor).toBe('#FF0000');
      expect(widget.settings.primaryColor).toBe('#667EEA');
    });
  });

  describe('isValid', () => {
    it('returns true for a valid widget', () => {
      const widget = Widget.createCalendar('cal-1', new CalendarSettings());
      expect(widget.isValid()).toBe(true);
    });

    it('returns false for empty id', () => {
      const widget = new Widget('', 'calendar', {});
      expect(widget.isValid()).toBe(false);
    });

    it('returns false for empty type', () => {
      const widget = new Widget('id', '', {});
      expect(widget.isValid()).toBe(false);
    });
  });

  describe('toEmbedData / fromEmbedData roundtrip', () => {
    it('preserves widget data through serialization', () => {
      const settings = new CalendarSettings({ primaryColor: '#123456', style: 'modern-weekly' });
      const widget = Widget.createCalendar('cal-roundtrip', settings);

      const data = widget.toEmbedData();
      const restored = Widget.fromEmbedData(data);

      expect(restored.id).toBe(widget.id);
      expect(restored.type).toBe(widget.type);
      expect(restored.settings.primaryColor).toBe('#123456');
      expect(restored.settings.style).toBe('modern-weekly');
    });
  });

  describe('getEmbedConfig', () => {
    it('returns widgetType and settings', () => {
      const settings = new ClockSettings({ showSeconds: false });
      const widget = Widget.createClock('clk-1', settings);
      const config = widget.getEmbedConfig();

      expect(config.widgetType).toBe('clock');
      expect(config.settings).toBe(settings);
    });
  });
});
