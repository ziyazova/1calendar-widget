import { Widget } from '../../domain/entities/Widget';
import { WidgetRepository } from '../../domain/repositories/WidgetRepository';
import { CalendarSettings } from '../../domain/value-objects/CalendarSettings';
import { ClockSettings } from '../../domain/value-objects/ClockSettings';
import { UrlCodecService } from '../services/url-codec/UrlCodecService';

// Infrastructure implementation of Widget Repository
export class WidgetRepositoryImpl implements WidgetRepository {
  private widgets: Map<string, Widget> = new Map();
  private urlCodec: UrlCodecService;

  constructor() {
    this.urlCodec = new UrlCodecService();
  }

  async save(widget: Widget): Promise<void> {
    this.widgets.set(widget.id, widget);
  }

  async findById(id: string): Promise<Widget | null> {
    return this.widgets.get(id) || null;
  }

  async findAll(): Promise<Widget[]> {
    return Array.from(this.widgets.values());
  }

  async delete(id: string): Promise<void> {
    this.widgets.delete(id);
  }

  saveToUrl(widget: Widget): string {
    const config = widget.getEmbedConfig();
    const baseUrl = window.location.origin;
    const route = this.urlCodec.getWidgetEmbedRoute(widget.type);

    return this.urlCodec.createEmbedUrl(baseUrl, route, config);
  }

  loadFromUrl(url: string): Widget | null {
    const config = this.urlCodec.extractConfigFromUrl(url);
    if (!config || !config.widgetType || !config.settings) {
      return null;
    }

    try {
      // Create widget using settings
      let settings;

      switch (config.widgetType) {
        case 'calendar':
          settings = new CalendarSettings(config.settings);
          return Widget.createCalendar('embed-widget', settings);
        case 'clock':
          settings = new ClockSettings(config.settings);
          return Widget.createClock('embed-widget', settings);
        default:
          console.error('Unsupported widget type:', config.widgetType);
          return null;
      }
    } catch (error) {
      console.error('Failed to create widget from URL config:', error);
      return null;
    }
  }

  encodeConfig(config: Record<string, any>): string {
    return this.urlCodec.encode(config);
  }

  decodeConfig(encoded: string): Record<string, any> | null {
    return this.urlCodec.decode(encoded);
  }
} 