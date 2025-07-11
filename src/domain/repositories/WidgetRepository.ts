import { Widget } from '../entities/Widget';

// Repository interface - part of domain layer
export interface WidgetRepository {
  // CRUD operations
  save(widget: Widget): Promise<void>;
  findById(id: string): Promise<Widget | null>;
  findAll(): Promise<Widget[]>;
  delete(id: string): Promise<void>;

  // Widget-specific operations
  saveToUrl(widget: Widget): string;
  loadFromUrl(url: string): Widget | null;

  // Configuration operations
  encodeConfig(config: Record<string, any>): string;
  decodeConfig(encoded: string): Record<string, any> | null;
}

// Widget factory interface
export interface WidgetFactory {
  createWidget(type: string, settings: Record<string, any>): Widget;
  getSupportedTypes(): string[];
  getDefaultSettings(type: string): Record<string, any>;
} 