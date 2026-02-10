/**
 * Dev smoke test for embed size feature.
 * Run: npx vitest run src/test/embed-size-smoke.test.ts
 *
 * Exercises the full pipeline: Settings → URL encode → URL decode → scale math
 * and prints results so they're visible in the terminal.
 */
import { CalendarSettings } from '../domain/value-objects/CalendarSettings';
import { ClockSettings } from '../domain/value-objects/ClockSettings';
import { CompactUrlCodec } from '../infrastructure/services/url-codec/CompactUrlCodec';

// ── helpers ──────────────────────────────────────────────────────────
function simulateScale(
  containerW: number,
  refW: number,
) {
  const MIN_SCALE = 0.25;
  const MAX_SCALE = 2.0;
  return Math.max(MIN_SCALE, Math.min(containerW / refW, MAX_SCALE));
}

function log(label: string, data: Record<string, unknown>) {
  console.log(`\n  [SMOKE] ${label}`);
  for (const [k, v] of Object.entries(data)) {
    console.log(`    ${k}: ${JSON.stringify(v)}`);
  }
}

// ── tests ────────────────────────────────────────────────────────────
describe('Embed Size — Smoke Test', () => {
  // -------- CalendarSettings --------
  describe('CalendarSettings', () => {
    it('defaults', () => {
      const s = new CalendarSettings();
      log('CalendarSettings defaults', {
        embedWidth: s.embedWidth,
        embedHeight: s.embedHeight,
      });
      expect(s.embedWidth).toBe(420);
      expect(s.embedHeight).toBe(380);
    });

    it('custom values survive update()', () => {
      const s = new CalendarSettings().update({ embedWidth: 700, embedHeight: 500 });
      log('CalendarSettings after update()', {
        embedWidth: s.embedWidth,
        embedHeight: s.embedHeight,
      });
      expect(s.embedWidth).toBe(700);
      expect(s.embedHeight).toBe(500);
    });

    it('JSON roundtrip preserves embed size', () => {
      const orig = new CalendarSettings({ embedWidth: 600, embedHeight: 450 });
      const restored = CalendarSettings.fromJson(orig.toJson());
      log('CalendarSettings JSON roundtrip', {
        original: { w: orig.embedWidth, h: orig.embedHeight },
        restored: { w: restored.embedWidth, h: restored.embedHeight },
      });
      expect(restored.embedWidth).toBe(600);
      expect(restored.embedHeight).toBe(450);
    });
  });

  // -------- ClockSettings --------
  describe('ClockSettings', () => {
    it('defaults', () => {
      const s = new ClockSettings();
      log('ClockSettings defaults', {
        embedWidth: s.embedWidth,
        embedHeight: s.embedHeight,
      });
      expect(s.embedWidth).toBe(360);
      expect(s.embedHeight).toBe(360);
    });

    it('custom values survive update()', () => {
      const s = new ClockSettings().update({ embedWidth: 500, embedHeight: 400 });
      log('ClockSettings after update()', {
        embedWidth: s.embedWidth,
        embedHeight: s.embedHeight,
      });
      expect(s.embedWidth).toBe(500);
      expect(s.embedHeight).toBe(400);
    });
  });

  // -------- URL Encode / Decode --------
  describe('CompactUrlCodec', () => {
    it('encodes non-default embed size into URL', () => {
      const settings = {
        primaryColor: '#667EEA',
        backgroundColor: '#ffffff',
        style: 'modern-grid',
        embedWidth: 650,
        embedHeight: 500,
      };

      const encoded = CompactUrlCodec.encode('calendar', settings);
      const url = CompactUrlCodec.createCompactEmbedUrl('https://example.com', 'calendar', settings);
      const decoded = CompactUrlCodec.decode(encoded);

      log('URL encode/decode roundtrip (non-default)', {
        encoded,
        url,
        decodedWidth: decoded?.settings.embedWidth,
        decodedHeight: decoded?.settings.embedHeight,
      });

      expect(decoded!.settings.embedWidth).toBe(650);
      expect(decoded!.settings.embedHeight).toBe(500);
    });

    it('omits default embed size (shorter URL)', () => {
      const withDefaults = {
        primaryColor: '#667EEA',
        style: 'modern-grid',
        embedWidth: 420,
        embedHeight: 380,
      };
      const withCustom = {
        primaryColor: '#667EEA',
        style: 'modern-grid',
        embedWidth: 600,
        embedHeight: 400,
      };

      const urlDefault = CompactUrlCodec.createCompactEmbedUrl('https://x.com', 'calendar', withDefaults);
      const urlCustom = CompactUrlCodec.createCompactEmbedUrl('https://x.com', 'calendar', withCustom);

      log('URL length comparison', {
        defaultUrl: urlDefault,
        defaultLength: urlDefault.length,
        customUrl: urlCustom,
        customLength: urlCustom.length,
      });

      expect(urlCustom.length).toBeGreaterThan(urlDefault.length);
    });
  });

  // -------- Scale Calculation (width-only) --------
  describe('Scale math (EmbedScaleWrapper logic)', () => {
    const scenarios = [
      { name: 'Notion small iframe',  cw: 300, rw: 420 },
      { name: 'Notion default',       cw: 420, rw: 420 },
      { name: 'Large iframe',         cw: 800, rw: 420 },
      { name: 'Custom ref 600',       cw: 800, rw: 600 },
      { name: 'Tiny iframe (clamp)',   cw: 100, rw: 420 },
      { name: 'Huge iframe (cap 2x)',  cw: 2000, rw: 420 },
    ];

    for (const s of scenarios) {
      it(s.name, () => {
        const scale = simulateScale(s.cw, s.rw);
        log(`Scale: ${s.name}`, {
          containerWidth: s.cw,
          refWidth: s.rw,
          scale: scale.toFixed(3),
        });
        expect(scale).toBeGreaterThanOrEqual(0.25);
        expect(scale).toBeLessThanOrEqual(2.0);
      });
    }
  });
});
