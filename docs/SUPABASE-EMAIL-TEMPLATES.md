# Supabase email templates for Peachy Studio

Paste the HTML below into **Supabase Dashboard → Authentication →
Email Templates** for each template type. These replace the plain
default emails with something that looks like a real Peachy email.

> The sender address will remain `noreply@mail.app.supabase.io` on
> the Free plan. To change it to `hello@peachyplanner.com` (or similar),
> upgrade to Supabase Pro and configure custom SMTP (for example Resend
> or SendGrid) under **Settings → Auth → SMTP**.

Supabase template variables we use:

| Variable | Meaning |
|---|---|
| `{{ .ConfirmationURL }}` | Link the user should click |
| `{{ .Email }}` | The recipient's email address |
| `{{ .SiteURL }}` | Site URL from project settings |

---

## 1. Confirm signup

**Subject:**
```
Confirm your email for Peachy Studio
```

**Body (HTML):**
```html
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F7F7F5;font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;color:#1F1F1F;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding:40px 20px;">
      <tr><td align="center">
        <table width="520" cellpadding="0" cellspacing="0" role="presentation" style="max-width:520px;width:100%;background:#ffffff;border-radius:20px;padding:40px 36px;box-shadow:0 4px 24px rgba(0,0,0,0.04);">
          <tr><td style="padding-bottom:20px;">
            <div style="font-size:22px;font-weight:600;letter-spacing:-0.02em;color:#1F1F1F;">
              🍑 Peachy Studio
            </div>
          </td></tr>
          <tr><td style="padding-bottom:24px;">
            <h1 style="margin:0 0 12px;font-size:24px;font-weight:600;letter-spacing:-0.03em;line-height:1.2;color:#1F1F1F;">
              Confirm your email
            </h1>
            <p style="margin:0;font-size:15px;line-height:1.6;color:#555;">
              Welcome to Peachy Studio. Tap the button below to confirm your email
              address and activate your account.
            </p>
          </td></tr>
          <tr><td align="center" style="padding:8px 0 28px;">
            <a href="{{ .ConfirmationURL }}"
              style="display:inline-block;background:#1F1F1F;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 28px;border-radius:12px;letter-spacing:-0.01em;">
              Confirm email
            </a>
          </td></tr>
          <tr><td style="padding-bottom:20px;">
            <p style="margin:0;font-size:13px;line-height:1.6;color:#999;">
              Or paste this link into your browser:<br>
              <a href="{{ .ConfirmationURL }}" style="color:#6366F1;word-break:break-all;">{{ .ConfirmationURL }}</a>
            </p>
          </td></tr>
          <tr><td style="padding-top:20px;border-top:1px solid rgba(0,0,0,0.06);">
            <p style="margin:0;font-size:12px;line-height:1.6;color:#bbb;">
              If you didn't create an account with Peachy Studio, you can safely ignore this email.
            </p>
          </td></tr>
        </table>
        <div style="margin-top:20px;font-size:11px;color:#bbb;">
          Peachy Studio · Stockholm, Sweden
        </div>
      </td></tr>
    </table>
  </body>
</html>
```

---

## 2. Reset password

**Subject:**
```
Reset your Peachy password
```

**Body (HTML):**
```html
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F7F7F5;font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;color:#1F1F1F;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding:40px 20px;">
      <tr><td align="center">
        <table width="520" cellpadding="0" cellspacing="0" role="presentation" style="max-width:520px;width:100%;background:#ffffff;border-radius:20px;padding:40px 36px;box-shadow:0 4px 24px rgba(0,0,0,0.04);">
          <tr><td style="padding-bottom:20px;">
            <div style="font-size:22px;font-weight:600;letter-spacing:-0.02em;color:#1F1F1F;">
              🍑 Peachy Studio
            </div>
          </td></tr>
          <tr><td style="padding-bottom:24px;">
            <h1 style="margin:0 0 12px;font-size:24px;font-weight:600;letter-spacing:-0.03em;line-height:1.2;color:#1F1F1F;">
              Reset your password
            </h1>
            <p style="margin:0;font-size:15px;line-height:1.6;color:#555;">
              We received a request to reset the password for the Peachy account
              associated with <strong>{{ .Email }}</strong>. Tap the button below
              to choose a new password.
            </p>
          </td></tr>
          <tr><td align="center" style="padding:8px 0 28px;">
            <a href="{{ .ConfirmationURL }}"
              style="display:inline-block;background:#1F1F1F;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 28px;border-radius:12px;letter-spacing:-0.01em;">
              Set a new password
            </a>
          </td></tr>
          <tr><td style="padding-bottom:20px;">
            <p style="margin:0;font-size:13px;line-height:1.6;color:#999;">
              Or paste this link into your browser:<br>
              <a href="{{ .ConfirmationURL }}" style="color:#6366F1;word-break:break-all;">{{ .ConfirmationURL }}</a>
            </p>
          </td></tr>
          <tr><td style="padding-top:20px;border-top:1px solid rgba(0,0,0,0.06);">
            <p style="margin:0;font-size:12px;line-height:1.6;color:#bbb;">
              This link will expire in 1 hour for your security. If you didn't ask to
              reset your password, you can safely ignore this email.
            </p>
          </td></tr>
        </table>
        <div style="margin-top:20px;font-size:11px;color:#bbb;">
          Peachy Studio · Stockholm, Sweden
        </div>
      </td></tr>
    </table>
  </body>
</html>
```

---

## 3. Magic Link (optional — only if you enable it later)

**Subject:**
```
Your Peachy sign-in link
```

**Body (HTML):**
```html
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F7F7F5;font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;color:#1F1F1F;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding:40px 20px;">
      <tr><td align="center">
        <table width="520" cellpadding="0" cellspacing="0" role="presentation" style="max-width:520px;width:100%;background:#ffffff;border-radius:20px;padding:40px 36px;box-shadow:0 4px 24px rgba(0,0,0,0.04);">
          <tr><td style="padding-bottom:20px;">
            <div style="font-size:22px;font-weight:600;letter-spacing:-0.02em;color:#1F1F1F;">
              🍑 Peachy Studio
            </div>
          </td></tr>
          <tr><td style="padding-bottom:24px;">
            <h1 style="margin:0 0 12px;font-size:24px;font-weight:600;letter-spacing:-0.03em;line-height:1.2;color:#1F1F1F;">
              Sign in to Peachy
            </h1>
            <p style="margin:0;font-size:15px;line-height:1.6;color:#555;">
              Click the button below to sign in. The link is valid for one hour
              and can be used only once.
            </p>
          </td></tr>
          <tr><td align="center" style="padding:8px 0 28px;">
            <a href="{{ .ConfirmationURL }}"
              style="display:inline-block;background:#1F1F1F;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 28px;border-radius:12px;letter-spacing:-0.01em;">
              Sign in
            </a>
          </td></tr>
          <tr><td style="padding-top:20px;border-top:1px solid rgba(0,0,0,0.06);">
            <p style="margin:0;font-size:12px;line-height:1.6;color:#bbb;">
              If you didn't request this link, you can safely ignore this email.
            </p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>
```

---

## How to apply

1. Open the [Supabase dashboard](https://supabase.com/dashboard).
2. Select the **peachyplanner** project.
3. Left sidebar → **Authentication** → **Email Templates**.
4. For each template above:
   - Paste the **Subject** into the "Subject" field.
   - Paste the **HTML body** into the message body (switch to HTML source view if the editor allows).
   - Click **Save changes**.
5. Send yourself a test by signing up a dummy account — the new emails
   should arrive within a minute.

## Site URL and redirect URLs

While you're in the dashboard, also double-check:

- **Authentication → URL Configuration → Site URL:**
  `https://peachyplanner.vercel.app`
- **Redirect URLs** (one per line):
  ```
  https://peachyplanner.vercel.app/**
  http://localhost:5173/**
  http://localhost:5175/**
  ```

This ensures reset-password and confirmation links come back to the
right domain no matter where you are working from.
