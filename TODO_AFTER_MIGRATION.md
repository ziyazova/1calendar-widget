# TODO After Migration

> Parking lot for ideas / UX fixes / design polish to revisit **after** the design-system migration lands (see `SIMPLIFICATION_PLAN.md`, steps 1–7).
>
> **Rule:** if you notice something mid-migration, write it here, don't fix it in the migration PR. Migration PRs stay narrowly scoped to infrastructure — no drive-by changes.

## Format

```
- [ ] <one-line summary>  
       **Where:** file path + optional line ref  
       **Why:** short reason / impact
```

---

## Observed during migration

_(add entries here as they come up — none yet)_

---

## Deferred by plan

- [ ] Tablet adaptation pass — blocked until all chrome is on shared components (plan §5).
- [ ] Color / typography / radius redesign — deferred; migration is infra only (plan §0).
- [ ] Dark mode polish — deferred (plan §5).
- [ ] Refactor `CustomizationPanel` — separate track, not part of this migration (plan §5).
