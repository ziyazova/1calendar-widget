import { CompactUrlCodec } from './CompactUrlCodec';

describe('CompactUrlCodec', () => {
  describe('encode / decode roundtrip', () => {
    it('roundtrips calendar settings', () => {
      const settings = {
        primaryColor: '#667EEA',
        backgroundColor: '#ffffff',
        accentColor: '#f1f5f9',
        defaultView: 'month',
        showWeekends: true,
        borderRadius: 12,
        showBorder: true,
        style: 'modern-grid',
      };

      const encoded = CompactUrlCodec.encode('calendar', settings);
      const decoded = CompactUrlCodec.decode(encoded);

      expect(decoded).not.toBeNull();
      expect(decoded!.widgetType).toBe('calendar');
      // default values are restored from DEFAULTS
      expect(decoded!.settings.primaryColor).toBe('#667EEA');
      expect(decoded!.settings.showWeekends).toBe(true);
    });

    it('roundtrips clock settings with non-default values', () => {
      const settings = {
        primaryColor: '#FF0000',
        backgroundColor: '#000000',
        showSeconds: false,
        format24h: false,
        style: 'modern',
      };

      const encoded = CompactUrlCodec.encode('clock', settings);
      const decoded = CompactUrlCodec.decode(encoded);

      expect(decoded).not.toBeNull();
      expect(decoded!.widgetType).toBe('clock');
      expect(decoded!.settings.showSeconds).toBe(false);
      expect(decoded!.settings.format24h).toBe(false);
    });
  });

  describe('invalid input', () => {
    it('returns null for garbage input', () => {
      const result = CompactUrlCodec.decode('!!!not-base64!!!');
      expect(result).toBeNull();
    });

    it('returns null for empty string', () => {
      const result = CompactUrlCodec.decode('');
      expect(result).toBeNull();
    });
  });

  describe('palette color encoding', () => {
    it('encodes palette colors as single hex digit', () => {
      const settings = {
        primaryColor: '#764BA2', // index 1 in palette
        backgroundColor: '#ffffff',
      };

      const encoded = CompactUrlCodec.encode('calendar', settings);
      // Decoded result should still have the correct color
      const decoded = CompactUrlCodec.decode(encoded);
      expect(decoded!.settings.primaryColor).toBe('#764BA2');
    });

    it('encodes custom colors as raw hex', () => {
      const settings = {
        primaryColor: '#ABCDEF',
        backgroundColor: '#ffffff',
      };

      const encoded = CompactUrlCodec.encode('calendar', settings);
      const decoded = CompactUrlCodec.decode(encoded);
      expect(decoded!.settings.primaryColor).toBe('#ABCDEF');
    });
  });

  describe('URL generation', () => {
    it('createCompactEmbedUrl produces valid URL', () => {
      const url = CompactUrlCodec.createCompactEmbedUrl(
        'https://example.com',
        'calendar',
        { primaryColor: '#667EEA', style: 'modern-grid' }
      );

      expect(url).toContain('https://example.com/embed/calendar?c=');
    });

    it('extractFromCompactUrl roundtrips with createCompactEmbedUrl', () => {
      const settings = {
        primaryColor: '#764BA2',
        backgroundColor: '#ffffff',
        style: 'modern-grid',
      };

      const url = CompactUrlCodec.createCompactEmbedUrl('https://example.com', 'calendar', settings);
      const extracted = CompactUrlCodec.extractFromCompactUrl(url);

      expect(extracted).not.toBeNull();
      expect(extracted!.widgetType).toBe('calendar');
      expect(extracted!.settings.primaryColor).toBe('#764BA2');
    });
  });
});
