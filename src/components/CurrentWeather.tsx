import React, { useState, useEffect } from 'react';
import type { CityWeather, TempUnit } from '../types/weather';
import { getWeatherEmoji, getAQILabel, displayTemp, displayTempLabel } from '../utils/weatherUtils';

interface Props {
  weather: CityWeather;
  unit: TempUnit;
}

const StatCard: React.FC<{ label: string; value: string; sub?: string; icon: string }> = ({ label, value, sub, icon }) => (
  <div className="stat-card">
    <span className="stat-icon">{icon}</span>
    <div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  </div>
);

const CurrentWeather: React.FC<Props> = ({ weather, unit }) => {
  const [time, setTime] = useState(new Date());
  const aqi = getAQILabel(weather.airQuality);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const precipChance = weather.daily[0]?.precipitation ?? 0;

  return (
    <div className="current-weather-card">
      <div className="cw-header">
        <div>
          <div className="cw-location">
            <span>📍</span>
            <span>{weather.city}, {weather.country}</span>
          </div>
          <div className="cw-date">{formatDate(time)}</div>
        </div>
        <div className="cw-clock">{formatTime(time)}</div>
      </div>

      <div className="cw-main">
        <div className="cw-emoji">{getWeatherEmoji(weather.condition)}</div>
        <div className="cw-temp-block">
          <div className="cw-temp">
            {displayTemp(weather.temp, unit)}°<span className="cw-unit">{unit}</span>
          </div>
          <div className="cw-feels">Feels like {displayTempLabel(weather.feelsLike, unit)}</div>
          <div className="cw-desc">{weather.description}</div>
        </div>
      </div>

      {/* Sun times – separate row, no overlap */}
      <div className="cw-sun-row">
        <div className="cw-sun-item">
          <span className="sun-emoji">🌅</span>
          <div>
            <div className="sun-label">Sunrise</div>
            <div className="sun-time">{weather.sunrise}</div>
          </div>
        </div>
        <div className="sun-arc-wrap">
          <svg viewBox="0 0 80 38" width="80">
            <path d="M 5 34 Q 40 2 75 34" fill="none" stroke="rgba(251,191,36,0.25)" strokeWidth="1.5" />
            <circle cx="40" cy="18" r="5" fill="#fbbf24" opacity="0.85" />
          </svg>
        </div>
        <div className="cw-sun-item">
          <span className="sun-emoji">🌇</span>
          <div>
            <div className="sun-label">Sunset</div>
            <div className="sun-time">{weather.sunset}</div>
          </div>
        </div>
      </div>

      <div className="cw-stats">
        <StatCard icon="💧" label="Humidity" value={`${weather.humidity}%`} />
        <StatCard icon="🌬️" label="Wind" value={`${weather.windSpeed} km/h`} sub={weather.windDirection} />
        <StatCard icon="👁️" label="Visibility" value={`${weather.visibility} km`} />
        <StatCard icon="🌡️" label="Pressure" value={`${weather.pressure} hPa`} />
        <StatCard icon="☀️" label="UV Index" value={`${weather.uvIndex}`} sub={weather.uvIndex >= 8 ? 'Very High' : weather.uvIndex >= 6 ? 'High' : 'Moderate'} />
        <StatCard icon="🌧️" label="Precip." value={`${precipChance}%`} sub="chance today" />
      </div>

      <div className="cw-aqi">
        <div className="aqi-label-row">
          <span>🌿 Air Quality Index</span>
          <span style={{ color: aqi.color, fontWeight: 700 }}>{aqi.label}</span>
        </div>
        <div className="aqi-bar">
          <div className="aqi-fill" style={{ width: `${Math.min(weather.airQuality, 300) / 3}%`, background: aqi.color }} />
        </div>
        <div className="aqi-value">{weather.airQuality} AQI</div>
      </div>

      {/* Hourly forecast – scrollable, no clip */}
      <div className="cw-hourly">
        <div className="section-title">Today's Forecast</div>
        <div className="hourly-scroll">
          {weather.hourly.map((h, i) => (
            <div key={i} className="hourly-item">
              <div className="hourly-time">{h.hour}</div>
              <div className="hourly-emoji">{getWeatherEmoji(h.condition)}</div>
              <div className="hourly-temp">{displayTemp(h.temp, unit)}°</div>
              {h.precipitation > 20 && (
                <div className="hourly-rain">💧 {h.precipitation}%</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
