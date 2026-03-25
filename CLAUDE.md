# CLAUDE.md — Project Knowledge Base

## Project Overview

**Peachy Studio** (repo: `1calendar-widget`) is a client-side widget studio for creating embeddable Calendar and Clock widgets, primarily targeting Notion embeds. There is no backend — all widget configuration is encoded in the URL. Built with an Apple-inspired design language using Inter font.

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
- **CSS Zoom Fixed** (`modern-grid-zoom-fixed`) — Primary calendar style, CSS zoom scaling, full customization
- **Classic Calendar** (`classic`) — Colored header bar with primary color, simple chevron nav, clean body. Accent Color not used (hidden in panel). Duplicated from CSS Zoom Fixed with distinct header style
- **Modern Grid** (`modern-grid`) — 7-column month grid, navigation, today highlight (archive)
- **Modern Weekly** (`modern-weekly`) — Weekly/monthly toggle, gradient background (archive)

### Clock
- **Modern Digital** (`modern`) — Digital time, 12h/24h, seconds toggle, date
- **Analog Classic** (`analog-classic`) — Circular face, hour marks, animated hands

### Widget Settings
- Shared: `primaryColor`, `backgroundColor`, `accentColor`, `borderRadius`, `showBorder`, `embedWidth`, `embedHeight`, `theme`
- Calendar-specific: `style`, `defaultView` (month/week/day), `showWeekends`, `showDayBorders`
- Clock-specific: `style`, `showSeconds`, `format24h`, `showDate`, `fontSize`

### Customization Panel

One adaptive `CustomizationPanel.tsx` component serves all widget types. Sections are shown/hidden based on `widget.type` and `settings.style`:

- **Appearance** (all): Theme selector (Auto/Light/Dark)
- **Colors** (all): Primary Color, Background. Accent Color hidden for Classic Calendar (`style === 'classic'`)
- **Layout** (all): Border Radius slider, Show Border toggle. Show Day Borders toggle for calendars only
- **Clock** (clock only): Font Size, Show Seconds, 24h Format, Show Date

### Embed Size Boundaries

| Widget Type | Property | Min | Default | Max |
|-------------|----------|-----|---------|-----|
| Calendar | embedWidth | 200 | 420 | 800 |
| Calendar | embedHeight | 200 | 380 | 600 |
| Clock | embedWidth | 200 | 360 | 600 |
| Clock | embedHeight | 200 | 360 | 600 |

## Dark Mode / Theme Support

- **Setting:** `theme: 'auto' | 'light' | 'dark'` on both CalendarSettings and ClockSettings (default: `auto`)
- **Auto mode:** Detects via `prefers-color-scheme` media query — works with Notion's "Use system setting"
- **Explicit mode:** User sets Light/Dark in studio → encoded in embed URL as `tm` parameter
- **For Notion explicit Dark mode:** User must set theme to "Dark" in studio (Notion's app-level dark mode doesn't change `prefers-color-scheme`)
- **Hook:** `useResolvedTheme(theme)` in `src/presentation/hooks/useResolvedTheme.ts` — resolves auto via media query, listens for changes
- **Color adaptation:** `adaptColorForDarkMode(color, type)` maps light colors to Notion-matching dark equivalents:
  - Backgrounds: `#FFFFFF` → `#191919` (Notion's exact dark bg), `#F7F7F5` → `#1E1E1C`, etc.
  - Accents: `#E8EDFF` → `#1E2340`, `#EEE8FA` → `#261E35`, etc.
- **Embed pages:** Dynamically set `html, body` background to match widget's effective background — no white rectangle in Notion dark mode

## Embed System

- Widgets are embedded as iframes; all config lives in the URL query string
- **Compact URL encoding** (`?c=<encoded>`) via `CompactUrlCodec.ts` — field shorthand, color palette indexing, default omission → 60-70% smaller URLs
- **Legacy format** (`?config=<base64>`) still supported for decoding
- `EmbedScaleWrapper.tsx`: accepts `refWidth`/`refHeight` props (from `embedWidth`/`embedHeight` settings), scales via CSS transform using ResizeObserver. Scale range: **0.25–2.0** (scales both down and up)
- Embed pages (`CalendarEmbedPage`, `ClockEmbedPage`) extract `embedWidth`/`embedHeight` from parsed settings and pass to `EmbedScaleWrapper`
- URL encoding: `embedWidth` → `ew`, `embedHeight` → `eh`, `theme` → `tm` (omitted when equal to defaults)
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
- **Colors** (`colors.ts`): Unified premium palette — Primary (#6E7FF2, #7C63B8, #E89A78), Background (#FFFFFF, #F7F7F5, #EEF1F5), Accent (#E8EDFF, #EEE8FA, #FBE9E1). 3 presets per category. `getContrastColor()` for accessibility
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
- Theme hook: `src/presentation/hooks/useResolvedTheme.ts`
- Classic Calendar: `src/presentation/components/widgets/calendar/styles/ClassicCalendar.tsx`

## Supabase Backend

**Project:** `https://vyycfwgkawtqkjllvsuc.supabase.co`
**Ref:** `vyycfwgkawtqkjllvsuc`

### Environment Variables

```env
# .env.local (gitignored, never commit!)
VITE_SUPABASE_URL=https://vyycfwgkawtqkjllvsuc.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-jwt-key>
# .env.production
VITE_EMBED_BASE_URL=https://1calendar-widget-aliias-projects-37358320.vercel.app
```

### Authentication System

**Client:** `src/infrastructure/services/supabase.ts` — Supabase client singleton
**Context:** `src/presentation/context/AuthContext.tsx` — React context wrapping Supabase Auth + guest mode

#### Three Auth Modes

| Mode | Entry Point | Storage | Features |
|------|-------------|---------|----------|
| `null` (anonymous) | Browse site | None | Cart, checkout, view templates |
| `guest` | Code `PEACHY2026` on `/widgets` | `localStorage` flag | Studio access, create widgets, copy embed URL. **No save, no account.** |
| `registered` | Email/password or Google on `/login` | Supabase Auth (JWT session) | Full Studio + My Widgets (saved to DB) + Purchases + Profile |

#### Auth Providers (Supabase)

| Provider | Status | Config Location |
|----------|--------|----------------|
| Email/Password | **Working** | Supabase Dashboard → Auth → Providers → Email |
| Google OAuth | **Needs setup** | See `docs/SUPABASE.md` for Google Cloud Console steps |
| Access Code | **Working** | Client-side only, code: `PEACHY2026`, no Supabase involved |

#### Auth Flow

```
                         ┌─ /login ──► auth.register(name, email, pw) ──► supabase.auth.signUp()
                         │             auth.login(email, pw) ──► supabase.auth.signInWithPassword()
                         │             auth.loginWithGoogle() ──► supabase.auth.signInWithOAuth()
User ──► Peachy Site ────┤                                         │
                         │                                         ▼
                         │                              onAuthStateChange ──► mode='registered'
                         │                                         │
                         │                                         ▼
                         │                              /studio (full: widgets + account sidebar)
                         │
                         └─ /widgets ──► auth.loginWithCode('PEACHY2026')
                                                │
                                                ▼
                                     localStorage flag ──► mode='guest'
                                                │
                                                ▼
                                     /studio (widgets only, no account sidebar)
```

#### Key Auth Context Methods

- `auth.register(name, email, password)` → `Promise<string | null>` (null = success, string = error)
- `auth.login(email, password)` → `Promise<string | null>`
- `auth.loginWithGoogle()` → `Promise<void>` (redirects to Google)
- `auth.loginWithCode(code)` → `boolean` (synchronous, client-side only)
- `auth.logout()` → `Promise<void>` (clears Supabase session + guest flag)
- `auth.isRegistered` / `auth.isGuest` / `auth.isLoggedIn` — state booleans
- `auth.user` → `{ name, email, avatarUrl }` or null
- `auth.loading` → true during initial session check

### Database

**Service:** `src/infrastructure/services/WidgetStorageService.ts`

#### Table: `widgets`

```sql
create table public.widgets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null default 'Untitled Widget',
  type text not null,        -- 'calendar', 'clock', 'board'
  style text not null,       -- 'modern-grid-zoom-fixed', 'classic', 'analog-classic', etc
  settings jsonb not null default '{}',
  embed_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

**RLS:** Enabled. Users can only CRUD their own rows (`auth.uid() = user_id`).
**Migration:** `supabase/migrations/001_widgets.sql`

#### WidgetStorageService API

- `getUserWidgets()` → `Promise<SavedWidget[]>` — fetch all user's widgets
- `saveWidget({ name, type, style, settings, embed_url })` → `Promise<SavedWidget | null>`
- `updateWidget(id, { name?, settings?, embed_url? })` → `Promise<boolean>`
- `deleteWidget(id)` → `Promise<boolean>`

### E-commerce System

**Cart:** `src/presentation/context/CartContext.tsx` — React context, client-side (no backend)
**Template data:** `src/presentation/data/templates.ts` — 12 templates with prices, descriptions, features

#### Pages

| Route | Page | Purpose |
|-------|------|---------|
| `/templates` | TemplatesPage | Template catalog with category filters |
| `/templates/:id` | TemplateDetailPage | Product page: carousel, buy, FAQ, related |
| `/checkout` | CheckoutPage | Cart summary, promo code, payment form |
| `/login` | LoginPage | Email/password + Google sign in/up |

#### Cart Flow

```
/templates/:id → "Buy Now" → cart badge +1 → cart dropdown → "Checkout"
→ /checkout → contact + payment form → "Pay $X.XX"
```

### Dashboard (inside Studio)

When `mode='registered'`, the Studio sidebar shows an **Account** section below widgets:

| Sidebar Item | View in Artboard | Description |
|-------------|-----------------|-------------|
| My Widgets | Grid of saved widgets | Filter by category, Edit/Delete overlay, Add New |
| Templates | Redirects to `/templates` | Opens template shop |
| Purchases | Purchase history list | Order ID, date, Download/Receipt buttons |
| Profile (avatar) | Settings view | Name, email, logout. Avatar popup at sidebar bottom |

**Components:** `src/presentation/components/dashboard/DashboardViews.tsx`
**Sidebar integration:** `src/presentation/components/ui/sidebar/Sidebar.tsx` — `DashboardView` type, `onDashboardViewChange` callback

### TopNav Behavior by Auth Mode

| Element | Anonymous | Guest | Registered |
|---------|-----------|-------|------------|
| "Log in" button | Shows → `/login` | Hidden | Hidden |
| "Studio" button | Hidden | Shows → `/studio` | Shows → `/studio` |
| Widget Studio link | → `/widgets` | → `/studio` | → `/studio` |
| Cart icon | Yes | Yes | Yes |
| Sidebar Account | — | Hidden | Visible |
| Profile avatar | — | Hidden | Visible |

## File References (Updated)

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
- Theme hook: `src/presentation/hooks/useResolvedTheme.ts`
- Classic Calendar: `src/presentation/components/widgets/calendar/styles/ClassicCalendar.tsx`
- **Supabase client:** `src/infrastructure/services/supabase.ts`
- **Auth context:** `src/presentation/context/AuthContext.tsx`
- **Cart context:** `src/presentation/context/CartContext.tsx`
- **Widget storage:** `src/infrastructure/services/WidgetStorageService.ts`
- **Dashboard views:** `src/presentation/components/dashboard/DashboardViews.tsx`
- **Template data:** `src/presentation/data/templates.ts`
- **Login page:** `src/presentation/pages/LoginPage.tsx`
- **Checkout page:** `src/presentation/pages/CheckoutPage.tsx`
- **Template detail:** `src/presentation/pages/TemplateDetailPage.tsx`
- **Supabase env:** `.env.local` (gitignored)
- **DB migration:** `supabase/migrations/001_widgets.sql`

## Documentation

- `README.md` — Overview (Russian)
- `docs/PROJECT-DOCS.md` — Dev guide, adaptive design spec, changelog, issues & roadmap
- `docs/SUPABASE.md` — Supabase setup, Google OAuth instructions, troubleshooting
