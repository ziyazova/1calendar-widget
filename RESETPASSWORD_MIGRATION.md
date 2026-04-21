# Phase 3.2b — ResetPasswordPage Migration

**File:** `src/presentation/pages/ResetPasswordPage.tsx` (350 → ~220 lines)
**Risk:** 🟡 Easy. Page is essentially a mini-LoginPage clone. Follow the LoginPage recipe.

## Swaps

### 1. Imports
```tsx
import { PageWrapper, Footer, Button } from '../components/shared';
```

### 2. Delete local styled → shared
| Local | → | Shared |
|---|---|---|
| `SubmitBtn` | → | `<Button $variant="primary" $size="xl" $fullWidth>` |

### 3. KEEP (form-specific)
- `InputWrap`, `InputIcon`, `Input`, `PasswordToggle` — migrate hex → tokens
- `RequirementsList`, `Requirement` — migrate `#16A34A` → `theme.colors.success`, `#999` → `theme.colors.text.hint`
- `ErrorText` — migrate to use `theme.colors.destructive` / `theme.colors.destructiveBg` / `theme.colors.destructiveBorder`
- `IconWrap`, `SuccessIcon` — replace `#6366F1` → `theme.colors.brand.indigo`, `#16A34A` → `theme.colors.success`
- `Title`, `Subtitle` — migrate `#1F1F1F` → `theme.colors.text.primary`, `#888` → `theme.colors.text.hint`

### 4. Input bg & border colors → tokens
```tsx
// Input
border: 1px solid ${({ theme }) => theme.colors.border.light};
background: ${({ theme }) => theme.colors.background.elevated};
&:focus { border-color: ${({ theme }) => theme.colors.accent}; }
```

## All ~16 hex replacements
- `#1F1F1F` → `text.primary`
- `#888` / `#999` → `text.hint`
- `#555` → `text.body`
- `#6366F1` → `brand.indigo`
- `#16A34A` → `success`
- `#DC2828` → `destructive`
- `rgba(0,0,0,0.08)` → `border.light`

## QA checklist
- [ ] `/reset-password` with valid token → form renders
- [ ] With `#error_code=otp_expired` → "Link expired" state
- [ ] Type new password → live validation checks turn green
- [ ] Submit mismatched passwords → error banner
- [ ] Submit valid → "Password updated" success + button redirects

## Commit
```
refactor(reset-password): migrate to shared Button + theme tokens
```
