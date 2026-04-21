# Peachy Design System — v2

**Single source of truth for every button, chip, and clickable surface.**
Live preview: `/dev/v2`.

Change one token in the files below → the whole app updates.

---

## Files

| File | Purpose |
|---|---|
| `src/presentation/themes/buttonTokens.ts` | Button variants + sizes (colors, gradients, shadows, heights, radii) |
| `src/presentation/themes/filterChipTokens.ts` | Filter chip palette + single size (32px) |
| `src/presentation/components/shared/Button.tsx` | Button component — reads tokens, applies them |
| `src/presentation/components/shared/FilterChip.tsx` | FilterChip component — reads tokens, applies them |
| `src/presentation/pages/DesignSystemV2Page.tsx` | Live showcase at `/dev/v2` |

---

## Button

### Variants (10)

| variant | When to use |
|---|---|
| `primary` | Default dark CTA. Main action. "Sign in", "Create & Edit", "Get started". |
| `accent` | Filled indigo gradient. "Pro / Upgrade" — loud. |
| `upgrade` | Outlined indigo + transparent fill + `<Sparkles />`. Inline upgrade in cards / toolbars — **the quieter alternative to `accent`**. |
| `secondary` | Notion-style paper. Neutral CTA: "Settings", "Cancel", "Continue with Google". |
| `outline` | Transparent + thin border. Back links, inline secondaries. |
| `ghost` | No bg at rest, subtle hover. Menu items, nav links, dense dropdowns. |
| `danger` | Muted wine outline. Reversible destructive — "Remove", "Log out". |
| `dangerStrong` | Saturated red. Irreversible — "Delete account forever". |
| `success` | Emerald. Confirm / saved / "In cart". |
| `link` | Inline text with underline-on-hover. "Forgot password?", "Learn more". |

### Sizes (4)

| size | height | radius | Where it lives |
|---|---|---|---|
| `sm` | 32px | 10px | Cards, filters, inline actions, dropdown items |
| `md` | 36px | 10px | Toolbars, modals, settings rows |
| `lg` | 44px | 12px | Primary forms, large cards, pricing tiers |
| `xl` | 48px | 12px | Hero CTAs, auth pages, full-width section CTAs |

> **Dropped: `xs` (28px)** — used exactly once in the old codebase. Migrated to `sm`.

### Modifiers

| prop | Effect |
|---|---|
| `$fullWidth` | `width: 100%` — stretches to container. Auth forms, menu items. |
| `$pill` | `border-radius: 999px` — fully rounded. Plan selectors, toggle pills. |
| `$iconOnly` | Square button, padded for a single icon. Close ×, Copy, Edit on cards. |
| `disabled` | 50 % opacity + no-cursor. No hover effects. |

### Usage

```tsx
import { Button } from '@/presentation/components/shared';
import { Sparkles } from 'lucide-react';

// Basic
<Button $variant="primary" $size="md">Create</Button>

// With icon
<Button $variant="upgrade" $size="sm"><Sparkles /> Upgrade</Button>

// Icon only (aria-label required)
<Button $variant="ghost" $size="sm" $iconOnly aria-label="Close"><X /></Button>

// Full-width form action
<Button $variant="primary" $size="xl" $fullWidth>Sign in</Button>
```

---

## Filter chip

One size only — **32px tall, 10px radius** — so chips line up with `Button $size="sm"` in mixed rows.

### States

- **inactive** — white bg, muted grey text, hairline border
- **inactiveHover** — light grey bg, dark text
- **active** — near-black bg, white text, transparent border
- **activeHover** — pure black

### Usage

```tsx
import { FilterChip, FilterRow } from '@/presentation/components/shared';

<FilterRow>
  {categories.map(c => (
    <FilterChip key={c.key} $active={selected === c.key} onClick={() => setSelected(c.key)}>
      {c.label}
    </FilterChip>
  ))}
</FilterRow>
```

---

## Patterns

### 1. Back navigation (top of detail pages)

```tsx
<Button $variant="outline" $size="sm"><ArrowLeft /> Templates</Button>
// or dense:
<Button $variant="outline" $size="sm" $iconOnly aria-label="Back"><ArrowLeft /></Button>
```

### 2. Close × (modals / drawers)

```tsx
<Button $variant="ghost" $size="sm" $iconOnly aria-label="Close"><X /></Button>
```

### 3. Nav items (top-nav, sidebar)

```tsx
<Button $variant="ghost" $size="md">Dashboard</Button>
```

### 4. Card actions (widget / template thumbs)

```tsx
<Button $variant="primary" $size="sm"><Pencil /> Customize</Button>
<Button $variant="ghost" $size="sm" $iconOnly aria-label="Copy"><Copy /></Button>
<Button $variant="danger" $size="sm" $iconOnly aria-label="Delete"><Trash2 /></Button>
```

### 5. Upgrade CTA (inline)

Use the `upgrade` variant (outlined indigo + sparkle) — not filled `accent` — for inline upgrade prompts:

```tsx
<Button $variant="upgrade" $size="sm"><Sparkles /> Upgrade</Button>
<Button $variant="upgrade" $size="lg"><Sparkles /> Upgrade to Pro — $9/mo</Button>
```

### 6. Dropdown menu (avatar in TopNav)

The real app dropdown (shown only when logged in) contains:

1. **Upgrade banner** — soft-indigo gradient, `ArrowUpRight` icon, "$4/mo" badge on the right. Hidden for Pro users. (Not a plain button — a custom row styled in TopNav.)
2. **Dashboard** — `<Button $variant="ghost" $size="sm" $fullWidth>`
3. **Settings** — same
4. **Divider** — 1px horizontal rule
5. **Log out** — `<Button $variant="danger" $size="sm" $fullWidth>` — this is the destructive zone

Shell = `260px` wide card, 6px inner padding, elevated surface.

### 7. Real-world composition — auth page

```tsx
<Button $variant="primary" $size="xl" $fullWidth>Sign in</Button>
<Button $variant="secondary" $size="xl" $fullWidth>
  <GoogleIcon /> Continue with Google
</Button>
<Button $variant="link">Forgot password?</Button>
```

---

## Editing the system

| Change | Edit here |
|---|---|
| Primary button gradient | `buttonTokens.ts` → `primary.base.bg` + `hover.bg` + `active.bg` |
| Accent indigo gradient | `buttonTokens.ts` → `accent.base.bg` + hover/active |
| Upgrade outline tint | `buttonTokens.ts` → `upgrade.base.bg` + border + `fg` |
| Resize all `md` buttons | `buttonTokens.ts` → `buttonSizeTokens.md.height` |
| Unify radius to 12 everywhere | bump `sm` + `md` radius to `'12px'` |
| Recolor active filter chips | `filterChipTokens.ts` → `active.bg` + `.fg` |
| Change chip height | `filterChipTokens.ts` → `filterChipSize.height` |
| Add a new variant | 1. add literal to `ButtonVariant` union<br>2. add entry in `buttonVariantTokens`<br>3. done — no CSS to write in Button.tsx |

---

## Rules (keep the system clean)

1. **Don't inline button styles in pages.** If a CTA is missing a variant/size you need, add it to `buttonTokens.ts` — don't roll a local styled-button.
2. **Don't invent parallel variants.** Instead of `dangerStronger` etc, push the existing `dangerStrong` until truly broken, then extend.
3. **Widget internals are frozen.** `src/presentation/components/widgets/**` is user-customizable content — the DS does not touch it.
4. **Log destructive actions with the right variant.** `danger` for reversible, `dangerStrong` for irreversible (Delete account).
5. **Icons always left** (CTA / menu items) **unless directional forward** (Continue → ArrowRight).

---

## Live preview

Visit `/dev/v2` in dev to see every variant × size, patterns, and the dropdown menu
rendered straight from the tokens above. Changing a token = instant preview.
