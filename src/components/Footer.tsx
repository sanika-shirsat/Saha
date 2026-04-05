import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer style={footer}>
      <div style={container}>
        
        <span style={brand}>SHE-SECURE</span>

        <div style={links}>
          <Link to="/about" style={linkStyle}>About</Link>
          <Link to="/helplines" style={linkStyle}>Help</Link>
          <Link to="/safety-tips" style={linkStyle}>Tips</Link>
        </div>

        <div style={social}>
          <span style={icon}>🐦</span>
          <span style={icon}>📘</span>
        </div>

      </div>
    </footer>
  );
}

export default Footer;

const footer: React.CSSProperties = {
  background: "#E9C6FF",
  borderTop: "1px solid #7A3A5C",
  padding: "10px 12px", // 🔥 reduced
};

const container: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "13px",
};

const brand = {
  fontWeight: "bold",
  color: "#7A3A5C",
};

const links = {
  display: "flex",
  gap: "10px",
};

const linkStyle = {
  textDecoration: "none",
  color: "#7A3A5C",
  fontSize: "12px",
};

const social = {
  display: "flex",
  gap: "8px",
};

const icon = {
  fontSize: "14px",
  cursor: "pointer",
};