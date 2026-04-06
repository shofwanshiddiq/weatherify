import React from 'react';
import type { CityWeather, TempUnit } from '../types/weather';
import { getWeatherEmoji, getWeatherLabel, getTempColor, displayTemp, displayTempLabel } from '../utils/weatherUtils';

interface Props {
  weather: CityWeather;
  onClose: () => void;
  unit: TempUnit;
}

const CityDetail: React.FC<Props> = ({ weather, onClose, unit }) => {
  const tempColor = getTempColor(weather.temp);

  return (
    <div className="city-detail-overlay" onClick={onClose}>
      <div className="city-detail-panel" onClick={e => e.stopPropagation()}>
        <button className="detail-close" onClick={onClose}>✕</button>

        <div className="detail-header">
          <div className="detail-flag">{weather.countryCode}</div>
          <div>
            <div className="detail-city">{weather.city}</div>
            <div className="detail-country">{weather.country} · {weather.timezone}</div>
          </div>
        </div>

        <div className="detail-main">
          <div className="detail-emoji">{getWeatherEmoji(weather.condition)}</div>
          <div>
            <div className="detail-temp" style={{ color: tempColor }}>
              {displayTemp(weather.temp, unit)}°{unit}
            </div>
            <div className="detail-condition">{getWeatherLabel(weather.condition)}</div>
          </div>
        </div>

        <div className="detail-desc">{weather.description}</div>

        <div className="detail-grid">
          {[
            { icon: '💧', label: 'Humidity', val: `${weather.humidity}%` },
            { icon: '🌬️', label: 'Wind', val: `${weather.windSpeed} km/h ${weather.windDirection}` },
            { icon: '👁️', label: 'Visibility', val: `${weather.visibility} km` },
            { icon: '🌡️', label: 'Pressure', val: `${weather.pressure} hPa` },
            { icon: '☀️', label: 'UV Index', val: `${weather.uvIndex}` },
            { icon: '🌡️', label: 'Feels Like', val: displayTempLabel(weather.feelsLike, unit) },
          ].map(item => (
            <div key={item.label} className="detail-stat">
              <span>{item.icon}</span>
              <div>
                <div className="d-stat-val">{item.val}</div>
                <div className="d-stat-label">{item.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="detail-daily-title">7-Day Outlook</div>
        <div className="detail-daily">
          {weather.daily.map((d, i) => (
            <div key={i} className="d-day-row">
              <div className="d-day-name">{d.day}</div>
              <div className="d-day-emoji">{getWeatherEmoji(d.condition)}</div>
              <div className="d-day-bar">
                <div className="d-day-bar-fill" style={{
                  width: `${d.precipitation}%`,
                  background: `linear-gradient(90deg, ${getTempColor(d.low)}, ${getTempColor(d.high)})`
                }} />
              </div>
              <div className="d-day-temps">
                <span style={{ color: getTempColor(d.low) }}>{displayTemp(d.low, unit)}°</span>
                <span style={{ color: 'rgba(255,255,255,0.3)' }}> / </span>
                <span style={{ color: getTempColor(d.high) }}>{displayTemp(d.high, unit)}°</span>
              </div>
            </div>
          ))}
        </div>

        <div className="detail-sun">
          <div className="sun-row">
            <span>🌅</span>
            <div>
              <div className="sun-tag">Sunrise</div>
              <div className="sun-t">{weather.sunrise}</div>
            </div>
          </div>
          <svg viewBox="0 0 120 60" style={{ width: 100 }}>
            <path d="M 10 50 Q 60 5 110 50" fill="none" stroke="rgba(251,191,36,0.3)" strokeWidth="2" />
            <circle cx="60" cy="28" r="6" fill="#fbbf24" opacity="0.9" />
          </svg>
          <div className="sun-row">
            <span>🌇</span>
            <div>
              <div className="sun-tag">Sunset</div>
              <div className="sun-t">{weather.sunset}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityDetail;
