# План: адаптивные и консистентные виджеты

## Цель
Все виджеты (Calendar: Modern Grid, Modern Weekly; Clock: Modern Digital, Analog Classic) должны быть:
- **Адаптивными** — корректно отображаться на экранах от 200px до 1920px+
- **Консистентными** — единые отступы, шрифты, границы и breakpoints

---

## Текущее состояние (после реализации)

| Виджет | Адаптивность |
|--------|--------------|
| **Modern Grid** | ✅ Токены, clamp |
| **Modern Weekly** | ✅ width 100%, grid, clamp |
| **Modern Clock** | ✅ clamp для font-size, padding |
| **Analog Classic** | ✅ --clock-size, scale для стрелок |

---

## Единые токены адаптивности

### Breakpoints (из theme)
```
xs: 375px   — iPhone SE, узкие embed
sm: 480px   — мобильные
md: 640px   — планшеты
lg: 1024px  — десктоп
```

### Размеры контейнера (все виджеты)
```
min-width:  200px
max-width:  min(420px, 95vw)
padding:    clamp(12px, 4vw, 24px)
```

### Типографика
```
Заголовки:    clamp(14px, 4vw, 22px)
Текст:        clamp(12px, 2.8vw, 16px)
Мелкий текст: clamp(10px, 2.2vw, 14px)
```

### Сетки и отступы
```
gap:    clamp(2px, 1vw, 8px)
margin: clamp(8px, 2vw, 16px)
```

### Borders
```
border-radius: из settings (borderRadius)
border:        1–2px solid, прозрачность из accent
```

---

## Задачи по виджетам

### 1. Modern Grid (Calendar) ✅
- [x] Сверено с токенами
- [x] WIDGET_CONTAINER, WIDGET_TYPOGRAPHY, WIDGET_SPACING

### 2. Modern Weekly (Calendar) ✅
- [x] width: 100%, max-width из WIDGET_CONTAINER
- [x] clamp() для всех размеров
- [x] Grid layout вместо flex для консистентности

### 3. Clock Common Styles ✅
- [x] max-width: min(360px, 95vw)
- [x] padding, min-height из токенов

### 4. Modern Clock ✅
- [x] Font-size: clamp по fontSize settings
- [x] DateDisplay: адаптивные padding и font-size

### 5. Analog Classic Clock ✅
- [x] Циферблат: --clock-size: clamp(120px, 35vw, 200px)
- [x] Стрелки: scale(calc(var(--clock-size) / 160px))

---

## Файлы для создания/изменения

| Файл | Действие |
|------|----------|
| `src/presentation/themes/widgetTokens.ts` | **Создать** — общие токены |
| `src/presentation/components/widgets/clock/styles/ClockCommonStyles.ts` | Изменить |
| `src/presentation/components/widgets/calendar/styles/ModernGrid.tsx` | Рефакторинг |
| `src/presentation/components/widgets/calendar/styles/ModernWeeklyCalendar.tsx` | Полная адаптация |
| `src/presentation/components/widgets/clock/styles/ModernClock.tsx` | Изменить |
| `src/presentation/components/widgets/clock/styles/AnalogClassicClock.tsx` | Изменить |

---

## План реализации (по шагам)

1. **Шаг 1**: Создать `widgetTokens.ts` с константами
2. **Шаг 2**: Обновить `ClockCommonStyles` — база для часов
3. **Шаг 3**: Адаптировать `ModernWeeklyCalendar`
4. **Шаг 4**: Адаптировать `ModernClock`
5. **Шаг 5**: Адаптировать `AnalogClassicClock`
6. **Шаг 6**: Унифицировать `ModernGrid` под токены
7. **Шаг 7**: Проверка на 200px, 375px, 768px, 1920px
