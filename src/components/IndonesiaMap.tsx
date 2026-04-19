import React, { useState } from "react";
import type { CityWeather, TempUnit } from "../types/weather";
import { getTempColor, displayTemp, getWeatherEmoji } from "../utils/weatherUtils";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

interface Props {
  cities: CityWeather[];
  unit: TempUnit;
  onSelectCity: (id: string) => void;
  selectedId?: string;
}

const geoUrl =
  "https://raw.githubusercontent.com/superpikar/indonesia-geojson/master/indonesia-province-simple.json";

const IndonesiaMap: React.FC<Props> = ({ cities, unit, onSelectCity, selectedId }) => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div style={{ width: "100%" }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [118, -2], // Indonesia center
          scale: 1000,
        }}
        style={{ width: "100%", height: "auto" }}
      >
        {/* 🇮🇩 MAP */}
        <Geographies geography={geoUrl}>
          {({ geographies }: any) =>
            geographies.map((geo: any) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="rgba(56,100,58,0.75)"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={0.5}
              />
            ))
          }
        </Geographies>

        {/* 📍 PINS */}
        {cities.map((city) => {
          const isHovered = hovered === city.id;
          const isSelected = selectedId === city.id;
          const tempColor = getTempColor(city.temp);

          return (
            <Marker key={city.id} coordinates={[city.lng, city.lat]}>
              <g
                style={{ cursor: "pointer" }}
                onClick={() => onSelectCity(city.id)}
                onMouseEnter={() => setHovered(city.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Pulse ring for selected city */}
                {isSelected && (
                  <circle r={18} fill="none" stroke={tempColor} strokeWidth={1.5} opacity={0.4}>
                    <animate attributeName="r" from="10" to="22" dur="1.2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.6" to="0" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Hover pulse */}
                {isHovered && !isSelected && (
                  <circle r={18} fill="none" stroke={tempColor} strokeWidth={1.5} opacity={0.4}>
                    <animate attributeName="r" from="10" to="22" dur="1.2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.6" to="0" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Pin circle */}
                <circle
                  r={isSelected || isHovered ? 8 : 5}
                  fill={isSelected || isHovered ? tempColor : "rgba(255,255,255,0.3)"}
                  stroke={tempColor}
                  strokeWidth={1.5}
                />

                {/* Inner dot */}
                <circle r={isSelected || isHovered ? 3 : 2} fill={isSelected || isHovered ? "#fff" : tempColor} />

                {isHovered && (
                  <g>
                    <rect x={12} y={-28} width={100} height={40} rx={6}
                      fill="rgba(5,15,30,0.95)" stroke="rgba(255,255,255,0.15)" />
                    <text x={18} y={-12} fontSize={8} fill="rgba(255,255,255,0.5)">
                      {city.countryCode}
                    </text>
                    <text x={18} y={0} fontSize={10} fill="white" fontWeight="bold">
                      {city.city}
                    </text>
                    <text x={18} y={12} fontSize={9} fill={tempColor}>
                      {getWeatherEmoji(city.condition)} {displayTemp(city.temp, unit)}°{unit}
                    </text>
                  </g>
                )}
              </g>
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  );
};

export default IndonesiaMap;