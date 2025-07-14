import { useState, useEffect } from 'react';
import { WeatherApiResponse } from '../../domain/entities/WeatherData';
import { WeatherService } from '../../domain/repositories/WeatherService';

export const useWeatherData = (weatherService: WeatherService, location: string) => {
  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await weatherService.getWeatherData(location);
        setWeatherData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    if (location) {
      fetchWeatherData();
    }
  }, [weatherService, location]);

  return { weatherData, loading, error };
}; 