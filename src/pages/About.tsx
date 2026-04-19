import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import MobileLayout from "../layouts/MobileLayout";

function About() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <MobileLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Nunito:wght@700;800&display=swap');

        .about-scroll::-webkit-scrollbar { display: none; }
        .about-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        .feat-card {
          background: #FEF4F8;
          border: 1.5px solid #F0D8E8;
          border-radius: 16px;
          padding: 14px 16px;
          margin-bottom: 10px;
          display: flex;
          align-items: flex-start;
          gap: 13px;
          box-shadow: 0 4px 16px rgba(122,58,92,0.08);
        }
        .feat-card:nth-child(odd) { background: #FFFFFF; }
      `}</style>

      <div style={containerStyle}>
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Decorative blobs */}
        <div style={blobTopRight} />
        <div style={blobBottomLeft} />

        {/* ── Scrollable content ── */}
        <div className="about-scroll" style={scrollStyle}>
          <div style={pageContainer}>

            {/* Page title */}
            <div>
              <h2 style={pageTitleStyle}>About Saha</h2>
              <div style={gradientBar} />
              <p style={pageSubtitleStyle}>Empowering women, one tap at a time.</p>
            </div>

            {/* Intro card */}
            <div style={introCard}>
              <p style={introPara}>
                <strong style={{ color: "#3D1A2E" }}>Saha</strong> is a women-centric
                safety platform designed to provide quick, reliable support when it
                matters most. Whether you're commuting, traveling alone, or simply
                stepping out, Saha helps you stay aware, connected, and protected.
              </p>
              <p style={introPara}>
                With just a single tap, Saha allows you to send SOS alerts, share
                your live location, and instantly notify your trusted guardians
                during emergencies.
              </p>
              <p style={{ ...introPara, marginBottom: 0 }}>
                Our goal is to make safety simple, accessible, and always within
                reach — so you can move freely with confidence.
              </p>
            </div>

            {/* Section: What Saha Offers */}
            <div style={sectionRow}>
              <span style={sectionPill}>What We Offer</span>
              <div style={sectionLine} />
            </div>

            <div>
              <FeatureItem icon="🔴" title="One-Tap SOS"         desc="Instantly alert your guardians with your live location." />
              <FeatureItem icon="📍" title="Live Location Sharing" desc="Share your real-time location for daily safety or emergencies." />
              <FeatureItem icon="👥" title="Guardian Management"  desc="Add and manage trusted contacts effortlessly." />
              <FeatureItem icon="🛡️" title="Safety Resources"     desc="Access safety tips, women's laws, and emergency helplines in one place." />
              <FeatureItem icon="🚨" title="Offline Support"      desc="Send emergency alerts even when internet access is unavailable." />
            </div>

            {/* Section: Our Promise */}
            <div style={sectionRow}>
              <span style={sectionPill}>Our Promise</span>
              <div style={sectionLine} />
            </div>

            <div style={promiseCard}>
              <div style={promiseTitle}>🌸 Every Woman Deserves Safety</div>
              <p style={promiseText}>
                At Saha, your safety is our priority. We are committed to building
                a platform that is trustworthy, responsive, and empowering —
                because every woman deserves to feel safe, anytime and anywhere.
              </p>
            </div>

          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

export default About;

/* ── Feature Item ── */

function FeatureItem({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="feat-card">
      <div style={iconBadge}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={featTitle}>{title}</div>
        <div style={featDesc}>{desc}</div>
      </div>
    </div>
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
};

const blobTopRight: React.CSSProperties = {
  position: "absolute",
  top: "-60px",
  right: "-60px",
  width: "220px",
  height: "220px",
  borderRadius: "50%",
  background: "rgba(201,122,155,0.13)",
  pointerEvents: "none",
  zIndex: 0,
};

const blobBottomLeft: React.CSSProperties = {
  position: "absolute",
  bottom: "80px",
  left: "-80px",
  width: "260px",
  height: "260px",
  borderRadius: "50%",
  background: "rgba(139,34,82,0.07)",
  pointerEvents: "none",
  zIndex: 0,
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
  gap: "20px",
};

const pageTitleStyle: React.CSSProperties = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: "26px",
  color: "#3D1A2E",
  lineHeight: 1.2,
  margin: "0 0 6px 0",
};

const gradientBar: React.CSSProperties = {
  width: "48px",
  height: "3px",
  borderRadius: "2px",
  background: "linear-gradient(90deg, #C97A9B, #8B2252)",
  marginBottom: "6px",
};

const pageSubtitleStyle: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "13px",
  fontWeight: 700,
  color: "#9B5B7A",
  margin: 0,
};

const introCard: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1.5px solid #F0D8E8",
  borderRadius: "20px",
  padding: "20px",
  boxShadow: "0 4px 16px rgba(122,58,92,0.08)",
};

const introPara: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "13px",
  fontWeight: 700,
  color: "#3D1A2E",
  lineHeight: 1.75,
  margin: "0 0 14px 0",
};

const sectionRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  margin: "4px 0 2px",
};

const sectionPill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  background: "#EDD0E0",
  color: "#7A2E56",
  fontFamily: "'Nunito', sans-serif",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.6px",
  padding: "4px 12px",
  borderRadius: "20px",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
};

const sectionLine: React.CSSProperties = {
  flex: 1,
  height: "1px",
  background: "#E8C8D8",
};

const iconBadge: React.CSSProperties = {
  width: "40px",
  height: "40px",
  borderRadius: "12px",
  background: "#F2D6E8",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px",
  flexShrink: 0,
};

const featTitle: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "14px",
  fontWeight: 800,
  color: "#3D1A2E",
  marginBottom: "4px",
};

const featDesc: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "12px",
  fontWeight: 700,
  color: "#9B5B7A",
  lineHeight: 1.55,
};

const promiseCard: React.CSSProperties = {
  background: "linear-gradient(135deg, #C97A9B 0%, #8B2252 100%)",
  borderRadius: "20px",
  padding: "22px 20px",
  textAlign: "center",
};

const promiseTitle: React.CSSProperties = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: "20px",
  color: "#fff",
  marginBottom: "10px",
};

const promiseText: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "13px",
  fontWeight: 700,
  color: "rgba(255,255,255,0.92)",
  lineHeight: 1.75,
  margin: 0,
};