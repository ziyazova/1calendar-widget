---
version: alpha
name: Peachy Studio
description: Client-side widget studio for embeddable Notion widgets — Apple-inspired calm, Notion-adjacent restraint, peach accent on the brand mark.

colors:
  primary: "#1F1F1F"
  primary-inverse: "#FFFFFF"
  accent: "#6366F1"
  accent-light: "#818CF8"
  accent-dark: "#4F46E5"
  slate: "#4A5568"
  slate-dark: "#3A4558"
  success: "#10B981"
  danger: "#DC2828"
  danger-soft: "#B85757"
  warning: "#F59E0B"
  neutral-page: "#FFFFFF"
  neutral-elevated: "#FFFFFF"
  neutral-surface: "#F2F2F7"
  neutral-surface-alt: "#FAFAFA"
  neutral-surface-muted: "#F5F5F5"
  neutral-surface-cool: "#F8F8F7"
  text-primary: "#1F1F1F"
  text-secondary: "#3C3C43"
  text-tertiary: "#8E8E93"
  text-body: "#555555"
  text-subtle: "#999999"
  text-muted: "#C7C7CC"
  border-light: "rgba(60, 60, 67, 0.08)"
  border-medium: "rgba(60, 60, 67, 0.15)"
  border-subtle: "rgba(0, 0, 0, 0.06)"
  avatar-peach-start: "#FFD4BE"
  avatar-peach-mid: "#FDB8AE"
  avatar-peach-end: "#F8A2B0"

typography:
  h-hero:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.03em
  h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.03em
  h2:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.02em
  h3:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.02em
  h4:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
  label:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0.06em
    textTransform: uppercase

rounded:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  "2xl": 24px
  "3xl": 28px
  pill: 9999px

spacing:
  "0": 0
  "1": 4px
  "2": 8px
  "3": 12px
  "4": 16px
  "5": 20px
  "6": 24px
  "7": 28px
  "8": 32px
  "10": 40px
  "12": 48px
  "16": 64px
  "20": 80px
  "24": 96px

components:
  button.primary:
    background: "linear-gradient(180deg, #2A2A2A 0%, #1F1F1F 100%)"
    color: "{colors.primary-inverse}"
    rounded: "{rounded.md}"
    role: default-dark-cta
  button.accent:
    background: "linear-gradient(135deg, #6366F1 0%, #7079F4 50%, #818CF8 100%)"
    color: "{colors.primary-inverse}"
    rounded: "{rounded.md}"
    role: pro-upgrade-cta
  button.slate:
    background: "linear-gradient(180deg, #4A5568 0%, #3A4558 100%)"
    color: "{colors.primary-inverse}"
    rounded: "{rounded.md}"
    role: editorial-secondary-cta
  button.secondary:
    background: "linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)"
    color: "{colors.text-primary}"
    border: "1px solid {colors.border-light}"
    rounded: "{rounded.md}"
    role: paper-neutral-cta
  button.outline:
    background: transparent
    color: "{colors.text-primary}"
    border: "1px solid {colors.border-medium}"
    rounded: "{rounded.md}"
    role: subtle-cta
  button.ghost:
    background: transparent
    color: "{colors.text-body}"
    rounded: "{rounded.md}"
    role: nav-inline
  button.ghost-danger:
    background: transparent
    color: "{colors.danger}"
    rounded: "{rounded.md}"
    role: destructive-menu-item
  button.danger:
    background: transparent
    color: "{colors.danger-soft}"
    border: "1px solid rgba(184, 87, 87, 0.22)"
    rounded: "{rounded.md}"
    role: reversible-destructive
  button.danger-strong:
    background: transparent
    color: "{colors.danger}"
    border: "1px solid rgba(220, 38, 38, 0.15)"
    rounded: "{rounded.md}"
    role: irreversible-destructive
  button.success:
    background: "{colors.success}"
    color: "{colors.primary-inverse}"
    rounded: "{rounded.md}"
    role: confirm-saved
  filter-chip.rect:
    background: "{colors.neutral-elevated}"
    color: "#6B6B6B"
    border: "1px solid rgba(0, 0, 0, 0.08)"
    rounded: "{rounded.md}"
    role: grouped-filter
  filter-chip.pill:
    rounded: "{rounded.pill}"
    role: airy-filter
  segment.container:
    background: "{colors.neutral-surface-muted}"
    rounded: "{rounded.md}"
    role: tab-switch-outer
  segment.item-active:
    background: "{colors.neutral-elevated}"
    color: "{colors.text-primary}"
    rounded: "{rounded.md}"
    role: tab-switch-active
  avatar.peach:
    background: "linear-gradient(135deg, {colors.avatar-peach-start} 0%, {colors.avatar-peach-mid} 45%, {colors.avatar-peach-end} 100%)"
    color: "{colors.primary-inverse}"
    rounded: "{rounded.pill}"
    role: user-avatar
---

# Peachy Studio

## Overview

Peachy Studio is a client-side widget studio for creating embeddable Calendar, Clock, and Board widgets — primarily for Notion embeds. The brand voice sits in an Apple-inspired / Notion-adjacent calm register: restrained typography, soft neutral surfaces, minimal visual noise. The only warm accent — peach (`#FFD4BE → #FDB8AE → #F8A2B0`) — is reserved for the user avatar and brand mark; everywhere else the accent is indigo (`#6366F1`).

The product feels like a **studio tool**, not a marketing page: density is welcome in the configuration panel, whitespace is generous around preview surfaces. Motion is Apple-spring (`cubic-bezier(0.22, 1, 0.36, 1)`) and restricted to hover lifts, focus rings, and opening dropdowns — never gratuitous.

## Colors

The palette anchors in near-black (#1F1F1F, not pure black) for primary text and dark CTAs, with indigo (#6366F1) as the single systemic accent. Neutrals form a quiet grey ladder — `surface-muted` (#F5F5F5) for pill backgrounds and tab containers, `surface-alt` (#FAFAFA) for card insets, `elevated` (#FFFFFF) for top-level paper surfaces.

- **Primary (#1F1F1F):** soft-black text + the dark button fill. Used for headlines, body-emphasis, and the default CTA gradient. Avoid pure `#000000`.
- **Accent — Indigo (#6366F1 → #818CF8):** the only hue used for interactive emphasis. Pro/Upgrade CTAs, focus rings, selected filters. Never use saturated iOS blue (`#3384F4`) — it reads "Microsoft", not "Peachy".
- **Slate (#4A5568 → #3A4558):** editorial neutral CTA. Replaces blue on `Copy embed` and similar secondary actions — a neutral accent that pairs with primary without competing.
- **Success (#10B981):** confirm states (Saved, Copied). Vibrant emerald, distinct from brand accent.
- **Danger (#DC2828 / soft #B85757):** two strengths. `soft` for reversible destructive (remove from cart, cancel subscription); full `danger` for irreversible (delete account, log out).
- **Neutrals:** five-tier grey ladder — `page`, `elevated`, `surface` (iOS groupedBackground), `surface-alt`, `surface-muted`. Don't introduce new greys — the ladder covers every card, pill, and panel context in the app.
- **Peach avatar gradient:** one-shot brand warmth. Used exclusively on the user avatar (30/38/44px circles in the account pill and dropdown). No other element wears this gradient.

**Canonical source:** `src/presentation/themes/theme.ts` (`colors.*`).

## Typography

Inter (variable) for everything. Hierarchy runs from `label` (11px semibold caps) → `caption` (12px) → `body-sm` (13px) → `body` (14px) → `body-lg` (16px) → `h4` (18) → `h3` (22) → `h2` (26) → `h1` (32) → `h-hero` (40). Negative letter-spacing (`-0.01em` to `-0.03em`) tightens all display sizes.

- **Headlines** use `h1`/`h2` at 600 weight. Landing hero is the only place that uses `h-hero` (40px).
- **Body** uses 14px as the default reading size. Drop to `body-sm` (13px) only in dense UI (sidebars, nav links, button labels inside chrome).
- **Labels** (11px / 600 / 0.06em letter-spacing / uppercase) for tier badges (PRO, NEW, FREE), filter headings, and the `VariantLabel` convention on `/dev/v2`.
- **Button label sizes** come from `buttonSizeTokens`, not from `typography.*` — each button size has its own calibrated label size (sm: 12px, md: 13px, lg/xl: 14px).

**Canonical source:** `src/presentation/themes/theme.ts` (`typography.sizes.*`).

## Layout

4-point spacing grid: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64`. Don't invent intermediate values — if 20px feels too loose and 16px too tight, use 16 with a tighter parent gap; don't introduce 18.

Max widths:
- Landing / marketing: 1200px content area.
- Studio editor: full-width with 300px right-side `CustomizationPanel`.
- Dropdowns: 264px (AccountDropdown), 280–320px (generic).
- Modal: 440px default, 560px large.

Side panels are always 300px on desktop, collapse to bottom-sheet on mobile (see `BottomSheet`).

## Elevation & Depth

Four shadow tiers:

- **cardFlat** (`0 1px 2px rgba(0,0,0,0.02)`) — near-invisible; use on calm flat surfaces inside Settings.
- **card** (`0 2px 12px rgba(0,0,0,0.03)`) — default card elevation.
- **tab** (`0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)`) — the active tile inside `SegmentGroup`.
- **floating** (`0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)`) — dropdowns, popovers.
- **modal** (`0 32px 80px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)`) — centered dialogs.
- **sheet** (`0 -8px 40px rgba(0,0,0,0.1)`) — bottom sheets (mobile).

Filled CTAs (Primary, Accent, Success, Slate) use multi-layer shadows with an inset highlight — Apple-glass depth, not flat material. Ghost / outline variants have no shadow.

**Canonical source:** `src/presentation/themes/theme.ts` (`shadows.*`).

## Shapes

Radius scale: `4 / 8 / 12 / 16 / 20 / 24 / 28 / 9999`.

- `md` (12px) — default for buttons, inputs, pills, small cards.
- `lg` (16px) — cards, dropdowns, account menu.
- `xl` / `2xl` — large surfaces (hero cards, carousel frames).
- `pill` (9999px) — account pill, filter chips with `$shape="pill"`, tier badges.

Segmented controls use nested radii: outer container `md` (12px), active item `md` (12px) — the inset looks right because the item has 4px of padding inside the container.

## Components

**Every CTA goes through `<Button $variant>` from `src/presentation/components/shared/Button.tsx`.** 12 variants, 4 sizes, modifiers (`$fullWidth`, `$pill`, `$iconOnly`). Token source: `buttonTokens.ts` — edit there, all buttons update.

Variant decision tree:
- Dark definitive action → `primary` (Save, Submit, Browse Templates).
- Pro upgrade CTA → `accent` (filled indigo, multi-stop gradient).
- Subtle Pro CTA → `upgrade` (outlined indigo, for inline spots).
- Editorial secondary → `slate` (replaces the old corporate-blue look).
- Cancel / neutral form action → `secondary` (Notion paper gradient + hairline).
- Tertiary or Google sign-in → `outline`.
- Nav / menu / inline → `ghost`.
- Destructive menu row (Log out, Delete) → `ghostDanger`.
- Reversible destructive → `danger` (muted wine outline).
- Irreversible destructive → `dangerStrong` (saturated red outline).
- Confirmation saved → `success`.
- Inline text action → `link` (underline on hover, 1.5px thickness + 3px offset).

**Other shared primitives:**
- `<FilterChip $shape="rect"|"pill">` — selectable filter pill. Source: `filterChipTokens.ts`.
- `<Segment>` + `<SegmentGroup>` — segmented control (tab switch). Source: `segmentTokens.ts`.
- `<AccountPill>` / `<AccountDropdown>` / `<PeachAvatar>` / `<ProPlanRow>` — account menu primitives. Source: `shared/AccountMenu.tsx`.
- `<PlanRing>` + `<PlanUpgradeBar>` — plan usage indicator + upgrade strip.
- `<Modal>` / `<BottomSheet>` — overlays (centered dialog + mobile drawer).
- `<Card $variant>` — unified surfaces (`flat` / `outlined` / `elevated` / `subtle` / `interactive`).

Live preview at route `/dev/v2` — auto-generated from tokens, always in sync with the rest of the app.

## Do's and Don'ts

**Do:**
- Route every CTA through `<Button $variant>`. Raw `<button>` only for non-CTA chrome (carousel arrows, color swatches, inline icons).
- Use `theme.colors.*` tokens for every color reference in `styled` blocks.
- Edit `buttonTokens.ts` / `filterChipTokens.ts` / `segmentTokens.ts` / `theme.ts` to change visual values — the token files are the source of truth. Never override in pages.
- Keep widget internals (`components/widgets/**`) frozen — they're user-customizable content, not design-system surface.
- Snap to the 4-point spacing grid and the 9-step type scale.

**Don't:**
- Inline raw hex in `styled` blocks or `style={{}}`. One exception: brand-specific one-shot values (peach avatar gradient) that live as a named theme token.
- Use saturated iOS blue (`#3384F4`) or its derivatives — slate or accent replace it everywhere.
- Invent a new button variant as a local `styled.button`. If a variant is missing, add it to `buttonTokens.ts`.
- Create a parallel overlay+backdrop pair. Use `<Modal>` or `<BottomSheet>`.
- Mix shadow tiers — a dropdown is `floating`, a modal is `modal`, a tab tile is `tab`. Don't blend.
- Drift this file from the TS token files. If you edit one, update the other in the same PR.
