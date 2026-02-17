import { Link } from "react-router-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

function Sidebar({ isOpen, onClose }: Props) {
  return (
    <>
      {/* Sidebar Panel */}
      <div
        style={{
          position: "absolute",   // 🔥 IMPORTANT
          top: 0,
          left: isOpen ? 0 : -300,
          width: "240px",
          height: "100%",
          background: "#F2E6EF",
          boxShadow: "4px 0 20px rgba(0,0,0,0.25)",
          transition: "left 0.3s ease",
          zIndex: 100,
          paddingTop: "90px",
          paddingLeft: "20px",
          paddingRight: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        {[
          { name: "Home", path: "/home" },
          { name: "Manage Guardians", path: "/manage-guardian" },
          { name: "Manage Safe Zones", path: "/manage-safezones" },
          { name: "Women’s Law", path: "/womens-law" },
          { name: "Safety Tips", path: "/safety-tips" },
          { name: "Settings", path: "/settings" },
          { name: "About Us", path: "/about" },
          { name: "Settings", path: "/settings" },

          

        ].map((item, index) => (
          <Link
            key={index}
            to={item.path}
            onClick={onClose}
            style={{
              textDecoration: "none",
              fontFamily: "Poppins, sans-serif",
              fontSize: "16px",
              color: "#7A3A5C",
              fontWeight: 500,
              paddingBottom: "8px",
              borderBottom: "1px solid #EAD3DB",
            }}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Overlay INSIDE PHONE */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "absolute",   // 🔥 IMPORTANT
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.3)",
            zIndex: 90,
          }}
        />
      )}
    </>
  );
}

export default Sidebar;
