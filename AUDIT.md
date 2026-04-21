# Peachy Studio — Design System Audit

Ветка: `design-experiment`. Читалось: `theme.ts`, `colors.ts`, `DesignSystemPage.tsx`,
`shared/Button.tsx`, `shared/Badges.tsx`, `components/layout/TopNav.tsx`, `components/ui/forms/CustomizationPanel.tsx`,
`components/ui/ColorPicker.tsx`, `components/ui/Sidebar.tsx`, `components/landing/HeroSectionV2.tsx`,
`pages/StudioPage.tsx`, `pages/TemplatesPage.tsx`, `pages/TemplateDetailPage.tsx`, `pages/LoginPage.tsx`,
`pages/DashboardViews.tsx` (частично), `CLAUDE.md`.

---

## 1. Критичные несоответствия токенов vs реальность

### 1.1 Primary цвет — противоречие на 4 фронта
| Источник | Значение |
|---|---|
| `theme.ts` → `colors.text.primary` | `#1F1F1F` ✅ (совпадает с UI) |
| `theme.ts` → `colors.accent` | `#007AFF` ❌ (iOS blue — не используется на сайте) |
| `CLAUDE.md` | `#6E7FF2 / #7C63B8 / #E89A78` ❌ (устарело) |
| Реальный UI (Badges, Studio, Login) | **`#6366F1 / #818CF8`** (indigo gradient) — везде |
| Кнопки hover | `#3384F4 / #5BA0F7` (blue gradient) |

**Реальная роль акцента — indigo `#6366F1`**, но он захардкожен во всех файлах вместо `theme.colors.accent`.

### 1.2 Duplicate radii
```ts
radii.sm === 8px
radii.button === 12px  // дубль
radii.md === 12px      // дубль
```

### 1.3 Off-grid spacing
Theme объявляет 4-point grid (`4/8/12/16/20/24/32/40/48/64/80`), но в коде:
- `StudioPage`: `3px 10px`, `14px 16px`, `13px`, `6px`
- `TemplateDetail`: `2px 10px`, `6px 0`, `8px 14px`
- `LoginPage`: `10px 12px`, `12px 14px`
- Fontsize off: `12.5px`, `11px`, `10px`, `13px` (нет в типографической шкале)

### 1.4 Хардкод цветов — массовый
Только в прочитанных файлах нашлось:
- `#6366F1`, `#818CF8`, `#4F46E5`, `#6E7FF2` (indigo family — должно быть 1 токен)
- `#3384F4`, `#5BA0F7` (blue CTA)
- `#F49B8B`, `#DC2828`, `#DC2626` (danger — должно быть `theme.colors.destructive`)
- `#22C55E`, `#16A34A`, `#15803D`, `#166534` (success — должно быть `theme.colors.success`)
- `#FAFAFA`, `#F5F5F5`, `#FAFAF9`, `#F8F8F7` (neutrals — дубли `background.surface`)
- `#1F1F1F`, `#2B2320`, `#333`, `#555`, `#666`, `#777`, `#888`, `#999`, `#CCC` (text-серые — должно быть `text.primary/secondary/tertiary/muted`)

---

## 2. Дубли компонентов (визуально одинаковые)

### 2.1 «Тёмная primary-кнопка с тенью»
Повторяется **8 раз** в 6 файлах:
- `StudioPage.Btn $primary` — `#1F1F1F bg, #fff text, 32/44/48h`
- `StudioPage` Upgrade CTA (editor top bar)
- `StudioPage` Welcome Upgrade CTA
- `StudioPage` Browse widgets
- `TemplateDetailPage.ActionBtn $primary`
- `TemplateDetailPage.MobileBuyBtn`
- `LoginPage.SubmitBtn`
- `LoginPage.PrimaryBtn`
- `CustomizationPanel` save/apply (судя по имени)

Все делают `background: #1F1F1F; &:hover { background: #333 }`. Должна быть **одна** `<Button variant="primary">`.

### 2.2 «Outline secondary-кнопка»
- `StudioPage.Btn` (not primary)
- `TemplateDetailPage.ActionBtn $variant="outline"`
- `LoginPage.SocialBtn`
- `LoginPage.SecondaryBtn`
- `LoginPage.ResendBtn`

### 2.3 «Indigo gradient pill» (Pro / Upgrade)
В `StudioPage` повторяется **3 раза** inline:
```js
background: 'linear-gradient(135deg, #6366F1, #818CF8)',
boxShadow: '0 2px 8px rgba(99,102,241,0.25)'
```
Плюс то же в `LoginPage.ConfirmIcon`, `SignedInAvatar`. Должен быть токен `gradients.brand` + variant `accent` у Button.

### 2.4 «Plan progress ring» (widgets count)
**Точный дубль** в двух местах StudioPage (editor header + welcome bar). Компонент не вынесен.

### 2.5 «Gradient banner create widget»
В StudioPage inline стиль повторяется в `BrowseBtn` и на welcome card. Один компонент.

### 2.6 Карточки
- `TemplatesPage.CardImage` vs `TemplateDetailPage.CarouselWrap` vs `StudioPage.WidgetCard`
— все имеют одинаковый паттерн *«контейнер 16px radius + 1px border + subtle shadow»*. Нет базового `<Card>`.

### 2.7 FAQ / Accordion
`TemplateDetailPage.FaqItem + FaqQuestion + FaqAnswer` — кандидат на `<Accordion>`.

### 2.8 Forgot password modal vs Upgrade modal vs Purchase confirmed banner
Три разных диалога с нуля. Нужен базовый `<Modal>`.

---

## 3. Структурные проблемы файлов

| Файл | Размер | Проблема |
|---|---|---|
| `DesignSystemPage.tsx` | 140KB / ~3400 строк | монолит; inline-копии реальных компонентов |
| `StudioPage.tsx` | 53KB | 3 отдельных layout'а (desktop editor, mobile editor, dashboard) в одном файле |
| `LoginPage.tsx` | 32KB | Login + SignUp + CheckEmail + SignedIn + ForgotPassword modal — 5 состояний |
| `TemplateDetailPage.tsx` | 30KB | ок, но много inline компонентов, которые пригодятся в других страницах |
| `DashboardViews.tsx` | 60KB | 4 views в одном файле |
| `CustomizationPanel.tsx` | 32KB | |
| `TopNav.tsx` | 27KB | |
| `ColorPicker.tsx` | 24KB | |

---

## 4. DesignSystemPage врёт про production

В `DesignSystemPage` много секций с комментарием:
> "1:1 copy of CustomizeBtn from WidgetStudioPage.tsx:473"
> "WidgetStudioSection.AccessBtn and TemplatesGallery.ExploreBtn are visual duplicates of ActionButton"

Это значит: **витрина дизайн-системы держит отдельные копии** компонентов. Любое изменение оригинала — делает витрину устаревшей без предупреждения.

---

## 5. `Button.tsx` покрывает ~10% случаев

Текущий `Button`: `primary | secondary | ghost` × `sm | lg`.

Реально используется в коде:
- **primary dark** (`#1F1F1F`) — 8 мест ✅ есть
- **primary gradient indigo** — 3 места ❌ нет
- **primary gradient blue** (`#3384F4 → #5BA0F7`) — 3 места ❌ нет
- **outline neutral** — 5 мест ⚠️ есть, но стили разъезжаются
- **outline on-light** (social) — ❌
- **danger outline** — ❌
- **ghost icon-only** — ❌
- **pill / chip filter** — ❌
- **CTA XL** (48h / full-width mobile bar) — ❌
- **success confirmed** (green) — ❌
- **link-looking button** (`LinkBtn`) — ❌

Надо расширить до покрытия реальных сценариев, иначе люди всегда будут писать свои styled.button.

---

## 6. Неконсистентный spacing на строках

- 3 разных `card radius`: `10px`, `12px`, `14px`, `16px`, `20px`, `22px` — не соответствует `theme.radii`
- Padding карточек: `16px`, `14px 16px`, `24px`, `32px 32px`, `56px 24px` — нет шкалы
- Gap: `4`, `6`, `8`, `10`, `12`, `14`, `16`, `18` — половина off-grid

---

## 7. Типографика

`theme.typography` существует и используется в ~40% мест. Остальные 60% — хардкод:
- `font-size: 11px`, `10px`, `12.5px`, `13px`, `13.5px`, `18px`, `22px`, `28px`, `32px`
- `font-weight: 400/500/600/700` — ок
- `letter-spacing: -0.005em, -0.01em, -0.02em, -0.03em, 0.06em` — 5 значений, должны быть токены

Нужно: зафиксировать шкалу размеров (`xs 11 / sm 12 / base 14 / md 15 / lg 16 / xl 18 / 2xl 22 / 3xl 26 / 4xl 32`) и ВСЁ через токены.

---

## 8. Рекомендуемая последовательность правок

1. **`theme.ts` — чистка + расширение**
   - убрать `radii.button` (оставить `md`)
   - добавить `colors.brand.indigo / .indigoGradient` + `colors.brand.blueGradient`
   - добавить `colors.success.bg/border/text` (для confirmed banners)
   - добавить `colors.destructive.bg/border/text`
   - зафиксировать `typography.sizes` и `letterSpacing` как токены
2. **`shared/Button.tsx` — расширить**
   - варианты: `primary | accent | outline | ghost | danger | link | success`
   - размеры: `xs | sm | md | lg | xl`
   - модификаторы: `iconOnly`, `fullWidth`, `pill`
3. **`shared/Card.tsx`, `shared/Modal.tsx`, `shared/Accordion.tsx`, `shared/PlanRing.tsx`** — вынести дубли
4. **Мигрировать страницы** (один коммит = одна страница):
   - LoginPage (самый простой — 5 состояний легко разрезать)
   - TemplatesPage
   - TemplateDetailPage
   - StudioPage (разделить на Dashboard / DesktopEditor / MobileEditor)
5. **Разбить `DesignSystemPage`** на секции + импортировать **реальные** компоненты вместо копий
6. **CLAUDE.md** — синхронизировать с реальностью

---

## 9. Что точно НЕ трогаю без подтверждения

- Цветовую семантику (iOS blue vs indigo — ждёт решения)
- Архитектуру DI / Use Cases / domain
- Widget-компоненты (`widgets/*`)
- Supabase / Polar интеграцию
