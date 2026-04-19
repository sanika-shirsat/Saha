type Guardian = {
  name: string;
  number: string;
};

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "../layouts/MobileLayout";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import SOSButton from "../components/SOSButton";
import { auth } from "../firebase";
import axios from "axios";
import { push } from "firebase/database";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Circle, Polyline, useMap } from "react-leaflet";
import { predefinedUnsafeZones } from "../data/predefinedUnsafeZones";

const markerIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
});
const destIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
});

function distanceMetres(a: [number, number], b: [number, number]) {
  const R = 6371000;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const sin2 =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a[0] * Math.PI) / 180) *
      Math.cos((b[0] * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(sin2), Math.sqrt(1 - sin2));
}

function RecenterMap({ location }: { location: [number, number] }) {
  const map = useMap();
  useEffect(() => { map.setView(location, map.getZoom()); }, [location]);
  return null;
}

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [location, setLocation] = useState<[number, number] | null>(null);
  const [unsafeZones, setUnsafeZones] = useState<any[]>([]);
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [user, setUser] = useState<any>(null);
  const [safetyStatus, setSafetyStatus] = useState<"safe" | "unsafe">("safe");

  const [destInput, setDestInput] = useState("");
  const [destCoords, setDestCoords] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [routeWarning, setRouteWarning] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState("");

  const primaryGuardian = guardians.length > 0 ? guardians[0] : null;
  const isSafe = safetyStatus === "safe";

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    onValue(ref(db, `guardians/${user.uid}`), (snap) => {
      const data = snap.val();
      setGuardians(data ? Object.values(data) : []);
    });
  }, [user]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const check = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setLocation([lat, lng]);
          const allZones = [...predefinedUnsafeZones, ...unsafeZones];
          const inUnsafe = allZones.some(
            (z) => z.lat !== undefined && z.lng !== undefined &&
              distanceMetres([lat, lng], [z.lat, z.lng]) <= (z.radius || 100)
          );
          setSafetyStatus(inUnsafe ? "unsafe" : "safe");
        },
        (err) => console.error(err),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    };
    check();
    const id = setInterval(check, 10000);
    return () => clearInterval(id);
  }, [unsafeZones]);

  useEffect(() => {
    const unsub = onValue(ref(db, "unsafeZones"), (snap) => {
      const data = snap.val();
      setUnsafeZones(
        data ? Object.entries(data).map(([key, value]: any) => ({ id: key, ...value })) : []
      );
    });
    return () => unsub();
  }, []);

  const shareLocation = async () => {
    if (!primaryGuardian) return alert("👤 Please add a guardian first!");
    try {
      let loc = location;
      if (!loc) {
        loc = await new Promise<[number, number]>((res, rej) =>
          navigator.geolocation.getCurrentPosition(
            (p) => res([p.coords.latitude, p.coords.longitude]),
            rej, { enableHighAccuracy: false, timeout: 3000 }
          )
        );
      }
      const u = auth.currentUser;
      if (!u) throw new Error("Not logged in");
      const mapsLink = `https://www.google.com/maps?q=${loc![0]},${loc![1]}`;
      await axios.post("http://localhost:5000/send-sos", {
        guardianNumber: "+91" + primaryGuardian.number.replace(/\D/g, ""),
        guardianName: primaryGuardian.name,
        email: u.email, mapsLink, type: "LOCATION",
      });
      await push(ref(db, `alerts/${u.uid}`), {
        type: "LOCATION", email: u.email || "no-email",
        guardianName: primaryGuardian.name,
        guardianNumber: primaryGuardian.number,
        mapsLink, timestamp: new Date().toISOString(),
      });
      alert("📍 Location Shared!");
    } catch { alert("❌ Failed to share location"); }
  };

  const handleRoute = async () => {
    if (!destInput.trim() || !location) return;
    setRouteLoading(true); setRouteError(""); setRoute([]); setRouteWarning(false);
    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destInput)}&format=json&limit=1`
      );
      const geoData = await geoRes.json();
      if (!geoData.length) { setRouteError("Location not found."); setRouteLoading(false); return; }
      const dest: [number, number] = [parseFloat(geoData[0].lat), parseFloat(geoData[0].lon)];
      setDestCoords(dest);
      const osrmRes = await fetch(
        `https://router.project-osrm.org/route/v1/foot/${location[1]},${location[0]};${dest[1]},${dest[0]}?overview=full&geometries=geojson`
      );
      const osrmData = await osrmRes.json();
      if (osrmData.code !== "Ok") { setRouteError("Could not calculate route."); setRouteLoading(false); return; }
      const coords: [number, number][] = osrmData.routes[0].geometry.coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng]
      );
      setRoute(coords);
      const allZones = [...predefinedUnsafeZones, ...unsafeZones];
      setRouteWarning(coords.some((pt) =>
        allZones.some((z) => z.lat !== undefined && z.lng !== undefined &&
          distanceMetres(pt, [z.lat, z.lng]) <= (z.radius || 100))
      ));
    } catch { setRouteError("Network error. Please try again."); }
    finally { setRouteLoading(false); }
  };

  const allZones = [...predefinedUnsafeZones, ...unsafeZones].filter(
    (z) => z.lat !== undefined && z.lng !== undefined && !isNaN(z.lat) && !isNaN(z.lng)
  );

  return (
    <MobileLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800&family=DM+Serif+Display&display=swap');
        * { box-sizing: border-box; }
        .sa::-webkit-scrollbar { display: none; }
        .sa { -ms-overflow-style: none; scrollbar-width: none; }
        .tap { transition: transform 0.15s, box-shadow 0.15s; cursor: pointer; }
        .tap:active { transform: scale(0.97); }

        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .dot-blink { animation: blink 2s ease-in-out infinite; }

        @keyframes ripple {
          0% { box-shadow: 0 0 0 0 rgba(26,122,74,0.25); }
          100% { box-shadow: 0 0 0 10px rgba(26,122,74,0); }
        }
        @keyframes ripple-red {
          0% { box-shadow: 0 0 0 0 rgba(160,32,64,0.25); }
          100% { box-shadow: 0 0 0 10px rgba(160,32,64,0); }
        }
        .dot-safe { animation: ripple 2s ease-out infinite; }
        .dot-unsafe { animation: ripple-red 2s ease-out infinite; }

        .ri::placeholder { color: #C4A0B4; font-family:'Nunito',sans-serif; font-weight: 700; }
        .ri:focus { outline: none; border-color: #C0476E !important; box-shadow: 0 0 0 3px rgba(139,34,82,0.10); }
        .leaflet-container { border-radius: 0 !important; }

        .bento-card:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(122,58,92,0.14) !important; }
        .bento-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
      `}</style>

      <div style={shell}>
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div style={blobTR} />
        <div style={blobBL} />

        <div className="sa" style={scrollBody}>
          <div style={stack}>

            {/* ══════════════════════════════
                1. STATUS CARD
                ─ White background always
                ─ Left accent bar changes color
                ─ Status badge changes color
            ══════════════════════════════ */}
            <div style={{
              ...statusCard,
              borderLeft: `4px solid ${isSafe ? "#1A7A4A" : "#A02040"}`,
            }}>
              {/* top row: label + badge */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={statusTopLabel}>Current Status</div>
                <div style={{
                  ...statusBadge,
                  background: isSafe ? "#EBF8F1" : "#FEF0F3",
                  color: isSafe ? "#1A7A4A" : "#A02040",
                  border: `1px solid ${isSafe ? "#C3E8D5" : "#F5C6D2"}`,
                }}>
                  {isSafe ? "● Safe" : "● Unsafe"}
                </div>
              </div>

              {/* main status text */}
              <div style={statusRow}>
                <div
                  className={isSafe ? "dot-safe" : "dot-unsafe"}
                  style={{
                    ...statusDot,
                    background: isSafe ? "#1A7A4A" : "#A02040",
                  }}
                />
                <span style={{ ...statusText, color: isSafe ? "#1A7A4A" : "#A02040" }}>
                  {isSafe ? "You are in a Safe Zone" : "You are in an Unsafe Zone!"}
                </span>
              </div>

              {/* meta */}
              <div style={statusMeta}>
                <span style={metaDot} />
                {isSafe
                  ? "Live tracking active · Stay aware"
                  : "Move to a safe location immediately"}
              </div>
            </div>

            {/* ══════════════════════════════
                2. QUICK SAFETY TOOLS
                Bento grid — 3 rows × 2 cols
                Each card has a unique soft color
            ══════════════════════════════ */}
            <div>
              <div style={sectionRow}>
                <span style={sectionPill}>Quick Safety Tools</span>
                <div style={sectionLine} />
              </div>

              {/*
                Layout:
                col1           col2
                [Fake Call  ]  [Share Loc  ↕ tall]
                [Nearby Hlp ↕] [           ↑    ]
                [    ↑      ]  [Contacts        ]
              */}
              {/*
                GRID (3 rows × 2 cols):
                ┌─────────────┬─────────────────┐
                │  Fake Call  │  Share Location  │  row 1
                ├─────────────┤       ↕          │  row 2
                │  Nearby Hlp │─────────────────-┤
                │      ↕      │    Contacts      │  row 3
                └─────────────┴──────────────────┘
              */}
              <div style={bentoGrid}>

                {/* Fake Call — col 1 row 1 — LIGHT blush */}
                <div
                  className="tap bento-card"
                  style={{
                    ...bentoBase,
                    gridColumn: 1, gridRow: 1,
                    background: "#f8d0e1", borderColor: "#F0D8E8",
                  }}
                  onClick={() => navigate("/fakecall")}
                >
                  <div style={{ ...iconBadge, background: "#F2D6E8" }}>📞</div>
                  <div>
                    <p style={cardLabel}>Fake Call</p>
                    <p style={cardSub}>Simulate a call</p>
                  </div>
                </div>

                {/* Share Location — col 2 rows 1–2 — DARK berry (diagonal pair with Contacts) */}
                <div
                  className="tap bento-card"
                  style={{
                    ...bentoBase,
                    gridColumn: 2, gridRow: "1 / span 2",
                    background: "#d9688c", borderColor: "#d9688c",
                    justifyContent: "flex-end", gap: 10,
                  }}
                  onClick={shareLocation}
                >
                  <div style={{ ...iconBadgeLg, background: "rgba(255,255,255,0.20)" }}>📍</div>
                  <div>
                    <p style={{ ...cardLabel, color: "#fff" }}>Share Location</p>
                    <p style={{ ...cardSub, color: "rgba(255,255,255,0.70)" }}>Alert your guardian</p>
                  </div>
                </div>

                {/* Nearby Help — col 1 rows 2–3 — DARK berry (diagonal pair with Fake Call's opposite) */}
                <div
                  className="tap bento-card"
                  style={{
                    ...bentoBase,
                    gridColumn: 1, gridRow: "2 / span 2",
                    background: "#d9688c", borderColor: "#d9688c",
                    justifyContent: "flex-end", gap: 10,
                  }}
                  onClick={() => navigate("/nearby-help")}
                >
                  <div style={{ ...iconBadgeLg, background: "rgba(255,255,255,0.18)" }}>🚨</div>
                  <div>
                    <p style={{ ...cardLabel, color: "#fff" }}>Nearby Help</p>
                    <p style={{ ...cardSub, color: "rgba(255,255,255,0.65)" }}>Find help around you</p>
                  </div>
                </div>

                {/* Contacts — col 2 row 3 — LIGHT blush (diagonal pair with Fake Call) */}
                <div
                  className="tap bento-card"
                  style={{
                    ...bentoBase,
                    gridColumn: 2, gridRow: 3,
                    background: "#f8d0e1", borderColor: "#F0D8E8",
                  }}
                  onClick={() => navigate("/helplines")}
                >
                  <div style={{ ...iconBadge, background: "#F2D6E8" }}>👥</div>
                  <div>
                    <p style={cardLabel}>Contacts</p>
                    <p style={cardSub}>Helplines & guardians</p>
                  </div>
                </div>

              </div>
            </div>

            {/* ══════════════════════════════
                3. MANAGE
            ══════════════════════════════ */}
            <div>
              <div style={sectionRow}>
                <span style={sectionPill}>Manage</span>
                <div style={sectionLine} />
              </div>
              <div style={manageGrid}>
                {[
                  { icon: "📊", label: "Dashboard",    sub: "View activity",  to: "/dashboard" },
                  { icon: "🛡️", label: "Guardians",    sub: "My contacts",    to: "/manage-guardians" },
                  { icon: "🚫", label: "Unsafe Zones", sub: "View & edit",    to: "/manage-unsafe-zones" },
                ].map((c) => (
                  <div key={c.label} className="tap" style={manageCard} onClick={() => navigate(c.to)}>
                    <div style={manageIconWrap}>{c.icon}</div>
                    <div style={manageName}>{c.label}</div>
                    <div style={manageSub}>{c.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ══════════════════════════════
                4. MAP CARD
                ─ Clean white card
                ─ Soft border, good spacing
                ─ Map fills cleanly
            ══════════════════════════════ */}
            <div style={mapCard}>

              {/* Header */}
              <div style={mapHeadingRow}>
                <div style={mapHeadingLeft}>
                  <div style={mapHeadingIcon}>🗺️</div>
                  <div>
                    <div style={mapHeadingTitle}>Unsafe Zones & Safe Route</div>
                    <div style={mapHeadingSub}>Your surroundings, mapped safely</div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div style={mapBox}>
                {location ? (
                  <MapContainer center={location} zoom={15} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <RecenterMap location={location} />
                    <Marker position={location} icon={markerIcon} />
                    {destCoords && <Marker position={destCoords} icon={destIcon} />}
                    {route.length > 0 && (
                      <Polyline
                        positions={route}
                        color={routeWarning ? "#C0476E" : "#1A7A4A"}
                        weight={4} opacity={0.9}
                      />
                    )}
                    {allZones.map((z, i) => (
                      <Circle
                        key={z.id || i}
                        center={[z.lat, z.lng]}
                        radius={z.radius || 100}
                        color="#C0476E" fillColor="#C0476E" fillOpacity={0.18}
                      />
                    ))}
                  </MapContainer>
                ) : (
                  <div style={mapPH}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>📍</div>
                    <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 700, color: "#9B5B7A" }}>
                      Getting your location…
                    </div>
                  </div>
                )}
              </div>

              {/* Destination input */}
              <div style={mapFooter}>
                <div style={destRow}>
                  <input
                    className="ri"
                    style={destInputStyle}
                    placeholder="Where do you want to go?"
                    value={destInput}
                    onChange={(e) => setDestInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRoute()}
                  />
                  <button
                    className="tap"
                    style={goBtn}
                    onClick={handleRoute}
                    disabled={routeLoading}
                  >
                    {routeLoading ? "…" : "Go"}
                  </button>
                </div>

                {/* Feedback */}
                {routeError && <div style={alertRed}>{routeError}</div>}
                {routeWarning && !routeError && (
                  <div style={alertRed}>⚠️ Route passes through unsafe zones.</div>
                )}
                {route.length > 0 && !routeWarning && (
                  <div style={alertGreen}>✅ Route looks safe!</div>
                )}

                {/* Legend */}
                <div style={legendRow}>
                  {[
                    { c: "#3B82F6", l: "Your location" },
                    { c: "#C0476E", l: "Unsafe zone" },
                    { c: "#1A7A4A", l: "Safe route" },
                    { c: "#C0476E", l: "Risky route" },
                  ].map(({ c, l }) => (
                    <div key={l} style={legendItem}>
                      <span style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: c, display: "inline-block", flexShrink: 0,
                      }} />
                      {l}
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* ══ BOTTOM BAR + FLOATING SOS ══ */}
        <div style={bottomBarWrap}>
          <div style={sosFloatRing}>
            <SOSButton guardian={primaryGuardian} location={location} />
          </div>
          <div style={bottomBar} />
        </div>

      </div>
    </MobileLayout>
  );
}

/* ═══════════════════ STYLES ═══════════════════ */

const shell: React.CSSProperties = {
  height: "100%", display: "flex", flexDirection: "column",
  background: "#FAF0F5", position: "relative", overflow: "hidden",
  fontFamily: "'Nunito', sans-serif",
};
const blobTR: React.CSSProperties = {
  position: "absolute", top: -60, right: -60,
  width: 200, height: 200, borderRadius: "50%",
  background: "rgba(201,122,155,0.11)", pointerEvents: "none", zIndex: 0,
};
const blobBL: React.CSSProperties = {
  position: "absolute", bottom: 100, left: -80,
  width: 240, height: 240, borderRadius: "50%",
  background: "rgba(139,34,82,0.06)", pointerEvents: "none", zIndex: 0,
};
const scrollBody: React.CSSProperties = {
  flex: 1, overflowY: "auto",
  padding: "16px 16px 28px", position: "relative", zIndex: 1,
};
const stack: React.CSSProperties = {
  display: "flex", flexDirection: "column", gap: 20,
};

/* ── Status card ──
   Always white. Left border = green (safe) or red (unsafe).
   Badge in top-right corner changes color.
*/
const statusCard: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1.5px solid #F0D8E8",
  borderRadius: 18,
  padding: "16px 16px 16px 14px",   /* slightly less left padding because of accent bar */
  boxShadow: "0 4px 16px rgba(122,58,92,0.07)",
  display: "flex", flexDirection: "column", gap: 10,
};
const statusTopLabel: React.CSSProperties = {
  fontSize: 10, fontWeight: 800, color: "#9B5B7A",
  textTransform: "uppercase", letterSpacing: "0.8px",
};
const statusBadge: React.CSSProperties = {
  fontSize: 11, fontWeight: 800,
  padding: "3px 10px", borderRadius: 20,
  fontFamily: "'Nunito', sans-serif",
};
const statusRow: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 10,
};
const statusDot: React.CSSProperties = {
  width: 11, height: 11, borderRadius: "50%", flexShrink: 0,
};
const statusText: React.CSSProperties = {
  fontSize: 15, fontWeight: 800,
};
const statusMeta: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6,
  fontSize: 11, fontWeight: 700, color: "#9B5B7A",
};
const metaDot: React.CSSProperties = {
  width: 5, height: 5, borderRadius: "50%",
  background: "#C0476E", display: "inline-block", flexShrink: 0,
};

/* ── Section label ── */
const sectionRow: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 10, marginBottom: 12,
};
const sectionPill: React.CSSProperties = {
  background: "#EDD0E0", color: "#7A2E56",
  fontFamily: "'Nunito', sans-serif",
  fontSize: 10, fontWeight: 800, letterSpacing: "0.6px",
  padding: "4px 12px", borderRadius: 20,
  textTransform: "uppercase", whiteSpace: "nowrap",
};
const sectionLine: React.CSSProperties = { flex: 1, height: 1, background: "#E8C8D8" };

/* ── Bento grid ── */
const bentoGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gridTemplateRows: "100px 100px 100px",
  gap: 10,
};
const bentoBase: React.CSSProperties = {
  borderRadius: 18, padding: "14px 13px",
  display: "flex", flexDirection: "column", justifyContent: "space-between",
  borderWidth: "1.5px", borderStyle: "solid",
  boxShadow: "0 3px 12px rgba(122,58,92,0.07)",
  cursor: "pointer",
};


const iconBadge: React.CSSProperties = {
  width: 40, height: 40, borderRadius: 13,
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 18, flexShrink: 0,
};
const iconBadgeLg: React.CSSProperties = {
  ...iconBadge, width: 46, height: 46, fontSize: 21,
};
const cardLabel: React.CSSProperties = {
  margin: "0 0 2px", fontSize: 13, fontWeight: 800, color: "#3D1A2E",
};
const cardSub: React.CSSProperties = {
  margin: 0, fontSize: 10, fontWeight: 700, color: "#9B5B7A",
};

/* ── Manage grid ── */
const manageGrid: React.CSSProperties = {
  display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10,
};
const manageCard: React.CSSProperties = {
  borderRadius: 16, padding: "14px 12px",
  background: "linear-gradient(135deg, #8B2252 0%, #C0476E 100%)",
  display: "flex", flexDirection: "column", gap: 4,
  boxShadow: "0 6px 18px rgba(139,34,82,0.22)", border: "none",
};
const manageIconWrap: React.CSSProperties = {
  width: 36, height: 36, borderRadius: 10,
  background: "rgba(255,255,255,0.16)",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 17, marginBottom: 5,
};
const manageName: React.CSSProperties = {
  fontSize: 11, fontWeight: 800, color: "#fff", lineHeight: 1.3,
};
const manageSub: React.CSSProperties = {
  fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.55)",
};

/* ── Map card — clean, spacious ── */
const mapCard: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1.5px solid #EDD0E0",       /* soft blush border, not heavy */
  borderRadius: 22,
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(122,58,92,0.07)",
  display: "flex", flexDirection: "column",
};
const mapHeadingRow: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "space-between",
  padding: "16px 18px 14px",
  borderBottom: "1px solid #F5E8F0",
};
const mapHeadingLeft: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 12,
};
const mapHeadingIcon: React.CSSProperties = {
  width: 38, height: 38, borderRadius: 12,
  background: "#F2D6E8",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 18, flexShrink: 0,
};
const mapHeadingTitle: React.CSSProperties = {
  fontSize: 14, fontWeight: 800, color: "#3D1A2E",
  fontFamily: "'Nunito', sans-serif",
};
const mapHeadingSub: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: "#9B5B7A",
  fontFamily: "'Nunito', sans-serif", marginTop: 1,
};
const mapBox: React.CSSProperties = {
  height: 240, width: "100%",
};
const mapPH: React.CSSProperties = {
  height: "100%", display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center",
  background: "#FEF4F8",
};
const mapFooter: React.CSSProperties = {
  padding: "14px 16px 16px",
  display: "flex", flexDirection: "column", gap: 10,
};
const destRow: React.CSSProperties = {
  display: "flex", gap: 8,
};
const destInputStyle: React.CSSProperties = {
  flex: 1, padding: "11px 14px", borderRadius: 13,
  border: "1.5px solid #EDD0E0",
  fontSize: 13, fontWeight: 700, color: "#3D1A2E",
  background: "#FAF0F5",
  transition: "border 0.2s, box-shadow 0.2s",
  fontFamily: "'Nunito', sans-serif",
};
const goBtn: React.CSSProperties = {
  padding: "11px 20px",
  background: "linear-gradient(135deg, #8B2252, #C0476E)",
  color: "#fff", border: "none", borderRadius: 13,
  fontSize: 13, fontWeight: 800, cursor: "pointer",
  boxShadow: "0 4px 14px rgba(139,34,82,0.28)", flexShrink: 0,
  fontFamily: "'Nunito', sans-serif",
};
const alertRed: React.CSSProperties = {
  background: "#FEF0F3", border: "1.5px solid #F5C6D2",
  color: "#A02040", fontSize: 12, fontWeight: 800,
  padding: "9px 13px", borderRadius: 11,
  fontFamily: "'Nunito', sans-serif",
};
const alertGreen: React.CSSProperties = {
  background: "#EBF8F1", border: "1.5px solid #C3E8D5",
  color: "#1A7A4A", fontSize: 12, fontWeight: 800,
  padding: "9px 13px", borderRadius: 11,
  fontFamily: "'Nunito', sans-serif",
};
const legendRow: React.CSSProperties = {
  display: "flex", gap: 12, flexWrap: "wrap",
};
const legendItem: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 5,
  fontSize: 11, fontWeight: 700, color: "#9B5B7A",
  fontFamily: "'Nunito', sans-serif",
};

/* ── Bottom bar + floating SOS ── */
const bottomBarWrap: React.CSSProperties = {
  flexShrink: 0, position: "relative", height: 84, zIndex: 200,
};
const bottomBar: React.CSSProperties = {
  position: "absolute", bottom: 0, left: 0, right: 0, height: 56,
  background: "linear-gradient(135deg, #8B2252, #C0476E)",
  boxShadow: "0 -3px 20px rgba(139,34,82,0.22)",
};
const sosFloatRing: React.CSSProperties = {
  position: "absolute", bottom: 18,
  left: "50%", transform: "translateX(-50%)",
  width: 74, height: 74, borderRadius: "50%",
  background: "linear-gradient(135deg, #F2D6E8, #EDD0E0)",
  border: "3px solid rgba(255,255,255,0.90)",
  display: "flex", alignItems: "center", justifyContent: "center",
  boxShadow: "0 0 0 6px rgba(139,34,82,0.12), 0 8px 24px rgba(139,34,82,0.32)",
  zIndex: 10,
};