import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "../layouts/MobileLayout";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function Home() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [location, setLocation] = useState<[number, number] | null>(null);
  const [status, setStatus] = useState("Checking location...");

  const unsafeZones = [
    { name: "Station Area", lat: 19.076, lng: 72.877 },
    { name: "Dark Street", lat: 19.082, lng: 72.880 },
  ];

  useEffect(() => {

    if (!navigator.geolocation) {
      setStatus("Location not supported");
      return;
    }

    const interval = setInterval(() => {

      navigator.geolocation.getCurrentPosition((pos) => {

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setLocation([lat, lng]);

        let unsafe = false;

        unsafeZones.forEach(zone => {

          const distance = Math.sqrt(
            Math.pow(lat - zone.lat, 2) + Math.pow(lng - zone.lng, 2)
          );

          if (distance < 0.01) {
            unsafe = true;
            setStatus("⚠ Unsafe Zone: " + zone.name);
          }

        });

        if (!unsafe) {
          setStatus("You are Safe");
        }

      });

    }, 10000);

    return () => clearInterval(interval);

  }, []);

  const shareLocation = () => {

    if (!location) {
      alert("Location not ready yet");
      return;
    }

    const link = `https://www.google.com/maps?q=${location[0]},${location[1]}`;

    alert("📍 Your Location:\n" + link);
  };

  const handleSOS = () => {

  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    try {

      const response = await fetch("http://localhost:5000/send-sos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lat,
          lng,
        }),
      });

      const data = await response.json();

      alert(data.message);

    } catch (error) {
      console.error(error);
      alert("Failed to send SOS");
    }

  });

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

          {/* STATUS */}

          <div style={statusStyle}>
            <div style={{ fontSize: 13, opacity: 0.7 }}>
              Current Status
            </div>

            <div style={statusRow}>
              <span style={greenDot}></span>
              <span style={{ fontWeight: 600 }}>
                {status}
              </span>
            </div>

            <div style={{ fontSize: 13, marginTop: 4 }}>
              📍 Location Active
            </div>
          </div>

          {/* GRID */}

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
              onClick={() => navigate("/helplines")}
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

        {location && (

          <iframe
            width="100%"
            height="100%"
            style={{ borderRadius: "14px", border: "none" }}
            src={`https://maps.google.com/maps?q=${location[0]},${location[1]}&z=14&output=embed`}
          />

        )}

      </div>

    </div>

        {/* Bottom Bar */}
         </div>

        <div style={bottomBar}></div>

        {/* SOS */}

        <div style={sosWrapper}>
          <div style={sosButton} onClick={handleSOS}>
            SOS
          </div>
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
  paddingBottom: "160px",
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
  height: "300px",
  background: "#E4B6C7",
  borderRadius: "22px",
  border: "2px solid #7A3A5C",
  display: "flex",
  flexDirection: "column",
  padding: "18px",
  fontFamily: "'ABeeZee', sans-serif",
  color: "#7A3A5C",
  fontWeight: 600,
  boxShadow: "0 6px 16px rgba(0,0,0,0.12)"
};

const bottomBar: React.CSSProperties = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: "70px",
  background: "#C98CA2",
};

const sosWrapper: React.CSSProperties = {
  position: "absolute",
  bottom: "32px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "92px",
  height: "92px",
  borderRadius: "50%",
  background: "#F3E3EA",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 6px 18px rgba(0,0,0,0.25)"
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
  flex: 1,
  borderRadius: "14px",
  overflow: "hidden"
};
