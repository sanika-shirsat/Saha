import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MobileLayout from "../layouts/MobileLayout";

function SafetyTips() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <MobileLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Nunito:wght@700;800&display=swap');

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
        }

        .tips-scroll::-webkit-scrollbar { display: none; }
        .tips-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        .tip-card {
          background: #FFFFFF;
          border: 1.5px solid #F0D8E8;
          border-radius: 20px;
          padding: 16px 18px;
          box-shadow: 0 4px 16px rgba(122,58,92,0.08);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .tip-card:nth-child(even) { background: #FEF4F8; }
        .tip-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(122,58,92,0.13);
        }

        .video-card {
          background: #FFFFFF;
          border: 1.5px solid #F0D8E8;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(122,58,92,0.08);
        }
      `}</style>

      <div style={containerStyle}>
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Decorative blobs */}
        <div style={blobTR} />
        <div style={blobBL} />

        {/* Scrollable content */}
        <div className="tips-scroll" style={scrollStyle}>
          <div style={pageContainer}>

            {/* Page title */}
            <div>
              <h2 style={pageTitleStyle}>Safety & Self-Protection Guide</h2>
              <div style={gradientBar} />
              <p style={pageSubStyle}>Empower yourself with awareness, preparation, and confidence.</p>
            </div>

            {/* Urgent banner */}
            <div style={urgentBanner}>
              <div style={urgentCircle} />
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "13px" }}>
                <div style={pulseDot} />
                <span style={{ fontSize: "15px", fontWeight: 800, color: "#fff", fontFamily: "'Nunito', sans-serif" }}>
                  If You Feel Unsafe Right Now
                </span>
              </div>
              <ul style={urgentList}>
                {[
                  "Move to a well-lit or crowded place immediately.",
                  "Call emergency services or use SOS feature.",
                  "Share your live location with trusted contacts.",
                  "Stay on call with someone until you're safe.",
                ].map((item, i) => (
                  <li key={i} style={urgentItem}>
                    <span style={urgentDot} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Daily Habits */}
            <SectionLabel label="Daily Habits" />
            <div className="tip-card">
              <TipList items={[
                { icon: "☀️", text: "Stay alert in public spaces at all times." },
                { icon: "🌙", text: "Avoid isolated areas especially after dark." },
                { icon: "💡", text: "Trust your instincts — they are powerful." },
                { icon: "📞", text: "Keep emergency numbers easily accessible." },
                { icon: "👥", text: "Inform someone when traveling alone." },
              ]} />
            </div>

            {/* Travel Safety */}
            <SectionLabel label="Travel & Commute" />
            <div className="tip-card" style={{ background: "#FEF4F8" }}>
              <TipList items={[
                { icon: "🚗", text: "Verify ride details before entering any vehicle." },
                { icon: "📍", text: "Share trip details with family or friends." },
                { icon: "🚌", text: "Sit near driver or exit points on public transport." },
                { icon: "🤫", text: "Avoid sharing personal details with strangers." },
              ]} />
            </div>

            {/* Online Safety */}
            <SectionLabel label="Online & Digital Safety" />
            <div className="tip-card">
              <TipList items={[
                { icon: "🔒", text: "Never share OTPs or sensitive information." },
                { icon: "🔑", text: "Use strong passwords & enable two-factor authentication." },
                { icon: "📵", text: "Avoid posting your real-time location publicly." },
                { icon: "🚨", text: "Report online harassment immediately." },
              ]} />
            </div>

            {/* Self Defense */}
            <SectionLabel label="Self-Defense Mindset" />
            <div className="tip-card" style={{ background: "#FEF4F8" }}>
              <TipList items={[
                { icon: "💪", text: "Confidence alone can deter potential attackers." },
                { icon: "👁️", text: "Maintain strong posture and steady eye contact." },
                { icon: "📣", text: "Use your voice — shout loudly if necessary." },
                { icon: "🥋", text: "Target vulnerable areas if physically attacked (eyes, nose, knees)." },
              ]} />
            </div>

            {/* Do's & Don'ts */}
            <SectionLabel label="Do's & Don'ts" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div style={doCard}>
                <div style={doLabel}>✔ Do</div>
                <ul style={miniList}>
                  {["Plan routes before leaving.", "Keep your phone charged.", "Stay connected with trusted people.", "Be aware of your surroundings."].map((t, i) => (
                    <li key={i} style={miniItem}>{t}</li>
                  ))}
                </ul>
              </div>
              <div style={dontCard}>
                <div style={dontLabel}>✖ Don't</div>
                <ul style={miniList}>
                  {["Ignore red flags or gut feelings.", "Walk distracted in new places.", "Share too much info publicly.", "Travel without telling anyone."].map((t, i) => (
                    <li key={i} style={miniItem}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Closing card */}
            <div style={closingCard}>
              <div style={closingTitle}>🌸 Remember</div>
              <p style={closingText}>
                Safety is not about fear — it's about awareness and preparation.
                You deserve to move freely, confidently, and securely.
                Stay informed. Stay prepared. Stay empowered.
              </p>
            </div>

            {/* Video tutorials */}
            <SectionLabel label="Self-Defense Video Tutorials" />
            <p style={{ margin: "-8px 0 4px", fontSize: "13px", fontWeight: 700, color: "#9B5B7A", fontFamily: "'Nunito', sans-serif" }}>
              Watch and learn practical self-defense techniques.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { url: "https://www.youtube.com/embed/jAh0cU1J5zk", title: "Self Defense Technique 1" },
                { url: "https://www.youtube.com/embed/KVpxP3ZZtAc", title: "Self Defense Technique 2" },
                { url: "https://www.youtube.com/embed/jq7yqox1D5w", title: "Self Defense Technique 3" },
                { url: "https://www.youtube.com/embed/Hq6pDOzvjmI", title: "Self Defense Technique 4" },
                { url: "https://www.youtube.com/embed/M4_8PoRQP8w", title: "Self Defense Technique 5" },
              ].map((video, i) => (
                <div key={i} className="video-card">
                  <iframe
                    width="100%"
                    height="200"
                    src={video.url}
                    title={video.title}
                    frameBorder="0"
                    allowFullScreen
                    style={{ display: "block" }}
                  />
                  <div style={videoTitle}>{video.title}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

/* ── Sub-components ── */

function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <span style={{
        background: "#EDD0E0", color: "#7A2E56",
        fontFamily: "'Nunito', sans-serif",
        fontSize: "10px", fontWeight: 800,
        padding: "4px 12px", borderRadius: "20px",
        letterSpacing: "0.6px", textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: "1px", background: "#E8C8D8" }} />
    </div>
  );
}

function TipList({ items }: { items: { icon: string; text: string }[] }) {
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13px", color: "#3D1A2E", fontWeight: 700, lineHeight: 1.5, fontFamily: "'Nunito', sans-serif" }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "50%",
            background: "#F2D6E8",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "13px", flexShrink: 0,
          }}>
            {item.icon}
          </div>
          {item.text}
        </li>
      ))}
    </ul>
  );
}

/* ── Styles ── */

const containerStyle: React.CSSProperties = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  background: "#FAF0F5",
  position: "relative",
  overflow: "hidden",
  fontFamily: "'Nunito', sans-serif",
};

const blobTR: React.CSSProperties = {
  position: "absolute",
  top: "-60px", right: "-60px",
  width: "220px", height: "220px",
  borderRadius: "50%",
  background: "rgba(201,122,155,0.13)",
  pointerEvents: "none", zIndex: 0,
};

const blobBL: React.CSSProperties = {
  position: "absolute",
  bottom: "80px", left: "-80px",
  width: "260px", height: "260px",
  borderRadius: "50%",
  background: "rgba(139,34,82,0.07)",
  pointerEvents: "none", zIndex: 0,
};

const scrollStyle: React.CSSProperties = {
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
  gap: "16px",
};

const pageTitleStyle: React.CSSProperties = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: "26px",
  color: "#3D1A2E",
  lineHeight: 1.2,
  margin: "0 0 6px 0",
};

const gradientBar: React.CSSProperties = {
  width: "48px", height: "3px",
  borderRadius: "2px",
  background: "linear-gradient(90deg, #C97A9B, #8B2252)",
  marginBottom: "6px",
};

const pageSubStyle: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "13px", fontWeight: 700,
  color: "#9B5B7A", margin: 0,
};

const urgentBanner: React.CSSProperties = {
  background: "linear-gradient(135deg, #8B2252 0%, #C0476E 100%)",
  borderRadius: "20px",
  padding: "18px",
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 6px 20px rgba(139,34,82,0.28)",
};

const urgentCircle: React.CSSProperties = {
  position: "absolute", top: "-24px", right: "-20px",
  width: "90px", height: "90px", borderRadius: "50%",
  background: "rgba(255,255,255,0.07)",
  pointerEvents: "none",
};

const pulseDot: React.CSSProperties = {
  width: "10px", height: "10px", borderRadius: "50%",
  background: "#FFD6E0",
  animation: "pulse 1.5s infinite",
  flexShrink: 0,
};

const urgentList: React.CSSProperties = {
  listStyle: "none", margin: 0, padding: 0,
  display: "flex", flexDirection: "column", gap: "8px",
};

const urgentItem: React.CSSProperties = {
  display: "flex", alignItems: "flex-start", gap: "10px",
  fontSize: "13px", color: "rgba(255,255,255,0.92)",
  fontWeight: 700, lineHeight: 1.45,
  fontFamily: "'Nunito', sans-serif",
};

const urgentDot: React.CSSProperties = {
  width: "6px", height: "6px", borderRadius: "50%",
  background: "#FFB3C6", marginTop: "5px",
  flexShrink: 0, display: "inline-block",
};

const doCard: React.CSSProperties = {
  background: "#EBF8F1",
  borderRadius: "16px",
  padding: "14px 12px",
  border: "1.5px solid #C3E8D5",
};

const dontCard: React.CSSProperties = {
  background: "#FEF0F3",
  borderRadius: "16px",
  padding: "14px 12px",
  border: "1.5px solid #F5C6D2",
};

const doLabel: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "11px", fontWeight: 800,
  color: "#1A7A4A",
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  marginBottom: "9px",
};

const dontLabel: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "11px", fontWeight: 800,
  color: "#A02040",
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  marginBottom: "9px",
};

const miniList: React.CSSProperties = {
  listStyle: "none", margin: 0, padding: 0,
  display: "flex", flexDirection: "column", gap: "6px",
};

const miniItem: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "12px", fontWeight: 700,
  color: "#3D1A2E", lineHeight: 1.4,
};

const closingCard: React.CSSProperties = {
  background: "linear-gradient(135deg, #C97A9B 0%, #8B2252 100%)",
  borderRadius: "20px",
  padding: "22px 20px",
  textAlign: "center",
};

const closingTitle: React.CSSProperties = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: "20px", color: "#fff",
  marginBottom: "10px",
};

const closingText: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "13px", fontWeight: 700,
  color: "rgba(255,255,255,0.92)",
  lineHeight: 1.75, margin: 0,
};

const videoTitle: React.CSSProperties = {
  padding: "12px 16px",
  fontFamily: "'Nunito', sans-serif",
  fontWeight: 800, fontSize: "13px",
  color: "#3D1A2E",
};

export default SafetyTips;