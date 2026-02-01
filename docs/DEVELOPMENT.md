# Development Guide / Руководство для разработчиков

Документ для людей и AI-агентов, которые работают над проектом.

---

## Быстрый старт

```bash
npm install
npm run dev
```

Сайт: http://localhost:5173

---

## Архитектура

### Слои

1. **Domain** (`src/domain/`) — бизнес-логика, entities, value objects, use cases
2. **Infrastructure** (`src/infrastructure/`) — реализация репозиториев, DI, URL codec
3. **Presentation** (`src/presentation/`) — React-компоненты, страницы, темы

### Виджеты

| Тип | Стили | Файлы |
|-----|-------|-------|
| Calendar | Modern Grid, Modern Weekly | `CalendarWidget.tsx`, `calendar/styles/` |
| Clock | Modern Digital, Analog Classic | `ClockWidget.tsx`, `clock/styles/` |

### Добавление нового стиля виджета

1. Создать компонент в `calendar/styles/` или `clock/styles/`
2. Добавить в `CalendarWidget.tsx` / `ClockWidget.tsx` в switch по `settings.style`
3. Обновить `CalendarSettings` / `ClockSettings` — добавить значение в union type `style`
4. Обновить `Sidebar.tsx` — добавить в `WIDGET_CATEGORIES`
5. Обновить `WidgetFactoryImpl.getDefaultSettings` при необходимости

### Адаптивность (обязательно)

- Использовать **widgetTokens** (`src/presentation/themes/widgetTokens.ts`)
- `clamp()` вместо фиксированных `px` для размеров
- Контейнеры: `min-width: 200px`, `max-width: min(420px, 95vw)` (calendar) или `min(360px, 95vw)` (clock)

---

## Embed (Notion)

### Как работает EmbedScaleWrapper

- Обёртка на `CalendarEmbedPage` и `ClockEmbedPage`
- ResizeObserver измеряет размер контейнера (iframe)
- Вычисляет `scale = min(w/420, h/380, 1)`
- Применяет `transform: scale(scale)` к виджету
- Виджет не обрезается при узком iframe

### Embed URL

Настройки кодируются в URL через `UrlCodecService`. Пример:
```
/embed/calendar?c=...
/embed/clock?c=...
```

---

## Важные файлы

| Файл | Назначение |
|------|------------|
| `src/App.tsx` | Роутинг |
| `src/infrastructure/di/DIContainer.ts` | DI, use cases |
| `src/presentation/components/ui/sidebar/Sidebar.tsx` | Список виджетов и стилей |
| `src/presentation/themes/widgetTokens.ts` | Токены адаптивности |
| `src/presentation/components/embed/EmbedScaleWrapper.tsx` | Масштабирование в embed |
| `src/domain/value-objects/CalendarSettings.ts` | Настройки календаря |
| `src/domain/value-objects/ClockSettings.ts` | Настройки часов |

---

## Удалённое (больше не существует)

- **Weather** — полностью удалён
- **Test Widget** — удалён
- **Digital Minimal** (clock) — удалён
- **World Time** (clock) — удалён
- **Compact Date**, **Aesthetic** (calendar) — удалены
- `domain/entities/widgets/CalendarWidget.ts` — удалена (использовался простой Widget)

---

## Деплой (Vercel)

- Push в `main` или `Version-1` запускает деплой
- Build: `tsc && npx vite build`
- Output: `dist/`
- `vercel.json` — rewrites для SPA, framework: vite

---

## Документация

- `docs/CHANGELOG.md` — что было сделано и зачем
- `docs/ADAPTIVE-WIDGETS-PLAN.md` — план адаптивности
- `README.md` — обзор проекта
