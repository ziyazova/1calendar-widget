# Design System Migration Changelog

Rollback commit: `f2fcd4c`

## Phase 1: Update theme.ts ✅
- Typography: 11→10 sizes (px), added md:13px, base:14px, hero:56px
- Colors: removed dead tokens, added text.muted, success, border.light/medium
- Radii: 11→9 tokens (sm:8, button:10, md:12, lg:16, xl:20, 2xl:24, 3xl:28)
- Shadows: 11→4 (form, subtle, medium, heavy)
- Transitions: 8→3 (fast, base, smooth)

## Phase 2: Replace hardcoded grays → theme tokens ✅
- 104 replacements across 18 files
- 14 gray shades → 4 theme tokens (primary/secondary/tertiary/muted)
- Border opacity standardized: 0.04/0.06/0.08 → border.light
- Background surfaces: #F5F5F5/#FAFAFA/#f8f8f8 → background.surface

## Phase 3: Replace border-radius → theme tokens ✅
- 71 replacements across 16 files
- 8px→sm, 10px→button, 12px→md, 16px→lg, 20px→xl, 24px→2xl, 28px→3xl
- Kept hardcoded: 50%/30% (circles), 14px (specific buttons), 3-6px (tiny)

## Phase 4: Replace shadows → theme tokens (IN PROGRESS)
- form, subtle, medium, heavy tokens
- Target: ~20 simple shadow values → 4 tokens

## Remaining phases:
- Phase 5: Standardize button heights (6→2)
- Phase 6: Standardize spacing (off-grid→on-grid)
- Phase 7: Create shared Button component
- Phase 8: Break up large files
