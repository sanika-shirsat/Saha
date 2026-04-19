import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { icon: "🏠", label: "Home",      path: "/home" },
  { icon: "📊", label: "Dashboard", path: "/dashboard" },
  { icon: "🛡️", label: "Safety",   path: "/safety-tips" },
  { icon: "👥", label: "Guardians", path: "/manage-guardian" },
  { icon: "⚙️", label: "Settings",  path: "/settings" },
];

function Footer() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div style={footerStyle}>
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={btnStyle}
          >
            <span style={{ fontSize: "20px" }}>{item.icon}</span>
            <span style={{ ...labelStyle, color: isActive ? "#fff" : "rgba(255,255,255,0.55)" }}>
              {item.label}
            </span>
            {isActive && <div style={activeDot} />}
          </button>
        );
      })}
    </div>
  );
}

export default Footer;

const footerStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #8B2252, #C0476E)",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  padding: "10px 0 16px",
  flexShrink: 0,
  boxShadow: "0 -2px 16px rgba(139,34,82,0.22)",
};

const btnStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "3px",
  background: "none",
  border: "none",
  cursor: "pointer",
  position: "relative",
  padding: "0 6px",
  WebkitTapHighlightColor: "transparent",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: "10px",
  fontWeight: 800,
  letterSpacing: "0.2px",
};

const activeDot: React.CSSProperties = {
  position: "absolute",
  top: "-10px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "24px",
  height: "3px",
  background: "#FFD6E0",
  borderRadius: "0 0 4px 4px",
};