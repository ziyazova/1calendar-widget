# Phase 3.2a — VerifyEmailPage Migration

**File:** `src/presentation/pages/VerifyEmailPage.tsx` (169 → ~110 lines)
**Risk:** 🟢 Trivial. ~30 min work.

## Swaps

### 1. Imports
```tsx
import { PageWrapper, Footer, Button, Card } from '../components/shared';
```

### 2. Delete local styled-components
- `SubmitBtn` → `<Button $variant="primary" $size="xl" $fullWidth>`
- `Title`, `Subtitle` → keep (page-specific headings) BUT migrate `#1F1F1F`, `#777` to `theme.colors.text.primary` / `theme.colors.text.subtle`

### 3. `IconWrap` — keep but migrate colors
```tsx
svg { color: ${({ $ok, theme }) => ($ok ? theme.colors.success : theme.colors.destructive)}; }
```
Replace rgba gradients with theme-based soft bg (use `theme.colors.successBg` / `theme.colors.destructiveBg`) if available; otherwise keep rgba literals.

### 4. All three views (expired / success / verifying)
Replace `<SubmitBtn onClick={...}>` → `<Button $variant="primary" $size="xl" $fullWidth onClick={...}>` with `<ArrowRight size={16} />` inside.

## Hex replacements
- `#1F1F1F` → `theme.colors.text.primary`
- `#777` → `theme.colors.text.subtle`
- `#16A34A` → `theme.colors.success`
- `#DC2828` → `theme.colors.destructive`

## QA checklist
- [ ] Navigate to `/verify-email` → pending state renders
- [ ] Navigate with `#error_code=otp_expired` → expired state
- [ ] Simulate success → "Email confirmed" + button redirects to /studio

## Commit
```
refactor(verify-email): migrate to shared components

- Replace SubmitBtn with <Button>
- Migrate hex colors to theme tokens
- File: 169 → ~110 lines
```
