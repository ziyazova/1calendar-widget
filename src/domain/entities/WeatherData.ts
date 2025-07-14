export interface WeatherCurrent {
  icon: string;
  summary: string;
  temp: number;
  feelsLike: number;
  cloudCover: number;
  percipitation: number;
  windSpeed: number;
  windDir: number;
  humidity: number;
  visibility: number;
  pressure: number;
}

export interface WeatherHourly {
  hour: string;
  temp: number;
  summary: string;
  icon: string;
}

export interface WeatherForecast {
  date: number;
  maxTemp: number;
  minTemp: number;
  sunrise: string;
  sunset: string;
  summary: string;
  windSpeed: number;
  windDir: number;
  percipitation: number;
  humidity: number;
  pressure: number;
  cloudCover: number;
  dewPoint: string;
  chancePrecipitation: number;
  chanceRain: number;
  chanceSnow: number;
  chanceThunder: number;
  chanceSleet: number;
  icon: string;
  day: string;
  dayShort: string;
}

export interface WeatherApiResponse {
  source: string;
  timezone_shift: number;
  current: WeatherCurrent;
  nextHours: WeatherHourly[];
  forecast: WeatherForecast[];
} 