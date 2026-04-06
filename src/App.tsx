import React, { useState, useEffect, useRef } from 'react';
import WorldMap from './components/WorldMap';
import CurrentWeather from './components/CurrentWeather';
import CityCard from './components/CityCard';
import CityDetail from './components/CityDetail';
import WeatherAlerts from './components/WeatherAlerts';
import IndonesiaSection from './components/IndonesiaSection';
import { majorCities, worldMapCities, currentLocation, indonesiaCities } from './data/weatherData';
import type { TempUnit } from './types/weather';
import './styles.css';

const ROTATE_INTERVAL = 4000;

const App: React.FC = () => {
  const [selectedCityId, setSelectedCityId] = useState<string>('jakarta');
  const [detailCity, setDetailCity] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<'dashboard' | 'map' | 'cities' | 'alerts'>('dashboard');
  const [unit, setUnit] = useState<TempUnit>('C');
  const [darkMode, setDarkMode] = useState(true);
  // Rotating major cities on dashboard
  const [rotatingIdx, setRotatingIdx] = useState(0);
  const [rotatingAnim, setRotatingAnim] = useState(false);
  // Selected city for Cities hero card
  const [heroCity, setHeroCity] = useState(majorCities[0].id);
  const rotateTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-rotate dashboard city cards
  useEffect(() => {
    rotateTimer.current = setInterval(() => {
      setRotatingAnim(true);
      setTimeout(() => {
        setRotatingIdx(i => (i + 4) % majorCities.length);
        setRotatingAnim(false);
      }, 400);
    }, ROTATE_INTERVAL);
    return () => { if (rotateTimer.current) clearInterval(rotateTimer.current); };
  }, []);

  const detailWeather = detailCity ? [...majorCities, ...indonesiaCities].find(c => c.id === detailCity) : null;

  const filteredCities = majorCities.filter(
    c => c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
         c.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMapCitySelect = (id: string) => {
    setSelectedCityId(id);
    const found = majorCities.find(c => c.id === id);
    if (found) setDetailCity(id);
  };

  const visibleDashCities = majorCities.slice(rotatingIdx, rotatingIdx + 4).length === 4
    ? majorCities.slice(rotatingIdx, rotatingIdx + 4)
    : [...majorCities.slice(rotatingIdx), ...majorCities.slice(0, 4 - (majorCities.length - rotatingIdx))];

  const heroCityData = majorCities.find(c => c.id === heroCity) ?? majorCities[0];

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
            { id: 'cities', icon: '🏙', label: 'Cities' },
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
              {activeSection === 'cities' && 'Global Cities'}
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
                onFocus={() => setActiveSection('cities')} />
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
                <div className="map-container">
                  <WorldMap cities={worldMapCities} onSelectCity={handleMapCitySelect} selectedId={selectedCityId} unit={unit} />
                </div>
              </section>

              <section className="section">
                <div className="section-header">
                  <h2 className="section-title">Major Cities</h2>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className="rotate-dots">
                      {Array.from({ length: Math.ceil(majorCities.length / 4) }).map((_, i) => (
                        <span key={i} className={`rotate-dot ${i === Math.floor(rotatingIdx / 4) ? 'active' : ''}`} />
                      ))}
                    </span>
                    <button className="see-all" onClick={() => setActiveSection('cities')}>See all →</button>
                  </div>
                </div>
                <div className={`mini-cities ${rotatingAnim ? 'fade-out' : 'fade-in'}`}>
                  {visibleDashCities.map(c => (
                    <div key={c.id} className="mini-city-card" onClick={() => setDetailCity(c.id)}>
                      <div className="mc-top">
                        <span style={{ fontSize: '1.5rem' }}>
                          {c.condition === 'sunny' ? '☀️' : c.condition === 'rainy' ? '🌧️' : c.condition === 'snowy' ? '❄️' : c.condition === 'stormy' ? '⛈️' : c.condition === 'thunderstorm' ? '🌩️' : c.condition === 'drizzle' ? '🌦️' : c.condition === 'partly-cloudy' ? '⛅' : '☁️'}
                        </span>
                        <div className="mc-temp">{c.temp}{unit === 'F' ? Math.round(c.temp * 9/5 + 32) : c.temp}°</div>
                      </div>
                      <div className="mc-city">{c.city}</div>
                      <div className="mc-country">{c.country}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Indonesia mini preview */}
              <section className="section">
                <div className="section-header">
                  <h2 className="section-title">🇮🇩 Indonesia Spotlight</h2>
                </div>
                <div className="id-preview-pills">
                  {indonesiaCities.slice(0, 5).map(c => (
                    <div key={c.id} className="id-preview-pill" onClick={() => { setDetailCity(c.id); }}>
                      <span>{c.condition === 'sunny' ? '☀️' : c.condition === 'rainy' ? '🌧️' : c.condition === 'partly-cloudy' ? '⛅' : c.condition === 'cloudy' ? '☁️' : '🌩️'}</span>
                      <span className="idp-city">{c.city}</span>
                      <span className="idp-temp">{unit === 'F' ? Math.round(c.temp * 9/5 + 32) : c.temp}°{unit}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {/* ── WORLD MAP ── */}
        {activeSection === 'map' && (
          <div className="map-full-section">
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

        {/* ── CITIES ── */}
        {activeSection === 'cities' && (
          <div className="cities-section">
            {/* Hero main card */}
            <CityCard weather={heroCityData} onClick={() => setDetailCity(heroCity)} unit={unit} isMain />
            <div className="cities-count">{filteredCities.length} cities · click a card to expand</div>
            <div className="cities-grid">
              {filteredCities.map(c => (
                <CityCard key={c.id} weather={c} unit={unit}
                  onClick={() => { setHeroCity(c.id); }} />
              ))}
              {filteredCities.length === 0 && (
                <div className="no-results">No cities found for "{searchQuery}"</div>
              )}
            </div>

            {/* Indonesia section */}
            <IndonesiaSection cities={indonesiaCities} unit={unit} />
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
