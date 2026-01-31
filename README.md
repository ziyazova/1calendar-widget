# 1calendar-widget

Виджеты календаря и часов для Notion.

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
    │       └── clock/styles/     # ModernClock, DigitalMinimalClock, AnalogClassicClock
    ├── pages/           # LandingPage, StudioPage, CalendarEmbedPage, ClockEmbedPage
    └── themes/          # Цвета и стили
```

## Виджеты

**Calendar:** Modern Grid, Modern Weekly  
**Clock:** Modern Digital, Digital Minimal, Analog Classic

## Запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

## Embed для Notion

Добавляйте уникальный query string, чтобы избежать кэширования:
```
https://your-domain.com/embed/calendar?ts=123456789
```
