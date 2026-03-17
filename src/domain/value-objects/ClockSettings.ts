export class ClockSettings {
  public readonly primaryColor: string;
  public readonly backgroundColor: string;
  public readonly accentColor: string;
  public readonly showSeconds: boolean;
  public readonly format24h: boolean;
  public readonly borderRadius: number;
  public readonly showBorder: boolean;
  public readonly showDate: boolean;
  public readonly fontSize: 'small' | 'medium' | 'large';
  public readonly style: 'modern' | 'analog-classic' | 'classic' | 'flower' | 'dreamy';
  public readonly clockFrame: 'flower' | 'alarm' | 'vintage';
  public readonly embedWidth: number;
  public readonly embedHeight: number;
  public readonly theme: 'auto' | 'light' | 'dark';
  public readonly clockColor: string;

  constructor(settings: Partial<ClockSettings> = {}) {
    this.primaryColor = settings.primaryColor || (settings.style === 'dreamy' ? '#1F1F1F' : '#667EEA');
    this.backgroundColor = settings.backgroundColor || '#ffffff';
    this.accentColor = settings.accentColor || '#f1f5f9';
    this.showSeconds = settings.showSeconds ?? (settings.style === 'dreamy' ? false : true);
    this.format24h = settings.format24h ?? true;
    this.borderRadius = settings.borderRadius ?? 12;
    this.showBorder = settings.showBorder ?? true;
    this.showDate = settings.showDate ?? true;
    this.fontSize = settings.fontSize || 'medium';
    this.style = settings.style || 'modern';
    this.clockFrame = settings.clockFrame || 'flower';
    this.embedWidth = settings.embedWidth ?? 360;
    this.embedHeight = settings.embedHeight ?? 360;
    this.theme = settings.theme || 'auto';
    this.clockColor = settings.clockColor || 'green';
  }

  public static fromJson(json: string): ClockSettings {
    try {
      const data = JSON.parse(json);
      return new ClockSettings(data);
    } catch {
      return new ClockSettings();
    }
  }

  public toJson(): string {
    return JSON.stringify({
      primaryColor: this.primaryColor,
      backgroundColor: this.backgroundColor,
      accentColor: this.accentColor,
      showSeconds: this.showSeconds,
      format24h: this.format24h,
      borderRadius: this.borderRadius,
      showBorder: this.showBorder,
      showDate: this.showDate,
      fontSize: this.fontSize,
      style: this.style,
      clockFrame: this.clockFrame,
      embedWidth: this.embedWidth,
      embedHeight: this.embedHeight,
      theme: this.theme,
      clockColor: this.clockColor,
    });
  }

  public update(changes: Partial<ClockSettings>): ClockSettings {
    return new ClockSettings({
      primaryColor: changes.primaryColor ?? this.primaryColor,
      backgroundColor: changes.backgroundColor ?? this.backgroundColor,
      accentColor: changes.accentColor ?? this.accentColor,
      showSeconds: changes.showSeconds ?? this.showSeconds,
      format24h: changes.format24h ?? this.format24h,
      borderRadius: changes.borderRadius ?? this.borderRadius,
      showBorder: changes.showBorder ?? this.showBorder,
      showDate: changes.showDate ?? this.showDate,
      fontSize: changes.fontSize ?? this.fontSize,
      style: changes.style ?? this.style,
      clockFrame: changes.clockFrame ?? this.clockFrame,
      embedWidth: changes.embedWidth ?? this.embedWidth,
      embedHeight: changes.embedHeight ?? this.embedHeight,
      theme: changes.theme ?? this.theme,
      clockColor: changes.clockColor ?? this.clockColor,
    });
  }
} 