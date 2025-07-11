import { Widget } from '../entities/Widget';
import { WidgetFactory, WidgetRepository } from '../repositories/WidgetRepository';

// Use Cases - application business logic
export class CreateWidgetUseCase {
  constructor(
    private widgetRepository: WidgetRepository,
    private widgetFactory: WidgetFactory
  ) { }

  async execute(type: string, customSettings?: Record<string, any>): Promise<Widget> {
    const defaultSettings = this.widgetFactory.getDefaultSettings(type);
    const settings = { ...defaultSettings, ...customSettings };

    const widget = this.widgetFactory.createWidget(type, settings);
    await this.widgetRepository.save(widget);

    return widget;
  }
}

export class UpdateWidgetUseCase {
  constructor(private widgetRepository: WidgetRepository) { }

  async execute(widgetId: string, newSettings: Record<string, any>): Promise<Widget> {
    const widget = await this.widgetRepository.findById(widgetId);
    if (!widget) {
      throw new Error(`Widget with id ${widgetId} not found`);
    }

    const updatedWidget = widget.updateSettings(newSettings);
    await this.widgetRepository.save(updatedWidget);

    return updatedWidget;
  }
}

export class GetWidgetEmbedUrlUseCase {
  constructor(private widgetRepository: WidgetRepository) { }

  execute(widget: Widget): string {
    return this.widgetRepository.saveToUrl(widget);
  }
}

export class LoadWidgetFromUrlUseCase {
  constructor(private widgetRepository: WidgetRepository) { }

  execute(url: string): Widget | null {
    return this.widgetRepository.loadFromUrl(url);
  }
}

export class ListAvailableWidgetsUseCase {
  constructor(private widgetFactory: WidgetFactory) { }

  execute(): string[] {
    return this.widgetFactory.getSupportedTypes();
  }
} 