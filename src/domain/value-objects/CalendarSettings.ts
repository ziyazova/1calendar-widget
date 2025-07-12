export class CalendarSettings {
  public readonly primaryColor: string;
  public readonly backgroundColor: string;
  public readonly accentColor: string;
  public readonly defaultView: 'month' | 'week' | 'day';
  public readonly showWeekends: boolean;
  public readonly borderRadius: number;
  public readonly showBorder: boolean;
  public readonly style: 'compact-date' | 'modern-grid';

  constructor(settings: Partial<CalendarSettings> = {}) {
    this.primaryColor = settings.primaryColor || '#667EEA';
    this.backgroundColor = settings.backgroundColor || '#ffffff';
    this.accentColor = settings.accentColor || '#f1f5f9';
    this.defaultView = settings.defaultView || 'month';
    this.showWeekends = settings.showWeekends ?? true;
    this.borderRadius = settings.borderRadius ?? 12;
    this.showBorder = settings.showBorder ?? true;
    this.style = settings.style || 'modern-grid';
  }

  public static fromJson(json: string): CalendarSettings {
    try {
      const data = JSON.parse(json);
      return new CalendarSettings(data);
    } catch {
      return new CalendarSettings();
    }
  }

  public toJson(): string {
    return JSON.stringify({
      primaryColor: this.primaryColor,
      backgroundColor: this.backgroundColor,
      accentColor: this.accentColor,
      defaultView: this.defaultView,
      showWeekends: this.showWeekends,
      borderRadius: this.borderRadius,
      showBorder: this.showBorder,
      style: this.style,
    });
  }

  public update(changes: Partial<CalendarSettings>): CalendarSettings {
    return new CalendarSettings({
      primaryColor: changes.primaryColor ?? this.primaryColor,
      backgroundColor: changes.backgroundColor ?? this.backgroundColor,
      accentColor: changes.accentColor ?? this.accentColor,
      defaultView: changes.defaultView ?? this.defaultView,
      showWeekends: changes.showWeekends ?? this.showWeekends,
      borderRadius: changes.borderRadius ?? this.borderRadius,
      showBorder: changes.showBorder ?? this.showBorder,
      style: changes.style ?? this.style,
    });
  }
} 