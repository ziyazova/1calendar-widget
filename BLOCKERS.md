# Active blockers

> Single-source list of **decisions the owner needs to make** before specific work can continue.
>
> Different from `TODO_AFTER_MIGRATION.md` (parking lot for nice-to-haves) — items here have code paused on them. Add an item here only when somebody else can't move forward without an answer.

---

## 🟡 Settings page: `Section` → `Card` migration blocked on bg call

**Where:** `src/presentation/pages/SettingsPage.tsx:170` — `Section` styled.section.
**What's paused:** SIMPLIFICATION_PLAN.md §2.4 step (Settings sections → shared `<Card>`).
**What's already done:** local `Section` stays but all its values (bg, border, shadow) are on theme tokens. Zero visual change from before.

**The conflict:**

Plan §2.4 prescribes `<Card $variant="subtle">` for settings sections. But:

- Settings page background is `#FBFAF7` (warm cream, unique to this page).
- Shared `Card $variant="subtle"` uses `theme.colors.background.surfaceAlt` = `#FAFAFA`.
- `#FBFAF7` vs `#FAFAFA` — visually identical. Cards would disappear into the page background.

**Decision needed — pick one:**

| Option | What changes | Tradeoff |
|---|---|---|
| **A.** Settings page bg → `#fff` | Page becomes white, then `subtle` cards become distinct on warm `surfaceAlt` | Changes the "feel" of Settings — today's cream tone is gone |
| **B.** Adopt `Card $variant="elevated"` | Keeps warm page bg, uses elevated card with shadow | Shadow differs from current (`shadows.card` vs local `0 1px 2px rgba(0,0,0,0.02)`) — subtle but real visible change |
| **C.** Keep Section local (current state) | Nothing changes visually | DS-consistency debt — one more styled-component that isn't shared |

**Owner decision:** _(pending)_

**Current state:** Option C is active. No regression. Safe to ship as-is.

**Files touched when this unblocks:** `SettingsPage.tsx` only. Estimated scope: ~30 min + visual QA.

---

## How to use this file

- Add a new blocker when: you've paused code on a decision somebody else has to make.
- Move a blocker to `CHANGELOG` / remove it when: the decision lands and the code ships.
- Don't add: "things to do" without a blocking question. Those go in `TODO_AFTER_MIGRATION.md`.
