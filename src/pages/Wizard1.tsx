import { useNavigate } from "react-router-dom";
import MobileLayout from "../layouts/MobileLayout";
import ladyImg from "../assets/wizard1-lady.png";
import bushesImg from "../assets/wizard-bushes.png";

function Wizard1() {
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
          alt="Safe Zone Lady"
          style={{
            position: "absolute",
            left: "68px",
            top: "41px",
            width: "250px",
            height: "424px",
            objectFit: "contain",
            zIndex: 3,
          }}
        />

        {/* 🌿 Bushes */}
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
            SAFE ZONE
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
            Stay aware and connected wherever you go.
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
                background: "#2E1A22",
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
                background: "#9B8B8B",
              }}
            />
          </div>

          {/* ⬅️➡️ Navigation Buttons (same as Wizard2) */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0 24px",
            }}
          >
            <button
              onClick={() => navigate("/")}
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
              onClick={() => navigate("/wizard2")}
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

export default Wizard1;
