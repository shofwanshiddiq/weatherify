import React, { useState } from 'react';
import IndonesiaMap from './IndonesiaMap';
import type { CityWeather, TempUnit } from '../types/weather';
import { getWeatherEmoji, getTempColor, displayTemp } from '../utils/weatherUtils';

interface Props {
  cities: CityWeather[];
  unit: TempUnit;
}

const IndonesiaSection: React.FC<Props> = ({ cities, unit }) => {
  const [selectedId, setSelectedId] = useState(cities[0].id);
  const selected = cities.find(c => c.id === selectedId) ?? cities[0];
  const tempColor = getTempColor(selected.temp);

  return (
    <section className="section indonesia-section">
      <div className="section-header">
        <h2 className="section-title">🇮🇩 Indonesia</h2>
        <span className="section-sub">{cities.length} major cities</span>
      </div>

      <div className="indonesia-layout">
        {/* Map */}
        <div className="indonesia-map-wrap">
          <IndonesiaMap cities={cities} unit={unit} onSelectCity={setSelectedId} />
        </div>

        {/* Selected city detail */}
        <div className="indonesia-detail">
          <div className="id-city-header">
            <div className="id-emoji">{getWeatherEmoji(selected.condition)}</div>
            <div>
              <div className="id-city-name">{selected.city}</div>
              <div className="id-timezone">{selected.timezone} · {selected.localTime}</div>
            </div>
            <div className="id-temp" style={{ color: tempColor }}>
              {displayTemp(selected.temp, unit)}°{unit}
            </div>
          </div>
          <div className="id-desc">{selected.description}</div>
          <div className="id-stats">
            <div className="id-stat"><span>💧</span><span>{selected.humidity}%</span><span>Humidity</span></div>
            <div className="id-stat"><span>🌬️</span><span>{selected.windSpeed}</span><span>km/h</span></div>
            <div className="id-stat"><span>☀️</span><span>{selected.uvIndex}</span><span>UV</span></div>
            <div className="id-stat"><span>🌧️</span><span>{selected.daily[0]?.precipitation ?? 0}%</span><span>Rain</span></div>
          </div>
          <div className="id-weekly">
            {selected.daily.slice(0, 3).map((d, i) => (
              <div key={i} className="id-day">
                <span>{d.day}</span>
                <span>{getWeatherEmoji(d.condition)}</span>
                <span style={{ color: getTempColor(d.high) }}>{displayTemp(d.high, unit)}°</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* City pill row */}
      <div className="indonesia-pills">
        {cities.map(c => (
          <button key={c.id}
            className={`id-pill ${c.id === selectedId ? 'active' : ''}`}
            onClick={() => setSelectedId(c.id)}
            style={c.id === selectedId ? { borderColor: getTempColor(c.temp), color: getTempColor(c.temp) } : undefined}>
            {getWeatherEmoji(c.condition)} {c.city}
            <span className="id-pill-temp">{displayTemp(c.temp, unit)}°</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default IndonesiaSection;
