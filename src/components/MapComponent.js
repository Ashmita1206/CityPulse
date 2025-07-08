import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// Optionally import marker clustering if needed
// import MarkerClusterGroup from 'react-leaflet-markercluster';
// import 'react-leaflet-markercluster/dist/styles.min.css';

// Weather and AQI overlays (demo endpoints)
const getWeatherTileUrl = (apiKey) =>
  `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`;
const getAQITileUrl = () =>
  'https://tiles.aqicn.org/tiles/usepa-aqi/{z}/{x}/{y}.png?token=demo';

// Helper to update map center
function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const MapComponent = ({ reports = [], city, onMarkerClick, selectedReport, showWeather = true, showAQI = true }) => {
  // Default to India center if no city
  const center = city ? [city.lat, city.lon] : [22.9734, 78.6569];
  const zoom = city ? 11 : 5;
  const weatherApiKey = 'b6907d289e10d714a6e88b30761fae22'; // OpenWeatherMap demo key

  // Custom marker icon
  const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

    return (
    <div className="map-container w-full h-full rounded-lg overflow-hidden">
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
        <ChangeMapView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {showWeather && (
          <TileLayer
            url={getWeatherTileUrl(weatherApiKey)}
            opacity={0.5}
            zIndex={100}
          />
        )}
        {showAQI && (
          <TileLayer
            url={getAQITileUrl()}
            opacity={0.5}
            zIndex={101}
          />
        )}
        {/* Markers for reports */}
        {reports.map((report) => (
          report.lat && report.lon && (
            <Marker
                key={report.id}
              position={[report.lat, report.lon]}
              icon={markerIcon}
              eventHandlers={{ click: () => onMarkerClick && onMarkerClick(report) }}
            >
              <Popup>
                <div className="text-sm font-semibold">{report.title}</div>
                <div className="text-xs text-gray-500">{report.address}</div>
                <div className="text-xs">{report.category}</div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
      </div>
  );
};

export default MapComponent; 