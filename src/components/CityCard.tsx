import React from 'react';
import type { CityWeather, TempUnit } from '../types/weather';
import { getWeatherEmoji, getWeatherLabel, getTempColor, displayTemp } from '../utils/weatherUtils';

interface Props {
  weather: CityWeather;
  onClick: () => void;
  unit: TempUnit;
  isMain?: boolean;
}

const CityCard: React.FC<Props> = ({ weather, onClick, unit, isMain }) => {
  const tempColor = getTempColor(weather.temp);
  const todayForecast = weather.daily[0];

  if (isMain) {
    return (
      <div className="city-card-main-hero" onClick={onClick}
        style={{ backgroundImage: weather.bgImage ? `url(${weather.bgImage})` : undefined }}>
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-location">
            <div className="hero-city">{weather.city}</div>
            <div className="hero-country">{weather.country} · {weather.localTime}</div>
          </div>
          <div className="hero-weather">
            <div className="hero-emoji">{getWeatherEmoji(weather.condition)}</div>
            <div className="hero-temp" style={{ color: tempColor }}>
              {displayTemp(weather.temp, unit)}°{unit}
            </div>
          </div>
          <div className="hero-desc">{weather.description}</div>
          <div className="hero-stats">
            <span>💧 {weather.humidity}%</span>
            <span>🌬️ {weather.windSpeed} km/h</span>
            {todayForecast && <span>🌧️ {todayForecast.precipitation}%</span>}
            <span>☀️ UV {weather.uvIndex}</span>
          </div>
          <div className="hero-week">
            {weather.daily.slice(0, 5).map((d, i) => (
              <div key={i} className="hero-day">
                <div className="hero-day-name">{d.day}</div>
                <div>{getWeatherEmoji(d.condition)}</div>
                <div className="hero-day-hi" style={{ color: getTempColor(d.high) }}>
                  {displayTemp(d.high, unit)}°
                </div>
                <div className="hero-day-lo" style={{ color: getTempColor(d.low) }}>
                  {displayTemp(d.low, unit)}°
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="city-card" onClick={onClick}>
      <div className="city-card-header">
        <div>
          <div className="city-card-name">{weather.city}</div>
          <div className="city-card-country">{weather.country}</div>
        </div>
        <div className="city-card-time">{weather.localTime}</div>
      </div>

      <div className="city-card-main">
        <div className="city-card-emoji">{getWeatherEmoji(weather.condition)}</div>
        <div className="city-card-temp" style={{ color: tempColor }}>
          {displayTemp(weather.temp, unit)}°
        </div>
      </div>

      <div className="city-card-label">{getWeatherLabel(weather.condition)}</div>

      <div className="city-card-stats">
        <span>💧 {weather.humidity}%</span>
        <span>🌬️ {weather.windSpeed}km/h</span>
        {todayForecast && <span>🌧️ {todayForecast.precipitation}%</span>}
      </div>

      <div className="city-card-week">
        {weather.daily.slice(1, 5).map((d, i) => (
          <div key={i} className="mini-day">
            <div className="mini-day-name">{d.day}</div>
            <div>{getWeatherEmoji(d.condition)}</div>
            <div className="mini-day-temp" style={{ color: getTempColor(d.high) }}>
              {displayTemp(d.high, unit)}°
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CityCard;
