# Design Pipeline

> How to iterate on widget design quickly and efficiently in **1calendar-widget**.

---

## Overview

The design pipeline has three stages: **Edit → Preview → Verify**. All three happen locally with instant feedback — no deploy needed.

```
Code change → Vite HMR → Browser auto-updates → Check embed view
     ↑                                               |
     └───────────── iterate ─────────────────────────┘
```

---

## 1. Start the Dev Server

```bash
npm run dev
```

Opens at **http://localhost:5173**. Vite provides hot module replacement (HMR) — saved changes appear in the browser instantly without a full reload.

---

## 2. Preview Routes

| URL | What it shows | Best for |
|-----|---------------|----------|
| `/studio` | Full editor: live widget preview + customization sidebar | Testing how settings affect appearance |
| `/embed/calendar` | Standalone calendar embed (no chrome) | Seeing exactly what Notion users see |
| `/embed/clock` | Standalone clock embed | Same, for clock widgets |

**Recommended workflow:** Keep two browser tabs open:
1. `/studio` — for interactive customization (colors, border radius, view mode)
2. `/embed/calendar` or `/embed/clock` — for pixel-accurate embed preview

---

## 3. Where to Edit

### Widget Styles (visual appearance)

| Widget | File |
|--------|------|
| Modern Grid (calendar) | `src/presentation/components/widgets/calendar/styles/ModernGrid.tsx` |
| Modern Weekly (calendar) | `src/presentation/components/widgets/calendar/styles/ModernWeeklyCalendar.tsx` |
| Modern Digital (clock) | `src/presentation/components/widgets/clock/styles/ModernClock.tsx` |
| Analog Classic (clock) | `src/presentation/components/widgets/clock/styles/AnalogClassicClock.tsx` |

### Design Tokens (shared sizing, typography, spacing)

| File | Controls |
|------|----------|
| `src/presentation/themes/widgetTokens.ts` | Responsive `clamp()` values for containers, fonts, spacing |
| `src/presentation/themes/theme.ts` | Global theme: spacing grid, fonts, transitions, shadows, z-index |
| `src/presentation/themes/colors.ts` | Color palettes, gradients, `getContrastColor()` |

### Embed Scaling

| File | Controls |
|------|----------|
| `src/presentation/components/embed/EmbedScaleWrapper.tsx` | CSS transform scaling for iframe embeds |
| `src/presentation/pages/CalendarEmbedPage.tsx` | Calendar embed page layout + global styles |
| `src/presentation/pages/ClockEmbedPage.tsx` | Clock embed page layout + global styles |

---

## 4. Design Rules

- **Use `clamp()` for all sizing** — never hardcode pixel values in widgets. Import from `widgetTokens.ts`.
- **Use `$transientProps`** in styled-components to avoid DOM warnings (e.g., `$isToday` not `isToday`).
- **Container constraints:** Calendar max-width is `min(420px, 95vw)`, clock is `min(360px, 95vw)`, both min-width `200px`.
- **Test at multiple sizes** — widgets render in iframes from 200px to 800px wide. Resize your browser window or use DevTools device mode.

---

## 5. Testing Embed at Different Sizes

### Browser DevTools

1. Open `/embed/calendar`
2. Open DevTools → Toggle device toolbar (Cmd+Shift+M)
3. Try these sizes to cover the range:
   - **200×200** — minimum embed
   - **420×380** — default calendar
   - **800×600** — maximum calendar

### Smoke Tests (terminal, no browser needed)

```bash
npm run test:smoke
```

Runs `src/test/embed-size-smoke.test.ts` — verifies settings → URL encode → decode → scale calculation for 6 iframe sizes (tiny → huge). Look for `[SMOKE]` tagged output.

---

## 6. Dev Logging

In dev mode, the browser console shows detailed logs:

| Tag | What it logs |
|-----|-------------|
| `[EmbedScaleWrapper]` | Reference size, container size, scale calculation |
| `[CalendarEmbed]` | URL config parsing, loaded settings |
| `[ClockEmbed]` | Same as CalendarEmbed |
| `[CustomizationPanel]` | Slider value changes |

Open DevTools Console to see these while iterating.

---

## 7. Full Validation Before Committing

```bash
npm run check    # lint + typecheck + test (all 46 tests)
```

Or run individually:

```bash
npm run lint       # ESLint warnings
npm run typecheck  # TypeScript --noEmit
npm run test       # Vitest single run
```

---

## 8. Quick Reference: End-to-End Design Change

Example: changing the calendar grid's today-highlight style.

1. `npm run dev` (if not already running)
2. Open `http://localhost:5173/studio` and `http://localhost:5173/embed/calendar`
3. Edit `src/presentation/components/widgets/calendar/styles/ModernGrid.tsx`
4. Save → browser updates instantly via HMR
5. Check both tabs — studio preview and embed view
6. Resize browser to test at small/large sizes
7. `npm run check` before committing
