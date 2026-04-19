import React, { useState, useEffect, useRef } from 'react';
import WorldMap from './components/WorldMap';
import CurrentWeather from './components/CurrentWeather';
import CityDetail from './components/CityDetail';
import WeatherAlerts from './components/WeatherAlerts';
import IndonesiaMap from './components/IndonesiaMap';
import { majorCities, worldMapCities, currentLocation, indonesiaCities } from './data/weatherData';
import type { TempUnit } from './types/weather';
import './styles.css';

const GLOBAL_OVERVIEW_ROTATE = 3000;

const App: React.FC = () => {
  const [selectedCityId, setSelectedCityId] = useState<string>('new-york');
  const [selectedIndonesiaCityId, setSelectedIndonesiaCityId] = useState<string>('jakarta');
  const [detailCity, setDetailCity] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<'dashboard' | 'map' | 'indonesia' | 'alerts'>('dashboard');
  const [unit, setUnit] = useState<TempUnit>('C');
  const [darkMode, setDarkMode] = useState(true);
  // Global overview city rotation
  const [globalOverviewIdx, setGlobalOverviewIdx] = useState(0);
  // Indonesia overview city rotation
  const [indonesiaOverviewIdx, setIndonesiaOverviewIdx] = useState(0);
  const globalOverviewTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const indonesiaOverviewTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-rotate global overview city
  useEffect(() => {
    globalOverviewTimer.current = setInterval(() => {
      setGlobalOverviewIdx(i => (i + 1) % worldMapCities.length);
      setSelectedCityId(worldMapCities[(globalOverviewIdx + 1) % worldMapCities.length].id);
    }, GLOBAL_OVERVIEW_ROTATE);
    return () => { if (globalOverviewTimer.current) clearInterval(globalOverviewTimer.current); };
  }, [globalOverviewIdx]);

  // Auto-rotate indonesia overview city
  useEffect(() => {
    indonesiaOverviewTimer.current = setInterval(() => {
      setIndonesiaOverviewIdx(i => (i + 1) % indonesiaCities.length);
      setSelectedIndonesiaCityId(indonesiaCities[(indonesiaOverviewIdx + 1) % indonesiaCities.length].id);
    }, GLOBAL_OVERVIEW_ROTATE);
    return () => { if (indonesiaOverviewTimer.current) clearInterval(indonesiaOverviewTimer.current); };
  }, [indonesiaOverviewIdx]);

  useEffect(() => {
    document.body.classList.add('dark')

    return () => {
      document.body.classList.remove('dark')
    }
  }, [])

  const detailWeather = detailCity ? [...majorCities, ...indonesiaCities].find(c => c.id === detailCity) : null;

  const handleMapCitySelect = (id: string) => {
    setSelectedCityId(id);
    const found = majorCities.find(c => c.id === id);
    if (found) setDetailCity(id);
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">🌤</div>
          <div className="logo-text">Weatherify</div>
        </div>

        <nav className="sidebar-nav">
          {([
            { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
            { id: 'map', icon: '🗺', label: 'World Map' },
            { id: 'indonesia', icon: '🇮🇩', label: 'Indonesia' },
            { id: 'alerts', icon: '🚨', label: 'Alerts' },
          ] as const).map(item => (
            <button key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
              title={item.label}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          {/* Theme toggle */}
          <button className="theme-toggle" onClick={() => setDarkMode(d => !d)} title="Toggle theme">
            {darkMode ? '☀️' : '🌙'}
          </button>
          {/* Unit toggle */}
          <div className="sidebar-unit-toggle">
            <button className={`unit-btn ${unit === 'C' ? 'active' : ''}`} onClick={() => setUnit('C')}>°C</button>
            <button className={`unit-btn ${unit === 'F' ? 'active' : ''}`} onClick={() => setUnit('F')}>°F</button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        {/* Top bar */}
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="page-title">
              {activeSection === 'dashboard' && 'Dashboard'}
              {activeSection === 'map' && 'World Map'}
              {activeSection === 'indonesia' && 'Indonesia'}
              {activeSection === 'alerts' && 'Weather Alerts'}
            </h1>
            <div className="topbar-sub">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <div className="topbar-right">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input className="search-input" placeholder="Search cities..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setActiveSection('indonesia')} />
              {searchQuery && <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>}
            </div>
            <div className="topbar-avatar">CD</div>
          </div>
        </header>

        {/* ── DASHBOARD ── */}
        {activeSection === 'dashboard' && (
          <div className="dashboard-layout">
            <div className="dashboard-left">
              <CurrentWeather weather={currentLocation} unit={unit} />
            </div>
            <div className="dashboard-right">
              <section className="section">
                <div className="section-header">
                  <h2 className="section-title">Global Overview</h2>
                  <button className="see-all" onClick={() => setActiveSection('map')}>View Map →</button>
                </div>
                
                {/* Auto-rotating city card */}
                {worldMapCities[globalOverviewIdx] && (() => {
                  const worldCity = worldMapCities[globalOverviewIdx];
                  const detailedCity = [...majorCities, ...indonesiaCities].find(c => c.id === worldCity.id);
                  return (
                    <div className="global-overview-card">
                      <div className="goc-content">
                        <div className="goc-left">
                          <div className="goc-emoji" style={{ fontSize: '2.5rem' }}>
                            {worldCity.condition === 'sunny' ? '☀️' : 
                             worldCity.condition === 'rainy' ? '🌧️' : 
                             worldCity.condition === 'snowy' ? '❄️' : 
                             worldCity.condition === 'stormy' ? '⛈️' : 
                             worldCity.condition === 'cloudy' ? '☁️' : 
                             worldCity.condition === 'partly-cloudy' ? '⛅' : 
                             worldCity.condition === 'windy' ? '💨' : '🌦️'}
                          </div>
                          <div className="goc-info">
                            <div className="goc-city">{worldCity.city}</div>
                            <div className="goc-country">{worldCity.country}</div>
                          </div>
                        </div>
                        <div className="goc-right">
                          <div className="goc-temp" style={{ color: worldCity.temp > 30 ? '#f97316' : worldCity.temp < 5 ? '#60a5fa' : '#86efac' }}>
                            {unit === 'F' ? Math.round(worldCity.temp * 9/5 + 32) : worldCity.temp}°{unit}
                          </div>
                          <div className="goc-condition">{worldCity.condition}</div>
                        </div>
                      </div>

                      {/* Additional stats grid */}
                      {detailedCity && (
                        <div className="goc-stats-grid">
                          <div className="goc-stat">
                            <span className="goc-stat-icon">💧</span>
                            <div className="goc-stat-content">
                              <div className="goc-stat-value">{detailedCity.humidity}%</div>
                              <div className="goc-stat-label">Humidity</div>
                            </div>
                          </div>
                          <div className="goc-stat">
                            <span className="goc-stat-icon">🌬️</span>
                            <div className="goc-stat-content">
                              <div className="goc-stat-value">{detailedCity.windSpeed} km/h</div>
                              <div className="goc-stat-label">Wind</div>
                            </div>
                          </div>
                          <div className="goc-stat">
                            <span className="goc-stat-icon">🌡️</span>
                            <div className="goc-stat-content">
                              <div className="goc-stat-value">{detailedCity.pressure} hPa</div>
                              <div className="goc-stat-label">Pressure</div>
                            </div>
                          </div>
                          <div className="goc-stat">
                            <span className="goc-stat-icon">☀️</span>
                            <div className="goc-stat-content">
                              <div className="goc-stat-value">{detailedCity.uvIndex}</div>
                              <div className="goc-stat-label">UV Index</div>
                            </div>
                          </div>
                          <div className="goc-stat">
                            <span className="goc-stat-icon">🌧️</span>
                            <div className="goc-stat-content">
                              <div className="goc-stat-value">{detailedCity.daily[0]?.precipitation ?? 0}%</div>
                              <div className="goc-stat-label">Precip.</div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="goc-dots">
                        {worldMapCities.map((_, i) => (
                          <span 
                            key={i} 
                            className={`goc-dot ${i === globalOverviewIdx ? 'active' : ''}`}
                            onClick={() => {
                              setGlobalOverviewIdx(i);
                              setSelectedCityId(worldMapCities[i].id);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })()}
                

                <div className="map-container">
                  <WorldMap cities={worldMapCities} onSelectCity={handleMapCitySelect} selectedId={selectedCityId} unit={unit} />
                </div>
              </section>

              <section className="section">
                <div className="section-header">
                  <h2 className="section-title">🇮🇩 Indonesia Overview</h2>
                  <button className="see-all" onClick={() => setActiveSection('indonesia')}>View Map →</button>
                </div>
                
                {/* Auto-rotating Indonesia city card */}
                {indonesiaCities[indonesiaOverviewIdx] && (() => {
                  const idCity = indonesiaCities[indonesiaOverviewIdx];
                  return (
                    <div className="global-overview-card">
                      <div className="goc-content">
                        <div className="goc-left">
                          <div className="goc-emoji" style={{ fontSize: '2.5rem' }}>
                            {idCity.condition === 'sunny' ? '☀️' : 
                             idCity.condition === 'rainy' ? '🌧️' : 
                             idCity.condition === 'snowy' ? '❄️' : 
                             idCity.condition === 'stormy' ? '⛈️' : 
                             idCity.condition === 'cloudy' ? '☁️' : 
                             idCity.condition === 'partly-cloudy' ? '⛅' : 
                             idCity.condition === 'thunderstorm' ? '🌩️' : '🌦️'}
                          </div>
                          <div className="goc-info">
                            <div className="goc-city">{idCity.city}</div>
                            <div className="goc-country">{idCity.country}</div>
                          </div>
                        </div>
                        <div className="goc-right">
                          <div className="goc-temp" style={{ color: idCity.temp > 30 ? '#f97316' : idCity.temp < 5 ? '#60a5fa' : '#86efac' }}>
                            {unit === 'F' ? Math.round(idCity.temp * 9/5 + 32) : idCity.temp}°{unit}
                          </div>
                          <div className="goc-condition">{idCity.condition}</div>
                        </div>
                      </div>

                      {/* Additional stats grid */}
                      <div className="goc-stats-grid">
                        <div className="goc-stat">
                          <span className="goc-stat-icon">💧</span>
                          <div className="goc-stat-content">
                            <div className="goc-stat-value">{idCity.humidity}%</div>
                            <div className="goc-stat-label">Humidity</div>
                          </div>
                        </div>
                        <div className="goc-stat">
                          <span className="goc-stat-icon">🌬️</span>
                          <div className="goc-stat-content">
                            <div className="goc-stat-value">{idCity.windSpeed} km/h</div>
                            <div className="goc-stat-label">Wind</div>
                          </div>
                        </div>
                        <div className="goc-stat">
                          <span className="goc-stat-icon">🌡️</span>
                          <div className="goc-stat-content">
                            <div className="goc-stat-value">{idCity.pressure} hPa</div>
                            <div className="goc-stat-label">Pressure</div>
                          </div>
                        </div>
                        <div className="goc-stat">
                          <span className="goc-stat-icon">☀️</span>
                          <div className="goc-stat-content">
                            <div className="goc-stat-value">{idCity.uvIndex}</div>
                            <div className="goc-stat-label">UV Index</div>
                          </div>
                        </div>
                        <div className="goc-stat">
                          <span className="goc-stat-icon">🌧️</span>
                          <div className="goc-stat-content">
                            <div className="goc-stat-value">{idCity.daily[0]?.precipitation ?? 0}%</div>
                            <div className="goc-stat-label">Precip.</div>
                          </div>
                        </div>
                      </div>

                      <div className="goc-dots">
                        {indonesiaCities.map((_, i) => (
                          <span 
                            key={i} 
                            className={`goc-dot ${i === indonesiaOverviewIdx ? 'active' : ''}`}
                            onClick={() => {
                              setIndonesiaOverviewIdx(i);
                              setSelectedIndonesiaCityId(indonesiaCities[i].id);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Indonesia Map with Legend */}
                <div className="map-full-section" style={{ marginTop: '20px' }}>
                  <div className="map-full-container">
                    <IndonesiaMap cities={indonesiaCities} unit={unit} onSelectCity={setSelectedIndonesiaCityId} selectedId={selectedIndonesiaCityId} />
                  </div>
                  <div className="map-legend">
                    <div className="legend-title">Temperature Scale</div>
                    <div className="legend-gradient" />
                    <div className="legend-labels">
                      <span style={{ color: '#60a5fa' }}>≤0°</span>
                      <span style={{ color: '#86efac' }}>18°</span>
                      <span style={{ color: '#ef4444' }}>35°+</span>
                    </div>
                    <div className="legend-cities">
                      <div className="legend-cities-title">Indonesian Cities ({indonesiaCities.length})</div>
                      {indonesiaCities.map(c => (
                        <div key={c.id} className={`legend-city-row ${c.id === selectedIndonesiaCityId ? 'selected' : ''}`}
                          onClick={() => setSelectedIndonesiaCityId(c.id)}>
                          <span>{c.city}</span>
                          <span style={{ color: c.temp > 30 ? '#f97316' : c.temp < 5 ? '#60a5fa' : '#86efac' }}>
                            {unit === 'F' ? Math.round(c.temp * 9/5 + 32) : c.temp}°{unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>


            </div>
          </div>
        )}

        {/* ── WORLD MAP ── */}
        {activeSection === 'map' && (
          <div className="map-full-section">
            {/* Global Overview carousel on top */}
            <div style={{ padding: '0 20px' }}>
              {worldMapCities[globalOverviewIdx] && (() => {
                const worldCity = worldMapCities[globalOverviewIdx];
                const detailedCity = [...majorCities, ...indonesiaCities].find(c => c.id === worldCity.id);
                return (
                  <div className="global-overview-card">
                    <div className="goc-content">
                      <div className="goc-left">
                        <div className="goc-emoji" style={{ fontSize: '2.5rem' }}>
                          {worldCity.condition === 'sunny' ? '☀️' : 
                           worldCity.condition === 'rainy' ? '🌧️' : 
                           worldCity.condition === 'snowy' ? '❄️' : 
                           worldCity.condition === 'stormy' ? '⛈️' : 
                           worldCity.condition === 'cloudy' ? '☁️' : 
                           worldCity.condition === 'partly-cloudy' ? '⛅' : 
                           worldCity.condition === 'windy' ? '💨' : '🌦️'}
                        </div>
                        <div className="goc-info">
                          <div className="goc-city">{worldCity.city}</div>
                          <div className="goc-country">{worldCity.country}</div>
                        </div>
                      </div>
                      <div className="goc-right">
                        <div className="goc-temp" style={{ color: worldCity.temp > 30 ? '#f97316' : worldCity.temp < 5 ? '#60a5fa' : '#86efac' }}>
                          {unit === 'F' ? Math.round(worldCity.temp * 9/5 + 32) : worldCity.temp}°{unit}
                        </div>
                        <div className="goc-condition">{worldCity.condition}</div>
                      </div>
                    </div>

                    {detailedCity && (
                      <div className="goc-stats-grid">
                        <div className="goc-stat">
                          <span className="goc-stat-icon">💧</span>
                          <div className="goc-stat-content">
                            <div className="goc-stat-value">{detailedCity.humidity}%</div>
                            <div className="goc-stat-label">Humidity</div>
                          </div>
                        </div>
                        <div className="goc-stat">
                          <span className="goc-stat-icon">🌬️</span>
                          <div className="goc-stat-content">
                            <div className="goc-stat-value">{detailedCity.windSpeed} km/h</div>
                            <div className="goc-stat-label">Wind</div>
                          </div>
                        </div>
                        <div className="goc-stat">
                          <span className="goc-stat-icon">🌡️</span>
                          <div className="goc-stat-content">
                            <div className="goc-stat-value">{detailedCity.pressure} hPa</div>
                            <div className="goc-stat-label">Pressure</div>
                          </div>
                        </div>
                        <div className="goc-stat">
                          <span className="goc-stat-icon">☀️</span>
                          <div className="goc-stat-content">
                            <div className="goc-stat-value">{detailedCity.uvIndex}</div>
                            <div className="goc-stat-label">UV Index</div>
                          </div>
                        </div>
                        <div className="goc-stat">
                          <span className="goc-stat-icon">🌧️</span>
                          <div className="goc-stat-content">
                            <div className="goc-stat-value">{detailedCity.daily[0]?.precipitation ?? 0}%</div>
                            <div className="goc-stat-label">Precip.</div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="goc-dots">
                      {worldMapCities.map((_, i) => (
                        <span 
                          key={i} 
                          className={`goc-dot ${i === globalOverviewIdx ? 'active' : ''}`}
                          onClick={() => {
                            setGlobalOverviewIdx(i);
                            setSelectedCityId(worldMapCities[i].id);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="map-full-container">
              <WorldMap cities={worldMapCities} onSelectCity={handleMapCitySelect} selectedId={selectedCityId} unit={unit} />
            </div>
            <div className="map-legend">
              <div className="legend-title">Temperature Scale</div>
              <div className="legend-gradient" />
              <div className="legend-labels">
                <span style={{ color: '#60a5fa' }}>≤0°</span>
                <span style={{ color: '#86efac' }}>18°</span>
                <span style={{ color: '#ef4444' }}>35°+</span>
              </div>
              <div className="legend-cities">
                <div className="legend-cities-title">Tracked Cities ({worldMapCities.length})</div>
                {worldMapCities.map(c => (
                  <div key={c.id} className={`legend-city-row ${c.id === selectedCityId ? 'selected' : ''}`}
                    onClick={() => setSelectedCityId(c.id)}>
                    <span>{c.city}</span>
                    <span style={{ color: c.temp > 30 ? '#f97316' : c.temp < 5 ? '#60a5fa' : '#86efac' }}>
                      {unit === 'F' ? Math.round(c.temp * 9/5 + 32) : c.temp}°{unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── INDONESIA MAP ── */}
        {activeSection === 'indonesia' && (
          <div className="map-full-section">
            {/* Indonesia Overview carousel on top */}
            <div style={{ padding: '0 20px' }}>
              {indonesiaCities[indonesiaOverviewIdx] && (() => {
                const idCity = indonesiaCities[indonesiaOverviewIdx];
                return (
                  <div className="global-overview-card">
                    <div className="goc-content">
                      <div className="goc-left">
                        <div className="goc-emoji" style={{ fontSize: '2.5rem' }}>
                          {idCity.condition === 'sunny' ? '☀️' : 
                           idCity.condition === 'rainy' ? '🌧️' : 
                           idCity.condition === 'snowy' ? '❄️' : 
                           idCity.condition === 'stormy' ? '⛈️' : 
                           idCity.condition === 'cloudy' ? '☁️' : 
                           idCity.condition === 'partly-cloudy' ? '⛅' : 
                           idCity.condition === 'thunderstorm' ? '🌩️' : '🌦️'}
                        </div>
                        <div className="goc-info">
                          <div className="goc-city">{idCity.city}</div>
                          <div className="goc-country">{idCity.country}</div>
                        </div>
                      </div>
                      <div className="goc-right">
                        <div className="goc-temp" style={{ color: idCity.temp > 30 ? '#f97316' : idCity.temp < 5 ? '#60a5fa' : '#86efac' }}>
                          {unit === 'F' ? Math.round(idCity.temp * 9/5 + 32) : idCity.temp}°{unit}
                        </div>
                        <div className="goc-condition">{idCity.condition}</div>
                      </div>
                    </div>

                    <div className="goc-stats-grid">
                      <div className="goc-stat">
                        <span className="goc-stat-icon">💧</span>
                        <div className="goc-stat-content">
                          <div className="goc-stat-value">{idCity.humidity}%</div>
                          <div className="goc-stat-label">Humidity</div>
                        </div>
                      </div>
                      <div className="goc-stat">
                        <span className="goc-stat-icon">🌬️</span>
                        <div className="goc-stat-content">
                          <div className="goc-stat-value">{idCity.windSpeed} km/h</div>
                          <div className="goc-stat-label">Wind</div>
                        </div>
                      </div>
                      <div className="goc-stat">
                        <span className="goc-stat-icon">🌡️</span>
                        <div className="goc-stat-content">
                          <div className="goc-stat-value">{idCity.pressure} hPa</div>
                          <div className="goc-stat-label">Pressure</div>
                        </div>
                      </div>
                      <div className="goc-stat">
                        <span className="goc-stat-icon">☀️</span>
                        <div className="goc-stat-content">
                          <div className="goc-stat-value">{idCity.uvIndex}</div>
                          <div className="goc-stat-label">UV Index</div>
                        </div>
                      </div>
                      <div className="goc-stat">
                        <span className="goc-stat-icon">🌧️</span>
                        <div className="goc-stat-content">
                          <div className="goc-stat-value">{idCity.daily[0]?.precipitation ?? 0}%</div>
                          <div className="goc-stat-label">Precip.</div>
                        </div>
                      </div>
                    </div>

                    <div className="goc-dots">
                      {indonesiaCities.map((_, i) => (
                        <span 
                          key={i} 
                          className={`goc-dot ${i === indonesiaOverviewIdx ? 'active' : ''}`}
                          onClick={() => {
                            setIndonesiaOverviewIdx(i);
                            setSelectedIndonesiaCityId(indonesiaCities[i].id);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="map-full-container">
              <IndonesiaMap cities={indonesiaCities} unit={unit} onSelectCity={setSelectedIndonesiaCityId} selectedId={selectedIndonesiaCityId} />
            </div>
            <div className="map-legend">
              <div className="legend-title">Temperature Scale</div>
              <div className="legend-gradient" />
              <div className="legend-labels">
                <span style={{ color: '#60a5fa' }}>≤0°</span>
                <span style={{ color: '#86efac' }}>18°</span>
                <span style={{ color: '#ef4444' }}>35°+</span>
              </div>
              <div className="legend-cities">
                <div className="legend-cities-title">Indonesian Cities ({indonesiaCities.length})</div>
                {indonesiaCities.map(c => (
                  <div key={c.id} className={`legend-city-row ${c.id === selectedIndonesiaCityId ? 'selected' : ''}`}
                    onClick={() => setSelectedIndonesiaCityId(c.id)}>
                    <span>{c.city}</span>
                    <span style={{ color: c.temp > 30 ? '#f97316' : c.temp < 5 ? '#60a5fa' : '#86efac' }}>
                      {unit === 'F' ? Math.round(c.temp * 9/5 + 32) : c.temp}°{unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ALERTS ── */}
        {activeSection === 'alerts' && (
          <div className="alerts-section">
            <WeatherAlerts cities={majorCities} unit={unit} />
          </div>
        )}
      </main>

      {/* City Detail Modal */}
      {detailWeather && (
        <CityDetail weather={detailWeather} onClose={() => setDetailCity(null)} unit={unit} />
      )}
    </div>
  );
};

export default App;
