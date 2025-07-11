// Компактный кодек для минимальных URL
export class CompactUrlCodec {
  // Карта сокращений для экономии байтов
  private static readonly FIELD_MAP = {
    // Общие поля (1 символ)
    primaryColor: 'p',
    backgroundColor: 'b',
    accentColor: 'a',
    opacity: 'o',
    borderRadius: 'r',
    showBorder: 's',
    style: 't',

    // Calendar специфичные (c+символ)
    defaultView: 'cv',
    showWeekends: 'cw',

    // Clock специфичные (k+символ) 
    showSeconds: 'ks',
    format24h: 'kf',
    showDate: 'kd',
    fontSize: 'kz',

    // Weather специфичные (w+символ)
    temperatureUnit: 'wu',
    showFeelsLike: 'wf',
    showHumidity: 'wh',
    location: 'wl',
  } as const;

  // Обратная карта для декодирования
  private static readonly REVERSE_MAP = Object.fromEntries(
    Object.entries(CompactUrlCodec.FIELD_MAP).map(([k, v]) => [v, k])
  );

  // Дефолтные значения - не включаем в URL если они равны дефолту
  private static readonly DEFAULTS: Record<string, any> = {
    primaryColor: '#667EEA',
    backgroundColor: '#ffffff',
    accentColor: '#f1f5f9',
    opacity: 1,
    borderRadius: 12,
    showBorder: true,

    // Calendar
    defaultView: 'month',
    showWeekends: true,
    style: 'detailed',

    // Clock
    showSeconds: true,
    format24h: true,
    showDate: true,
    fontSize: 'medium',

    // Weather
    temperatureUnit: 'celsius',
    showFeelsLike: true,
    showHumidity: true,
    location: 'New York',
  };

  // Цвета из палитры кодируем индексами (0-9, a-f для 16 цветов)
  private static readonly COLOR_PALETTE = [
    '#667EEA', '#764BA2', '#F093FB', '#F8BBD9', '#4FACFE',
    '#43E97B', '#FA709A', '#FEE140', '#A8E6CF', '#FFB199',
    '#FFFFFF', '#F8FAFC', '#F1F5F9', '#E2E8F0', '#1E293B', '#0F172A'
  ];

  static encode(widgetType: string, settings: Record<string, any>): string {
    const compact: Record<string, any> = {};

    // Добавляем тип виджета одним символом
    const typeMap: Record<string, string> = { calendar: 'c', clock: 'k', weather: 'w' };
    compact._ = typeMap[widgetType] || widgetType;

    // Обрабатываем каждое поле
    for (const [key, value] of Object.entries(settings)) {
      const shortKey = this.FIELD_MAP[key as keyof typeof this.FIELD_MAP];
      if (!shortKey) continue;

      // Пропускаем дефолтные значения
      if (this.DEFAULTS[key] === value) continue;

      // Специальная обработка цветов
      if (key.includes('Color')) {
        const colorIndex = this.COLOR_PALETTE.indexOf(value);
        if (colorIndex !== -1) {
          compact[shortKey] = colorIndex.toString(16); // hex: 0-f
          continue;
        }
        // Если цвет не из палитры, храним как есть но без #
        compact[shortKey] = value.replace('#', '');
        continue;
      }

      // Булевы значения как 0/1
      if (typeof value === 'boolean') {
        compact[shortKey] = value ? '1' : '0';
        continue;
      }

      // Числа
      if (typeof value === 'number') {
        compact[shortKey] = value.toString();
        continue;
      }

      // Строки - сокращаем где возможно
      if (typeof value === 'string') {
        const stringShortcuts: Record<string, string> = {
          // Styles
          'detailed': 'd', 'compact': 'c', 'week': 'w',
          'digital': 'd', 'analog': 'a', 'world': 'w',
          'current': 'c', 'forecast': 'f', 'minimal': 'm',
          // Sizes
          'small': 's', 'medium': 'm', 'large': 'l',
          // Views
          'month': 'm', 'day': 'd',
          // Units
          'celsius': 'c', 'fahrenheit': 'f',
        };

        compact[shortKey] = stringShortcuts[value] || value;
        continue;
      }

      compact[shortKey] = value;
    }

    // Сериализуем в минимальный JSON и кодируем в base64
    const json = JSON.stringify(compact);
    return btoa(json).replace(/[=]/g, ''); // Убираем padding символы
  }

  static decode(encoded: string): { widgetType: string; settings: Record<string, any> } | null {
    try {
      // Восстанавливаем padding если нужно
      const padded = encoded + '=='.slice(0, (4 - encoded.length % 4) % 4);
      const json = atob(padded);
      const compact = JSON.parse(json);

      // Восстанавливаем тип виджета
      const typeReverseMap: Record<string, string> = { c: 'calendar', k: 'clock', w: 'weather' };
      const widgetType = typeReverseMap[compact._] || compact._;
      delete compact._;

      const settings: Record<string, any> = { ...this.DEFAULTS };

      // Восстанавливаем поля
      for (const [shortKey, value] of Object.entries(compact)) {
        const longKey = this.REVERSE_MAP[shortKey];
        if (!longKey) continue;

        // Восстанавливаем цвета
        if (longKey.includes('Color')) {
          if (typeof value === 'string' && value.length === 1) {
            // Это индекс из палитры
            const colorIndex = parseInt(value, 16);
            if (colorIndex < this.COLOR_PALETTE.length) {
              settings[longKey] = this.COLOR_PALETTE[colorIndex];
              continue;
            }
          }
          // Это hex цвет без #
          settings[longKey] = '#' + value;
          continue;
        }

        // Восстанавливаем булевы
        if (value === '1') {
          settings[longKey] = true;
          continue;
        }
        if (value === '0') {
          settings[longKey] = false;
          continue;
        }

        // Восстанавливаем числа
        if (!isNaN(Number(value))) {
          settings[longKey] = Number(value);
          continue;
        }

        // Восстанавливаем строки из сокращений
        if (typeof value === 'string') {
          const stringExpansions: Record<string, string> = {
            // Styles
            'd': longKey.includes('style') ? 'detailed' : longKey.includes('format') ? 'digital' : 'day',
            'c': longKey.includes('style') ? 'compact' : longKey.includes('format') ? 'current' : 'celsius',
            'w': longKey.includes('style') ? 'week' : 'world',
            'a': 'analog', 'f': longKey.includes('Unit') ? 'fahrenheit' : 'forecast',
            'm': longKey.includes('Size') ? 'medium' : longKey.includes('style') ? 'minimal' : 'month',
            // Sizes
            's': 'small', 'l': 'large',
          };

          settings[longKey] = stringExpansions[value] || value;
          continue;
        }

        settings[longKey] = value;
      }

      return { widgetType, settings };
    } catch (error) {
      console.error('Failed to decode compact URL:', error);
      return null;
    }
  }

  // Создает супер короткую ссылку
  static createCompactEmbedUrl(baseUrl: string, widgetType: string, settings: Record<string, any>): string {
    const encoded = this.encode(widgetType, settings);
    const route = `/embed/${widgetType}`;
    return `${baseUrl}${route}?c=${encoded}`; // 'c' вместо 'config'
  }

  // Извлекает настройки из компактного URL
  static extractFromCompactUrl(url?: string): { widgetType: string; settings: Record<string, any> } | null {
    try {
      const urlObj = new URL(url || window.location.href);
      const compactParam = urlObj.searchParams.get('c'); // 'c' вместо 'config'

      if (!compactParam) {
        return null;
      }

      return this.decode(compactParam);
    } catch (error) {
      return null;
    }
  }
} 