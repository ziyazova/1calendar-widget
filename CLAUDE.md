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

- Widgets are embedded as iframes; configuration travels in the URL query string
- **Compact URL encoding** (`?c=<encoded>`) via `CompactUrlCodec.ts` — field shorthand, color palette indexing, default omission → 60-70% smaller URLs
- **Legacy format** (`?config=<base64>`) still supported for decoding
- `EmbedScaleWrapper.tsx`: accepts `refWidth`/`refHeight` props (from `embedWidth`/`embedHeight` settings), scales via CSS transform using ResizeObserver. Scale range: **0.25–2.0** (scales both down and up)
- Embed pages (`CalendarEmbedPage`, `ClockEmbedPage`, `BoardEmbedPage`) extract `embedWidth`/`embedHeight` from parsed settings and pass to `EmbedScaleWrapper`
- URL encoding: `embedWidth` → `ew`, `embedHeight` → `eh`, `theme` → `tm` (omitted when equal to defaults)
- `index.html` includes a script for iframe auto-height via `postMessage`/`ResizeObserver`

### Live-sync (`?c=...&i=<public_id>`)

For widgets saved by registered users, the URL also carries an 8-char `public_id` so embeds reflect owner edits and deletions in real time — without breaking already-pasted links.

- **Render**: embed pages render from `?c=<settings>` immediately (instant first paint, works offline)
- **Sync**: in parallel, if `&i=<public_id>` is present, `usePublicWidgetSync` calls the `get_public_widget(p_id)` Supabase RPC and swaps in fresh settings on success
- **Delete / pause**: RPC returns empty when the widget is hard-deleted or `is_active=false` → embed renders the `WidgetUnavailable` placeholder (Lottie kitten + brand domain from `BRAND_DOMAIN`)
- **Network failure**: error from RPC keeps the URL fallback rendering — Supabase outage degrades to "frozen settings", not a broken iframe
- **Legacy URLs**: any URL without `&i=` skips the RPC and uses the URL settings directly — every widget already pasted in a customer's Notion before this shipped keeps working unchanged
- **Guest-mode widgets** (no Supabase row) never get a `public_id` — their URLs stay `?c=...` only

Files: `src/infrastructure/services/PublicWidgetService.ts`, `src/presentation/hooks/usePublicWidgetSync.ts`, `src/presentation/components/embed/WidgetUnavailable.tsx`. The placeholder's hostname strapline reads `BRAND_DOMAIN` (derived from `VITE_EMBED_BASE_URL` in `src/config/brand.ts`), so renaming the live host only requires editing one Vercel env var.

### Embed URL Base Domain

**Critical:** Embed URLs must use the **production domain**, not `window.location.origin`.

- Controlled by `VITE_EMBED_BASE_URL` env var (set in `.env.production`)
- Current production domain: `https://1calendar-widget-aliias-projects-37358320.vercel.app`
- Falls back to `window.location.origin` if env var is not set (for local dev)
- Code: `WidgetRepositoryImpl.saveToUrl()` reads `import.meta.env.VITE_EMBED_BASE_URL`

**Why this matters — Vercel + Notion iframe issue:**
Vercel protects non-production deployments (preview, branch) with authentication by default. This returns `401 + X-Frame-Options: DENY`, which completely blocks iframe embedding. Notion/Iframely caches this rejection server-side, so even after turning off Vercel protection, the embed stays broken for that domain. Using the stable production domain avoids this entirely.

**If the production domain changes:** update `VITE_EMBED_BASE_URL` in `.env.production` and redeploy.

## Vendor abstraction rule (Supabase, Polar)

Decision (Apr 18, 2026): **stay on Supabase + Polar for the foreseeable
future.** Full port/adapter abstraction (see `docs/ROADMAP.md` →
"Vendor-portable architecture") is **deferred** — we'll build it only if a
real migration is on the table. In the meantime, one cheap rule keeps
future-us's options open:

**New Supabase or Polar calls must live in `src/infrastructure/services/`,
not directly in pages, contexts, or hooks.**

- Pages / contexts / hooks consume these services; they never `import { supabase }`
  or Polar SDK themselves.
- Existing direct imports (`AuthContext`, `LoginPage`, `ResetPasswordPage`)
  are grandfathered tech debt. Migrate them **opportunistically when
  touching those files**, not as a separate refactor.
- The three existing services already follow this pattern:
  `SubscriptionService`, `AccountService`, `WidgetStorageService`. Add new
  siblings rather than one-off SDK calls.

PR review grep: `import { supabase }` under `src/presentation/` = flag.

## Styling System

- **Theme** (`theme.ts`): Apple-inspired tokens — 8px spacing grid, Inter font, cubic-bezier transitions, z-index layers, shadow presets. **Brand accent is `#6366F1` (indigo)**, not iOS blue. Includes: `colors.brand.*` (indigo/indigoLight/indigoDark/blue/blueLight), `colors.gradients.*` (indigo/blue/softBanner/templateCard/avatar), `colors.accentShadow/blueShadow/successShadow` (colored shadow presets), extended `text.*` (primary/inverse/body/subtle/hint/dim/muted), `background.*` (elevated/surfaceAlt/surfaceMuted/surfaceCool), full `typography.sizes.2xs..8xl`, `shadows.card/cardHover/tab/floating/modal/sheet`.
- **Widget Tokens** (`widgetTokens.ts`): Responsive clamp() values for container sizing, typography, spacing — ensures widgets adapt from 200px to full width.
- **Colors** (`colors.ts`): Widget-customization palette (user picks these in Studio) — Primary (#6E7FF2, #7C63B8, #E89A78), Background (#FFFFFF, #F7F7F5, #EEF1F5), Accent (#E8EDFF, #EEE8FA, #FBE9E1). Separate from the app's UI theme (which lives in `theme.ts`).
- **Convention:** Styled-components with `$transientProps` to avoid DOM warnings. **Never hardcode hex/shadows/spacing in page files** — use theme tokens.

### Shared Components Library (`src/presentation/components/shared/`)

Single source of truth for every CTA, surface, overlay, and upsell pattern. Import from `@/presentation/components/shared`.

| Component | Purpose | Key Props |
|---|---|---|
| `Button` | Every CTA site-wide | `$variant`: primary/accent/blue/secondary/outline/ghost/danger/success/link · `$size`: xs/sm/md/lg/xl · `$fullWidth`, `$pill`, `$iconOnly` |
| `Card` (+`CardHeader/Title/Subtitle/Section`) | Unified surfaces | `$variant`: flat/outlined/elevated/subtle/interactive · `$padding`, `$radius` |
| `Modal` (+`ModalFooter`) | Overlay dialogs | `open`, `onClose`, `title`, `size` (sm/md/lg/xl), `hideClose`, `lockOutside`. Handles ESC, scroll-lock, click-outside |
| `Accordion` (+`AccordionGroup`) | Collapsible settings sections | `title`, `defaultOpen` or controlled `open`/`onToggle`, `right`, `variant` |
| `PlanRing` | Circular usage indicator | `percent`, `size` (sm/md/lg/xl), `color`, `track` |
| `GradientBanner` (+`BannerIcon/Body/Title/Text/Actions`) | Soft upsell/info strips | `$tone`: indigo/blue/soft/sage · `$emphasis`: subtle/strong · `$inline` |
| `PlanUpgradeBar` | Sidebar plan+upgrade row | `mode`: free/pro/guest, `used`, `limit`, callbacks |
| `BottomSheet` | Mobile-anchored drawer | `open`, `onClose`, `title`, `capitalizeTitle`, `maxHeight`. Separate from `Modal` — drag-handle affordance, no focus lock, bottom-anchored |
| `Badges` (existing) | Tier/state pills | `ProPill`, `NewPill`, `FreePill`, `PopularPill`, `PlanPill`, `PlanBadge` |
| `PrimaryButton` / `SecondaryButton` | Legacy aliases | Kept for back-compat; prefer `<Button $variant>` |

**Policy:** when adding a surface/CTA/overlay, use a shared component. If a new variant is needed, add it to the shared component via a new `$variant` value — don't create a parallel local styled component.

### Design-system rules (SIMPLIFICATION_PLAN.md)

The ongoing "one source of truth" refactor (see `SIMPLIFICATION_PLAN.md` at repo root) codifies how new code should look. Apply these to every PR that touches UI:

1. **Colors** — only `theme.colors.*`. No raw `#hex` in styled-components or inline `style={{}}`. `theme.colors.danger.{soft,strong,bg,border}` is the canonical destructive palette (`soft` = reversible, `strong` = irreversible like Delete account / Log out).
2. **Buttons** — every CTA / inline action uses shared `<Button $variant $size>`. Variants: `primary` / `accent` / `blue` / `secondary` / `outline` / `ghost` / `danger` / `dangerStrong` / `success` / `link`. Don't invent `dangerStronger` etc; extend only if truly missing.
3. **Overlays** — centered dialogs use shared `<Modal>`. Mobile bottom-anchored drawers use shared `<BottomSheet>`. Don't roll a local overlay+backdrop pair.
4. **Card surfaces** — use shared `<Card $variant>` (`flat` / `outlined` / `elevated` / `subtle` / `interactive`) where feasible.
5. **Pills / plan indicators** — use `Badges.tsx` exports (`ProPill`, `PlanPill $pro`, etc). Never re-declare.
6. **Widget internals are frozen** — `src/presentation/components/widgets/**` is user-customizable content and must NOT be touched by DS migrations. Widget *preview scale wrappers* in pages are chrome and follow the DS.
7. **Pages compose from shared** — `pages/**` should compose from `components/shared` and not stylize directly. Local `styled.*` in pages is allowed only for genuinely unique patterns (plan §1 rule 3), and even then **all colors / radii / shadows must come from theme tokens** — no raw hex.
8. **Run `npm run audit:design`** — grep-based drift report (raw hex count + styled declarations per page). Advisory, not a hard gate. Watch the trend, not zero — some locally-unique patterns are correct.

### Migration

Ongoing effort to remove hardcoded colors/shadows/spacing from page files and adopt shared components. See **`MIGRATION_GUIDE.md`** at repo root for:
- Token mapping cheatsheet (old hex → new token)
- Per-page migration steps (LoginPage → TemplatesPage → TemplateDetailPage → DesignSystemPage → StudioPage → LandingPage)
- Commit convention + red flags

⚠️ After pulling a migration PR, ensure `src/presentation/components/shared/index.ts` exports the new components:
```ts
export { Card, CardHeader, CardTitle, CardSubtitle, CardSection } from './Card';
export { Modal, ModalFooter } from './Modal';
export { Accordion, AccordionGroup } from './Accordion';
export { PlanRing } from './PlanRing';
export { GradientBanner, BannerIcon, BannerBody, BannerTitle, BannerText, BannerActions } from './GradientBanner';
export { PlanUpgradeBar } from './PlanUpgradeBar';
```

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
  public_id text not null unique,  -- 8-char base62, generated in WidgetStorageService.saveWidget
  is_active boolean not null default true,  -- soft-delete flag (current UI hard-deletes)
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

**RLS:** Enabled, tier-aware (see "Tier Enforcement" below). Users can SELECT/UPDATE/DELETE their own rows; INSERT is gated on count + style.
**Migrations:** `001_widgets.sql` (table), `007_public_widgets.sql` (public_id + is_active + RPC), `008_restore_widgets_policies.sql` (recovery), `009_restore_tier_enforcement.sql` (tier policies).

#### WidgetStorageService API

- `getUserWidgets()` → `Promise<SavedWidget[]>` — fetch all user's widgets (returns `public_id` and `is_active`)
- `saveWidget({ name, type, style, settings, embed_url })` → `Promise<SavedWidget | null>` — generates `public_id` client-side (`crypto.getRandomValues` → 8 base62 chars), retries up to 5x on the unique-constraint collision
- `updateWidget(id, { name?, settings?, embed_url? })` → `Promise<boolean>`
- `deleteWidget(id)` → `Promise<boolean>` — currently a hard delete (the `is_active` column exists for a future "pause widget" flow; both produce the same embed-side outcome via the `get_public_widget` RPC)
- Throws `WidgetTierError` when an INSERT/UPDATE is rejected by the tier RLS policy (free user over the 3-widget cap, or attempting a Pro-only style)

#### RPC: `get_public_widget(p_id text)`

Public read for embed pages — `security definer`, granted to `anon` so unauthenticated Notion iframe loads work.

Returns `(type, style, settings)` for a widget where `public_id = p_id AND is_active = true`. Empty result is the embed page's signal to render `WidgetUnavailable`.

### Tier Enforcement (RLS)

Migration `009_restore_tier_enforcement.sql` defines two helpers:

- `public.user_is_pro(uid uuid) → boolean`: combines an **owner email allowlist** (currently just `ziyazovaa@gmail.com` — operator stays unmetered while Polar sync is in flight) with `profiles.is_pro` (mirrored from Polar by the `polar-webhook` Edge Function). Wraps the `profiles` lookup in `exception when undefined_table` so the function still works on partially-migrated DBs (returns false / "free" instead of erroring).
- `public.is_pro_style(style text) → boolean`: returns true for Pro-gated widget styles (current list: `'typewriter'`, `'flower'`). To change the gate, `CREATE OR REPLACE` this function in a new migration — no frontend deploy needed.

The `widgets.INSERT` policy allows the row when:
- `auth.uid() = user_id` AND
- (`user_is_pro` is true) OR (caller has fewer than 3 active widgets AND `is_pro_style(style)` is false)

The `widgets.UPDATE` policy mirrors the style check on the new row, so a free user can't change an existing widget's style to a Pro one.

**Adding an operator / dev to the allowlist:** edit `user_is_pro` in a new migration, replacing the `('ziyazovaa@gmail.com')` tuple with the expanded list, then `npx supabase db push`.

### Database Migrations Workflow

Migrations live in `supabase/migrations/NNN_<name>.sql` and apply to the live DB **only via the Supabase CLI** (installed as a project devDep — use `npx supabase ...`):

```bash
npx supabase migration new <name>     # scaffold a new file
# edit supabase/migrations/<NNN>_<name>.sql
npx supabase db push                  # apply all pending migrations transactionally
npx supabase migration list           # show local vs remote status
```

**Don't paste SQL into the Supabase Dashboard SQL Editor.** SQL Editor pastes don't update the `supabase_migrations` tracking table, drift the file repo from real DB state, and — most painfully — when a multi-statement paste fails halfway, Postgres leaves DDL committed up to the failure point with no rollback. May 2026's "studio can't save widgets" outage was caused by this exact pattern (migration 007's policy DROP committed before its CREATE failed on a missing `user_is_pro`).

If a migration was applied via SQL Editor before this rule existed, mark it tracked with `npx supabase migration repair --status applied <NNN>`.

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
- **Public widget RPC client:** `src/infrastructure/services/PublicWidgetService.ts`
- **Live-sync hook:** `src/presentation/hooks/usePublicWidgetSync.ts`
- **Unavailable placeholder:** `src/presentation/components/embed/WidgetUnavailable.tsx` (+ `src/presentation/assets/cat-unavailable.lottie`)
- **Brand domain config:** `src/config/brand.ts`
- **Auth context:** `src/presentation/context/AuthContext.tsx`
- **Cart context:** `src/presentation/context/CartContext.tsx`
- **Widget storage:** `src/infrastructure/services/WidgetStorageService.ts`
- **Dashboard views:** `src/presentation/components/dashboard/DashboardViews.tsx`
- **Template data:** `src/presentation/data/templates.ts`
- **Login page:** `src/presentation/pages/LoginPage.tsx`
- **Checkout page:** `src/presentation/pages/CheckoutPage.tsx`
- **Template detail:** `src/presentation/pages/TemplateDetailPage.tsx`
- **Supabase env:** `.env.local` (gitignored)
- **DB migrations:** `supabase/migrations/` — apply via `npx supabase db push`, never via SQL Editor (see "Database Migrations Workflow")

## Documentation

- `README.md` — Overview (Russian)
- `docs/PROJECT-DOCS.md` — Dev guide, adaptive design spec, changelog, issues & roadmap
- `docs/SUPABASE.md` — Supabase setup, Google OAuth instructions, troubleshooting
