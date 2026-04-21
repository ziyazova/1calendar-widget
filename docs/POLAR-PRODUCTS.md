# Polar product catalogue — 2026-04-18 snapshot

Source of truth for Polar product ids used by in-site checkout. Refresh by
hitting the `polar-list-products` Edge Function (naming convention in Polar
is `{etsyListingId} - {title}` so auto-matching by Etsy id works).

> To refresh: open
> `https://vyycfwgkawtqkjllvsuc.supabase.co/functions/v1/swift-processor`
> (current deployment name; rename later) — returns JSON. Paste into this
> file or diff against it.

## Subscription

| Name | Polar product id | Price | Recurring |
|---|---|---|---|
| Peachy Widget Subscription | `32f0b97d-accd-42e8-a495-4139dab6961d` | $4.00 | monthly |

Referenced by `POLAR_PRO_PRICE_ID` (Supabase secret — env var kept the legacy
name even though it's a product id now).

## Templates mapped to site (`src/presentation/data/templates.ts`)

These 13 have a card on the site and a `polarProductId` in code.

| Etsy id | Template title | Polar product id | Price |
|---|---|---|---|
| 1736107034 | Notion Life Planner, Coquette Dashboard | `ce9b8c81-b345-40a2-bf2b-88d98206a4c1` | $9.00 |
| 1755349936 | Ultimate Wellness Notion 2026 | `7bdfe90a-5182-42b7-83da-8580d13660a8` | $8.00 |
| 1783878805 | Notion Student Planner, ADHD Academic Dashboard | `c7ed28ea-f289-4d9b-995c-1b3d5d963c12` | $8.00 |
| 1825825830 | Notion Life Planner, Cottagecore Dashboard | `b93535e2-b518-4bb1-b18e-d166b867c2a3` | $9.00 |
| 1737912942 | Witchy Notion Life Planner, Dark Academia | `52d1dbea-bc2a-4c91-bf75-abc50b34dead` | $10.00 |
| 1773207250 | Light Academia Notion Student Planner | `73771fd2-284e-499d-9fc5-e1219ab861c4` | $8.00 |
| 1775842529 | Glow Up Notion, Self-Care & Fitness | `48899592-5480-452c-931f-1f070cfcf8eb` | $8.00 |
| 1827799444 | Matcha Notion Life Planner | `23df2ca8-7b26-49d7-8173-22d7d9d44b27` | $9.00 |
| 1837862393 | Notion Life Planner 2026, Coquette | `410c035a-e013-4a0e-9ff6-8e60df1d7c64` | $9.00 |
| 1824384930 | Minimalist Notion Life Planner | `83f84551-d312-4e81-ad41-ca42663d5424` | $9.00 |
| 1787041091 | Dark Academia Notion Student Planner | `9c94c452-3bf2-42f3-ba68-15e7f96021d6` | $8.00 |
| 1785090897 | University Student Planner, ADHD Study | `f6d16580-63f9-4d2d-9081-a4dc76252384` | $8.00 |

(Template id=5 in `templates.ts` shares Polar product with id=3 — both point
to Etsy listing 1783878805. Split if you want a distinct SKU.)

## Polar products with NO matching site card (21 — add cards if useful)

Use this when creating new `TEMPLATES[]` entries: pick a row, copy the id,
paste into a new card with `etsyUrl: 'https://www.etsy.com/listing/{etsyId}'`.

| Etsy id | Product name | Polar product id | Price |
|---|---|---|---|
| 1511075211 | Skincare Tracker Notion, Routine Planner | `6a7ead90-e57a-46ec-85c9-a61bbe2976d4` | $3.00 |
| 1785090897 | University Student Planner, ADHD Study Dashboard | — duplicate — | — |
| 1833782524 | Notion Bundle: Witchy Life & Dark Academia | `4abdb10b-587b-45a3-abd3-4881a8216901` | $14.00 |
| 1455009409 | Ultimate Life Planner Notion 2025 + Video Guides | `040fcdf2-c861-4954-98e4-c5a6abb6e473` | $8.00 |
| 1648357642 | Ultimate Life Planner Notion, All-in-One 2025 | `01da9eae-f8da-4f11-a856-7011d644a4e1` | $9.00 |
| 1518242629 | Notion Ultimate Life Planner, All-in-One | `6ac96e68-5511-4109-b5c5-b5efc1bef1a2` | $9.00 |
| 1770857990 | Notion Academic Planner, ADHD Student Dashboard | `b197502b-844d-436c-91f4-7a193a6d9397` | $8.00 |
| 1847967787 | Light Academia Bundle v2 | `54c9d148-f18e-49c2-aa69-8071893206d2` | $14.00 |
| 1833776562 | Light Academia Bundle | `ef1cfa0f-9ad4-4154-b9f0-5ac969be8594` | $14.00 |
| 1833783004 | ADHD Notion Bundle | `fd9c4d06-3614-4a21-afe6-119f6fa1c897` | $14.00 |
| 1833778056 | Coquette Notion Bundle | `c0651cba-39aa-4944-89d5-583a9bec7608` | $14.00 |
| 1655623970 | That Girl Student Planner | `cf89fac3-cde8-4e94-ba99-fa3dd3dd6404` | $9.00 |
| 1750838601 | It Girl Notion Life Planner | `e8cf6082-4dbf-4a0e-9166-f17d4fc35781` | $9.00 |
| 1843358559 | Notion Life Planner, Pink Dashboard 2026 | `7c055968-895d-44c7-8eb2-ae5c129d53a0` | $9.00 |
| 1833770890 | Glow Up Bundle: Light Academia & Self-Care | `d481bb75-a767-42ca-a465-7a3ecc736c43` | $14.00 |
| 1833774500 | Glow Up Notion Bundle | `1958ccc3-d2a4-488d-95a7-7d8720497bc1` | $14.00 |
| 1847984631 | Ultimate Notion Bundle: Life, Student & Wardrobe | `2f0c6d58-3bd1-4304-9635-7c8ef6a40c70` | $13.00 |
| 1479569220 | Aesthetic Wardrobe Manager Notion | `f3830fb0-1870-45fe-932e-0edb8abd76be` | $5.00 |
| 1847987121 | Matcha Notion Bundle | `f651af0a-4c50-43c3-b860-eb2490971c41` | $13.00 |
| 1786418895 | ADHD Student Planner, Minimalist Academic | `53468f90-a2d3-4743-8000-5a7903b35c04` | $8.00 |
| 1847972665 | Wellness Notion Bundle | `d3659ef9-0ab5-47d6-98fe-492b8606f209` | $14.00 |
| 1785036251 | College Student Planner, ADHD Study | `2434de75-b855-47e3-8a50-7c421937e180` | $8.00 |

## Adding a new template card (cheat sheet)

1. Find the product in the table above (or refresh via the Edge Function).
2. In `src/presentation/data/templates.ts`, add a new entry to `TEMPLATES`
   with `polarProductId: '<id>'` plus the usual fields (title, description,
   image, etc.).
3. Commit. No Polar-side change needed.

## Known drift

- Prices in `templates.ts` (`price` / `priceNum`) are **hard-coded** and may
  drift from Polar. Do a price reconciliation pass whenever you touch this
  doc — align the card price to what Polar actually charges.
- Product names in Polar include the Etsy listing id prefix because that's
  how the sync was seeded. Do **not** rename the prefix — it's the join key
  for this doc.
