import React from "react";
import type { MapCity } from "../types/weather";
import type { TempUnit } from "../types/weather";
import { getTempColor, displayTemp } from "../utils/weatherUtils";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

interface Props {
  cities: MapCity[];
  onSelectCity: (id: string) => void;
  selectedId: string;
  unit: TempUnit;
}

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const WorldMap: React.FC<Props> = ({
  cities,
  onSelectCity,
  selectedId,
  unit,
}) => {
  return (
    <div style={{ width: "100%" }}>
      <ComposableMap
        projection="geoMercator"
        style={{ width: "100%", height: "auto" }}
      >
        {/* 🌍 WORLD MAP */}
        <Geographies geography={geoUrl}>
          {({ geographies }: any) =>
            geographies.map((geo: any) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="rgba(62,95,58,0.7)"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={0.5}
              />
            ))
          }
        </Geographies>

        {/* 📍 CITY PINS */}
        {cities.map((city) => {
          const isSelected = city.id === selectedId;
          const tColor = getTempColor(city.temp);

          return (
            <Marker
              key={city.id}
              coordinates={[city.lng, city.lat]} // ⚠️ MUST [lng, lat]
            >
              <g
                style={{ cursor: "pointer" }}
                onClick={() => onSelectCity(city.id)}
              >
                {/* pulse */}
                {isSelected && (
                  <circle
                    r={16}
                    fill="none"
                    stroke={tColor}
                    strokeWidth={2}
                    opacity={0.4}
                  >
                    <animate
                      attributeName="r"
                      from="10"
                      to="20"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.6"
                      to="0"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* pin */}
                <circle
                  r={isSelected ? 8 : 5}
                  fill={isSelected ? tColor : "rgba(255,255,255,0.3)"}
                  stroke="#fff"
                  strokeWidth={1}
                />

                {/* temp label */}
                {isSelected && (
                  <text
                    x={10}
                    y={-10}
                    fontSize={10}
                    fill="white"
                    fontWeight="bold"
                  >
                    {displayTemp(city.temp, unit)}°
                  </text>
                )}
              </g>
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  );
};

export default WorldMap;