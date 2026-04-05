import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function NearbyHelp() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [places, setPlaces] = useState<any[]>([]);
  const [search, setSearch] = useState("hospital");

  // 📍 Get location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => console.error(err)
    );
  }, []);

  // 🧠 Smart query mapping
  const getQuery = (type: string, lat: number, lng: number) => {
    const t = type.toLowerCase().trim();

    if (t.includes("police"))
      return `node["amenity"="police"](around:3000,${lat},${lng});`;

    if (t.includes("hospital"))
      return `node["amenity"="hospital"](around:3000,${lat},${lng});`;

    if (t.includes("pharmacy") || t.includes("medical"))
      return `node["amenity"="pharmacy"](around:3000,${lat},${lng});`;

    if (t.includes("fire"))
      return `node["amenity"="fire_station"](around:3000,${lat},${lng});`;

    if (t.includes("fuel") || t.includes("petrol"))
      return `node["amenity"="fuel"](around:3000,${lat},${lng});`;

    if (t.includes("clinic"))
      return `node["amenity"="clinic"](around:3000,${lat},${lng});`;

    return `node["amenity"="hospital"](around:3000,${lat},${lng});`;
  };

  // 🔍 Fetch places
  useEffect(() => {
    if (!location) return;

    const fetchPlaces = async () => {
      try {
        const [lat, lng] = location;

        const query = `
          [out:json];
          (
            ${getQuery(search, lat, lng)}
          );
          out;
        `;

        const res = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: query,
        });

        const data = await res.json();
        setPlaces(data.elements?.slice(0, 10) || []);
      } catch (err) {
        console.error("API error:", err);
      }
    };

    fetchPlaces();
  }, [location, search]);

  // 🗺️ Map rendering (SAFE)
  useEffect(() => {
    if (!location) return;

    const mapContainer = document.getElementById("map");
    if (!mapContainer) return;

    mapContainer.innerHTML = "";

    const map = L.map("map").setView(location, 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    L.marker(location).addTo(map).bindPopup("📍 You are here");

    places.forEach((p) => {
      if (p.lat && p.lon) {
        L.marker([p.lat, p.lon])
          .addTo(map)
          .bindPopup(p.tags?.name || "Nearby Place");
      }
    });

    return () => {
      map.remove();
    };
  }, [location, places]);

 return (
  <div style={page}>
    {/* HEADER */}
    <div style={headerWrapper}>
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
    </div>

    <Sidebar
      isOpen={isSidebarOpen}
      onClose={() => setIsSidebarOpen(false)}
    />

    {/* CONTENT */}
    <div style={content}>
      <h2 style={title}>Nearby Help</h2>

      {/* QUICK */}
      <div style={quickRow}>
        <div style={quickCard} onClick={() => setSearch("hospital")}>
          🏥 Hospital
        </div>
        <div style={quickCard} onClick={() => setSearch("police")}>
          🚓 Police
        </div>
      </div>

      {/* SEARCH */}
      <input
        style={searchBar}
        placeholder="Search nearby help..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* CATEGORY */}
      <div style={categoryRow}>
        {["hospital", "police", "pharmacy", "fire", "fuel", "clinic"].map(
          (c) => (
            <button key={c} style={catBtn} onClick={() => setSearch(c)}>
              {c}
            </button>
          )
        )}
      </div>

      {/* MAP */}
      {!location && <p>📍 Getting location...</p>}
      {location && (
        <div style={mapWrapper}>
          <div id="map" style={mapStyle}></div>
        </div>
      )}

      {/* LIST */}
      <h3 style={sectionTitle}>Nearby Results</h3>

      {places.map((p, i) => (
        <div key={i} style={card}>
          <div style={{ fontWeight: "bold" }}>
            {p.tags?.name || "Unnamed Place"}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              style={btn}
              onClick={() =>
                window.open(`https://www.google.com/maps?q=${p.lat},${p.lon}`)
              }
            >
              📍 Directions
            </button>

            <button
              style={{ ...btn, background: "#4CAF50" }}
              onClick={() =>
                window.open(`tel:${p.tags?.phone || ""}`)
              }
            >
              📞 Call
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
}

export default NearbyHelp;


// 🎨 STYLES

const page: React.CSSProperties = {
  background: "#E9C6FF",
  minHeight: "100vh",
  fontFamily: "ABeeZee, sans-serif",
};

const contentWrapper: React.CSSProperties = {
  marginTop: "70px", // fixes header overlap
  height: "calc(100vh - 70px)",
  overflowY: "auto",
};

const content: React.CSSProperties = {
  padding: "80px 20px 40px", // 👈 space for header
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const mapWrapper: React.CSSProperties = {
  borderRadius: "15px",
  overflow: "hidden",
};

const title = {
  fontSize: "26px",
  color: "#7A3A5C",
};

const quickRow: React.CSSProperties = {
  display: "flex",
  gap: "12px",
};

const quickCard: React.CSSProperties = {
  flex: 1,
  background: "#D79CB1",
  padding: "14px",
  borderRadius: "14px",
  textAlign: "center",
  color: "#7A3A5C",
  fontWeight: 600,
  cursor: "pointer",
};

const searchBar = {
  width: "100%",
  padding: "12px",
  borderRadius: "12px",
  border: "none",
  background: "#F3E3EA",
};

const categoryRow: React.CSSProperties = {
  display: "flex",
  gap: "8px",
  overflowX: "auto",
};

const catBtn = {
  padding: "8px 14px",
  borderRadius: "20px",
  border: "none",
  background: "#7A3A5C",
  color: "white",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const mapStyle = {
  height: "300px",
  width: "100%",
};

const sectionTitle = {
  color: "#7A3A5C",
};

const card = {
  background: "white",
  padding: "14px",
  borderRadius: "14px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
};

const btn = {
  marginTop: "8px",
  padding: "6px 12px",
  borderRadius: "8px",
  border: "none",
  background: "#7A3A5C",
  color: "white",
  cursor: "pointer",
};

const headerWrapper: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  zIndex: 1000,
};
