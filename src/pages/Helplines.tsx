import { useState } from "react";
import MobileLayout from "../layouts/MobileLayout";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

type Helpline = {
  name: string;
  number: string;
  description: string;
};

const helplines: Helpline[] = [
  { name: "National Emergency", number: "112", description: "Unified national emergency helpline for police, fire and ambulance." },
  { name: "Police Emergency", number: "100", description: "Immediate police assistance for dangerous situations." },
  { name: "Fire Brigade", number: "101", description: "Fire emergency rescue service." },
  { name: "Ambulance", number: "102", description: "Medical emergency ambulance service." },
  { name: "Emergency Ambulance", number: "108", description: "Rapid emergency ambulance network." },
  { name: "Women Helpline", number: "1091", description: "24/7 national helpline for women safety." },
  { name: "Women Support", number: "181", description: "Emergency assistance for women." },
  { name: "Child Helpline", number: "1098", description: "Support service for children in distress." },
  { name: "Cyber Crime", number: "1930", description: "Report cyber financial fraud immediately." },
  { name: "Mental Health Support", number: "18005990019", description: "Government mental health counseling support." },
];

export default function Helplines() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (

    <MobileLayout>

      <div style={containerStyle}>

        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div style={contentStyle}>

          {/* Page Title */}
          <div style={pageHeader}>
            Emergency Helplines
          </div>

          {/* Helpline Cards */}
          <div style={gridStyle}>

            {helplines.map((h, i) => (

              <div key={i} style={cardStyle}>

                <div style={helplineName}>
                  {h.name}
                </div>

                <div style={helplineDesc}>
                  {h.description}
                </div>

                <a
                  href={`tel:${h.number}`}
                  style={callButton}
                >
                  Call {h.number}
                </a>

              </div>

            ))}

          </div>

          {/* Emergency Tip Section */}
          <div style={infoBox}>

            <div style={infoTitle}>
              Safety Reminder
            </div>

            <div style={infoText}>
              If you feel unsafe, press the SOS button on the home screen or contact a trusted guardian immediately.
              Sharing your live location can help responders reach you faster.
            </div>

          </div>

        </div>

      </div>

    </MobileLayout>

  );
}


/* ---------- STYLES ---------- */

const containerStyle: React.CSSProperties = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  fontFamily: "'ABeeZee', sans-serif",
};

const contentStyle: React.CSSProperties = {
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  overflowY: "auto",
};

const pageHeader: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: 600,
  color: "#7A3A5C",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
};

const cardStyle: React.CSSProperties = {
  background: "#E4B6C7",
  padding: "18px",
  borderRadius: "18px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minHeight: "130px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const helplineName: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#7A3A5C",
};

const helplineDesc: React.CSSProperties = {
  fontSize: "12px",
  color: "#5C3A4C",
  marginTop: "6px",
};

const callButton: React.CSSProperties = {
  marginTop: "12px",
  background: "#7A3A5C",
  color: "white",
  textAlign: "center",
  padding: "9px",
  borderRadius: "12px",
  textDecoration: "none",
  fontSize: "12px",
  fontWeight: 600,
};

const infoBox: React.CSSProperties = {
  background: "#F3E3EA",
  padding: "16px",
  borderRadius: "16px",
};

const infoTitle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#7A3A5C",
  marginBottom: "6px",
};

const infoText: React.CSSProperties = {
  fontSize: "12px",
  color: "#5C3A4C",
};