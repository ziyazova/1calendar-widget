import { WeatherApiResponse } from '../entities/WeatherData';

export interface WeatherService {
  getWeatherData(location: string): Promise<WeatherApiResponse>;
} 