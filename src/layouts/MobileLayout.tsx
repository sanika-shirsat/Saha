type Props = {
  children: React.ReactNode;
};

function MobileLayout({ children }: Props) {
  return (
    <div
      style={{
        background: "#000000", // ⬛ outside showcase bg
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 📱 Mobile Frame */}
      <div
        style={{
          width: "390px",
          height: "844px",
          background: "#E9C6FF", // 🟣 app background
          borderRadius: "24px",
          overflow: "auto",
          position: "relative",
          boxShadow: "0 0 40px rgba(0,0,0,0.8)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default MobileLayout;
