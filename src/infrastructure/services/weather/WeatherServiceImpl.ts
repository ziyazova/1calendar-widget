import { WeatherService } from '../../../domain/repositories/WeatherService';
import { WeatherApiResponse } from '../../../domain/entities/WeatherData';

// Карта городов для теста
const CITY_COORDS: Record<string, { lat: string; lon: string; url: string }> = {
  Moscow: {
    lat: '55.7558',
    lon: '37.6176',
    url: '31d2029d92/alexandria',
  },
  London: {
    lat: '51.5074',
    lon: '-0.1278',
    url: '31d2029d92/alexandria',
  },
  'New York': {
    lat: '40.7128',
    lon: '-74.0060',
    url: '31d2029d92/alexandria',
  },
  Tokyo: {
    lat: '35.6895',
    lon: '139.6917',
    url: '31d2029d92/alexandria',
  },
  Alexandria: {
    lat: '31.2001',
    lon: '29.9187',
    url: '31d2029d92/alexandria',
  },
};

const DEFAULT_CITY = 'Moscow';

export class WeatherServiceImpl implements WeatherService {
  private readonly baseUrl = 'https://forecast7.com/en';

  async getWeatherData(location: string): Promise<WeatherApiResponse> {
    // Геокодинг: ищем город в списке
    const cityKey = Object.keys(CITY_COORDS).find(
      (name) => name.toLowerCase() === location.toLowerCase()
    ) || DEFAULT_CITY;
    const city = CITY_COORDS[cityKey];
    // Формируем URL для API
    const url = `${this.baseUrl}/${city.url}/?format=json`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: WeatherApiResponse = await response.json();
    return data;
  }
} 