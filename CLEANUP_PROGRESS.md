# 📊 Cleanup Progress — Handoff Log

> Companion to `CLEANUP_ROADMAP.md`. Records exactly what's done, what's left, and the rules the owner has enforced so far. Written for the next agent picking up the work.

**Repo:** `https://github.com/ziyazova/1calendar-widget`
**Working branch:** `design-experiment` (never push to `main`)
**Updated:** 2026-04-21 (after Phase 3.2 / 3.5 / 3.6 / 3.8 — paused before 3.9 StudioPage per roadmap guardrail)

---

## 🚦 Phase status vs roadmap

| Phase | Roadmap branch | Status | Merge commit on `design-experiment` |
|---|---|---|---|
| **0. Foundation** | n/a | ✅ done | `8f4a069` |
| **1. Typography cleanup** | `typography-cleanup` | ✅ merged | `3d03e11` |
| **2. Radii + Brand color** | `radii-colors-cleanup` | ✅ merged | `4113d4b` |
| **2.5 Safe spacing snaps** | `spacing-safe-cleanup` | ✅ merged | `ca38cb5` |
| **3.1 LoginPage** | `migrate-login` (inline) | ✅ merged | `9e8162c` |
| **3.2 Verify + Reset** (no SignupPage — signup lives inside LoginPage) | `migrate-auth-pages` | ✅ merged | `70327ee` + dedupe `382f465` |
| **3.3 TemplatesPage** | `migrate-templates` | ✅ merged | `5fab668` |
| **3.4 TemplateDetailPage** | `migrate-template-detail` | ✅ merged | `77b802a` + fix `a3c548e` |
| **3.5 SettingsPage** | `migrate-settings` + `migrate-settings-structural` + `migrate-settings-modals` | 🟡 partial — colors + all 3 modals (delete / password / email) on shared `<Modal>`; local `Button` + Section → Accordion still TBD | `ca81005` + `734b57d` + `69639df` |
| **3.6 CheckoutPage** | `migrate-checkout` | ✅ merged | `a22b7ca` |
| **3.7 DesignSystemPage** | `migrate-design-system` | ⏸ **deferred** by owner — not touching `/dev` for now | — |
| **3.8 LandingPage** | `migrate-landing` | ✅ merged | `e68c5e5` |
| **3.9 StudioPage + WidgetStudioPage** | `migrate-studio` | ⏸ **PAUSED — roadmap requires design review before touching live editor** | — |
| **4. Final polish** | — | ⏳ after all pages | — |

`origin/design-experiment` HEAD is `69639df` as of this report. Seven pages migrated (Login, Verify, Reset, Templates, TemplateDetail, Settings-colors+all-3-modals, Checkout, Landing). Only `/dev` (deferred) and `/studio` + `/widgets` (paused) remain, plus the structural Settings leftovers listed below.

---

## 🧩 Commit-by-commit log

All commits live on `origin/design-experiment`. Each was first pushed on its own branch, then fast-forward-merged.

### Foundation + design-system base install
- **`8f4a069`** `chore(ds): install unified design-system base + migration docs`
  - Pulled in the Peachy Studio design-system bundle: expanded `theme.ts` (brand/gradients/shadows/extra typography sizes/extended spacing), extended `Button.tsx` (9 variants × 5 sizes × `$fullWidth`/`$pill`/`$iconOnly`, legacy `PrimaryButton`/`SecondaryButton` preserved), new shared components: `Card`, `Modal`, `Accordion`, `PlanRing`, `GradientBanner`, `PlanUpgradeBar`.
  - Added `MIGRATION_GUIDE.md`, `AUDIT.md`.
  - Fixed pre-existing `@ts-expect-error` lint errors in `supabase/functions/polar-webhook/index.ts`.
  - Kept `theme.radii.button` as back-compat alias of `radii.md` so legacy call-sites don't break during page migrations.

### Page migrations (pre-roadmap — done before owner pointed me at CLEANUP_ROADMAP)
- **`9e8162c`** `refactor(ds): migrate LoginPage to unified tokens + shared components` — 5 local buttons → shared `<Button>`, `SignedInCard` → `<Card $variant="elevated">`, 130-line forgot-password modal → shared `<Modal>` + `<Button>`. Added `ErrorDisclosure` + `FaqAnswerText` page-locals on token-only basis.
- **`5fab668`** `refactor(ds): migrate TemplatesPage to unified tokens` — renamed local `Card` styled.div to `TemplateCardWrap` to free the shared name. Migrated hexes (`#3384F4` → `theme.colors.brand.blue`, `#22C55E` → `theme.colors.success`, etc.) and hard-coded font sizes/weights to tokens.
- **`77b802a`** `refactor(ds): migrate TemplateDetailPage to unified tokens + shared components` — `ActionBtn` → `<Button>`, `AddedBtn` rebased on `<Button $variant="success">`, `SidebarCard` → `<Card $variant="outlined">`, inline FAQ → shared `<Accordion>` with controlled single-open behavior, `#DC2626` inline → `ErrorDisclosure` using `destructiveText` token.
- **`a3c548e`** `fix(ds): restore FAQ answer typography on TemplateDetailPage` — wrapping answer in a styled `FaqAnswerText` (shared Accordion renders raw children, so the plain string was inheriting body default).

### Mechanical consolidation passes (on-roadmap)
- **`3d03e11`** `refactor(ds): snap typography to 9-step scale`
  - 168 total line changes across 50 files.
  - Font-size (15 consolidations): 15→14, 10→11, 36→40, 17→16, 12.5→12, 26→28, 32→28, 24→22, 20→18, 42→40, 11.5→12, 68→56, 54→56, 38→40, 19→16. HeroSectionV2-allowed: 15.5→14 and 14.5→14.
  - Letter-spacing (9): 0.04/0.08/0.1/0.05→0.06, -0.035/-0.04→-0.03, 0.03→0.02, -0.015/-0.012→-0.01.
  - Line-height (10): 1.55/1.45/1.4→1.5, 1.72/1.6/1.7→1.65, 1.05→1, 1.12/1.15/1.16→1.2.
  - **Skip list verified byte-identical** in `HeroSectionV2.tsx` lines 408, 415, 427, 435, 491, 511, 577, 590, 605, 619 (intentional sub-scale mini-widget previews).

- **`4113d4b`** `refactor(ds): snap border-radius to 6-step scale + unify brand indigo`
  - 118 total line changes across 30 files.
  - Border-radius (8 consolidations): 10→12, 14→16, 9→8, 18→16, 3→4, 2.5→4, 11→12, 13→12. Handles styled (`border-radius: Xpx`), inline string (`borderRadius: 'Xpx'`), inline number (`borderRadius: N,` / `N }`).
  - Brand color: all `#6E7FF2` → `#6366F1` (10 occurrences incl. `BADGE_ACCENT` in `Badges.tsx` and the `ColorSwatch` palette entry in DesignSystemPage).

- **`ca38cb5`** `refactor(ds): snap safe single-value spacing (3/7/13/18/22 → grid)`
  - 13 lines across 12 files.
  - Only single-value `padding` / `margin` / `gap` (and per-side variants). Compound values like `padding: 18px 20px` and all files under `components/widgets/**` are intentionally untouched.
  - Values: 3→4, 7→8, 13→12, 18→16, 22→24.

### Settings structural (Phase 3.5 continued)
- **`ca81005`** `refactor(settings): migrate SettingsPage hex colors to theme tokens` — 21 raw hexes in styled-components swapped to `theme.colors.*` (kept per-context to avoid breaking variant-switch plain-string returns).
- **`734b57d`** `refactor(settings): swap delete-account modal to shared <Modal>` — replaced the local `Overlay`/`Backdrop`/`Modal`/`ModalTitle`/`ModalActions` wrappers with `<Modal open onClose title="Delete account?" size="sm">` + `<ModalFooter>`. Confirm is `<Button $variant="danger" $size="lg">`, cancel is `<Button $variant="secondary" $size="lg">`. Kept `ModalText`/`ModalInputWrap`/`ModalInput`/`ErrorText` as page-locals (form-state-specific shells).
- **`69639df`** `refactor(settings): swap password + email modals to shared <Modal>` — same pattern applied to the other two modals. Password modal toggles title between `Change password`/`Set a password`/`Password updated` based on state; email modal cycles title across three steps (`verify`/`new`/`sent`). `hideClose={submitting}` replaces the old Backdrop onClick guard. 44px action buttons now use `<Button $size="lg">`; success-state "Done" uses `$fullWidth`. Dropped `Overlay`/`Backdrop`/local `Modal`/`ModalTitle`/`ModalActions` from the file entirely.

**Still TBD for Phase 3.5** (not yet scheduled — await owner go-ahead):
- Local `Button` (5 variants: `primary`/`ghost`/`danger`/`dangerSolid`/`upgrade`, ~23 usages inside settings sections). Shared `Button $size="sm"` is 32/14/12-radius while the local is 32/12/8-radius, and `dangerSolid` + `upgrade` don't have exact variant matches (closest: `accent` gradient for upgrade). Swapping needs a side-by-side screenshot pass and probably one new `$variant` added to shared `Button`.
- `Section` wrappers → `<Accordion>` / `<Card>` per `migrations/SETTINGS_MIGRATION.md`. Each of the 6 sections currently has a custom header (icon + title + subtitle) and is always-expanded; the cleanest swap is `<Card $variant="subtle" $padding="lg">` (keeps always-expanded semantics) rather than `<Accordion>`. Deferred because header composition needs per-section review.

### Infra / dev tooling commits (unrelated to cleanup but on `design-experiment`)
- `aa1498c` — original foundation dump (Polar billing, landing polish, initial dev feedback tool)
- `715cbf1`, `7c78311`, `cab5517` — `BranchSwitcher` dev panel + unified dev overlays + initial `TemplateDetailPage` pass (later redone as `77b802a`)

---

## 📁 Branches & PRs (on GitHub)

All pushed to `origin`. `design-experiment` is the integration branch; each phase branch is preserved for review/audit.

- `design-experiment` ← integration target
- `typography-cleanup` ← merged
- `radii-colors-cleanup` ← merged
- `spacing-safe-cleanup` ← merged
- `migrate-settings-structural` ← merged (delete-modal swap, `734b57d`)
- `migrate-settings-modals` ← merged (password + email modals, `69639df`)
- (pre-roadmap branches implied by commits above were merged inline, no standalone branches)

Main is stable at `aa1498c` (nothing from this cleanup campaign has been promoted to `main` yet — per roadmap guardrail).

---

## 🛑 Rules the owner has locked in (honor these)

1. **Never touch `components/widgets/**`.** Widget internals are out of scope. Spacing / radii / typography / color passes all skip this folder. The owner restated this twice.
2. **Don't push to `main`.** All work stays on `design-experiment` until the whole experiment is approved as one.
3. **`DesignSystemPage.tsx` is on hold.** Owner wants to redo it later as part of another design system — do not migrate it in Phase 3.7.
4. **Foundation files (`theme.ts`, shared components) already exist** — do not re-install them from the zip, they are committed.
5. **Shared labels come from `components/shared/Badges.tsx`** — `ProPill`, `NewPill`, `FreePill`, `LimitedPill`, `PopularPill`, `PlanPill`, `PlanBadge`. Never re-create local badge styled-components on pages.
6. **`StudioPage` + `WidgetStudioPage` are the final page migration** and require design review before the PR (they drive live user editor — riskiest).
7. **Skip-list in `HeroSectionV2.tsx`** for typography: lines 408, 415, 427, 435, 491, 511, 577, 590, 605, 619 are intentional sub-scale sizes inside a mini-widget preview mockup — must remain byte-identical.

---

## 🧭 What's next

Two tracks open, both waiting on owner input:

**Track A — Finish Phase 3.5 Settings (optional, medium risk):**
Pick any of the leftovers listed in the "Settings structural" section above. Recommended order: password modal → email modal (both are pure modal swaps like the delete one) → Section → Accordion conversion (bigger, needs `migrations/SETTINGS_MIGRATION.md` re-read) → local Button swap (pixel diff last).

**Track B — Phase 3.9 Studio (blocked):**
Owner needs to (1) ask design-claude for `STUDIO_MIGRATION.md` (the per-component spec for `StudioPage.tsx` + `WidgetStudioPage.tsx`, analogous to the other `migrations/*.md` files), (2) do visual QA of `/studio` and `/widgets` on preview, (3) confirm the widget-vs-chrome scope rule still stands (chrome follows DS, `components/widgets/**` stays frozen). Only then unpause.

After 3.9 lands → Phase 4 final polish: audit remaining raw shadows, bare grays (`#999`/`#333`/`#666` outside theme), and add an ESLint rule banning raw hex literals in `.tsx` outside `components/widgets/**` + `themes/`.

---

## ⚙️ Verification commands

Every phase passed these before merge:
```bash
npm run check    # lint + typecheck + test
npm run dev      # visual QA
```

Current status on `design-experiment`:
- ✅ `npm run lint` — 0 errors
- ✅ `npm run typecheck` — 0 errors
- ✅ `npm run test` — 46 tests pass

---

## 📄 Reference docs in repo

- `CLEANUP_ROADMAP.md` — master plan (what to do)
- `CLEANUP_PROGRESS.md` — **this file** (what's been done)
- `TYPOGRAPHY_CLEANUP_PLAN.md` — Phase 1 detailed spec
- `RADII_COLORS_CLEANUP_PLAN.md` — Phase 2 detailed spec
- `SPACING_CLEANUP_PLAN.md` — Phase 2.5 background (only "safe" section was applied; rest deferred)
- `MIGRATION_GUIDE.md` — Phase 3 per-page recipes
- `AUDIT.md` — inventory from the initial foundation scan
- `DESIGN_SYSTEM_CHANGELOG.md` — older pre-foundation cleanup notes (reference only)
