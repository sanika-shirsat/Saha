import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

function About() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#E9C6FF",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div
        style={{
          padding: "80px 24px 50px 24px",
        }}
      >
        {/* Title */}
        <h2
          style={{
            fontSize: "28px",
            fontFamily: "ABeeZee, sans-serif",
            color: "#2E1A22",
            WebkitTextStroke: "0.3px #7A3A5C",
            marginBottom: "25px",
          }}
        >
          About Saha
        </h2>

        {/* Content Card */}
        <div
          style={{
            background: "#F4F0F3",
            border: "2px solid #7A3A5C",
            borderRadius: "22px",
            padding: "28px",
            lineHeight: "1.8",
            fontSize: "17px",
            color: "#2E1A22",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ marginBottom: "18px" }}>
            <strong style={{ fontSize: "19px" }}>Saha</strong> is a women-centric
            safety platform designed to provide quick, reliable support when it
            matters most. Whether you’re commuting, traveling alone, or simply
            stepping out, Saha helps you stay aware, connected, and protected.
          </p>

          <p style={{ marginBottom: "18px" }}>
            With just a single tap, Saha allows you to send SOS alerts, share
            your live location, and instantly notify your trusted guardians
            during emergencies.
          </p>

          <p style={{ marginBottom: "30px" }}>
            Our goal is to make safety simple, accessible, and always within
            reach — so you can move freely with confidence.
          </p>

          {/* Divider */}
          <div
            style={{
              height: "2px",
              background: "#7A3A5C",
              opacity: 0.3,
              marginBottom: "25px",
              borderRadius: "4px",
            }}
          />

          {/* Features Section */}
          <h3
            style={{
              fontSize: "20px",
              color: "#7A3A5C",
              marginBottom: "18px",
            }}
          >
            ✨ What Saha Offers
          </h3>

          <FeatureItem
            icon="🔴"
            title="One-Tap SOS"
            desc="Instantly alert your guardians with your live location."
          />

          <FeatureItem
            icon="📍"
            title="Live Location Sharing"
            desc="Share your real-time location for daily safety or emergencies."
          />

          <FeatureItem
            icon="👥"
            title="Guardian Management"
            desc="Add and manage trusted contacts effortlessly."
          />

          <FeatureItem
            icon="🛡️"
            title="Safety Resources"
            desc="Access safety tips, women’s laws, and emergency helplines in one place."
          />

          <FeatureItem
            icon="🚨"
            title="Offline Support"
            desc="Send emergency alerts even when internet access is unavailable."
          />

          {/* Divider */}
          <div
            style={{
              height: "2px",
              background: "#7A3A5C",
              opacity: 0.3,
              margin: "30px 0 20px 0",
              borderRadius: "4px",
            }}
          />

          {/* Promise Section */}
          <h3
            style={{
              fontSize: "20px",
              color: "#7A3A5C",
              marginBottom: "14px",
            }}
          >
            🌸 Our Promise
          </h3>

          <p style={{ fontSize: "17px", lineHeight: "1.8" }}>
            At Saha, your safety is our priority. We are committed to building
            a platform that is trustworthy, responsive, and empowering —
            because every woman deserves to feel safe, anytime and anywhere.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;

/* ================= Feature Component ================= */

function FeatureItem({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div
      style={{
        marginBottom: "18px",
        padding: "14px 16px",
        background: "#EAD3DB",
        borderRadius: "14px",
      }}
    >
      <div style={{ fontSize: "18px", fontWeight: 600 }}>
        {icon} {title}
      </div>
      <div style={{ fontSize: "16px", marginTop: "6px" }}>{desc}</div>
    </div>
  );
}
