# Project Documentation

> Consolidated docs for **1calendar-widget**. For AI agent context see `CLAUDE.md`. For project overview see `README.md`.

---

## Table of Contents

- [Development Guide](#development-guide)
  - [Quick Start](#quick-start)
  - [Adding a New Widget Style](#adding-a-new-widget-style)
  - [Embed System](#embed-system)
  - [Deployment](#deployment)
- [Adaptive Design Spec](#adaptive-design-spec)
- [Changelog](#changelog)
- [Issues & Roadmap](#issues--roadmap)

---

## Development Guide

### Quick Start

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # tsc && vite build → dist/
npm run preview      # Preview build on port 3000
npm run lint         # ESLint (warnings only, no errors)
npm run test         # Vitest single run (CI)
npm run test:watch   # Vitest watch mode (dev)
npm run test:coverage # Vitest with coverage
npm run typecheck    # tsc --noEmit
npm run check        # Full pipeline: lint + typecheck + test
npm run test:smoke   # Smoke test for embed size (terminal-visible logs)
```

### Adding a New Widget Style

1. Create the component in `src/presentation/components/widgets/calendar/styles/` or `clock/styles/`
2. Add it to `CalendarWidget.tsx` / `ClockWidget.tsx` in the switch on `settings.style`
3. Update `CalendarSettings.ts` / `ClockSettings.ts` — add the value to the `style` union type
4. Update `Sidebar.tsx` — add to `WIDGET_CATEGORIES`
5. Update `WidgetFactoryImpl.getDefaultSettings` if needed

**Responsiveness (required):**
- Use `widgetTokens.ts` for all sizing — never hardcode pixel values
- Use `clamp()` for typography, padding, spacing
- Container constraints: `min-width: 200px`, `max-width: min(420px, 95vw)` (calendar) or `min(360px, 95vw)` (clock)

### Embed System

Widgets are embedded as iframes. All configuration lives in the URL query string.

- **Compact format:** `/embed/calendar?c=<encoded>` — field shorthand, color palette indexing, default omission (60-70% smaller)
- **Legacy format:** `/embed/calendar?config=<base64>` — still supported for decoding
- **EmbedScaleWrapper** (`src/presentation/components/embed/EmbedScaleWrapper.tsx`):
  - Accepts `refWidth`/`refHeight` props (from widget `embedWidth`/`embedHeight` settings)
  - ResizeObserver measures the iframe container
  - Calculates `scale = min(containerWidth/refWidth, containerHeight/refHeight, 2.0)`
  - Applies `transform: scale(scale)` — range: **0.25–2.0** (scales both down and up)
  - Logs scale calculations via Logger in dev mode

#### Embed Size Settings

Users configure embed dimensions in the studio via Width/Height sliders. Values are stored in `CalendarSettings.embedWidth/embedHeight` and `ClockSettings.embedWidth/embedHeight`, encoded in URL as `ew`/`eh`.

| Widget | Property | Min | Default | Max |
|--------|----------|-----|---------|-----|
| Calendar | embedWidth | 200 | 420 | 800 |
| Calendar | embedHeight | 200 | 380 | 600 |
| Clock | embedWidth | 200 | 360 | 600 |
| Clock | embedHeight | 200 | 360 | 600 |

Default values are omitted from the URL to keep it short. The embed pages extract these values and pass them to `EmbedScaleWrapper`.

**Notion cache-busting tip:** append a unique query param to force refresh:
```
https://your-domain.com/embed/calendar?c=...&ts=123456789
```

### Deployment

- Push to `main` or `Version-1` triggers Vercel deploy
- Build command: `tsc && npx vite build`
- Output: `dist/`
- `vercel.json` handles SPA rewrites
- **Production domain:** `https://1calendar-widget-aliias-projects-37358320.vercel.app`

### Notion Embed — Vercel Gotcha

**Problem:** Vercel protects non-production deployments (preview/branch URLs) with authentication. This returns `401 + X-Frame-Options: DENY`, which blocks iframe embedding. Notion and its backend service (Iframely) cache this rejection, so even after disabling protection, the embed stays broken for that domain.

**Solution:** Embed URLs always use the production domain via `VITE_EMBED_BASE_URL` (set in `.env.production`), not `window.location.origin`. This ensures embeds work regardless of which deployment the studio is accessed from.

**If embeds break in Notion:**
1. Check that `VITE_EMBED_BASE_URL` in `.env.production` matches the current production domain
2. Open the embed URL directly in a browser — if it shows a Vercel login page, Deployment Protection is on
3. In Vercel: Settings → Deployment Protection → disable "Vercel Authentication" (or set to production only)
4. If Notion still shows "Click to view content", it may be caching — wait or append `&_=<random>` to bust Notion's cache

---

## Adaptive Design Spec

All widgets use shared design tokens from `src/presentation/themes/widgetTokens.ts`.

### Breakpoints

| Name | Width | Target |
|------|-------|--------|
| xs | 375px | iPhone SE, narrow embeds |
| sm | 480px | Mobile |
| md | 640px | Tablets |
| lg | 1024px | Desktop |

### Container Tokens

```
min-width:  200px
max-width:  min(420px, 95vw)    — calendar
            min(360px, 95vw)    — clock
padding:    clamp(12px, 4vw, 24px)
```

### Typography Tokens

```
Heading:    clamp(14px, 4vw, 22px)
Body:       clamp(12px, 2.8vw, 16px)
Small:      clamp(10px, 2.2vw, 14px)
```

### Spacing Tokens

```
gap:    clamp(2px, 1vw, 8px)
margin: clamp(8px, 2vw, 16px)
```

### Per-Widget Implementation

| Widget | Approach |
|--------|----------|
| Modern Grid | Token imports, `clamp()` for typography and spacing |
| Modern Weekly | `width: 100%` + max-width from tokens, CSS grid, `clamp()` throughout |
| Modern Clock | `clamp()` for font-size and padding, adaptive DateDisplay |
| Analog Classic | `--clock-size: clamp(120px, 35vw, 200px)`, hands scale via `calc(var(--clock-size) / 160px)` |

---

## Changelog

### Console-Clean Bugfix Sweep

Fixed all issues that produced browser console warnings/errors:

- **#5** — Completed unterminated CSS selector in `CalendarEmbedPage.tsx` GlobalEmbedStyles
- **#6** — Removed stale `style: 'detailed'` default from `CompactUrlCodec`; style is now always encoded (differs per widget type)
- **#4** — Added `vite.svg` favicon to `public/` (was 404ing)
- **#14** — Fixed analog clock 59→0 snap-back: second hand now tracks cumulative rotation, always rotating forward
- **#16/#46** — Replaced `Math.random().toString(36).substr(2,9)` with `crypto.randomUUID()` in `WidgetFactoryImpl`
- **#36** — Removed redundant `window.addEventListener('resize')` from `EmbedScaleWrapper`; ResizeObserver handles all resize events
- **#37** — Fixed duplicate React keys in `ModernGrid.tsx` (weekday headers `S`,`T` duplicated) and `ModernWeeklyCalendar.tsx`; now using positional index for static headers and `toISOString()`/day-number keys for day cells
- **#39** — Confirmed clipboard errors already logged via Logger in `StudioPage.tsx`

### Embed Size Controls & Dynamic Scaling

Added user-configurable embed dimensions so widgets scale properly in Notion iframes of any size:

- **New settings:** `embedWidth`/`embedHeight` on both `CalendarSettings` and `ClockSettings`
- **Studio UI:** Width/Height sliders in "Embed Size" section of `CustomizationPanel`
- **EmbedScaleWrapper:** Now accepts `refWidth`/`refHeight` props, scales **up to 2.0x** (previously capped at 1.0). Widgets fill large iframes instead of floating small
- **URL encoding:** New fields encoded as `ew`/`eh` in compact URL; defaults omitted for short URLs
- **Dev logging:** Logger calls in EmbedScaleWrapper (scale math), embed pages (parsed settings), CustomizationPanel (slider changes)
- **Smoke test:** `src/test/embed-size-smoke.test.ts` (13 tests) — exercises full pipeline from settings through URL encoding to scale calculation, with `[SMOKE]` tagged terminal output. Run via `npm run test:smoke`
- **Tests:** 5 suites, 46 tests total (up from 4 suites, 29 tests)

Files modified: `CalendarSettings.ts`, `ClockSettings.ts`, `CompactUrlCodec.ts`, `EmbedScaleWrapper.tsx`, `CalendarEmbedPage.tsx`, `ClockEmbedPage.tsx`, `CustomizationPanel.tsx` + corresponding test files.

### Fix Notion Embed URL

Embed URLs were using `window.location.origin`, which captured preview/branch deployment domains. Vercel blocks these with authentication (`401 + X-Frame-Options: DENY`), and Notion/Iframely caches the rejection. Fixed by using `VITE_EMBED_BASE_URL` env var (production domain) instead. See `.env.production`.

### Dev Pipeline — Linting, Testing, Logging, Error Handling

Added complete development infrastructure:
- **ESLint:** `.eslintrc.cjs` with `@typescript-eslint`, `react-hooks`, `react-refresh` plugins
- **Vitest:** 5 test suites (46 tests) — CalendarSettings, ClockSettings, Widget, CompactUrlCodec, embed-size-smoke
- **Logger:** `src/infrastructure/services/Logger.ts` — dev-only, formatted, color-coded; replaced all 11 `console.error`/`console.log` calls across 7 files
- **Error Boundary:** `src/presentation/components/ErrorBoundary.tsx` wrapping `App.tsx` (outside ThemeProvider)
- **Global error handlers:** `window.onerror` + `window.onunhandledrejection` in `main.tsx`
- **npm scripts:** `test`, `test:watch`, `test:coverage`, `typecheck`, `check` (full pipeline)

Resolves issues #1, #2, #3. Partially resolves #15 (logging replacement done, user-facing feedback still TODO).

### Project Simplification

Removed Weather, Test Widget, Digital Minimal (clock), World Time (clock), Compact Date (calendar), and Aesthetic (calendar). Kept only:
- **Calendar:** Modern Grid, Modern Weekly
- **Clock:** Modern Digital, Analog Classic

Removed routes: `/embed/weather`, `/embed/test`, `/test`.

### Widget Tokens & Adaptivity

Created `widgetTokens.ts` with shared responsive tokens (containers, typography, spacing). All four widgets refactored to use `clamp()` values and token-based sizing. Widgets now render correctly from 200px to 1920px+.

### EmbedScaleWrapper

New component for iframe scaling. Uses ResizeObserver to calculate and apply CSS transform scale so widgets don't get cut off in Notion embeds.

### Copy Embed URL Button

Redesigned with larger padding (`16px 24px`), `min-height: 44px`, increased icon size, `white-space: nowrap`.

### Vercel Build Fix

Changed build command from `vite build` to `npx vite build` to resolve `vite: command not found` on Vercel.

---

## Issues & Roadmap

> Audit date: 2026-02-07 | Branch: `Version-1` | 49 issues identified

### Critical Issues

| # | Issue | Location | Details |
|---|-------|----------|---------|
| 1 | ~~**No ESLint config**~~ | Root | **RESOLVED** — `.eslintrc.cjs` created with TS + React hooks + react-refresh |
| 2 | ~~**No tests or test framework**~~ | Entire project | **RESOLVED** — Vitest 1.6 + 4 test suites (29 tests) |
| 3 | ~~**No React Error Boundary**~~ | Missing globally | **RESOLVED** — `ErrorBoundary.tsx` wraps App, fallback card + reload |
| 4 | ~~**Missing static assets**~~ | `public/` | **RESOLVED** — Added `vite.svg` favicon to `public/` |
| 5 | ~~**Incomplete CSS rule**~~ | `CalendarEmbedPage.tsx:45-46` | **RESOLVED** — Completed the unterminated CSS selector with `max-width: 100%; box-sizing: border-box` |
| 6 | ~~**Default settings mismatch**~~ | `WidgetFactoryImpl.ts` vs `CompactUrlCodec.ts` | **RESOLVED** — Removed stale `style: 'detailed'` default from codec; style is always encoded since it differs per widget type |
| 7 | **Color palette case-sensitivity** | `CompactUrlCodec.ts:64-87` | `indexOf` exact match — lowercase hex won't match uppercase palette |
| 8 | **String decoding ambiguity** | `CompactUrlCodec.ts:188-194` | Single-letter codes resolve via fragile `.includes()` heuristics |

### High Priority Issues

| # | Issue | Location | Details |
|---|-------|----------|---------|
| 9 | **Excessive `any` types** | `Widget.ts`, `WidgetRepository.ts`, `ManageWidget.ts` | Settings typed as `any` throughout domain layer |
| 10 | **Weak `Widget.isValid()`** | `Widget.ts:31-33` | Only checks truthiness, not type/shape validity |
| 11 | **No settings validation** | `CalendarSettings.ts:11-20`, `ClockSettings.ts:13-24` | Accepts any values — no format/range/enum checks |
| 12 | **Calendar grid bug** | `ModernGrid.tsx:300-317` | `showWeekends=false` hardcodes 30-day loop, actual weekday count varies |
| 13 | **Weekday header mismatch** | `ModernWeeklyCalendar.tsx:171, 268-298` | `[Tue,Wed,...Mon]` order doesn't match grid |
| 14 | ~~**Analog clock transition bug**~~ | `AnalogClassicClock.tsx:153-172` | **RESOLVED** — Cumulative rotation tracking; second hand always rotates forward past 360° |
| 15 | ~~**Silent error handling**~~ | `StudioPage.tsx`, `CompactUrlCodec.ts`, `WidgetRepositoryImpl.ts` | **PARTIALLY RESOLVED** — All `console.error` replaced with `Logger`; user feedback still TODO |
| 16 | ~~**Weak ID generation**~~ | `WidgetFactoryImpl.ts:59-61` | **RESOLVED** — Replaced with `crypto.randomUUID()` |
| 17 | **DI bypass in embed pages** | `CalendarEmbedPage.tsx:103`, `ClockEmbedPage.tsx:66` | Direct `new UrlCodecService()` instead of DIContainer |
| 18 | **Boolean coercion bug** | `CalendarSettings.ts:15`, `ClockSettings.ts:18` | String `"false"` from URL is truthy, treated as `true` |
| 19 | **No `fromEmbedData` validation** | `Widget.ts:44-46` | Constructs Widget without checking fields exist |
| 20 | **Base64 padding edge case** | `CompactUrlCodec.ts:139` | Invalid base64 length silently corrupts data |

### Medium Priority Issues

#### Accessibility

| # | Issue | Location |
|---|-------|----------|
| 21 | **Missing ARIA on navigation** | `ModernGrid.tsx:336-357` — no `aria-label` on prev/next buttons |
| 22 | **Missing ARIA on sidebar** | `Sidebar.tsx:285-288` — no `aria-expanded`/`aria-controls` |
| 23 | **Missing ARIA on copy button** | `Header.tsx:205-215` — state not announced to screen readers |
| 24 | **Focus indicators removed** | `Sidebar.tsx:119-121` — `outline: none` with no replacement |
| 25 | **No keyboard navigation** | `ModernGrid.tsx`, `Sidebar.tsx` — not keyboard-accessible |
| 26 | **Dates not semantically accessible** | `ModernGrid.tsx:374-388` — missing role/aria on disabled days |

#### Responsiveness & Styling

| # | Issue | Location |
|---|-------|----------|
| 27 | **Fixed panel width** | `CustomizationPanel.tsx:14` — `width: 320px` breaks on mobile |
| 28 | **Hardcoded pixels** | `CustomizationPanel.tsx:16-210` — should use theme tokens |
| 29 | **Hardcoded colors in embeds** | `CalendarEmbedPage.tsx:62-92`, `ClockEmbedPage.tsx:23-57` |
| 30 | **Hardcoded colors in weekly calendar** | `ModernWeeklyCalendar.tsx:13-165` |
| 31 | **Hardcoded colors in clocks** | `ModernClock.tsx:53-79`, `AnalogClassicClock.tsx:72-122` |
| 32 | **Magic numbers in StudioPage** | `StudioPage.tsx:26-52` — hardcoded header height assumptions |
| 33 | **Inconsistent spacing** | `CustomizationPanel.tsx` — mix of px and theme tokens |

#### Performance

| # | Issue | Location |
|---|-------|----------|
| 34 | **Missing `React.memo`** | `ModernGrid.tsx`, `ModernWeeklyCalendar.tsx`, `ClockWidget.tsx` |
| 35 | **Clock interval drift** | `ClockWidget.tsx:17-22` — not synced to second boundaries |
| 36 | ~~**Redundant resize listener**~~ | `EmbedScaleWrapper.tsx` | **RESOLVED** — Removed `window.addEventListener('resize')`, ResizeObserver handles it |
| 37 | ~~**Array index as React key**~~ | `ModernGrid.tsx`, `ModernWeeklyCalendar.tsx` | **RESOLVED** — Weekday headers use positional index (static), day cells use `toISOString()` or `d-{day}` keys |
| 38 | **Missing `useCallback`** | `ModernGrid.tsx:319-325` — handlers recreated every render |
| 39 | ~~**Clipboard error swallowed**~~ | `StudioPage.tsx:134` | **RESOLVED** — Already logged via `Logger.error` in StudioPage |

#### Architecture & Code Quality

| # | Issue | Location |
|---|-------|----------|
| 40 | **Window global in infrastructure** | `WidgetRepositoryImpl.ts`, `UrlCodecService.ts`, `CompactUrlCodec.ts` |
| 41 | **Static method bypasses DI** | `WidgetFactoryImpl.ts:63-72` |
| 42 | **Unused `EmbedController`** | `EmbedController.tsx` — empty passthrough component |
| 43 | **Type casts without guards** | `CustomizationPanel.tsx:244-387` |
| 44 | **Inconsistent error patterns** | `ManageWidget.ts:25-28` |
| 45 | **Mixed-language comments** | `ModernWeeklyCalendar.tsx`, `vite.config.ts` |
| 46 | ~~**Deprecated `.substr()`**~~ | `WidgetFactoryImpl.ts:60` | **RESOLVED** via #16 — `crypto.randomUUID()` |

#### Localization

| # | Issue | Location |
|---|-------|----------|
| 47 | **Hardcoded English month/day names** | `ModernGrid.tsx:274-280` |
| 48 | **Hardcoded `'en-US'` locale** | `ModernClock.tsx:141`, `AnalogClassicClock.tsx:175`, `ModernWeeklyCalendar.tsx:212` |
| 49 | **Sunday-first week assumed** | `ModernGrid.tsx:293-298` |

### Roadmap

#### Phase 1 — Stability & Correctness

> **Highest priority** — bugs that affect every embedded widget

- [x] Fix incomplete CSS rule in `CalendarEmbedPage.tsx` GlobalEmbedStyles (#5)
- [x] Align default settings between `WidgetFactoryImpl` and `CompactUrlCodec` (#6)
- [ ] Fix color palette case bug — normalize to uppercase before lookup (#7)
- [ ] Fix string decoding — explicit field→value map instead of heuristics (#8)
- [ ] Fix calendar grid for `showWeekends=false` — dynamic weekday count (#12)
- [ ] Fix weekday header alignment in `ModernWeeklyCalendar` (#13)
- [x] Fix analog clock 59→0 transition (#14)
- [ ] Fix boolean coercion — parse `'true'`/`'false'` strings explicitly (#18)
- [x] Add missing favicon to `/public` (#4)
- [x] Replace `Math.random().substr()` with `crypto.randomUUID()` (#16)

#### Phase 2 — Type Safety & Validation

> **High priority** — prevent future bugs at the type level

- [ ] Replace `any` with `CalendarSettings | ClockSettings` generics (#9)
- [ ] Add validation to settings constructors — color format, range, enums (#11)
- [ ] Strengthen `Widget.isValid()` — validate type and settings shape (#10)
- [ ] Add runtime validation at URL decode boundary (#19, #20)
- [ ] Replace type casts with type guards in `CustomizationPanel` (#43)
- [ ] Enforce DI consistently — embed pages use `DIContainer` (#17)

#### Phase 3 — Developer Experience

> **High priority** — catch regressions, enable refactoring

- [x] Add ESLint configuration (#1) — `.eslintrc.cjs` with TS + React hooks
- [x] Set up Vitest — tests for codec roundtrip, settings validation, widget entity (#2) — 4 suites, 29 tests
- [x] Add React Error Boundary for `App.tsx` (#3) — `ErrorBoundary.tsx` + global handlers in `main.tsx`
- [x] Replace `console.error` with Logger utility (#15) — dev-only, formatted, color-coded
- [ ] Add user-visible error feedback — toast/snackbar for user-facing errors (#15 remaining)
- [ ] Remove dead code — `EmbedController`, unused imports (#42)

#### Phase 4 — Accessibility & UX

> **Medium priority** — WCAG basics

- [ ] Add ARIA labels: nav buttons, sidebar toggles, copy button (#21-23, #26)
- [ ] Restore focus indicators with `:focus-visible` (#24)
- [ ] Add keyboard navigation for calendar grid (#25)
- [ ] Make CustomizationPanel responsive — `clamp()` or `max-width` (#27)
- [ ] Move hardcoded colors to theme (#29-31)
- [ ] Replace magic numbers with theme values (#32)

#### Phase 5 — Performance

> **Medium priority** — smoother embed experience

- [ ] `React.memo` on widget components (#34)
- [ ] `useCallback` on navigation handlers (#38)
- [ ] Sync clock to second boundary (#35)
- [x] Remove redundant resize listener from `EmbedScaleWrapper` (#36)
- [x] Use stable date-based keys for calendar days (#37)

#### Phase 6 — Internationalization

> **Lower priority** — non-English markets

- [ ] Use `Intl.DateTimeFormat` with browser locale for month/day names (#47)
- [ ] Replace hardcoded `'en-US'` with configurable locale (#48)
- [ ] Support Monday-first weeks based on locale (#49)
- [ ] Standardize code comments to English (#45)

#### Phase 7 — Polish

> **Lowest priority** — final quality pass

- [ ] Loading skeletons for widget preview
- [ ] Document compact URL encoding algorithm
- [ ] Clean up `_redirects` Netlify artifact
- [ ] Audit dependency versions
- [x] Replace deprecated `.substr()` (#46) — resolved via #16 (`crypto.randomUUID()`)

