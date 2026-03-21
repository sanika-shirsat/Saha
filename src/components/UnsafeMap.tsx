import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
} from "react-leaflet";

import L from "leaflet";
import { predefinedUnsafeZones } from "../data/predefinedUnsafeZones";

const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
});

export default function UnsafeMap({
  location,
  unsafeZones,
  isSidebarOpen,   // ⭐ ADD THIS
}: any) {
  if (!location) return null;

  return (
    <MapContainer
  center={location}
  zoom={15}
  zoomControl={!isSidebarOpen}   // ⭐ ADD THIS LINE
  style={{ height: "100%", width: "100%" }}
>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* 🔵 USER LOCATION */}
      <Marker position={location} icon={markerIcon} />

      {/* 🔴 ALL ZONES */}
      {[...predefinedUnsafeZones, ...unsafeZones]
        .filter(
          (zone) =>
            zone.lat !== undefined &&
            zone.lng !== undefined &&
            !isNaN(zone.lat) &&
            !isNaN(zone.lng)
        )
        .map((zone, index) => (
          <Circle
            key={zone.id || index}
            center={[zone.lat, zone.lng]}
            radius={zone.radius || 100}
            color="red"
            fillColor="red"
            fillOpacity={0.3}
          />
        ))}
    </MapContainer>
  );
}