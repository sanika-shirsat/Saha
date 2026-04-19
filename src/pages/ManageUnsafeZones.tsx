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

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCurrentLocation([pos.coords.latitude, pos.coords.longitude]);
    });
  }, []);

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

  const addZone = async () => {
    if (!selectedLocation || !zoneName || !radius) {
      alert("Fill all fields");
      return;
    }
    const radiusNum = Number(radius);
    const [lat, lng] = selectedLocation;
    const id = editingId ? editingId : Date.now().toString();
    const zoneRef = ref(db, `unsafeZones/${id}`);
    await set(zoneRef, {
      lat: Number(lat),
      lng: Number(lng),
      radius: radiusNum,
      name: zoneName,
    });
    setZoneName("");
    setRadius("");
    setSelectedLocation(null);
    setEditingId(null);
  };

  const deleteZone = async (id: string) => {
    const zoneRef = ref(db, `unsafeZones/${id}`);
    await remove(zoneRef);
  };

  const editZone = (zone: any) => {
    setZoneName(zone.name);
    setRadius(zone.radius);
    setSelectedLocation([zone.lat, zone.lng]);
    setEditingId(zone.id);
  };

  return (
    <MobileLayout>
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Nunito:wght@700;800&display=swap');

        * { box-sizing: border-box; }

        .saha-input {
          width: 100%;
          padding: 13px 16px;
          border-radius: 14px;
          border: 1.5px solid #F0D8E8;
          background: #FFFFFF;
          font-family: 'Nunito', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #3D1A2E;
          outline: none;
          transition: border 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(122,58,92,0.06);
        }
        .saha-input::placeholder { color: #9B5B7A; font-weight: 700; }
        .saha-input:focus {
          border-color: #C0476E;
          box-shadow: 0 0 0 3px rgba(139,34,82,0.10);
        }

        .add-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #8B2252, #C0476E);
          color: #fff;
          border: none;
          border-radius: 14px;
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(139,34,82,0.28);
          letter-spacing: 0.3px;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .add-btn:active { transform: scale(0.97); box-shadow: 0 3px 10px rgba(139,34,82,0.20); }

        .edit-btn {
          background: #F2D6E8;
          color: #7A2E56;
          border: none;
          padding: 7px 14px;
          border-radius: 10px;
          font-family: 'Nunito', sans-serif;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.15s;
        }
        .edit-btn:hover { background: #EDD0E0; }

        .delete-btn {
          background: #FEF0F3;
          color: #A02040;
          border: 1px solid #F5C6D2;
          padding: 7px 14px;
          border-radius: 10px;
          font-family: 'Nunito', sans-serif;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.15s;
        }
        .delete-btn:hover { background: #F5C6D2; }

        .zone-card {
          padding: 16px;
          border-radius: 16px;
          background: #FFFFFF;
          border: 1.5px solid #F0D8E8;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 16px rgba(122,58,92,0.08);
          transition: transform 0.15s;
        }
        .zone-card:hover { transform: translateY(-1px); }

        .zone-card-alt {
          background: #FEF4F8;
        }

        .leaflet-container { border-radius: 14px; }
      `}</style>

      <div style={containerStyle}>
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Decorative blobs */}
        <div style={blobTopRight} />
        <div style={blobBottomLeft} />

        {/* Scroll area */}
        <div style={contentStyle}>
          <div style={pageContainer}>

            {/* ── Page Title ── */}
            <div>
              <div style={pageTitleStyle}>Manage Unsafe Zones</div>
              <div style={gradientBar} />
              <div style={pageSubtitleStyle}>
                Mark and monitor unsafe areas on the map
              </div>
            </div>

            {/* ── Map Card ── */}
            {currentLocation && (
              <div style={mapCard}>
                {/* Section pill */}
                <div style={sectionPill}>📍 Zone Map</div>

                <div style={mapLegend}>
                  <span style={legendDot("#3B82F6")}>●</span>
                  <span style={legendText}>Your Location</span>
                  <span style={{ ...legendDot("#C0476E"), marginLeft: "12px" }}>●</span>
                  <span style={legendText}>Unsafe Zones</span>
                </div>

                <div style={{ height: "300px", borderRadius: "14px", overflow: "hidden", border: "1.5px solid #F0D8E8" }}>
                  <MapContainer
                    center={currentLocation}
                    zoom={15}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={currentLocation} icon={markerIcon} />
                    <MapClickHandler setSelectedLocation={setSelectedLocation} />
                    {selectedLocation && (
                      <Marker position={selectedLocation} icon={markerIcon} />
                    )}
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
                          color="#C0476E"
                          fillColor="#C0476E"
                          fillOpacity={0.25}
                        />
                      ))}
                  </MapContainer>
                </div>

                {selectedLocation && (
                  <div style={selectedLocBadge}>
                    ✅ Location selected — fill the form below to save
                  </div>
                )}
              </div>
            )}

            {/* ── Add / Edit Form ── */}
            <div style={formCard}>
              <div style={sectionPill}>
                {editingId ? "✏️ Edit Zone" : "➕ Add New Zone"}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <input
                  className="saha-input"
                  placeholder="Zone Name (e.g. Dark Alley)"
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                />
                <input
                  className="saha-input"
                  placeholder="Radius in meters (e.g. 150)"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  type="number"
                />

                {!selectedLocation && (
                  <div style={hintBox}>
                    👆 Tap anywhere on the map above to drop a pin
                  </div>
                )}

                <button className="add-btn" onClick={addZone}>
                  {editingId ? "Update Zone ✏️" : "Add Unsafe Zone 🚫"}
                </button>

                {editingId && (
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setZoneName("");
                      setRadius("");
                      setSelectedLocation(null);
                    }}
                    style={cancelBtn}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* ── Zones List ── */}
            <div>
              <div style={sectionHeader}>
                <div style={sectionPill}>🗂 Existing Zones</div>
                <div style={zoneCount}>{unsafeZones.length} zone{unsafeZones.length !== 1 ? "s" : ""}</div>
              </div>

              {unsafeZones.length === 0 ? (
                <div style={emptyState}>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>🗺️</div>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, color: "#9B5B7A", fontSize: "14px" }}>
                    No unsafe zones added yet
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {unsafeZones.map((zone, i) => (
                    <div key={zone.id} className={`zone-card ${i % 2 !== 0 ? "zone-card-alt" : ""}`}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={zoneIconBadge}>🚫</div>
                        <div>
                          <div style={zoneNameStyle}>{zone.name}</div>
                          <div style={zoneMetaStyle}>Radius: {zone.radius} m</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button className="edit-btn" onClick={() => editZone(zone)}>Edit</button>
                        <button className="delete-btn" onClick={() => deleteZone(zone.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

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
  background: "#FAF0F5",
  position: "relative",
  overflow: "hidden",
};

const blobTopRight: React.CSSProperties = {
  position: "absolute",
  top: "-60px",
  right: "-60px",
  width: "220px",
  height: "220px",
  borderRadius: "50%",
  background: "rgba(201,122,155,0.13)",
  pointerEvents: "none",
  zIndex: 0,
};

const blobBottomLeft: React.CSSProperties = {
  position: "absolute",
  bottom: "80px",
  left: "-80px",
  width: "260px",
  height: "260px",
  borderRadius: "50%",
  background: "rgba(139,34,82,0.07)",
  pointerEvents: "none",
  zIndex: 0,
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: "20px 16px",
  paddingBottom: "120px",
  position: "relative",
  zIndex: 1,
};

const pageContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const pageTitleStyle: React.CSSProperties = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: "26px",
  color: "#3D1A2E",
  lineHeight: 1.2,
  marginBottom: "6px",
};

const gradientBar: React.CSSProperties = {
  width: "48px",
  height: "3px",
  borderRadius: "2px",
  background: "linear-gradient(90deg, #C97A9B, #8B2252)",
  marginBottom: "6px",
};

const pageSubtitleStyle: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "13px",
  fontWeight: 700,
  color: "#9B5B7A",
};

const mapCard: React.CSSProperties = {
  background: "#FFFFFF",
  borderRadius: "20px",
  border: "1.5px solid #F0D8E8",
  padding: "16px",
  boxShadow: "0 4px 16px rgba(122,58,92,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const formCard: React.CSSProperties = {
  background: "#FEF4F8",
  borderRadius: "20px",
  border: "1.5px solid #F0D8E8",
  padding: "16px",
  boxShadow: "0 4px 16px rgba(122,58,92,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const sectionPill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  background: "#EDD0E0",
  color: "#7A2E56",
  fontFamily: "'Nunito', sans-serif",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.5px",
  padding: "4px 12px",
  borderRadius: "20px",
  width: "fit-content",
  textTransform: "uppercase",
};

const mapLegend: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  fontFamily: "'Nunito', sans-serif",
  fontSize: "12px",
  fontWeight: 700,
};

const legendDot = (color: string): React.CSSProperties => ({
  color,
  fontSize: "14px",
  lineHeight: 1,
});

const legendText: React.CSSProperties = {
  color: "#9B5B7A",
};

const selectedLocBadge: React.CSSProperties = {
  background: "#EBF8F1",
  border: "1px solid #C3E8D5",
  color: "#1A7A4A",
  fontFamily: "'Nunito', sans-serif",
  fontSize: "12px",
  fontWeight: 800,
  padding: "8px 12px",
  borderRadius: "10px",
};

const hintBox: React.CSSProperties = {
  background: "#FEF4F8",
  border: "1.5px dashed #F0D8E8",
  color: "#9B5B7A",
  fontFamily: "'Nunito', sans-serif",
  fontSize: "13px",
  fontWeight: 700,
  padding: "10px 14px",
  borderRadius: "12px",
  textAlign: "center",
};

const cancelBtn: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  background: "transparent",
  color: "#9B5B7A",
  border: "1.5px solid #F0D8E8",
  borderRadius: "14px",
  fontFamily: "'Nunito', sans-serif",
  fontSize: "14px",
  fontWeight: 800,
  cursor: "pointer",
};

const sectionHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "12px",
};

const zoneCount: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "12px",
  fontWeight: 800,
  color: "#9B5B7A",
};

const emptyState: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1.5px dashed #F0D8E8",
  borderRadius: "16px",
  padding: "32px 16px",
  textAlign: "center",
};

const zoneIconBadge: React.CSSProperties = {
  width: "40px",
  height: "40px",
  borderRadius: "12px",
  background: "#F2D6E8",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px",
  flexShrink: 0,
};

const zoneNameStyle: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "14px",
  fontWeight: 800,
  color: "#3D1A2E",
};

const zoneMetaStyle: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "12px",
  fontWeight: 700,
  color: "#9B5B7A",
  marginTop: "2px",
};