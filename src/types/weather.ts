export type WeatherCondition =
  | 'sunny'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rainy'
  | 'stormy'
  | 'snowy'
  | 'foggy'
  | 'windy'
  | 'drizzle'
  | 'thunderstorm'
  | 'hail'
  | 'tornado';

export type TempUnit = 'C' | 'F';

export interface HourlyForecast {
  hour: string;
  temp: number;
  condition: WeatherCondition;
  precipitation: number;
}

export interface DailyForecast {
  day: string;
  high: number;
  low: number;
  condition: WeatherCondition;
  precipitation: number;
}

export interface CityWeather {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  temp: number;
  feelsLike: number;
  condition: WeatherCondition;
  description: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  visibility: number;
  uvIndex: number;
  pressure: number;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  timezone: string;
  localTime: string;
  sunrise: string;
  sunset: string;
  airQuality: number;
  bgImage?: string;
}

export interface MapCity {
  id: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  temp: number;
  condition: WeatherCondition;
}
