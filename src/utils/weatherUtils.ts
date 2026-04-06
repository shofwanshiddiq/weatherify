import type { WeatherCondition, TempUnit } from '../types/weather';

export const getWeatherEmoji = (condition: WeatherCondition): string => {
  const map: Record<WeatherCondition, string> = {
    sunny: '☀️',
    'partly-cloudy': '⛅',
    cloudy: '☁️',
    rainy: '🌧️',
    stormy: '⛈️',
    snowy: '❄️',
    foggy: '🌫️',
    windy: '💨',
    drizzle: '🌦️',
    thunderstorm: '🌩️',
    hail: '🌨️',
    tornado: '🌪️',
  };
  return map[condition] ?? '🌤️';
};

export const getWeatherLabel = (condition: WeatherCondition): string => {
  const map: Record<WeatherCondition, string> = {
    sunny: 'Sunny',
    'partly-cloudy': 'Partly Cloudy',
    cloudy: 'Cloudy',
    rainy: 'Rainy',
    stormy: 'Stormy',
    snowy: 'Snowy',
    foggy: 'Foggy',
    windy: 'Windy',
    drizzle: 'Drizzle',
    thunderstorm: 'Thunderstorm',
    hail: 'Hail',
    tornado: 'Tornado',
  };
  return map[condition] ?? 'Unknown';
};

export const getTempColor = (temp: number): string => {
  if (temp <= 0) return '#60a5fa';
  if (temp <= 10) return '#93c5fd';
  if (temp <= 18) return '#86efac';
  if (temp <= 25) return '#fde68a';
  if (temp <= 32) return '#fb923c';
  return '#ef4444';
};

export const getAQILabel = (aqi: number): { label: string; color: string } => {
  if (aqi <= 50) return { label: 'Good', color: '#22c55e' };
  if (aqi <= 100) return { label: 'Moderate', color: '#eab308' };
  if (aqi <= 150) return { label: 'Unhealthy (Sensitive)', color: '#f97316' };
  if (aqi <= 200) return { label: 'Unhealthy', color: '#ef4444' };
  return { label: 'Hazardous', color: '#9f1239' };
};

export const toF = (c: number): number => Math.round(c * 9 / 5 + 32);

export const displayTemp = (c: number, unit: TempUnit): string =>
  unit === 'F' ? `${toF(c)}` : `${c}`;

export const displayTempLabel = (c: number, unit: TempUnit): string =>
  unit === 'F' ? `${toF(c)}°F` : `${c}°C`;

export const latLngToSVG = (lat: number, lng: number, width = 900, height = 440): { x: number; y: number } => {
  const x = ((lng + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
};

// Indonesia map lat/lng bounding box → local SVG coords
// Indonesia approx: lat -11 to 6, lng 95 to 141
export const latLngToIndonesiaSVG = (lat: number, lng: number, width = 700, height = 300): { x: number; y: number } => {
  const minLng = 94, maxLng = 142;
  const minLat = -12, maxLat = 7;
  const x = ((lng - minLng) / (maxLng - minLng)) * width;
  const y = ((maxLat - lat) / (maxLat - minLat)) * height;
  return { x, y };
};
