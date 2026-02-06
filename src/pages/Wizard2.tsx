import { useNavigate } from "react-router-dom";
import MobileLayout from "../layouts/MobileLayout";
import alertImg from "../assets/wizard2-alert.png";
import bushesImg from "../assets/wizard-bushes.png";

function Wizard2() {
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
        {/* ⬅️ Back button (top-left, subtle) */}
        <button
          onClick={() => navigate("/wizard1")}
          style={{
            position: "absolute",
            top: "20px",
            left: "16px",
            background: "transparent",
            border: "none",
            color: "#7A3A5C",
            fontSize: "16px",
            cursor: "pointer",
            zIndex: 5,
          }}
        >
        
        </button>

        {/* 📱 Phone / Alert Illustration */}
        <img
          src={alertImg}
          alt="Alert and Notify"
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
            ALERT &amp; NOTIFY
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
            Send instant alerts to your trusted contacts in case of emergency.
          </p>

          {/* Pagination Dots */}
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
                background: "#2E1A22", // active
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
              onClick={() => navigate("/wizard1")}
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
              onClick={() => navigate("/wizard3")}
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
              Next
            </button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

export default Wizard2;
