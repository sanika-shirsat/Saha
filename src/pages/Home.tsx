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
import UnsafeMap from "../components/UnsafeMap";
import SOSButton from "../components/SOSButton";
import { auth } from "../firebase";
import axios from "axios";
import { push } from "firebase/database";
// import Footer from "../components/Footer";



import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { predefinedUnsafeZones } from "../data/predefinedUnsafeZones";

const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
});

function Home() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [location, setLocation] = useState<[number, number] | null>(null);
  const [status, setStatus] = useState("Checking location...");
  console.log("LOCATION:", location);

  const [unsafeZones, setUnsafeZones] = useState<any[]>([]);
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [user, setUser] = useState<any>(null);
  const primaryGuardian = guardians.length > 0 ? guardians[0] : null;

const [safetyStatus, setSafetyStatus] = useState("🟢 Safe Zone");
  const [autoTriggered, setAutoTriggered] = useState(false);
  

  useEffect(() => {
  const unsub = auth.onAuthStateChanged((u) => {
    setUser(u);
  });
  return () => unsub();
}, []);

useEffect(() => {
  if (!user) return;

  const guardianRef = ref(db, `guardians/${user.uid}`);

  onValue(guardianRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      setGuardians(Object.values(data));
    } else {
      setGuardians([]);
    }
  });
}, [user]);

 useEffect(() => {

  if (!navigator.geolocation) {
    setStatus("Location not supported");
    return;
  }

  const watchId = navigator.geolocation.watchPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setLocation([lat, lng]);
      setStatus("Location Active");
    },
    (err) => {
      console.error(err);
      setStatus("Location permission denied");
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    }
  );

  return () => navigator.geolocation.clearWatch(watchId);

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

  const shareLocation = async () => {

    

  if (!primaryGuardian) {
    return alert("👤 Please add a guardian first!");
  }

  try {
    let currentLocation = location;

    // ✅ fallback (same as SOS)
    if (!currentLocation) {
      currentLocation = await new Promise<[number, number]>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve([pos.coords.latitude, pos.coords.longitude]);
          },
          (err) => reject(err),
          {
            enableHighAccuracy: false,
            timeout: 3000,
            maximumAge: 10000
          }
        );
      });
    }

    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    const mapsLink = `https://www.google.com/maps?q=${currentLocation[0]},${currentLocation[1]}`;

    // ✅ 1. SEND SMS FIRST
    await axios.post("http://localhost:5000/send-sos", {
      guardianNumber: "+91" + primaryGuardian.number.replace(/\D/g, ""),
      guardianName: primaryGuardian.name,
      email: user.email,
      mapsLink,
      type: "LOCATION"   // 🔥 IMPORTANT
    });

    // ✅ 2. SAVE TO FIREBASE
    await push(ref(db, `alerts/${user.uid}`), {
      type: "LOCATION",   // 🔥 DIFFERENT FROM SOS
      email: user.email || "no-email",
      guardianName: primaryGuardian.name,
      guardianNumber: primaryGuardian.number,
      mapsLink,
      timestamp: new Date().toISOString(),
    });

    alert("📍 Location Shared!");
    
  } catch (err) {
    console.error(err);
    alert("❌ Failed to share location");
  }
};
return (
 

    <MobileLayout>
      <div style={containerStyle}>

        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div style={contentStyle}>

          

          {/* GRID */}

          <div style={{ ...cardBase, ...smallCard }}>
  <div style={{ fontSize: 12, opacity: 0.7 }}>
    Current Status
  </div>

  <div style={statusRow}>
    <span
      style={{
        ...greenDot,
        background:
          safetyStatus.includes("Unsafe") ? "red" : "green",
      }}
    ></span>

    <span style={{ fontWeight: 600 }}>
      {safetyStatus}
    </span>
  </div>

  <div style={{ fontSize: 12 }}>
    📍 Live Tracking
  </div>
</div>

          <div style={{ fontWeight: 600, color: "#7A3A5C" }}>
             Quick Safety Tools
          </div>

         

          <div style={gridStyle}>

            <div
              style={{ ...cardBase, ...smallCard }}
              onClick={() => navigate("/fakecall")}
            >
              <div style={iconBox}>📞</div>
              <p style={cardText}>Fake Call</p>
            </div>

            <div
              style={{ ...cardBase, ...bigCard }}
              onClick={shareLocation}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={iconBox}>📍</div>
                <p style={cardText}>Share Location</p>
              </div>
            </div>

            <div
              style={{ ...cardBase, ...bigCard }}
              onClick={() => navigate("/nearby-help")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={iconBox}>🚨</div>
                <p style={cardText}>Nearby Help</p>
              </div>
            </div>

            <div
              style={{ ...cardBase, ...smallCard }}
              onClick={() => navigate("/helplines")}            >
              <div style={iconBox}>👥</div>
              <p style={cardText}>Contacts</p>
            </div>

          </div>

          {/* MAP */}

<div style={mapSection}>

      <div style={mapTitle}>
        Unsafe Zones & Safe Route
      </div>

      <div style={mapContainer}>

        {location ? (
            <UnsafeMap location={location} unsafeZones={unsafeZones} />
          ) : (
            <div>Loading map...</div>
          )}
      </div>

    </div>

    {/* ✅ FOOTER HERE */}
{/* <Footer /> */}

  <div style={bottomBar}></div>

        {/* Bottom Bar */}
         </div>

        <div style={bottomBar}></div>

        {/* SOS */}

        <div style={sosWrapper}>
          <SOSButton guardian={primaryGuardian} location={location} />
        </div>

      </div>
    </MobileLayout>
  );
}


export default Home;


/* ---------------- STYLES ---------------- */

const containerStyle: React.CSSProperties = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  fontFamily: "'Poppins', sans-serif",
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  overflowY: "auto",
  // paddingBottom: "300px",
};

const statusStyle: React.CSSProperties = {
  background: "#E2B9C8",
  padding: "16px",
  borderRadius: "16px",
  color: "#7A3A5C",
};

const statusRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginTop: "6px",
};

const greenDot: React.CSSProperties = {
  width: "8px",
  height: "8px",
  background: "green",
  borderRadius: "50%",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gridAutoRows: "95px",
  gap: "16px",
};

const cardBase: React.CSSProperties = {
  borderRadius: "18px",
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "flex-start",
  color: "#7A3A5C",
  fontWeight: 600,
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  transition: "transform 0.15s ease"
};

const smallCard: React.CSSProperties = {
  gridRowEnd: "span 1",
  background: "#E4B6C7",
};

const bigCard: React.CSSProperties = {
  gridRowEnd: "span 2",
  background: "#D79CB1",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: "12px",
};

const iconBox: React.CSSProperties = {
  width: "44px",
  height: "44px",
  borderRadius: "14px",
  background: "#F3E3EA",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",
};

const cardText: React.CSSProperties = {
  margin: 0,
  fontSize: "14px",
  color: "#7A3A5C",
};

const mapSection: React.CSSProperties = {
  marginTop: "10px",
  height: "300px",              // ⭐ FIXED HEIGHT
  background: "#E4B6C7",
  borderRadius: "22px",
  border: "2px solid #7A3A5C",
  display: "flex",
  flexDirection: "column",      // ⭐ IMPORTANT
  padding: "12px",
  fontFamily: "'ABeeZee', sans-serif",
  color: "#7A3A5C",
  fontWeight: 600,
  boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
  marginBottom: "100px",  // ⭐ ADD THIS
};

const bottomBar: React.CSSProperties = {
  height: "70px",
  background: "#C98CA2",
};

const sosWrapper: React.CSSProperties = {
  position: "absolute",        // ✅ FIXED
  bottom: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "92px",
  height: "92px",
  borderRadius: "50%",
  background: "#F3E3EA",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
  zIndex: 500               // ✅ IMPORTANT
};

const sosButton: React.CSSProperties = {
  width: "65px",
  height: "65px",
  borderRadius: "50%",
  background: "#7A3A5C",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  cursor: "pointer",
  animation: "sosPulse 2s infinite"
};

const mapTitle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 600,
  color: "#7A3A5C",
  marginBottom: "10px"
};

const mapContainer: React.CSSProperties = {
  height: "230px",   // ⭐ FIXED HEIGHT (IMPORTANT)
  width: "100%",
  borderRadius: "14px",
  overflow: "hidden",
  marginTop: "8px"
};