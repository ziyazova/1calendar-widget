# Phase 3 — Page Migrations

Execute **in order**. One PR per file, all targeting `design-experiment`.

| # | Page | Plan | Risk | Est. |
|---|------|------|------|------|
| 3.1 | LoginPage | `LOGIN_MIGRATION.md` | 🟡 | 2h |
| 3.2a | VerifyEmailPage | `VERIFYEMAIL_MIGRATION.md` | 🟢 | 30m |
| 3.2b | ResetPasswordPage | `RESETPASSWORD_MIGRATION.md` | 🟡 | 1h |
| 3.3 | TemplatesPage | `TEMPLATES_MIGRATION.md` | 🟡 | 1h |
| 3.4 | TemplateDetailPage | `TEMPLATEDETAIL_MIGRATION.md` | 🟠 | 3h |
| 3.5 | CheckoutPage | `CHECKOUT_MIGRATION.md` | 🟠 | 2h |
| 3.6 | SettingsPage | `SETTINGS_MIGRATION.md` | 🔴 | 4-6h |
| 3.7 | DesignSystemPage | *(separate strategy — likely rewrite)* | ⚠️ | TBD |
| 3.8 | LandingPage | *(trivial, plan on demand)* | 🟢 | 30m |
| 3.9 | StudioPage | *(separate strategy + design review)* | 🔴 | 1d |

**Before each:** pull latest `design-experiment`, check Phase 1 (typography) and Phase 2 (radii+brand) are merged.

**Commit pattern:** `refactor(<page>): migrate to shared components`

**After all 9 pages merged:** Phase 4 — ESLint guardrails + final audit.
