import { useEffect, useState, useRef } from "react";
import MobileLayout from "../layouts/MobileLayout";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ── OVERPASS MIRROR SERVERS (tried in order) ──────────────────
const OVERPASS_MIRRORS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
];

const CATEGORIES = [
  { label: "Hospital",     icon: "🏥", amenity: "hospital"      },
  { label: "Police",       icon: "🚓", amenity: "police"        },
  { label: "Pharmacy",     icon: "💊", amenity: "pharmacy"      },
  { label: "Fire Station", icon: "🔥", amenity: "fire_station"  },
  { label: "Clinic",       icon: "🩺", amenity: "clinic"        },
  { label: "Shelter",      icon: "🏠", amenity: "social_centre" },
];

// ── HELPERS ───────────────────────────────────────────────────
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function formatDistance(m: number) {
  return m < 1000 ? `${m}m away` : `${(m / 1000).toFixed(1)}km away`;
}

function buildQuery(amenity: string, lat: number, lng: number, radius = 10000) {
  return `[out:json][timeout:20];(node["amenity"="${amenity}"](around:${radius},${lat},${lng});way["amenity"="${amenity}"](around:${radius},${lat},${lng});relation["amenity"="${amenity}"](around:${radius},${lat},${lng}););out center 20;`;
}

function parseElements(elements: any[], lat: number, lng: number) {
  return elements
    .map((el: any) => {
      const elLat = el.lat ?? el.center?.lat;
      const elLng = el.lon ?? el.center?.lon;
      if (!elLat || !elLng) return null;
      return {
        id: String(el.id),
        name: el.tags?.name || el.tags?.["name:en"] || el.tags?.["name:hi"] || "Unnamed Place",
        lat: elLat,
        lng: elLng,
        phone: el.tags?.phone || el.tags?.["contact:phone"] || el.tags?.["contact:mobile"] || "",
        address: [el.tags?.["addr:housenumber"], el.tags?.["addr:street"], el.tags?.["addr:suburb"]]
          .filter(Boolean).join(", ") || el.tags?.["addr:city"] || "",
        distance: getDistance(lat, lng, elLat, elLng),
      };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => a.distance - b.distance);
}

// ── FETCH WITH RETRY + MIRROR FALLBACK ───────────────────────
async function fetchWithRetry(amenity: string, lat: number, lng: number): Promise<any[]> {
  const cacheKey = `nh_${amenity}_${Math.round(lat * 100)}_${Math.round(lng * 100)}`;

  // ✅ Check sessionStorage cache first
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const { data, ts } = JSON.parse(cached);
      // Cache valid for 5 minutes
      if (Date.now() - ts < 5 * 60 * 1000) return data;
    }
  } catch (_) {}

  const query = buildQuery(amenity, lat, lng);
  const body = `data=${encodeURIComponent(query)}`;

  // Try each mirror in order
  for (const mirror of OVERPASS_MIRRORS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 15000); // 15s timeout per attempt

        const res = await fetch(mirror, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
          signal: controller.signal,
        });
        clearTimeout(timer);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        const results = parseElements(json.elements || [], lat, lng);

        // ✅ Cache results
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify({ data: results, ts: Date.now() }));
        } catch (_) {}

        return results;
      } catch (err: any) {
        console.warn(`Mirror ${mirror} attempt ${attempt} failed:`, err?.message);
        if (attempt < 2) await new Promise((r) => setTimeout(r, 1000)); // 1s wait before retry
      }
    }
    // Try next mirror
  }

  throw new Error("All Overpass mirrors failed");
}

// ── COMPONENT ────────────────────────────────────────────────
function NearbyHelp() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState("");
  const [places, setPlaces] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // soft loading (has stale results)
  const [fetchError, setFetchError] = useState("");
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  // 📍 Get GPS location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation([pos.coords.latitude, pos.coords.longitude]),
      (err) => {
        console.error(err);
        setLocationError("Location access denied. Enable location permissions and refresh the page.");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  }, []);

  // 🔍 Fetch places on location/category change
  useEffect(() => {
    if (!location) return;
    const [lat, lng] = location;

    const load = async () => {
      // If we already have results, show them while refreshing
      if (places.length > 0) setRefreshing(true);
      else setLoading(true);

      setFetchError("");

      try {
        const results = await fetchWithRetry(activeCategory.amenity, lat, lng);
        setPlaces(results);
      } catch (err) {
        console.error(err);
        if (places.length === 0) {
          setFetchError("Couldn't load places. Check your internet connection and tap retry.");
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    load();
  }, [location, activeCategory]);

  // 🗺️ Render map
  useEffect(() => {
    if (!location || !mapContainerRef.current) return;

    if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }

    const map = L.map(mapContainerRef.current, { zoomControl: false }).setView(location, 14);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    // You marker
    L.circleMarker(location, {
      radius: 10, color: "#8B2252", fillColor: "#C0476E", fillOpacity: 1, weight: 3,
    }).addTo(map).bindPopup("<b>📍 You are here</b>").openPopup();

    // Place markers
    places.forEach((p) => {
      const popup = `
        <div style="font-family:sans-serif;min-width:160px;line-height:1.5">
          <b style="font-size:13px;color:#3D1A2E">${p.name}</b><br/>
          <span style="font-size:11px;color:#9B5B7A">${formatDistance(p.distance)}</span>
          ${p.address ? `<br/><span style="font-size:11px;color:#9B5B7A">${p.address}</span>` : ""}
          ${p.phone ? `<br/><a href="tel:${p.phone}" style="font-size:11px;color:#8B2252;font-weight:700">📞 ${p.phone}</a>` : ""}
          <br/><a href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}&travelmode=walking"
            target="_blank" style="font-size:11px;color:#8B2252;font-weight:700">📍 Get directions →</a>
        </div>`;
      L.marker([p.lat, p.lng]).addTo(map).bindPopup(popup);
    });

    return () => { map.remove(); mapRef.current = null; };
  }, [location, places]);

  const filtered = searchText.trim()
    ? places.filter((p) => p.name.toLowerCase().includes(searchText.toLowerCase()))
    : places;

  const handleRetry = () => {
    setPlaces([]);
    setFetchError("");
    setActiveCategory({ ...activeCategory }); // triggers useEffect
  };

  return (
    <MobileLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=DM+Serif+Display&display=swap');

        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }

        .cat-pill {
          display:flex;flex-direction:column;align-items:center;gap:4px;
          padding:9px 6px;border-radius:14px;border:1.5px solid #F0D8E8;
          background:#fff;cursor:pointer;font-family:'Nunito',sans-serif;
          font-size:10px;font-weight:800;color:#7A2E56;
          transition:all .15s ease;flex:1;min-width:46px;
        }
        .cat-pill:hover{background:#FEF4F8;transform:translateY(-1px)}
        .cat-pill.active{
          background:linear-gradient(135deg,#8B2252,#C0476E);
          border-color:transparent;color:#fff;
          box-shadow:0 4px 12px rgba(139,34,82,.28);
        }
        .cat-icon{font-size:19px}

        .search-input{
          width:100%;height:46px;border-radius:50px;
          border:1.5px solid #F0D8E8;background:#fff;
          padding:0 16px 0 44px;font-size:13px;
          font-family:'Nunito',sans-serif;font-weight:600;color:#3D1A2E;
          outline:none;box-sizing:border-box;
          transition:border-color .2s,box-shadow .2s;
          box-shadow:0 2px 8px rgba(122,58,92,.05);
        }
        .search-input::placeholder{color:#C4A0B4}
        .search-input:focus{border-color:#C97A9B;box-shadow:0 0 0 3px rgba(201,122,155,.15)}

        .place-card{
          background:#fff;border:1px solid #F0D8E8;border-radius:16px;
          padding:13px 14px;display:flex;justify-content:space-between;
          align-items:center;gap:10px;
          box-shadow:0 3px 12px rgba(122,58,92,.07);
          animation:fadeUp .35s ease both;
          transition:box-shadow .15s,transform .15s;
        }
        .place-card:hover{box-shadow:0 6px 20px rgba(122,58,92,.13);transform:translateY(-1px)}

        .go-btn{
          padding:9px 14px;border-radius:50px;border:none;
          background:linear-gradient(135deg,#8B2252,#C0476E);
          color:#fff;font-family:'Nunito',sans-serif;
          font-size:12px;font-weight:800;cursor:pointer;
          white-space:nowrap;flex-shrink:0;
          box-shadow:0 3px 10px rgba(139,34,82,.22);
          transition:transform .15s;
        }
        .go-btn:active{transform:scale(.95)}

        .call-btn{
          padding:6px 10px;border-radius:50px;border:1px solid #F0D8E8;
          background:#fff;color:#8B2252;font-family:'Nunito',sans-serif;
          font-size:11px;font-weight:800;cursor:pointer;
          text-decoration:none;display:inline-block;
          transition:background .15s;
        }
        .call-btn:hover{background:#FEF4F8}

        .spinner{
          width:20px;height:20px;
          border:3px solid #F0D8E8;border-top-color:#C0476E;
          border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0;
        }

        .refreshing-bar{
          height:3px;background:linear-gradient(90deg,#8B2252,#C0476E,#8B2252);
          background-size:200% 100%;
          animation:pulse 1s ease infinite;
          border-radius:0;
        }

        .retry-btn{
          margin-top:12px;padding:10px 24px;border-radius:50px;border:none;
          background:linear-gradient(135deg,#8B2252,#C0476E);
          color:#fff;font-family:'Nunito',sans-serif;font-size:13px;font-weight:800;
          cursor:pointer;box-shadow:0 4px 12px rgba(139,34,82,.25);
        }
      `}</style>

      <div style={{ height:"100%",display:"flex",flexDirection:"column",fontFamily:"'Nunito',sans-serif" }}>
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div style={{ flex:1,overflowY:"auto",background:"#FAF0F5" }}>

          {/* Refreshing bar — top of page */}
          {refreshing && <div className="refreshing-bar" />}

          {/* PAGE HEADER */}
          <div style={{ padding:"18px 16px 12px" }}>
            <h2 style={{ fontFamily:"'DM Serif Display',serif",fontSize:"28px",color:"#3D1A2E",margin:"0 0 4px" }}>
              Nearby Help
            </h2>
            <p style={{ fontSize:"13px",fontWeight:600,color:"#9B5B7A",margin:"0 0 14px" }}>
              Safe spots near your current location
            </p>

            {locationError && (
              <div style={{ background:"#FEF0F3",border:"1px solid #F5C6D2",borderRadius:"12px",padding:"10px 14px",fontSize:"13px",fontWeight:600,color:"#A02040",marginBottom:"12px" }}>
                ⚠️ {locationError}
              </div>
            )}

            {/* Search */}
            <div style={{ position:"relative",marginBottom:"14px" }}>
              <span style={{ position:"absolute",left:"15px",top:"50%",transform:"translateY(-50%)",fontSize:"15px",pointerEvents:"none" }}>🔍</span>
              <input
                className="search-input"
                placeholder={`Search ${activeCategory.label.toLowerCase()}s by name...`}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            {/* Category pills */}
            <div style={{ display:"flex",gap:"6px",overflowX:"auto",paddingBottom:"4px" }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.amenity}
                  className={`cat-pill${activeCategory.amenity === cat.amenity ? " active" : ""}`}
                  onClick={() => { setActiveCategory(cat); setSearchText(""); }}
                >
                  <span className="cat-icon">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* MAP */}
          <div style={{ padding:"0 16px 14px" }}>
            <div style={{ background:"#fff",border:"1px solid #F0D8E8",borderRadius:"20px",overflow:"hidden",boxShadow:"0 4px 16px rgba(122,58,92,.08)" }}>
              <div style={{ padding:"11px 14px",display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid #F0D8E8" }}>
                <span style={{ width:"9px",height:"9px",borderRadius:"50%",background:location?"#1A7A4A":"#C4A0B4",display:"inline-block",flexShrink:0 }} />
                <span style={{ fontSize:"12px",fontWeight:800,color:"#3D1A2E",flex:1 }}>
                  {location ? `${activeCategory.icon} ${activeCategory.label}s on map (${places.length} found)` : "Acquiring your location..."}
                </span>
                {(loading || refreshing) && <div className="spinner" />}
              </div>

              {location
                ? <div ref={mapContainerRef} style={{ height:"240px",width:"100%" }} />
                : (
                  <div style={{ height:"180px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"12px",background:"#FAF0F5",color:"#9B5B7A",fontSize:"13px",fontWeight:600 }}>
                    <div className="spinner" style={{ width:24,height:24 }} />
                    Getting your location...
                  </div>
                )
              }
            </div>
          </div>

          {/* RESULTS */}
          <div style={{ padding:"0 16px 48px" }}>

            {/* Label row */}
            <div style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"12px" }}>
              <span style={{ background:"#EDD0E0",color:"#7A2E56",fontSize:"10px",fontWeight:800,padding:"4px 12px",borderRadius:"20px",letterSpacing:"0.6px",textTransform:"uppercase",whiteSpace:"nowrap" }}>
                {activeCategory.icon} {activeCategory.label}s nearby
              </span>
              <div style={{ flex:1,height:"1px",background:"#E8C8D8" }} />
              <span style={{ fontSize:"11px",fontWeight:800,color:"#9B5B7A",flexShrink:0 }}>
                {loading ? "Searching..." : `${filtered.length} found`}
              </span>
            </div>

            {/* Hard loading (no stale results) */}
            {loading && places.length === 0 && (
              <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"14px",padding:"40px 0",color:"#9B5B7A" }}>
                <div className="spinner" style={{ width:32,height:32,borderWidth:4 }} />
                <div style={{ fontSize:"14px",fontWeight:700 }}>
                  Finding {activeCategory.label.toLowerCase()}s near you...
                </div>
                <div style={{ fontSize:"12px",fontWeight:600,color:"#C4A0B4",textAlign:"center",maxWidth:"220px" }}>
                  This may take a few seconds. Trying multiple servers.
                </div>
              </div>
            )}

            {/* Error state */}
            {fetchError && places.length === 0 && (
              <div style={{ background:"#fff",border:"1px solid #F0D8E8",borderRadius:"18px",padding:"28px 20px",textAlign:"center",boxShadow:"0 4px 14px rgba(122,58,92,.06)" }}>
                <div style={{ fontSize:"36px",marginBottom:"10px" }}>📡</div>
                <div style={{ fontSize:"14px",fontWeight:700,color:"#9B5B7A" }}>{fetchError}</div>
                <button className="retry-btn" onClick={handleRetry}>Try Again</button>
              </div>
            )}

            {/* Empty */}
            {!loading && filtered.length === 0 && places.length > 0 && searchText && (
              <div style={{ background:"#fff",border:"1px solid #F0D8E8",borderRadius:"18px",padding:"24px 20px",textAlign:"center" }}>
                <div style={{ fontSize:"14px",fontWeight:700,color:"#9B5B7A" }}>No results match "{searchText}"</div>
              </div>
            )}

            {!loading && places.length === 0 && !fetchError && location && (
              <div style={{ background:"#fff",border:"1px solid #F0D8E8",borderRadius:"18px",padding:"32px 20px",textAlign:"center",boxShadow:"0 4px 14px rgba(122,58,92,.06)" }}>
                <div style={{ fontSize:"36px",marginBottom:"10px" }}>🔍</div>
                <div style={{ fontSize:"14px",fontWeight:700,color:"#9B5B7A" }}>No {activeCategory.label.toLowerCase()}s found within 10km</div>
                <div style={{ fontSize:"12px",fontWeight:600,color:"#C4A0B4",marginTop:"4px" }}>Try a different category</div>
              </div>
            )}

            {/* Cards */}
            {filtered.length > 0 && (
              <div style={{ display:"flex",flexDirection:"column",gap:"10px" }}>
                {filtered.map((p, i) => (
                  <div key={p.id ?? i} className="place-card" style={{ animationDelay:`${Math.min(i,8)*0.04}s` }}>

                    {/* Left */}
                    <div style={{ display:"flex",alignItems:"center",gap:"11px",minWidth:0 }}>
                      <div style={{ width:"42px",height:"42px",borderRadius:"12px",background:"#F2D6E8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",flexShrink:0 }}>
                        {activeCategory.icon}
                      </div>
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontSize:"13px",fontWeight:800,color:"#3D1A2E",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize:"11px",fontWeight:600,color:"#9B5B7A",marginTop:"2px" }}>
                          {formatDistance(p.distance)}{p.address ? ` · ${p.address}` : ""}
                        </div>
                        {p.phone && (
                          <a href={`tel:${p.phone}`} className="call-btn" style={{ marginTop:"5px" }}>
                            📞 {p.phone}
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Right */}
                    <button
                      className="go-btn"
                      onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}&travelmode=walking`,"_blank")}
                    >
                      📍 Go
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

export default NearbyHelp;