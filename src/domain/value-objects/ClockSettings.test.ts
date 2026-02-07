import { ClockSettings } from './ClockSettings';

describe('ClockSettings', () => {
  describe('defaults', () => {
    it('creates with default values when no args provided', () => {
      const settings = new ClockSettings();
      expect(settings.primaryColor).toBe('#667EEA');
      expect(settings.backgroundColor).toBe('#ffffff');
      expect(settings.accentColor).toBe('#f1f5f9');
      expect(settings.showSeconds).toBe(true);
      expect(settings.format24h).toBe(true);
      expect(settings.borderRadius).toBe(12);
      expect(settings.showBorder).toBe(true);
      expect(settings.showDate).toBe(true);
      expect(settings.fontSize).toBe('medium');
      expect(settings.style).toBe('modern');
      expect(settings.embedWidth).toBe(360);
      expect(settings.embedHeight).toBe(360);
    });
  });

  describe('overrides', () => {
    it('accepts partial overrides', () => {
      const settings = new ClockSettings({
        showSeconds: false,
        format24h: false,
        fontSize: 'large',
      });
      expect(settings.showSeconds).toBe(false);
      expect(settings.format24h).toBe(false);
      expect(settings.fontSize).toBe('large');
      // defaults preserved
      expect(settings.primaryColor).toBe('#667EEA');
      expect(settings.style).toBe('modern');
    });

    it('accepts embedWidth and embedHeight overrides', () => {
      const settings = new ClockSettings({
        embedWidth: 500,
        embedHeight: 400,
      });
      expect(settings.embedWidth).toBe(500);
      expect(settings.embedHeight).toBe(400);
    });
  });

  describe('immutability', () => {
    it('update() returns a new instance', () => {
      const original = new ClockSettings();
      const updated = original.update({ showSeconds: false });

      expect(updated).not.toBe(original);
      expect(updated.showSeconds).toBe(false);
      expect(original.showSeconds).toBe(true);
    });

    it('update() preserves unchanged fields', () => {
      const original = new ClockSettings({ style: 'analog-classic' });
      const updated = original.update({ fontSize: 'small' });

      expect(updated.style).toBe('analog-classic');
      expect(updated.fontSize).toBe('small');
    });
  });

  describe('JSON roundtrip', () => {
    it('toJson/fromJson preserves all fields', () => {
      const original = new ClockSettings({
        primaryColor: '#ABCDEF',
        style: 'analog-classic',
        showSeconds: false,
        format24h: false,
      });

      const json = original.toJson();
      const restored = ClockSettings.fromJson(json);

      expect(restored.primaryColor).toBe(original.primaryColor);
      expect(restored.style).toBe(original.style);
      expect(restored.showSeconds).toBe(original.showSeconds);
      expect(restored.format24h).toBe(original.format24h);
    });

    it('fromJson returns defaults on invalid JSON', () => {
      const settings = ClockSettings.fromJson('{{invalid');
      expect(settings.style).toBe('modern');
    });
  });
});
