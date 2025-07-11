// Infrastructure service for URL encoding/decoding
export class UrlCodecService {
  private static readonly CONFIG_PARAM = 'config';

  // Encode object to base64 URL parameter
  encode(data: Record<string, any>): string {
    try {
      const jsonString = JSON.stringify(data);
      const base64String = btoa(jsonString);
      return base64String;
    } catch (error) {
      throw new Error('Failed to encode data to URL');
    }
  }

  // Decode base64 URL parameter to object
  decode(encoded: string): Record<string, any> | null {
    try {
      const jsonString = atob(encoded);
      const data = JSON.parse(jsonString);
      return data;
    } catch (error) {
      return null;
    }
  }

  // Create full URL with encoded config
  createEmbedUrl(
    baseUrl: string,
    route: string,
    config: Record<string, any>
  ): string {
    const encodedConfig = this.encode(config);
    const url = new URL(`${route}`, baseUrl);
    url.searchParams.set(UrlCodecService.CONFIG_PARAM, encodedConfig);
    return url.toString();
  }

  // Extract config from current URL
  extractConfigFromUrl(url?: string): Record<string, any> | null {
    try {
      const urlObj = new URL(url || window.location.href);
      const configParam = urlObj.searchParams.get(UrlCodecService.CONFIG_PARAM);

      if (!configParam) {
        return null;
      }

      return this.decode(configParam);
    } catch (error) {
      return null;
    }
  }

  // Update URL with new config (for browser history)
  updateBrowserUrl(config: Record<string, any>): void {
    try {
      const encoded = this.encode(config);
      const url = new URL(window.location.href);
      url.searchParams.set(UrlCodecService.CONFIG_PARAM, encoded);

      // Update URL without page reload
      window.history.replaceState({}, '', url.toString());
    } catch (error) {
      console.error('Failed to update browser URL:', error);
    }
  }

  // Generate widget-specific embed route
  getWidgetEmbedRoute(widgetType: string): string {
    return `/embed/${widgetType}`;
  }
} 