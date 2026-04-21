# Phase 3.3 — TemplatesPage Migration

**File:** `src/presentation/pages/TemplatesPage.tsx` (312 → ~260 lines)
**Risk:** 🟡 Easy. Mostly hex cleanup + optional Card variant.

## Swaps

### 1. Imports
```tsx
import { PageWrapper, BackButton, FilterRow, FilterChip, Card as SharedCard } from '@/presentation/components/shared';
```
Alias as `SharedCard` — there's already a local `Card` styled-component (template grid card). Keep both or rename local one.

### 2. OPTION A (minimal): rename local `Card` → `TemplateCard`, `CardImage` → `TemplateThumb`, etc.
No big change. The local Card is visually specific (aspect ratio, gradient bg, hover zoom) — not worth replacing with shared Card.

### 3. OPTION B (if we want consistency): use `<SharedCard $variant="interactive" $padding="none" $radius="xl">` as wrapper
Wrap `<CardImage>` + `<CardMeta>` inside shared Card. Gives unified hover behavior. Needs visual check — hover transforms may conflict.

**→ Recommend Option A.**

### 4. `SubChip` — keep (visually distinct from FilterChip)
Migrate hex to tokens:
- `#3384F4` → `theme.colors.brand.blue`
- `rgba(51,132,244,0.08)` → OK to leave or use new `theme.colors.blueLight`
- `#1F1F1F` → `theme.colors.text.primary`

### 5. `SearchInput` — migrate focus border
```tsx
&:focus { border-color: ${({ theme }) => theme.colors.border.medium}; background: ${({ theme }) => theme.colors.background.elevated}; }
```

### 6. `Price` — replace `#22C55E` → `theme.colors.success`

### 7. `CardBadge` — migrate to tokens (rgba bg ok to keep)

## Hex replacements (~8 total)
- `#22C55E` → `success`
- `#3384F4` → `brand.blue`
- `#1F1F1F` → `text.primary`
- `#ffffff` in focus → `background.elevated`

## QA checklist
- [ ] `/templates` — grid renders with all templates
- [ ] Filter chips work (All → Calendar → Clock etc.)
- [ ] Sub-chips appear for active category with subs
- [ ] Hover a card → zoom animation smooth
- [ ] Click card → navigates to detail
- [ ] Search filter (when unhidden) works
- [ ] Empty state shows when filter matches nothing
- [ ] Mobile: 1-column grid at 480px

## Commit
```
refactor(templates): migrate hex colors to theme tokens

- SubChip uses theme.colors.brand.blue
- Price uses theme.colors.success
- Rename local Card → TemplateCard (avoid shared collision)
```
