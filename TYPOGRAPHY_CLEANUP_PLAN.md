# Typography Cleanup Plan — FINAL

Branch: `typography-cleanup` off `design-experiment`. Apply as ONE commit.

---

## 1. Font Size — target 9-step scale

| Token | Size | Use case |
|---|---|---|
| `micro` | **11px** | Uppercase badges, Pro pills |
| `xs` | **12px** | Captions, hints |
| `sm` | **13px** | Muted body, sm buttons (most used, 128x) |
| `base` | **14px** | Default body, lg buttons |
| `lg` | **16px** | Card title, nav items |
| `xl` | **18px** | Modal title, section headline |
| `2xl` | **22px** | Section title |
| `3xl` | **28px** | Page title |
| `hero` | **40px** | Landing hero |
| `heroXl` | **56px** | Mega landing hero |

### ⚠️ SKIP these lines in `HeroSectionV2.tsx` (intentional mini-widget previews)

Lines **408, 415, 427, 435, 491, 511, 577, 590, 605, 619** — these are 8-10.5px badges inside the hero widget mockup. Keep as-is.

### Font-size replacements

| From | To | Count | Files |
|---|---|---|---|
| 15px | 14px | 26 | DesignSystemPage, LegalPage, LoginPage, PrivacyPage, RefundPage, ResetPasswordPage, SettingsPage, SignupPage, StudioPage, TermsPage, TemplateDetailPage, TemplatesPage + HeroSection, HowItWorksSection, WidgetStudioSection, Sidebar, DashboardViews |
| 10px | 11px | 11 | DesignSystemPage (3), StudioPage, TemplatesPage, DashboardViews, HeroSectionV2 (2)*, LayoutCheck, TopNav +1 |
| 36px | 40px | 8 | WidgetStudioPage (3), FeatureCardsSection, HowItWorksSection, TemplatesGallery, TestimonialsSection, WidgetStudioSection |
| 17px | 16px | 7 | LegalPage, PrivacyPage, RefundPage, TermsPage, DashboardViews, BigFooter, StylePickerPanel |
| 12.5px | 12px | 6 | DesignSystemPage (3), SettingsPage, HeroSection (2) |
| 9.5px | 11px | 4 | DesignSystemPage +HeroSectionV2 (3) — **SKIP HeroSectionV2** |
| 26px | 28px | 4 | SettingsPage, TemplateDetailPage, TemplatesPage, VerifyEmailPage |
| 32px | 28px | 3 | TemplateDetailPage, TemplatesPage, CTASection |
| 9px | 11px | 3 | HeroSectionV2 (3) — **SKIP ALL** |
| 24px | 22px | 2 | CheckoutPage, DashboardViews |
| 20px | 18px | 2 | SettingsPage, StudioPage |
| 15.5px | 14px | 2 | WidgetStudioPage, HeroSectionV2 |
| 42px | 40px | 2 | WidgetStudioPage, CTASection |
| 11.5px | 12px | 1 | DesignSystemPage |
| 68px | 56px | 1 | HeroSection |
| 54px | 56px | 1 | HeroSection |
| 38px | 40px | 1 | HeroSection |
| 19px | 16px | 1 | HeroSection |
| 14.5px | 14px | 1 | HeroSectionV2 |
| 10.5px | 11px | 1 | HeroSectionV2 — **SKIP** |
| 8px | 11px | 1 | HeroSectionV2 — **SKIP** |
| **TOTAL (after skips)** | | **~78** | |

---

## 2. Font Weight — no changes

All 4 weights are legitimate:
- **400** (18x) — body
- **500** (115x) — medium emphasis
- **600** (155x) — headings, CTAs
- **700** (13x) — UPPERCASE labels in badges, hero numbers (TopNav, Badges, DesignSystemPage, StudioPage, WidgetStudioPage, HeroSectionV2)

---

## 3. Letter-Spacing — keep 6 values

Keep: `-0.03em` (hero) · `-0.02em` (headings) · `-0.01em` (body tight) · `-0.005em` (nav) · `0.02em` (medium wide) · `0.06em` (uppercase)

### Letter-spacing replacements (28 total)

| From | To | Count |
|---|---|---|
| 0.04em | 0.06em | 11 |
| 0.08em | 0.06em | 4 |
| -0.035em | -0.03em | 4 |
| -0.04em | -0.03em | 3 |
| 0.03em | 0.02em | 2 |
| -0.015em | -0.01em | 1 |
| 0.05em | 0.06em | 1 |
| -0.012em | -0.01em | 1 |
| 0.1em | 0.06em | 1 |
| **TOTAL** | | **28** |

---

## 4. Line-Height — keep 4 values

Keep: `1` (tight UPPERCASE) · `1.2` (headings) · `1.5` (body) · `1.65` (long-form)

**No integer bugs found** — all line-height values are either ratios or have `px` units.

### Line-height replacements (35 total)

| From | To | Count |
|---|---|---|
| 1.55 | 1.5 | 8 |
| 1.45 | 1.5 | 5 |
| 1.05 | 1 | 4 |
| 1.72 | 1.65 | 4 |
| 1.6 | 1.65 | 4 |
| 1.7 | 1.65 | 3 |
| 1.4 | 1.5 | 2 |
| 1.12 | 1.2 | 2 |
| 1.15 | 1.2 | 2 |
| 1.16 | 1.2 | 1 |
| **TOTAL** | | **35** |

---

## Summary

| Category | Replacements |
|---|---|
| Font-size | **~78** (after HeroSectionV2 skips) |
| Letter-spacing | **28** |
| Line-height | **35** |
| Font-weight | 0 |
| **Grand total** | **~141 line changes** across ~30 files |

### Execution steps (for Claude Code)

1. `git checkout design-experiment && git pull`
2. `git checkout -b typography-cleanup`
3. Apply font-size replacements — **SKIP** `HeroSectionV2.tsx` lines 408, 415, 427, 435, 491, 511, 577, 590, 605, 619
4. Apply letter-spacing replacements
5. Apply line-height replacements
6. `npm run check` — lint + typecheck + test must all pass
7. `npm run dev` → manual visual QA:
   - LandingPage (hero sizes changed)
   - StudioPage (10→11 badges)
   - LoginPage, SettingsPage, TemplatesPage (15→14 body)
   - Legal/Privacy/Refund/Terms (15→14, 17→16)
   - DesignSystemPage (many tokens demo'd there)
8. Commit: `refactor(ds): snap typography to 9-step scale`
9. Push + create PR to `design-experiment`
