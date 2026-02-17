import contactsIcon from "../assets/fakecall/incall/contacts.png";

type Props = {
  onMenuClick: () => void;
};

function Header({ onMenuClick }: Props) {
  return (
    <div
      style={{
        width: "100%",
        height: "70px",
        background: "#D8A1B2",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        boxSizing: "border-box",
        position: "relative",
        zIndex: 1000,
      }}
    >
      {/* Hamburger */}
      <div
        onClick={onMenuClick}
        style={{
          fontSize: "22px",
          cursor: "pointer",
          userSelect: "none",
          color: "#2E1A22",
        }}
      >
        ☰
      </div>

      {/* Logo */}
      <h2
        style={{
          fontFamily: "ABeeZee, sans-serif",
          color: "#2E1A22",
          WebkitTextStroke: "0.2px #7A3A5C",
          margin: 0,
        }}
      >
        Saha
      </h2>

      {/* Profile Circle */}
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: "rgba(233, 198, 255, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={contactsIcon}
          alt="Profile"
          style={{
            width: "20px",
            height: "20px",
            objectFit: "contain",
          }}
        />
      </div>
    </div>
  );
}

export default Header;
