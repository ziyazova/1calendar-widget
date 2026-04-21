# Phase 3.4 — TemplateDetailPage Migration

**File:** `src/presentation/pages/TemplateDetailPage.tsx` (1002 → ~700 lines target)
**Risk:** 🟠 Medium. 50 styled-components + 6 inline style blocks + 13 hex colors.

## Strategy
Treat as 3 sub-refactors in ONE commit:
1. Buttons (Add to Cart, Preview, Back) → `<Button>`
2. Price badge / action cards → `<Card>`
3. Any upsell/info banner → `<GradientBanner>`

## 1. Imports
```tsx
import {
  PageWrapper, BackButton, Button, Card,
  GradientBanner, BannerIcon, BannerBody, BannerTitle, BannerText,
} from '@/presentation/components/shared';
```

## 2. Button swaps
Find all `styled.button` definitions. Likely candidates:
- `AddToCartBtn` / `BuyBtn` → `<Button $variant="primary" $size="lg">`
- `PreviewBtn` → `<Button $variant="outline" $size="lg">`
- `FavoriteBtn` (if exists) → `<Button $variant="ghost" $iconOnly>`

## 3. Card surfaces
- Price/CTA card → `<Card $variant="elevated" $padding="lg">`
- Feature list card → `<Card $variant="subtle" $padding="md">`
- Related templates section wrapper → `<Card $variant="outlined">`

## 4. Feature bullets / info pills
If there are banners saying "Free download", "Pro exclusive" — convert to `<GradientBanner>` with appropriate `$tone`:
- "Free" → `$tone="sage"`
- "Pro" → `$tone="indigo"`

## 5. Migrate hex colors
Audit all 13 hex values, map to theme tokens per standard cheatsheet (see LOGIN_MIGRATION.md section 6).

## 6. Inline styles (6 blocks)
Each `style={{ ... }}` with >3 properties → pull into a small styled-component. No raw hex.

## QA checklist
- [ ] `/templates/:id` — renders detail view
- [ ] Click "Add to Cart" → cart updates, toast/feedback shown
- [ ] Click "Preview" → opens preview modal or navigates
- [ ] Click "Buy now" (if exists) → goes to checkout
- [ ] Related templates section renders
- [ ] Mobile: layout stacks correctly
- [ ] Button sizes consistent across entire page

## Commit
```
refactor(template-detail): migrate to shared components

- Replace local buttons with <Button> variants
- Replace card surfaces with <Card> variants
- Migrate 13 hex colors to theme tokens
- Pull 6 inline style blocks into styled-components
- File: 1002 → ~700 lines
```
