type Props = {
  children: React.ReactNode;
};

function MobileLayout({ children }: Props) {
  return (
    <div
      style={{
        background: "#000",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "390px",
          height: "844px",
          background: "#E9C6FF",
          borderRadius: "24px",
          overflow: "hidden",   // important
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