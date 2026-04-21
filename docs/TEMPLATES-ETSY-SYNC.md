# Templates ↔ Etsy sync

> Living doc. Track Etsy listing IDs + description sync for every template on
> Peachy. Update as new listings are published or descriptions change.
>
> Related:
> - `src/presentation/data/templates.ts` — source of truth for what renders on site
> - `docs/SUBSCRIPTION-LAUNCH-PLAN.md` §10 — why we link to Etsy
> - Etsy shop: `https://www.etsy.com/shop/PeachyPlannerGB` (33 listings as of Apr 18, 2026)

---

## 1. Etsy CSV

**Current:** `docs/etsy-listings.csv` (33 listings, pulled Apr 17, 2026 from
`PeachyPlannerGB - Shop listings.csv`).

Refresh process when Etsy listings change:

1. Etsy dashboard → Shop Manager → Settings → Options → Download Data →
   **Currently for Sale**.
2. Overwrite `docs/etsy-listings.csv` in the repo.
3. Re-read the diff and update §2, §3, §4 below.

The CSV columns used here: `LISTING` (title), `LISTING ID`, `PRICE`,
`FAVORITES`, `EST. SALES`. Other columns (tags, views, revenue) are kept
for reference but not tracked in this doc.

---

## 2. Site templates → Etsy listing mapping

Template IDs are the `id` field in `src/presentation/data/templates.ts`.
Etsy URL format for customers: `https://www.etsy.com/listing/{LISTING_ID}`
(no slug needed — Etsy redirects to the canonical URL).

| Site id | Title | Image | Etsy listing ID | Etsy customer URL | Status |
|---|---|---|---|---|---|
| 1 | Ultimate Life Planner | `template-cherry-planner.png` | 1736107034 | https://www.etsy.com/listing/1736107034 | ✅ mapped |
| 2 | Ultimate Wellness Planner | `template-wellness.png` | 1755349936 | https://www.etsy.com/listing/1755349936 | ✅ mapped |
| 3 | Academic Planner Dark | `template-academic-dark.png` | 1783878805 | https://www.etsy.com/listing/1783878805 | ✅ mapped (see §2.1) |
| 4 | Green Life Planner | `template-green-life.png` | 1825825830 | https://www.etsy.com/listing/1825825830 | ✅ mapped |
| 5 | Student Planner Light | `template-student-light.png` | — (uses 1783878805) | — | 🔀 merge into id=3 (see §2.1) |
| 6 | Mystic Life Planner | `template-mystic.png` | 1737912942 | https://www.etsy.com/listing/1737912942 | ✅ mapped |
| 7 | Light Academia Planner | `template-academia-light.png` | 1773207250 | https://www.etsy.com/listing/1773207250 | ✅ mapped |
| 8 | Glow Up Planner | `template-glowup.png` | 1775842529 | https://www.etsy.com/listing/1775842529 | ✅ mapped |
| 9 | Olive Life Planner | `template-life-olive.png` | 1827799444 | https://www.etsy.com/listing/1827799444 | ✅ mapped |
| 10 | Cherub Planner | `template-cherub.png` | 1837862393 | https://www.etsy.com/listing/1837862393 | ✅ mapped |
| 11 | Minimalist Green Planner | `template-minimalist-green.png` | 1824384930 | https://www.etsy.com/listing/1824384930 | ✅ mapped |
| 12 | Dark Academia Student | `template-dark-academia.png` | 1787041091 | https://www.etsy.com/listing/1787041091 | ✅ mapped |
| 13 | University Planner | `template-university-dark.png` | 1785090897 | https://www.etsy.com/listing/1785090897 | ✅ mapped |

**Until a row has an Etsy listing ID, the Etsy button is hidden on that
template's page** (no fallback to shop root). Once you fill the ID in, also
paste it into `etsyUrl` for that template in `templates.ts` and the button
appears automatically.

### 2.1 Pending merge: ids 3 (Academic Dark) + 5 (Student Light)

Owner decision Apr 18: templates 3 and 5 are the **same Notion product**,
just different color themes (dark vs light). On Etsy there's a single
listing (`1783878805`). On the site they should become **one card** with a
light↔dark animation swap on the thumbnail.

- [ ] Merge `id=3` and `id=5` into one entry in `templates.ts` (keep id=3,
      drop id=5). New entry carries **both** images
      (`imageDark: 'template-academic-dark.png'`,
      `imageLight: 'template-student-light.png'`).
- [ ] Update `TemplateCard` on `/templates` to cross-fade between the two
      images on hover (or auto-loop every 3s) when both are present.
- [ ] On `/templates/3` detail page, carousel opens on dark image, toggles
      to light via a small theme-switch affordance.
- [ ] Etsy URL for both = `https://www.etsy.com/listing/1783878805`.
- [ ] Title change: from "Academic Planner Dark" → "Academic Planner
      (Light & Dark)" so the single card communicates both variants.
- [ ] Any redirect path from old `/templates/5` → new `/templates/3`
      (React Router redirect, one line).

Out of scope for Wave 0. Scheduled after the Etsy-button fix lands — track
it as its own small task so Wave 0 stays surgical.

---

## 3. Description sync

`templates.ts` has three description fields per template:
`description` (short card blurb), `overview` (2–3 sentences), `features`
(bullet list), `pagesIncluded` (what's in the template). Etsy listings have
their own `title` + `description` + `tags`.

**Today:** site text was written first; Etsy listings were adapted from it.
Some drift is likely.

**Target:** one canonical text per template, used on both surfaces. Etsy
pulls from here, not the other way around.

Title drift diff from Apr 18, 2026 CSV scan. "Action" column uses:
- **✅ matches** — no edit needed
- **✏️ edit site** — rewrite in `templates.ts` to match Etsy (Etsy wording wins — usually SEO-tuned)
- **✏️ edit Etsy** — update the Etsy listing from site copy (site wording wins)
- **⚠️ diverge** — intentionally different (e.g. Etsy longer for SEO, site tighter for UX)

| Site id | Site title | Etsy title | Etsy price | Action |
|---|---|---|---|---|
| 1 | Ultimate Life Planner | 2026 Notion Life Planner Template, Coquette Dashboard | $27 | ⚠️ diverge — Etsy uses "Coquette" SEO hook, site is generic; also site price $18.99 vs Etsy $27 |
| 2 | Ultimate Wellness Planner | 2026 Ultimate Wellness Notion Template, Self-Care & Fitness Planner | $23 | ✅ matches intent; site $14.99 vs Etsy $23 — decide which wins |
| 3 | Academic Planner Dark | Notion Student Planner, ADHD Academic Dashboard & Assignment Tracker | $22 | ✏️ edit site — Etsy copy is more accurate / SEO-tuned (mentions ADHD + assignment tracker) |
| 4 | Green Life Planner | 2026 Notion Life Planner Template, Cottagecore Dashboard | $27 | ⚠️ diverge — "Green" (site) vs "Cottagecore" (Etsy); site price $14.99 vs Etsy $27 |
| 5 | Student Planner Light | _(same listing as id=3)_ | $22 | 🔀 merge per §2.1 |
| 6 | Mystic Life Planner | 2026 Witchy Notion Life Planner, Dark Academia Dashboard | $28 | ⚠️ diverge — "Mystic" vs "Witchy" sister vibes; site $16.99 vs Etsy $28 |
| 7 | Light Academia Planner | Light Academia Notion Template Notion Student Planner Notion Academic Planner… | $22 | ✅ matches — Etsy title is SEO stuffed but same concept; site $11.99 vs Etsy $22 |
| 8 | Glow Up Planner | Ultimate Glow Up Notion Template, Self-Care, Wellness & Fitness Planner | $23 | ✅ matches — site $12.99 vs Etsy $23 |
| 9 | Olive Life Planner | Matcha Notion Life Planner, All-in-One Notion Dashboard | $27 | ⚠️ diverge — "Olive" vs "Matcha" (both green/matcha-aesthetic); site $14.99 vs Etsy $27 |
| 10 | Cherub Planner | 2026 Notion Life Planner Template, Coquette Dashboard | $27 | ⚠️ diverge + **Etsy title clashes with id=1** (both say "Coquette Dashboard") — different listings, different palettes |
| 11 | Minimalist Green Planner | Minimalist Notion Life Planner Template, All-in-One Organization Dashboard | $27 | ✏️ edit site — drop "Green" (Etsy doesn't position as green); site $13.99 vs Etsy $27 |
| 12 | Dark Academia Student | Dark Academia Notion Student Planner, All-in-One Academic Dashboard | $22 | ✅ matches — site $11.99 vs Etsy $22 |
| 13 | University Planner | University Student Planner Notion Template, ADHD Study Dashboard | $22 | ✅ matches — site $9.99 vs Etsy $22 |

### 3.1 Big takeaway: site prices are much lower than Etsy

Every paid template is listed cheaper on Peachy than on Etsy (~45–55% lower
across the board). This is almost certainly unintentional — either site
prices are stale, or Etsy prices include Etsy's fees the owner wants to
price around. **Decide before any direct-to-Peachy sales launch (path A)**:

- If we want one canonical price → raise site prices to match Etsy.
- If Peachy is meant to undercut Etsy → current prices are fine, but call
  it out explicitly in marketing ("Direct from us = save 45%").
- Until decided: the disclosure under the Etsy button already warns
  *"prices may vary by location and currency"* — that covers the user
  legally for now.

Track as decision D18 in `docs/SUBSCRIPTION-LAUNCH-PLAN.md` §14.

---

## 4. Etsy inventory gap

You have **33 listings on Etsy**, only **13 are on the site** today. That
leaves ~20 Etsy-only planners. Decisions to make later:

- [ ] Are those 20 retired / archived listings, or live products we just
      haven't added to the site yet?
- [ ] If live: add them to `templates.ts` in a follow-up (one entry per
      template, pointing at the Etsy listing, same schema as today).
- [ ] If retired / low-converting: leave them off the site; no action.

From the Apr 18 CSV scan, below are the **21 Etsy-only listings** (12 unique
listings map to 13 site entries — id=3 and id=5 share one listing).

Sorted by `EST. SALES` (most → least) so promotion picks are obvious.
"Promote?" column is a suggestion; owner decides.

| Etsy listing ID | Etsy title | Price | Favs | Sales | Promote to site? |
|---|---|---|---|---|---|
| 1455009409 | Ultimate Life Planner Notion Template 2025 | $22 | 1,706 | 1,375 | 🔥 yes — top all-time seller |
| 1518242629 | Notion Ultimate Life Planner: All-in-One | $25 | 1,661 | 955 | 🔥 yes — #2 all-time |
| 1655623970 | That Girl Student Planner Notion Template | $27 | 633 | 594 | 🔥 yes — flagship student |
| 1479569220 | Aesthetic Wardrobe Manager Notion, Outfit Planner | $15 | 625 | 301 | ✅ yes — only wardrobe SKU |
| 1511075211 | Skincare Tracker Notion Template, Routine Planner | $9 | 289 | 225 | ✅ yes — low-price entry |
| 1648357642 | Ultimate Life Planner Notion Template 2025 (older) | $26 | 283 | 165 | ⚠️ maybe — overlaps with 1455009409 |
| 1750838601 | It Girl Notion Life Planner | $25 | 113 | 67 | ⚠️ maybe |
| 1843358559 | 2026 Notion Life Planner, Pink Dashboard | $27 | 108 | 44 | ⚠️ maybe — adds pink palette |
| 1786418895 | ADHD Student Planner Notion, Minimalist Academic | $22 | 99 | 51 | ⚠️ maybe |
| 1833782524 | Notion Bundle — Witchy + Dark Academia Student | $40 | 222 | 54 | ⚠️ bundle — decide bundle strategy first |
| 1785036251 | College Student Planner Notion, ADHD Study | $22 | 47 | 36 | ⚠️ maybe |
| 1833770890 | Glow up Notion Bundle: Light Academia + Self-Care | $40 | 51 | 10 | ❌ bundle, low conversion |
| 1770857990 | Notion Academic Planner, ADHD Student Dashboard | $22 | 46 | 19 | ❌ overlaps with id=3 |
| 1847972665 | Wellness Notion Bundle: Light Academia + Self-Care | $40 | 29 | 6 | ❌ bundle, low conversion |
| 1833774500 | Glow Up Notion Bundle: Light Academia + Wellness | $40 | 29 | 7 | ❌ bundle, low conversion |
| 1847984631 | Ultimate Notion Bundle: Life + Student + Wardrobe | $36 | 39 | 13 | ⚠️ big bundle, low conversion |
| 1833778056 | Coquette Notion Template Bundle, Student + Life | $40 | 36 | 13 | ❌ bundle, low |
| 1833783004 | ADHD Notion Template Bundle: Student + Life | $40 | 38 | 11 | ❌ bundle, low |
| 1847987121 | 2026 Matcha Notion Bundle: Life + Student + Wardrobe | $36 | 16 | 7 | ❌ bundle, low |
| 1833776562 | Light Academia Notion Bundle, Student + Life | $40 | 19 | 5 | ❌ bundle, low |
| 1847967787 | Light Academia Notion Bundle, Student + Life (dup) | $40 | 24 | 8 | ❌ duplicate listing |

### 4.1 Recommended actions

- [ ] **Add 3 top sellers to site ASAP** (id=14, 15, 16 probably):
      1455009409, 1518242629, 1655623970 — combined ~2.9k sales on Etsy.
      Decide if any overlap with existing site entries (two "Ultimate Life
      Planner" listings already — careful of confusing id=1).
- [ ] **Add 2 standalone SKUs** with unique niches:
      1479569220 (Wardrobe) and 1511075211 (Skincare) — no overlap with
      site catalog.
- [ ] **Bundle strategy is a separate decision** — none of the 8 bundles
      is converting well on Etsy. Either don't mirror to site, or if we
      do, build a dedicated `/bundles` route and cross-sell from the
      individual template pages.
- [ ] **Deduplicate older Life Planner listings** — we have 3 listings on
      Etsy that all say "Ultimate Life Planner" (ids 1736107034,
      1518242629, 1455009409, 1648357642). Keeping them as separate SKUs
      on site will confuse buyers. Pick one canonical, redirect the
      others.

---

## 5. How this doc stays useful

- When a new Etsy listing is published → add a row in §2, paste the
  customer URL, update `templates.ts` with `etsyUrl`.
- When Etsy copy changes → update §3 status to ⚠️ and re-sync.
- When a site template is retired → mark row in §2 as ⛔ retired, drop the
  entry from `templates.ts`, leave the Etsy listing alone (or archive
  separately on Etsy).
- Rule of thumb: **never** edit an Etsy listing URL inline in code without
  also touching this doc. Breaks traceability.
