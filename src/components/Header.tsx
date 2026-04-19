import contactsIcon from "../assets/fakecall/incall/contacts.png";
import { useNavigate } from "react-router-dom";

type Props = {
  onMenuClick: () => void;
};

function Header({ onMenuClick }: Props) {
   const navigate = useNavigate(); 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Nunito:wght@700;800&display=swap');

        .header-menu-btn {
          transition: background 0.15s ease;
          border-radius: 10px;
          padding: 6px;
        }
        .header-menu-btn:active {
          background: rgba(255, 255, 255, 0.2);
        }

        .header-profile {
          transition: transform 0.15s ease;
        }
        .header-profile:active {
          transform: scale(0.92);
        }
      `}</style>

      <div
        style={{
          width: "100%",
          height: "64px",
          background: "linear-gradient(135deg, #8B2252 0%, #C0476E 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 1000,
          boxShadow: "0 2px 16px rgba(139, 34, 82, 0.22)",
        }}
      >
        {/* Hamburger */}
        <div
          onClick={onMenuClick}
          className="header-menu-btn"
          style={{ cursor: "pointer", userSelect: "none" }}
        >
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
            <rect width="22" height="2.5" rx="1.25" fill="rgba(255,255,255,0.9)" />
            <rect y="6.75" width="16" height="2.5" rx="1.25" fill="rgba(255,255,255,0.9)" />
            <rect y="13.5" width="10" height="2.5" rx="1.25" fill="rgba(255,255,255,0.9)" />
          </svg>
        </div>

        {/* Logo */}
        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "24px",
            color: "#fff",
            margin: 0,
            letterSpacing: "0.5px",
          }}
        >
          Saha
        </h2>

        {/* Profile Circle */}
              <div
        className="header-profile"
        onClick={() => navigate("/profile")}
        style={{
          width: "38px",
          height: "38px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.2)",
          border: "1.5px solid rgba(255,255,255,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
>
          <img
            src={contactsIcon}
            alt="Profile"
            style={{
              width: "20px",
              height: "20px",
              objectFit: "contain",
              filter: "brightness(0) invert(1)",
              opacity: 0.9,
            }}
          />
        </div>
      </div>
    </>
  );
}

export default Header;