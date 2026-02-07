# CLAUDE.md — Project Knowledge Base

## Project Overview

**1calendar-widget** is a client-side widget studio for creating embeddable Calendar and Clock widgets, primarily targeting Notion embeds. There is no backend — all widget configuration is encoded in the URL. Built with an Apple-inspired design language.

**Repo:** `https://github.com/ziyazova/1calendar-widget.git`
**Branch:** `Version-1` (active development), `main` (stable)
**Deployed on:** Vercel (SPA with vite framework)

## Tech Stack

- **React 18.2** + **TypeScript 5.0** + **Vite 4.4**
- **Styled Components 6.1** (CSS-in-JS, uses `$transientProp` convention)
- **React Router DOM 6.15** (SPA routing)
- **Lucide React** (icons)
- **Vitest 1.6** + **@testing-library/react 14** + **jsdom 24** (testing)
- **ESLint 8** with `@typescript-eslint` + `react-hooks` + `react-refresh` plugins
- No state management library — local React state + URL-based state for embeds

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev server on port 5173
npm run build        # tsc && vite build → dist/
npm run preview      # Preview build on port 3000
npm run lint         # ESLint (warnings only, no errors)
npm run test         # Vitest single run (CI)
npm run test:watch   # Vitest watch mode (dev)
npm run test:coverage # Vitest with coverage
npm run typecheck    # tsc --noEmit
npm run check        # Full pipeline: lint + typecheck + test
npm run test:smoke   # Smoke test for embed size feature (terminal-visible logs)
```

## Architecture — Clean Architecture (3 Layers)

```
src/
├── domain/              # Pure business logic, no framework deps
│   ├── entities/        # Widget.ts (+ Widget.test.ts)
│   ├── value-objects/   # CalendarSettings.ts, ClockSettings.ts (+ tests)
│   ├── repositories/    # Interfaces: WidgetRepository, WidgetFactory
│   └── use-cases/       # CreateWidget, UpdateWidget, GetEmbedUrl, LoadFromUrl, ListWidgets
├── infrastructure/      # Implementation details
│   ├── di/              # DIContainer.ts (singleton, initializes all services)
│   ├── repositories/    # WidgetFactoryImpl, WidgetRepositoryImpl (in-memory Map)
│   └── services/        # Logger.ts, url-codec/ (UrlCodecService, CompactUrlCodec + test)
├── presentation/        # React UI
│   ├── pages/           # LandingPage, StudioPage, CalendarEmbedPage, ClockEmbedPage
│   ├── components/
│   │   ├── layout/      # Header, WidgetDisplay
│   │   ├── embed/       # EmbedScaleWrapper (ResizeObserver-based scaling)
│   │   ├── ui/          # Sidebar, CustomizationPanel, ColorPicker
│   │   ├── widgets/     # CalendarWidget, ClockWidget + style variants
│   │   └── ErrorBoundary.tsx  # React Error Boundary (wraps App)
│   └── themes/          # theme.ts, colors.ts, widgetTokens.ts
└── test/                # setup.ts, embed-size-smoke.test.ts (smoke tests)
```

### Key Patterns
- **Singleton:** DIContainer, Logger
- **Factory:** WidgetFactory for widget creation
- **Repository:** Interface-based data access (WidgetRepository)
- **Value Object:** Settings are immutable, return new instances on update
- **Use Case:** Each business operation is its own class
- **Error Boundary:** `ErrorBoundary.tsx` wraps the entire app (outside ThemeProvider)

## Routes

| Route | Component | Purpose |
|---|---|---|
| `/` | LandingPage | Marketing/hero page |
| `/studio` | StudioPage | Widget editor with live preview + customization |
| `/embed/calendar` | CalendarEmbedPage | Embeddable calendar (Notion iframe) |
| `/embed/clock` | ClockEmbedPage | Embeddable clock (Notion iframe) |
| `*` | LandingPage | Catch-all |

## Widgets

### Calendar
- **Modern Grid** (`modern-grid`) — 7-column month grid, navigation, today highlight
- **Modern Weekly** (`modern-weekly`) — Weekly/monthly toggle, gradient background

### Clock
- **Modern Digital** (`modern`) — Digital time, 12h/24h, seconds toggle, date
- **Analog Classic** (`analog-classic`) — Circular face, hour marks, animated hands

### Widget Settings
- Shared: `primaryColor`, `backgroundColor`, `accentColor`, `borderRadius`, `showBorder`, `embedWidth`, `embedHeight`
- Calendar-specific: `style`, `defaultView` (month/week/day), `showWeekends`
- Clock-specific: `style`, `showSeconds`, `format24h`, `showDate`, `fontSize`

### Embed Size Boundaries

| Widget Type | Property | Min | Default | Max |
|-------------|----------|-----|---------|-----|
| Calendar | embedWidth | 200 | 420 | 800 |
| Calendar | embedHeight | 200 | 380 | 600 |
| Clock | embedWidth | 200 | 360 | 600 |
| Clock | embedHeight | 200 | 360 | 600 |

## Embed System

- Widgets are embedded as iframes; all config lives in the URL query string
- **Compact URL encoding** (`?c=<encoded>`) via `CompactUrlCodec.ts` — field shorthand, color palette indexing, default omission → 60-70% smaller URLs
- **Legacy format** (`?config=<base64>`) still supported for decoding
- `EmbedScaleWrapper.tsx`: accepts `refWidth`/`refHeight` props (from `embedWidth`/`embedHeight` settings), scales via CSS transform using ResizeObserver. Scale range: **0.25–2.0** (scales both down and up)
- Embed pages (`CalendarEmbedPage`, `ClockEmbedPage`) extract `embedWidth`/`embedHeight` from parsed settings and pass to `EmbedScaleWrapper`
- Studio `CustomizationPanel` has Width/Height sliders in "Embed Size" section
- URL encoding: `embedWidth` → `ew`, `embedHeight` → `eh` (omitted when equal to defaults)
- `index.html` includes a script for iframe auto-height via `postMessage`/`ResizeObserver`

### Embed URL Base Domain

**Critical:** Embed URLs must use the **production domain**, not `window.location.origin`.

- Controlled by `VITE_EMBED_BASE_URL` env var (set in `.env.production`)
- Current production domain: `https://1calendar-widget-aliias-projects-37358320.vercel.app`
- Falls back to `window.location.origin` if env var is not set (for local dev)
- Code: `WidgetRepositoryImpl.saveToUrl()` reads `import.meta.env.VITE_EMBED_BASE_URL`

**Why this matters — Vercel + Notion iframe issue:**
Vercel protects non-production deployments (preview, branch) with authentication by default. This returns `401 + X-Frame-Options: DENY`, which completely blocks iframe embedding. Notion/Iframely caches this rejection server-side, so even after turning off Vercel protection, the embed stays broken for that domain. Using the stable production domain avoids this entirely.

**If the production domain changes:** update `VITE_EMBED_BASE_URL` in `.env.production` and redeploy.

## Styling System

- **Theme** (`theme.ts`): Apple-inspired tokens — 8px spacing grid, SF Pro font, cubic-bezier transitions, z-index layers, shadow presets
- **Widget Tokens** (`widgetTokens.ts`): Responsive clamp() values for container sizing, typography, spacing — ensures widgets adapt from 200px to full width
- **Colors** (`colors.ts`): Named widget colors (Ocean, Purple, etc.), background presets, gradient backgrounds, `getContrastColor()` for accessibility
- **Convention:** Styled-components with `$transientProps` to avoid DOM warnings

## Testing

- **Framework:** Vitest 1.6 with jsdom environment, globals enabled
- **Config:** `vite.config.ts` → `test` block; setup file at `src/test/setup.ts`
- **Test files:** Co-located with source as `*.test.ts` / `*.test.tsx`
- **5 test suites (46 tests):**
  - `CalendarSettings.test.ts` — defaults, overrides (incl. embedWidth/embedHeight), immutability, JSON roundtrip
  - `ClockSettings.test.ts` — defaults, overrides (incl. embedWidth/embedHeight), immutability, JSON roundtrip
  - `Widget.test.ts` — factory methods, updateSettings, isValid, serialization
  - `CompactUrlCodec.test.ts` — encode/decode roundtrip, embed size encoding, invalid input, palette colors, URL generation
  - `embed-size-smoke.test.ts` — end-to-end smoke test: settings → URL encode → decode → scale math (13 tests with `[SMOKE]` console output)
- **Run:** `npm run test` (single run) or `npm run test:watch` (dev)

### Smoke Tests (Terminal-Visible Dev Logs)

For features that run in the browser (React components, embed scaling), use **smoke tests** to verify logic from the terminal without needing a browser:

```bash
npm run test:smoke   # Runs src/test/embed-size-smoke.test.ts
```

Smoke tests print `[SMOKE]` tagged output to stdout, covering:
- Settings defaults and JSON roundtrip
- URL encode/decode with embed size params
- Scale calculation for 6 iframe size scenarios (tiny → huge)

**Convention:** New smoke tests go in `src/test/<feature>-smoke.test.ts`. Use `console.log` with `[SMOKE]` prefix for terminal-visible output. These run inside Vitest's jsdom environment so `import.meta.env.DEV` is true and Logger works.

## Logging & Error Handling

- **Logger** (`src/infrastructure/services/Logger.ts`):
  - Dev-only output — guarded by `import.meta.env.DEV` (dead-code eliminated in prod)
  - API: `Logger.error('Module', 'message', ...data)` — also `.debug`, `.info`, `.warn`
  - Formatted: `[HH:mm:ss.sss] [LEVEL] [Module] message` with color-coded console output
  - Replaces all raw `console.error`/`console.log` calls across the codebase
  - **Active log points** (visible in browser DevTools console during dev):
    - `[EmbedScaleWrapper]` — ref size on render, scale calculation details (container size, scaleX/Y, final scale)
    - `[CalendarEmbed]` — URL config parsing, loaded settings (embedWidth/embedHeight/style), render size
    - `[ClockEmbed]` — same as CalendarEmbed
    - `[CustomizationPanel]` — embed width/height slider changes

- **Error Boundary** (`src/presentation/components/ErrorBoundary.tsx`):
  - Wraps entire app in `App.tsx` (outside ThemeProvider so it works even if theme breaks)
  - Catches React render errors, logs via Logger, shows fallback card with Reload button
  - Uses hardcoded inline styles (not theme-dependent)

- **Global Handlers** (`src/main.tsx`):
  - `window.onerror` + `window.onunhandledrejection` → `Logger.error('Global', ...)`
  - Fire before React mounts, catching module-level errors

## Important Conventions

- **Path alias:** `@/*` → `./src/*` (configured in tsconfig + vite)
- **No backend/API** — all state is client-side or URL-encoded
- **Responsive design:** Always use `clamp()` and widgetTokens for sizing; never hardcode pixel values in widgets
- **Immutability:** Settings objects create new instances via spread, never mutate
- **Logging:** Use `Logger.error('Module', 'msg')` instead of `console.error` — silent in prod
- **Embed URLs:** Always use `VITE_EMBED_BASE_URL` for embed link generation, never hardcode `window.location.origin` — preview/branch deployments are blocked by Notion
- **Widget addition guide:** See `docs/DEVELOPMENT.md` for step-by-step instructions

## File References

- Entry: `src/main.tsx` → `src/App.tsx`
- DI setup: `src/infrastructure/di/DIContainer.ts`
- URL encoding: `src/infrastructure/services/url-codec/CompactUrlCodec.ts`
- Embed scaling: `src/presentation/components/embed/EmbedScaleWrapper.tsx`
- Design tokens: `src/presentation/themes/widgetTokens.ts`
- Logger: `src/infrastructure/services/Logger.ts`
- Error Boundary: `src/presentation/components/ErrorBoundary.tsx`
- ESLint config: `.eslintrc.cjs`
- Test setup: `src/test/setup.ts`
- Smoke test: `src/test/embed-size-smoke.test.ts`
- Embed base URL: `.env.production` → `VITE_EMBED_BASE_URL`

## Documentation

- `README.md` — Overview (Russian)
- `docs/PROJECT-DOCS.md` — Dev guide, adaptive design spec, changelog, issues & roadmap
