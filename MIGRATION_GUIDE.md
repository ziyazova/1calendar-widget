# Migration Guide — Unified Design System

**Goal:** move every page from ad-hoc styled components and hardcoded colors to the shared token system and shared components. Do this **one page at a time**, verifying after each.

---

## 1. Rules

1. **Never hardcode colors.** Replace every `#hex` literal with a `theme.colors.*` token.
2. **Never hardcode font sizes/weights.** Use `theme.typography.sizes.*` and `theme.typography.weights.*`.
3. **Never hardcode spacing.** Use `theme.spacing.N` (multiples of 4).
4. **Never hardcode radii.** Use `theme.radii.*`.
5. **Never hardcode shadows.** Use `theme.shadows.*` or `theme.colors.accentShadow.*`.
6. **Prefer shared components over local styled components** when a shared one exists.

---

## 2. Token Mapping Cheatsheet

### Colors — hardcoded → token

| Old | New |
|---|---|
| `#1F1F1F` (text) | `theme.colors.text.primary` |
| `#666` / `#6E6E73` | `theme.colors.text.body` |
| `#999` | `theme.colors.text.subtle` |
| `#AFAFAF` / `#AAA` | `theme.colors.text.hint` |
| `#555` | `theme.colors.text.dim` |
| `#FFFFFF` (bg) | `theme.colors.background.elevated` |
| `#FAFAFA` | `theme.colors.background.surfaceAlt` |
| `#F5F5F5` / `#F5F5F7` | `theme.colors.background.surfaceMuted` |
| `#F8F8F7` | `theme.colors.background.surfaceCool` |
| `rgba(0,0,0,0.08)` (border) | `theme.colors.border.light` |
| `rgba(0,0,0,0.12)` | `theme.colors.border.medium` |
| `#6366F1` | `theme.colors.brand.indigo` |
| `#818CF8` | `theme.colors.brand.indigoLight` |
| `#3384F4` | `theme.colors.brand.blue` |

### Gradients — inline → token

| Old | New |
|---|---|
| `linear-gradient(135deg, #6366F1, #818CF8)` | `theme.colors.gradients.indigo` |
| `linear-gradient(135deg, #3384F4, #5BA0F7)` | `theme.colors.gradients.blue` |
| White→cream wash | `theme.colors.gradients.softBanner` |
| Template card hover | `theme.colors.gradients.templateCard` |

### Shadows

| Old | New |
|---|---|
| `0 2px 12px rgba(0,0,0,0.04)` | `theme.shadows.card` |
| `0 8px 24px rgba(0,0,0,0.08)` | `theme.shadows.cardHover` |
| `0 4px 16px rgba(99,102,241,0.3)` | `theme.colors.accentShadow.md` |
| `0 8px 24px rgba(99,102,241,0.35)` | `theme.colors.accentShadow.lg` |

---

## 3. Component Migration Table

| Old pattern | New shared |
|---|---|
| `<button>` with custom styled CTA | `<Button $variant="..." $size="...">` |
| Pricing/settings card (div + border + shadow) | `<Card $variant="elevated" $padding="lg">` |
| Custom overlay dialog | `<Modal open title>` |
| Collapsible section with chevron | `<Accordion title>` |
| `<div>` with conic-gradient progress ring | `<PlanRing percent={N}>` |
| Pro upsell strip | `<GradientBanner $tone="indigo">` or `<PlanUpgradeBar mode="free">` |

---

## 4. Per-Page Migration Steps

For **each page** (`LoginPage`, `StudioPage`, `TemplatesPage`, `TemplateDetailPage`, `DesignSystemPage`, `LandingPage`):

### Step 1 — audit imports
Add to top:
```ts
import {
  Button, Card, CardHeader, CardTitle, CardSubtitle, CardSection,
  Modal, ModalFooter, Accordion, AccordionGroup,
  PlanRing, GradientBanner, BannerIcon, BannerBody, BannerTitle, BannerText, BannerActions,
  PlanUpgradeBar,
} from '@/presentation/components/shared';
```

### Step 2 — grep+replace hardcoded hex
Run locally:
```bash
grep -rn "#[0-9A-Fa-f]\{6\}" src/presentation/pages/<page>.tsx
```
For each hit, replace with a token from §2 above.

### Step 3 — replace buttons
Find any `styled.button` or `<button style={...}>`. Replace with `<Button>` using the right `$variant`:
- Dark CTA → `$variant="primary"`
- Indigo/purple CTA → `$variant="accent"`
- Blue Copy/Embed → `$variant="blue"`
- Light bordered → `$variant="secondary"`
- Transparent bordered → `$variant="outline"`
- Inline text → `$variant="ghost"` or `$variant="link"`
- Delete → `$variant="danger"`

### Step 4 — replace cards
Find any `styled.div` that sets `background + border + border-radius + shadow`. Replace with `<Card>`.

### Step 5 — replace modals
Find any `position: fixed; inset: 0; z-index: ...` overlay pattern. Replace with `<Modal>`.

### Step 6 — verify
```bash
npm run typecheck
npm run lint
npm run test
npm run dev   # visual check
```

### Step 7 — delete dead styled components
After successful migration, delete the old local `const StyledX = styled.div`` ... `` declarations. Commit.

---

## 5. Suggested Order

1. **LoginPage** — smallest, isolated. Low blast radius. Great first test.
2. **TemplatesPage** — second easiest. Card-heavy.
3. **TemplateDetailPage** — similar patterns to templates.
4. **DesignSystemPage** — reorganize; this is the "catalog" of the new system.
5. **StudioPage** — biggest; split into `Dashboard.tsx`, `DesktopEditor.tsx`, `MobileEditor.tsx` before migrating.
6. **LandingPage** — marketing; lots of one-off hero styles, do last.

---

## 6. Commit Convention

One page per PR/commit. Message:
```
refactor(ds): migrate <Page> to unified tokens + shared components

- Replace N hardcoded colors with theme tokens
- Replace N styled components with shared <Button>/<Card>/<Modal>
- Delete dead styled-component declarations
- No functional changes; visual parity verified
```

---

## 7. Red Flags (Don't Ship)

- ❌ Any remaining `#[0-9A-F]{6}` in page files (outside of a token-mapping layer)
- ❌ Any `<button style={{...}}>` with inline backgrounds
- ❌ Two styled components that differ only in padding/color — combine via props
- ❌ Any `z-index: 999` literal — use `theme.zIndex.*`
- ❌ Unused imports after migration (`eslint --fix` catches these)

---

## 8. What I Already Did

✅ `src/presentation/themes/theme.ts` — dedup `radii.button`; added `brand.*`, `gradients.*`, `accentShadow/blueShadow/successShadow`, extended `spacing`, extended `typography.sizes`, added `shadows.card/cardHover/tab/floating/modal/sheet`, added `text.subtle/hint/body/dim` and `background.surfaceAlt/Muted/Cool`.

✅ `src/presentation/components/shared/Button.tsx` — extended with `$variant` (9) × `$size` (5) × modifiers (`$fullWidth`, `$pill`, `$iconOnly`). Legacy `PrimaryButton` / `SecondaryButton` kept.

✅ New shared components:
- `Card.tsx` (+ `CardHeader`, `CardTitle`, `CardSubtitle`, `CardSection`)
- `Modal.tsx` (+ `ModalFooter`)
- `Accordion.tsx` (+ `AccordionGroup`)
- `PlanRing.tsx`
- `GradientBanner.tsx` (+ `BannerIcon`, `BannerBody`, `BannerTitle`, `BannerText`, `BannerActions`)
- `PlanUpgradeBar.tsx`

⚠️ `src/presentation/components/shared/index.ts` re-exports `Container`, `Footer`, `FilterChip`, `BackButton`, `SectionHeader`, `PageWrapper`, `PageTransition` — these files don't exist in this sandbox project but do exist in your real repo (otherwise the app wouldn't compile). **I did not touch `index.ts`** to avoid breaking those exports. After you pull this in, add new exports manually:

```ts
// append to src/presentation/components/shared/index.ts
export { Card, CardHeader, CardTitle, CardSubtitle, CardSection } from './Card';
export { Modal, ModalFooter } from './Modal';
export { Accordion, AccordionGroup } from './Accordion';
export { PlanRing } from './PlanRing';
export {
  GradientBanner, BannerIcon, BannerBody,
  BannerTitle, BannerText, BannerActions,
} from './GradientBanner';
export { PlanUpgradeBar } from './PlanUpgradeBar';
```

---

## 9. CLAUDE.md Sync Notes

Current CLAUDE.md references `accent: '#007AFF'` indirectly in a few places. After merging this, update:
- Note that accent is now `#6366F1` (indigo), not iOS blue
- Add "Shared component inventory" section listing the new components
- Add "Color/token policy" section pointing to this migration guide
