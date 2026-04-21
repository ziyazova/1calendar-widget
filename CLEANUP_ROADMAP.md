# 🗺️ Design System Cleanup — Master Roadmap

> Single source of truth for the Peachy Studio design system overhaul. **Execute phases in order. One PR per phase.**

---

## 📋 Where we are

- ✅ **Phase 0 — Foundation** (done, merged or in review)
  - `theme.ts` consolidated (no duplicate keys, new brand/gradients/shadows tokens)
  - Shared components: `Button`, `Card`, `Modal`, `Accordion`, `PlanRing`, `GradientBanner`, `PlanUpgradeBar`
  - `MIGRATION_GUIDE.md` with per-page migration steps
  - `CLAUDE.md` updated

---

## 🎯 Execution order (strict — do not reorder)

### Phase 1 — Typography cleanup 🔄 IN PROGRESS

**Plan:** `TYPOGRAPHY_CLEANUP_PLAN.md`

**Branch:** `typography-cleanup` off `design-experiment`

**Scope:** ~141 mechanical replacements
- Font-size: ~78 (snap to 9-step scale)
- Letter-spacing: 28 (consolidate to 6 values)
- Line-height: 35 (consolidate to 4 values)
- Font-weight: 0 changes

**Risk:** 🟢 Very low. All pure find/replace with known SKIP list (HeroSectionV2 mini-widgets).

**Commit:** `refactor(ds): snap typography to 9-step scale`

---

### Phase 2 — Radii + Brand Color ⏭ NEXT

**Do this ONLY after Phase 1 is merged to `design-experiment`.**

**Plan:** `RADII_COLORS_CLEANUP_PLAN.md`

**Branch:** `radii-colors-cleanup` off `design-experiment`

**Scope:** 102 replacements
- 92 border-radius → 6-step scale (`4 / 8 / 12 / 16 / 24 / 999`)
- 10 legacy brand `#6E7FF2` → `#6366F1` (or `theme.colors.brand.indigo`)

**Risk:** 🟢 Very low. All within 1-2px/shade of originals.

**Commit:** `refactor(ds): snap border-radius to 6-step scale + unify brand indigo`

---

### Phase 3 — Page migrations (starts AFTER Phases 1 & 2)

**Guide:** `MIGRATION_GUIDE.md`

**Do this strictly in order** — each page = its own branch + PR. Review before moving to next.

| Order | Page | Branch | Size | Why this order |
|---|---|---|---|---|
| **3.1** | `LoginPage.tsx` | `migrate-login` | S (~1-2h) | Smallest page. Prove the pattern first. |
| **3.2** | `ResetPasswordPage.tsx` + `SignupPage.tsx` + `VerifyEmailPage.tsx` | `migrate-auth-pages` | S (~2h) | Same auth cluster, same components. |
| **3.3** | `TemplatesPage.tsx` | `migrate-templates` | M (~3-4h) | Card grid — heavy Card usage, validates Card variants. |
| **3.4** | `TemplateDetailPage.tsx` | `migrate-template-detail` | M (~3h) | Uses same primitives as TemplatesPage. |
| **3.5** | `SettingsPage.tsx` | `migrate-settings` | M (~2-3h) | Accordion sections — validates Accordion. |
| **3.6** | `CheckoutPage.tsx` | `migrate-checkout` | S (~1-2h) | Small form, uses patterns from auth pages. |
| **3.7** | `DesignSystemPage.tsx` | `migrate-design-system` | S (~1h) | Just re-point local components to shared ones. |
| **3.8** | `LandingPage.tsx` + hero/CTA sections | `migrate-landing` | L (~3-4h) | Hero variants, many local styles. |
| **3.9** | `StudioPage.tsx` + `WidgetStudioPage.tsx` | `migrate-studio` | XL (~4-6h) | **MOST RISKY — do last** when you have the rhythm. |

**Inside each page migration PR, also do:**
- ✅ Replace local `styled.button`/`styled.div`/`styled.section` with shared components
- ✅ Replace local shadows with `theme.shadows.*` tokens
- ✅ Replace bare grays (`#999`, `#333`, `#666`, `#555`, `#444`) with `theme.colors.text.*`
- ✅ Fix remaining off-grid spacing per visual review (10px, 6px, 5px, 14px, 28px) — per context
- ✅ Update ESLint config's "grandfathered" list in `CLAUDE.md` as pages get migrated

**Risk per page:** 🟡 Medium. Visual regressions possible. **Always run dev server + visual QA** before PR.

**Commit template:** `refactor(X): migrate PageName to shared components`

---

### Phase 4 — Final polish (after all pages migrated)

Once pages are done, there's ~140 raw shadows and ~185 hex colors that might still linger in edge-case files. Last-pass audit:

1. Run `grep -rn "box-shadow:" src/presentation/ | grep -v theme` — should be near zero
2. Run `grep -rn "#[0-9A-Fa-f]\{6\}" src/presentation/` — audit what's left; whitelist or replace
3. Add ESLint rule to BAN raw hex/shadow in `.tsx` files (theme only)
4. Delete dead local style files

**Commit:** `refactor(ds): final polish + ESLint guardrails`

---

## 🧪 Per-phase testing requirement

Every phase MUST pass before merge:

```bash
npm run check   # lint + typecheck + test — must be green
npm run dev     # manual visual QA on affected pages
```

---

## 📁 Artifact reference

| File | Purpose |
|---|---|
| `CLEANUP_ROADMAP.md` | **This file — master order of operations** |
| `TYPOGRAPHY_CLEANUP_PLAN.md` | Phase 1 detailed replacements |
| `RADII_COLORS_CLEANUP_PLAN.md` | Phase 2 detailed replacements |
| `SPACING_CLEANUP_PLAN.md` | Background audit (spacing/shadows are deferred to Phase 3) |
| `MIGRATION_GUIDE.md` | Phase 3 per-page migration recipes |
| `TYPOGRAPHY_AUDIT_REPORT.md` | Raw audit data (reference only) |

## ⚠️ Guardrails

- **Never skip a phase.** Typography before radii. Radii before page migrations. Pages in the order above.
- **One phase = one PR = one clean commit.** No mixing.
- **Do not merge to `main`** — all PRs go to `design-experiment` until design experiment is approved as a whole.
- **Pause before Phase 3.9** (`StudioPage`). That one touches live user-facing editor. Get design review first.
