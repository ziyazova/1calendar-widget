# Radii + Colors Cleanup Plan (Safe One-Shot)

Purpose: mechanical, low-risk cleanup of border-radius drift and legacy brand color.

Branch: `radii-colors-cleanup` off `design-experiment` (merge after `typography-cleanup` lands).

**What's NOT in this plan (intentionally):**
- Spacing (padding/margin/gap) — tricky, needs per-file review, do inside page migration
- Shadows (81 unique!) — do inside page migration, not bulk
- Bare grays (`#999`, `#333`, `#666`) — replace with `theme.colors.text.*` during page migration

---

## 1. Border-Radius → 6-step scale

**Target scale:** `4 / 8 / 12 / 16 / 24 / 999` (+ `50%` for avatars).

### Replacements (total: ~92)

| From | To | Count | Reason |
|---|---|---|---|
| 10px | 12px | 55 | snap to md |
| 14px | 16px | 19 | snap to lg |
| 9px | 8px | 5 | snap to sm |
| 18px | 16px | 4 | snap down to lg |
| 3px | 4px | 4 | snap to xs |
| 2.5px | 4px | 3 | snap to xs |
| 11px | 12px | 1 | snap to md |
| 13px | 12px | 1 | snap to md |
| **TOTAL** | | **92** | |

### Exact locations

#### `10px → 12px`  [55 hits]

- `pages/DesignSystemPage.tsx:1107` — `border-radius: 10px;`
- `pages/DesignSystemPage.tsx:1178` — `border-radius: 10px;`
- `pages/DesignSystemPage.tsx:1334` — `border-radius: 10px;`
- `pages/DesignSystemPage.tsx:1634` — `border-radius: 10px;`
- `pages/DesignSystemPage.tsx:1676` — `border-radius: 10px;`
- `pages/DesignSystemPage.tsx:1853` — `border-radius: 10px;`
- `pages/DesignSystemPage.tsx:1917` — `border-radius: 10px;`
- `pages/DesignSystemPage.tsx:2182` — `border-radius: 10px;`
- `pages/DesignSystemPage.tsx:2192` — `border-radius: 10px;`
- `pages/DesignSystemPage.tsx:2204` — `border-radius: 10px;`
- `pages/DesignSystemPage.tsx:2269` — `border-radius: 10px;`
- `pages/LegalPage.tsx:118` — `border-radius: 10px;`
- `pages/LoginPage.tsx:206` — `border-radius: 10px;`
- `pages/LoginPage.tsx:217` — `border-radius: 10px;`
- `pages/LoginPage.tsx:260` — `border-radius: 10px;`
- `pages/LoginPage.tsx:271` — `border-radius: 10px;`
- `pages/LoginPage.tsx:652` — `padding: '10px 12px', borderRadius: 10, marginBottom: 8, lineHeight: 1.45,`
- `pages/LoginPage.tsx:825` — `borderRadius: 10,`
- `pages/LoginPage.tsx:844` — `padding: '10px 12px', borderRadius: 10, marginBottom: 12,`
- `pages/PrivacyPage.tsx:113` — `border-radius: 10px;`
- `pages/RefundPage.tsx:109` — `border-radius: 10px;`
- `pages/ResetPasswordPage.tsx:131` — `border-radius: 10px;`
- `pages/ResetPasswordPage.tsx:150` — `border-radius: 10px;`
- `pages/SettingsPage.tsx:184` — `border-radius: 10px;`
- `pages/SettingsPage.tsx:234` — `border-radius: 10px;`
- `pages/SettingsPage.tsx:462` — `border-radius: 10px;`
- `pages/SettingsPage.tsx:486` — `border-radius: 10px;`
- `pages/StudioPage.tsx:77` — `border-radius: 10px;`
- `pages/StudioPage.tsx:281` — `width: 56px; height: 56px; border-radius: 10px; overflow: hidden; background: #F5F5F5; flex-shr`
- `pages/StudioPage.tsx:308` — `border-radius: 10px;`
- `pages/StudioPage.tsx:335` — `border-radius: 10px;`
- `pages/StudioPage.tsx:399` — `border-radius: 10px;`
- `pages/StudioPage.tsx:932` — `border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10, background: '#fff',`
- `pages/StudioPage.tsx:984` — `border: 'none', borderRadius: 10,`
- `pages/StudioPage.tsx:1046` — `border: 'none', borderRadius: 10,`
- `pages/TermsPage.tsx:109` — `border-radius: 10px;`
- `pages/WidgetStudioPage.tsx:484` — `border-radius: 10px;`
- `pages/WidgetStudioPage.tsx:870` — `background: 'rgba(0,0,0,0.04)', borderRadius: 10, cursor: 'pointer', fontSize: 18, color: '#999`
- `components/dashboard/DashboardViews.tsx:231` — `border-radius: 10px;`
- `components/dashboard/DashboardViews.tsx:920` — `border-radius: 10px;`
- `components/dashboard/DashboardViews.tsx:1037` — `border-radius: 10px;`
- `components/dashboard/DashboardViews.tsx:1608` — `padding: '10px 12px', borderRadius: 10, marginBottom: 12,`
- `components/dashboard/DashboardViews.tsx:1676` — `borderRadius: 10, marginBottom: 16,`
- `components/dashboard/DashboardViews.tsx:1750` — `border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10,`
- `components/layout/TopNav.tsx:633` — `borderRadius: 10,`
- `components/layout/TopNav.tsx:657` — `color: '#4F46E5', fontFamily: 'inherit', borderRadius: 10,`
- `components/ui/sidebar/StylePickerPanel.tsx:271` — `border-radius: 10px;`
- `components/ui/sidebar/StylePickerPanel.tsx:300` — `border-radius: 10px;`
- `components/ui/sidebar/StylePickerPanel.tsx:446` — `border-radius: 10px;`
- `components/ui/sidebar/StylePickerPanel.tsx:462` — `border-radius: 10px;`
- `components/shared/Button.tsx:183` — `border-radius: 10px;`
- `components/shared/Button.tsx:191` — `border-radius: 10px;`
- `components/shared/GradientBanner.tsx:90` — `border-radius: 10px;`
- `components/shared/Modal.tsx:104` — `border-radius: 10px;`
- `components/shared/PlanUpgradeBar.tsx:115` — `borderRadius: 10,`

#### `14px → 16px`  [19 hits]

- `pages/DesignSystemPage.tsx:1490` — `border-radius: 14px;`
- `pages/DesignSystemPage.tsx:1696` — `border-radius: 14px;`
- `pages/DesignSystemPage.tsx:1802` — `border-radius: 14px;`
- `pages/PrivacyPage.tsx:160` — `border-radius: 14px;`
- `pages/StudioPage.tsx:273` — `border-radius: 14px;`
- `pages/StudioPage.tsx:1153` — `background: '#FAFAFA', borderRadius: 14, padding: '10px 16px',`
- `pages/StudioPage.tsx:1170` — `background: '#FAFAFA', borderRadius: 14, padding: '10px 16px',`
- `pages/WidgetStudioPage.tsx:73` — `border-radius: 14px;`
- `pages/WidgetStudioPage.tsx:128` — `border-radius: 14px;`
- `pages/WidgetStudioPage.tsx:161` — `border-radius: 14px;`
- `components/dashboard/DashboardViews.tsx:250` — `border-radius: 14px;`
- `components/dashboard/DashboardViews.tsx:705` — `border-radius: 14px;`
- `components/dashboard/DashboardViews.tsx:906` — `border-radius: 14px;`
- `components/landing/HeroSection.tsx:220` — `border-radius: 14px;`
- `components/landing/HeroSection.tsx:282` — `border-radius: 14px;`
- `components/landing/HeroSectionV2.tsx:185` — `border-radius: 14px;`
- `components/landing/HowItWorksSection.tsx:80` — `border-radius: 14px;`
- `components/ui/forms/CustomizationPanel.tsx:623` — `border-radius: 14px;`
- `components/ui/sidebar/StylePickerPanel.tsx:183` — `border-radius: 14px;`

#### `9px → 8px`  [5 hits]

- `pages/DesignSystemPage.tsx:1290` — `border-radius: 9px;`
- `pages/DesignSystemPage.tsx:1318` — `border-radius: 9px;`
- `pages/SettingsPage.tsx:310` — `border-radius: 9px;`
- `components/layout/TopNav.tsx:693` — `fontFamily: 'inherit', borderRadius: 9, transition: 'background 0.12s',`
- `components/layout/TopNav.tsx:715` — `fontFamily: 'inherit', borderRadius: 9,`

#### `18px → 16px`  [4 hits]

- `pages/DesignSystemPage.tsx:1228` — `border-radius: 18px;`
- `pages/DesignSystemPage.tsx:2119` — `border-radius: 18px;`
- `pages/LoginPage.tsx:245` — `border-radius: 18px;`
- `components/layout/TopNav.tsx:596` — `background: '#fff', borderRadius: 18, border: '1px solid rgba(0,0,0,0.05)',`

#### `3px → 4px`  [4 hits]

- `pages/DesignSystemPage.tsx:1375` — `border-radius: 3px;`
- `pages/StudioPage.tsx:443` — `border-radius: 3px;`
- `components/landing/CategoriesMarquee.tsx:71` — `border-radius: 3px;`
- `components/ui/ColorPicker.tsx:395` — `border-radius: 3px;`

#### `2.5px → 4px`  [3 hits]

- `components/landing/HeroSectionV2.tsx:455` — `border-radius: 2.5px;`
- `components/landing/HeroSectionV2.tsx:506` — `border-radius: 2.5px;`
- `components/landing/HeroSectionV2.tsx:533` — `border-radius: 2.5px;`

#### `11px → 12px`  [1 hits]

- `components/ui/forms/CustomizationPanel.tsx:290` — `border-radius: 11px;`

#### `13px → 12px`  [1 hits]

- `components/ui/forms/CustomizationPanel.tsx:315` — `border-radius: 13px;`

### Keep as-is (legitimate)

- `4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `999px`
- `50%` — avatar circles
- `20px 20px 0 0` (3x) — top-only rounding, legit
- `52% 48% 50% 50% / 55% 48% 52% 45%` — hero blob shape
- `${({ theme` tokens — already using theme

---

## 2. Brand Color Unification

### Change: `#6E7FF2` (legacy brand) → `#6366F1` (current brand.indigo)

10 occurrences of legacy indigo that need to be swapped to the current brand token.

### Exact locations

- `pages/DesignSystemPage.tsx:1858` — `&:focus { border-color: #6E7FF2; }`
- `pages/DesignSystemPage.tsx:2186` — `&:focus { border-color: #6E7FF2; }`
- `pages/DesignSystemPage.tsx:2197` — `&:focus { border-color: #6E7FF2; }`
- `pages/DesignSystemPage.tsx:2211` — `&:focus { border-color: #6E7FF2; }`
- `pages/DesignSystemPage.tsx:2222` — `accent-color: #6E7FF2;`
- `pages/DesignSystemPage.tsx:2238` — `accent-color: #6E7FF2;`
- `pages/DesignSystemPage.tsx:3225` — `<ColorSwatch $color="#6E7FF2" />`
- `pages/DesignSystemPage.tsx:3861` — `{['#6E7FF2', '#7C63B8', '#E89A78', '#F4A672', '#7FA96B', '#3B82F6'].map((c, i) => (`
- `components/shared/Badges.tsx:16` — `// Brand accent — project's #6E7FF2 (softer than #6366F1 vivid).`
- `components/shared/Badges.tsx:17` — `export const BADGE_ACCENT = '#6E7FF2';`

**How to replace:**
```diff
- color: '#6E7FF2'
+ color: '${theme.colors.brand.indigo}'
```

Or if already accessing theme inline:
```diff
- color: #6E7FF2;
+ color: ${({ theme }) => theme.colors.brand.indigo};
```

### Also worth checking: raw `#6366F1` usage (62 hits)

These are correct color but hardcoded. Not urgent, but worth migrating to token reference during this PR for consistency.

<details><summary>Show 62 locations</summary>

- `pages/DesignSystemPage.tsx:1195`
- `pages/DesignSystemPage.tsx:1396`
- `pages/DesignSystemPage.tsx:1803`
- `pages/DesignSystemPage.tsx:2121`
- `pages/DesignSystemPage.tsx:2351`
- `pages/DesignSystemPage.tsx:3148`
- `pages/DesignSystemPage.tsx:3310`
- `pages/DesignSystemPage.tsx:3530`
- `pages/LegalPage.tsx:46`
- `pages/LegalPage.tsx:125`
- `pages/LegalPage.tsx:187`
- `pages/LegalPage.tsx:191`
- `pages/LoginPage.tsx:251`
- `pages/LoginPage.tsx:304`
- `pages/LoginPage.tsx:658`
- `pages/LoginPage.tsx:833`
- `pages/PrivacyPage.tsx:39`
- `pages/PrivacyPage.tsx:120`
- `pages/PrivacyPage.tsx:188`
- `pages/PrivacyPage.tsx:238`
- `pages/PrivacyPage.tsx:242`
- `pages/RefundPage.tsx:37`
- `pages/RefundPage.tsx:116`
- `pages/RefundPage.tsx:152`
- `pages/RefundPage.tsx:156`
- `pages/ResetPasswordPage.tsx:30`
- `pages/SettingsPage.tsx:353`
- `pages/StudioPage.tsx:173`
- `pages/StudioPage.tsx:241`
- `pages/StudioPage.tsx:252`
- ... and 32 more

</details>

---

## Execution plan (for Claude Code)

### Step 1 — branch

```bash
git checkout design-experiment && git pull
git checkout -b radii-colors-cleanup
```

### Step 2 — radius replacements (92 total)

Mechanical find/replace per file listed above. Verify no false positives by grepping first:

```bash
grep -rn "border-radius:\s*10px" src/presentation/
grep -rn "borderRadius:\s*['\"]10px['\"]" src/presentation/
grep -rn "borderRadius:\s*10[,}\s]" src/presentation/
```

### Step 3 — brand color swap (10 → theme token)

For each `#6E7FF2` location, either:
- Replace with `#6366F1` (quick win), OR
- Replace with theme token reference `${theme.colors.brand.indigo}` (better)

### Step 4 — verify

```bash
npm run check   # lint + typecheck + test
npm run dev     # manual visual QA
```

**Visual QA checklist:**
- ✅ Buttons — radius consistent across all sizes
- ✅ Cards on TemplatesPage — radii look uniform
- ✅ DesignSystemPage — all radius samples still render correctly
- ✅ Modals/overlays — corner radii match
- ✅ Any #6E7FF2 touched element — color is visibly the SAME (switch is imperceptible, both are indigo)

### Step 5 — commit & PR

```bash
git add -A
git commit -m "refactor(ds): snap border-radius to 6-step scale + unify brand indigo"
git push -u origin radii-colors-cleanup
```

Create PR to `design-experiment`.

---

## Risk assessment

🟢 **Very low risk.** All changes are within 1-2px of original values. Visually imperceptible shifts that snap to the design system scale. No layout or logic changes.

**Worst-case scenario:** a pill loses 1px of rounding. Mitigation: visual QA on DesignSystemPage + TemplatesPage.
