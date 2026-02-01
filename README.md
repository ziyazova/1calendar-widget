# 1calendar-widget

Виджеты календаря и часов для Notion.

## Адаптивность виджетов

Все виджеты адаптивны и консистентны:
- **Токены**: `src/presentation/themes/widgetTokens.ts`
- **Breakpoints**: 360px, 480px, 640px
- **Контейнеры**: min 200px, max 420px (calendar) / 360px (clock)

Подробный план: [docs/ADAPTIVE-WIDGETS-PLAN.md](docs/ADAPTIVE-WIDGETS-PLAN.md)

## Структура проекта (упрощённая)

```
src/
├── App.tsx              # Роутинг приложения
├── main.tsx             # Точка входа
│
├── domain/              # Доменная логика
│   ├── entities/        # Widget — сущность виджета
│   ├── value-objects/   # CalendarSettings, ClockSettings — настройки
│   ├── repositories/    # Интерфейсы для работы с данными
│   └── use-cases/       # ManageWidget — создание, обновление виджетов
│
├── infrastructure/      # Реализация
│   ├── di/              # DIContainer — dependency injection
│   ├── repositories/    # WidgetFactoryImpl, WidgetRepositoryImpl
│   └── services/        # UrlCodec — кодирование настроек в URL
│
└── presentation/        # UI
    ├── components/
    │   ├── layout/      # Header, WidgetDisplay
    │   ├── ui/          # Sidebar, CustomizationPanel, ColorPicker
    │   └── widgets/     # CalendarWidget, ClockWidget
    │       ├── calendar/styles/  # ModernGrid, ModernWeeklyCalendar
    │       └── clock/styles/     # ModernClock, AnalogClassicClock
    ├── pages/           # LandingPage, StudioPage, CalendarEmbedPage, ClockEmbedPage
    └── themes/          # Цвета, theme, widgetTokens (адаптивность)
```

## Виджеты

**Calendar:** Modern Grid, Modern Weekly  
**Clock:** Modern Digital, Analog Classic

## Запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

## Документация

- [docs/CHANGELOG.md](docs/CHANGELOG.md) — история изменений
- [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) — руководство для разработчиков и агентов
- [docs/ADAPTIVE-WIDGETS-PLAN.md](docs/ADAPTIVE-WIDGETS-PLAN.md) — план адаптивности виджетов

## Embed для Notion

Добавляйте уникальный query string, чтобы избежать кэширования:
```
https://your-domain.com/embed/calendar?ts=123456789
```
