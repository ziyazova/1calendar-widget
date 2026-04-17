# Authentication — flows and edge cases

This document describes every auth flow in Peachy Studio, the UI states they
produce, and how we handle common edge cases. Use it as the source of truth
when debugging auth issues.

## Providers

| Provider | Where | Notes |
|---|---|---|
| **Email + password** | Supabase Auth | Requires email confirmation (mailer_autoconfirm is OFF) |
| **Google OAuth** | Supabase Auth → Google | No password is created for the user |
| **Guest code** (`PEACHY2026`) | Client-side only | LocalStorage flag; never touches Supabase |

## Primary user journeys

### A. Brand-new user signs up with email

1. User enters email on `/widgets` hero input.
2. `WidgetStudioPage.handleCodeEntry` detects it looks like an email and
   navigates to `/login` with `state: { email, signup: true }`.
3. `LoginPage` opens in **Sign up** mode with email prefilled.
4. User types name + password + **confirm password**. A live checklist
   under the password field shows: 8+ chars, contains a letter, contains
   a number, **passwords match**. The submit button is disabled until all
   four are satisfied. The confirm-password field protects against typos
   that would otherwise lock the user out until they completed a reset.
5. On submit → `auth.register(name, email, password)` → `supabase.auth.signUp`.
6. If Supabase returns `{ user, session: null }` (email confirmation required),
   `LoginPage` flips to the **"Check your email"** view with a Resend button
   (60-second throttle).
7. User clicks the confirmation link in the email → Supabase redirects to
   `{origin}/verify-email` (we pass `emailRedirectTo` explicitly in the
   `signUp` and `resend` calls so the callback lands on a page we own,
   not on `/`).
8. `VerifyEmailPage` reads the URL hash:
   - Success hash (`type=signup&access_token=…`) → Supabase client
     auto-parses it, creates the session, and the page shows **"Email
     confirmed"** with a *Go to Studio* button.
   - Error hash (`error_code=otp_expired` / `error=access_denied`) → the
     page shows **"Link expired"** with a *Back to sign-in* button. No
     silent "nothing happened" state.
   - Neither after 2s (e.g. a user typed `/verify-email` directly) →
     redirects to `/login`.
9. **Supabase dashboard config:** `{origin}/verify-email` must be in the
   project's Allowed Redirect URLs list (Auth → URL Configuration) for
   each environment. Currently added for the production domain; add the
   local dev URL (`http://localhost:5173/verify-email`) when needed.

### B. Existing user logs in with email

1. User lands on `/login`, types email + password, submits.
2. `auth.login(email, password)` → `supabase.auth.signInWithPassword`.
3. On success → redirect to `/studio`.
4. On failure:
   - `"Invalid login credentials"` → friendly error +
     **Google hint** shown: "Did you sign up with Google? Try Continue with Google".
   - `"Email not confirmed"` → friendly error telling the user to check inbox.

### C. Google OAuth login

1. User clicks **Continue with Google** on `/login` or `/widgets`.
2. `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })`.
3. Supabase redirects to Google, user authenticates, Google redirects back.
4. Supabase handles the callback, creates a session, fires
   `onAuthStateChange` → our `AuthContext` updates and redirects to `/studio`.

### D. Forgot password

1. On `/login` user clicks **Forgot password?**.
2. A modal opens with an email field.
3. Submit → `auth.sendPasswordReset(email)` →
   `supabase.auth.resetPasswordForEmail(email, { redirectTo: origin + '/reset-password' })`.
4. User clicks the link in the email → lands on `/reset-password`.
5. Supabase automatically parses the recovery token from the URL hash (via
   `detectSessionInUrl`) and fires a `PASSWORD_RECOVERY` event. The page
   waits for the event (or an existing session) before rendering the form.
6. User enters a new password with a live checklist. On submit →
   `auth.updatePassword(newPassword)` → `supabase.auth.updateUser({ password })`.
7. On success the page calls `auth.logoutOthers()` (`signOut({ scope: 'others' })`)
   so any session on another device — for example the attacker who forced
   the reset — loses its refresh token immediately. The current device
   keeps its session.
8. Success screen → "Go to login".

### E. Change password (signed-in user)

1. Go to `/settings` → **Security** section.
2. Click **Change password** (or **Set a password** for Google-only accounts).
3. Modal opens with three fields and a live checklist:
   - **Current password** — only for users who already have a password
     (`hasPasswordLogin`). Google-only users are *setting* a password for
     the first time; there is nothing to verify.
   - **New password** + **Confirm new password**.
4. Submit →
   a. If `hasPasswordLogin`, `auth.verifyPassword(currentPw)` →
      `supabase.auth.signInWithPassword`. If it fails, show "Current
      password is incorrect." This blocks session-hijack takeovers where
      the attacker does not know the password.
   b. `auth.updatePassword(newPassword)` → `supabase.auth.updateUser({ password })`.
   c. `auth.logoutOthers()` — revokes refresh tokens on other devices.
5. Success screen.

### G. Change email (signed-in user)

1. `/settings` → **Security** → **Change email**. The button is disabled
   for Google-only users with the hint "Set a password first — we require
   it to verify email changes." (Without a known password we can't
   reliably re-auth, so we don't expose the flow.)
2. Step 1 — **Verify your password.** Modal asks for the current password
   and calls `verifyPassword(currentPw)`. Wrong password → "Current
   password is incorrect."
3. Step 2 — **New email address.** User types the new address. Basic
   client-side validation (`@` + `.`, not equal to the current email).
4. Submit → `auth.updateEmail(newAddress)` → `supabase.auth.updateUser({ email })`.
   Supabase sends a confirmation link to the NEW address (and, if
   "Secure email change" is enabled in Supabase Auth settings, to the
   OLD one as well). The email on the `auth.users` row does **not**
   change until the user clicks the link.
5. Step 3 — **"We sent a confirmation link to …"** confirmation screen.
   The user's current email stays until they click the link in the new
   inbox.

### F. Account deletion

This is a **hard delete** with immediate effect. No soft delete / grace period
/ recovery — once the user confirms, the Postgres row is gone.

1. `/settings` → **Danger zone** → **Delete account**.
2. Modal requires the user to type the word `delete`.
3. Submit → `AccountService.deleteOwnAccount()` → `supabase.rpc('delete_own_user')`.
4. The Postgres function (SECURITY DEFINER) deletes `auth.users`; the
   `widgets` rows cascade-delete via the foreign key.
5. The client:
   - Calls `supabase.auth.signOut()` to clear the stale JWT.
   - Wipes all `peachy_*` and `sb-*` keys from `localStorage` so a different
     Google account signing in on this device does not inherit cart / guest flag
     / cached filters from the deleted user.
   - Sets `sessionStorage.peachy_account_deleted = '1'`.
6. Redirects to `/login?deleted=1`.
7. `LoginPage` reads the query param, shows a green "Your account has been
   deleted" banner, and strips the param from the URL so it doesn't repeat
   on refresh.
8. If the user then clicks **Continue with Google**, `AuthContext.loginWithGoogle`
   sees the `peachy_account_deleted` flag in sessionStorage and passes
   `prompt=select_account` to Google's OAuth endpoint. This forces Google to
   show the account chooser instead of silently re-authenticating — otherwise
   the user would appear to land back on `/studio` instantly, which feels as
   if the deletion never happened.

## Edge cases and how they are handled

### A user signed up with Google, tries to log in with email

They have no password. `supabase.auth.signInWithPassword` returns "Invalid
login credentials". The login form shows the **Google hint** card suggesting
they use **Continue with Google**.

If they want an email password too, they can sign in with Google, go to
`/settings → Security → Set a password`. The Security section detects this
case via `supabaseUser.identities` and relabels the button accordingly.

### A user signed up with email, tries to log in with Google

Works transparently. Supabase links identities by email if **Allow linking
of identities** is enabled in Supabase Auth settings. Their email+password
continues to work alongside Google.

### A user is already signed in and lands on `/login`

`LoginPage` detects `auth.isRegistered === true` and renders a
**"You're already signed in"** card with buttons "Go to Studio" and
"Log out". We never silently redirect — this was the source of the
confusing behaviour reported when email signup appeared to "do nothing"
while a Google session was still active.

### A user loses the confirmation email

On the "Check your email" view there is a **Resend email** button with a
60-second countdown to avoid Supabase rate limits. The button calls
`auth.resendConfirmation(email)` → `supabase.auth.resend({ type: 'signup' })`.

### A user pastes the wrong reset-password link (or one that expired)

`ResetPasswordPage` waits up to 1.2 s for a `PASSWORD_RECOVERY` or
`SIGNED_IN` event. If none fires, it shows the **"Link expired"** card
with a button back to `/login` where they can request a new reset email.

### A user deletes their account while still holding a stale JWT

The RPC `delete_own_user` runs inside Postgres as an elevated function,
removes the `auth.users` row, and cascades the widget rows. The subsequent
`supabase.auth.signOut()` may 401 because the JWT is already invalid; we
swallow that error with `try/catch`. The `onAuthStateChange` listener
clears the local session state regardless.

### A user deletes their account and tries to sign in with Google again

Two things happen that can confuse the user, both now mitigated:

1. **Google silently re-authenticates.** The browser is still signed in at
   google.com, so OAuth would normally round-trip without any visible
   "choose account" step. We set `sessionStorage.peachy_account_deleted`
   during delete and pass `prompt=select_account` on the next Google login,
   which forces Google to show its account picker.
2. **The new account looks identical to the old one.** Name / email /
   avatar come from Google's profile, not from our DB — so even after a
   real delete the UI looks familiar. Widgets are genuinely gone (cascade
   deleted). The "Your account has been deleted" banner on `/login`
   explicitly tells the user their local data was removed, so a fresh
   Studio state is expected.

## Session storage

- Supabase stores the session JWT in `localStorage` under
  `sb-<project-ref>-auth-token`. We use the default SDK storage; we do
  not configure an alternative storage adapter.
- `AuthContext` subscribes to `supabase.auth.onAuthStateChange` to keep
  React state in sync with the session.

## Rate limits

Supabase enforces (default values, may be raised on Pro):

| Action | Limit |
|---|---|
| `signUp` | 30 per hour per IP |
| `signInWithPassword` | 30 per hour per IP |
| `resetPasswordForEmail` | 1 per 60 s per email |
| `resend` (confirmation) | 1 per 60 s per email |

Our UI throttles Resend with a visible 60-second countdown to avoid hitting
the limit.

## Error mapping

All user-visible errors go through `humaniseError` in `LoginPage`:

| Supabase message | Shown to user |
|---|---|
| "User already registered" | "This email is already in use. Try logging in instead." |
| "Invalid login credentials" | "Email or password is incorrect." |
| "Email not confirmed" | "Please confirm your email first. Check your inbox." |
| "Password should be …" | "Password must be at least 8 characters." |
| Rate-limit error | "Too many attempts. Please wait a minute before trying again." |
| Network error | "Network error. Check your connection and try again." |

Anything else falls back to a generic apology specific to signup or login.

## Files of interest

| File | Purpose |
|---|---|
| `src/presentation/context/AuthContext.tsx` | Unified auth state + actions |
| `src/presentation/pages/LoginPage.tsx` | Sign up / log in / already-signed-in / check-email / forgot-password modal |
| `src/presentation/pages/ResetPasswordPage.tsx` | Handles the recovery link |
| `src/presentation/pages/SettingsPage.tsx` + `DashboardViews.tsx` (ProfileView) | Change password, delete account, data export |
| `src/infrastructure/services/supabase.ts` | Supabase client singleton |
| `src/infrastructure/services/AccountService.ts` | Data export + account delete RPC |
| `supabase/migrations/001_widgets.sql` | Widgets table + RLS + cascade |
| `supabase/migrations/002_delete_own_user.sql` | `delete_own_user()` RPC |

## Manual test checklist

Before shipping any change to auth, run through this list:

- [ ] Sign up with email → confirmation email received → click link → land on `/verify-email` → "Email confirmed" card → *Go to Studio* → `/studio`.
- [ ] Click an old / already-used confirmation link → land on `/verify-email` → "Link expired" card with *Back to sign-in* button.
- [ ] Visit `/verify-email` directly with no hash → after 2s redirect to `/login`.
- [ ] Sign up with email with a weak password → submit is disabled until checklist is green.
- [ ] Sign up with mismatched password + confirm → submit is disabled; "Passwords match" row in the checklist stays grey until both fields are identical.
- [ ] Sign up with an email that already exists → friendly "already in use" error.
- [ ] Log in with wrong password → friendly error + **Google hint** appears.
- [ ] Log in with Google (new user) → lands on `/studio`.
- [ ] Log in with Google (existing email-password user) → lands on `/studio`; later, email+password still works.
- [ ] Forgot password → email arrives → click link → `/reset-password` works.
- [ ] After a successful reset, any session still open on another device is signed out automatically on its next API call (refresh token revoked via `signOut({ scope: 'others' })`).
- [ ] Old reset link → shows "Link expired" card.
- [ ] Change password from Settings → modal requires **Current password** → wrong value shows "Current password is incorrect." → correct value proceeds → success modal → sign out → log in with new password.
- [ ] Change password as a Google-only account → modal does **not** show the "Current password" field, just new+confirm.
- [ ] Change email from Settings → step 1 requires current password → step 2 asks for new email → confirmation screen → click link in new inbox → email on `auth.users` updated.
- [ ] Change email button is disabled for Google-only accounts with tooltip "Set a password first so we can verify email changes."
- [ ] Load `/login` with `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` missing → orange "Auth is not configured" banner is visible above the form.
- [ ] `/settings → Download my data` → JSON file includes profile + all widgets.
- [ ] `/settings → Delete account → type "delete"` → user gone from Supabase `auth.users`, widgets cascade-deleted.
- [ ] After delete → redirected to `/login?deleted=1` → green "Your account has been deleted" banner visible.
- [ ] After delete → click Continue with Google → Google shows account chooser (`prompt=select_account`), not a silent redirect to `/studio`.
- [ ] After delete → localStorage has no remaining `peachy_*` or `sb-*` keys.
- [ ] Forgot password modal shows "Signed up with Google? You don't have a password" hint.
- [ ] Set password for a Google-only account → friendly error messages on weak / rate-limited / reauthentication errors (not raw Supabase text).
- [ ] Land on `/login` while already signed in → "You're already signed in" card appears, not a silent redirect. If the account has a Google `avatar_url`, the card shows the photo instead of initials.
- [ ] Save a new name in `/settings → Profile` with the network offline → inline red error appears, "Saved" label does **not** flash.
- [ ] While signed in, paste `PEACHY2026` into the `/widgets` hero input → guest mode is **not** activated (the registered session wins); nothing flips to guest in localStorage.

## Roadmap — gaps vs the best-practice spec

The current implementation is a working MVP. The following items from the
full auth-flow spec are **not yet built**; they should be considered for the
next iteration, roughly in priority order:

### High priority (security / data safety)
- **Soft delete with 30-day grace period.** Today's delete is irreversible.
  Add `profiles.deletion_scheduled_at`, route signed-in users with a scheduled
  deletion to `/account/recover`, and hard-delete via a daily cron using the
  Service Role key.
- ~~**Sign out other sessions after password change / reset.**~~ ✅ Done.
  `signOut({ scope: 'others' })` is called both from the Settings password
  modal (`SettingsPage.tsx`) and the recovery flow (`ResetPasswordPage.tsx`).
- ~~**Verify current password before changing it.**~~ ✅ Done.
  `auth.verifyPassword(currentPw)` (re-auth via `signInWithPassword`) runs
  before `updatePassword` in the Settings modal, and before `updateEmail`
  in the Change-email flow. Does not apply when setting a password for
  the first time on a Google-only account.
- **Post-reset / post-change notification email.** Supabase does not send
  one by default. Needs an Edge Function / `auth.users` trigger — backend
  work, not client.

### Medium priority (UX completeness)
- ~~**Change email flow.**~~ ✅ Done. Two-step modal in
  `/settings → Security → Change email`: verify current password →
  new-email input → `updateUser({ email })` → confirmation screen.
  Disabled for Google-only users (no password to verify with).
- ~~**Expired / invalid verification link handling.**~~ ✅ Done.
  `VerifyEmailPage` (`/verify-email`) parses the `error_code=otp_expired`
  / `error=access_denied` hash params and shows a dedicated "Link expired"
  card instead of dumping the user onto the marketing page with an
  unparseable hash.
- **Unverified-email banner.** `user.email_confirmed_at === null` is never
  checked in the app — email users who haven't confirmed still get full
  Studio access.
- ~~**Enumeration-safe reset copy.**~~ ✅ Already in place — the
  forgot-password success card uses the "*If an account exists for
  {email}, we sent a password reset link*" phrasing, which echoes the
  user's own input rather than confirming whether the email is in the
  database.

### Low priority (nice-to-have)
- **Link / unlink Google** from Settings (`auth.linkIdentity` /
  `unlinkIdentity`). Useful for users who want to add Google to an
  email-password account.
- **"Sign out of all other devices"** button
  (`signOut({ scope: 'others' })`).
- **Password-breach check** (e.g. HaveIBeenPwned k-anonymity API) at signup.
- **Suspicious sign-in notification email** (new country / new device).

### Explicitly out of scope for now
- Per-session list / selective revocation (requires Admin API and a custom
  sessions table — overkill for this app).
- Active sessions management UI.
