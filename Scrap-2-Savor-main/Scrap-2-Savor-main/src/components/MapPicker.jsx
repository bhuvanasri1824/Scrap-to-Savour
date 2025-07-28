import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapPicker.css";
import axios from "axios";

// Fix default marker icon issue
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapClickHandler = ({ onClick }) => {
  useMapEvents({
    click(e) {
      onClick(e);
    },
  });
  return null;
};

const MapPicker = ({ onLocationSelect }) => {
  const [positions, setPositions] = useState([
    { lat: 17.385044, lng: 78.486671 }, // Default: Hyderabad
  ]);
  const [routeCoords, setRouteCoords] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState("");

  const handleMapClick = (e) => {
    const newPos = { lat: e.latlng.lat, lng: e.latlng.lng };
    setPositions((prev) => [...prev, newPos]);
    onLocationSelect && onLocationSelect(newPos);
  };

  const fetchRouteFromOSRM = async () => {
    if (positions.length < 2) return;
    setLoading(true);
    try {
      const coordsStr = positions.map(p => `${p.lng},${p.lat}`).join(";");
      const res = await axios.get(`https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`);
      const geoCoords = res.data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
      setRouteCoords(geoCoords);
    } catch (error) {
      console.error("Error fetching route:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (positions.length > 1) fetchRouteFromOSRM();
  }, [positions]);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await axios.get("https://nominatim.openstreetmap.org/search", {
          params: {
            q: searchTerm,
            format: "json",
            addressdetails: 1,
            limit: 10,
          },
        });
        setSuggestions(res.data);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: value,
          format: "json",
          addressdetails: 1,
          limit: 5,
        },
      });
      setSuggestions(res.data);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  const handleSuggestionClick = (place) => {
    const newPos = { lat: parseFloat(place.lat), lng: parseFloat(place.lon) };
    setPositions((prev) => [...prev, newPos]);
    setSelectedPlace(place.display_name);
    setSuggestions([]);
    setSearchTerm(""); // clear input
    onLocationSelect && onLocationSelect(newPos);
  };

  return (
    <div className="map-container">
      {/* 🔍 Search Bar */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((place, idx) => (
              <li key={idx} onClick={() => handleSuggestionClick(place)}>
                {place.display_name}
              </li>
            ))}
          </ul>
        )}
        {selectedPlace && <p className="selected-location">📍 {selectedPlace}</p>}
      </div>

      {/* 🌍 Map */}
      <MapContainer center={positions[0]} zoom={13} scrollWheelZoom={true} style={{ height: "400px", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onClick={handleMapClick} />
        {positions.map((pos, idx) => (
          <Marker key={idx} position={pos}>
            <Popup>Pickup Point {idx + 1}</Popup>
          </Marker>
        ))}
        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} color="blue" weight={5} />
        )}
      </MapContainer>

      <div className="route-info">
        {loading ? <p>Loading optimized route...</p> : positions.length > 1 && <p>Route optimized and displayed on map.</p>}
      </div>
    </div>
  );
};

export default MapPicker;