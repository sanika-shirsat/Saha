import { useNavigate } from "react-router-dom";
import MobileLayout from "../layouts/MobileLayout";
import splashImg from "../assets/splash.png";

function Splash() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      {/* Entire splash is clickable */}
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
        }}
      >
        {/* Splash Image */}
        <img
          src={splashImg}
          alt="Saha illustration"
          style={{
            width: "285px",
            height: "336px",
            objectFit: "contain",
            marginBottom: "24px",
          }}
        />

        {/* App Name */}
        <h1
          style={{
            fontFamily: "ABeeZee, sans-serif",
            fontSize: "48px",
            color: "#2E1A22",
            WebkitTextStroke: "0.2px #7A3A5C",
            margin: 0,
          }}
        >
          Saha
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontFamily: "ABeeZee, sans-serif",
            fontSize: "24px",
            color: "#7A3A5C",
            marginTop: "12px",
          }}
        >
          Your safety. Our priority.
        </p>

        {/* Hint text for demo */}
        <p
          style={{
            marginTop: "20px",
            fontSize: "14px",
            opacity: 0.7,
          }}
        >
          Tap anywhere to continue
        </p>
      </div>
    </MobileLayout>
  );
}

export default Splash;
