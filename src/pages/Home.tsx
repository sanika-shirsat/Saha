import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "../layouts/MobileLayout";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F2E6EF",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Status Bar */}
          <div
            style={{
              height: "45px",
              background: "#EAD3DB",
              borderRadius: "24px",
            }}
          />

          {/* Feature Grid */}
          <div style={{ display: "flex", gap: "15px" }}>
            <div style={smallCardStyle} onClick={() => navigate("/fakecall")}>
              📞
              <p style={cardTextStyle}>Fake Call</p>
            </div>

            <div style={tallCardStyle}>
              📍
              <p style={cardTextStyle}>Share Location</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <div style={tallCardStyle}>
              🚨
              <p style={cardTextStyle}>Nearby Help</p>
            </div>

            <div style={smallCardStyle}>
              👥
              <p style={cardTextStyle}>Emergency Contacts</p>
            </div>
          </div>
        </div>

        {/* Floating SOS */}
        <div
          style={{
            position: "absolute",
            bottom: "25px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            background: "#7A3A5C",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "20px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
            cursor: "pointer",
          }}
        >
          SOS
        </div>
      </div>
    </MobileLayout>
  );
}

export default Home;

/* Styles */

const smallCardStyle = {
  flex: 1,
  height: "130px",
  background: "linear-gradient(145deg, #EBB8C8, #E2A4B6)",
  borderRadius: "22px",
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "Poppins, sans-serif",
  fontWeight: 600,
  cursor: "pointer",
};

const tallCardStyle = {
  flex: 1,
  height: "185px",
  background: "linear-gradient(145deg, #E5A6B9, #DA90A7)",
  borderRadius: "22px",
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "Poppins, sans-serif",
  fontWeight: 600,
  cursor: "pointer",
};

const cardTextStyle = {
  marginTop: "10px",
};
