# Handoff — SIMPLIFICATION_PLAN execution

> Written for design-claude picking up where this session left off.
> Everything below is live on `origin/design-experiment`. Never push to `main`.

**Repo:** `https://github.com/ziyazova/1calendar-widget`
**Branch:** `design-experiment` (integration target for all DS work)
**Latest commit:** `a7da599` (at time of writing)
**Plan driving this work:** `SIMPLIFICATION_PLAN.md` at repo root — 7 steps, all landed.

---

## 0. Hard rules I followed (honor these)

1. **Never push to `main`.** Everything stays on `design-experiment`.
2. **Never touch `src/presentation/components/widgets/**`.** Widget internals are frozen user content. Widget *preview scale wrappers* inside pages ARE chrome and may be touched.
3. **`DesignSystemPage.tsx` is on hold** — owner will redo it as part of a separate DS. Do NOT migrate.
4. **Preserve visual.** Plan §0 principle: migration is infrastructure, not redesign. ≤2px pixel diff OK. Different color = NOT OK. Values move 1-to-1 from hex to token.
5. **Don't invent variants.** No `dangerStronger`, `dangerExtra`. Extend shared only when no existing variant + ≤2px shim covers the case.
6. **Mid-migration ideas park in `TODO_AFTER_MIGRATION.md`.** Don't drive-by-fix during migration PRs.

---

## 1. What landed, commit by commit

All merged to `origin/design-experiment`. Each step shipped as its own branch PR before merge.

### Step 1 — Theme foundation (`e093913`)
**Branch:** `theme-danger-tokens`
- Added `theme.colors.danger.{soft, strong, bg, border}` — values identical to existing `destructive*` keys; both sets coexist for back-compat. New call-sites should prefer `danger.*`.
- Created `TODO_AFTER_MIGRATION.md`.
- No visual change.

### Step 2 — DashboardViews migration (4 commits)
**Branches:** `migrate-dashboard` + follow-up direct commit.
- `2c1b5f3` — Added `$variant="dangerStrong"` to shared `Button` (saturated red `#DC2828` for irreversible actions). Also repointed existing `$variant="danger"` styles from `destructive*` tokens to new `danger.*` tokens (values unchanged).
- `ae5969e` — `ActionButton` (15 usages, 3 variants) → shared `<Button>`. All `$danger` usages became `dangerStrong` (Delete widget / Log out / Delete account / Delete forever are all irreversible per plan §2.1). `ViewAllBtn` (2) → `<Button $variant="link">`.
- `43ed87c` — Dropped 23 dead styled-components from an abandoned prior refactor (CardOverlay, Card, CardPreview, CardInfo, CardName, CardMeta, OverlayBtn, AddCard, AddLabel, PurchaseList, PurchaseRow, PurchaseThumb, PurchaseInfo, PurchaseName, PurchaseDate, PurchasePrice, ActionBtn, ProfileCard, Avatar, ProfileForm, Label, Input, SaveBtn, ExploreCard, ExplorePreview, ExploreLabel). File: 1801 → 1457 lines.
- `6aad704` — Styled-component hex literals → theme tokens (`text.primary`, `background.surfaceAlt/surfaceMuted`, `accent`, `gradients.avatar`, etc).

**Side note from Step 2:** Before the big work I also fixed a standalone bug — `<PlanPill>Free</PlanPill>` in DashboardView TopBar was hardcoded. Now destructures `isPro` from `useAuth()` and reacts properly (commit `67141d9` on `migrate-studio` branch, same file).

### Step 3 — Extract BottomSheet (`499cbe7`)
**Branch:** `extract-bottomsheet`
- New `src/presentation/components/shared/BottomSheet.tsx`.
- API: `<BottomSheet open onClose title capitalizeTitle maxHeight="70vh">{children}</BottomSheet>`.
- Kept separate from `<Modal>` per plan §2.2 (drag-handle affordance, bottom-anchored, no focus-lock).
- `StudioPage.tsx` mobile sheet pattern swapped in. Dropped 7 local styled-components. File shrank 70 lines.
- Exported from `components/shared/index.ts`.

### Step 4 — StudioPage hexes (`b0ce25d`)
**Branch:** `migrate-studio-final`
- Styled-component hex literals → theme tokens. Tab, TabBar, SectionTitle, WidgetCard internals, EmptyCircle (avatar gradient), PurchaseImg, mobile nav (MobileBackBtn, MobileCopyBtn with `$copied` state → `gradients.blue` / `success`), MobileArtboard fallback, MobileSectionTabs, DowngradeBanner (warning* tokens).
- Local buttons (`Tab`, `MobileBackBtn`, `MobileCopyBtn`, `MobileSectionTab`) kept local per plan §1 rule 3 — unique interaction patterns with tuned pixel specs.
- ~30 inline-`style={{}}` hexes still remain (Pro usage ring, upgrade tiles). Defer: they're in dense JSX that would need `useTheme()` threading per block.

### Step 5 — WidgetStudioPage hexes (`dc02068`)
**Branch:** `migrate-widget-studio`
- Cross-page `#FAFAFA` (9×) + `#1F1F1F` uses in styled-components → `surfaceAlt` / `text.primary` / `text.inverse`.
- Hero-mockup palette (`#2B2320` × 9, `#1F1814`, `#B5B1A9`, `#9B9790`, `#E07060`) kept as local hex — unique decorative vignette for the landing hero's static widget preview, not reused, polluting theme with "mockHeroDark" would violate §0.
- Google OAuth brand colors in `<svg>` kept as inline — brand data, not styling.
- HeroButton / GoogleButton / WidgetGalleryBtn / CustomizeBtn / PricingBtn kept local per §1.3 — tuned height/gradient/state combos that would bloat shared with one-off variants.

### Step 6 — Settings leftovers (`8fde5de`, partial — Section blocker logged)
**Branch:** `migrate-settings-final`
- Local `Button` (5 variants × 13 usages) swapped to shared `<Button $size="sm">`.
  - `primary` → `primary`
  - `upgrade` (indigo gradient) → `accent`
  - `danger` → `dangerStrong` (Log out + Delete account, both irreversible, `#DC2828` preserved)
  - default ghost → `secondary`
- Dropped ~65 lines of local variant switch. `dangerSolid` variant (declared but never used) dropped too.
- `47ea572` — `TODO_AFTER_MIGRATION.md` updated with the Section → Card blocker details.

### Step 7 — Guardrails (`a7da599`)
**Branch:** `guardrails`
- `scripts/design-audit.sh` — grep-based drift report. Counts raw hex outside `themes/` + `components/widgets/`, and `styled.*` declarations in `pages/` + `components/layout/`. Top-10-offender list per category.
- `npm run audit:design` wires it up.
- Today's baseline: **689 raw hex, 617 styled-in-pages.** Not zero — reflects intentional local-unique patterns (plan §1.3). Track the trend.
- `CLAUDE.md` gained a new "Design-system rules" section with 8 codified conventions.
- `CLAUDE.md` shared-components table gained the `BottomSheet` row.
- **No hard ESLint rule** — considered and rejected because existing legitimate local patterns would produce false warnings. Can add later when drift is demonstrably near-zero.

---

## 2. What's in shared now (deltas from before the session)

### `Button.tsx`
- New variant `dangerStrong` — saturated `#DC2828`, same border/bg as `danger` but stronger text. For irreversible actions.
- Existing `danger` variant repointed from `destructiveSoft/Border/Bg` to `danger.soft/border/bg`. No visual change (values identical).
- Full variant set now: `primary / accent / blue / secondary / outline / ghost / danger / dangerStrong / success / link`.

### `BottomSheet.tsx` (new)
- Mobile-first bottom-anchored drawer. See Step 3 above.

### `theme.ts`
- New `colors.danger` block.
- Legacy `destructive*` keys kept for back-compat. Callers should migrate to `danger.*` opportunistically.

---

## 3. What's deferred — logged in `TODO_AFTER_MIGRATION.md`

All of these are parking-lot items, explicit by plan §0.

- **`Section` → `Card $variant="subtle"` in Settings — BLOCKED.** Plan §2.4 prescribes `subtle`, but `SettingsPage` uses warm-cream page bg `#FBFAF7`. Shared `subtle` uses `surfaceAlt = #FAFAFA` which is visually identical to the page bg → cards would disappear. Needs owner/design call: either page bg → `#fff` (then subtle cards float on cream-tinted page), or adopt `elevated` (different shadow), or keep Section local with tokenized values (current state).
- **Settings page warm-cream bg (`#FBFAF7`) and peach avatar gradient (`#FFD4B8/#FFB3A0/#E8B4E3`) not in theme.** Unique to Settings — decide: promote to theme, or leave local per §1.3.
- **~60 inline `style={{}}` hexes across DashboardViews + StudioPage.** Can't use theme interpolation without threading `useTheme()` per block. These will evaporate naturally when the Section → Card conversion happens (the inline-styled rows get rebuilt as styled-component compositions with theme access).
- **Tablet adaptation** — deferred until all chrome is on shared.
- **Color / typography / radius redesign** — migration is infra only, redesign after.
- **Dark mode polish** — after.
- **`CustomizationPanel` refactor** — separate track.

---

## 4. How to verify anything I claim above

```bash
npm install                # baseline
npm run check              # 0 lint errors, 0 typecheck errors, 46 tests passing
npm run audit:design       # drift report — today's baseline 689 hex / 617 styled-in-pages
git log --oneline e093913^..a7da599  # the 11 commits this session landed
```

To see the raw hex trend over time, run `npm run audit:design` before and after any future PR — the top-10-offender list will shift as files are migrated.

---

## 5. Suggested next pickups (not assigned — owner decides)

In priority order:

1. **Resolve Section → Card blocker** — need owner call on Settings page bg.
2. **Inline-style hex cleanup in Settings modal bodies** — they're dense, the path is to extract the delete/password/email modal forms into their own `styled.*` blocks with theme access, then continue.
3. **DesignSystemPage `#hex` / `styled.*` — owner said hold off, but once owner greenlights the DS rebuild, that's the biggest single-file win (116 hex, 200 styled declarations).
4. **Promote `danger.*` tokens, retire `destructive*` aliases** — once all call-sites migrate, remove the back-compat keys from `theme.ts`.
5. **Stricter ESLint rule** — once drift is near-zero, add `no-restricted-imports` for `styled-components` in `pages/**` (allow-list `components/shared/**`, `components/widgets/**`, `themes/**`).

---

## 6. Reference files

- `SIMPLIFICATION_PLAN.md` — the plan I followed.
- `CLEANUP_PROGRESS.md` — previous session's handoff (still accurate for pre-session commits).
- `CLAUDE.md` — project root-level rules, now includes "Design-system rules" section.
- `TODO_AFTER_MIGRATION.md` — parking lot.
- `scripts/design-audit.sh` — drift checker. Run periodically.

---

## 7. Inventory of new shared components / variants added this session

If you're looking for "what's available now" in isolation:

```ts
import {
  Button,              // + new $variant="dangerStrong"
  BottomSheet,         // new
  // everything else unchanged
} from '@/presentation/components/shared';
```

```ts
import { theme } from '@/presentation/themes/theme';

theme.colors.danger.soft     // #F49B8B
theme.colors.danger.strong   // #DC2828
theme.colors.danger.bg       // rgba(220, 38, 38, 0.06)
theme.colors.danger.border   // rgba(220, 38, 38, 0.15)
```

That's it. Good luck.
