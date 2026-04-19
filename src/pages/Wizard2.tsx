import { useNavigate } from "react-router-dom";
import MobileLayout from "../layouts/MobileLayout";
import alertImg from "../assets/wizard2-alert.png";
import bushesImg from "../assets/wizard-bushes.png";

function Wizard2() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=DM+Serif+Display&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }

        .wizard2-img {
          animation: float 4s ease-in-out infinite;
        }

        .wizard2-card-content {
          animation: fadeUp 0.55s ease both;
          animation-delay: 0.15s;
        }

        .btn-next {
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .btn-next:active {
          transform: scale(0.96);
          box-shadow: 0 4px 14px rgba(139, 34, 82, 0.25);
        }

        .btn-back {
          transition: background 0.15s ease;
        }
        .btn-back:active {
          background: rgba(122, 46, 86, 0.08) !important;
        }
      `}</style>

      <div
        style={{
          position: "relative",
          width: "390px",
          height: "844px",
          background: "#FAF0F5",
          overflow: "hidden",
          fontFamily: "'Nunito', sans-serif",
        }}
      >

        {/* Background blob — top right */}
        <div style={{
          position: "absolute", top: "-60px", right: "-50px",
          width: "220px", height: "220px", borderRadius: "50%",
          background: "rgba(201, 122, 155, 0.13)",
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* Background blob — top left */}
        <div style={{
          position: "absolute", top: "60px", left: "-40px",
          width: "160px", height: "160px", borderRadius: "50%",
          background: "rgba(139, 34, 82, 0.07)",
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* Alert Illustration */}
        <img
          src={alertImg}
          alt="Alert and Notify"
          className="wizard2-img"
          style={{
            position: "absolute",
            left: "95px",
            top: "80px",
            width: "200px",
            height: "380px",
            objectFit: "contain",
            zIndex: 3,
          }}
        />

        {/* Bushes */}
        <img
          src={bushesImg}
          alt="Bushes"
          style={{
            position: "absolute",
            left: "-34px",
            top: "243px",
            width: "460px",
            height: "206px",
            zIndex: 2,
          }}
        />

        {/* Bottom Card */}
        <div
          style={{
            position: "absolute",
            left: "-1px",
            top: "502px",
            width: "390px",
            height: "364px",
            background: "#fff",
            borderTop: "1px solid #F0D8E8",
            borderTopLeftRadius: "195px",
            borderTopRightRadius: "195px",
            paddingTop: "56px",
            paddingLeft: "24px",
            paddingRight: "24px",
            boxSizing: "border-box",
            textAlign: "center",
            zIndex: 1,
            boxShadow: "0 -8px 32px rgba(122, 58, 92, 0.10)",
          }}
        >
          <div className="wizard2-card-content">

            {/* Title */}
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "34px",
                color: "#3D1A2E",
                marginBottom: "10px",
                letterSpacing: "0.5px",
              }}
            >
              Alert & Notify
            </h2>

            {/* Divider accent */}
            <div style={{
              width: "36px", height: "3px",
              background: "linear-gradient(90deg, #C97A9B, #8B2252)",
              borderRadius: "4px",
              margin: "0 auto 12px",
            }} />

            {/* Description */}
            <p
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                color: "#9B5B7A",
                marginBottom: "24px",
                lineHeight: "1.6",
                padding: "0 12px",
              }}
            >
              Send instant alerts to your trusted contacts in case of emergency.
            </p>

            {/* Pagination Dots — dot 2 active */}
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "28px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#E8C8D8" }} />
              <span style={{
                width: "28px", height: "8px", borderRadius: "4px",
                background: "linear-gradient(90deg, #8B2252, #C0476E)",
              }} />
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#E8C8D8" }} />
            </div>

            {/* Navigation Buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "0 20px" }}>
              <button
                className="btn-back"
                onClick={() => navigate("/wizard1")}
                style={{
                  padding: "12px 28px",
                  background: "transparent",
                  border: "1.5px solid #C97A9B",
                  borderRadius: "50px",
                  color: "#7A2E56",
                  fontSize: "14px",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: "0.3px",
                }}
              >
                Back
              </button>

              <button
                className="btn-next"
                onClick={() => navigate("/wizard3")}
                style={{
                  padding: "12px 32px",
                  background: "linear-gradient(135deg, #8B2252 0%, #C0476E 100%)",
                  border: "none",
                  borderRadius: "50px",
                  color: "#fff",
                  fontSize: "14px",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 800,
                  cursor: "pointer",
                  letterSpacing: "0.4px",
                  boxShadow: "0 6px 20px rgba(139, 34, 82, 0.28)",
                }}
              >
                Next →
              </button>
            </div>

          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

export default Wizard2;