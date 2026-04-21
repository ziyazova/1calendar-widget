# Phase 3.1 — LoginPage Migration

Branch: `migrate-login` off `design-experiment` (only AFTER Phases 1 & 2 landed).

**File:** `src/presentation/pages/LoginPage.tsx` (918 lines → target ~550-600 lines)

**Goal:** Replace local styled-components with shared components (`Button`, `Card`, `Modal`, `GradientBanner`). Remove hardcoded colors/shadows. Reduce file size ~35%.

**Risk:** 🟡 Medium. Lots of buttons + modal + inline-styled panels. Visual QA mandatory.

---

## Pre-flight check

```bash
# Ensure branches are up to date
git checkout design-experiment && git pull
git log --oneline -5   # should show typography + radii cleanup commits
git checkout -b migrate-login
```

---

## 1. Update imports (top of file)

### ❌ Before
```tsx
import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';
import { PageWrapper, Footer } from '@/presentation/components/shared';
import { Mail, Lock, Eye, EyeOff, Check, CheckCircle2, MailCheck, LogOut, ArrowRight, KeyRound } from 'lucide-react';
import { useAuth } from '@/presentation/context/AuthContext';
import { hasSupabaseEnv } from '@/infrastructure/services/supabase';
```

### ✅ After
```tsx
import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';
import {
  PageWrapper, Footer,
  Button,
  Card,
  Modal, ModalFooter,
  GradientBanner, BannerIcon, BannerBody, BannerTitle, BannerText,
} from '@/presentation/components/shared';
import { Mail, Lock, Eye, EyeOff, Check, CheckCircle2, MailCheck, LogOut, ArrowRight, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '@/presentation/context/AuthContext';
import { hasSupabaseEnv } from '@/infrastructure/services/supabase';
```

**Removed:** `KeyRound` (unused in new version). **Added:** `AlertCircle`, `Info` for banner icons.

---

## 2. Replace local styled-components

### 🟢 KEEP (form-specific, no shared equivalent)

- `Container` — page layout wrapper with max-width 420px. Keep.
- `Title`, `Subtitle` — page heading. Keep.
- `Form` — flex container. Keep.
- `InputWrap`, `InputIcon`, `Input`, `PasswordToggle` — no `<Input>` shared yet. **Keep, but migrate radii/spacing to tokens.**
- `Divider` — text divider ("or"). Keep.
- `BottomText` — "Don't have an account?..." text. Keep.
- `Requirement`, `RequirementsList` — password checklist. Keep — visually tied to form.
- `LegalNotice` — "By creating an account..." disclaimer. **Keep but migrate colors to tokens.**

### 🔴 DELETE (replaced by shared components)

| Local component | → | Shared replacement |
|---|---|---|
| `SubmitBtn` (lines 91-109) | → | `<Button $variant="primary" $size="xl" $fullWidth>` |
| `SocialBtn` (lines 126-147) | → | `<Button $variant="outline" $size="xl" $fullWidth>` |
| `LinkBtn` (lines 156-166) | → | `<Button $variant="link" $size="sm">` |
| `ForgotLink` (lines 168-180) | → | `<Button $variant="ghost" $size="sm">` + override alignment |
| `ErrorText` (lines 182-190) | → | `<GradientBanner $tone="soft" $inline>` with custom danger variant, OR keep as inline div using `theme.colors.destructiveBg` |
| `ConfirmCard` (lines 203-209) | → | delete (used inline once, replace with `<Card $variant="flat" $padding="none">`) |
| `ConfirmIcon` (lines 211-222) | → | keep as simple inline styled, **but use theme.colors.brand.indigo instead of #6366F1** |
| `ConfirmEmail` (lines 224-234) | → | inline div using theme tokens |
| `ResendBtn` (lines 236-252) | → | `<Button $variant="outline" $size="md">` |
| `SignedInCard` (lines 256-262) | → | `<Card $variant="outlined" $padding="xl" $radius="lg">` + text-align: center |
| `SignedInAvatar` (lines 264-284) | → | keep, but **migrate #6366F1 → theme token, #EDE4FF/#E0E8FF → gradient token** |
| `PrimaryBtn` (lines 286-305) | → | `<Button $variant="primary" $size="lg" $fullWidth>` |
| `SecondaryBtn` (lines 307-327) | → | `<Button $variant="outline" $size="lg" $fullWidth>` |

**Deletion count:** 13 local styled components removed. File shrinks ~280 lines.

---

## 3. Inline-styled blocks — convert to shared

### 3.1 "Already signed in" card (lines 449-478)

### ❌ Before
```tsx
<SignedInCard>
  <SignedInAvatar>...</SignedInAvatar>
  <div style={{ fontSize: 20, fontWeight: 600, color: '#1F1F1F', letterSpacing: '-0.02em', marginBottom: 4 }}>
    You're already signed in
  </div>
  <div style={{ fontSize: 14, color: '#999' }}>
    Signed in as <strong style={{ color: '#1F1F1F' }}>{displayName}</strong> ({auth.user?.email})
  </div>
  <PrimaryBtn onClick={() => navigate('/studio')}>
    Go to Studio <ArrowRight />
  </PrimaryBtn>
  <SecondaryBtn onClick={async () => { await auth.logout(); }}>
    <LogOut /> Log out
  </SecondaryBtn>
</SignedInCard>
```

### ✅ After
```tsx
<Card $variant="outlined" $padding="xl" $radius="lg" style={{ textAlign: 'center' }}>
  <SignedInAvatar>...</SignedInAvatar>
  <SignedInTitle>You're already signed in</SignedInTitle>
  <SignedInMeta>
    Signed in as <strong>{displayName}</strong> ({auth.user?.email})
  </SignedInMeta>
  <Button $variant="primary" $size="lg" $fullWidth onClick={() => navigate('/studio')} style={{ marginTop: 16 }}>
    Go to Studio <ArrowRight size={16} />
  </Button>
  <Button $variant="outline" $size="lg" $fullWidth onClick={async () => { await auth.logout(); }} style={{ marginTop: 8 }}>
    <LogOut size={14} /> Log out
  </Button>
</Card>
```

Add small local styled-components instead of inline `<div style={{...}}>`:
```tsx
const SignedInTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
  margin-bottom: 4px;
`;
const SignedInMeta = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.hint};
  strong { color: ${({ theme }) => theme.colors.text.primary}; }
`;
```

### 3.2 "Check your email" confirm view (lines 495-541)

Replace inline `<div style>` blocks with styled-components **or** keep inline but swap hex→tokens:

Replacements:
- `color: '#1F1F1F'` → `theme.colors.text.primary`
- `color: '#666'` → `theme.colors.text.body`
- `color: '#999'` → `theme.colors.text.hint`
- `color: '#16A34A'` → `theme.colors.success`
- `<ResendBtn>` → `<Button $variant="outline" $size="md">`

### 3.3 Supabase env warning banner (lines 629-645)

### ❌ Before — raw div with amber colors
```tsx
<div style={{
  fontSize: 13, color: '#92400E',
  background: 'rgba(253,186,116,0.18)',
  border: '1px solid rgba(194,120,3,0.35)',
  padding: '12px 14px',
  borderRadius: 12, marginBottom: 12, lineHeight: 1.5,
}}>
  <strong>Auth is not configured.</strong> ...
</div>
```

### ✅ After — GradientBanner with warning tone
```tsx
<GradientBanner $tone="soft" style={{ marginBottom: 12 }}>
  <BannerIcon><AlertCircle size={16} /></BannerIcon>
  <BannerBody>
    <BannerTitle>Auth is not configured</BannerTitle>
    <BannerText>
      Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local, then restart.
    </BannerText>
  </BannerBody>
</GradientBanner>
```

### 3.4 "Account deleted" notice (lines 647-676)

### ✅ After
```tsx
<GradientBanner $tone="sage" style={{ marginBottom: 12 }}>
  <BannerIcon $tone="sage"><CheckCircle2 size={16} /></BannerIcon>
  <BannerBody>
    <BannerTitle>Your account has been deleted</BannerTitle>
    <BannerText>
      Your profile, widgets and all local data have been removed from this device.
      You can sign up again any time with the same email.
    </BannerText>
  </BannerBody>
  <Button $variant="link" $size="xs" onClick={() => setDeletedNotice(false)}>
    Dismiss
  </Button>
</GradientBanner>
```

### 3.5 Google hint banner (lines 679-696)

### ✅ After
```tsx
<GradientBanner $tone="indigo" $inline style={{ marginBottom: 8 }}>
  <BannerBody>
    Did you sign up with Google? This email may not have a password set. Try{' '}
    <Button $variant="link" $size="xs" onClick={() => auth.loginWithGoogle()}>
      Continue with Google
    </Button>.
  </BannerBody>
</GradientBanner>
```

---

## 4. Migrate "Forgot password" modal (lines 819-918) to `<Modal>`

**Biggest win of this migration.** ~100 lines of hand-rolled overlay → ~40 lines using `<Modal>`.

### ❌ Before (abbreviated)
```tsx
{forgotOpen && (
  <div style={{ position: 'fixed', inset: 0, zIndex: 200, ... }}>
    <div onClick={() => setForgotOpen(false)} style={{ inset: 0, background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(12px)' }} />
    <div style={{ background: '#fff', borderRadius: 24, padding: '32px 28px 28px', width: 420, boxShadow: '...' }}>
      {forgotSentTo ? <SuccessView /> : <FormView />}
    </div>
  </div>
)}
```

### ✅ After
```tsx
<Modal
  open={forgotOpen}
  onClose={() => !forgotSubmitting && setForgotOpen(false)}
  title={forgotSentTo ? 'Check your email' : 'Reset your password'}
  subtitle={forgotSentTo ? undefined : "Enter the email associated with your account and we'll send you a link to set a new password."}
  size="sm"
  lockOutside={forgotSubmitting}
>
  {forgotSentTo ? (
    <>
      <p style={{ fontSize: 14, color: 'var(--text-body)', lineHeight: 1.5 }}>
        If an account exists for <strong>{forgotSentTo}</strong>,
        we sent a password reset link. Click the link in the email to set a new password.
      </p>
      <ModalFooter>
        <Button $variant="primary" $size="lg" $fullWidth
          onClick={() => { setForgotOpen(false); setForgotSentTo(null); setForgotEmail(''); }}>
          Done
        </Button>
      </ModalFooter>
    </>
  ) : (
    <form onSubmit={handleForgotSubmit}>
      <GradientBanner $tone="indigo" $inline style={{ marginBottom: 14 }}>
        <BannerBody>
          Signed up with Google? You don't have a password — just click{' '}
          <Button $variant="link" $size="xs" type="button"
            onClick={() => { setForgotOpen(false); auth.loginWithGoogle(); }}>
            Continue with Google
          </Button>{' '}on the login page.
        </BannerBody>
      </GradientBanner>
      
      {forgotError && <ErrorText>{forgotError}</ErrorText>}
      
      <Input
        type="email" autoFocus autoComplete="email"
        placeholder="you@example.com"
        value={forgotEmail}
        onChange={e => setForgotEmail(e.target.value)}
      />
      
      <ModalFooter>
        <Button $variant="outline" $size="lg" type="button"
          onClick={() => setForgotOpen(false)} disabled={forgotSubmitting}>
          Cancel
        </Button>
        <Button $variant="primary" $size="lg" type="submit" disabled={forgotSubmitting}>
          {forgotSubmitting ? 'Sending…' : 'Send reset link'}
        </Button>
      </ModalFooter>
    </form>
  )}
</Modal>
```

**Note:** Move `handleForgotSubmit` out to a named function above render for readability.

---

## 5. Main form buttons — swap in place

### Submit button (line 790)
`<SubmitBtn type="submit" disabled={...}>` → `<Button $variant="primary" $size="xl" $fullWidth type="submit" disabled={...}>`

### Social button (line 801)
`<SocialBtn onClick={...}>` → `<Button $variant="outline" $size="xl" $fullWidth onClick={...}>`

### Link button in BottomText (lines 810, 811)
`<LinkBtn onClick={...}>` → `<Button $variant="link" $size="sm" onClick={...}>`

### Forgot password link
`<ForgotLink onClick={...}>` → `<Button $variant="ghost" $size="sm" style={{ alignSelf: 'flex-end' }} onClick={...}>`

---

## 6. Hardcoded colors → theme tokens

Search in file and replace all occurrences:

| Hex | → | Theme token |
|---|---|---|
| `#1F1F1F` | → | `theme.colors.text.primary` (in styled) |
| `#999` | → | `theme.colors.text.hint` |
| `#555` | → | `theme.colors.text.body` |
| `#666` | → | `theme.colors.text.body` |
| `#777` | → | `theme.colors.text.subtle` |
| `#333` | → | keep as hover variant OR `theme.colors.text.primary` |
| `#DC2828` | → | `theme.colors.destructive` |
| `#16A34A` | → | `theme.colors.success` |
| `#6366F1` | → | `theme.colors.brand.indigo` |
| `#FAFAFA` | → | `theme.colors.background.surfaceAlt` |
| `#F5F5F5` | → | `theme.colors.background.surfaceMuted` |
| `rgba(0,0,0,0.06)` | → | `theme.colors.border.light` |
| `rgba(0,0,0,0.1)` | → | `theme.colors.border.medium` |

**Total color replacements:** ~18-20 hex codes in inline styles throughout the file.

---

## 7. Hardcoded radii → theme tokens (done in Phase 2 but double-check)

Inline `borderRadius: 10` / `12` / `16` — these should now reference `theme.radii.sm|md|lg`. Check after Phase 2 merged.

---

## 8. Tidy up — remove unused imports

After all swaps:
- Remove `KeyRound` from lucide imports (not used anywhere after migration)
- Check `humaniseError`, `getPasswordChecks`, `PasswordCheck` type remain (still used)

---

## 9. Verification

```bash
npm run check    # lint + typecheck + test — must pass
npm run dev
```

### Visual QA checklist (walk through each state)

- [ ] `/login` — default login form renders
- [ ] Toggle to signup mode — all inputs appear, requirements list renders
- [ ] Type password → live requirement checkmarks (green/gray)
- [ ] Submit with wrong password → error banner appears
- [ ] Try login with invalid creds → Google hint banner appears
- [ ] Click "Forgot password?" → modal opens
- [ ] Modal ESC key closes
- [ ] Modal overlay click closes
- [ ] Submit reset form → success state shows "Check your email"
- [ ] Google button — hover state smooth, radius/spacing match other buttons
- [ ] Mobile viewport (375px) — form fits, no horizontal scroll
- [ ] `/login?deleted=1` — "Account deleted" sage banner renders
- [ ] Sign in with working creds → redirects to /studio
- [ ] Visit `/login` while signed in → "Already signed in" card shows with avatar
- [ ] Signup flow → "Check your email" confirm view renders
- [ ] Resend email button — works, countdown starts at 60s

### Things to check visually

- Dark/Light theme compatibility
- Button heights match each other (XL = 48px everywhere)
- Input focus ring matches submit button radius
- No layout shift when toggling signup/login
- Google logo still renders correctly in new `<Button $variant="outline">`

---

## 10. Commit & PR

```bash
git add -A
git commit -m "refactor(login): migrate LoginPage to shared components

- Replace SubmitBtn, SocialBtn, LinkBtn, ForgotLink, PrimaryBtn, SecondaryBtn, ResendBtn with Button variants
- Replace forgot-password overlay with Modal component
- Replace inline amber/green/indigo banners with GradientBanner
- Replace SignedInCard with Card variant=outlined
- Migrate all hardcoded colors to theme.colors.* tokens
- File size: 918 → ~580 lines (-37%)"
git push -u origin migrate-login
```

Create PR to `design-experiment`. Tag with labels: `refactor`, `design-system`, `phase-3`.

---

## Expected file size reduction

- **Before:** 918 lines, 32.4 KB
- **After:** ~580 lines, ~20 KB
- **Savings:** ~340 lines removed (styled definitions + inline duplicates)

## Red flags during review

- ❌ Any `style={{ ... }}` blocks with more than 3 properties — pull into styled component
- ❌ Any hex color remaining in the file — audit again
- ❌ Any `box-shadow` outside `theme.shadows.*` — fix
- ❌ Any button with `<button>` instead of `<Button>` — fix
- ❌ Modal JSX not using `<Modal>` — something went wrong
- ❌ File still over 700 lines — probably kept dead code
