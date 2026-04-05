import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { ref, onValue } from "firebase/database";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) return;

      const alertsRef = ref(db, `alerts/${user.uid}`);

      onValue(alertsRef, (snapshot) => {
        const data = snapshot.val();

        if (data) {
          const list = Object.values(data);

          // 🔥 sort latest first
          list.sort((a: any, b: any) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );

          setAlerts(list);
        } else {
          setAlerts([]);
        }
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={page}>

      {/* HEADER */}
      <Header onMenuClick={() => setIsSidebarOpen(true)} />

      {/* SIDEBAR */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* CONTENT */}
      <div style={content}>

        {/* TITLE */}
        <h2 style={title}>Activity Dashboard</h2>

        {alerts.length === 0 ? (
          <p style={{ color: "#7A3A5C" }}>No activity yet</p>
        ) : (
          alerts.map((a: any, i) => (
            <div key={i} style={cardBox}>

              {/* TYPE */}
              <div style={{
                fontWeight: 600,
                fontSize: "18px",
                color: a.type === "SOS" ? "#FF0000" : "#7A3A5C"
              }}>
                {a.type === "SOS" ? "🚨 SOS Sent" : "📍 Location Shared"}
              </div>

              {/* GUARDIAN */}
              <div style={row}>👤 {a.guardianName}</div>

              {/* EMAIL */}
              <div style={row}>📧 {a.email || "No email"}</div>

              {/* LOCATION */}
              <div style={row}>
                📍{" "}
                <a href={a.mapsLink} target="_blank" rel="noreferrer" style={link}>
                  View Location
                </a>
              </div>

              {/* TIME */}
              <div style={time}>
                🕒 {new Date(a.timestamp).toLocaleString()}
              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default Dashboard;

const page: React.CSSProperties = {
  width: "100%",
  minHeight: "100vh",
  background: "#E9C6FF",
  fontFamily: "Poppins, sans-serif"
};

const content: React.CSSProperties = {
  padding: "80px 24px 60px 24px",
};

const title: React.CSSProperties = {
  fontFamily: "ABeeZee, sans-serif",
  fontSize: "30px",
  color: "#2E1A22",
  WebkitTextStroke: "0.3px #7A3A5C",
  marginBottom: "20px"
};

const cardBox: React.CSSProperties = {
  background: "#D9D9D9",
  border: "2px solid #7A3A5C",
  borderRadius: "18px",
  padding: "18px",
  marginBottom: "18px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.1)"
};

const row: React.CSSProperties = {
  marginTop: "6px",
  fontSize: "15px",
  color: "#2E1A22"
};

const link: React.CSSProperties = {
  color: "#7A3A5C",
  textDecoration: "underline"
};

const time: React.CSSProperties = {
  marginTop: "10px",
  fontSize: "12px",
  color: "#555"
};