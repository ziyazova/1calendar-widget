# Phase 3.6 — SettingsPage Migration

**File:** `src/presentation/pages/SettingsPage.tsx` (1304 → ~900 lines target)
**Risk:** 🔴 Hard. 35 styled + 24 inline styles + 68 hex colors. Large surface area.

## Strategy — break into 3 internal sub-phases
Do in **one PR** but **3 separate commits** on the branch so review is easier.

### Sub-phase A: Cards + Accordions (biggest win)
Settings page is sections → each section should use `<Accordion>` or `<Card $variant="subtle">`.

```tsx
import { Accordion, AccordionGroup, Card, CardTitle } from '@/presentation/components/shared';
```

Replace each section wrapper:
- Account / Profile / Subscription / Usage / Danger Zone
- Each becomes an `<Accordion title="...">` inside an `<AccordionGroup>`
- OR `<Card $variant="subtle" $padding="lg">` if always-expanded

### Sub-phase B: Buttons + upsells
- "Manage subscription" / "Cancel" / "Upgrade to Pro" → `<Button $variant="primary|accent|outline">`
- "Delete account" → `<Button $variant="danger">`
- Pro upsell banner → `<GradientBanner $tone="indigo">` with `<PlanRing>`

### Sub-phase C: Colors + inline styles
- Audit all 68 hex codes → migrate per cheatsheet
- Pull 24 `style={{...}}` blocks into styled-components

## Likely shared components to use
- `Accordion`, `AccordionGroup`
- `Card`, `CardHeader`, `CardTitle`, `CardSubtitle`, `CardSection`
- `Button` (all variants: primary, accent, outline, danger, ghost, link)
- `GradientBanner` + `BannerIcon` + `BannerBody`
- `PlanRing` for usage indicator
- `PlanUpgradeBar` for Pro upsell footer
- `Modal` for "Delete account" confirm dialog
- `ProPill`, `FreePill`, `PlanPill` from Badges

## Delete account modal
If there's a custom overlay for "Delete account confirmation" — MUST become `<Modal>` with `<Button $variant="danger">` as confirm.

## Critical — don't break
- Email change flow
- Password change flow
- Subscription cancel flow
- Usage counter (widgets used vs limit)
- Dark mode toggle

## QA checklist (extensive)
- [ ] `/settings` opens, all sections visible
- [ ] Accordion sections expand/collapse (if applicable)
- [ ] Edit name → saves, shows toast
- [ ] Change email → verification flow triggers
- [ ] Change password → success → logged out of other sessions
- [ ] Cancel subscription → confirm modal → API call
- [ ] Resume subscription works
- [ ] Usage ring displays correct percent
- [ ] Upgrade-to-Pro CTA works (navigates to Polar)
- [ ] Delete account → modal → confirm → account gone, redirect to login
- [ ] Dark mode toggle (if present) flips theme
- [ ] Mobile: all sections stack, no overflow

## Commit (3-commit series)
```
1. refactor(settings): migrate section wrappers to Accordion/Card
2. refactor(settings): migrate buttons + upgrade banner to shared
3. refactor(settings): migrate hex colors + inline styles to theme

Squash-merge to design-experiment as single PR.
File: 1304 → ~900 lines
```

## Red flags during review
- Any `rgba(` remaining outside theme constants
- Any `position: 'fixed'` overlay NOT using `<Modal>`
- Any destructive action NOT using `<Button $variant="danger">`
- Any Pro/upsell block NOT using `<GradientBanner>`
- File still over 1000 lines after migration
