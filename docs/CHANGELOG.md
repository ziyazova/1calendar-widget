# Changelog / История изменений

Документация всех значимых изменений проекта. Полезна для онбординга и понимания контекста.

---

## 2025 — Упрощение и адаптивность

### 1. Упрощение проекта (удалены виджеты)

**Цель:** Оставить только Calendar и Clock, убрать лишнее для понятной структуры.

**Удалено:**
- **Test Widget** — тестовый виджет (Chess Board)
- **Weather Widget** — погода целиком
- **Роуты:** `/embed/weather`, `/embed/test`, `/test`

**Удалённые файлы:**
```
src/domain/entities/WeatherData.ts
src/domain/repositories/WeatherService.ts
src/domain/value-objects/WeatherSettings.ts
src/domain/entities/widgets/CalendarWidget.ts (неиспользуемая сущность)
src/infrastructure/services/weather/WeatherServiceImpl.ts
src/presentation/components/widgets/TestWidget.tsx
src/presentation/components/widgets/WeatherWidget.tsx
src/presentation/components/widgets/weather/ (вся папка)
src/presentation/pages/WeatherEmbedPage.tsx
src/presentation/pages/TestEmbedPage.tsx
src/presentation/pages/TestingGroundPage.tsx
src/presentation/hooks/useWeatherData.ts
```

**Calendar — оставлено только:**
- Modern Grid
- Modern Weekly

**Calendar — удалено:**
- Compact Date
- Aesthetic Calendar

**Clock — оставлено только:**
- Modern Digital
- Analog Classic

**Clock — удалено:**
- Digital Minimal
- World Time

---

### 2. Кнопка Copy Embed URL

**Файл:** `src/presentation/components/layout/Header.tsx`

**Изменения:**
- Больше padding: `16px 24px`, min-height `44px`, min-width `160px`
- Увеличен размер иконки (18px), шрифт `md`, weight `semibold`
- `white-space: nowrap` — текст не переносится
- `min-width: 120px` для области текста

---

### 3. Создание widgetTokens (единые токены адаптивности)

**Новый файл:** `src/presentation/themes/widgetTokens.ts`

**Содержимое:**
- `WIDGET_CONTAINER` — min-width, max-width, padding, min-height для виджетов
- `CLOCK_CONTAINER` — настройки контейнера для часов
- `WIDGET_TYPOGRAPHY` — heading, body, small (clamp-размеры)
- `WIDGET_SPACING` — gap, gapMedium, margin
- `WIDGET_BREAKPOINTS` — xs, sm, md

**Зачем:** Консистентные отступы и размеры во всех виджетах.

---

### 4. Адаптивность виджетов

**Цель:** Виджеты должны корректно отображаться от 200px до 1920px+.

| Виджет | Изменения |
|--------|-----------|
| **Modern Grid** | Импорт токенов, `clamp()` для typography и spacing |
| **Modern Weekly** | width: 370px → 100% + max-width из токенов; grid вместо flex; clamp() везде |
| **ClockCommonStyles** | max-width: min(360px, 95vw), padding и min-height из CLOCK_CONTAINER |
| **Modern Clock** | Font-size и padding через clamp(); адаптивный DateDisplay |
| **Analog Classic** | `--clock-size: clamp(120px, 35vw, 200px)`; стрелки масштабируются через `scale(calc(var(--clock-size) / 160px))` |

---

### 5. EmbedScaleWrapper — масштабирование в embed

**Цель:** Виджеты в iframe (Notion) должны масштабироваться и не обрезаться.

**Новый файл:** `src/presentation/components/embed/EmbedScaleWrapper.tsx`

**Логика:**
- ResizeObserver отслеживает размер контейнера
- Вычисляется scale = min(containerWidth/420, containerHeight/380, 1)
- Применяется `transform: scale(scale)` к контенту
- Минимальный scale: 0.25
- Учёт padding: `-16` от размеров контейнера

**Изменения в embed-страницах:**
- `CalendarEmbedPage.tsx` — EmbedScaleWrapper оборачивает виджет
- `ClockEmbedPage.tsx` — то же
- `overflow: hidden` → `overflow: auto` (если scale не успел примениться, можно прокрутить)
- GlobalEmbedStyles (Calendar): overflow на html, body, #root → auto

---

### 6. Notion embed fix (frame-ancestors)

**Проблема:** Виджеты показывали "Click to view content" вместо отображения внутри Notion.

**Причина:** Страница блокировала загрузку в iframe (заголовки безопасности).

**Решение:** В `vercel.json` добавлены headers для `/embed/*`:
```json
"Content-Security-Policy": "frame-ancestors *"
```
Это разрешает встраивание страницы в iframe с любого домена (в т.ч. Notion).

---

### 7. Vercel build fix

**Файл:** `package.json`

**Проблема:** `vite: command not found` при билде на Vercel.

**Решение:** `"build": "tsc && npx vite build"` вместо `"vite build"`

---

### 8. App.tsx — роутинг

**Удалённые роуты:**
- `/embed/weather`
- `/embed/test`
- `/test`

**Текущие роуты:**
- `/` — LandingPage
- `/studio` — StudioPage
- `/embed/calendar` — CalendarEmbedPage
- `/embed/clock` — ClockEmbedPage

---

## Текущее состояние (после всех изменений)

**Структура виджетов:**
- Calendar: Modern Grid, Modern Weekly
- Clock: Modern Digital, Analog Classic

**Ключевые файлы:**
- `widgetTokens.ts` — токены адаптивности
- `EmbedScaleWrapper.tsx` — масштабирование в embed
- `ClockCommonStyles.ts` — база для часов
- `CalendarSettings`, `ClockSettings` — value objects с ограниченным набором styles

**Domain:**
- Widget — базовая сущность (createCalendar, createClock)
- CalendarSettings.style: `'modern-grid' | 'modern-weekly'`
- ClockSettings.style: `'modern' | 'analog-classic'`
