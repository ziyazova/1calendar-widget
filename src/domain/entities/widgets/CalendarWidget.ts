import { CalendarSettings } from '../../value-objects/CalendarSettings';
import { Widget } from '../Widget';

export class CalendarWidget extends Widget {
  constructor(
    id: string,
    settings: CalendarSettings
  ) {
    super(id, 'calendar', 'Calendar', settings);
  }

  render(): string {
    // This will be handled by React components in presentation layer
    return 'calendar-component';
  }

  getEmbedConfig(): Record<string, any> {
    return {
      widgetType: this.type,
      settings: this.settings,
      timestamp: Date.now()
    };
  }

  validateSettings(settings: Record<string, any>): boolean {
    try {
      return CalendarSettings.isValid(settings);
    } catch {
      return false;
    }
  }

  protected createNew(settings: Record<string, any>): CalendarWidget {
    return new CalendarWidget(this.id, settings as CalendarSettings);
  }

  // Calendar-specific methods
  getCurrentMonth(): number {
    return this.settings.currentMonth || new Date().getMonth();
  }

  getCurrentYear(): number {
    return this.settings.currentYear || new Date().getFullYear();
  }

  getBackgroundColor(): string {
    return this.settings.backgroundColor || '#6366F1';
  }

  getOpacity(): number {
    return this.settings.opacity || 15;
  }

  getBorderRadius(): number {
    return this.settings.borderRadius || 24;
  }

  getFirstDayOfWeek(): 0 | 1 {
    return this.settings.firstDayOfWeek || 1;
  }
} 