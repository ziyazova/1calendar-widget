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

- [ ] **Settings `Section` → `Card $variant="subtle"` needs design call.**  
       **Where:** `src/presentation/pages/SettingsPage.tsx` — `Section` styled.section at L170.  
       **Why:** Plan §2.4 prescribes `subtle`, but settings page bg is `#FBFAF7` (warm cream) and `Section` bg is pure `#fff`. Shared `subtle` uses `surfaceAlt = #FAFAFA` which is nearly identical to `#FBFAF7` → cards disappear visually. Either (a) page bg moves to `#fff` then `subtle` cards float on surfaceAlt-tinted page, or (b) Section adopts `elevated` variant which has a different shadow (`shadows.card` vs local `0 1px 2px rgba(0,0,0,0.02)`). Needs owner/design call before swap. Section stays local with tokenized values in the meantime.
- [ ] **Settings page warm-cream bg (`#FBFAF7`) not in theme.**  
       **Where:** `SettingsPage.tsx` L68 `Page styled.div`. Also `#FFD4B8/#FFB3A0/#E8B4E3` peach gradient at L136 (avatar flourish?).  
       **Why:** Unique to Settings, doesn't repeat elsewhere. Either add `background.page.warm` or leave local per plan §1.3.
- [ ] **Remaining inline-style hexes (~30 in DashboardViews, ~30 in StudioPage).**  
       **Why:** Inline `style={{ color: '#1F1F1F' }}` can't use theme interpolation without threading `useTheme()` through each component. When those sections get rebuilt as `<Card>` compositions (deferred Section → Card work), the inline styles naturally evaporate into styled-components with theme access.

---

## Deferred by plan

- [ ] Tablet adaptation pass — blocked until all chrome is on shared components (plan §5).
- [ ] Color / typography / radius redesign — deferred; migration is infra only (plan §0).
- [ ] Dark mode polish — deferred (plan §5).
- [ ] Refactor `CustomizationPanel` — separate track, not part of this migration (plan §5).
