import { useNavigate } from "react-router-dom";
import MobileLayout from "../layouts/MobileLayout";
import splashImg from "../assets/splash.png";

function Splash() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=DM+Serif+Display&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }

        @keyframes pulse-ring {
          0%   { transform: scale(0.92); opacity: 0.45; }
          100% { transform: scale(1.12); opacity: 0; }
        }

        .splash-image {
          animation: float 4s ease-in-out infinite;
        }

        .splash-title {
          animation: fadeUp 0.6s ease both;
          animation-delay: 0.1s;
        }

        .splash-tagline {
          animation: fadeUp 0.6s ease both;
          animation-delay: 0.25s;
        }

        .splash-hint {
          animation: fadeUp 0.6s ease both;
          animation-delay: 0.4s;
        }

        .tap-btn {
          animation: fadeUp 0.6s ease both;
          animation-delay: 0.5s;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .tap-btn:active {
          transform: scale(0.96);
          box-shadow: 0 4px 14px rgba(139, 34, 82, 0.25);
        }

        .pulse-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid #C97A9B;
          animation: pulse-ring 2s ease-out infinite;
        }
      `}</style>

      <div
        onClick={() => navigate("/wizard1")}
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          cursor: "pointer",
          background: "#FAF0F5",
          padding: "0 28px",
          position: "relative",
          overflow: "hidden",
          fontFamily: "'Nunito', sans-serif",
        }}
      >

        {/* Background blobs */}
        <div style={{
          position: "absolute", top: "-80px", right: "-60px",
          width: "240px", height: "240px", borderRadius: "50%",
          background: "rgba(201, 122, 155, 0.12)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-60px", left: "-50px",
          width: "200px", height: "200px", borderRadius: "50%",
          background: "rgba(139, 34, 82, 0.08)",
          pointerEvents: "none",
        }} />

        {/* Image with floating pulse ring */}
        <div style={{ position: "relative", marginBottom: "32px" }}>
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "300px", height: "300px",
            borderRadius: "50%",
            background: "rgba(201, 122, 155, 0.08)",
          }} />
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "300px", height: "300px",
          }}>
            <div className="pulse-ring" />
          </div>
          <img
            src={splashImg}
            alt="Saha illustration"
            className="splash-image"
            style={{
              width: "260px",
              height: "310px",
              objectFit: "contain",
              position: "relative",
              zIndex: 1,
            }}
          />
        </div>

        {/* App Name */}
        <h1
          className="splash-title"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "52px",
            color: "#3D1A2E",
            margin: 0,
            lineHeight: 1,
            letterSpacing: "1px",
          }}
        >
          Saha
        </h1>

        {/* Divider */}
        <div style={{
          width: "40px", height: "3px",
          background: "linear-gradient(90deg, #C97A9B, #8B2252)",
          borderRadius: "4px",
          margin: "14px auto 16px",
          animation: "fadeUp 0.6s ease both",
          animationDelay: "0.3s",
        }} />

        {/* Tagline */}
        <p
          className="splash-tagline"
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            color: "#9B5B7A",
            margin: 0,
            letterSpacing: "0.4px",
          }}
        >
          Your safety. Our priority.
        </p>

        {/* CTA Button */}
        <button
          className="tap-btn"
          style={{
            marginTop: "40px",
            background: "linear-gradient(135deg, #8B2252 0%, #C0476E 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "50px",
            padding: "14px 40px",
            fontSize: "15px",
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800,
            letterSpacing: "0.5px",
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(139, 34, 82, 0.30)",
          }}
        >
          Get Started
        </button>

        {/* Hint */}
        <p
          className="splash-hint"
          style={{
            marginTop: "16px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#C4A0B4",
            letterSpacing: "0.3px",
          }}
        >
          Tap anywhere to continue
        </p>

      </div>
    </MobileLayout>
  );
}

export default Splash;