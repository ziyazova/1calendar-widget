# Spacing / Radii / Shadows / Colors Cleanup Plan

Next cleanup after typography. Same format: one branch, one commit, ~X mechanical replacements.

Branch: `spacing-cleanup` off `design-experiment` (merge AFTER typography-cleanup lands).

---

## 1. Border-Radius — target 6-step scale

| Token | Value | Use |
|---|---|---|
| `xs` | **4px** | Tiny chips, tags |
| `sm` | **8px** | Small buttons, inputs |
| `md` | **12px** | Cards, modals (most common) |
| `lg` | **16px** | Large cards, feature sections |
| `xl` | **24px** | Hero surfaces, big callouts |
| `full` | **999px** | Pills, avatars |
| `circle` | **50%** | Round avatars, dot badges |

### Current state

**41 unique radius values** in the codebase. Only ~7 are legitimate (on scale). Rest are off-scale drift.

### Radius replacements (92 total)

| From | To | Count | Reason |
|---|---|---|---|
| 10px / 10 | 12px | **55** 🏆 | Most common off-scale — should be `md` |
| 14px / 14 | 16px | 19 | Snap to `lg` |
| 18px / 18 | 16px | 4 | Snap down to `lg` |
| 9px / 9 | 8px | 5 | Snap to `sm` |
| 3px / 3 | 4px | 4 | Snap to `xs` |
| 2.5px | 4px | 3 | Snap to `xs` |
| 11px | 12px | 1 | Snap to `md` |
| 13px | 12px | 1 | Snap to `md` |
| **TOTAL** | | **92** | |

**Keep as-is:** `4px`, `6px`, `8px`, `12px`, `16px`, `20px`, `24px`, `50%`, `999px`, theme.radii.*

**Edge cases to review manually:**
- `20px 20px 0 0` (3x) — top-only rounding, legitimate, keep
- `52% 48% 50% 50% / 55% 48% 52% 45%` (1x) — blob shape in hero, keep
- `30%` (5x) — check context, might be intentional
- `6px` (9x) — off 4px grid but common, **recommend keeping** as `sm-` variant OR migrating to `4px`

---

## 2. Spacing — target 8px grid

**Target:** `2 / 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64`

### Current state — single-value padding/margin/gap

| Value | Count | Action |
|---|---|---|
| 4px | 25 | ✅ keep (xs) |
| 6px | 29 | ⚠️ off-grid but heavily used — **flag for review**, probably → 4px or 8px |
| 8px | 69 🏆 | ✅ keep (sm) — most used |
| 10px | 36 | ⚠️ off-grid — replace with **8px** or **12px** per context |
| 12px | 38 | ✅ keep (md) |
| 16px | 33 | ✅ keep (lg) |
| 20px | 7 | ✅ keep (xl) |
| 24px | 10 | ✅ keep (2xl) |
| 28px | 7 | ⚠️ off-grid — replace with **24px** or **32px** |
| 32px | 4 | ✅ keep (3xl) |
| 48px | 2 | ✅ keep |
| 64px | 1 | ✅ keep |
| 40px | 1 | ✅ keep |
| 22px | 2 | ❌ off-grid → **24px** |
| 18px | 1 | ❌ off-grid → **16px** |
| 14px | 9 | ❌ off-grid → **12px** or **16px** |
| 13px | 1 | ❌ off-grid → **12px** |
| 7px | 1 | ❌ off-grid → **8px** |
| 5px | 8 | ❌ off-grid → **4px** or **8px** |
| 3px | 3 | ❌ off-grid → **4px** |
| 2px | 9 | ✅ keep (hairline) |
| 1px | 2 | ✅ keep (hairline) |

### Spacing replacements required

| From | To | Count | Rule |
|---|---|---|---|
| 10px | 8px OR 12px | 36 | ⚠️ **manual review per context** — buttons→8, cards→12 |
| 6px | 4px OR 8px | 29 | ⚠️ **manual review** — icon gaps→4, general→8 |
| 5px | 4px | 8 | ↓ snap |
| 28px | 24px OR 32px | 7 | manual |
| 14px | 12px OR 16px | 9 | manual |
| 3px | 4px | 3 | ↑ snap |
| 22px | 24px | 2 | ↑ snap |
| 7px | 8px | 1 | ↑ snap |
| 13px | 12px | 1 | ↓ snap |
| 18px | 16px | 1 | ↓ snap |
| **TOTAL** | | **97** | |

**⚠️ WARNING:** Spacing is trickier than typography — `padding: 10px 16px` means different things per element. **Do not auto-replace blindly.**

**Recommended approach:**
1. Apply **safe** replacements first (3→4, 7→8, 13→12, 18→16, 22→24) — ~8 changes, zero risk
2. For 10px, 6px, 5px, 14px, 28px → **do per-file review**, not bulk replace
3. These are the values where "close enough" matters visually — check each in DevTools first

---

## 3. Shadows — catastrophic drift

### Current state

- **81 unique shadow values** 💀
- **140 raw (non-theme) box-shadow usages**
- `theme.shadows.*` already has: `card`, `cardHover`, `tab`, `floating`, `modal`, `sheet`, `soft`, `medium`

### Target — 6 semantic tokens

| Token | Shadow | Use |
|---|---|---|
| `theme.shadows.soft` | `0 1px 2px rgba(0,0,0,0.02)` | Minimal elevation |
| `theme.shadows.card` | `0 2px 8px rgba(0,0,0,0.04)` | Default cards |
| `theme.shadows.cardHover` | `0 8px 24px rgba(0,0,0,0.08)` | Card hover |
| `theme.shadows.floating` | `0 12px 32px rgba(0,0,0,0.10)` | Popovers, dropdowns |
| `theme.shadows.modal` | `0 24px 64px rgba(0,0,0,0.12)` | Modals, sheets |
| `theme.shadows.accentGlow` | `0 2px 8px rgba(99,102,241,0.25)` | Primary CTA glow |

### Common duplicates to consolidate

- `0 1px 4px rgba(99,102,241,0.25)` (4x) + `0 2px 8px rgba(99,102,241,0.25)` (2x) → `theme.shadows.accentGlow`
- `0 0 0 3px rgba(51,132,244,0.1)` (4x) — focus ring → `theme.shadows.focusRing` (new)
- `inset 0 1px 0 rgba(255,255,255,0.7)` (4x) + `0.45` variant (3x) → `theme.shadows.glassTop` (new)
- `0 32px 80px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)` (3x) → `theme.shadows.modalDeep`
- `0 2px 8px rgba(255,160,140,0.28)` (3x) — peach CTA → `theme.shadows.peachGlow`

### Action plan

This is **too complex for mechanical find/replace**. Handle as part of component migration:
1. Add missing tokens to `theme.shadows`: `focusRing`, `glassTop`, `glassTopLight`, `modalDeep`, `peachGlow`, `accentGlow`
2. For each shared component (`Button`, `Card`, `Modal`, `GradientBanner`) — already uses tokens ✅
3. **When migrating pages** (per MIGRATION_GUIDE.md) — replace local shadows with token references
4. **Do NOT do this as a standalone cleanup** — do it as part of each page migration PR

---

## 4. Colors — partial consolidation

### Current state

- **185 unique hex colors** in the codebase 💀
- Palette has ~25 legitimate brand/semantic colors
- **~160 off-palette hex values** — most are gray variants and legacy brand colors

### Most-used off-palette offenders

| Color | Count | What to do |
|---|---|---|
| #999 | 35 | → `theme.colors.text.hint` (#8E8E93) |
| #333 | 27 | → `theme.colors.text.primary` (#1F1F1F) |
| #555 | 13 | → `theme.colors.text.body` |
| #666 | 13 | → `theme.colors.text.body` |
| #444 | 11 | → `theme.colors.text.primary` |
| #6E7FF2 | 10 | Legacy brand indigo → **#6366F1** (theme.colors.brand.indigo) |
| #6B6B6B | 10 | → `theme.colors.text.muted` |
| #8B5CF6 | 8 | Purple — not in palette, decide: keep as special OR → brand.indigo |
| #777 | 7 | → `theme.colors.text.subtle` |
| #9B9790 | 7 | Warm gray — keep if intentional |

### Action plan

1. **Safe** (can bulk replace): `#6E7FF2` → `theme.colors.brand.indigo` (10 occurrences) — legacy brand unification
2. **Gray unification** — replace all bare grays (`#999`, `#333`, `#666`, etc.) with semantic `theme.colors.text.*` tokens **during page migration**
3. **Keep as-is** for now: brand accents, status colors, widget preview colors
4. This is a **~100+ replacement job** — do as part of MIGRATION_GUIDE steps, not a one-shot

---

## Summary — What to do now vs later

### ✅ Do NOW as one commit (`spacing-cleanup` branch)

| Change | Count | Risk |
|---|---|---|
| Radius replacements (10→12, 14→16, 18→16, 9→8, 3→4, 2.5→4, 11→12, 13→12) | **92** | Low — all values are visually close |
| Safe spacing snaps (3→4, 7→8, 13→12, 18→16, 22→24) | **8** | Low |
| Legacy brand swap #6E7FF2 → #6366F1 | **10** | Low — unifies brand |
| **TOTAL safe changes** | **110** | |

### ⚠️ Do LATER during page migrations

- **Spacing 10px/6px/5px/14px/28px** — need per-context review (~80 changes)
- **Shadow migration** — replace 140 raw shadows with `theme.shadows.*` (adds ~6 new tokens)
- **Gray unification** — replace ~100 bare grays with `theme.colors.text.*`

### Execution (for Claude Code, after typography-cleanup lands)

1. `git checkout design-experiment && git pull`
2. `git checkout -b spacing-cleanup`
3. Apply 92 radius replacements (bulk safe)
4. Apply 8 safe spacing snaps
5. Apply 10 brand color unifications (#6E7FF2 → theme.colors.brand.indigo import)
6. `npm run check` must pass
7. Visual QA: DesignSystemPage (shows all radii), cards on TemplatesPage, buttons everywhere
8. Commit: `refactor(ds): snap radii + safe spacing/color fixes`
9. Push + PR to `design-experiment`

### The BIG cleanup (shadows + grays) goes into page migrations

Every page migration PR per `MIGRATION_GUIDE.md` should include:
- Replace local shadows with `theme.shadows.*`
- Replace bare grays with `theme.colors.text.*`
- Replace remaining off-grid spacing with theme values

