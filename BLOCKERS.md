# Active blockers

> Single-source list of **decisions the owner needs to make** before specific work can continue.
>
> Different from `TODO_AFTER_MIGRATION.md` (parking lot for nice-to-haves) — items here have code paused on them. Add an item here only when somebody else can't move forward without an answer.

---

_(no active blockers — all clear)_

---

## ✅ Resolved

### Settings page `Section` — stays local, values promoted to theme

**Decided:** Option C + token promotion (design-claude recommendation).

Section stays a local styled-component in `SettingsPage.tsx` per plan §1.3. Its two unique values got promoted:
- `theme.colors.background.surfaceWarm = '#FBFAF7'` (page warm-cream bg)
- `theme.shadows.cardFlat = '0 1px 2px rgba(0, 0, 0, 0.02)'` (near-invisible hairline shadow)

Both intent-named, not site-named, so another surface can reuse them without renaming. Zero visual change — values moved 1-to-1 from hex/rgba to token.

**Why not A (page bg → #fff):** would lose Settings' intentional warm-cream "feel."
**Why not B (elevated variant):** different shadow makes Settings visually "louder" than designed.

Files touched: `theme.ts`, `SettingsPage.tsx` (Page + Section), this file.

---

## How to use this file

- Add a new blocker when: you've paused code on a decision somebody else has to make.
- Move a blocker to the `Resolved` section below when: the decision lands and the code ships.
- Don't add: "things to do" without a blocking question. Those go in `TODO_AFTER_MIGRATION.md`.
