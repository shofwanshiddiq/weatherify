import React, { useState } from 'react';
import type { CityWeather, TempUnit } from '../types/weather';
import { getWeatherEmoji } from '../utils/weatherUtils';

interface Props { unit: TempUnit;
  cities: CityWeather[];
}

interface Alert {
  city: string;
  icon: string;
  type: string;
  message: string;
  severity: 'info' | 'warning' | 'danger';
}

const WeatherAlerts: React.FC<Props> = ({ cities, unit: _unit }) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'compare' | 'extreme'>('alerts');

  const alerts: Alert[] = cities
    .flatMap((c) => {
      const list: Alert[] = [];
      if (c.temp >= 38) list.push({ city: c.city, icon: '🔥', type: 'Extreme Heat', message: `${c.temp}°C – Heat advisory in effect. Stay hydrated.`, severity: 'danger' });
      if (c.temp <= 0) list.push({ city: c.city, icon: '🧊', type: 'Freezing', message: `${c.temp}°C – Ice possible. Roads hazardous.`, severity: 'warning' });
      if (c.condition === 'stormy' || c.condition === 'thunderstorm') list.push({ city: c.city, icon: '⛈️', type: 'Severe Storm', message: 'Thunderstorm alert. Avoid outdoor activities.', severity: 'danger' });
      if (c.condition === 'tornado') list.push({ city: c.city, icon: '🌪️', type: 'Tornado Warning', message: 'Seek shelter immediately!', severity: 'danger' });
      if (c.humidity >= 85) list.push({ city: c.city, icon: '💦', type: 'High Humidity', message: `${c.humidity}% humidity – Feels oppressive.`, severity: 'info' });
      if (c.windSpeed >= 30) list.push({ city: c.city, icon: '🌬️', type: 'Strong Winds', message: `${c.windSpeed} km/h gusts. Secure loose items.`, severity: 'warning' });
      if (c.uvIndex >= 10) list.push({ city: c.city, icon: '☀️', type: 'Extreme UV', message: `UV Index ${c.uvIndex}. Apply SPF 50+.`, severity: 'warning' });
      if (c.airQuality > 100) list.push({ city: c.city, icon: '😷', type: 'Poor Air Quality', message: `AQI ${c.airQuality}. Sensitive groups should stay indoors.`, severity: 'warning' });
      return list;
    });

  const extremes = {
    hottest: [...cities].sort((a, b) => b.temp - a.temp)[0],
    coldest: [...cities].sort((a, b) => a.temp - b.temp)[0],
    windiest: [...cities].sort((a, b) => b.windSpeed - a.windSpeed)[0],
    mostHumid: [...cities].sort((a, b) => b.humidity - a.humidity)[0],
    bestAir: [...cities].sort((a, b) => a.airQuality - b.airQuality)[0],
  };

  const severityColor: Record<string, string> = {
    info: 'rgba(56,189,248,0.15)',
    warning: 'rgba(251,191,36,0.15)',
    danger: 'rgba(239,68,68,0.15)',
  };
  const severityBorder: Record<string, string> = {
    info: 'rgba(56,189,248,0.4)',
    warning: 'rgba(251,191,36,0.4)',
    danger: 'rgba(239,68,68,0.4)',
  };

  return (
    <div className="alerts-panel">
      <div className="alerts-tabs">
        {(['alerts', 'compare', 'extreme'] as const).map(tab => (
          <button
            key={tab}
            className={`alerts-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'alerts' ? '🚨 Alerts' : tab === 'compare' ? '📊 Compare' : '🏆 Extremes'}
          </button>
        ))}
      </div>

      {activeTab === 'alerts' && (
        <div className="alerts-list">
          {alerts.length === 0 ? (
            <div className="no-alerts">✅ No active alerts across tracked cities</div>
          ) : (
            alerts.map((a, i) => (
              <div
                key={i}
                className="alert-item"
                style={{ background: severityColor[a.severity], borderLeft: `3px solid ${severityBorder[a.severity]}` }}
              >
                <div className="alert-icon">{a.icon}</div>
                <div>
                  <div className="alert-header">
                    <span className="alert-type">{a.type}</span>
                    <span className="alert-city">· {a.city}</span>
                  </div>
                  <div className="alert-msg">{a.message}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'compare' && (
        <div className="compare-grid">
          <div className="compare-header">
            <span>City</span><span>Temp</span><span>Humidity</span><span>Wind</span><span>Condition</span>
          </div>
          {cities.map(c => (
            <div key={c.id} className="compare-row">
              <span className="compare-city">{c.city}</span>
              <span className="compare-temp" style={{ color: c.temp > 30 ? '#f97316' : c.temp < 5 ? '#60a5fa' : '#86efac' }}>
                {c.temp}°C
              </span>
              <span className="compare-val">{c.humidity}%</span>
              <span className="compare-val">{c.windSpeed}</span>
              <span>{getWeatherEmoji(c.condition)}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'extreme' && (
        <div className="extremes-list">
          {[
            { icon: '🔥', label: 'Hottest', city: extremes.hottest, val: `${extremes.hottest.temp}°C` },
            { icon: '🧊', label: 'Coldest', city: extremes.coldest, val: `${extremes.coldest.temp}°C` },
            { icon: '🌬️', label: 'Windiest', city: extremes.windiest, val: `${extremes.windiest.windSpeed} km/h` },
            { icon: '💧', label: 'Most Humid', city: extremes.mostHumid, val: `${extremes.mostHumid.humidity}%` },
            { icon: '🌿', label: 'Best Air', city: extremes.bestAir, val: `AQI ${extremes.bestAir.airQuality}` },
          ].map(e => (
            <div key={e.label} className="extreme-item">
              <div className="extreme-icon">{e.icon}</div>
              <div className="extreme-info">
                <div className="extreme-label">{e.label}</div>
                <div className="extreme-city">{e.city.city}, {e.city.country}</div>
              </div>
              <div className="extreme-val">{e.val}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherAlerts;
