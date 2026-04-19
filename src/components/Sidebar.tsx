import { Link, useLocation } from "react-router-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const navItems = [
  { name: "Home",                path: "/home",            icon: "🏠" },
  { name: "Dashboard",           path: "/dashboard",       icon: "📊" },
  { name: "Manage Guardians",    path: "/manage-guardian", icon: "👥" },
  { name: "Manage Unsafe Zones", path: "/unsafe-zones",    icon: "📍" },
  { name: "Women's Law",         path: "/womens-law",      icon: "⚖️" },
  { name: "Safety Tips",         path: "/safety-tips",     icon: "🛡️" },
  { name: "Settings",            path: "/settings",        icon: "⚙️" },
  { name: "About Us",            path: "/about",           icon: "🌸" },
];

function Sidebar({ isOpen, onClose }: Props) {
  const location = useLocation();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=DM+Serif+Display&display=swap');

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          font-family: 'Nunito', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #7A2E56;
          padding: 11px 14px;
          border-radius: 14px;
          transition: background 0.15s ease, color 0.15s ease, transform 0.15s ease;
          position: relative;
        }

        .sidebar-link:hover {
          background: #F8E8F1;
          transform: translateX(3px);
        }

        .sidebar-link.active {
          background: linear-gradient(135deg, rgba(139,34,82,0.12), rgba(192,71,110,0.08));
          color: #8B2252;
        }

        .sidebar-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 20%;
          height: 60%;
          width: 3px;
          border-radius: 0 3px 3px 0;
          background: linear-gradient(180deg, #8B2252, #C0476E);
        }

        .sidebar-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: #F2D6E8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          flex-shrink: 0;
          transition: background 0.15s ease;
        }

        .sidebar-link.active .sidebar-icon {
          background: linear-gradient(135deg, #8B2252, #C0476E);
        }

        .sidebar-link:nth-child(1)  { animation: slideIn 0.3s ease both; animation-delay: 0.05s; }
        .sidebar-link:nth-child(2)  { animation: slideIn 0.3s ease both; animation-delay: 0.10s; }
        .sidebar-link:nth-child(3)  { animation: slideIn 0.3s ease both; animation-delay: 0.15s; }
        .sidebar-link:nth-child(4)  { animation: slideIn 0.3s ease both; animation-delay: 0.20s; }
        .sidebar-link:nth-child(5)  { animation: slideIn 0.3s ease both; animation-delay: 0.25s; }
        .sidebar-link:nth-child(6)  { animation: slideIn 0.3s ease both; animation-delay: 0.30s; }
        .sidebar-link:nth-child(7)  { animation: slideIn 0.3s ease both; animation-delay: 0.35s; }
        .sidebar-link:nth-child(8)  { animation: slideIn 0.3s ease both; animation-delay: 0.40s; }
      `}</style>

      {/* Sidebar Panel */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: isOpen ? 0 : -300,
          width: "260px",
          height: "100%",
          background: "#FAF0F5",
          boxShadow: "6px 0 32px rgba(122, 34, 82, 0.18)",
          transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 800,
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* Sidebar Header */}
        <div style={{
          background: "linear-gradient(135deg, #8B2252 0%, #C0476E 100%)",
          padding: "52px 20px 20px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Decorative circle */}
          <div style={{
            position: "absolute", top: "-30px", right: "-30px",
            width: "120px", height: "120px", borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            pointerEvents: "none",
          }} />

          {/* Avatar */}
          <div style={{
            width: "52px", height: "52px", borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            border: "2px solid rgba(255,255,255,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px",
            marginBottom: "10px",
          }}>
            🌸
          </div>

          <div style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "20px",
            color: "#fff",
            letterSpacing: "0.3px",
          }}>
            Saha
          </div>
          <div style={{
            fontSize: "12px",
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600,
            color: "rgba(255,255,255,0.75)",
            marginTop: "2px",
          }}>
            Your safety. Our priority.
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "#F0D8E8", margin: "0" }} />

        {/* Nav Links */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px 12px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}>
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                onClick={onClose}
                className={`sidebar-link${isActive ? " active" : ""}`}
              >
                <div className="sidebar-icon" style={isActive ? {
                  background: "linear-gradient(135deg, #8B2252, #C0476E)",
                } : {}}>
                  <span style={{ fontSize: "15px" }}>{item.icon}</span>
                </div>
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px 20px",
          borderTop: "1px solid #F0D8E8",
          fontFamily: "'Nunito', sans-serif",
          fontSize: "11px",
          fontWeight: 600,
          color: "#C4A0B4",
          textAlign: "center",
          letterSpacing: "0.3px",
        }}>
          Stay safe. Stay empowered. 🌸
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(61, 26, 46, 0.35)",
            zIndex: 90,
            backdropFilter: "blur(1px)",
          }}
        />
      )}
    </>
  );
}

export default Sidebar;