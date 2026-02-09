import { CalendarSettings } from './CalendarSettings';

describe('CalendarSettings', () => {
  describe('defaults', () => {
    it('creates with default values when no args provided', () => {
      const settings = new CalendarSettings();
      expect(settings.primaryColor).toBe('#667EEA');
      expect(settings.backgroundColor).toBe('#ffffff');
      expect(settings.accentColor).toBe('#f1f5f9');
      expect(settings.defaultView).toBe('month');
      expect(settings.showWeekends).toBe(true);
      expect(settings.borderRadius).toBe(12);
      expect(settings.showBorder).toBe(true);
      expect(settings.style).toBe('modern-grid');
      expect(settings.embedWidth).toBe(420);
      expect(settings.embedHeight).toBe(380);
    });
  });

  describe('overrides', () => {
    it('accepts partial overrides', () => {
      const settings = new CalendarSettings({
        primaryColor: '#FF0000',
        defaultView: 'week',
        showWeekends: false,
      });
      expect(settings.primaryColor).toBe('#FF0000');
      expect(settings.defaultView).toBe('week');
      expect(settings.showWeekends).toBe(false);
      // defaults preserved
      expect(settings.backgroundColor).toBe('#ffffff');
      expect(settings.style).toBe('modern-grid');
    });

    it('embedHeight is proportional to embedWidth', () => {
      const settings = new CalendarSettings({
        embedWidth: 600,
      });
      expect(settings.embedWidth).toBe(600);
      // height = round(600 * 380/420) = 543
      expect(settings.embedHeight).toBe(Math.round(600 * 380 / 420));
    });
  });

  describe('immutability', () => {
    it('update() returns a new instance', () => {
      const original = new CalendarSettings();
      const updated = original.update({ primaryColor: '#FF0000' });

      expect(updated).not.toBe(original);
      expect(updated.primaryColor).toBe('#FF0000');
      expect(original.primaryColor).toBe('#667EEA');
    });

    it('update() preserves unchanged fields', () => {
      const original = new CalendarSettings({ defaultView: 'week' });
      const updated = original.update({ showBorder: false });

      expect(updated.defaultView).toBe('week');
      expect(updated.showBorder).toBe(false);
    });
  });

  describe('JSON roundtrip', () => {
    it('toJson/fromJson preserves all fields', () => {
      const original = new CalendarSettings({
        primaryColor: '#123456',
        style: 'modern-weekly',
        defaultView: 'day',
        showWeekends: false,
      });

      const json = original.toJson();
      const restored = CalendarSettings.fromJson(json);

      expect(restored.primaryColor).toBe(original.primaryColor);
      expect(restored.style).toBe(original.style);
      expect(restored.defaultView).toBe(original.defaultView);
      expect(restored.showWeekends).toBe(original.showWeekends);
    });

    it('fromJson returns defaults on invalid JSON', () => {
      const settings = CalendarSettings.fromJson('not json');
      expect(settings.primaryColor).toBe('#667EEA');
    });
  });
});
