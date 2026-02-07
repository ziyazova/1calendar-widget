import { CompactUrlCodec } from './CompactUrlCodec';
import { Logger } from '../Logger';

// Infrastructure service for URL encoding/decoding
export class UrlCodecService {
  private static readonly CONFIG_PARAM = 'config';
  private static readonly COMPACT_PARAM = 'c'; // Короткий параметр

  // Encode object to base64 URL parameter (legacy)
  encode(data: Record<string, any>): string {
    try {
      const jsonString = JSON.stringify(data);
      const base64String = btoa(jsonString);
      return base64String;
    } catch (error) {
      throw new Error('Failed to encode data to URL');
    }
  }

  // Decode base64 URL parameter to object (legacy)
  decode(encoded: string): Record<string, any> | null {
    try {
      const jsonString = atob(encoded);
      const data = JSON.parse(jsonString);
      return data;
    } catch (error) {
      return null;
    }
  }

  // Компактное кодирование - новый метод
  encodeCompact(widgetType: string, settings: Record<string, any>): string {
    return CompactUrlCodec.encode(widgetType, settings);
  }

  // Компактное декодирование - новый метод  
  decodeCompact(encoded: string): { widgetType: string; settings: Record<string, any> } | null {
    return CompactUrlCodec.decode(encoded);
  }

  // Create full URL with encoded config (uses compact encoding by default)
  createEmbedUrl(
    baseUrl: string,
    route: string,
    config: Record<string, any>,
    useCompact: boolean = true
  ): string {
    if (useCompact && config.widgetType) {
      return CompactUrlCodec.createCompactEmbedUrl(baseUrl, config.widgetType, config.settings || config);
    }

    // Fallback to legacy encoding
    const encodedConfig = this.encode(config);
    const url = new URL(`${route}`, baseUrl);
    url.searchParams.set(UrlCodecService.CONFIG_PARAM, encodedConfig);
    return url.toString();
  }

  // Extract config from current URL (tries compact first, then legacy)
  extractConfigFromUrl(url?: string): Record<string, any> | null {
    try {
      const urlObj = new URL(url || window.location.href);

      // Сначала пробуем компактный формат
      const compactParam = urlObj.searchParams.get(UrlCodecService.COMPACT_PARAM);
      if (compactParam) {
        const decoded = this.decodeCompact(compactParam);
        if (decoded) {
          return {
            widgetType: decoded.widgetType,
            settings: decoded.settings
          };
        }
      }

      // Fallback на старый формат
      const configParam = urlObj.searchParams.get(UrlCodecService.CONFIG_PARAM);
      if (configParam) {
        return this.decode(configParam);
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  // Update URL with new config (browser history)
  updateBrowserUrl(config: Record<string, any>, useCompact: boolean = true): void {
    try {
      const url = new URL(window.location.href);

      if (useCompact && config.widgetType) {
        // Убираем старый параметр
        url.searchParams.delete(UrlCodecService.CONFIG_PARAM);
        // Добавляем компактный
        const encoded = this.encodeCompact(config.widgetType, config.settings || config);
        url.searchParams.set(UrlCodecService.COMPACT_PARAM, encoded);
      } else {
        // Legacy режим
        const encoded = this.encode(config);
        url.searchParams.set(UrlCodecService.CONFIG_PARAM, encoded);
      }

      // Update URL without page reload
      window.history.replaceState({}, '', url.toString());
    } catch (error) {
      Logger.error('UrlCodecService', 'Failed to update browser URL', error);
    }
  }

  // Generate widget-specific embed route
  getWidgetEmbedRoute(widgetType: string): string {
    return `/embed/${widgetType}`;
  }

  // Быстрый метод создания супер короткой ссылки
  createSuperCompactUrl(baseUrl: string, widgetType: string, settings: Record<string, any>): string {
    return CompactUrlCodec.createCompactEmbedUrl(baseUrl, widgetType, settings);
  }
} 