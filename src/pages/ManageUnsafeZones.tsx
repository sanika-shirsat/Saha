import { useState, useEffect } from "react";
import MobileLayout from "../layouts/MobileLayout";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

import { db } from "../firebase";
import { ref, onValue, set, remove } from "firebase/database";

import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
  Tooltip ,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { predefinedUnsafeZones } from "../data/predefinedUnsafeZones";

/* ---------------- ICON ---------------- */
const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
});

/* ---------------- MAP CLICK ---------------- */
function MapClickHandler({ setSelectedLocation }: any) {
  useMapEvents({
    click: (e) => {
      setSelectedLocation([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

/* ================= MAIN ================= */
export default function ManageUnsafeZones() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unsafeZones, setUnsafeZones] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const [zoneName, setZoneName] = useState("");
  const [radius, setRadius] = useState("");

  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  /* ---------- GET LOCATION ---------- */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCurrentLocation([pos.coords.latitude, pos.coords.longitude]);
    });
  }, []);

  /* ---------- FETCH FROM FIREBASE ---------- */
  useEffect(() => {
    const zonesRef = ref(db, "unsafeZones");

    const unsub = onValue(zonesRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const list = Object.entries(data).map(([key, value]: any) => ({
          id: key,
          ...value,
        }));
        setUnsafeZones(list);
      } else {
        setUnsafeZones([]);
      }
    });

    return () => unsub();
  }, []);

  /* ---------- ADD ---------- */
 const addZone = async () => {
  if (!selectedLocation || !zoneName || !radius) {
    alert("Fill all fields");
    return;
  }

  const radiusNum = Number(radius);
  const [lat, lng] = selectedLocation;

  // 🔥 if editing → use same id
  // 🔥 if adding → create new id
  const id = editingId ? editingId : Date.now().toString();

  const zoneRef = ref(db, `unsafeZones/${id}`);

  await set(zoneRef, {
    lat: Number(lat),
    lng: Number(lng),
    radius: radiusNum,
    name: zoneName,
  });

  // ✅ reset everything
  setZoneName("");
  setRadius("");
  setSelectedLocation(null);
  setEditingId(null); // 🔥 important
};

  /* ---------- DELETE ---------- */
  const deleteZone = async (id: string) => {
    const zoneRef = ref(db, `unsafeZones/${id}`);
    await remove(zoneRef);
  };

  /* ---------- EDIT ---------- */
  const editZone = (zone: any) => {
    setZoneName(zone.name);
    setRadius(zone.radius);
    setSelectedLocation([zone.lat, zone.lng]);
      setEditingId(zone.id); // 🔥 THIS IS KEY STEP

  };

  /* ================= UI ================= */
  return (
    <MobileLayout>
      <div style={containerStyle}>
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* ✅ SCROLL AREA */}
        <div style={contentStyle}>
          <div style={pageContainer}>
            <div style={titleStyle}>Manage Unsafe Zones</div>

            {/* MAP */}
            {currentLocation && (
              <div style={mapWrapper}>
                <div style={mapTitle}>Unsafe Zones Map</div>

                <div style={{ fontSize: "13px", color: "#7A3A5C" }}>
                  🔵 Your Location &nbsp;&nbsp; 🔴 Unsafe Zones
                </div>

                <div
                  style={{
                    height: "320px",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  <MapContainer
                    center={currentLocation}
                    zoom={15}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    <Marker position={currentLocation} icon={markerIcon} />

                    <MapClickHandler
                      setSelectedLocation={setSelectedLocation}
                    />

                    {selectedLocation && (
                      <Marker position={selectedLocation} icon={markerIcon} />
                    )}

                    {/* ALL ZONES SAME COLOR */}
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
      key={zone.id || index}   // ✅ safe key
      center={[zone.lat, zone.lng]}
      radius={zone.radius || 100}
      color="red"
      fillColor="red"
      fillOpacity={0.3}
  
    />
    

))}
                  </MapContainer>
                </div>
              </div>
            )}

            {/* INPUT */}
            <div style={inputContainer}>
              <input
                placeholder="Zone Name"
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                style={inputStyle}
              />

              <input
                placeholder="Radius (meters)"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                style={inputStyle}
              />

              <button onClick={addZone} style={addButton}>
                  {editingId ? "Update Zone ✏️" : "Add Unsafe Zone "}
              </button>
            </div>

            {/* LIST */}
            <h3 style={{ color: "#7A3A5C" }}>Existing Zones</h3>

            {unsafeZones.length === 0 ? (
              <div style={{ color: "#777" }}>No zones added</div>
            ) : (
              unsafeZones.map((zone) => (
                <div key={zone.id} style={zoneCard}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{zone.name}</div>
                    <div style={{ fontSize: "13px" }}>
                      Radius: {zone.radius} m
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => editZone(zone)}
                      style={editBtn}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteZone(zone.id)}
                      style={deleteBtn}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

/* ================= STYLES ================= */

const containerStyle: React.CSSProperties = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: "20px",
  paddingBottom: "120px",
};

const pageContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  fontFamily: "'ABeeZee', sans-serif", // ✅ works
};;

const titleStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: 700,
  color: "#7A3A5C",
  letterSpacing: "0.5px"
};

const mapWrapper: React.CSSProperties = {
  background: "rgba(244, 226, 234, 0.8)",
  backdropFilter: "blur(8px)",
  borderRadius: "20px",
  padding: "16px",
  border: "1px solid rgba(122,58,92,0.2)",
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
};

const mapTitle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 600,
  marginBottom: "8px",
};

const inputContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const inputStyle: React.CSSProperties = {
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  fontSize: "14px",
  outline: "none",
};

const addButton: React.CSSProperties = {
  padding: "12px",
  background: "linear-gradient(135deg, #7A3A5C, #9C4F77)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: 600,
  transition: "0.2s",
  fontFamily: "'ABeeZee', sans-serif",
};

const zoneCard: React.CSSProperties = {
  padding: "14px",
  borderRadius: "14px",
  background: "#F9EEF3",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
};

const editBtn: React.CSSProperties = {
  background: "#E6D6E8",
  color: "#5C3A5E",
  border: "none",
  padding: "6px 12px",
  borderRadius: "8px",
  cursor: "pointer",
   fontFamily: "'ABeeZee', sans-serif",
};

const deleteBtn: React.CSSProperties = {
  background: "#F8D7DA",
  color: "#7A3A5C",
  border: "none",
  padding: "6px 12px",
  borderRadius: "8px",
  cursor: "pointer",
   fontFamily: "'ABeeZee', sans-serif"
};

const bottomNav = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  height: "60px",
  background: "#fff",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
};

const cardStyle = {
  background: "rgba(255,255,255,0.6)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  padding: "16px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
};