import { useState } from "react";
import MobileLayout from "../layouts/MobileLayout";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

type Helpline = {
  name: string;
  number: string;
  description: string;
  icon: string;
};

const helplines: Helpline[] = [
  { name: "National Emergency", number: "112",         icon: "🚨", description: "Unified helpline for police, fire and ambulance." },
  { name: "Police Emergency",   number: "100",         icon: "👮", description: "Immediate police assistance for dangerous situations." },
  { name: "Fire Brigade",       number: "101",         icon: "🔥", description: "Fire emergency rescue service." },
  { name: "Ambulance",          number: "102",         icon: "🚑", description: "Medical emergency ambulance service." },
  { name: "Emergency Ambulance",number: "108",         icon: "⚕️", description: "Rapid emergency ambulance network." },
  { name: "Women Helpline",     number: "1091",        icon: "🌸", description: "24/7 national helpline for women safety." },
  { name: "Women Support",      number: "181",         icon: "💜", description: "Emergency assistance for women." },
  { name: "Child Helpline",     number: "1098",        icon: "🧒", description: "Support service for children in distress." },
  { name: "Cyber Crime",        number: "1930",        icon: "🔐", description: "Report cyber financial fraud immediately." },
  { name: "Mental Health",      number: "18005990019", icon: "🧠", description: "Government mental health counseling support." },
];

export default function Helplines() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <MobileLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=DM+Serif+Display&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .helpline-card {
          background: #fff;
          border: 1px solid #F0D8E8;
          border-radius: 18px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 148px;
          box-shadow: 0 4px 16px rgba(122, 58, 92, 0.07);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          animation: fadeUp 0.4s ease both;
        }

        .helpline-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(122, 58, 92, 0.13);
        }

        .call-btn {
          display: block;
          margin-top: 12px;
          background: linear-gradient(135deg, #8B2252 0%, #C0476E 100%);
          color: #fff;
          text-align: center;
          padding: 9px;
          border-radius: 50px;
          text-decoration: none;
          font-size: 12px;
          font-family: 'Nunito', sans-serif;
          font-weight: 800;
          letter-spacing: 0.3px;
          box-shadow: 0 4px 12px rgba(139, 34, 82, 0.22);
          transition: transform 0.15s ease;
        }

        .call-btn:active {
          transform: scale(0.96);
        }
      `}</style>

      <div style={{ height: "100%", display: "flex", flexDirection: "column", fontFamily: "'Nunito', sans-serif" }}>

        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 40px", background: "#FAF0F5" }}>

          {/* Page Title */}
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "28px",
            color: "#3D1A2E",
            margin: "0 0 6px",
          }}>
            Emergency Helplines
          </h2>
          <p style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#9B5B7A",
            margin: "0 0 20px",
          }}>
            Tap any card to call immediately.
          </p>

          {/* Helpline Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px",
            marginBottom: "24px",
          }}>
            {helplines.map((h, i) => (
              <div
                key={i}
                className="helpline-card"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Icon badge + name */}
                <div>
                  <div style={{
                    width: "36px", height: "36px",
                    borderRadius: "10px",
                    background: "#F2D6E8",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "18px",
                    marginBottom: "8px",
                  }}>
                    {h.icon}
                  </div>
                  <div style={{
                    fontSize: "13px",
                    fontWeight: 800,
                    color: "#3D1A2E",
                    lineHeight: "1.3",
                    marginBottom: "5px",
                  }}>
                    {h.name}
                  </div>
                  <div style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#9B5B7A",
                    lineHeight: "1.45",
                  }}>
                    {h.description}
                  </div>
                </div>

                <a href={`tel:${h.number}`} className="call-btn">
                  📞 {h.number}
                </a>
              </div>
            ))}
          </div>

          {/* Safety Reminder Banner */}
          <div style={{
            background: "linear-gradient(135deg, #8B2252 0%, #C0476E 100%)",
            borderRadius: "20px",
            padding: "18px 18px 16px",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Decorative blob */}
            <div style={{
              position: "absolute", top: "-24px", right: "-20px",
              width: "90px", height: "90px", borderRadius: "50%",
              background: "rgba(255,255,255,0.07)",
              pointerEvents: "none",
            }} />

            <div style={{
              fontSize: "14px",
              fontWeight: 800,
              color: "#fff",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <span style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: "#FFD6E0",
                display: "inline-block",
                animation: "pulse 1.5s infinite",
              }} />
              Safety Reminder
            </div>
            <p style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.88)",
              margin: 0,
              lineHeight: "1.65",
            }}>
              If you feel unsafe, press the SOS button on the home screen or contact a trusted guardian immediately.
              Sharing your live location can help responders reach you faster.
            </p>
          </div>

        </div>
      </div>
    </MobileLayout>
  );
}