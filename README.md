# 🌤 Weatherify

> A web app with full-featured weather dashboard built with React, TypeScript, and Vite — designed to demonstrate modern front-end architecture, interactive data visualization, and polished UI/UX craftsmanship.

![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)

---

## Live Preview
> **[weatherify.vercel.app](https://weatherify.vercel.app)** 

---

## Features

### Dashboard
- **Live local weather card** for Tangerang with real-time clock, AQI bar, humidity, wind, pressure, UV index, and a 10-slot scrollable hourly forecast
- **Rotating major cities panel** — auto-cycles through 8 global cities every 4 seconds with smooth fade animation and dot indicators
- **Indonesia spotlight** — quick-access pill row for 8 Indonesian cities directly on the dashboard

### World Map
- **Real world geography** rendered via `react-simple-maps` + Natural Earth TopoJSON (110m resolution)
- Interactive city pins colored by temperature (blue → green → amber → red scale)
- Animated pulse ring on selected city
- Temperature-colored tooltips with weather emoji on hover
- 24 global cities tracked across all continents

### 🇮🇩 Indonesia Map
- Dedicated Indonesia map using **province-level GeoJSON** (`react-simple-maps` + Mercator projection centered on Indonesia)
- 8 major Indonesian cities: Jakarta, Surabaya, Bandung, Bali, Medan, Makassar, Yogyakarta, Manado
- Hover tooltips with animated pulse, weather condition, and temperature
- City detail side panel with 3-day outlook, stats, and timezone

### Global Cities
- **Hero city card** at the top with a real Unsplash city photograph as background
- Clicking any city card in the grid instantly swaps the hero — no page reload
- Full 7-day forecast, wind, humidity, precipitation, UV per city
- Live search filter across all tracked cities

### Weather Alerts
- Auto-generated alerts for: extreme heat (≥38°C), freezing (≤0°C), thunderstorms, high UV, poor air quality, strong winds, high humidity
- Side-by-side **city comparison table** with temperature color coding
- **World extremes board** — hottest, coldest, windiest, most humid, best air quality

### UI/UX
- **Dark / Light mode** toggle — full theme switch via CSS custom properties
- **°C / °F unit toggle** — converts every temperature across all components simultaneously
- Glassmorphism card system with backdrop blur
- Smooth card transitions, micro-animations, and hover states throughout
- Fully responsive layout — collapses gracefully on smaller screens

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | React 18 | Component-based UI with hooks |
| **Language** | TypeScript 5.2 | Full type safety across all components |
| **Build Tool** | Vite 5 | Sub-second HMR, optimized production builds |
| **Maps** | react-simple-maps | Declarative SVG map rendering with TopoJSON |
| **Geography Data** | world-atlas (110m TopoJSON) | Natural Earth world map |
| **Indonesia GeoJSON** | superpikar/indonesia-geojson | Province-level Indonesia boundary data |
| **Icons** | lucide-react | Consistent, tree-shakeable icon set |
| **Fonts** | Syne + DM Sans (Google Fonts) | Display + body font pairing |
| **Styling** | Vanilla CSS + Custom Properties | Theme-aware design tokens, no runtime overhead |
| **Type Checking** | tsc --noEmit | Zero-error strict TypeScript build |

---

## Project Structure

```
weatherify/
├── index.html                      # Vite entry point, Google Fonts import
├── vite.config.ts                  # Vite + React plugin config
├── tsconfig.json                   # Strict TypeScript config
│
└── src/
    ├── main.tsx                    # React root mount
    ├── App.tsx                     # Root layout, routing state, global props
    ├── styles.css                  # All styles — dark/light CSS variables, components
    │
    ├── types/
    │   └── weather.ts              # WeatherCondition, CityWeather, MapCity, TempUnit
    │
    ├── data/
    │   └── weatherData.ts          # Static weather data — majorCities, indonesiaCities,
    │                               # worldMapCities, currentLocation
    │
    ├── utils/
    │   └── weatherUtils.ts         # Pure utility fns: emoji, color, temp conversion,
    │                               # lat/lng → SVG projection, AQI label
    │
    └── components/
        ├── WorldMap.tsx            # react-simple-maps world map + city pins
        ├── IndonesiaMap.tsx        # react-simple-maps Indonesia province map + pins
        ├── IndonesiaSection.tsx    # Indonesia map + city detail panel + pill selector
        ├── CurrentWeather.tsx      # Local weather card — clock, stats, hourly forecast
        ├── CityCard.tsx            # City grid card + hero variant (with bg photo)
        ├── CityDetail.tsx          # Full detail modal — 7-day, stats, sun arc
        └── WeatherAlerts.tsx       # Alerts, compare table, extremes tabs
```

---

## Getting Started

### Prerequisites

```bash
node -v   # v18 or higher required
npm -v    # v9 or higher
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/shofwanshiddiq/weatherify.git
cd weatherify

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Available Scripts

```bash
npm run dev        # Start dev server with hot-module replacement
npm run build      # Type-check + production build → /dist
npm run preview    # Serve production build locally
npx tsc --noEmit   # Run TypeScript type checker only
```

---

## Architecture Decisions

### Why CSS custom properties over a CSS-in-JS library?
The entire dark/light theme is powered by two sets of CSS custom properties (`.dark` and `.light` classes on the root `<div>`). Toggling themes is a single `className` swap — zero JavaScript overhead at runtime, no hydration flicker, and full IntelliSense in the IDE. Every color, background, border, and shadow references a variable, making the system trivially extensible.

### Why `react-simple-maps` over a canvas-based library?
SVG-based maps integrate naturally with React's rendering model. Each `<Geography>` and `<Marker>` is a real DOM node — meaning React's reconciler handles updates, you get full CSS/animation support, and interactive states (hover, click, selection) are just component props. No imperative canvas API calls.

### Why a single `styles.css` over CSS Modules or Tailwind?
For a dashboard of this scope, a single well-organized stylesheet with BEM-like class names gives the clearest mental model. CSS Modules would require importing per-component and managing class composition across shared elements. Tailwind would bloat the JSX and obscure the design intent. The current approach keeps components readable and styles co-located in one auditable file.

### TypeScript strictness
`tsconfig.json` enables `strict: true`, `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch`. The project passes `tsc --noEmit` with zero errors. All weather condition strings are typed as a union literal (`WeatherCondition`) rather than `string`, and temperature unit is `'C' | 'F'` — not a boolean — making future i18n or unit additions safe.

### State management
All state lives in `App.tsx` and flows down via props. The app has no global store (Redux, Zustand, Jotai) because the data graph is shallow and the state surface small. `unit` and `darkMode` are the only truly global concerns — both are simple `useState` values passed as props, which is idiomatic React for an app of this complexity. Adding a store later is a clear upgrade path if the data layer grows.

---

## Component Reference

### `<WorldMap />`
| Prop | Type | Description |
|---|---|---|
| `cities` | `MapCity[]` | Array of cities to render as pins |
| `selectedId` | `string` | Currently selected city ID (shows pulse animation) |
| `onSelectCity` | `(id: string) => void` | Callback when a pin is clicked |
| `unit` | `TempUnit` | `'C'` or `'F'` for tooltip temperature display |

### `<IndonesiaMap />`
| Prop | Type | Description |
|---|---|---|
| `cities` | `CityWeather[]` | Indonesian cities with full weather data |
| `unit` | `TempUnit` | Temperature unit for hover tooltip |
| `onSelectCity` | `(id: string) => void` | Callback on pin click |

### `<CityCard />`
| Prop | Type | Description |
|---|---|---|
| `weather` | `CityWeather` | Full city weather object |
| `unit` | `TempUnit` | Display unit |
| `onClick` | `() => void` | Click handler |
| `isMain` | `boolean?` | Renders the hero variant with Unsplash bg photo |

### `<CurrentWeather />`
| Prop | Type | Description |
|---|---|---|
| `weather` | `CityWeather` | Local city weather (Tangerang) |
| `unit` | `TempUnit` | Display unit — all temps convert live |

### `<CityDetail />`
| Prop | Type | Description |
|---|---|---|
| `weather` | `CityWeather` | City to display in modal |
| `unit` | `TempUnit` | Temperature unit |
| `onClose` | `() => void` | Dismiss modal callback |

---

## 🔌 Connecting a Real API

The app ships with static mock data in `src/data/weatherData.ts`. To wire up a live weather API:

### 1. Get an API key
Sign up at **[openweathermap.org](https://openweathermap.org/api)** — the free tier covers current weather and 5-day forecasts.

### 2. Create `src/api/weather.ts`

```typescript
const BASE = 'https://api.openweathermap.org/data/2.5';
const KEY  = import.meta.env.VITE_OWM_API_KEY;

export async function fetchCurrentWeather(city: string) {
  const res = await fetch(`${BASE}/weather?q=${city}&appid=${KEY}&units=metric`);
  if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchForecast(city: string) {
  const res = await fetch(`${BASE}/forecast?q=${city}&appid=${KEY}&units=metric`);
  if (!res.ok) throw new Error(`Forecast fetch failed: ${res.status}`);
  return res.json();
}
```

### 3. Add your key to `.env.local`
```bash
VITE_OWM_API_KEY=your_api_key_here
```

### 4. Replace static data in `App.tsx`
```typescript
useEffect(() => {
  fetchCurrentWeather('Jakarta').then(data => {
    // map OWM response shape → CityWeather interface
  });
}, []);
```

---

## Roadmap

- [ ] Connect OpenWeatherMap API for live data
- [ ] Geolocation API — auto-detect user's current city
- [ ] Animated weather backgrounds (rain particles, snow, lightning)
- [ ] 14-day extended forecast with chart visualization (Recharts)
- [ ] PWA support — offline-first with service worker caching
- [ ] Unit test coverage with Vitest + React Testing Library
- [ ] Internationalization (i18n) — Bahasa Indonesia + English
- [ ] Keyboard navigation and ARIA labels for full accessibility

---

## Author

**Muhammad Shofwan Shiddiq**
Front-End Developer · Indonesia


---

## Screenshots


---
