import { useNavigate } from "react-router-dom";
import MobileLayout from "../layouts/MobileLayout";
import ladyImg from "../assets/wizard3-lady.png"; // 👩 new illustration
import bushesImg from "../assets/wizard-bushes.png";

function Wizard3() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      {/* Frame-relative container */}
      <div
        style={{
          position: "relative",
          width: "390px",
          height: "844px",
          background: "#E9C6FF",
        }}
      >
        {/* 👩 Lady Illustration */}
        <img
          src={ladyImg}
          alt="Secure Check-in"
          style={{
            position: "absolute",
            top: "70px",
            width: "363px",
            height: "420px",
            objectFit: "contain",
            zIndex: 3,
          }}
        />

        

        {/* 🟤 Bottom Semicircle Card */}
        <div
          style={{
            position: "absolute",
            left: "-1px",
            top: "502px",
            width: "390px",
            height: "364px",
            background: "#D9ABB9",
            border: "2px solid #D8A1B2",
            borderTopLeftRadius: "195px",
            borderTopRightRadius: "195px",
            paddingTop: "56px",
            paddingLeft: "24px",
            paddingRight: "24px",
            boxSizing: "border-box",
            textAlign: "center",
            zIndex: 1,
          }}
        >
          {/* Title */}
          <h2
            style={{
              fontFamily: "ABeeZee, sans-serif",
              fontSize: "36px",
              color: "#2E1A22",
              WebkitTextStroke: "0.2px #7A3A5C",
              marginBottom: "12px",
            }}
          >
            SECURE CHECK-IN
          </h2>

          {/* Description */}
          <p
            style={{
              fontFamily: "ABeeZee, sans-serif",
              fontSize: "18px",
              color: "#7A3A5C",
              marginBottom: "24px",
            }}
          >
            Quickly let your loved ones know that you’re safe.
          </p>

          {/* Pagination Dots (3rd active) */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <span
              style={{
                width: "19px",
                height: "19px",
                borderRadius: "50%",
                background: "#9B8B8B",
              }}
            />
            <span
              style={{
                width: "19px",
                height: "19px",
                borderRadius: "50%",
                background: "#9B8B8B",
              }}
            />
            <span
              style={{
                width: "19px",
                height: "19px",
                borderRadius: "50%",
                background: "#2E1A22", // ✅ active (3rd)
              }}
            />
          </div>

          {/* ⬅️➡️ Navigation Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0 24px",
            }}
          >
            <button
              onClick={() => navigate("/wizard2")}
              style={{
                padding: "10px 24px",
                background: "transparent",
                border: "2px solid #7A3A5C",
                borderRadius: "24px",
                color: "#7A3A5C",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Back
            </button>

            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "10px 24px",
                background: "#7A3A5C",
                border: "none",
                borderRadius: "24px",
                color: "#FFFFFF",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

export default Wizard3;
