export class BoardSettings {
  public readonly primaryColor: string;
  public readonly backgroundColor: string;
  public readonly accentColor: string;
  public readonly borderRadius: number;
  public readonly showBorder: boolean;
  public readonly embedWidth: number;
  public readonly embedHeight: number;
  public readonly theme: 'auto' | 'light' | 'dark';
  public readonly imageUrls: string[];
  public readonly layout: 'grid' | 'masonry' | 'slideshow';
  public readonly columns: 2 | 3;
  public readonly gap: number;

  constructor(settings: Partial<BoardSettings> = {}) {
    this.primaryColor = settings.primaryColor || '#667EEA';
    this.backgroundColor = settings.backgroundColor || '#ffffff';
    this.accentColor = settings.accentColor || '#f1f5f9';
    this.borderRadius = settings.borderRadius ?? 12;
    this.showBorder = settings.showBorder ?? true;
    this.embedWidth = settings.embedWidth ?? 420;
    this.embedHeight = settings.embedHeight ?? 420;
    this.theme = settings.theme || 'auto';
    this.imageUrls = Array.isArray(settings.imageUrls) ? settings.imageUrls.slice(0, 8) : [];
    this.layout = settings.layout || 'grid';
    this.columns = settings.columns === 3 ? 3 : 2;
    this.gap = settings.gap ?? 8;
  }

  public static fromJson(json: string): BoardSettings {
    try {
      const data = JSON.parse(json);
      return new BoardSettings(data);
    } catch {
      return new BoardSettings();
    }
  }

  public toJson(): string {
    return JSON.stringify({
      primaryColor: this.primaryColor,
      backgroundColor: this.backgroundColor,
      accentColor: this.accentColor,
      borderRadius: this.borderRadius,
      showBorder: this.showBorder,
      embedWidth: this.embedWidth,
      embedHeight: this.embedHeight,
      theme: this.theme,
      imageUrls: this.imageUrls,
      layout: this.layout,
      columns: this.columns,
      gap: this.gap,
    });
  }

  public update(changes: Partial<BoardSettings>): BoardSettings {
    return new BoardSettings({
      primaryColor: changes.primaryColor ?? this.primaryColor,
      backgroundColor: changes.backgroundColor ?? this.backgroundColor,
      accentColor: changes.accentColor ?? this.accentColor,
      borderRadius: changes.borderRadius ?? this.borderRadius,
      showBorder: changes.showBorder ?? this.showBorder,
      embedWidth: changes.embedWidth ?? this.embedWidth,
      embedHeight: changes.embedHeight ?? this.embedHeight,
      theme: changes.theme ?? this.theme,
      imageUrls: changes.imageUrls ?? this.imageUrls,
      layout: changes.layout ?? this.layout,
      columns: changes.columns ?? this.columns,
      gap: changes.gap ?? this.gap,
    });
  }
}
