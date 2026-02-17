import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function SafetyTips() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#E9C6FF",
        fontFamily: "Poppins, sans-serif"
      }}
    >
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div style={{ padding: "80px 24px 60px 24px" }}>

        {/* PAGE TITLE */}
        <h2
          style={{
            fontFamily: "ABeeZee, sans-serif",
            fontSize: "30px",
            color: "#2E1A22",
            WebkitTextStroke: "0.3px #7A3A5C",
            marginBottom: "8px"
          }}
        >
          Safety & Self-Protection Guide
        </h2>

        <p style={{ color: "#7A3A5C", fontSize: "16px", marginBottom: "35px" }}>
          Empower yourself with awareness, preparation, and confidence.
        </p>

        {/* QUICK ACTION BOX */}
        <div style={highlightBox}>
          <h3 style={sectionTitle}>🚨 If You Feel Unsafe Right Now</h3>
          <ul style={listStyle}>
            <li>Move to a well-lit or crowded place immediately.</li>
            <li>Call emergency services or use SOS feature.</li>
            <li>Share your live location with trusted contacts.</li>
            <li>Stay on call with someone until safe.</li>
          </ul>
        </div>

        {/* DAILY SAFETY */}
        <h3 style={sectionTitle}>🌤 Daily Safety Habits</h3>
        <div style={cardBox}>
          <ul style={listStyle}>
            <li>Stay alert in public spaces.</li>
            <li>Avoid isolated areas at night.</li>
            <li>Trust your instincts — they are powerful.</li>
            <li>Keep emergency numbers saved.</li>
            <li>Inform someone when traveling alone.</li>
          </ul>
        </div>

        {/* TRAVEL SAFETY */}
        <h3 style={sectionTitle}>🚗 Travel & Commute Safety</h3>
        <div style={cardBox}>
          <ul style={listStyle}>
            <li>Verify ride details before entering vehicles.</li>
            <li>Share trip details with guardians.</li>
            <li>Sit near driver or exit points in public transport.</li>
            <li>Avoid revealing personal details to strangers.</li>
          </ul>
        </div>

        {/* ONLINE SAFETY */}
        <h3 style={sectionTitle}>🌐 Online & Digital Safety</h3>
        <div style={cardBox}>
          <ul style={listStyle}>
            <li>Never share OTPs or sensitive information.</li>
            <li>Use strong passwords & enable two-factor authentication.</li>
            <li>Avoid posting real-time location publicly.</li>
            <li>Report harassment immediately.</li>
          </ul>
        </div>

        {/* SELF DEFENSE MINDSET */}
        <h3 style={sectionTitle}>🥋 Self-Defense Mindset</h3>
        <div style={cardBox}>
          <ul style={listStyle}>
            <li>Confidence can deter attackers.</li>
            <li>Maintain strong posture and eye contact.</li>
            <li>Use your voice — shout if necessary.</li>
            <li>Target vulnerable areas if attacked (eyes, nose, knees).</li>
          </ul>
        </div>

        {/* DO'S AND DON'TS */}
        <h3 style={sectionTitle}>⚖️ Do’s & Don’ts</h3>
        <div style={cardBox}>
          <strong>✔ Do:</strong>
          <ul style={listStyle}>
            <li>Plan routes before leaving.</li>
            <li>Keep phone charged.</li>
            <li>Stay connected with trusted people.</li>
          </ul>

          <strong>❌ Don’t:</strong>
          <ul style={listStyle}>
            <li>Ignore red flags.</li>
            <li>Walk distracted in unfamiliar places.</li>
            <li>Share too much personal info publicly.</li>
          </ul>
        </div>

        {/* CONFIDENCE SECTION */}
        <div style={{ ...highlightBox, marginTop: "40px" }}>
          <h3 style={sectionTitle}>🌸 Remember</h3>
          <p style={{ fontSize: "18px", lineHeight: "1.7" }}>
            Safety is not about fear — it’s about awareness and preparation.
            You deserve to move freely, confidently, and securely.
            Stay informed. Stay prepared. Stay empowered.
          </p>
        </div>
        {/* ================= SELF DEFENSE VIDEOS ================= */}
<h3 style={{ ...sectionTitle, marginTop: "50px" }}>
  🎥 Self-Defense Video Tutorials
</h3>

<p style={{ marginBottom: "20px", fontSize: "16px", color: "#5A3E47" }}>
  Watch and learn practical self-defense techniques that can help you react confidently in emergencies.
</p>

<div
  style={{
    display: "grid",
    gap: "25px"
  }}
>
  {[
    "https://www.youtube.com/embed/jAh0cU1J5zk",
    "https://www.youtube.com/embed/KVpxP3ZZtAc",
    "https://www.youtube.com/embed/jq7yqox1D5w",
    "https://www.youtube.com/embed/Hq6pDOzvjmI",
    "https://www.youtube.com/embed/M4_8PoRQP8w"
  ].map((video, index) => (
    <div
      key={index}
      style={{
        background: "#D9D9D9",
        borderRadius: "20px",
        border: "2px solid #7A3A5C",
        overflow: "hidden",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
      }}
    >
      <iframe
        width="100%"
        height="220"
        src={video}
        title={`Self Defense Video ${index + 1}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

      <div
        style={{
          padding: "12px 16px",
          fontWeight: 600,
          color: "#2E1A22",
          fontSize: "15px"
        }}
      >
        Self Defense Technique {index + 1}
      </div>
    </div>
  ))}
</div>


      </div>
    </div>
  );
}

export default SafetyTips;


/* ================= STYLES ================= */

const sectionTitle = {
  fontSize: "22px",
  color: "#7A3A5C",
  marginTop: "30px",
  marginBottom: "15px"
};

const cardBox = {
  background: "#D9D9D9",
  border: "2px solid #7A3A5C",
  borderRadius: "18px",
  padding: "20px",
  fontSize: "17px",
  lineHeight: "1.8",
  color: "#2E1A22",
  boxShadow: "0 6px 18px rgba(0,0,0,0.1)"
};

const highlightBox = {
  background: "#F2E6EF",
  border: "2px solid #7A3A5C",
  borderRadius: "20px",
  padding: "25px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
};

const listStyle = {
  paddingLeft: "20px",
  marginTop: "10px"
};
