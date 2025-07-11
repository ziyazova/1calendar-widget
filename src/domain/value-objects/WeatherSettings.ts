export class WeatherSettings {
  public readonly primaryColor: string;
  public readonly backgroundColor: string;
  public readonly accentColor: string;
  public readonly opacity: number;
  public readonly borderRadius: number;
  public readonly showBorder: boolean;
  public readonly style: 'current' | 'forecast' | 'minimal';
  public readonly temperatureUnit: 'celsius' | 'fahrenheit';
  public readonly showFeelsLike: boolean;
  public readonly showHumidity: boolean;
  public readonly location: string;

  constructor(settings: Partial<WeatherSettings> = {}) {
    this.primaryColor = settings.primaryColor || '#667EEA';
    this.backgroundColor = settings.backgroundColor || '#ffffff';
    this.accentColor = settings.accentColor || '#f1f5f9';
    this.opacity = settings.opacity ?? 1;
    this.borderRadius = settings.borderRadius ?? 12;
    this.showBorder = settings.showBorder ?? true;
    this.style = settings.style || 'current';
    this.temperatureUnit = settings.temperatureUnit || 'celsius';
    this.showFeelsLike = settings.showFeelsLike ?? true;
    this.showHumidity = settings.showHumidity ?? true;
    this.location = settings.location || 'New York';
  }

  public static fromJson(json: string): WeatherSettings {
    try {
      const data = JSON.parse(json);
      return new WeatherSettings(data);
    } catch {
      return new WeatherSettings();
    }
  }

  public toJson(): string {
    return JSON.stringify({
      primaryColor: this.primaryColor,
      backgroundColor: this.backgroundColor,
      accentColor: this.accentColor,
      opacity: this.opacity,
      borderRadius: this.borderRadius,
      showBorder: this.showBorder,
      style: this.style,
      temperatureUnit: this.temperatureUnit,
      showFeelsLike: this.showFeelsLike,
      showHumidity: this.showHumidity,
      location: this.location,
    });
  }

  public update(changes: Partial<WeatherSettings>): WeatherSettings {
    return new WeatherSettings({
      primaryColor: changes.primaryColor ?? this.primaryColor,
      backgroundColor: changes.backgroundColor ?? this.backgroundColor,
      accentColor: changes.accentColor ?? this.accentColor,
      opacity: changes.opacity ?? this.opacity,
      borderRadius: changes.borderRadius ?? this.borderRadius,
      showBorder: changes.showBorder ?? this.showBorder,
      style: changes.style ?? this.style,
      temperatureUnit: changes.temperatureUnit ?? this.temperatureUnit,
      showFeelsLike: changes.showFeelsLike ?? this.showFeelsLike,
      showHumidity: changes.showHumidity ?? this.showHumidity,
      location: changes.location ?? this.location,
    });
  }
} 