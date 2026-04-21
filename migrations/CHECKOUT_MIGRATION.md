# Phase 3.5 — CheckoutPage Migration

**File:** `src/presentation/pages/CheckoutPage.tsx` (523 → ~380 lines)
**Risk:** 🟠 Medium. 36 local styled — many can fold into `<Card>` / `<Button>`.

## 1. Imports
```tsx
import { PageWrapper, Button, Card, CardHeader, CardTitle } from '@/presentation/components/shared';
```

## 2. Button swaps
| Local | → | Shared |
|---|---|---|
| `BackBtn` | → | `<Button $variant="ghost" $size="sm">` |
| `PayBtn` | → | `<Button $variant="primary" $size="xl" $fullWidth>` (note: XL = 48px, not 52px — visual check) |
| `PromoBtn` | → | `<Button $variant="secondary" $size="md">` |
| `EmptyBtn` | → | `<Button $variant="primary" $size="lg">` |
| `SummaryRemove` | → | `<Button $variant="ghost" $size="xs" $iconOnly>` |

## 3. Card surfaces
| Local | → | Shared |
|---|---|---|
| `SummaryCard` | → | `<Card $variant="outlined" $padding="none" $radius="lg">` — then manage internal dividers with borders |
| `SupportCard` | → | `<Card $variant="subtle" $padding="lg">` |

**Note:** SummaryCard has a complex internal structure (Header / Items / Promo / Footer) with separator borders. Keep internal `Section` wrappers but the outer container becomes `<Card>`.

## 4. Keep (too form-specific)
- `Input`, `Label`, `FormGroup`, `FormGrid`, `Section`, `SectionTitle` — no shared Input yet
- `Summary*` (internal layout of summary card)
- `SummaryThumb` — custom preview tile

## 5. Migrate hex
7 hex values total. Mostly already using theme tokens! Only `#333` in hover and `#fff` in button text need audit.
- `#333` (PayBtn/EmptyBtn hover) → delete (Button handles hover)
- `#fff` (PayBtn text) → delete (Button handles)
- `rgba(220,40,40,0.06)` → `theme.colors.destructiveBg`

## 6. Migrate spacing
Already uses `theme.spacing.*` well. ✅ Just audit for any remaining literals.

## QA checklist
- [ ] `/checkout` with items → full checkout renders
- [ ] Empty cart → empty state with CTA
- [ ] Fill contact info → no layout jitter
- [ ] Remove item via trash → cart updates
- [ ] Pay button shows correct total
- [ ] Mobile: summary stacks above form (order: -1 rule)
- [ ] Free vs paid total renders correctly

## Commit
```
refactor(checkout): migrate buttons and card surfaces to shared

- Replace 5 button styled-components with <Button> variants
- Replace SummaryCard and SupportCard with <Card>
- Delete redundant hover/color styles (now handled by Button)
- File: 523 → ~380 lines
```
